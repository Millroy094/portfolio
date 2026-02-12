"use client";

import * as React from "react";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";

interface HideOnScrollProps {
  children: React.ReactElement;
  threshold?: number;
}

export default function HideOnScroll({ children, threshold = 12 }: HideOnScrollProps) {
  const trigger = useScrollTrigger({ threshold, disableHysteresis: true });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
