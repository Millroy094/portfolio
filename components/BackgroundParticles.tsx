"use client";

import { loadFirePreset } from "@tsparticles/preset-fire";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { memo, useEffect, useMemo, useState } from "react";

import type { ISourceOptions } from "@tsparticles/engine";

function BackgroundParticles() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFirePreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      preset: "fire",
    }),
    [],
  );

  return init && <Particles id="tsparticles" options={options} />;
}

export default memo(BackgroundParticles);
