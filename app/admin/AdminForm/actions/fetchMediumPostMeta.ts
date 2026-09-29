"use server";

import { decode } from "he";

export type MediumPostMeta = {
  title: string;
  description: string;
  imageUrl: string;
  publishedAt: string;
};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

// Matches a <meta ... property|name="X" ... content="Y" ...> tag regardless of
// attribute order, allowing either single or double quotes.
function metaContentPatterns(name: string): RegExp[] {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [
    new RegExp(
      `<meta[^>]*(?:property|name)=["']${escaped}["'][^>]*content=["']([^"']*)["'][^>]*>`,
      "i",
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${escaped}["'][^>]*>`,
      "i",
    ),
  ];
}

function extractMeta(html: string, names: string[]): string {
  for (const name of names) {
    for (const pattern of metaContentPatterns(name)) {
      const match = html.match(pattern);
      if (match?.[1]) return decode(match[1]).trim();
    }
  }
  return "";
}

function extractTitleTag(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1] ? decode(match[1]).trim() : "";
}

function extractPublishedTime(html: string): string {
  const meta = extractMeta(html, ["article:published_time", "og:article:published_time"]);
  if (meta) return meta;

  const timeTag = html.match(/<time[^>]*datetime=["']([^"']+)["'][^>]*>/i);
  return timeTag?.[1]?.trim() ?? "";
}

function toDateInputValue(rawDate: string): string {
  if (!rawDate) return "";
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

export async function fetchMediumPostMeta(url: string): Promise<MediumPostMeta> {
  let postUrl: URL;
  try {
    postUrl = new URL(url);
  } catch {
    throw new Error("Please enter a valid link before fetching details.");
  }

  // Reading the article page directly (rather than guessing an RSS feed URL)
  // works the same way for personal profiles, publications, publications on
  // custom domains, and posts too old to still appear in an RSS feed.
  const res = await fetch(postUrl.toString(), {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error("Couldn't retrieve post details. Please check the link and try again.");
  }

  const html = await res.text();

  const title = extractMeta(html, ["og:title", "twitter:title"]) || extractTitleTag(html);
  const description = extractMeta(html, ["og:description", "twitter:description", "description"]);
  const imageUrl = extractMeta(html, ["og:image", "twitter:image"]);
  const publishedAtRaw = extractPublishedTime(html);

  if (!title && !description && !imageUrl && !publishedAtRaw) {
    throw new Error("Couldn't retrieve post details from that link. Please check the URL.");
  }

  return {
    title,
    description: description.slice(0, 220),
    imageUrl,
    publishedAt: toDateInputValue(publishedAtRaw),
  };
}
