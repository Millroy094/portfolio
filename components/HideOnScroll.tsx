"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

interface HideOnScrollProps {
  children: React.ReactElement;
  threshold?: number;
}

export default function HideOnScroll({ children, threshold = 12 }: HideOnScrollProps) {
  const [visible, setVisible] = React.useState(true);
  const prevY = React.useRef(0);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - prevY.current;
      if (Math.abs(delta) < threshold) return;
      setVisible(delta < 0 || y < threshold);
      prevY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
