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
    <div className={`relative block w-full ${className}`}>
      {!loaded && (
        <>
          <svg
            width={width}
            height={height}
            className="block w-full h-auto"
            style={{ visibility: "hidden" }}
            aria-hidden="true"
            focusable="false"
          />
          <div className="absolute inset-0 animate-pulse bg-gray-700" />
        </>
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={loading}
        className={`block w-full h-auto rounded-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadingComplete={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}
