import { motion } from "motion/react";
import { ReactElement } from "react";
import GrowOnHover from "./GrowOnHover";
import { Typography } from "@mui/material";

interface IGrowAndShowLabelOnHoverProps {
  children: ReactElement;
  label: string;
  scale?: number;
}

const labelMotion = {
  rest: { opacity: 0, ease: "easeOut", duration: 0.2, type: "tween" },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeIn",
    },
  },
  tap: {
    opacity: 1,
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeIn",
    },
  },
};

function GrowAndShowLabelOnHover(
  props: Readonly<IGrowAndShowLabelOnHoverProps>
) {
  const { children, label, scale } = props;
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
      <motion.div variants={labelMotion}>
        <Typography variant="caption">{label}</Typography>
      </motion.div>
    </motion.div>
  );
}

export default GrowAndShowLabelOnHover;
