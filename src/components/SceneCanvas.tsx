"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

export default function SceneCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Scene />
    </div>
  );
}
