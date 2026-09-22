"use client";

import { useInView } from "react-intersection-observer";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const PARTICLES = [
  { top: "12%", left: "10%", delay: "0s" },
  { top: "20%", left: "88%", delay: "0.6s" },
  { top: "78%", left: "92%", delay: "1.2s" },
  { top: "84%", left: "14%", delay: "1.8s" },
  { top: "45%", left: "4%", delay: "2.4s" },
  { top: "40%", left: "96%", delay: "3s" },
];

const AMBIENT_DRIFTERS = [
  { top: "10%", left: "4%", delay: "0s", duration: "9s" },
  { top: "82%", left: "8%", delay: "1.5s", duration: "11s" },
  { top: "14%", left: "94%", delay: "3s", duration: "10s" },
  { top: "76%", left: "92%", delay: "4.5s", duration: "8s" },
];

const STRIP_BARS = [
  { duration: "2.4s", delay: "0s" },
  { duration: "3.1s", delay: "0.4s" },
  { duration: "2.7s", delay: "0.8s" },
  { duration: "3.4s", delay: "1.2s" },
];

/** HUD-style panel for the About Me section: identity orbit + rotating data core. */
export default function AboutMeGraphic({ className, style }: Props) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });
  const playState = inView ? "running" : "paused";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "16rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <div className="ambient-field" aria-hidden="true">
        {AMBIENT_DRIFTERS.map((d) => (
          <span
            key={`${d.top}-${d.left}`}
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

      <div
        className="relative flex h-full w-full flex-col items-center justify-center gap-3"
        style={{ maxWidth: "28rem" }}
      >
        <div
          className="relative w-full"
          style={{
            aspectRatio: "8 / 5",
            maxHeight: "calc(100% - 3.25rem)",
          }}
        >
          <div className="tech-ambient-glow" />

          <div className="tech-frame">
            <span className="tech-corner tech-corner-tl" />
            <span className="tech-corner tech-corner-tr" />
            <span className="tech-corner tech-corner-bl" />
            <span className="tech-corner tech-corner-br" />
            <div className="tech-grid" />
            <div className="tech-crosshair" />
            <div className="tech-scanline" style={{ animationPlayState: playState }} />

            {PARTICLES.map((p) => (
              <span
                key={`${p.top}-${p.left}`}
                className="identity-particle"
                style={{
                  top: p.top,
                  left: p.left,
                  animationDelay: p.delay,
                  animationPlayState: playState,
                }}
              />
            ))}

            <span className="tech-label tech-label-tl">SYS.ID</span>
            <span className="tech-label tech-label-br">DATA.CORE</span>
            <div className="tech-outer-ring" style={{ animationPlayState: playState }} />

            <div className="relative z-10 flex h-full w-full items-center justify-center gap-2 px-4">
              <div className="flex flex-1 items-center justify-center">
                <div className="identity-orbit-wrap identity-orbit-wrap-compact">
                  <div
                    className="identity-ring identity-ring-outer"
                    style={{ animationPlayState: playState }}
                  >
                    <span className="identity-marker" />
                  </div>
                  <div
                    className="identity-ring identity-ring-mid"
                    style={{ animationPlayState: playState }}
                  >
                    <span className="identity-marker identity-marker-sm" />
                    <span className="identity-marker identity-marker-sm identity-marker-opposite" />
                  </div>
                  <div
                    className="identity-ring identity-ring-inner"
                    style={{ animationPlayState: playState }}
                  >
                    <span className="identity-marker identity-marker-sm" />
                  </div>
                  <div className="identity-core" />
                </div>
              </div>

              <div className="tech-panel-divider" />

              <div className="flex flex-1 items-center justify-center">
                <div className="scan-core-scene scan-core-scene-compact">
                  <div className="scan-core-spin" style={{ animationPlayState: playState }}>
                    <div className="scan-core-face scan-core-face-1" />
                    <div className="scan-core-face scan-core-face-2" />
                    <div className="scan-core-face scan-core-face-3" />
                    <div className="scan-core-face scan-core-face-4" />
                    <div className="scan-core-face scan-core-face-5" />
                    <div className="scan-core-face scan-core-face-6" />
                  </div>
                  <div className="scan-core-ray-mask">
                    <div className="scan-core-ray" style={{ animationPlayState: playState }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tech-strip">
          <div className="tech-strip-header">
            <span>SYS.LOAD</span>
            <span>SYNC</span>
          </div>
          {STRIP_BARS.map((bar) => (
            <div key={bar.delay} className="tech-strip-bar">
              <span
                className="tech-strip-bar-fill"
                style={{
                  animationDuration: bar.duration,
                  animationDelay: bar.delay,
                  animationPlayState: playState,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
