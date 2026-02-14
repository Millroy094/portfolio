"use client";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { memo, useEffect, useMemo, useState } from "react";

import type { ISourceOptions } from "@tsparticles/engine";

function BackgroundParticles() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: { value: "#0b0a09" },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "bubble" },
          resize: { enable: true },
        },
        modes: {
          bubble: {
            distance: 80,
            duration: 0.6,
            opacity: 0.95,
            size: 6.4,
            color: { value: ["#FFA500", "#FFB000", "#FFC107", "#FFD27F"] },
          },
        },
      },
      particles: {
        color: { value: ["#FFA500", "#FFB000", "#FFC107", "#FF9900"] },
        links: { enable: false },
        move: {
          enable: true,
          direction: "none",
          random: true,
          speed: 0.32,
          straight: false,
          outModes: { default: "bounce" },
        },
        number: {
          density: { enable: true },
          value: 220,
        },
        opacity: {
          value: { min: 0.2, max: 0.52 },
          animation: {
            enable: true,
            speed: 0.6,
            minimumValue: 0.2,
            startValue: "random",
            sync: false,
          },
        },
        shape: { type: "circle" },
        size: {
          value: { min: 1, max: 3.6 },
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.95,
            startValue: "random",
            sync: false,
          },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return init && <Particles id="tsparticles" options={options} style={{ zIndex: 1 }} />;
}

export default memo(BackgroundParticles);
