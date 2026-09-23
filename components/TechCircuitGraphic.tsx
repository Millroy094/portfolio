"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const CENTER = 100;

const TICK_COUNT = 24;
const TICKS = Array.from({ length: TICK_COUNT }, (_, i) => {
  const angle = (i / TICK_COUNT) * Math.PI * 2;
  const long = i % 3 === 0;
  const outer = 96;
  const inner = long ? 86 : 91;
  return {
    key: `tick-${i}`,
    x1: CENTER + outer * Math.cos(angle),
    y1: CENTER + outer * Math.sin(angle),
    x2: CENTER + inner * Math.cos(angle),
    y2: CENTER + inner * Math.sin(angle),
  };
});

const NODES = [
  { angle: -35, radius: 80, variant: "a" },
  { angle: 55, radius: 60, variant: "b" },
  { angle: 150, radius: 80, variant: "a" },
  { angle: 210, radius: 40, variant: "b" },
  { angle: 300, radius: 60, variant: "a" },
].map((n, i) => {
  const rad = (n.angle * Math.PI) / 180;
  return {
    key: `node-${i}`,
    x: CENTER + n.radius * Math.cos(rad),
    y: CENTER + n.radius * Math.sin(rad),
    variant: n.variant,
  };
});

// Small "via" dots scattered between the rings for extra circuit-board texture.
// One traveling spark per PCB ring, so every ring reads as "live" rather than just
// the outermost one. Durations/directions are staggered so they don't line up.
const RING_SPARKS = [
  { radius: 95, dur: "7s", sweep: 1, className: "circuit-spark-a" },
  { radius: 80, dur: "9s", sweep: 0, className: "circuit-spark-b" },
  { radius: 70, dur: "6s", sweep: 1, className: "circuit-spark-a" },
  { radius: 60, dur: "8s", sweep: 0, className: "circuit-spark-b" },
  { radius: 40, dur: "5s", sweep: 1, className: "circuit-spark-a" },
].map((s, i) => ({
  key: `spark-${i}`,
  ...s,
  path: `M ${CENTER + s.radius} ${CENTER} A ${s.radius} ${s.radius} 0 1 ${s.sweep} ${CENTER - s.radius} ${CENTER} A ${s.radius} ${s.radius} 0 1 ${s.sweep} ${CENTER + s.radius} ${CENTER}`,
}));

// Layered circular orbits around the core "planet": each layer is a ring of a few
// planets, evenly spaced, that all rotate together as one rigid disc (uniform speed
// per layer, no independent per-planet motion) - like rings of moons.
const ORBIT_LAYERS = [
  {
    key: "orbit-layer-0",
    radius: 16,
    dur: "10s",
    reverse: false,
    planets: [
      { angle: 0, variant: "red" },
      { angle: 180, variant: "blue" },
    ],
  },
  {
    key: "orbit-layer-1",
    radius: 24,
    dur: "16s",
    reverse: true,
    planets: [
      { angle: 0, variant: "white" },
      { angle: 120, variant: "red" },
      { angle: 240, variant: "blue" },
    ],
  },
  {
    key: "orbit-layer-2",
    radius: 32,
    dur: "22s",
    reverse: false,
    planets: [
      { angle: 0, variant: "blue" },
      { angle: 90, variant: "white" },
      { angle: 180, variant: "red" },
      { angle: 270, variant: "white" },
    ],
  },
].map((layer) => ({
  ...layer,
  planets: layer.planets.map((p) => ({
    ...p,
    x: CENTER + layer.radius * Math.cos((p.angle * Math.PI) / 180),
    y: CENTER + layer.radius * Math.sin((p.angle * Math.PI) / 180),
  })),
}));

const VIAS = [
  { angle: 20, radius: 70 },
  { angle: 95, radius: 50 },
  { angle: 130, radius: 70 },
  { angle: 195, radius: 88 },
  { angle: 250, radius: 50 },
  { angle: 320, radius: 88 },
].map((v, i) => {
  const rad = (v.angle * Math.PI) / 180;
  return {
    key: `via-${i}`,
    x: CENTER + v.radius * Math.cos(rad),
    y: CENTER + v.radius * Math.sin(rad),
  };
});

// Manhattan-routed PCB-style traces starting exactly at the solid ring (r = 80) and
// running inward to pads, so nothing extends past the solid ring boundary. Evenly
// spaced by angle (with alternating elbow direction/depth) so they radiate without
// crossing each other.
const TRACES = [
  "M178.3,116.6 L148.9,116.6 L148.9,110.4",
  "M163.3,148.9 L163.3,141.6 L153.8,141.6",
  "M135.8,171.6 L122.4,171.6 L122.4,144.7",
  "M101.2,180.0 L101.2,168.0 L101.0,168.0",
  "M66.4,172.6 L79.0,172.6 L79.0,145.4",
  "M38.2,150.8 L38.2,143.2 L47.5,143.2",
  "M22.3,119.0 L51.4,119.0 L51.4,111.9",
  "M21.7,83.4 L21.7,85.9 L33.5,85.9",
  "M36.7,51.1 L60.4,51.1 L60.4,69.4",
  "M64.2,28.4 L64.2,39.2 L69.6,39.2",
  "M98.8,20.0 L99.3,20.0 L99.3,50.0",
  "M133.6,27.4 L133.6,38.3 L128.6,38.3",
  "M161.8,49.2 L138.6,49.2 L138.6,68.2",
  "M177.7,81.0 L177.7,83.9 L166.1,83.9",
];

const TRACE_PADS = [
  { key: "pad-1", x: 148.9, y: 110.4 },
  { key: "pad-2", x: 153.8, y: 141.6 },
  { key: "pad-3", x: 122.4, y: 144.7 },
  { key: "pad-4", x: 101, y: 168 },
  { key: "pad-5", x: 79, y: 145.4 },
  { key: "pad-6", x: 47.5, y: 143.2 },
  { key: "pad-7", x: 51.4, y: 111.9 },
  { key: "pad-8", x: 33.5, y: 85.9 },
  { key: "pad-9", x: 60.4, y: 69.4 },
  { key: "pad-10", x: 69.6, y: 39.2 },
  { key: "pad-11", x: 99.3, y: 50 },
  { key: "pad-12", x: 128.6, y: 38.3 },
  { key: "pad-13", x: 138.6, y: 68.2 },
  { key: "pad-14", x: 166.1, y: 83.9 },
];

/** Radial tech-circuit burst used as a wide background underlay behind the timeline columns. */
export default function TechCircuitGraphic({ className, style }: Props) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const playState = inView && !reducedMotion ? "running" : "paused";

  return (
    <div ref={ref} className={["circuit-col", className].filter(Boolean).join(" ")} style={style}>
      <div className="circuit-svg">
        <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
          <circle className="circuit-ring circuit-ring-a" cx={CENTER} cy={CENTER} r={95} />
          <circle className="circuit-ring circuit-ring-b" cx={CENTER} cy={CENTER} r={80} />
          <circle className="circuit-ring circuit-ring-e" cx={CENTER} cy={CENTER} r={70} />
          <circle className="circuit-ring circuit-ring-c" cx={CENTER} cy={CENTER} r={60} />
          <circle className="circuit-ring circuit-ring-d" cx={CENTER} cy={CENTER} r={40} />

          {TRACES.map((d, i) => (
            <path key={`trace-${i}`} className="circuit-trace" d={d} />
          ))}

          {TRACE_PADS.map((p) => (
            <rect
              key={p.key}
              className="circuit-pad"
              x={p.x - 2.2}
              y={p.y - 2.2}
              width={4.4}
              height={4.4}
            />
          ))}

          <g
            className="circuit-tick-group"
            style={{ animationPlayState: playState, transformOrigin: "100px 100px" }}
          >
            {TICKS.map((t) => (
              <line key={t.key} className="circuit-tick" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
            ))}
          </g>

          {VIAS.map((v) => (
            <circle key={v.key} className="circuit-via" cx={v.x} cy={v.y} r={1} />
          ))}

          <g
            className="circuit-node-group"
            style={{ animationPlayState: playState, transformOrigin: "100px 100px" }}
          >
            {NODES.map((n) => (
              <circle
                key={n.key}
                className={`circuit-node circuit-node-${n.variant}`}
                cx={n.x}
                cy={n.y}
                r={2}
                style={{ animationPlayState: playState }}
              />
            ))}
          </g>

          {RING_SPARKS.map((s) => (
            <circle key={s.key} className={`circuit-spark ${s.className}`} r={2}>
              {playState === "running" && (
                <animateMotion dur={s.dur} repeatCount="indefinite" path={s.path} />
              )}
            </circle>
          ))}

          <g className="circuit-orb">
            {ORBIT_LAYERS.map((layer) => (
              <g
                key={layer.key}
                className="circuit-orb-layer"
                style={{
                  animationPlayState: playState,
                  animationDuration: layer.dur,
                  animationDirection: layer.reverse ? "reverse" : "normal",
                  transformOrigin: "100px 100px",
                }}
              >
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={layer.radius}
                  className={`circuit-orb-layer-ring ${layer.key === "orbit-layer-0" ? "circuit-orb-layer-ring-inner" : ""}`}
                />
                {layer.planets.map((p, i) => (
                  <circle
                    key={`${layer.key}-planet-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={1.8}
                    className={`circuit-orbiting-orb circuit-orbiting-orb-${p.variant}`}
                  />
                ))}
              </g>
            ))}
            <circle cx={CENTER} cy={CENTER} r={9} className="circuit-orb-core" />

            <line
              x1={CENTER}
              y1={CENTER - 24}
              x2={CENTER}
              y2={CENTER - 16}
              className="circuit-orb-crosshair"
            />
            <line
              x1={CENTER}
              y1={CENTER + 16}
              x2={CENTER}
              y2={CENTER + 40}
              className="circuit-orb-crosshair"
            />
            <line
              x1={CENTER - 24}
              y1={CENTER}
              x2={CENTER - 16}
              y2={CENTER}
              className="circuit-orb-crosshair"
            />
            <line
              x1={CENTER + 16}
              y1={CENTER}
              x2={CENTER + 24}
              y2={CENTER}
              className="circuit-orb-crosshair"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
