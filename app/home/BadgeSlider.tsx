"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

import ImageWithSkeleton from "@/components/ImageWithSkeleton";

type Badge = {
  label: string;
  url: string;
};

export default function BadgeSlider({ badges }: { badges: Badge[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, []);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const handleDotClick = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  return (
    <div className="relative py-6">
      <div ref={emblaRef} className="overflow-hidden rounded-lg">
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

      <div className="flex justify-center gap-2 mt-6">
        {badges.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === currentIndex ? "bg-white w-8" : "bg-white/40 w-2 hover:bg-white/60"
            }`}
            aria-label={`Go to badge ${i + 1}`}
            aria-current={i === currentIndex ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
}
