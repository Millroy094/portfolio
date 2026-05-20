"use client";

import React from "react";

type Props = {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

const LocalstackIcon: React.FC<Props> = ({ size = 40, className, style }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="120" height="120" fill="#3B2176" rx="12" />

      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5B8CFF" />
          <stop offset="100%" stopColor="#5EF2B6" />
        </linearGradient>
      </defs>

      <polygon points="20,65 40,45 40,65" fill="url(#grad)" />
      <path d="M45 45 L60 45 L60 70 L85 70 L85 85 L45 85 Z" fill="url(#grad)" />
      <rect x="60" y="25" width="25" height="25" rx="4" fill="url(#grad)" />
      <polygon points="60,85 80,85 65,100" fill="url(#grad)" />
    </svg>
  );
};

export default LocalstackIcon;
