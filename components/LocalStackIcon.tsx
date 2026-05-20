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
      <rect width="120" height="120" rx="12" fill="#3B2176" />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5B8CFF" />
          <stop offset="100%" stopColor="#5EF2B6" />
        </linearGradient>
      </defs>

      <g transform="translate(-4,-12)">
        <rect x="65" y="42" width="30" height="30" rx="1" fill="url(#grad)" />
        <path d="M45 45 L60 45 L60 77 L90 77 L90 90 L45 90 Z" fill="url(#grad)" />
        <polygon points="26,65 41,50 41,65" fill="url(#grad)" />
        <polygon points="90,94 75,109 75,94" fill="url(#grad)" />
      </g>
    </svg>
  );
};

export default LocalstackIcon;
