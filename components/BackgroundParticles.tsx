"use client";

import { loadFirePreset } from "@tsparticles/preset-fire";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { memo, useMemo } from "react";

import type { Engine, ISourceOptions } from "@tsparticles/engine";

function BackgroundParticles() {
  const options: ISourceOptions = useMemo(
    () => ({
      preset: "fire",
    }),
    [],
  );

  return (
    <ParticlesProvider init={async (engine: Engine) => await loadFirePreset(engine)}>
      <Particles id="tsparticles" options={options} />
    </ParticlesProvider>
  );
}

export default memo(BackgroundParticles);
