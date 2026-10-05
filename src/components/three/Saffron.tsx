"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { scroll } from "@/lib/scroll";
import { seeded } from "@/lib/anim";

/** Drifting saffron threads that fill the space around the scene. */
export default function Saffron({ count = 70 }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => {
    const rand = seeded(1991);
    return Array.from({ length: count }, () => ({
        x: (rand() - 0.5) * 9,
        y: rand() * 6 - 1.5,
        z: -rand() * 4 - 0.5,
        r: rand() * Math.PI * 2,
        sp: 0.05 + rand() * 0.12,
        sc: 0.5 + rand() * 0.5,
      }));
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((d, i) => {
      // fall slowly; scroll pushes them upward for parallax
      let y = d.y - t * d.sp + scroll.s * 1.2;
      y = ((((y + 1.5) % 6) + 6) % 6) - 1.5;
      dummy.position.set(d.x + Math.sin(t * 0.4 + d.r) * 0.2, y, d.z);
      dummy.rotation.set(d.r + t * 0.5, d.r * 2 + t * 0.3, d.r + t * 0.2);
      dummy.scale.setScalar(d.sc);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.003, 0.006, 0.1, 6]} />
      <meshStandardMaterial color="#e2401a" emissive="#9a2a08" emissiveIntensity={0.3} roughness={0.6} />
    </instancedMesh>
  );
}
