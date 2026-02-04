'use client'

import { motion } from "motion/react";
import { ReactElement } from "react";

interface IGrowOnHoverProps {
  children: ReactElement;
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
