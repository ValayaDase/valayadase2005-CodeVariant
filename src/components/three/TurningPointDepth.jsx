"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * QuietPlaceScene — FocusSpot · PS 03 "The Quiet Place"
 *
 * A miniature paper-cut city map that dissolves into the page ivory (#F4F1E8).
 * Every moving part is one of the product's ideas:
 *
 *  - Space Discovery      libraries, cafés and coworking spaces as pins on a map
 *  - Quiet When           a simulated clock (Mon–Sun, 7 AM → 10 PM) drives each venue's
 *                         crowd with a rule-based model (category + hour + weekday + opening hours)
 *  - Crowd & noise        people walk the pavements around busy venues, noise ripples spread out;
 *                         quiet venues get a calm green halo
 *  - Seating & Wi-Fi      Wi-Fi symbol loses bars as a venue fills up
 *  - Community Intelligence  chat bubbles pop above venues with live reports
 *  - Transparent data     one venue is permanently grey = "Unknown"
 *  - Suitability Engine   a dashed route runs from "You" to the best-fit venue for the
 *                         current activity, with a "Focus Fit %" label
 *
 * Palette is lifted from the BUILD 01 branding: ivory, sage, mustard, ink.
 *
 * Props
 *   showHud   small clock / activity / legend card, bottom-right (hidden on small screens)
 *   startDay  0 = Mon … 6 = Sun
 */

const IVORY_HEX = 0xf4f1e8;
const INK = 0x1f2421;
const SAGE = 0x86a37f;
const MUSTARD = 0xe8b84a;
const FOG_NEAR = 46;
const FOG_FAR = 135;

const PITCH = 12; // city block pitch (world units)
const STREET_W = 2.6;
const HALF = (PITCH - STREET_W) / 2; // half of a block's buildable area
const WORLD = { x0: -100, z0: -130, size: 200 }; // area covered by the map texture
const USER = { x: -6, z: -6 };

const DAY_SECONDS = 75; // 7:00 → 22:00
const NIGHT_SECONDS = 6; // 22:00 → 7:00 (fast-forward)
const LOOP = DAY_SECONDS + NIGHT_SECONDS;
const ACTIVITY_SECONDS = 12;
const N_PEOPLE = 26;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ACTIVITIES = [
  { name: "Quiet reading", aff: { library: 1, cafe: 0.35, cowork: 0.5 } },
  { name: "Online calls", aff: { library: 0.1, cafe: 0.3, cowork: 1 } },
  { name: "Group discussion", aff: { library: 0.15, cafe: 1, cowork: 0.6 } },
  { name: "Laptop work", aff: { library: 0.6, cafe: 0.7, cowork: 1 } },
];

const LEGEND = [
  ["Quiet", "#5fa06a"],
  ["Moderate", "#e8b84a"],
  ["Busy", "#c9473a"],
  ["Unknown / closed", "#9a9a90"],
];

// ── Math helpers ───────────────────────────────────────────
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ss = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;
const hash2 = (x, y) => {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
};
const vnoise = (x, y) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x, y, oct = 3) => {
  let s = 0;
  let a = 0.5;
  let f = 1;
  let n = 0;
  for (let i = 0; i < oct; i++) {
    s += a * vnoise(x * f + i * 31.7, y * f - i * 17.3);
    n += a;
    f *= 2.03;
    a *= 0.5;
  }
  return s / n;
};
const mulberry32 = (seed) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// ── City layout ────────────────────────────────────────────
// Venue blocks (i, j) → block centre is (i * PITCH, j * PITCH).
const VENUES = [
  { type: "library", i: -2, j: -2, wifi: false, live: true, bias: 0.0 },
  { type: "cafe", i: 1, j: -1, wifi: true, live: true, bias: 0.08 },
  { type: "cafe", i: -3, j: -1, wifi: true, live: false, bias: -0.05 },
  { type: "cowork", i: 2, j: -3, wifi: true, live: true, bias: 0.0 },
  { type: "library", i: 3, j: -2, wifi: false, live: false, bias: -0.08 },
  { type: "cafe", i: -1, j: -3, wifi: true, live: false, bias: 0.05 },
  { type: "cowork", i: 0, j: -5, wifi: true, live: false, bias: 0.1 },
  { type: "cafe", i: -1, j: -1, wifi: false, live: false, bias: 0, unknown: true },
  { type: "library", i: 4, j: -5, wifi: false, live: false, bias: 0.0 },
  { type: "cafe", i: -4, j: -4, wifi: true, live: true, bias: -0.1 },
];
const venueAt = (i, j) => VENUES.some((v) => v.i === i && v.j === j);
const riverZ = (x) => 4.5 + 2.2 * Math.sin(x * 0.07 + 0.8);
const blockKind = (i, j) => {
  if (j >= 0) return "bank";
  if (venueAt(i, j)) return "venue";
  if (j > -9 && hash2(i * 3.1 + 7, j * 5.7 + 2) < 0.1) return "park";
  return "city";
};

// ── Rule-based "Quiet When" crowd model ────────────────────
const gauss = (h, m, s) => Math.exp(-((h - m) ** 2) / (2 * s * s));
const MODEL = {
  cafe: {
    open: 7,
    close: 22,
    f: (h, wk) =>
      0.14 + 0.62 * gauss(h, 9, 1.2) * (wk ? 0.7 : 1) + 0.5 * gauss(h, 13, 1.1) + 0.85 * gauss(h, 18.2, 1.7) * (wk ? 1.1 : 1),
  },
  library: {
    open: 8,
    close: 21,
    f: (h, wk) => 0.18 + (wk ? 0.55 : 0.65) * gauss(h, 12.2, 2.2) + 0.8 * gauss(h, 16.8, 2.3),
  },
  cowork: {
    open: 7,
    close: 22,
    f: (h, wk) => (wk ? 0.35 : 1) * (0.12 + 0.78 * gauss(h, 11, 2.2) + 0.55 * gauss(h, 15.3, 1.8)),
  },
};
const crowdAt = (v, hour, day) => {
  const M = MODEL[v.type];
  const hh = hour % 24;
  const open = ss(M.open - 0.6, M.open + 0.4, hh) * (1 - ss(M.close - 0.9, M.close + 0.1, hh));
  const base = clamp01(M.f(hh, day >= 5) + v.bias + 0.05 * Math.sin(hour * 1.3 + v.phase));
  return { crowd: base * open, open };
};

const C_QUIET = new THREE.Color(0x5fa06a);
const C_MOD = new THREE.Color(0xe8b84a);
const C_BUSY = new THREE.Color(0xc9473a);
const C_CLOSED = new THREE.Color(0xa9a596);
const C_UNK = new THREE.Color(0x8c98a0);
const statusColor = (crowd, open, unknown, out) => {
  if (unknown) return out.copy(C_UNK);
  out.copy(C_QUIET).lerp(C_MOD, ss(0.28, 0.5, crowd)).lerp(C_BUSY, ss(0.62, 0.82, crowd));
  return out.lerp(C_CLOSED, 1 - ss(0.05, 0.5, open));
};

// ── Canvas helpers ─────────────────────────────────────────
const rr = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

// Top-down map: blocks, parks, river, streets, paper grain.
const makeMapTexture = (aniso) => {
  const S = 2048;
  const u = S / WORLD.size;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const ctx = cv.getContext("2d");
  const X = (x) => (x - WORLD.x0) * u;
  const Z = (z) => (z - WORLD.z0) * u;
  const rng = mulberry32(5);

  ctx.fillStyle = "#ece7d6";
  ctx.fillRect(0, 0, S, S);

  for (let i = -9; i <= 9; i++) {
    for (let j = -11; j <= 6; j++) {
      const kind = blockKind(i, j);
      const cx = i * PITCH;
      const cz = j * PITCH;
      ctx.fillStyle =
        kind === "park" ? "#bfd1a8" : kind === "bank" ? "#d3dbb4" : kind === "venue" ? "#efe8c8" : "#e2dcc6";
      rr(ctx, X(cx - HALF), Z(cz - HALF), HALF * 2 * u, HALF * 2 * u, 0.6 * u);
      ctx.fill();
      if (kind === "park" || kind === "bank") {
        ctx.fillStyle = "rgba(120,150,95,0.28)";
        for (let k = 0; k < 16; k++) {
          ctx.beginPath();
          ctx.arc(X(cx + (rng() - 0.5) * 8.6), Z(cz + (rng() - 0.5) * 8.6), (0.25 + rng() * 0.5) * u, 0, 7);
          ctx.fill();
        }
      }
    }
  }

  // river (streets are drawn after it, so they read as bridges)
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const river = (w, col) => {
    ctx.strokeStyle = col;
    ctx.lineWidth = w * u;
    ctx.beginPath();
    for (let x = WORLD.x0; x <= WORLD.x0 + WORLD.size; x += 2) {
      const px = X(x);
      const pz = Z(riverZ(x));
      if (x === WORLD.x0) ctx.moveTo(px, pz);
      else ctx.lineTo(px, pz);
    }
    ctx.stroke();
  };
  river(7.4, "#a5beb9");
  river(5.8, "#bcd4cf");
  ctx.setLineDash([1.4 * u, 2.6 * u]);
  river(0.14, "#e6f0ed");
  ctx.setLineDash([]);

  // streets: soft edge pass, then pale surface
  for (let pass = 0; pass < 2; pass++) {
    ctx.fillStyle = pass === 0 ? "#d8d1b8" : "#fbf9f1";
    const w = (STREET_W + (pass === 0 ? 0.35 : 0)) * u;
    for (let k = -9; k <= 9; k++) {
      const p = PITCH * k + PITCH / 2;
      ctx.fillRect(X(p) - w / 2, 0, w, S);
      ctx.fillRect(0, Z(p) - w / 2, S, w);
    }
  }
  // dashed centre lines on every third street
  ctx.strokeStyle = "#e6dfc8";
  ctx.lineWidth = 0.14 * u;
  ctx.setLineDash([1.2 * u, 1.2 * u]);
  for (let k = -9; k <= 9; k += 3) {
    const p = PITCH * k + PITCH / 2;
    ctx.beginPath();
    ctx.moveTo(X(p), 0);
    ctx.lineTo(X(p), S);
    ctx.moveTo(0, Z(p));
    ctx.lineTo(S, Z(p));
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // paper grain
  for (let n = 0; n < 6000; n++) {
    ctx.fillStyle = rng() > 0.5 ? "rgba(60,50,20,0.035)" : "rgba(255,255,255,0.06)";
    ctx.fillRect(rng() * S, rng() * S, 1 + rng() * 2, 1 + rng() * 2);
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = aniso;
  return tex;
};

const makeGlowTexture = () => {
  const size = 128;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.4)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(cv);
};

const makeCloudTexture = () => {
  const w = 256;
  const h = 128;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d");
  const rng = mulberry32(11);
  for (let i = 0; i < 70; i++) {
    const x = rng() * w;
    const y = h / 2 + (rng() - 0.5) * 50;
    const r = 18 + rng() * 42;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,0.10)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.globalCompositeOperation = "destination-in";
  const m = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  m.addColorStop(0, "rgba(0,0,0,1)");
  m.addColorStop(0.65, "rgba(0,0,0,0.8)");
  m.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save();
  ctx.scale(1, h / w);
  ctx.fillStyle = m;
  ctx.fillRect(0, 0, w, w);
  ctx.restore();
  return new THREE.CanvasTexture(cv);
};

const makeBubbleTexture = () => {
  const cv = document.createElement("canvas");
  cv.width = 128;
  cv.height = 112;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#faf7ee";
  ctx.strokeStyle = "#1f2421";
  ctx.lineWidth = 6;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(34, 78);
  ctx.lineTo(26, 104);
  ctx.lineTo(62, 78);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  rr(ctx, 8, 8, 112, 72, 26);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#1f2421";
  [40, 64, 88].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, 44, 7, 0, 7);
    ctx.fill();
  });
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

// Concatenate position / normal / color into one non-indexed geometry
const mergeSimple = (geos) => {
  const parts = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  let total = 0;
  parts.forEach((p) => (total += p.attributes.position.count));
  const out = {
    position: new Float32Array(total * 3),
    normal: new Float32Array(total * 3),
    color: new Float32Array(total * 3),
  };
  let off = 0;
  parts.forEach((p) => {
    Object.keys(out).forEach((k) => out[k].set(p.attributes[k].array, off * 3));
    off += p.attributes.position.count;
  });
  const merged = new THREE.BufferGeometry();
  Object.keys(out).forEach((k) => merged.setAttribute(k, new THREE.BufferAttribute(out[k], 3)));
  parts.forEach((p) => p.dispose());
  geos.forEach((g) => g.dispose());
  return merged;
};
const tmpC = new THREE.Color();
const paint = (geo, hex) => {
  tmpC.set(hex);
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    arr[i * 3] = tmpC.r;
    arr[i * 3 + 1] = tmpC.g;
    arr[i * 3 + 2] = tmpC.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
  return geo;
};

const buildTree = () => {
  const trunk = new THREE.CylinderGeometry(0.09, 0.14, 0.8, 5);
  trunk.translate(0, 0.4, 0);
  const c1 = new THREE.SphereGeometry(0.85, 8, 6);
  c1.scale(1, 1.1, 1);
  c1.translate(0, 1.55, 0);
  const c2 = new THREE.SphereGeometry(0.55, 8, 6);
  c2.translate(0.22, 2.15, 0.1);
  return mergeSimple([paint(trunk, 0x5b4636), paint(c1, 0x5f8a58), paint(c2, 0x76a06a)]);
};
const buildPerson = () => {
  const body = new THREE.CylinderGeometry(0.15, 0.2, 0.55, 6);
  body.translate(0, 0.3, 0);
  const head = new THREE.SphereGeometry(0.15, 8, 6);
  head.translate(0, 0.74, 0);
  return mergeSimple([paint(body, INK), paint(head, INK)]);
};

// Walk around a square ring (the pavement around a block). s in "sides", h = half size.
const perim = (s, h, out) => {
  const w = ((s % 4) + 4) % 4;
  const side = Math.floor(w);
  const a = -h + 2 * h * (w - side);
  if (side === 0) out.set(a, 0, -h);
  else if (side === 1) out.set(h, 0, a);
  else if (side === 2) out.set(-a, 0, h);
  else out.set(-h, 0, -a);
  return out;
};

const pushBoxEdges = (arr, x, z, w, h, d) => {
  const x0 = x - w / 2;
  const x1 = x + w / 2;
  const z0 = z - d / 2;
  const z1 = z + d / 2;
  const P = [
    [x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1],
    [x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1],
  ];
  const E = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7];
  E.forEach((k) => arr.push(P[k][0], P[k][1], P[k][2]));
};

const fmtHour = (h) => {
  const hh = Math.floor(h) % 24;
  const mm = Math.floor(((h % 1) * 60) / 10) * 10;
  const ap = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${ap}`;
};

// ── Component ──────────────────────────────────────────────
export default function QuietPlaceScene({ showHud = true, startDay = 1 }) {
  const mountRef = useRef(null);
  const clockRef = useRef(null);
  const activityRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || 700;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.shadowMap.autoUpdate = false; // refreshed every few frames as the sun moves
      renderer.domElement.style.display = "block";
      mount.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(IVORY_HEX, FOG_NEAR, FOG_FAR);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 300);
    const fitFov = (aspect) => 46 + Math.max(0, 1.78 - aspect) * 22; // widen on portrait screens
    camera.fov = Math.min(74, Math.max(46, fitFov(width / height)));
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, -16);
    camera.updateProjectionMatrix();

    const disposables = [];
    const track = (o) => {
      disposables.push(o);
      return o;
    };

    // ── Lights ──
    const sun = new THREE.DirectionalLight(0xffe2b8, 2.6);
    sun.target.position.set(0, 0, -30);
    sun.castShadow = true;
    const maxTex = renderer.capabilities.maxTextureSize || 2048;
    sun.shadow.mapSize.set(Math.min(2048, maxTex), Math.min(2048, maxTex));
    Object.assign(sun.shadow.camera, { left: -85, right: 85, top: 85, bottom: -85, near: 1, far: 420 });
    sun.shadow.camera.updateProjectionMatrix();
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.3;
    const hemi = new THREE.HemisphereLight(IVORY_HEX, 0x8a9a6a, 1.9);
    scene.add(sun, sun.target, hemi);

    // ── Ground (map texture) ──
    const aniso = renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 4;
    const mapTex = track(makeMapTexture(Math.min(aniso, 8)));
    const groundGeo = track(new THREE.PlaneGeometry(WORLD.size, WORLD.size));
    groundGeo.rotateX(-Math.PI / 2);
    groundGeo.translate(0, 0, WORLD.z0 + WORLD.size / 2);
    const ground = new THREE.Mesh(
      groundGeo,
      track(new THREE.MeshStandardMaterial({ map: mapTex, roughness: 1, metalness: 0 }))
    );
    ground.receiveShadow = true;
    scene.add(ground);

    const rng = mulberry32(7);

    // ── City buildings (instanced, with ink outlines) ──
    const lots = [];
    const edgePts = [];
    for (let i = -8; i <= 8; i++) {
      for (let j = -10; j <= -1; j++) {
        if (blockKind(i, j) !== "city") continue;
        const bx = i * PITCH;
        const bz = j * PITCH;
        const density = fbm(bx * 0.03 + 4, bz * 0.03 + 9);
        const r0 = hash2(i * 9.1, j * 4.3);
        if (r0 < 0.22) {
          const h = 1.6 + hash2(i, j * 2.2) * 2.6;
          lots.push({ x: bx, z: bz, w: 7.4 + hash2(j, i) * 1.2, d: 6.4 + hash2(i + 3, j) * 1.4, h });
        } else {
          for (let k = 0; k < 4; k++) {
            const r = hash2(i * 7.1 + k * 1.7, j * 3.3 + k);
            if (r < 0.08) continue;
            const h = 1 + r * r * 5.5 * (0.5 + density) + (r > 0.93 ? 3 : 0);
            lots.push({
              x: bx + (k % 2 ? 2.3 : -2.3),
              z: bz + (k < 2 ? -2.3 : 2.3),
              w: 3.1 + hash2(k, i + j) * 0.6,
              d: 3.1 + hash2(i - j, k) * 0.6,
              h,
            });
          }
        }
      }
    }
    const boxGeo = track(new THREE.BoxGeometry(1, 1, 1));
    boxGeo.translate(0, 0.5, 0);
    {
      // fake ambient occlusion: darker at the base, lighter at the roof
      const p = boxGeo.attributes.position;
      const col = new Float32Array(p.count * 3);
      for (let n = 0; n < p.count; n++) {
        const v = lerp(0.78, 1, p.getY(n));
        col[n * 3] = col[n * 3 + 1] = col[n * 3 + 2] = v;
      }
      boxGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    }
    const cityMesh = new THREE.InstancedMesh(
      boxGeo,
      track(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 })),
      lots.length
    );
    const dummy = new THREE.Object3D();
    lots.forEach((l, n) => {
      dummy.position.set(l.x, 0, l.z);
      dummy.scale.set(l.w, l.h, l.d);
      dummy.updateMatrix();
      cityMesh.setMatrixAt(n, dummy.matrix);
      const t = hash2(n * 1.3, 4.1);
      const c = mixRgb([0.86, 0.84, 0.78], [0.78, 0.75, 0.68], t);
      tmpC.setRGB(c[0], c[1], c[2], THREE.SRGBColorSpace);
      cityMesh.setColorAt(n, tmpC);
      pushBoxEdges(edgePts, l.x, l.z, l.w, l.h, l.d);
    });
    cityMesh.castShadow = true;
    cityMesh.receiveShadow = true;
    cityMesh.frustumCulled = false;
    scene.add(cityMesh);
    const edgeMat = track(new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.5 }));
    const cityEdgeGeo = track(new THREE.BufferGeometry());
    cityEdgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgePts, 3));
    const cityEdges = new THREE.LineSegments(cityEdgeGeo, edgeMat);
    cityEdges.frustumCulled = false;
    scene.add(cityEdges);

    // ── Trees (parks + street trees), gently swaying ──
    const trees = [];
    for (let i = -8; i <= 8; i++) {
      for (let j = -10; j <= 0; j++) {
        if (blockKind(i, j) !== "park") continue;
        const n = 9 + Math.floor(rng() * 6);
        for (let k = 0; k < n; k++) {
          trees.push({ x: i * PITCH + (rng() - 0.5) * 8.4, z: j * PITCH + (rng() - 0.5) * 8.4, s: 0.7 + rng() * 0.5 });
        }
      }
    }
    for (let k = -9; k <= 8; k++) {
      const line = PITCH * k + PITCH / 2;
      for (let t = -110; t < 4; t += 3.6) {
        const nearCross = Math.abs((((t % PITCH) + PITCH) % PITCH) - PITCH / 2) < 2.4;
        if (nearCross) continue;
        if (rng() < 0.45) trees.push({ x: line + (rng() < 0.5 ? -1.6 : 1.6), z: t, s: 0.5 + rng() * 0.35 });
        if (rng() < 0.45) trees.push({ x: t, z: line + (rng() < 0.5 ? -1.6 : 1.6), s: 0.5 + rng() * 0.35 });
      }
    }
    const swayTime = { value: 0 };
    const treeMat = track(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 }));
    treeMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = swayTime;
      shader.vertexShader =
        "uniform float uTime;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          #ifdef USE_INSTANCING
            float sw = sin(uTime * 1.1 + instanceMatrix[3].x * 0.35 + instanceMatrix[3].z * 0.27);
            float sh = max(position.y - 0.8, 0.0);
            transformed.x += sw * 0.1 * sh;
            transformed.z += cos(uTime * 0.9 + instanceMatrix[3].z * 0.3) * 0.05 * sh;
          #endif`
        );
    };
    const treeMesh = new THREE.InstancedMesh(track(buildTree()), treeMat, trees.length);
    trees.forEach((t, n) => {
      dummy.position.set(t.x, 0, t.z);
      dummy.rotation.set(0, rng() * 6.28, 0);
      dummy.scale.setScalar(t.s);
      dummy.updateMatrix();
      treeMesh.setMatrixAt(n, dummy.matrix);
      const b = 0.85 + rng() * 0.3;
      const autumn = rng() < 0.14; // a few mustard trees, like the BUILD 01 collage
      tmpC.setRGB(b * (autumn ? 1.45 : 0.95), b * (autumn ? 1.1 : 1), b * (autumn ? 0.55 : 0.95));
      treeMesh.setColorAt(n, tmpC);
    });
    dummy.rotation.set(0, 0, 0);
    treeMesh.castShadow = true;
    treeMesh.receiveShadow = true;
    treeMesh.frustumCulled = false;
    scene.add(treeMesh);

    // ── Venue buildings ──
    const matCache = new Map();
    const mat = (hex, emissive = 0) => {
      const key = `${hex}-${emissive}`;
      if (!matCache.has(key)) {
        const m = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.9, metalness: 0 });
        if (emissive) {
          m.emissive = new THREE.Color(emissive);
          m.emissiveIntensity = 0.35;
        }
        matCache.set(key, track(m));
      }
      return matCache.get(key);
    };
    const part = (grp, geo, hex, x, y, z, outline = false, emissive = 0) => {
      track(geo);
      const m = new THREE.Mesh(geo, mat(hex, emissive));
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      grp.add(m);
      if (outline) {
        const l = new THREE.LineSegments(track(new THREE.EdgesGeometry(geo, 35)), edgeMat);
        l.position.copy(m.position);
        grp.add(l);
      }
      return m;
    };
    const box = (g, w, h, d, hex, x, y0, z, outline = true, emissive = 0) =>
      part(g, new THREE.BoxGeometry(w, h, d), hex, x, y0 + h / 2, z, outline, emissive);
    const cyl = (g, rt, rb, h, hex, x, y0, z, seg = 10) =>
      part(g, new THREE.CylinderGeometry(rt, rb, h, seg), hex, x, y0 + h / 2, z);

    const buildLibrary = () => {
      const g = new THREE.Group();
      box(g, 7.6, 0.4, 6.2, 0xd8d2bf, 0, 0, 0);
      box(g, 6.4, 3.0, 4.4, 0xece6d3, 0, 0.4, -0.4);
      for (let k = 0; k < 6; k++) cyl(g, 0.2, 0.2, 2.6, 0xf6f2e6, -2.75 + k * 1.1, 0.4, 2.2);
      box(g, 6.8, 0.45, 1.6, 0xd8d2bf, 0, 3.0, 1.9);
      box(g, 6.6, 0.3, 4.6, 0xcfc9b4, 0, 3.4, -0.4);
      cyl(g, 1.5, 1.6, 0.6, 0xece6d3, 0, 3.7, -0.4, 20);
      part(g, new THREE.SphereGeometry(1.5, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), SAGE, 0, 4.3, -0.4);
      return { group: g, pinY: 7.0 };
    };
    const buildCafe = () => {
      const g = new THREE.Group();
      box(g, 5.2, 2.4, 4.2, 0xf3edd9, 0, 0, -0.6);
      box(g, 5.6, 0.35, 4.6, MUSTARD, 0, 2.4, -0.6);
      for (let k = 0; k < 6; k++) {
        const a = box(g, 0.9, 0.12, 1.5, k % 2 ? 0xf6f0dc : MUSTARD, -2.25 + k * 0.9, 1.75, 2.1, false);
        a.rotation.x = -0.32;
      }
      cyl(g, 0.55, 0.42, 0.75, 0xfaf7ee, 1.6, 2.75, -0.6, 14);
      part(g, new THREE.TorusGeometry(0.28, 0.07, 6, 12), 0xfaf7ee, 2.15, 3.1, -0.6);
      [-1.8, 0, 1.8].forEach((x, n) => {
        cyl(g, 0.06, 0.06, 1.5, INK, x, 0, 3.6, 5);
        cyl(g, 0.55, 0.55, 0.08, 0xfaf7ee, x, 0.65, 3.6, 12);
        if (n !== 1) part(g, new THREE.ConeGeometry(0.95, 0.4, 10), MUSTARD, x, 1.7, 3.6);
      });
      return { group: g, pinY: 5.4 };
    };
    const buildCowork = () => {
      const g = new THREE.Group();
      box(g, 5.8, 6.4, 5.0, 0x35413b, 0, 0, -0.2);
      for (let k = 0; k < 5; k++) box(g, 5.86, 0.55, 5.06, 0xd6e6d9, 0, 0.8 + k * 1.15, -0.2, false, 0x9fc79f);
      box(g, 5.8, 0.25, 5.0, MUSTARD, 0, 6.4, -0.2);
      box(g, 3.0, 0.7, 2.6, 0x8fae86, 0, 6.65, -0.2);
      for (let k = 0; k < 5; k++) box(g, 0.14, 6.4, 0.3, INK, -2.4 + k * 1.2, 0, 2.45, false);
      return { group: g, pinY: 9.2 };
    };
    const BUILDERS = { library: buildLibrary, cafe: buildCafe, cowork: buildCowork };

    // ── Venue extras: pins, rings, halos, Wi-Fi, chat bubbles ──
    const glowTex = track(makeGlowTexture());
    const bubbleTex = track(makeBubbleTexture());
    const ringGeo = track(new THREE.RingGeometry(0.92, 1.0, 72));
    ringGeo.rotateX(-Math.PI / 2);
    const haloGeo = track(new THREE.CircleGeometry(8, 48));
    haloGeo.rotateX(-Math.PI / 2);
    const pinCone = track(new THREE.ConeGeometry(0.55, 1.3, 16));
    const pinHead = track(new THREE.SphereGeometry(0.62, 20, 14));
    const pinDot = track(new THREE.SphereGeometry(0.22, 12, 8));
    const dotMat = track(new THREE.MeshBasicMaterial({ color: 0xfaf7ee }));

    const makePin = () => {
      const g = new THREE.Group();
      const m = track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, metalness: 0 }));
      m.emissive = new THREE.Color(0x000000);
      const cone = new THREE.Mesh(pinCone, m);
      cone.rotation.x = Math.PI;
      cone.position.y = 0.65;
      const head = new THREE.Mesh(pinHead, m);
      head.position.y = 1.45;
      const dot = new THREE.Mesh(pinDot, dotMat);
      dot.position.set(0, 1.45, 0.52);
      [cone, head].forEach((o) => (o.castShadow = true));
      g.add(cone, head, dot);
      return { group: g, mat: m };
    };
    const makeWifi = () => {
      const g = new THREE.Group();
      const mats = [0.5, 0.95, 1.4].map((r) => {
        const m = track(new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 1 }));
        const mesh = new THREE.Mesh(new THREE.TorusGeometry(r, 0.09, 6, 24, Math.PI / 2), m);
        mesh.rotation.z = Math.PI / 4;
        g.add(mesh);
        return m;
      });
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), track(new THREE.MeshBasicMaterial({ color: INK }))));
      return { group: g, mats };
    };
    const makeLabel = (text, bg, fg, cw) => {
      const cv = document.createElement("canvas");
      cv.width = cw;
      cv.height = 128;
      const ctx = cv.getContext("2d");
      const tex = track(new THREE.CanvasTexture(cv));
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false })
      );
      sprite.renderOrder = 10;
      sprite.scale.set((cw / 128) * 2.1, 2.1, 1);
      let cur = "";
      const set = (t) => {
        if (t === cur) return;
        cur = t;
        ctx.clearRect(0, 0, cw, 128);
        ctx.fillStyle = bg;
        rr(ctx, 6, 14, cw - 12, 84, 42);
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#1f2421";
        ctx.stroke();
        ctx.fillStyle = fg;
        ctx.font = "800 46px system-ui, -apple-system, 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(t, cw / 2, 57);
        tex.needsUpdate = true;
      };
      set(text);
      return { sprite, set };
    };

    const venues = VENUES.map((def, idx) => {
      const x = def.i * PITCH;
      const z = def.j * PITCH;
      const root = new THREE.Group();
      root.position.set(x, 0, z);
      scene.add(root);
      const b = BUILDERS[def.type]();
      root.add(b.group);

      const pin = makePin();
      pin.group.position.y = b.pinY;
      root.add(pin.group);

      const halo = new THREE.Mesh(
        haloGeo,
        track(new THREE.MeshBasicMaterial({ map: glowTex, color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false }))
      );
      halo.position.y = 0.05;
      root.add(halo);

      const rings = [0, 1, 2].map(() => {
        const m = track(
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -2,
          })
        );
        const r = new THREE.Mesh(ringGeo, m);
        r.position.y = 0.07;
        r.renderOrder = 1;
        root.add(r);
        return r;
      });

      let wifi = null;
      if (def.wifi) {
        wifi = makeWifi();
        wifi.group.position.set(-2.1, b.pinY + 0.4, 0);
        root.add(wifi.group);
      }
      let bubble = null;
      if (def.live) {
        bubble = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: bubbleTex, transparent: true, depthWrite: false, opacity: 0 })
        );
        bubble.position.set(1.7, b.pinY + 2.1, 0);
        bubble.scale.set(0.001, 0.001, 1);
        root.add(bubble);
      }
      return {
        ...def,
        idx,
        x,
        z,
        root,
        pin,
        halo,
        rings,
        wifi,
        bubble,
        pinY: b.pinY,
        phase: hash2(idx, 3.3) * 6.28,
        crowd: 0,
        open: 1,
        focus: 0,
        color: new THREE.Color(),
      };
    });

    // ── People walking the pavements ──
    const people = new THREE.InstancedMesh(
      track(buildPerson()),
      track(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0 })),
      venues.length * N_PEOPLE
    );
    people.castShadow = true;
    people.frustumCulled = false;
    scene.add(people);
    const peopleData = [];
    venues.forEach(() => {
      for (let k = 0; k < N_PEOPLE; k++) {
        peopleData.push({
          s0: rng() * 4,
          dir: rng() < 0.5 ? -1 : 1,
          speed: 0.022 + rng() * 0.02,
          off: (rng() - 0.5) * 0.9,
          ph: rng() * 6.28,
        });
      }
    });
    const tmpV = new THREE.Vector3();

    // ── "You" marker + route to the best-fit venue ──
    const you = new THREE.Group();
    you.position.set(USER.x, 0, USER.z);
    const youBody = new THREE.Mesh(people.geometry, mat(INK));
    youBody.scale.setScalar(2.4);
    you.add(youBody);
    const youRings = [0, 1].map(() => {
      const r = new THREE.Mesh(
        ringGeo,
        track(new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0, depthWrite: false }))
      );
      r.position.y = 0.08;
      you.add(r);
      return r;
    });
    const youLabel = makeLabel("You", "#faf7ee", "#1f2421", 192);
    youLabel.sprite.position.set(0, 4.6, 0);
    you.add(youLabel.sprite);
    scene.add(you);

    const bestLabel = makeLabel("Focus Fit", "#e8b84a", "#1f2421", 512);
    scene.add(bestLabel.sprite);

    const ROUTE_PTS = 48;
    const routeStart = new THREE.Vector3(USER.x, 0.3, USER.z);
    const routeEnd = new THREE.Vector3(USER.x, 0.3, USER.z);
    const routeMid = new THREE.Vector3();
    const routeCurve = new THREE.QuadraticBezierCurve3(routeStart, routeMid, routeEnd);
    const routeGeo = track(new THREE.BufferGeometry());
    routeGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ROUTE_PTS * 3), 3));
    const routeLine = new THREE.Line(
      routeGeo,
      track(new THREE.LineDashedMaterial({ color: INK, dashSize: 0.7, gapSize: 0.55, transparent: true, opacity: 0.6 }))
    );
    routeLine.frustumCulled = false;
    scene.add(routeLine);
    const N_DOTS = 12;
    const routeDots = new THREE.InstancedMesh(
      track(new THREE.SphereGeometry(0.22, 8, 6)),
      track(new THREE.MeshBasicMaterial({ color: MUSTARD, toneMapped: false })),
      N_DOTS
    );
    routeDots.frustumCulled = false;
    scene.add(routeDots);

    // ── Sky glow, mist, dust ──
    const sunGlow = new THREE.Sprite(
      track(
        new THREE.SpriteMaterial({
          map: glowTex,
          color: 0xffd9a0,
          transparent: true,
          opacity: 0.5,
          depthWrite: false,
          fog: false,
          toneMapped: false,
        })
      )
    );
    sunGlow.scale.set(120, 120, 1);
    scene.add(sunGlow);

    const cloudTex = track(makeCloudTexture());
    const mists = [];
    for (let n = 0; n < 6; n++) {
      const sp = new THREE.Sprite(
        track(
          new THREE.SpriteMaterial({
            map: cloudTex,
            color: IVORY_HEX,
            transparent: true,
            opacity: 0.22 + rng() * 0.1,
            depthWrite: false,
            toneMapped: false,
          })
        )
      );
      const w = 40 + rng() * 30;
      sp.scale.set(w, w * 0.3, 1);
      sp.position.set((rng() - 0.5) * 150, 7 + rng() * 5, -14 - rng() * 50);
      scene.add(sp);
      mists.push({ sp, speed: 0.2 + rng() * 0.3 });
    }
    const DUST = 140;
    const dustPos = new Float32Array(DUST * 3);
    for (let n = 0; n < DUST; n++) {
      dustPos[n * 3] = (rng() - 0.5) * 90;
      dustPos[n * 3 + 1] = 1 + rng() * 11;
      dustPos[n * 3 + 2] = -60 + rng() * 70;
    }
    const dustGeo = track(new THREE.BufferGeometry());
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      track(
        new THREE.PointsMaterial({
          map: glowTex,
          color: MUSTARD,
          size: 0.6,
          transparent: true,
          opacity: 0.5,
          depthWrite: false,
        })
      )
    );
    dust.frustumCulled = false;
    scene.add(dust);

    // ── Mouse parallax ──
    let mx = 0;
    let tx = 0;
    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 5;
    };
    if (!reduced) window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Simulation state ──
    let bestIdx = -1;
    let lastPick = -10;
    let clockText = "";
    let activityText = "";
    let frameN = 0;
    const tmpCol = new THREE.Color();
    const sunDir = new THREE.Vector3();
    const START_DAY = ((startDay % 7) + 7) % 7;

    const scoreOf = (v, act) => {
      const dist = Math.hypot(v.x - USER.x, v.z - USER.z);
      return 0.55 * (1 - v.crowd) + 0.35 * act.aff[v.type] + 0.1 * (1 - clamp01(dist / 70));
    };

    const frame = (elapsed, dt, hourOverride) => {
      // clock
      let hour;
      let dayIdx;
      if (hourOverride != null) {
        hour = hourOverride;
        dayIdx = START_DAY;
      } else {
        const loopN = Math.floor(elapsed / LOOP);
        const tau = elapsed - loopN * LOOP;
        hour = tau < DAY_SECONDS ? 7 + (tau / DAY_SECONDS) * 15 : 22 + ((tau - DAY_SECONDS) / NIGHT_SECONDS) * 9;
        dayIdx = (START_DAY + loopN) % 7;
      }
      const act = ACTIVITIES[Math.floor(elapsed / ACTIVITY_SECONDS) % ACTIVITIES.length];

      // sun follows the clock
      const e = Math.sin((Math.PI * (hour - 6)) / 14);
      const day = ss(-0.02, 0.3, e);
      const el = ((10 + 48 * Math.max(e, 0)) * Math.PI) / 180;
      const az = lerp(-1.2, 1.2, clamp01((hour - 6) / 14));
      sunDir.set(Math.sin(az) * Math.cos(el), Math.sin(el), 0.15 * Math.cos(el)).normalize();
      sun.position.copy(sun.target.position).addScaledVector(sunDir, 170);
      sun.intensity = 0.4 + 2.4 * day;
      sun.color.set(0xffb878).lerp(tmpCol.set(0xfff1dc), ss(0.05, 0.55, e));
      hemi.intensity = 1.1 + 0.8 * day;
      sunGlow.position.set(Math.sin(az) * 95, 14, -165);
      sunGlow.material.opacity = 0.5 * day;

      // camera
      mx += (tx - mx) * 0.04;
      camera.position.x = mx + Math.sin(elapsed * 0.07) * 1.8;
      camera.position.y = 15 + Math.sin(elapsed * 0.11) * 0.3;
      camera.lookAt(mx * 0.25, 0, -16);

      swayTime.value = elapsed;

      // venues
      venues.forEach((v) => {
        if (v.unknown) {
          v.crowd = 0;
          v.open = 1;
        } else {
          const r = crowdAt(v, hour, dayIdx);
          v.crowd = r.crowd;
          v.open = r.open;
        }
        statusColor(v.crowd, v.open, v.unknown, v.color);
        v.pin.mat.color.copy(v.color);
        v.pin.mat.emissive.copy(v.color).multiplyScalar(0.28);
        v.pin.group.position.y = v.pinY + Math.sin(elapsed * 1.4 + v.phase) * 0.18;
        v.focus += ((v.idx === bestIdx ? 1 : 0) - v.focus) * Math.min(1, dt * 4);
        v.pin.group.scale.setScalar(1 + 0.45 * v.focus);

        const live = v.unknown ? 0 : v.open;
        v.halo.material.color.copy(v.color);
        v.halo.material.opacity = (0.16 + 0.22 * (1 - v.crowd)) * (v.unknown ? 0.6 : 0.4 + 0.6 * live);
        const noisy = smooth3(v.crowd, 0.25, 0.7) * live;
        const period = lerp(5, 1.7, v.crowd);
        v.rings.forEach((r, k) => {
          const life = (elapsed / period + k / 3) % 1;
          r.scale.setScalar(lerp(5.6, 12, life));
          r.material.color.copy(v.color);
          r.material.opacity = (1 - life) * (1 - life) * 0.55 * noisy;
        });
        if (v.wifi) {
          const bars = v.crowd < 0.45 ? 3 : v.crowd < 0.75 ? 2 : 1;
          v.wifi.mats.forEach((m, k) => {
            const pulse = 0.5 + 0.5 * Math.sin(elapsed * 3 - k * 0.9);
            m.opacity = (k < bars ? 0.55 + 0.4 * pulse : 0.12) * (0.25 + 0.75 * live);
          });
        }
        if (v.bubble) {
          const local = (elapsed + v.phase * 2) % 8;
          const on = live > 0.6 && local < 2.4;
          const p = on ? easeOutBack(clamp01(local / 0.4)) * (1 - ss(1.9, 2.4, local)) : 0;
          v.bubble.scale.set(2.4 * p + 0.001, 2.1 * p + 0.001, 1);
          v.bubble.material.opacity = clamp01(p * 1.4);
        }
      });

      // suitability engine: pick best venue for the current activity
      if (elapsed - lastPick > 0.4 || hourOverride != null) {
        lastPick = elapsed;
        let cand = -1;
        let candScore = -1;
        venues.forEach((v) => {
          if (v.unknown || v.open < 0.6) return;
          const s = scoreOf(v, act);
          if (s > candScore) {
            candScore = s;
            cand = v.idx;
          }
        });
        const cur = bestIdx >= 0 ? venues[bestIdx] : null;
        const curOk = cur && !cur.unknown && cur.open >= 0.6;
        if (cand >= 0 && (!curOk || candScore > scoreOf(cur, act) + 0.05)) bestIdx = cand;
        if (hourOverride != null) {
          venues.forEach((v) => (v.focus = v.idx === bestIdx ? 1 : 0));
        }
      }

      // route + label
      const best = bestIdx >= 0 ? venues[bestIdx] : null;
      if (best) {
        const k = hourOverride != null ? 1 : 1 - Math.exp(-dt * 3);
        routeEnd.x += (best.x - routeEnd.x) * k;
        routeEnd.z += (best.z + 5.4 - routeEnd.z) * k;
        const dist = Math.hypot(routeEnd.x - routeStart.x, routeEnd.z - routeStart.z);
        routeMid.set((routeStart.x + routeEnd.x) / 2, 0.3 + 2 * (3 + dist * 0.12), (routeStart.z + routeEnd.z) / 2);
        for (let n = 0; n < ROUTE_PTS; n++) {
          routeCurve.getPoint(n / (ROUTE_PTS - 1), tmpV);
          routeGeo.attributes.position.setXYZ(n, tmpV.x, tmpV.y, tmpV.z);
        }
        routeGeo.attributes.position.needsUpdate = true;
        routeLine.computeLineDistances();
        for (let n = 0; n < N_DOTS; n++) {
          const u = (n / N_DOTS + elapsed * 0.1) % 1;
          routeCurve.getPoint(u, tmpV);
          dummy.position.copy(tmpV);
          dummy.scale.setScalar(0.5 + Math.sin(u * Math.PI));
          dummy.updateMatrix();
          routeDots.setMatrixAt(n, dummy.matrix);
        }
        routeDots.instanceMatrix.needsUpdate = true;
        bestLabel.set(`Focus Fit ${Math.round(clamp01(scoreOf(best, act)) * 99)}%`);
        const lp = best.pin.group.position;
        bestLabel.sprite.position.set(best.x, lp.y + 3.6 + best.focus * 0.4, best.z);
        bestLabel.sprite.visible = true;
      } else {
        bestLabel.sprite.visible = false;
      }

      // "You" pulse
      youRings.forEach((r, k) => {
        const life = (elapsed * 0.55 + k * 0.5) % 1;
        r.scale.setScalar(lerp(1.2, 4.2, life));
        r.material.opacity = (1 - life) * 0.5;
      });

      // people
      let pi = 0;
      venues.forEach((v) => {
        for (let k = 0; k < N_PEOPLE; k++, pi++) {
          const P = peopleData[pi];
          const vis = v.unknown ? 0 : clamp01(v.crowd * N_PEOPLE * 1.05 - k);
          if (vis <= 0.001) {
            dummy.position.set(v.x, -5, v.z);
            dummy.scale.setScalar(0.0001);
          } else {
            perim(P.s0 + elapsed * P.speed * P.dir, 5.3 + P.off, tmpV);
            dummy.position.set(v.x + tmpV.x, 0.04 + Math.abs(Math.sin(elapsed * 5 + P.ph)) * 0.05, v.z + tmpV.z);
            dummy.scale.setScalar(1.3 * vis);
          }
          dummy.updateMatrix();
          people.setMatrixAt(pi, dummy.matrix);
        }
      });
      people.instanceMatrix.needsUpdate = true;

      // mist + dust
      mists.forEach((m) => {
        m.sp.position.x += m.speed * dt;
        if (m.sp.position.x > 90) m.sp.position.x = -90;
      });
      const dp = dustGeo.attributes.position;
      for (let n = 0; n < DUST; n++) {
        let y = dp.getY(n) + dt * (0.15 + (n % 5) * 0.04);
        let x = dp.getX(n) + Math.sin(elapsed * 0.4 + n) * dt * 0.3;
        if (y > 12) y = 1;
        if (x > 45) x = -45;
        dp.setXYZ(n, x, y, dp.getZ(n));
      }
      dp.needsUpdate = true;

      // HUD (only touches the DOM when the text changes)
      const shownDay = DAYS[(dayIdx + (hour >= 24 ? 1 : 0)) % 7];
      const ct = `${shownDay} ${fmtHour(hour)}`;
      if (ct !== clockText && clockRef.current) {
        clockText = ct;
        clockRef.current.textContent = ct;
      }
      if (act.name !== activityText && activityRef.current) {
        activityText = act.name;
        activityRef.current.textContent = act.name;
      }

      if (frameN++ % 4 === 0) renderer.shadowMap.needsUpdate = true;
    };

    // ── Loop ──
    let animationId;
    let visible = true;
    const startMs = performance.now();
    let last = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startMs) / 1000;
      const dt = Math.min(elapsed - last, 0.1);
      last = elapsed;
      if (!visible) return;
      frame(elapsed, dt);
      renderer.render(scene, camera);
    };

    if (reduced) {
      frame(0, 0, 16); // one still frame: Tuesday 4 PM, a good mix of quiet and busy
      renderer.shadowMap.needsUpdate = true;
      renderer.render(scene, camera);
    } else {
      renderer.shadowMap.needsUpdate = true;
      animate();
    }

    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      observer.observe(mount);
    }

    const handleResize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || 700;
      camera.aspect = w / h;
      camera.fov = Math.min(74, Math.max(46, fitFov(w / h)));
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (reduced) renderer.render(scene, camera);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      observer && observer.disconnect();
      if (renderer.domElement && mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        if (o.isInstancedMesh) o.dispose();
      });
      disposables.forEach((d) => d.dispose && d.dispose());
      sun.shadow.map && sun.shadow.map.dispose();
      renderer.dispose();
    };
  }, [startDay]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div ref={mountRef} className="absolute inset-0" />
      {showHud && (
        <div
          className="hidden sm:block"
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            zIndex: 1,
            padding: "10px 14px 11px",
            background: "rgba(250,247,238,0.88)",
            border: "1.5px solid #8a7a3c",
            borderRadius: 12,
            color: "#1f2421",
            fontFamily: "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
            fontSize: 12,
            lineHeight: 1.45,
            minWidth: 176,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
            <span style={{ fontWeight: 700 }}>Quiet When</span>
            <span ref={clockRef} style={{ fontVariantNumeric: "tabular-nums" }}>
              Tue 7:00 AM
            </span>
          </div>
          <div style={{ opacity: 0.8 }}>
            Looking for: <b ref={activityRef}>Quiet reading</b>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 12px", marginTop: 6, fontSize: 11 }}>
            {LEGEND.map(([label, color]) => (
              <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <i style={{ width: 8, height: 8, borderRadius: 8, background: color, display: "inline-block" }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── small local helpers (hoisted function declarations) ────
function mixRgb(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}
function smooth3(x, a, b) {
  return ss(a, b, x);
}
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}