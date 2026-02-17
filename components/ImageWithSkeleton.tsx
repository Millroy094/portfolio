"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
};

export default function ImageWithSkeleton({
  src,
  alt,
  width,
  height,
  className = "",
  priority,
  loading,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative inline-block w-full">
      {!loaded && (
        <div
          className="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"
          style={{ width, height }}
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={loading}
        className={`
          transition-opacity duration-300
          ${loaded ? "opacity-100" : "opacity-0"}
          ${className}
        `}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}
