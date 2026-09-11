"use client";

import Image from "next/image";
import { useMemo } from "react";

import { useWebsiteData } from "@/context/WebsiteData";

function formatPublishedDate(input: string) {
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MediumPosts() {
  const { data } = useWebsiteData();
  const visiblePosts = useMemo(
    () => (data.mediumPosts ?? []).filter((post) => post.title && post.link),
    [data.mediumPosts],
  );

  if (!data.visibility.posts || visiblePosts.length === 0) return null;

  return (
    <section className="relative z-10 mb-16">
      <div className="w-full text-center mb-10 px-4">
        <h2 className="inline-block font-bold uppercase tracking-wide text-[20px] md:text-[35px] mr-1 mb-3 text-white/90">
          Latest
        </h2>
        <h2 className="ml-1 inline-block rounded-md bg-neutral-100 px-2 py-0.5 font-bold uppercase tracking-wide text-[20px] text-neutral-950 md:text-[35px] mb-3">
          Writing
        </h2>
      </div>

      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visiblePosts.map((post) => (
          <article
            key={post.link}
            className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 hover:bg-neutral-850 hover:shadow-md transition-all group"
          >
            {post.imageUrl && (
              <div
                className="mb-4 relative w-full overflow-hidden rounded-md bg-neutral-800"
                style={{ aspectRatio: "16/9" }}
              >
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:opacity-90 transition-opacity"
                  unoptimized
                />
              </div>
            )}

            <h3 className="text-lg font-semibold text-neutral-100 line-clamp-2">{post.title}</h3>

            {post.publishedAt && (
              <p className="text-xs text-neutral-500 mt-2">
                {formatPublishedDate(post.publishedAt)}
              </p>
            )}

            {post.description && (
              <p className="text-sm text-neutral-400 mt-3 line-clamp-3">{post.description}</p>
            )}

            <a
              href={post.link}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-5 text-sm font-medium text-neutral-300 hover:text-neutral-100 transition-colors"
            >
              Read on Medium →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
