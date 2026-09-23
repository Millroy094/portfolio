"use client";

import { loadFirePreset } from "@tsparticles/preset-fire";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { memo, useMemo, useSyncExternalStore } from "react";

import type { Engine, ISourceOptions } from "@tsparticles/engine";

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function BackgroundParticles() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const options: ISourceOptions = useMemo(
    () => ({
      preset: "fire",
    }),
    [],
  );

  if (prefersReducedMotion) return null;

  return (
    <ParticlesProvider init={async (engine: Engine) => await loadFirePreset(engine)}>
      <Particles id="tsparticles" options={options} />
    </ParticlesProvider>
  );
}

export default memo(BackgroundParticles);
