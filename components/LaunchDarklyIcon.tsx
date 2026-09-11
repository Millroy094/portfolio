"use client";

import React from "react";

type Props = {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

const LaunchDarklyIcon: React.FC<Props> = ({ size = 40, className, style }) => {
  return (
    <svg
      viewBox="132 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="132" y="0" width="24" height="24" rx="4" fill="#1F1F1F" />
      <path
        fill="#F05A28"
        d="M144.092 24a.56.56 0 0 1-.478-.291c-.08-.185-.08-.371.053-.53l5.662-7.762-9.915 4.027c-.08.027-.133.053-.212.053a.52.52 0 0 1-.505-.371c-.08-.212.026-.45.212-.583l8.719-5.113-15.337-.874a.525.525 0 0 1-.505-.53.52.52 0 0 1 .505-.53l15.337-.874-8.719-5.113c-.186-.132-.292-.371-.212-.583s.265-.371.505-.371c.079 0 .132.026.212.053l9.915 4.026-5.662-7.788c-.106-.159-.133-.371-.053-.53a.5.5 0 0 1 .478-.291c.133 0 .266.053.372.159l11.271 11.205c.159.159.239.397.239.609s-.08.424-.239.609l-11.271 11.232a.53.53 0 0 1-.372.159z"
      />
    </svg>
  );
};

export default LaunchDarklyIcon;
