"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SkillsSphere } from "./SkillsSphere";
import { SkillId } from "@/skills";

type Props = {
  skillIds: SkillId[];
  radius?: number;
  height?: number | string;
};

export function SkillsGlobe({
  skillIds,
  radius = 3,
  height = 600,
}: Props) {
  if (!skillIds.length) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ height, width: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <SkillsSphere skillIds={skillIds} radius={radius} />

      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </Canvas>
  );
}