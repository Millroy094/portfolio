"use server";

import { decode } from "he";

export type MediumPostMeta = {
  title: string;
  description: string;
  imageUrl: string;
  publishedAt: string;
};

function extractMetaContent(html: string, key: string): string {
  const attrPattern = `(?:property|name)=["']${key}["']`;
  const contentFirst = new RegExp(
    `<meta[^>]*${attrPattern}[^>]*content=["']([^"']*)["'][^>]*>`,
    "i",
  );
  const contentBeforeAttr = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${attrPattern}[^>]*>`,
    "i",
  );
  const match = html.match(contentFirst) ?? html.match(contentBeforeAttr);
  return match?.[1] ? decode(match[1]).trim() : "";
}

function extractDateFromLdJson(html: string): string {
  const scripts = [
    ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ];
  for (const script of scripts) {
    try {
      const json = JSON.parse(script[1]);
      const candidates = Array.isArray(json) ? json : [json];
      for (const candidate of candidates) {
        const date = candidate?.datePublished;
        if (typeof date === "string" && date) return date;
      }
    } catch {
      // ignore malformed JSON-LD blocks
    }
  }
  return "";
}

function toDateInputValue(rawDate: string): string {
  if (!rawDate) return "";
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

export async function fetchMediumPostMeta(url: string): Promise<MediumPostMeta> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Please enter a valid link before autofilling.");
  }

  const res = await fetch(parsedUrl.toString(), {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)" },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error("Couldn't fetch details from that link. Please fill the fields manually.");
  }

  const html = await res.text();

  const title = extractMetaContent(html, "og:title") || extractMetaContent(html, "twitter:title");
  const description =
    extractMetaContent(html, "og:description") || extractMetaContent(html, "twitter:description");
  const imageUrl =
    extractMetaContent(html, "og:image") || extractMetaContent(html, "twitter:image");
  const rawDate = extractMetaContent(html, "article:published_time") || extractDateFromLdJson(html);

  if (!title && !description && !imageUrl && !rawDate) {
    throw new Error("Couldn't retrieve post details from that link. Please check the URL.");
  }

  return {
    title,
    description: description.slice(0, 220),
    imageUrl,
    publishedAt: toDateInputValue(rawDate),
  };
}
