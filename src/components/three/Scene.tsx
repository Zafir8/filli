"use client";

import * as THREE from "three";
import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { scroll } from "@/lib/scroll";
import { lerp, smooth } from "@/lib/anim";
import ChaiPour from "./ChaiPour";
import Saffron from "./Saffron";

type V3 = [number, number, number];
type Key = { s: number; cam: V3; look: V3; gx: number };

// Camera choreography keyed to scene time (section index + progress).
const KEYS: Key[] = [
  { s: 0.0, cam: [0, 1.35, 6.6], look: [0, 1.2, 0], gx: 0.7 },
  { s: 0.9, cam: [-0.3, 3.1, 5.9], look: [0, 1.3, 0], gx: 0.5 },
  { s: 1.67, cam: [0.35, 3.3, 5.5], look: [0, 1.25, 0], gx: 0.5 },
  { s: 2.0, cam: [-0.2, 2.3, 3.6], look: [-0.3, 0.45, 0], gx: 0.15 },
  { s: 2.2, cam: [-0.2, 2.25, 3.7], look: [-0.3, 0.47, 0], gx: 0.15 },
  { s: 3.0, cam: [0.2, 1.35, 5.4], look: [0, 0.95, 0], gx: -0.7 },
  { s: 4.0, cam: [-0.2, 1.3, 5.6], look: [0, 0.95, 0], gx: 1.05 },
  { s: 5.0, cam: [0, 1.5, 5.0], look: [0, 0.9, 0], gx: -0.7 },
];

function sample(s: number) {
  let i = 0;
  while (i < KEYS.length - 2 && s > KEYS[i + 1].s) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = smooth(Math.min(1, Math.max(0, (s - a.s) / (b.s - a.s))));
  const mix = (x: V3, y: V3) => x.map((v, k) => lerp(v, y[k], t)) as V3;
  return { cam: mix(a.cam, b.cam), look: mix(a.look, b.look), gx: lerp(a.gx, b.gx, t) };
}

function CameraRig() {
  const look = new THREE.Vector3();
  const target = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    scroll.s = THREE.MathUtils.damp(scroll.s, scroll.target, 4.5, d);

    const { cam, look: l, gx } = sample(scroll.s);
    const aspect = state.size.width / state.size.height;
    const narrow = aspect < 0.85;
    // Portrait screens: keep the cup centred and pull the camera back.
    const zoom = narrow ? Math.min(2.1, 1.05 / aspect) : 1;
    target.set(
      cam[0] + scroll.pointer.x * 0.25,
      cam[1] - scroll.pointer.y * 0.15 + (narrow ? 0.4 : 0),
      cam[2] * zoom,
    );
    lookTarget.set(l[0], l[1] + (narrow ? -0.35 : 0), l[2]);

    state.camera.position.lerp(target, 1 - Math.exp(-6 * d));
    look.lerp(lookTarget, 1 - Math.exp(-6 * d));
    state.camera.lookAt(look);
    scroll.gx = THREE.MathUtils.damp(scroll.gx, narrow ? 0 : gx, 6, d);
  });
  return null;
}

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0, 1.35, 6.2], near: 0.1, far: 60 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
    >
      <color attach="background" args={["#fff4ca"]} />
      <fog attach="fog" args={["#fff4ca", 10, 22]} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 3]} intensity={2.2} color="#ffe6c2" />
      <pointLight position={[-3, 2, -2]} intensity={10} color="#ffb27a" distance={10} />
      <spotLight position={[0, 5, 2]} angle={0.5} penumbra={1} intensity={25} color="#fff4ca" />

      {/* Local studio environment — no HDR download needed */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -2]} scale={[8, 2, 1]} color="#fff4ca" />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#ffd9a8" />
        <Lightformer form="rect" intensity={4} position={[5, 2, 0]} rotation-y={-Math.PI / 2} scale={[4, 4, 1]} color="#ffffff" />
        <Lightformer form="ring" intensity={2.5} position={[0, 1, 5]} scale={3} color="#fc5007" />
        <Lightformer form="rect" intensity={1} position={[0, -3, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} color="#fff4ca" />
      </Environment>

      <CameraRig />
      <Suspense fallback={null}>
        <ChaiPour />
      </Suspense>
      <Saffron count={24} />
    </Canvas>
  );
}
