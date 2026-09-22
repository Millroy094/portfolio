"use client";

import { useMemo } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  /** Number of energy particles released outward from the orb */
  particleCount?: number;
};

/**
 * Lightweight, dependency-free "techy" orb graphic that pulses and releases
 * outward bursts of energy. Pure SVG + CSS animation, no external libraries.
 */
export default function OrbGraphic({ className, style, particleCount = 10 }: Props) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => {
        const angle = (360 / particleCount) * i;
        return {
          angle,
          delay: (i / particleCount) * 2.4,
        };
      }),
    [particleCount],
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
        <defs>
          <radialGradient id="orb-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
            <stop offset="45%" stopColor="rgba(239, 68, 68, 0.85)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
          </radialGradient>
        </defs>

        {/* Expanding energy rings */}
        {[0, 1, 2].map((i) => (
          <circle
            key={`ring-${i}`}
            cx="100"
            cy="100"
            r="18"
            fill="none"
            stroke="rgba(239, 68, 68, 0.6)"
            strokeWidth="1.5"
            className="orb-ring"
            style={{
              animationDelay: `${i * 1.2}s`,
              animationPlayState: inView ? "running" : "paused",
            }}
          />
        ))}

        {/* Outward-flying particles */}
        {particles.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * 85;
          const ty = Math.sin(rad) * 85;
          return (
            <circle
              key={`particle-${i}`}
              cx="100"
              cy="100"
              r="2.5"
              fill="rgba(239, 68, 68, 0.9)"
              className="orb-particle"
              style={
                {
                  "--tx": `${tx}px`,
                  "--ty": `${ty}px`,
                  animationDelay: `${p.delay}s`,
                  animationPlayState: inView ? "running" : "paused",
                } as React.CSSProperties
              }
            />
          );
        })}

        {/* Core */}
        <circle cx="100" cy="100" r="22" fill="url(#orb-core)" className="orb-core" />
      </svg>
    </div>
  );
}
