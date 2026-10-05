"use client";

import * as THREE from "three";
import { useEffect, useMemo, type Ref } from "react";

/**
 * Stainless-steel karak pan — the wide pouring pot used in Gulf karak
 * cafeterias. Built in pot-local space with its centre on the origin; the
 * pouring lip faces -X and the long handle runs out to +X.
 */
const R = 0.48;
const H = 0.62;
const LIP = 0.1; // how far the pouring lip is pulled out
const KARAK = "#a8622c";

/** Tip of the pouring lip, pot-local (x, y). */
export const POT_LIP = new THREE.Vector2(-(R + LIP - 0.01), H / 2 + 0.035);

function potGeometry() {
  const y0 = -H / 2;
  const y1 = H / 2;
  const c = 0.05; // bottom corner radius
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, y0)];
  for (let i = 0; i <= 6; i++) {
    const a = -Math.PI / 2 + (i / 6) * (Math.PI / 2);
    pts.push(new THREE.Vector2(R - c + Math.cos(a) * c, y0 + c + Math.sin(a) * c));
  }
  pts.push(new THREE.Vector2(R, y1 - 0.02));
  // small flared, rolled rim
  pts.push(new THREE.Vector2(R + 0.012, y1));
  pts.push(new THREE.Vector2(R + 0.004, y1 + 0.012));
  pts.push(new THREE.Vector2(R - 0.01, y1 + 0.004));
  // interior wall back down (thin steel)
  pts.push(new THREE.Vector2(R - 0.01, y0 + c + 0.01));
  pts.push(new THREE.Vector2(R - c, y0 + 0.012));
  pts.push(new THREE.Vector2(0, y0 + 0.012));
  const g = new THREE.LatheGeometry(pts, 128);

  // Pull the upper wall out into a pouring lip on the -X side.
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  const band = 0.24;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const r = Math.hypot(v.x, v.z);
    if (r < 1e-4) continue;
    const facing = Math.max(0, -v.x / r); // 1 straight at -X
    const w = Math.pow(facing, 10);
    const k = Math.max(0, (v.y - (y1 - band)) / band);
    const pull = LIP * w * k * k;
    v.x -= pull;
    v.y += 0.035 * w * k * k;
    // pinch the sides of the lip into a V
    v.z *= 1 - 0.25 * w * k * k;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function handleGeometries() {
  const start = new THREE.Vector3(R - 0.02, 0.12, 0);
  const path = new THREE.CatmullRomCurve3([
    start,
    new THREE.Vector3(R + 0.18, 0.16, 0),
    new THREE.Vector3(R + 0.5, 0.24, 0),
    new THREE.Vector3(R + 0.9, 0.32, 0),
  ]);
  const shaft = new THREE.TubeGeometry(path, 48, 0.028, 16, false);
  // black bakelite grip over the outer part of the handle
  const gripPath = new THREE.CatmullRomCurve3(
    Array.from({ length: 8 }, (_, i) => path.getPoint(0.45 + (i / 7) * 0.55)),
  );
  const grip = new THREE.TubeGeometry(gripPath, 32, 0.048, 20, false);
  const cap = new THREE.SphereGeometry(0.048, 20, 12);
  const capPos = path.getPoint(1);
  const plate = new THREE.CylinderGeometry(0.075, 0.075, 0.012, 24);
  return { shaft, grip, cap, capPos, plate, start };
}

export default function KarakPot({ surfaceRef }: { surfaceRef?: Ref<THREE.Mesh> }) {
  const body = useMemo(() => potGeometry(), []);
  const handle = useMemo(() => handleGeometries(), []);
  useEffect(
    () => () => {
      body.dispose();
      handle.shaft.dispose();
      handle.grip.dispose();
      handle.cap.dispose();
      handle.plate.dispose();
    },
    [body, handle],
  );

  return (
    <group>
      <mesh geometry={body}>
        <meshPhysicalMaterial
          color="#e4e7ea"
          metalness={0.95}
          roughness={0.24}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
          envMapIntensity={2.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* karak inside the pot, shown while it's upright */}
      <mesh ref={surfaceRef} position-y={0.08} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[R - 0.012, 64]} />
        <meshPhysicalMaterial color={KARAK} roughness={0.2} clearcoat={1} />
      </mesh>

      <mesh geometry={handle.shaft}>
        <meshStandardMaterial color="#c9cdd1" metalness={1} roughness={0.25} />
      </mesh>
      <mesh geometry={handle.grip}>
        <meshStandardMaterial color="#1b1512" roughness={0.45} />
      </mesh>
      <mesh geometry={handle.cap} position={handle.capPos}>
        <meshStandardMaterial color="#1b1512" roughness={0.45} />
      </mesh>
      {/* riveted mounting plate */}
      <mesh geometry={handle.plate} position={handle.start} rotation-z={Math.PI / 2}>
        <meshStandardMaterial color="#c9cdd1" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}
