"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  /** Number of rungs (base pairs) drawn along the helix */
  rungCount?: number;
  /** Number of rising spark particles per side stream */
  sparkCount?: number;
};

const BASE_VIEW_HEIGHT = 300;
const VIEW_WIDTH = 100;
const AMPLITUDE = 30;
const CENTER_X = 50;
const BASE_TWISTS = 2.25;
const TWIST_PERIOD = BASE_VIEW_HEIGHT / BASE_TWISTS;
const ROTATION_FRAMES = 12;
const ROTATION_DURATION = "6s";

const SPARK_LAYOUT = [
  { offset: "0%", size: 4, duration: 3.2, delay: 0, variant: 1 },
  { offset: "-30%", size: 3, duration: 4.1, delay: 0.6, variant: 2 },
  { offset: "25%", size: 3, duration: 3.6, delay: 1.2, variant: 3 },
  { offset: "-15%", size: 5, duration: 4.6, delay: 1.9, variant: 2 },
  { offset: "18%", size: 2, duration: 3.1, delay: 2.5, variant: 1 },
];

const OUTER_DRIFTERS = [
  { top: "14%", left: "78%", delay: "0s", duration: "9s" },
  { top: "40%", left: "16%", delay: "1.4s", duration: "10.5s" },
  { top: "64%", left: "82%", delay: "2.8s", duration: "9.5s" },
  { top: "88%", left: "20%", delay: "1s", duration: "8.5s" },
];

function buildFrames(rungCount: number, viewHeight: number, twists: number) {
  const steps = 48;
  const baseSamples = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return { t, y: t * viewHeight };
  });

  const rungIndices = (() => {
    const step = Math.floor(baseSamples.length / rungCount);
    const idxs: number[] = [];
    for (let i = step; i < baseSamples.length - 1; i += step) idxs.push(i);
    return idxs;
  })();

  const strandAFrames: string[] = [];
  const strandBFrames: string[] = [];
  const rungXA: number[][] = rungIndices.map(() => []);
  const rungXB: number[][] = rungIndices.map(() => []);
  const nodeAFrames: number[][] = rungIndices.map(() => []);
  const nodeBFrames: number[][] = rungIndices.map(() => []);

  for (let f = 0; f <= ROTATION_FRAMES; f += 1) {
    const rotation = (f / ROTATION_FRAMES) * Math.PI * 2;
    const points: { xA: number; xB: number; y: number }[] = baseSamples.map((s) => {
      const phase = s.t * Math.PI * 2 * twists + rotation;
      return {
        xA: CENTER_X + AMPLITUDE * Math.sin(phase),
        xB: CENTER_X - AMPLITUDE * Math.sin(phase),
        y: s.y,
      };
    });

    strandAFrames.push(points.map((p) => `${p.xA.toFixed(1)},${p.y.toFixed(1)}`).join(" L "));
    strandBFrames.push(points.map((p) => `${p.xB.toFixed(1)},${p.y.toFixed(1)}`).join(" L "));

    rungIndices.forEach((idx, ri) => {
      rungXA[ri].push(points[idx].xA);
      rungXB[ri].push(points[idx].xB);
      nodeAFrames[ri].push(points[idx].xA);
      nodeBFrames[ri].push(points[idx].xB);
    });
  }

  return {
    strandA: `M ${strandAFrames[0]}`,
    strandAValues: strandAFrames.map((p) => `M ${p}`).join(";"),
    strandB: `M ${strandBFrames[0]}`,
    strandBValues: strandBFrames.map((p) => `M ${p}`).join(";"),
    rungs: rungIndices.map((idx, ri) => ({
      y: baseSamples[idx].y,
      xA0: rungXA[ri][0],
      xB0: rungXB[ri][0],
      xAValues: rungXA[ri].map((v) => v.toFixed(1)).join(";"),
      xBValues: rungXB[ri].map((v) => v.toFixed(1)).join(";"),
      nodeAValues: nodeAFrames[ri].map((v) => v.toFixed(1)).join(";"),
      nodeBValues: nodeBFrames[ri].map((v) => v.toFixed(1)).join(";"),
    })),
  };
}

export default function VerticalEnergyGraphic({
  className,
  style,
  rungCount = 10,
  sparkCount = 5,
}: Props) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });
  const playState = inView ? "running" : "paused";

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const helixColRef = useRef<HTMLDivElement>(null);
  const [helixSize, setHelixSize] = useState({ width: 60, height: BASE_VIEW_HEIGHT * 0.6 });

  useEffect(() => {
    const el = helixColRef.current;
    if (!el) return undefined;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setHelixSize({ width, height });
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { viewHeight, twists } = useMemo(() => {
    const aspect = helixSize.height / helixSize.width;
    const height = VIEW_WIDTH * aspect;
    const rawTwists = height / TWIST_PERIOD;
    return { viewHeight: height, twists: Math.min(6, Math.max(1.5, rawTwists)) };
  }, [helixSize]);

  const frames = useMemo(
    () => buildFrames(rungCount, viewHeight, twists),
    [rungCount, viewHeight, twists],
  );
  const sparks = useMemo(() => SPARK_LAYOUT.slice(0, sparkCount), [sparkCount]);
  const animate = inView && !reducedMotion;

  return (
    <div
      ref={ref}
      className={["connector-fade", className].filter(Boolean).join(" ")}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        height: "100%",
        minHeight: "16rem",
        ...style,
      }}
    >
      <div className="stream-col stream-col-left stream-col-experience" aria-hidden="true">
        <div className="stream-track" />
        {sparks.map((s, i) => (
          <span
            key={`l-${i}`}
            className={`stream-spark stream-spark-v${s.variant}`}
            style={{
              left: `calc(50% + ${s.offset})`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              animationPlayState: playState,
            }}
          />
        ))}
        {OUTER_DRIFTERS.map((d) => (
          <span
            key={`ld-${d.top}-${d.left}`}
            className="ambient-drift"
            style={{
              top: d.top,
              left: d.left,
              animationDelay: d.delay,
              animationDuration: d.duration,
              animationPlayState: playState,
            }}
          />
        ))}
      </div>

      <div className="helix-col" aria-hidden="true" ref={helixColRef}>
        <div className="helix-glow" />
        <svg
          className="helix-svg"
          viewBox={`0 0 ${VIEW_WIDTH} ${viewHeight.toFixed(1)}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="helix-rung-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.6)" />
              <stop offset="100%" stopColor="rgba(212, 212, 216, 0.6)" />
            </linearGradient>
          </defs>
          {frames.rungs.map((r) => (
            <line
              key={`rung-${r.y}`}
              className="helix-rung"
              x1={r.xA0}
              y1={r.y}
              x2={r.xB0}
              y2={r.y}
            >
              {animate && (
                <>
                  <animate
                    attributeName="x1"
                    values={r.xAValues}
                    dur={ROTATION_DURATION}
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                  <animate
                    attributeName="x2"
                    values={r.xBValues}
                    dur={ROTATION_DURATION}
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                </>
              )}
            </line>
          ))}

          <path className="helix-strand helix-strand-b" d={frames.strandB}>
            {animate && (
              <animate
                attributeName="d"
                values={frames.strandBValues}
                dur={ROTATION_DURATION}
                repeatCount="indefinite"
                calcMode="linear"
              />
            )}
          </path>
          <path className="helix-strand helix-strand-a" d={frames.strandA}>
            {animate && (
              <animate
                attributeName="d"
                values={frames.strandAValues}
                dur={ROTATION_DURATION}
                repeatCount="indefinite"
                calcMode="linear"
              />
            )}
          </path>

          {frames.rungs.map((r) => (
            <g key={`nodes-${r.y}`}>
              <circle
                className="helix-node helix-node-a"
                cx={r.xA0}
                cy={r.y}
                r={3.2}
                fill="rgba(56, 189, 248, 0.95)"
              >
                {animate && (
                  <animate
                    attributeName="cx"
                    values={r.nodeAValues}
                    dur={ROTATION_DURATION}
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                )}
              </circle>
              <circle
                className="helix-node helix-node-b"
                cx={r.xB0}
                cy={r.y}
                r={3.2}
                fill="rgba(239, 68, 68, 0.85)"
              >
                {animate && (
                  <animate
                    attributeName="cx"
                    values={r.nodeBValues}
                    dur={ROTATION_DURATION}
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                )}
              </circle>
            </g>
          ))}
        </svg>
      </div>

      <div className="stream-col stream-col-right stream-col-education" aria-hidden="true">
        <div className="stream-track" />
        {sparks.map((s, i) => (
          <span
            key={`r-${i}`}
            className={`stream-spark stream-spark-v${s.variant}`}
            style={{
              left: `calc(50% + ${s.offset})`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay + 0.4}s`,
              animationPlayState: playState,
            }}
          />
        ))}
        {OUTER_DRIFTERS.map((d) => (
          <span
            key={`rd-${d.top}-${d.left}`}
            className="ambient-drift"
            style={{
              top: d.top,
              left: d.left,
              animationDelay: d.delay,
              animationDuration: d.duration,
              animationPlayState: playState,
            }}
          />
        ))}
      </div>
    </div>
  );
}
