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
        offset: i % 2 === 0 ? -6 : 6,
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
      {/* Static beam */}
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

      {/* Anchor nodes at top / middle / bottom */}
      {[0, 50, 100].map((topPct) => (
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

      {/* Traveling glowing pulses */}
      {pulses.map((p, i) => (
        <span
          key={i}
          className="energy-pulse"
          style={{
            position: "absolute",
            left: "50%",
            marginLeft: `${p.offset}px`,
            animationDelay: `${p.delay}s`,
            animationPlayState: inView ? "running" : "paused",
          }}
        />
      ))}
    </div>
  );
}
