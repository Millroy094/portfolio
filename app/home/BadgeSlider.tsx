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
  maxSizePx?: number;
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

  return (
    <Box
      sx={{
        position: "relative",
        px: { xs: 2, md: 4 },
        py: 2,
        overflow: "visible",
      }}
    >
      <Box ref={emblaRef} sx={{ overflow: "hidden", borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          {badgeUrls.map((badgeUrl, i) => (
            <Box
              key={badgeUrl}
              sx={{
                flex: "0 0 100%",
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
                    maxWidth: maxSizePx,
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

      {/* Controls – nudge outward with negative horizontal offsets */}
      <IconButton
        aria-label="Previous badge"
        onClick={scrollPrev}
        sx={(theme) => ({
          position: "absolute",
          top: "50%",
          left: { xs: -6, md: -10 }, // 👈 stick out a little
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.4)",
          color: "white",
          "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
          zIndex: theme.zIndex.appBar + 1,
          // make them circular and slightly larger for better hit area
          width: 40,
          height: 40,
          borderRadius: "50%",
          backdropFilter: "blur(2px)",
          boxShadow: 2,
        })}
      >
        <ChevronLeftIcon />
      </IconButton>

      <IconButton
        aria-label="Next badge"
        onClick={scrollNext}
        sx={(theme) => ({
          position: "absolute",
          top: "50%",
          right: { xs: -6, md: -10 }, // 👈 stick out a little
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.4)",
          color: "white",
          "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
          zIndex: theme.zIndex.appBar + 1,
          width: 40,
          height: 40,
          borderRadius: "50%",
          backdropFilter: "blur(2px)",
          boxShadow: 2,
        })}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}
