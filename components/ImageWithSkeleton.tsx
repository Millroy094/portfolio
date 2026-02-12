"use client";

import { Skeleton, Box } from "@mui/material";
import Image from "next/image";
import { CSSProperties, useState } from "react";

type ImageWithSkeletonProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  style?: CSSProperties;
  className?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
};

export default function ImageWithSkeleton({
  src,
  alt,
  width,
  height,
  style,
  className,
  priority,
  loading,
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      {!loaded && (
        <Skeleton
          variant="rectangular"
          width={width}
          height={height}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: 1,
          }}
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={loading}
        className={className}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.35s ease-out",
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </Box>
  );
}
