"use server";

import { decode } from "he";

export type MediumPostMeta = {
  title: string;
  description: string;
  imageUrl: string;
  publishedAt: string;
};

function extractTagValue(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  return m?.[1]?.trim() ?? "";
}

function stripHtml(input: string): string {
  return decode(input.replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

// Publication feeds often replace the real snippet with a teaser like
// "Continue reading on Publication Name »" or "Read more". Strip that out
// so we don't surface it as the post description.
function stripReadMoreTeaser(text: string): string {
  return text
    .replace(/\s*Continue reading on\b[\s\S]*$/i, "")
    .replace(/\s*Read more\.?\s*$/i, "")
    .trim();
}

function extractFirstImageUrl(input: string): string {
  const cleaned = input.replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1");
  const match = cleaned.match(/<img[^>]*\ssrc=["']([^"']+)["'][^>]*>/i);
  return match?.[1]?.trim() ?? "";
}

function extractMediaContentUrl(itemXml: string): string {
  const match = itemXml.match(/<media:content[^>]*\surl=["']([^"']+)["'][^>]*>/i);
  return match?.[1]?.trim() ?? "";
}

function toDateInputValue(rawDate: string): string {
  if (!rawDate) return "";
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

function extractPostSlug(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    const segments = u.pathname.split("/").filter(Boolean);
    const slug = segments[segments.length - 1] ?? "";
    return decodeURIComponent(slug).toLowerCase();
  } catch {
    return rawUrl.toLowerCase();
  }
}

function deriveFeedUrl(postUrl: URL): string {
  if (postUrl.hostname === "medium.com" || postUrl.hostname === "www.medium.com") {
    const [profileOrPublication] = postUrl.pathname.split("/").filter(Boolean);
    if (!profileOrPublication) {
      throw new Error("Couldn't determine the Medium profile for that link.");
    }
    return `https://medium.com/feed/${profileOrPublication}`;
  }

  // Custom Medium subdomains (username.medium.com) and custom domain publications
  return `${postUrl.origin}/feed`;
}

export async function fetchMediumPostMeta(url: string): Promise<MediumPostMeta> {
  let postUrl: URL;
  try {
    postUrl = new URL(url);
  } catch {
    throw new Error("Please enter a valid link before fetching details.");
  }

  const feedUrl = deriveFeedUrl(postUrl);

  const res = await fetch(feedUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error("Couldn't retrieve post details. Please check the link and try again.");
  }

  const targetSlug = extractPostSlug(postUrl.toString());
  if (!targetSlug) {
    throw new Error("Please enter a valid link before fetching details.");
  }

  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
  const match = items.find(
    (item) => extractPostSlug(extractTagValue(item[1], "link")) === targetSlug,
  );

  if (!match) {
    throw new Error(
      "Couldn't find that post (it may be too old to appear in the feed). Please check the link.",
    );
  }

  const block = match[1];
  const content = extractTagValue(block, "content:encoded");
  const descriptionHtml = extractTagValue(block, "description");
  const title = stripHtml(extractTagValue(block, "title"));
  const publishedAtRaw = extractTagValue(block, "pubDate");
  const contentDescription = stripReadMoreTeaser(stripHtml(content));
  const rssDescription = stripReadMoreTeaser(stripHtml(descriptionHtml));
  const description = (contentDescription || rssDescription).slice(0, 220);
  const imageUrl =
    extractFirstImageUrl(content) ||
    extractFirstImageUrl(descriptionHtml) ||
    extractMediaContentUrl(block);

  if (!title && !description && !imageUrl && !publishedAtRaw) {
    throw new Error("Couldn't retrieve post details from that link. Please check the URL.");
  }

  return {
    title,
    description,
    imageUrl,
    publishedAt: toDateInputValue(publishedAtRaw),
  };
}
