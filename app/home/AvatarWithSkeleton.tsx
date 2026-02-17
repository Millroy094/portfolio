"use client";

import Image from "next/image";
import { useState } from "react";

type AvatarWithSkeletonProps = {
  data: {
    avatarUrl: string;
    fullName: string;
  };
};

export default function AvatarWithSkeleton({ data }: AvatarWithSkeletonProps) {
  const { avatarUrl, fullName } = data;
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative flex justify-center w-37.5 h-37.5">
      {!loaded && (
        <div
          className="
          absolute inset-0 rounded-full
          bg-gray-700 animate-pulse
        "
        />
      )}

      <Image
        src={avatarUrl}
        alt={fullName}
        width={150}
        height={150}
        className={`
          rounded-full object-cover
          transition-opacity duration-300
          ${loaded ? "opacity-100" : "opacity-0"}
        `}
        onLoadingComplete={() => setLoaded(true)}
      />
    </div>
  );
}
