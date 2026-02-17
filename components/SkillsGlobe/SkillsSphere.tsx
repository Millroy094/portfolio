"use client";

import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { getSkillById, SkillId } from "@/components/controls/SkillSelect/SkillRegistery";
import { createIconTexture } from "./createIconTexture";

/* =======================================================================================
 * Helpers
 * ======================================================================================= */
function fibonacciSphereSurface(count: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const n = Math.max(1, count);
  const offset = 2 / n;
  const increment = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    pts.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }
  return pts;
}

function visibleHeightAtZDepth(z: number, cam: THREE.PerspectiveCamera) {
  const depth = Math.abs(z - cam.position.z);
  const vFOV = (cam.fov * Math.PI) / 180;
  return 2 * Math.tan(vFOV / 2) * depth;
}
function visibleWidthAtZDepth(z: number, cam: THREE.PerspectiveCamera) {
  return visibleHeightAtZDepth(z, cam) * cam.aspect;
}

/** Deterministic PRNG helpers (pure, ESLint-safe) */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash3(x: number, y: number, z: number, salt = 0) {
  let h = 2166136261 ^ Math.imul(Math.floor(x * 1e4), 16777619);
  h = Math.imul(h ^ Math.floor(y * 1e4), 16777619);
  h = Math.imul(h ^ Math.floor(z * 1e4), 16777619);
  h = Math.imul(h ^ salt, 16777619);
  return h >>> 0;
}

/* =======================================================================================
 * FloatingIcon — gentle float, clamped inside the globe (deterministic)
 * ======================================================================================= */
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

  globeRadius: number;
  globeMargin?: number;
  renderOrder?: number;

  seedSalt?: number; // pass the index
};

function FloatingIcon({
  anchor,
  render,
  worldSize = 0.7,
  amplitude = 0.1,
  speed = 0.3,
  safeMargin = 0.92,
  textureSize = 192,
  iconScale = 0.64,
  padding = 16,
  globeRadius,
  globeMargin = 0.03,
  renderOrder = 2,
  seedSalt = 0,
}: FloatingIconProps) {
  const spriteRef = useRef<THREE.Sprite>(null);

  const texture = useMemo(
    () =>
      createIconTexture(render, {
        size: textureSize,
        iconScale,
        padding,
        bleedPct: 0.05,
        filters: { mipmaps: true },
      }),
    [render, textureSize, iconScale, padding],
  );

  /** Deterministic “random” init (pure) */
  const seed = useMemo(
    () => hash3(anchor.x, anchor.y, anchor.z, seedSalt),
    [anchor.x, anchor.y, anchor.z, seedSalt],
  );
  const rng = useMemo(() => mulberry32(seed), [seed]);

  const phasesRef = useRef({
    x: rng() * Math.PI * 2,
    y: rng() * Math.PI * 2,
    z: rng() * Math.PI * 2,
  });
  const freqsRef = useRef({
    x: speed * (0.85 + rng() * 0.4),
    y: speed * (0.85 + rng() * 0.4),
    z: speed * (0.85 + rng() * 0.4),
  });
  const ampsRef = useRef({
    x: amplitude * (0.6 + rng() * 0.6),
    y: amplitude * (0.6 + rng() * 0.6),
    z: amplitude * 0.3,
  });

  const base = useRef(anchor.clone());

  useFrame((state) => {
    if (!spriteRef.current) return;

    const cam = state.camera as THREE.PerspectiveCamera;
    const t = state.clock.getElapsedTime();

    // Keep (x,y) anchor on screen if user rotates a lot
    const z = base.current.z;
    const fullW = visibleWidthAtZDepth(z, cam);
    const fullH = visibleHeightAtZDepth(z, cam);
    const halfW = (fullW * safeMargin) / 2;
    const halfH = (fullH * safeMargin) / 2;
    const margin = worldSize / 2;

    base.current.x = Math.max(-halfW + margin, Math.min(halfW - margin, base.current.x));
    base.current.y = Math.max(-halfH + margin, Math.min(halfH - margin, base.current.y));

    const { x: phx, y: phy, z: phz } = phasesRef.current;
    const { x: fx, y: fy, z: fz } = freqsRef.current;
    const { x: ax, y: ay, z: az } = ampsRef.current;

    // Gentle float (no orbit)
    const ox = Math.sin(t * fx + phx) * ax;
    const oy = Math.cos(t * fy + phy) * ay;
    const oz = Math.sin(t * fz + phz) * az;

    // Clamp so the whole sprite stays inside the globe
    const proposed = new THREE.Vector3(
      base.current.x + ox,
      base.current.y + oy,
      base.current.z + oz,
    );
    const spriteHalfDiag = (Math.SQRT2 * worldSize) / 2;
    const maxR = Math.max(0.0001, globeRadius - spriteHalfDiag - globeMargin);
    const len = proposed.length();
    if (len > maxR) proposed.multiplyScalar(maxR / len);

    spriteRef.current.position.copy(proposed);
  });

  return (
    <sprite ref={spriteRef} scale={[worldSize, worldSize, 1]} renderOrder={renderOrder}>
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </sprite>
  );
}

/* =======================================================================================
 * StableAura — flicker-free rim + faint core (opaque additive, no depth)
 * ======================================================================================= */
type StableAuraProps = {
  radius: number;
  color?: string;
  rimIntensity?: number;
  coreIntensity?: number;
  rimPower?: number;
  speed?: number;
  inflate?: number;
  renderOrder?: number;
};

function StableAura({
  radius,
  color = "#ff3b3b",
  rimIntensity = 1.0,
  coreIntensity = 0.06,
  rimPower = 2.3,
  speed = 0.2,
  inflate = 1.02,
  renderOrder = -100,
}: StableAuraProps) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uRimIntensity: { value: rimIntensity },
      uCoreIntensity: { value: coreIntensity },
      uRimPower: { value: rimPower },
      uSpeed: { value: speed },
    }),
    [color, rimIntensity, coreIntensity, rimPower, speed],
  );

  useFrame((_, dt) => {
    // eslint-disable-next-line react-hooks/immutability
    uniforms.uTime.value += dt;
  });

  return (
    <group renderOrder={renderOrder}>
      {/* BackSide rim */}
      <mesh>
        <sphereGeometry args={[radius * inflate, 96, 96]} />
        <shaderMaterial
          side={THREE.BackSide}
          transparent={false}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={auraVS}
          fragmentShader={auraRimFS}
          toneMapped={false}
        />
      </mesh>

      {/* Ultra-faint FrontSide core fill */}
      <mesh>
        <sphereGeometry args={[radius * 0.999, 96, 96]} />
        <shaderMaterial
          side={THREE.FrontSide}
          transparent={false}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={auraVS}
          fragmentShader={auraCoreFS}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

const auraVS = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - vWorldPos);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const auraRimFS = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uRimIntensity;
  uniform float uRimPower;
  uniform float uSpeed;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;

  void main() {
    float fres = pow(1.0 - max(0.0, abs(dot(normalize(vNormal), normalize(vViewDir)))), uRimPower);
    float band = 0.5 + 0.5 * sin(uTime * uSpeed + vWorldPos.y * 0.6);
    float glow = fres * mix(0.97, 1.03, band) * uRimIntensity;
    vec3 col = uColor * glow;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const auraCoreFS = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uCoreIntensity;
  uniform float uSpeed;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;

  void main() {
    float band = 0.5 + 0.5 * sin(uTime * uSpeed * 0.5 + vWorldPos.y * 0.3);
    float core = mix(0.9, 1.1, band) * uCoreIntensity;
    vec3 col = uColor * core;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* =======================================================================================
 * SkillsSphere — composition (robust mobile drag + inertia, no `any`)
 * ======================================================================================= */
type Props = {
  skillIds: SkillId[];
  radius?: number;
};

type PointerCaptureElement = Element & {
  setPointerCapture(pointerId: number): void;
  releasePointerCapture(pointerId: number): void;
};

export function SkillsSphere({ skillIds, radius = 3 }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const [isDragging, setIsDragging] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  // Inertia state
  const velocity = useRef({ x: 0, y: 0 }); // angular velocity per frame
  const DAMPING = 0.94; // 0.88 fast stop ←→ 0.98 long spin
  const ROTATION_MULT = 0.004; // pixels to radians multiplier
  const STOP_EPS = 0.00001;

  const skills = useMemo(() => skillIds.map((id) => getSkillById(id)), [skillIds]);

  // Icon presentation tuning
  const worldSize = 0.7;
  const amplitude = 0.1;
  const globeMargin = 0.03;

  const spriteHalfDiag = (Math.SQRT2 * worldSize) / 2;
  const safeRad = Math.max(0.0001, radius - spriteHalfDiag - globeMargin - amplitude * 1.2);

  const positions = useMemo(
    () => fibonacciSphereSurface(skills.length, safeRad),
    [skills.length, safeRad],
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    // Gentle vertical bob
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.28) * 0.09;

    // Apply inertia only while not dragging
    if (!isDragging) {
      groupRef.current.rotation.y += velocity.current.x;
      groupRef.current.rotation.x += velocity.current.y;

      velocity.current.x *= DAMPING;
      velocity.current.y *= DAMPING;

      if (Math.abs(velocity.current.x) < STOP_EPS) velocity.current.x = 0;
      if (Math.abs(velocity.current.y) < STOP_EPS) velocity.current.y = 0;
    }
  });

  /* ===========================
   * Pointer / Touch Handlers
   * =========================== */
  const captureOnTarget = (evtTarget: EventTarget | null, pointerId: number) => {
    if (evtTarget instanceof Element) {
      const el = evtTarget as PointerCaptureElement;
      el.setPointerCapture?.(pointerId);
    }
  };

  const releaseOnTarget = (evtTarget: EventTarget | null, pointerId: number) => {
    if (evtTarget instanceof Element) {
      const el = evtTarget as PointerCaptureElement;
      el.releasePointerCapture?.(pointerId);
    }
  };

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    // Capture pointer on the DOM canvas element
    captureOnTarget(e.target, e.pointerId);

    setIsDragging(true);
    pointerStart.current = { x: e.clientX, y: e.clientY };

    // Reset inertia when a new drag starts (feels more precise)
    velocity.current.x = 0;
    velocity.current.y = 0;

    // Safe preventDefault for touch if cancelable (often unnecessary with touch-action: none)
    const ne = e.nativeEvent;
    if (e.pointerType === "touch" && ne && "cancelable" in ne && ne.cancelable) {
      ne.preventDefault?.();
    }

    // Avoid icons or other children hijacking the event
    e.stopPropagation();
  };

  const endDrag = () => {
    setIsDragging(false);
    pointerStart.current = null;
    // inertia continues via velocity
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    releaseOnTarget(e.target, e.pointerId);
    endDrag();
    e.stopPropagation();
  };

  const onPointerCancel = () => {
    endDrag();
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !groupRef.current || !pointerStart.current) return;

    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;

    // Only rotate if movement > threshold (prevents accidental tiny drags)
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      const ne = e.nativeEvent;
      if (e.pointerType === "touch" && ne && "cancelable" in ne && ne.cancelable) {
        ne.preventDefault?.();
      }

      // Apply rotation
      groupRef.current.rotation.y += dx * ROTATION_MULT;
      groupRef.current.rotation.x += dy * ROTATION_MULT;

      // Store velocity for inertia (last movement becomes angular velocity)
      velocity.current.x = dx * ROTATION_MULT;
      velocity.current.y = dy * ROTATION_MULT;

      pointerStart.current = { x: e.clientX, y: e.clientY };
      e.stopPropagation();
    }
  };

  /* ===========================
   * Global pointerup (finger lifted off outside canvas)
   * =========================== */
  useEffect(() => {
    const onWinPointerUp = () => endDrag();
    window.addEventListener("pointerup", onWinPointerUp);
    window.addEventListener("pointercancel", onWinPointerUp);
    return () => {
      window.removeEventListener("pointerup", onWinPointerUp);
      window.removeEventListener("pointercancel", onWinPointerUp);
    };
  }, []);

  return (
    <group ref={groupRef}>
      {/* Hit Sphere — invisible but raycastable. Captures drags anywhere over the globe */}
      <mesh
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {/* Slightly larger than radius to ensure easy hit test */}
        <sphereGeometry args={[radius * 1.08, 32, 32]} />
        {/* Must be visible=true and transparent with opacity 0 to be raycastable */}
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <StableAura
        radius={radius}
        color="#ff3b3b"
        rimIntensity={1.0}
        coreIntensity={0.06}
        rimPower={2.3}
        speed={0.2}
        inflate={1.02}
        renderOrder={-100}
      />

      {skills.map((skill, i) => (
        <FloatingIcon
          key={skill.id}
          anchor={positions[i]}
          render={skill.render as () => React.ReactElement}
          worldSize={worldSize}
          amplitude={amplitude}
          speed={0.3}
          safeMargin={0.92}
          textureSize={192}
          iconScale={0.64}
          padding={16}
          globeRadius={radius}
          globeMargin={globeMargin}
          renderOrder={2}
          seedSalt={i}
        />
      ))}
    </group>
  );
}
