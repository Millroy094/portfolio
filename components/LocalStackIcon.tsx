"use client";

import React from "react";

type Props = {
  size?: number;
  style?: React.CSSProperties;
  className?: string;
};

const LocalstackIcon: React.FC<Props> = ({ size = 40, style, className }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <rect width="120" height="120" rx="20" fill="#0f172a" />
      <g transform="translate(20,30)">
        <rect x="0" y="0" width="80" height="12" rx="3" fill="#ef4444" />
        <rect x="8" y="18" width="80" height="12" rx="3" fill="#f97316" />
        <rect x="16" y="36" width="80" height="12" rx="3" fill="#22c55e" />
        <rect x="24" y="54" width="80" height="12" rx="3" fill="#3b82f6" />
      </g>
    </svg>
  );
};

export default LocalstackIcon;
