"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";
import GrowOnHover from "@/hoc/GrowOnHover";

type Props = {
  badgeUrls: string[];
  maxSizePx?: number; // badge image cap (kept at 150 by default)
  loop?: boolean;
  autoplay?: boolean;
  autoplayDelayMs?: number;
};

export default function BadgeSlider({
  badgeUrls,
  maxSizePx = 200,
  loop = true,
  autoplay = false,
  autoplayDelayMs = 3000,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop, align: "center", dragFree: false, slidesToScroll: 1 },
    autoplay
      ? [Autoplay({ delay: autoplayDelayMs, stopOnInteraction: false })]
      : [],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  /**
   * Tuning knobs:
   * - btnSize: visual size of icon button
   * - gutter: space reserved inside the viewport so arrows never overlap the image
   *   (increase these if you want even more distance)
   */
  const btnSize = 40; // px (icon button diameter)
  const gutter = {
    xs: 56, // left/right padding on extra-small screens
    sm: 64, // small
    md: 80, // medium and up
  };

  return (
    <Box
      sx={{
        position: "relative",
        py: 2,
        overflow: "visible",
      }}
    >
      {/* Viewport with generous side padding (gutter) so arrows don't overlap the image */}
      <Box
        ref={emblaRef}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          pl: {
            xs: `${gutter.xs}px`,
            sm: `${gutter.sm}px`,
            md: `${gutter.md}px`,
          },
          pr: {
            xs: `${gutter.xs}px`,
            sm: `${gutter.sm}px`,
            md: `${gutter.md}px`,
          },
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          {badgeUrls.map((badgeUrl, i) => (
            <Box
              key={badgeUrl}
              sx={{
                flex: "0 0 100%", // 1 per view
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: { xs: 220, sm: 260, md: 300 },
              }}
            >
              <GrowOnHover scale={1.1}>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: maxSizePx, // keep badges capped at 150px
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    width={maxSizePx}
                    height={maxSizePx}
                    src={badgeUrl}
                    alt={`Certificate ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                    loading={i === 0 ? "eager" : "lazy"}
                    priority={i === 0}
                  />
                </Box>
              </GrowOnHover>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Controls — transparent, aligned inside the gutter, no overlap */}
      <IconButton
        aria-label="Previous badge"
        onClick={scrollPrev}
        sx={() => ({
          position: "absolute",
          top: "50%",
          left: { xs: 8, sm: 8, md: 8 }, // inside the reserved gutter
          transform: "translateY(-50%)",
          // Transparent look
          bgcolor: "transparent",
          color: "rgba(255,255,255,0.9)",
          "&:hover": {
            bgcolor: "transparent",
            color: "white",
          },
          width: btnSize,
          height: btnSize,
          borderRadius: "50%",
          // Optional: a subtle text-shadow to improve contrast on busy backgrounds
          textShadow: "0 0 6px rgba(0,0,0,0.35)",
          zIndex: 10,
        })}
      >
        <ChevronLeftIcon fontSize="medium" />
      </IconButton>

      <IconButton
        aria-label="Next badge"
        onClick={scrollNext}
        sx={() => ({
          position: "absolute",
          top: "50%",
          right: { xs: 8, sm: 8, md: 8 }, // inside the reserved gutter
          transform: "translateY(-50%)",
          bgcolor: "transparent",
          color: "rgba(255,255,255,0.9)",
          "&:hover": {
            bgcolor: "transparent",
            color: "white",
          },
          width: btnSize,
          height: btnSize,
          borderRadius: "50%",
          textShadow: "0 0 6px rgba(0,0,0,0.35)",
          zIndex: 10,
        })}
      >
        <ChevronRightIcon fontSize="medium" />
      </IconButton>
    </Box>
  );
}
