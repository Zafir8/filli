"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, useTexture } from "@react-three/drei";
import { scroll, POUR } from "@/lib/scroll";
import { makeOrangeWrap, makeSaffronWrap } from "./cupArt";
import KarakPot, { POT_LIP } from "./KarakPot";
import { easeIn, easeInOut, range, seeded, smooth } from "@/lib/anim";

/* ----------------------------- dimensions ------------------------------ */

// Stone serving tray, as in FiLLi's own product photography.
const TRAY_R = 0.8;
const SAUCER_TOP = 0.07;

// FiLLi paper cup — proportions taken from the brand's cup photos.
const CUP_H = 1.05;
const R_BOT = 0.33;
const R_TOP = 0.46;
const WALL = 0.006;
const BASE = 0.05;
const LIQ_MAX = 0.86;
/** inner radius of the cup at height y (cup-local) */
const innerR = (y: number) => R_BOT - WALL + (R_TOP - R_BOT) * (y / CUP_H);

// The steel karak pot pours from its lip (see KarakPot.tsx).
const SPOUT = POT_LIP;
const TIP_TARGET = new THREE.Vector2(0.14, SAUCER_TOP + CUP_H + 0.5);
const IDLE_POS = new THREE.Vector2(0.95, 1.95);

const KARAK = "#a8622c";

function rotate2(v: THREE.Vector2, a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return new THREE.Vector2(v.x * c - v.y * s, v.x * s + v.y * c);
}

function liquidGeometry(h: number) {
  const y0 = BASE + 0.002;
  const y1 = BASE + h;
  const pts = [
    new THREE.Vector2(0, y0),
    new THREE.Vector2(innerR(y0) - 0.006, y0),
    new THREE.Vector2(innerR(y1) - 0.004, y1),
    new THREE.Vector2(0, y1),
  ];
  return new THREE.LatheGeometry(pts, 64);
}

/** soft round sprite used for steam */
function makeSoftTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.4, "rgba(255,255,255,0.35)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** karak surface: caramel crema with a few saffron flecks */
function makeCremaTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(256, 256, 20, 256, 256, 256);
  grd.addColorStop(0, "#d9a066");
  grd.addColorStop(0.55, "#c9884a");
  grd.addColorStop(1, "#a9662f");
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 260; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 230;
    g.fillStyle = `rgba(255,236,200,${Math.random() * 0.25})`;
    g.beginPath();
    g.arc(256 + Math.cos(a) * r, 256 + Math.sin(a) * r, 2 + Math.random() * 8, 0, Math.PI * 2);
    g.fill();
  }
  for (let i = 0; i < 18; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 180;
    const x = 256 + Math.cos(a) * r;
    const y = 256 + Math.sin(a) * r;
    const b = Math.random() * Math.PI;
    g.strokeStyle = "rgba(196,46,18,0.9)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(x + Math.cos(b) * 14, y + Math.sin(b) * 6, x + Math.cos(b) * 26, y + Math.sin(b) * 22);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------------------------- FiLLi cup ------------------------------ */
// wrap canvas aspect = cup height / mean circumference
const WRAP_ASPECT = CUP_H / (2 * Math.PI * ((R_TOP + R_BOT) / 2));

/** FiLLi paper cup: the signature orange cup or the saffron-print Zafran cup. */
function FilliCup({ variant = "orange" }: { variant?: "orange" | "saffron" }) {
  const logo = useTexture("/img/filli-logo-cream.svg");
  const wrap = useMemo(
    () =>
      variant === "saffron"
        ? makeSaffronWrap(WRAP_ASPECT)
        : makeOrangeWrap(logo.image as HTMLImageElement, WRAP_ASPECT),
    [logo, variant],
  );
  const geo = useMemo(
    () => ({
      // thetaStart = -π puts u = 0.5 (the logo) facing +Z, towards the camera
      outer: new THREE.CylinderGeometry(R_TOP, R_BOT, CUP_H, 96, 1, true, -Math.PI, Math.PI * 2),
      inner: new THREE.CylinderGeometry(R_TOP - WALL, innerR(BASE), CUP_H - BASE, 96, 1, true),
      floor: new THREE.CircleGeometry(innerR(BASE), 64),
      rim: new THREE.TorusGeometry(R_TOP - 0.004, 0.017, 16, 128),
      bottom: new THREE.CircleGeometry(R_BOT, 64),
    }),
    [],
  );
  useEffect(() => () => {
    wrap.dispose();
    Object.values(geo).forEach((g) => g.dispose());
  }, [wrap, geo]);

  return (
    <group>
      <mesh geometry={geo.outer} position-y={CUP_H / 2}>
        <meshPhysicalMaterial map={wrap} roughness={0.42} clearcoat={0.35} clearcoatRoughness={0.4} />
      </mesh>
      {/* white paper interior */}
      <mesh geometry={geo.inner} position-y={BASE + (CUP_H - BASE) / 2}>
        <meshStandardMaterial color="#fbf7ef" roughness={0.75} side={THREE.BackSide} />
      </mesh>
      <mesh geometry={geo.floor} position-y={BASE} rotation-x={-Math.PI / 2}>
        <meshStandardMaterial color="#f3ece0" roughness={0.8} />
      </mesh>
      {/* rolled rim */}
      <mesh geometry={geo.rim} position-y={CUP_H} rotation-x={Math.PI / 2}>
        <meshStandardMaterial color="#fffaf0" roughness={0.55} />
      </mesh>
      <mesh geometry={geo.bottom} position-y={0.001} rotation-x={Math.PI / 2}>
        <meshStandardMaterial color={variant === "saffron" ? "#f1ede4" : "#e8480a"} roughness={0.6} />
      </mesh>
    </group>
  );
}

// Saffron cup sits behind-left of the orange (pour) cup, like FiLLi's hero shot.
const SAFFRON_POS: [number, number, number] = [-0.95, 0, -0.55];

/** The Zafran cup, already poured — with crema and a wisp of steam. */
function SaffronCup({ liquidMat, cremaTex, softTex }: { liquidMat: THREE.Material; cremaTex: THREE.Texture; softTex: THREE.Texture }) {
  const liquid = useMemo(() => liquidGeometry(LIQ_MAX), []);
  const steam = useRef<THREE.Sprite[]>([]);
  useEffect(() => () => liquid.dispose(), [liquid]);
  const surfY = BASE + LIQ_MAX;
  const r = innerR(surfY) - 0.006;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    steam.current.forEach((sp, i) => {
      if (!sp) return;
      const k = (t * 0.14 + i / steam.current.length + 0.37) % 1;
      sp.position.set(Math.sin(t * 0.6 + i * 2.1) * 0.07 * (0.4 + k), surfY + 0.05 + k * 1.0, 0);
      sp.scale.setScalar(0.22 + k * 0.6);
      (sp.material as THREE.SpriteMaterial).opacity = Math.sin(Math.PI * k) * 0.12;
    });
  });

  return (
    <group position={SAFFRON_POS} rotation-y={0.35}>
      <group position-y={SAUCER_TOP}>
        <FilliCup variant="saffron" />
        <mesh geometry={liquid} material={liquidMat} />
        <mesh position-y={surfY + 0.0015} rotation-x={-Math.PI / 2} scale={[r, r, 1]}>
          <circleGeometry args={[1, 64]} />
          <meshPhysicalMaterial map={cremaTex} roughness={0.25} clearcoat={0.6} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => (
          <sprite key={i} ref={(m) => { if (m) steam.current[i] = m; }}>
            <spriteMaterial map={softTex} color="#ffffff" transparent depthWrite={false} opacity={0} />
          </sprite>
        ))}
      </group>
    </group>
  );
}

/** Rounded travertine-style tray the cup sits on. */
function StoneTray() {
  const { geometry, texture } = useMemo(() => {
    const e = 0.025;
    const pts = [new THREE.Vector2(0, 0), new THREE.Vector2(TRAY_R - e, 0)];
    for (let i = 0; i <= 8; i++) {
      const a = -Math.PI / 2 + (i / 8) * Math.PI;
      pts.push(new THREE.Vector2(TRAY_R - e + Math.cos(a) * e, SAUCER_TOP / 2 + Math.sin(a) * (SAUCER_TOP / 2)));
    }
    pts.push(new THREE.Vector2(0, SAUCER_TOP));
    const geometry = new THREE.LatheGeometry(pts, 96);

    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = "#eadfcb";
    g.fillRect(0, 0, 512, 512);
    const rand = seeded(42);
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = `rgba(${150 + rand() * 60},${120 + rand() * 50},${90 + rand() * 40},${rand() * 0.18})`;
      g.beginPath();
      g.ellipse(rand() * 512, rand() * 512, 1 + rand() * 6, 0.5 + rand() * 2, rand() * Math.PI, 0, Math.PI * 2);
      g.fill();
    }
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return { geometry, texture };
  }, []);
  useEffect(() => () => {
    geometry.dispose();
    texture.dispose();
  }, [geometry, texture]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial map={texture} roughness={0.72} />
    </mesh>
  );
}

/* ------------------------------ the pour ------------------------------- */
export default function ChaiPour() {
  const group = useRef<THREE.Group>(null);
  const pot = useRef<THREE.Group>(null);
  const potSurface = useRef<THREE.Mesh>(null);
  const liquid = useRef<THREE.Mesh>(null);
  const crema = useRef<THREE.Mesh>(null);
  const stream = useRef<THREE.Mesh>(null);
  const splash = useRef<THREE.InstancedMesh>(null);
  const ripples = useRef<THREE.Mesh[]>([]);
  const steam = useRef<THREE.Sprite[]>([]);
  const lastH = useRef(-1);

  const softTex = useMemo(() => makeSoftTexture(), []);
  const cremaTex = useMemo(() => makeCremaTexture(), []);
  const liquidMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: KARAK,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        sheen: 0.4,
        sheenColor: new THREE.Color("#ffcf8a"),
      }),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const SPLASH_COUNT = 22;
  const splashSeeds = useMemo(() => {
    const rand = seeded(7);
    return Array.from({ length: SPLASH_COUNT }, () => ({ a: rand() * Math.PI * 2, p: rand(), v: 0.6 + rand() * 0.8 }));
  }, []);

  useEffect(() => () => {
    softTex.dispose();
    cremaTex.dispose();
    liquidMat.dispose();
  }, [softTex, cremaTex, liquidMat]);

  useFrame((state) => {
    const s = scroll.s;
    const t = state.clock.elapsedTime;
    if (!group.current || !pot.current) return;

    group.current.position.x = scroll.gx;

    /* karak pot: idle bob → tilt over cup → tilt back & fly out */
    const tiltIn = easeInOut(range(s, ...POUR.tiltIn));
    const fillP = range(s, ...POUR.fill);
    const tiltOut = easeInOut(range(s, ...POUR.tiltOut));
    const exit = easeIn(range(s, ...POUR.exit));
    const tilt = (0.95 + 0.3 * fillP) * tiltIn * (1 - tiltOut);
    const pourPos = TIP_TARGET.clone().sub(rotate2(SPOUT, tilt));
    const idle = IDLE_POS.clone().add(new THREE.Vector2(0, Math.sin(t * 1.2) * 0.04));
    const pos = idle.lerp(pourPos, tiltIn * (1 - tiltOut) + tiltOut * 0.0);
    pot.current.position.set(pos.x + exit * 1.8, pos.y + exit * 3.2, 0);
    pot.current.rotation.z = tilt - exit * 0.4;
    pot.current.rotation.y = Math.sin(t * 0.6) * 0.06 * (1 - tiltIn);
    pot.current.visible = exit < 1;
    // karak level inside the pot only reads while it is (nearly) upright
    if (potSurface.current) potSurface.current.visible = tilt < 0.12;

    /* fill level */
    const h = LIQ_MAX * smooth(fillP);
    const surfY = SAUCER_TOP + BASE + h;
    if (liquid.current && Math.abs(h - lastH.current) > 0.0008) {
      liquid.current.geometry.dispose();
      liquid.current.geometry = liquidGeometry(Math.max(h, 0.001));
      lastH.current = h;
    }
    if (liquid.current) liquid.current.visible = h > 0.004;
    if (crema.current) {
      crema.current.visible = h > 0.004;
      crema.current.position.y = surfY + 0.0015;
      const r = innerR(BASE + h) - 0.006;
      crema.current.scale.set(r, r, 1);
      crema.current.rotation.z = t * 0.05;
    }

    /* stream: spout tip → liquid surface, with a falling head and tail */
    const head = easeIn(range(s, ...POUR.head));
    const tail = easeIn(range(s, ...POUR.tail));
    const flowing = head > 0.001 && tail < 0.999;
    const tip = TIP_TARGET;
    const end = new THREE.Vector3(tip.x - 0.13, surfY, 0);
    if (stream.current) {
      stream.current.visible = flowing;
      if (flowing) {
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(tip.x, tip.y, 0),
          new THREE.Vector3(tip.x - 0.12, tip.y - 0.06, 0),
          end,
        );
        const pts: THREE.Vector3[] = [];
        const N = 24;
        for (let i = 0; i <= N; i++) {
          const u = tail + (head - tail) * (i / N);
          const p = curve.getPoint(u);
          p.x += Math.sin(t * 9 + u * 14) * 0.004 * u;
          p.z += Math.cos(t * 7 + u * 11) * 0.004 * u;
          pts.push(p);
        }
        stream.current.geometry.dispose();
        stream.current.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.021, 12, false);
      }
    }

    /* splash droplets + ripples at the impact point */
    const impact = head >= 1 && tail <= 0 ? 1 : 0;
    if (splash.current) {
      splashSeeds.forEach((d, i) => {
        const k = (t * 1.8 * d.v + d.p) % 1;
        const r = 0.16 * k * d.v;
        dummy.position.set(end.x + Math.cos(d.a) * r, surfY + 0.5 * k * (1 - k) * d.v, Math.sin(d.a) * r);
        dummy.scale.setScalar(impact * (1 - k) * 0.014 + 1e-5);
        dummy.updateMatrix();
        splash.current!.setMatrixAt(i, dummy.matrix);
      });
      splash.current.instanceMatrix.needsUpdate = true;
    }
    ripples.current.forEach((m, i) => {
      if (!m) return;
      const k = (t * 0.9 + i / ripples.current.length) % 1;
      const maxR = innerR(BASE + h) - 0.02;
      const r = Math.min(0.03 + k * 0.35, maxR);
      m.position.set(end.x, surfY + 0.003, 0);
      m.scale.set(r, r, 1);
      (m.material as THREE.MeshBasicMaterial).opacity = impact * (1 - k) * 0.5;
      m.visible = impact > 0;
    });

    /* steam once the cup is (nearly) full */
    const steamK = range(s, 1.55, 2.0);
    steam.current.forEach((sp, i) => {
      if (!sp) return;
      const k = (t * 0.16 + i / steam.current.length) % 1;
      sp.position.set(
        Math.sin(t * 0.7 + i * 1.7) * 0.08 * (0.4 + k),
        surfY + 0.05 + k * 1.1,
        Math.cos(t * 0.5 + i) * 0.06 * k,
      );
      sp.scale.setScalar(0.25 + k * 0.7);
      (sp.material as THREE.SpriteMaterial).opacity = Math.sin(Math.PI * k) * 0.16 * steamK;
      sp.visible = steamK > 0;
    });
  });

  return (
    <group ref={group}>
      {/* warm glow behind the cup */}
      <mesh position={[0, 1.0, -3.5]}>
        <planeGeometry args={[40, 40]} />
        <shaderMaterial
          depthWrite={false}
          uniforms={{ uGlow: { value: new THREE.Color("#ffc58f") }, uBg: { value: new THREE.Color("#fff4ca") } }}
          vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
          fragmentShader={`
            uniform vec3 uGlow;
            uniform vec3 uBg;
            varying vec2 vUv;
            void main() {
              float d = distance(vUv, vec2(0.5)) * 40.0 / 7.0;
              float a = smoothstep(1.0, 0.0, d);
              gl_FragColor = vec4(mix(uBg, uGlow, a * a * 0.75), 1.0);
              #include <colorspace_fragment>
            }`}
        />
      </mesh>

      <group position={[-0.45, 0, -0.25]} scale={[1.75, 1, 1.3]}>
        <StoneTray />
      </group>
      <ContactShadows position={[-0.45, 0.002, -0.2]} scale={5} blur={2.4} far={1.6} opacity={0.6} color="#3f2016" />
      <SaffronCup liquidMat={liquidMat} cremaTex={cremaTex} softTex={softTex} />

      <group position-y={SAUCER_TOP}>
        <FilliCup />
      </group>

      <mesh ref={liquid} material={liquidMat} position-y={SAUCER_TOP} visible={false}>
        <bufferGeometry />
      </mesh>
      <mesh ref={crema} rotation-x={-Math.PI / 2} visible={false}>
        <circleGeometry args={[1, 64]} />
        <meshPhysicalMaterial map={cremaTex} roughness={0.25} clearcoat={0.6} />
      </mesh>

      <mesh ref={stream} material={liquidMat} visible={false}>
        <bufferGeometry />
      </mesh>
      <instancedMesh ref={splash} args={[undefined, undefined, SPLASH_COUNT]} material={liquidMat}>
        <sphereGeometry args={[1, 10, 10]} />
      </instancedMesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { if (m) ripples.current[i] = m; }} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.92, 1, 48]} />
          <meshBasicMaterial color="#fff4e0" transparent depthWrite={false} />
        </mesh>
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <sprite key={i} ref={(m) => { if (m) steam.current[i] = m; }}>
          <spriteMaterial map={softTex} color="#ffffff" transparent depthWrite={false} opacity={0} />
        </sprite>
      ))}

      <group ref={pot}>
        <KarakPot surfaceRef={potSurface} />
      </group>

    </group>
  );
}

