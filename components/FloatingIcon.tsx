// components/FloatingIcon.tsx
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createIconTexture } from "./SkillsGlobe/createIconTexture";

type FloatingIconProps = {
  anchor: THREE.Vector3;
  render: () => React.ReactElement;
  worldSize?: number;
  amplitude?: number;
  speed?: number;
  safeMargin?: number;
  textureSize?: number;
  iconScale?: number;
  padding?: number;
};

export function FloatingIcon({
  anchor,
  render,
  worldSize = 0.9,
  amplitude = 0.18,
  speed = 0.5,
  safeMargin = 0.9,
  textureSize = 192,
  iconScale = 0.7,
  padding = 16,
}: FloatingIconProps) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const { camera } = useThree();

  // Texture: fine to compute here (pure)
  const texture = useMemo(
    () =>
      createIconTexture(render, {
        size: textureSize,
        iconScale,
        padding,
        bleedPct: 0.06,
      }),
    [render, textureSize, iconScale, padding],
  );

  // Randomized phases/freqs/amps — populated once in an effect
  const phasesRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const freqsRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const ampsRef = useRef<{ x: number; y: number; z: number } | null>(null);

  useEffect(() => {
    // Initialize once after mount (OK to use Math.random here)
    phasesRef.current = {
      x: Math.random() * Math.PI * 2,
      y: Math.random() * Math.PI * 2,
      z: Math.random() * Math.PI * 2,
    };
    freqsRef.current = {
      x: speed * (0.8 + Math.random() * 0.6),
      y: speed * (0.8 + Math.random() * 0.6),
      z: speed * (0.8 + Math.random() * 0.6),
    };
    ampsRef.current = {
      x: amplitude * (0.6 + Math.random() * 0.8),
      y: amplitude * (0.6 + Math.random() * 0.8),
      z: amplitude * 0.4,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only once

  // Helpers for visible rect at Z
  function visibleHeightAtZDepth(z: number, cam: THREE.PerspectiveCamera) {
    const depth = Math.abs(z - cam.position.z);
    const vFOV = (cam.fov * Math.PI) / 180;
    return 2 * Math.tan(vFOV / 2) * depth;
  }
  function visibleWidthAtZDepth(z: number, cam: THREE.PerspectiveCamera) {
    return visibleHeightAtZDepth(z, cam) * cam.aspect;
  }

  // local anchor copy we clamp
  const base = useRef(anchor.clone());

  useFrame((state) => {
    if (!spriteRef.current) return;
    if (!phasesRef.current || !freqsRef.current || !ampsRef.current) return; // not initialized yet

    const t = state.clock.getElapsedTime();

    // Clamp anchor to screen rect at its Z
    const z = base.current.z;
    const fullW = visibleWidthAtZDepth(z, camera as THREE.PerspectiveCamera);
    const fullH = visibleHeightAtZDepth(z, camera as THREE.PerspectiveCamera);
    const halfW = (fullW * safeMargin) / 2;
    const halfH = (fullH * safeMargin) / 2;

    const margin = worldSize / 2;
    base.current.x = Math.max(-halfW + margin, Math.min(halfW - margin, base.current.x));
    base.current.y = Math.max(-halfH + margin, Math.min(halfH - margin, base.current.y));

    const { x: phx, y: phy, z: phz } = phasesRef.current;
    const { x: fx, y: fy, z: fz } = freqsRef.current;
    const { x: ax, y: ay, z: az } = ampsRef.current;

    const ox = Math.sin(t * fx + phx) * ax;
    const oy = Math.cos(t * fy + phy) * ay;
    const oz = Math.sin(t * fz + phz) * az;

    spriteRef.current.position.set(base.current.x + ox, base.current.y + oy, z + oz);
  });

  return (
    <sprite ref={spriteRef} scale={[worldSize, worldSize, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} depthTest={false} />
    </sprite>
  );
}
