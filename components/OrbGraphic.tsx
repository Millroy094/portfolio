"use client";

import { useInView } from "react-intersection-observer";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const ORBITS = [
  { rx: 85, ry: 32, rotate: -20, duration: 9, satelliteSize: 3.5 },
  { rx: 85, ry: 32, rotate: 35, duration: 13, satelliteSize: 3 },
  { rx: 85, ry: 32, rotate: 90, duration: 16, satelliteSize: 2.5 },
];

/**
 * Lightweight, dependency-free "techy" orb graphic: a steady glowing core
 * orbited by satellite particles on tilted elliptical paths, evoking an atom
 * rather than a pulsing alarm/radar beacon. Pure SVG + CSS animation.
 */
export default function OrbGraphic({ className, style }: Props) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ overflow: "visible" }}
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

        {ORBITS.map((orbit, i) => (
          <g key={i} transform={`translate(100 100) rotate(${orbit.rotate})`}>
            <ellipse
              rx={orbit.rx}
              ry={orbit.ry}
              fill="none"
              stroke="rgba(239, 68, 68, 0.35)"
              strokeWidth="1"
            />
            <g
              className="orb-orbit"
              style={{
                animationDuration: `${orbit.duration}s`,
                animationPlayState: inView ? "running" : "paused",
              }}
            >
              <circle
                cx={orbit.rx}
                cy="0"
                r={orbit.satelliteSize}
                fill="rgba(239, 68, 68, 0.95)"
                className="orb-satellite"
              />
            </g>
          </g>
        ))}

        <circle cx="100" cy="100" r="22" fill="url(#orb-core)" className="orb-core" />
      </svg>
    </div>
  );
}
