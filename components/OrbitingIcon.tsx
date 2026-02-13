import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createIconTexture } from "./createIconTexture";

type Props = {
  position: THREE.Vector3;
  render: () => React.ReactNode;
  orbitSpeed: number;
};

export function OrbitingIcon({
  position,
  render,
  orbitSpeed,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const texture = useMemo(() => createIconTexture(render), [render]);

  const angle = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    angle.current += orbitSpeed * delta;

    const radius = position.length();

    meshRef.current.position.x =
      Math.cos(angle.current) * radius;
    meshRef.current.position.z =
      Math.sin(angle.current) * radius;
    meshRef.current.position.y = position.y;

    // Always face camera
    meshRef.current.lookAt(camera.position);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.2, 1.2]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}