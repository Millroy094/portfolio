"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface IGrowOnHoverProps {
  children: ReactNode;
  scale?: number;
}

function GrowOnHover(props: IGrowOnHoverProps) {
  const { children, scale } = props;
  return (
    <motion.div
      whileHover={{
        scale: scale ?? 1.1,
        transition: { duration: 1 },
      }}
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.div>
  );
}

export default GrowOnHover;
