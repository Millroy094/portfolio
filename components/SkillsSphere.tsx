import { Html, useThree } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { fibonacciSphere } from "./fibonacciSphere";
import { getSkillById, SkillId } from "@/skills";

type Props = {
  skillIds: SkillId[];
  radius?: number;
};

export function SkillsSphere({ skillIds, radius = 3 }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const velocity = useRef({ x: 0.002, y: 0.002 });

  const [isDragging, setIsDragging] = useState(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const skills = useMemo(
    () => skillIds.map((id) => getSkillById(id)),
    [skillIds]
  );

  const positions = useMemo(
    () => fibonacciSphere(skills.length, radius),
    [skills.length, radius]
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    if (!isDragging) {
      groupRef.current.rotation.y += velocity.current.x;
      groupRef.current.rotation.x += velocity.current.y;

      velocity.current.x *= 0.98;
      velocity.current.y *= 0.98;
    }

    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.6) * 0.2;
  });

  const handlePointerDown = (e: any) => {
    setIsDragging(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => setIsDragging(false);

  const handlePointerMove = (e: any) => {
    if (!isDragging || !groupRef.current) return;

    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;

    groupRef.current.rotation.y += dx * 0.005;
    groupRef.current.rotation.x += dy * 0.005;

    velocity.current = {
      x: dx * 0.0005,
      y: dy * 0.0005,
    };

    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial wireframe color="#222" />
      </mesh>

      {skills.map((skill, index) => (
        <OrbitingIcon
    key={skill.id}
    position={positions[index]}
    render={skill.render}
    orbitSpeed={0.5 + Math.random() * 0.5}
        />
      ))}
    </group>
  );
}