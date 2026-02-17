"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

import type { BadgesData } from "@/app/home/actions/getWebsiteData";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import GrowOnHover from "@/hoc/GrowOnHover";

function ChevronLeftIcon({ className = "" }) {
  return (
    <svg
      className={`w-6 h-6 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className = "" }) {
  return (
    <svg
      className={`w-6 h-6 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function BadgeSlider({
  badges,
  maxSizePx = 200,
  loop = true,
  autoplay = false,
  autoplayDelayMs = 3000,
}: {
  badges: BadgesData[];
  maxSizePx?: number;
  loop?: boolean;
  autoplay?: boolean;
  autoplayDelayMs?: number;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      align: "center",
      dragFree: false,
      slidesToScroll: 1,
    },
    autoplay ? [Autoplay({ delay: autoplayDelayMs, stopOnInteraction: false })] : [],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative py-4 overflow-visible">
      <div
        ref={emblaRef}
        className="
          overflow-hidden rounded-md
          pl-14 sm:pl-16 md:pl-20
          pr-14 sm:pr-16 md:pr-20
        "
      >
        <div className="flex gap-4">
          {badges.map((badge, i) => (
            <div
              key={badge.label}
              className="
                shrink-0 w-full flex items-center justify-center
                min-h-55 sm:min-h-65 md:min-h-75
              "
            >
              <GrowOnHover scale={1.1}>
                <div
                  className="flex items-center justify-center w-full"
                  style={{ maxWidth: maxSizePx }}
                >
                  <ImageWithSkeleton
                    src={badge.url}
                    alt={badge.label}
                    width={maxSizePx}
                    height={maxSizePx}
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </GrowOnHover>
            </div>
          ))}
        </div>
      </div>

      <button
        aria-label="Previous badge"
        onClick={scrollPrev}
        className="
          absolute left-2 top-1/2 -translate-y-1/2
          text-white/90 hover:text-white
          w-10 h-10 rounded-full flex items-center justify-center
          transition-colors
          z-20
        "
      >
        <ChevronLeftIcon />
      </button>

      <button
        aria-label="Next badge"
        onClick={scrollNext}
        className="
          absolute right-2 top-1/2 -translate-y-1/2
          text-white/90 hover:text-white
          w-10 h-10 rounded-full flex items-center justify-center
          transition-colors
          z-20
        "
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}
