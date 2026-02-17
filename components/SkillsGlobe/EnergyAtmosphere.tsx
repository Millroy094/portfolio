// components/EnergyAtmosphere.tsx
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type EnergyAtmosphereProps = {
  radius?: number;
  color?: string; // base color (e.g. "#ff2a2a")
  intensity?: number; // overall brightness multiplier
  noiseScale?: number; // spatial frequency of wisps
  bandSharpness?: number; // higher -> tighter wave bands
  flow1Dir?: [number, number, number]; // direction of flow #1
  flow2Dir?: [number, number, number]; // direction of flow #2
  flow1Speed?: number; // animation speed for flow #1
  flow2Speed?: number; // animation speed for flow #2
  rimPower?: number; // Fresnel rim sharpness
  rimBoost?: number; // multiplier for backface rim glow
  innerOpacity?: number; // base opacity for front faces
};

export function EnergyAtmosphere({
  radius = 3,
  color = "#ff2a2a",
  intensity = 1.3,
  noiseScale = 2.2,
  bandSharpness = 3.0,
  flow1Dir = [1, 0.3, 0],
  flow2Dir = [-0.4, 1, 0.2],
  flow1Speed = 0.35,
  flow2Speed = 0.55,
  rimPower = 2.0,
  rimBoost = 1.6,
  innerOpacity = 0.35,
}: EnergyAtmosphereProps) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: intensity },
      uNoiseScale: { value: noiseScale },
      uBandSharpness: { value: bandSharpness },
      uFlow1Dir: { value: new THREE.Vector3(...flow1Dir).normalize() },
      uFlow2Dir: { value: new THREE.Vector3(...flow2Dir).normalize() },
      uFlow1Speed: { value: flow1Speed },
      uFlow2Speed: { value: flow2Speed },
      uRimPower: { value: rimPower },
      uRimBoost: { value: rimBoost },
      uInnerOpacity: { value: innerOpacity },
    }),
    [
      color,
      intensity,
      noiseScale,
      bandSharpness,
      flow1Dir,
      flow2Dir,
      flow1Speed,
      flow2Speed,
      rimPower,
      rimBoost,
      innerOpacity,
    ],
  );

  useFrame((_, dt) => {
    // eslint-disable-next-line react-hooks/immutability
    uniforms.uTime.value += dt;
  });

  return (
    <mesh renderOrder={0 /* draw behind icons */}>
      <sphereGeometry args={[radius, 192, 192]} />
      <shaderMaterial
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
        depthTest={true}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

/* ---------------- GLSL ---------------- */

const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - vWorldPos);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uIntensity;
  uniform float uNoiseScale;
  uniform float uBandSharpness;
  uniform vec3  uFlow1Dir;
  uniform vec3  uFlow2Dir;
  uniform float uFlow1Speed;
  uniform float uFlow2Speed;
  uniform float uRimPower;
  uniform float uRimBoost;
  uniform float uInnerOpacity;

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  // Simple hash & smooth noise (value noise)
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p += dot(p, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    // Trilinear interpolation of hashed corners
    float n000 = hash(i + vec3(0.0,0.0,0.0));
    float n100 = hash(i + vec3(1.0,0.0,0.0));
    float n010 = hash(i + vec3(0.0,1.0,0.0));
    float n110 = hash(i + vec3(1.0,1.0,0.0));
    float n001 = hash(i + vec3(0.0,0.0,1.0));
    float n101 = hash(i + vec3(1.0,0.0,1.0));
    float n011 = hash(i + vec3(0.0,1.0,1.0));
    float n111 = hash(i + vec3(1.0,1.0,1.0));

    vec3 u = f*f*(3.0-2.0*f);

    float nx00 = mix(n000, n100, u.x);
    float nx10 = mix(n010, n110, u.x);
    float nx01 = mix(n001, n101, u.x);
    float nx11 = mix(n011, n111, u.x);

    float nxy0 = mix(nx00, nx10, u.y);
    float nxy1 = mix(nx01, nx11, u.y);

    return mix(nxy0, nxy1, u.z);
  }

  // fBm: multiple octaves of noise
  float fbm(vec3 p) {
    float f = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      f += amp * noise3(p);
      p *= 2.07;
      amp *= 0.5;
    }
    return f;
  }

  // Turn noise into banded "waves"
  float bandify(float n, float sharpness) {
    // Map noise -> sinusoidal bands then sharpen with a smoothstep curve
    float s = 0.5 + 0.5 * sin(6.28318 * n);
    // increase contrast with power curve
    s = smoothstep(0.0, 1.0, pow(s, sharpness));
    return s;
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);

    // Position on the sphere surface (unit)
    vec3 P = normalize(vWorldPos);

    // Animate two flowing bands in different directions
    vec3 q1 = P * uNoiseScale + uFlow1Dir * (uTime * uFlow1Speed);
    vec3 q2 = P * (uNoiseScale * 1.25) + uFlow2Dir * (uTime * uFlow2Speed);

    // fBm for richer structure
    float n1 = fbm(q1);
    float n2 = fbm(q2);

    // Turn noise into wavey bands (wisps)
    float b1 = bandify(n1, uBandSharpness);
    float b2 = bandify(n2, uBandSharpness * 0.9);

    // Combine wisps, add some modulation
    float wisps = mix(b1, b2, 0.5);
    float modA  = fbm(P * (uNoiseScale * 0.7) + uTime * 0.12);
    wisps *= mix(0.7, 1.0, modA);

    // Fresnel-like rim
    float fres = pow(1.0 - max(0.0, dot(N, V)), uRimPower);

    // Backfaces get extra rim boost to feel like a halo/atmosphere
    float back = gl_FrontFacing ? 1.0 : uRimBoost;

    // Compose brightness
    float glow = (0.25 + 0.75 * wisps) * (0.7 + 0.3 * fres) * back;
    glow *= uIntensity;

    vec3 col = uColor * glow;

    // Alpha: more on rim, less inside, modulated by wisps
    float alphaFront = clamp(0.15 + 0.85 * fres, 0.05, 1.0) * (0.5 + 0.5 * wisps);
    alphaFront *= uInnerOpacity;

    float alphaBack = clamp(0.35 + 0.65 * fres, 0.1, 1.0);

    float alpha = mix(alphaBack, alphaFront, gl_FrontFacing ? 1.0 : 0.0);

    gl_FragColor = vec4(col, alpha);

    // Premultiply-like softness can be mimicked by slightly reducing rgb by alpha if needed:
    // gl_FragColor.rgb *= gl_FragColor.a;
  }
`;
