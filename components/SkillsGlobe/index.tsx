"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import type { SkillId } from "@/components/controls/SkillSelect/SkillRegistery";

import { SkillsSphere } from "./SkillsSphere";

type Props = {
  skillIds: SkillId[];
  radius?: number;
  height?: number | string;
};

export function SkillsGlobe({ skillIds, radius = 3, height = 600 }: Props) {
  if (!skillIds.length) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{
        alpha: true, // ✅ transparent canvas
        antialias: true,
        powerPreference: "high-performance",
        depth: true,
        stencil: false,
        logarithmicDepthBuffer: false,
        premultipliedAlpha: true,
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
        gl.sortObjects = true;
        gl.setClearColor(0x000000, 0); // ✅ transparent clear
      }}
      style={{ height, width: "100%", background: "transparent", touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} />

      <SkillsSphere skillIds={skillIds} radius={radius} />
    </Canvas>
  );
}
