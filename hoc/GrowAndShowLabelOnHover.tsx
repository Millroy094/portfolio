"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

import GrowOnHover from "./GrowOnHover";

interface IGrowAndShowLabelOnHoverProps {
  children: ReactNode;
  label: string;
  scale?: number;
}

const labelMotion: Variants = {
  rest: { opacity: 0, transition: { duration: 0.2, ease: "easeOut", type: "tween" } },
  hover: { opacity: 1, transition: { duration: 0.4, ease: "easeIn", type: "tween" } },
};

function GrowAndShowLabelOnHover(props: Readonly<IGrowAndShowLabelOnHoverProps>) {
  const { children, label, scale } = props;
  const [isBelowMidSize, setIsBelowMidSize] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width:959px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width:959px)");
    const listener = (evt: MediaQueryListEvent) => setIsBelowMidSize(evt.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  if (children == null) return null;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
    >
      <GrowOnHover scale={scale}>{children}</GrowOnHover>

      {isBelowMidSize ? (
        <span className="text-center text-xs text-neutral-300">{label}</span>
      ) : (
        <motion.div variants={labelMotion} style={{ display: "flex" }}>
          <span className="text-center text-xs text-neutral-300">{label}</span>
        </motion.div>
      )}
    </motion.div>
  );
}

export default GrowAndShowLabelOnHover;
