"use server";

import { lookup } from "node:dns/promises";
import net from "node:net";

import { decode } from "he";

export type MediumPostMeta = {
  title: string;
  description: string;
  imageUrl: string;
  publishedAt: string;
};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const INVALID_LINK_ERROR = "Please enter a valid link before fetching details.";
const MAX_REDIRECTS = 5;

// Blocks requests to loopback/private/link-local addresses so a pasted link
// can't be used to make this server action reach internal network resources
// (SSRF). Applied to the initial URL and every redirect hop.
function isDisallowedIp(address: string): boolean {
  if (net.isIPv4(address)) {
    const [a, b] = address.split(".").map(Number);
    if (a === 127 || a === 10 || a === 0) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    return false;
  }

  if (net.isIPv6(address)) {
    const lower = address.toLowerCase();
    if (lower === "::1" || lower === "::") return true;
    if (lower.startsWith("fe80:")) return true;
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
    if (lower.startsWith("::ffff:")) {
      const mapped = lower.slice("::ffff:".length);
      return net.isIPv4(mapped) ? isDisallowedIp(mapped) : false;
    }
    return false;
  }

  return true;
}

async function assertSafePublicUrl(target: URL): Promise<void> {
  if (target.protocol !== "https:") {
    throw new Error(INVALID_LINK_ERROR);
  }

  if (target.hostname.toLowerCase() === "localhost") {
    throw new Error(INVALID_LINK_ERROR);
  }

  let addresses: string[];
  try {
    addresses = (await lookup(target.hostname, { all: true })).map((entry) => entry.address);
  } catch {
    throw new Error(INVALID_LINK_ERROR);
  }

  if (addresses.length === 0 || addresses.some(isDisallowedIp)) {
    throw new Error(INVALID_LINK_ERROR);
  }
}

async function fetchFollowingSafeRedirects(initialUrl: URL): Promise<Response> {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    await assertSafePublicUrl(currentUrl);

    const res = await fetch(currentUrl.toString(), {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "manual",
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) return res;
      currentUrl = new URL(location, currentUrl);
      continue;
    }

    return res;
  }

  throw new Error("Couldn't retrieve post details. Please check the link and try again.");
}

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
    throw new Error(INVALID_LINK_ERROR);
  }

  // Reading the article page directly (rather than guessing an RSS feed URL)
  // works the same way for personal profiles, publications, publications on
  // custom domains, and posts too old to still appear in an RSS feed.
  const res = await fetchFollowingSafeRedirects(postUrl);

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
