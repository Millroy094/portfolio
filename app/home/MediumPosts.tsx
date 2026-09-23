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
    <section className="relative z-10 mb-20 md:mb-28">
      <div className="mx-auto w-full max-w-384">
        <div className="w-full text-center mb-6 md:mb-8 px-4">
          <h2 className="inline-block font-bold uppercase tracking-wide text-[20px] md:text-[35px] [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:text-[20px] mr-1 text-white/90">
            Latest
          </h2>
          <h2 className="ml-1 inline-block rounded-md bg-neutral-100 px-2 py-0.5 font-bold uppercase tracking-wide text-[20px] text-red-500 md:text-[35px] [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1000px)]:text-[20px]">
            Writing
          </h2>
        </div>

        <div className="mx-auto grid max-w-[1140px] justify-center gap-4 px-5 sm:gap-5 sm:px-10 [grid-template-columns:repeat(auto-fit,minmax(230px,270px))]">
          {visiblePosts.map((post) => (
            <a
              key={post.link}
              href={post.link}
              target="_blank"
              rel="noreferrer"
              className="group rounded-lg border border-neutral-800 bg-neutral-900 overflow-hidden hover:bg-neutral-850 hover:shadow-md transition-all flex flex-col"
            >
              {post.imageUrl && (
                <div
                  className="relative w-full overflow-hidden bg-neutral-800"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-cover group-hover:opacity-90 transition-opacity"
                    unoptimized
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5 p-3 flex-grow">
                <h3 className="text-sm font-semibold text-neutral-100 line-clamp-2">
                  {post.title}
                </h3>

                {post.publishedAt && (
                  <p className="text-xs text-neutral-500">
                    {formatPublishedDate(post.publishedAt)}
                  </p>
                )}

                {post.description && (
                  <p className="text-xs text-neutral-400 line-clamp-2 flex-grow">
                    {post.description}
                  </p>
                )}

                <p className="text-xs font-semibold text-neutral-200 group-hover:text-white transition-colors mt-1">
                  Read on Medium →
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
