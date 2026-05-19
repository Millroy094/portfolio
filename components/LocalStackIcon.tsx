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
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={style}
    >
      {/* Cloud shape */}
      <path
        d="M30 70c-8 0-14-6-14-14s6-14 14-14c1 0 2 0 3 .2C36 32 46 24 58 24c14 0 25 11 25 25h2
           c9 0 16 7 16 16s-7 16-16 16H30z"
        fill="#2d4552"
      />

      {/* Container cube */}
      <g transform="translate(40,55)">
        {/* Top */}
        <polygon points="20,0 40,10 20,20 0,10" fill="#e53935" />

        {/* Left */}
        <polygon points="0,10 20,20 20,40 0,30" fill="#c62828" />

        {/* Right */}
        <polygon points="40,10 20,20 20,40 40,30" fill="#ef5350" />
      </g>

      {/* Bottom underline */}
      <rect x="30" y="95" width="60" height="6" fill="#1d8d22" />
    </svg>
  );
};

export default LocalstackIcon;
