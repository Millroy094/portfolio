"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";
import GrowOnHover from "./GrowOnHover";
import { Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

interface IGrowAndShowLabelOnHoverProps {
  children: ReactNode;
  label: string;
  scale?: number;
}

const labelMotion: Variants = {
  rest: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeOut", type: "tween" }, // ⬅️ transition must be nested
  },
  hover: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeIn", type: "tween" },
  },
};

function GrowAndShowLabelOnHover(props: Readonly<IGrowAndShowLabelOnHoverProps>) {
  const { children, label, scale } = props;
  const isBelowMidSize = useMediaQuery("(max-width:959px)");
  if (children == null) return null;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <GrowOnHover scale={scale}>{children}</GrowOnHover>

      {isBelowMidSize ? (
        <Typography variant="caption" textAlign="center">
          {label}
        </Typography>
      ) : (
        <motion.div variants={labelMotion} style={{ display: "flex" }}>
          <Typography variant="caption" textAlign="center">
            {label}
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
}

export default GrowAndShowLabelOnHover;
