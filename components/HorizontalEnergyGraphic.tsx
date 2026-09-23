"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  /** Number of rungs (base pairs) drawn along the helix */
  rungCount?: number;
  /** Number of traveling spark particles per border stream */
  sparkCount?: number;
};

const SPARK_LAYOUT = [
  { offset: "0%", size: 4, duration: 3.2, delay: 0, variant: 1 },
  { offset: "-8%", size: 3, duration: 4.1, delay: 0.6, variant: 2 },
  { offset: "10%", size: 3, duration: 3.6, delay: 1.2, variant: 3 },
];

const BASE_VIEW_WIDTH = 300;
const VIEW_HEIGHT = 40;
const AMPLITUDE = 12;
const CENTER_Y = 20;
const BASE_TWISTS = 3;
const TWIST_PERIOD = BASE_VIEW_WIDTH / BASE_TWISTS;
const ROTATION_FRAMES = 12;
const ROTATION_DURATION = "6s";

function buildPathFromPoints(points: { x: number; y: number }[]): string {
  if (points.length < 3) {
    return `M ${points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")}`;
  }

  const segments: string[] = [`M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`];
  for (let i = 1; i < points.length - 1; i += 1) {
    const curr = points[i];
    const next = points[i + 1];
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    segments.push(
      `Q ${curr.x.toFixed(1)},${curr.y.toFixed(1)} ${midX.toFixed(1)},${midY.toFixed(1)}`,
    );
  }
  const last = points[points.length - 1];
  segments.push(`L ${last.x.toFixed(1)},${last.y.toFixed(1)}`);
  return segments.join(" ");
}

function buildFrames(rungCount: number, viewWidth: number, twists: number) {
  const steps = Math.max(60, Math.round(twists * 32));
  const baseSamples = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return { t, x: t * viewWidth };
  });

  const rungIndices = (() => {
    const step = Math.floor(baseSamples.length / rungCount);
    const idxs: number[] = [];
    for (let i = step; i < baseSamples.length - 1; i += step) idxs.push(i);
    return idxs;
  })();

  const strandAFrames: string[] = [];
  const strandBFrames: string[] = [];
  const rungYA: number[][] = rungIndices.map(() => []);
  const rungYB: number[][] = rungIndices.map(() => []);
  const nodeAFrames: number[][] = rungIndices.map(() => []);
  const nodeBFrames: number[][] = rungIndices.map(() => []);

  for (let f = 0; f <= ROTATION_FRAMES; f += 1) {
    const rotation = (f / ROTATION_FRAMES) * Math.PI * 2;
    const points: { yA: number; yB: number; x: number }[] = baseSamples.map((s) => {
      const phase = s.t * Math.PI * 2 * twists + rotation;
      return {
        yA: CENTER_Y + AMPLITUDE * Math.sin(phase),
        yB: CENTER_Y - AMPLITUDE * Math.sin(phase),
        x: s.x,
      };
    });

    strandAFrames.push(buildPathFromPoints(points.map((p) => ({ x: p.x, y: p.yA }))));
    strandBFrames.push(buildPathFromPoints(points.map((p) => ({ x: p.x, y: p.yB }))));

    rungIndices.forEach((idx, ri) => {
      rungYA[ri].push(points[idx].yA);
      rungYB[ri].push(points[idx].yB);
      nodeAFrames[ri].push(points[idx].yA);
      nodeBFrames[ri].push(points[idx].yB);
    });
  }

  return {
    strandA: strandAFrames[0],
    strandAValues: strandAFrames.join(";"),
    strandB: strandBFrames[0],
    strandBValues: strandBFrames.join(";"),
    rungs: rungIndices.map((idx, ri) => ({
      x: baseSamples[idx].x,
      yA0: rungYA[ri][0],
      yB0: rungYB[ri][0],
      yAValues: rungYA[ri].map((v) => v.toFixed(1)).join(";"),
      yBValues: rungYB[ri].map((v) => v.toFixed(1)).join(";"),
      nodeAValues: nodeAFrames[ri].map((v) => v.toFixed(1)).join(";"),
      nodeBValues: nodeBFrames[ri].map((v) => v.toFixed(1)).join(";"),
    })),
  };
}

/** Horizontal double-helix energy ribbon, sized to fill the width of its container. */
export default function HorizontalEnergyGraphic({
  className,
  style,
  rungCount = 14,
  sparkCount = 3,
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

  const colRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: BASE_VIEW_WIDTH, height: 60 });

  useEffect(() => {
    const el = colRef.current;
    if (!el) return undefined;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      const rounded = { width: Math.round(width / 8) * 8, height: Math.round(height / 4) * 4 };
      setSize((prev) =>
        prev.width === rounded.width && prev.height === rounded.height ? prev : rounded,
      );
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { viewWidth, twists } = useMemo(() => {
    const aspect = size.width / size.height;
    const width = VIEW_HEIGHT * aspect;
    const rawTwists = width / TWIST_PERIOD;
    return { viewWidth: width, twists: Math.min(8, Math.max(2, rawTwists)) };
  }, [size]);

  const frames = useMemo(
    () => buildFrames(rungCount, viewWidth, twists),
    [rungCount, viewWidth, twists],
  );
  const sparks = useMemo(() => SPARK_LAYOUT.slice(0, sparkCount), [sparkCount]);
  const animate = inView && !reducedMotion;

  return (
    <div
      ref={ref}
      className={["horizontal-energy-col", className].filter(Boolean).join(" ")}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "4rem",
        ...style,
      }}
    >
      <div className="stream-row stream-row-top stream-row-experience" aria-hidden="true">
        <div className="stream-track-h" />
        {sparks.map((s, i) => (
          <span
            key={`t-${i}`}
            className={`stream-spark-h stream-spark-h-v${s.variant}`}
            style={{
              top: `calc(50% + ${s.offset})`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              animationPlayState: playState,
            }}
          />
        ))}
      </div>

      <div className="horizontal-energy-inner" ref={colRef}>
        <div className="helix-glow" />
        <svg
          className="helix-svg"
          viewBox={`0 0 ${viewWidth.toFixed(1)} ${VIEW_HEIGHT}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="horizontal-rung-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.6)" />
              <stop offset="100%" stopColor="rgba(212, 212, 216, 0.6)" />
            </linearGradient>
            <linearGradient id="horizontal-endcap-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.9)" />
              <stop offset="100%" stopColor="rgba(14, 116, 178, 0.9)" />
            </linearGradient>
          </defs>
          {frames.rungs.map((r, ri) => (
            <line key={`rung-${ri}`} className="helix-rung" x1={r.x} y1={r.yA0} x2={r.x} y2={r.yB0}>
              {animate && (
                <>
                  <animate
                    attributeName="y1"
                    values={r.yAValues}
                    dur={ROTATION_DURATION}
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                  <animate
                    attributeName="y2"
                    values={r.yBValues}
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

          {frames.rungs.map((r, ri) => (
            <g key={`nodes-${ri}`}>
              <circle
                className="helix-node helix-node-a"
                cx={r.x}
                cy={r.yA0}
                r={2.6}
                fill="rgba(56, 189, 248, 0.95)"
              >
                {animate && (
                  <animate
                    attributeName="cy"
                    values={r.nodeAValues}
                    dur={ROTATION_DURATION}
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                )}
              </circle>
              <circle
                className="helix-node helix-node-b"
                cx={r.x}
                cy={r.yB0}
                r={2.6}
                fill="rgba(239, 68, 68, 0.85)"
              >
                {animate && (
                  <animate
                    attributeName="cy"
                    values={r.nodeBValues}
                    dur={ROTATION_DURATION}
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                )}
              </circle>
            </g>
          ))}

          <g className="helix-endcap" transform="translate(0, 0)">
            <rect
              x="-3.2"
              y="6"
              width="6.4"
              height="28"
              rx="3.2"
              className="helix-endcap-housing"
            />
          </g>
          <g className="helix-endcap" transform={`translate(${viewWidth.toFixed(1)}, 0)`}>
            <rect
              x="-3.2"
              y="6"
              width="6.4"
              height="28"
              rx="3.2"
              className="helix-endcap-housing"
            />
          </g>
        </svg>
      </div>

      <div className="stream-row stream-row-bottom stream-row-education" aria-hidden="true">
        <div className="stream-track-h" />
        {sparks.map((s, i) => (
          <span
            key={`b-${i}`}
            className={`stream-spark-h stream-spark-h-v${s.variant}`}
            style={{
              top: `calc(50% + ${s.offset})`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay + 0.4}s`,
              animationPlayState: playState,
            }}
          />
        ))}
      </div>
    </div>
  );
}
