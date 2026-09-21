"use client";

import { useMemo } from "react";
import { useInView } from "react-intersection-observer";

type Variant = "network" | "pathway";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  /** Number of glowing pulse nodes rendered along the circuit paths */
  nodeCount?: number;
  /**
   * "network" - radial hub-and-spoke pattern (used for identity/about sections)
   * "pathway" - structured left-to-right traces (used for progression/timeline sections)
   */
  variant?: Variant;
};

const VARIANTS: Record<Variant, { paths: string[]; joints: { cx: number; cy: number }[] }> = {
  network: {
    paths: [
      "M100 100 L100 40 L60 40",
      "M100 100 L150 60 L150 20",
      "M100 100 L160 100 L190 100",
      "M100 100 L150 140 L150 180",
      "M100 100 L100 160 L60 160",
      "M100 100 L50 100 L10 100",
      "M100 100 L60 60 L20 60",
      "M100 100 L60 140 L20 140",
    ],
    joints: [
      { cx: 100, cy: 100 },
      { cx: 60, cy: 40 },
      { cx: 150, cy: 20 },
      { cx: 190, cy: 100 },
      { cx: 150, cy: 180 },
      { cx: 60, cy: 160 },
      { cx: 10, cy: 100 },
      { cx: 20, cy: 60 },
      { cx: 20, cy: 140 },
    ],
  },
  pathway: {
    paths: [
      "M10 40 L60 40 L60 70 L110 70",
      "M10 100 L50 100 L50 130 L100 130 L100 100 L140 100",
      "M10 160 L70 160 L70 130 L120 130",
      "M140 100 L140 40 L190 40",
      "M110 70 L160 70 L160 160 L190 160",
    ],
    joints: [
      { cx: 10, cy: 40 },
      { cx: 60, cy: 70 },
      { cx: 10, cy: 100 },
      { cx: 100, cy: 130 },
      { cx: 140, cy: 100 },
      { cx: 10, cy: 160 },
      { cx: 120, cy: 130 },
      { cx: 190, cy: 40 },
      { cx: 190, cy: 160 },
    ],
  },
};

/**
 * Lightweight, dependency-free "techy" circuit-board graphic.
 * Pure SVG + CSS animation replacing the previous lottie-web based animations.
 */
export default function CircuitGraphic({
  className,
  style,
  nodeCount = 6,
  variant = "network",
}: Props) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });

  const { paths, joints } = VARIANTS[variant];

  const nodes = useMemo(
    () =>
      Array.from({ length: nodeCount }, (_, i) => ({
        pathIndex: i % paths.length,
        delay: (i / nodeCount) * 3,
      })),
    [nodeCount, paths],
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{
          overflow: "visible",
          animationPlayState: inView ? "running" : "paused",
        }}
        aria-hidden="true"
        focusable="false"
      >
        <g fill="none" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1.5">
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        <g fill="none" stroke="rgba(239, 68, 68, 0.9)" strokeWidth="2">
          {nodes.map((node, i) => (
            <circle
              key={i}
              r="2.5"
              className="circuit-pulse"
              style={{
                offsetPath: `path('${paths[node.pathIndex]}')`,
                animationDelay: `${node.delay}s`,
                animationPlayState: inView ? "running" : "paused",
              }}
              fill="rgba(239, 68, 68, 0.9)"
            />
          ))}
        </g>

        {joints.map((joint, i) => (
          <circle
            key={`joint-${i}`}
            cx={joint.cx}
            cy={joint.cy}
            r={variant === "network" && i === 0 ? 4 : 3}
            className="circuit-node"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
