"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

import ImageWithSkeleton from "@/components/ImageWithSkeleton";

type Badge = {
  label: string;
  url: string;
};

export default function BadgeSlider({ badges }: { badges: Badge[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({}, []);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative py-6">
      <div
        ref={emblaRef}
        className="overflow-hidden pl-12 pr-12 sm:pl-16 sm:pr-16 md:pl-20 md:pr-20 rounded-lg"
      >
        <div className="flex gap-4">
          {badges.map((badge, i) => (
            <div
              key={badge.label}
              className="
                flex-[0_0_100%]
                flex items-center justify-center
                h-55 sm:h-65
              "
            >
              <div className="flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
                <ImageWithSkeleton
                  src={badge.url}
                  alt={badge.label}
                  width={300}
                  height={300}
                  className="h-full w-full object-contain"
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute top-1/2 left-1 sm:left-2 -translate-y-1/2
                   w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white
                   flex items-center justify-center transition-colors"
      >
        ‹
      </button>

      <button
        onClick={next}
        className="absolute top-1/2 right-1 sm:right-2 -translate-y-1/2
                   w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white
                   flex items-center justify-center transition-colors"
      >
        ›
      </button>
    </div>
  );
}
