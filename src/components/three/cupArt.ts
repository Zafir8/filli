import * as THREE from "three";

/**
 * Printed wraps for the two FiLLi paper cups, drawn to canvas.
 * u = 0.5 (canvas x = W / 2) faces the camera on the cup mesh.
 */

function toTexture(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function canvasFor(aspect: number) {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = Math.round(2048 * aspect);
  return { c, g: c.getContext("2d")!, W: c.width, H: c.height };
}

/** Signature orange cup: cream "Filli" script running up the front. */
export function makeOrangeWrap(logo: HTMLImageElement, aspect: number) {
  const { c, g, W, H } = canvasFor(aspect);
  const grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, "#ff5a12");
  grd.addColorStop(1, "#f04a05");
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);
  const lw = H * 0.86;
  const lh = lw * (68.8 / 121);
  g.save();
  g.translate(W / 2, H / 2 + H * 0.02);
  g.rotate(-Math.PI / 2);
  g.drawImage(logo, -lw / 2, -lh / 2, lw, lh);
  g.restore();
  return toTexture(c);
}

/* ------------------------- saffron (zafran) cup ------------------------- */

const PETAL_DARK = "#4c2479";
const PETAL = "#5d2d93";
const PETAL_LIGHT = "#7442ad";
const LEAF = "#2e8b57";
const THREAD = "#d4241c";

function petalPath(g: CanvasRenderingContext2D, len: number, wid: number) {
  g.beginPath();
  g.moveTo(0, 0);
  g.bezierCurveTo(wid * 0.9, -len * 0.25, wid, -len * 0.8, 0, -len);
  g.bezierCurveTo(-wid, -len * 0.8, -wid * 0.9, -len * 0.25, 0, 0);
  g.closePath();
}

function drawPetal(g: CanvasRenderingContext2D, angle: number, len: number, wid: number, base: string) {
  g.save();
  g.rotate(angle);
  petalPath(g, len, wid);
  g.fillStyle = base;
  g.fill();
  // lighter right half, like the print's two-tone petals
  g.save();
  petalPath(g, len, wid);
  g.clip();
  g.fillStyle = PETAL_LIGHT;
  g.globalAlpha = 0.55;
  g.fillRect(0, -len, wid, len);
  g.restore();
  // veins
  g.strokeStyle = PETAL_DARK;
  g.lineCap = "round";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(0, -len * 0.08);
  g.quadraticCurveTo(wid * 0.05, -len * 0.5, 0, -len * 0.9);
  g.stroke();
  g.lineWidth = 3;
  for (const side of [-1, 1]) {
    g.beginPath();
    g.moveTo(side * wid * 0.08, -len * 0.25);
    g.quadraticCurveTo(side * wid * 0.45, -len * 0.55, side * wid * 0.3, -len * 0.82);
    g.stroke();
  }
  g.restore();
}

function drawLeaf(g: CanvasRenderingContext2D, pts: number[]) {
  const [x0, y0, cx, cy, x1, y1] = pts;
  g.lineCap = "round";
  g.strokeStyle = LEAF;
  g.lineWidth = 18;
  g.beginPath();
  g.moveTo(x0, y0);
  g.quadraticCurveTo(cx, cy, x1, y1);
  g.stroke();
  g.strokeStyle = "#fbfaf6";
  g.lineWidth = 6;
  g.stroke();
}

function drawThread(g: CanvasRenderingContext2D, angle: number, len: number) {
  g.save();
  g.rotate(angle);
  g.strokeStyle = THREAD;
  g.lineCap = "round";
  g.lineWidth = 12;
  g.beginPath();
  g.moveTo(0, 0);
  g.bezierCurveTo(len * 0.3, -40, len * 0.55, 45, len * 0.8, -10);
  g.stroke();
  // flared, trumpet-shaped stigma tip
  g.fillStyle = THREAD;
  g.beginPath();
  g.moveTo(len * 0.78, -18);
  g.quadraticCurveTo(len * 0.95, -38, len, -26);
  g.lineTo(len, 10);
  g.quadraticCurveTo(len * 0.95, 18, len * 0.78, 2);
  g.closePath();
  g.fill();
  g.restore();
}

function drawRingText(g: CanvasRenderingContext2D, text: string, r: number) {
  g.save();
  g.fillStyle = "#ffffff";
  g.font = "700 26px sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  const step = (Math.PI * 2) / text.length;
  for (let i = 0; i < text.length; i++) {
    g.save();
    g.rotate(i * step - Math.PI / 2);
    g.translate(0, -r);
    g.fillText(text[i], 0, 0);
    g.restore();
  }
  g.restore();
}

/** White cup with the big purple saffron crocus, as on FiLLi's Zafran cup. */
export function makeSaffronWrap(aspect: number) {
  const { c, g, W, H } = canvasFor(aspect);
  g.fillStyle = "#fbfaf6";
  g.fillRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H * 0.56;

  // sweeping leaves behind the flower (some reach round the back of the cup)
  drawLeaf(g, [cx - 520, H + 30, cx - 620, H * 0.35, cx - 470, -20]);
  drawLeaf(g, [cx + 300, H + 30, cx + 620, H * 0.45, cx + 560, -20]);
  drawLeaf(g, [cx - 120, H + 30, cx - 380, H * 0.6, cx - 700, H * 0.1]);
  drawLeaf(g, [cx + 80, H + 30, cx + 420, H * 0.75, cx + 820, H * 0.25]);
  drawLeaf(g, [W * 0.02, H + 30, W * 0.1, H * 0.4, W * 0.04, -20]);
  drawLeaf(g, [W * 0.97, H + 30, W * 0.9, H * 0.45, W * 0.97, -20]);

  g.save();
  g.translate(cx, cy);
  const len = H * 0.66;
  // back petals, then front petals
  for (let i = 0; i < 3; i++) drawPetal(g, (i * 2 * Math.PI) / 3 + Math.PI / 3 + 0.1, len * 0.95, len * 0.42, PETAL_DARK);
  for (let i = 0; i < 3; i++) drawPetal(g, (i * 2 * Math.PI) / 3 + 0.1, len, len * 0.45, PETAL);

  // saffron threads curling out from the centre
  drawThread(g, -2.5, 360);
  drawThread(g, -0.55, 400);
  drawThread(g, 1.9, 370);
  g.fillStyle = THREAD;
  g.beginPath();
  g.arc(0, 0, 16, 0, Math.PI * 2);
  g.fill();

  drawRingText(g, "FiLLi • SIGNATURE • ZAFRAN • ", 92);
  g.restore();

  // safety print along the bottom
  g.fillStyle = THREAD;
  g.font = "italic 600 22px sans-serif";
  g.textAlign = "center";
  g.fillText("Careful, cup may contain extremely hot beverage", cx - 120, H - 26);

  return toTexture(c);
}
