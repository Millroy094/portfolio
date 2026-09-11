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
    <section className="relative z-10 mb-16 px-4">
      <div className="w-full text-center mb-8">
        <h2 className="inline-block font-bold uppercase tracking-wide text-[20px] md:text-[35px] mr-1 mb-3 text-white/90">
          Latest
        </h2>
        <h2 className="ml-1 inline-block font-bold uppercase tracking-wide text-[20px] md:text-[35px] text-red-700 mb-3">
          Writing
        </h2>
      </div>

      <div className="mx-auto max-w-325 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visiblePosts.map((post) => (
          <article
            key={post.link}
            className="rounded-xl border border-neutral-700/50 bg-neutral-900/40 p-5 hover:bg-neutral-900/70 transition"
          >
            <h3 className="text-lg font-semibold text-neutral-100 line-clamp-2">{post.title}</h3>

            {post.publishedAt && (
              <p className="text-xs text-neutral-400 mt-2">
                {formatPublishedDate(post.publishedAt)}
              </p>
            )}

            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={640}
                height={360}
                className="mt-3 h-40 w-full rounded-md object-cover"
                unoptimized
              />
            )}

            {post.description && (
              <p className="text-sm text-neutral-300 mt-3 line-clamp-4">{post.description}</p>
            )}

            <a
              href={post.link}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 text-sm font-semibold text-red-500 hover:text-red-400"
            >
              Read on Medium →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
