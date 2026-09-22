"use client";

import { motion } from "framer-motion";
import * as React from "react";

interface HideOnScrollProps {
  children: React.ReactElement;
  threshold?: number;
}

export default function HideOnScroll({ children, threshold = 12 }: HideOnScrollProps) {
  const [visible, setVisible] = React.useState(true);
  const prevY = React.useRef(0);
  const tickingRef = React.useRef(false);

  React.useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const y = Math.max(window.scrollY, 0);
        const delta = y - prevY.current;

        if (Math.abs(delta) >= threshold) {
          setVisible(delta < 0 || y < threshold);
          prevY.current = y;
        }

        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <motion.div
      animate={{ y: visible ? 0 : "-100%", opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
