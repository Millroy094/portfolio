"use client";

import { useMemo } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  /** Number of glowing pulses traveling along the stream */
  pulseCount?: number;
};

/**
 * Lightweight, dependency-free vertical "energy stream" graphic.
 * Unlike the SVG-viewBox based graphics, this scales purely via CSS percentages,
 * so it naturally stretches to fill however tall its parent section is.
 */
export default function VerticalEnergyGraphic({ className, style, pulseCount = 5 }: Props) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  const pulses = useMemo(
    () =>
      Array.from({ length: pulseCount }, (_, i) => ({
        delay: (i / pulseCount) * 3.5,
      })),
    [pulseCount],
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "12rem",
        ...style,
      }}
    >
      <div
        className="energy-beam"
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: "2px",
          transform: "translateX(-50%)",
        }}
      />

      {[0, 100].map((topPct) => (
        <span
          key={topPct}
          className="energy-node"
          style={{
            position: "absolute",
            left: "50%",
            top: `${topPct}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {pulses.map((p, i) => (
        <span
          key={i}
          className="energy-comet"
          style={{
            animationDelay: `${p.delay}s`,
            animationPlayState: inView ? "running" : "paused",
          }}
        />
      ))}
    </div>
  );
}
