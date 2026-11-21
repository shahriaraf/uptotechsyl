/**
 * The page's 3D layer: glass objects drawn on one <canvas class="scene" data-scene="…"> behind the
 * .wrap of each section that has them (hero, services, prices, the payment offer: four WebGL contexts
 * at most). Each object sits at a fixed spot of its section, turns slowly and leans toward the
 * pointer; a canvas draws only while its section is on screen. With reduced motion every canvas is
 * drawn once and holds still. No WebGL: the canvases stay empty and the page reads the same.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

type Shape = 'knot' | 'ring' | 'sphere' | 'cube' | 'capsule';
// x: -0.5 (left edge) to 0.5 (right edge) of the section; y: 0 (top) to 1 (bottom); s: size; z: depth
type Spot = { x: number; y: number; s: number; z?: number; shape: Shape };

// placed in the empty parts of each section, clear of the headings and the body text
const SPOTS: Record<string, { desktop: Spot[]; phone: Spot[] }> = {
  hero: {
    desktop: [
      { x: 0.25, y: 0.2, s: 0.9, shape: 'knot' },
      { x: -0.3, y: 0.8, s: 1.05, z: -0.5, shape: 'ring' },
      { x: 0.41, y: 0.6, s: 0.4, z: 0.5, shape: 'cube' },
      { x: 0.06, y: 0.12, s: 0.22, z: -1, shape: 'sphere' },
    ],
    phone: [
      { x: 0.2, y: 0.16, s: 1.9, shape: 'knot' },
      { x: -0.3, y: 0.11, s: 0.6, z: -1, shape: 'sphere' },
    ],
  },
  services: {
    desktop: [{ x: 0.12, y: 0.17, s: 0.6, z: -1, shape: 'ring' }],
    phone: [],
  },
  prices: {
    desktop: [
      { x: 0.3, y: 0.12, s: 0.6, z: -1, shape: 'knot' },
      { x: -0.3, y: 0.62, s: 0.7, shape: 'sphere' },
    ],
    phone: [],
  },
  payment: {
    desktop: [
      { x: -0.36, y: 0.3, s: 0.55, shape: 'sphere' },
      { x: 0.37, y: 0.68, s: 0.7, z: -0.5, shape: 'capsule' },
    ],
    phone: [{ x: 0.28, y: 0.2, s: 1.2, shape: 'capsule' }],
  },
};

const FOV = 35;
const DIST = 10;
const VIEW_H = 2 * DIST * Math.tan(THREE.MathUtils.degToRad(FOV / 2)); // world height seen at z = 0

const geometries = new Map<Shape, THREE.BufferGeometry>();
function geometry(shape: Shape): THREE.BufferGeometry {
  let g = geometries.get(shape);
  if (g) return g;
  switch (shape) {
    case 'knot': g = new THREE.TorusKnotGeometry(0.62, 0.22, 220, 32, 2, 3); break;
    case 'ring': g = new THREE.TorusGeometry(0.75, 0.25, 48, 128); break;
    case 'sphere': g = new THREE.SphereGeometry(0.9, 64, 48); break;
    case 'cube': g = new RoundedBoxGeometry(1.25, 1.25, 1.25, 6, 0.24); break;
    case 'capsule': g = new THREE.CapsuleGeometry(0.42, 0.9, 12, 48); break;
  }
  geometries.set(shape, g);
  return g;
}

// one clear, slightly iridescent glass for every object (three keeps each renderer's state apart)
const glass = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.05,
  metalness: 0,
  transmission: 0.9,
  thickness: 1.6,
  ior: 1.5,
  dispersion: 5,
  iridescence: 0.6,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [180, 620],
  clearcoat: 1,
  clearcoatRoughness: 0.04,
  envMapIntensity: 1.8,
});

// a black room with soft boxes: the glass stays dark and clear, lit along its edges
function studio(renderer: THREE.WebGLRenderer) {
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x050505);
  const plane = new THREE.PlaneGeometry(1, 1);
  const lamp = (w: number, h: number, x: number, y: number, z: number, power: number) => {
    const m = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(power), side: THREE.DoubleSide }));
    m.scale.set(w, h, 1);
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    room.add(m);
  };
  lamp(7, 1.4, 0, 5, 2, 8);
  lamp(1.2, 6, -6, 0, 1, 5);
  lamp(1.2, 6, 6, 1, -2, 4);
  lamp(8, 0.6, 0, -4, 4, 2);
  lamp(3, 3, 3, 2, 6, 2.5);
  lamp(10, 10, 0, 0, -8, 0.35);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const texture = pmrem.fromScene(room, 0.02).texture;
  pmrem.dispose();
  plane.dispose();
  return texture;
}

type Item = { spot: Spot; mesh: THREE.Mesh; spin: THREE.Vector3; phase: number };

class Stage {
  renderer: THREE.WebGLRenderer | null = null;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  items: Item[] = [];
  w = 0;
  h = 0;
  canvas: HTMLCanvasElement;
  spots: { desktop: Spot[]; phone: Spot[] };

  constructor(canvas: HTMLCanvasElement, spots: { desktop: Spot[]; phone: Spot[] }) {
    this.canvas = canvas;
    this.spots = spots;
    this.camera.position.set(0, 0, DIST);
  }

  // the context is made only once this width has objects to draw
  build(phone: boolean) {
    this.items.forEach((it) => this.scene.remove(it.mesh));
    const list = phone ? this.spots.phone : this.spots.desktop;
    this.items = list.map((spot, i) => {
      const mesh = new THREE.Mesh(geometry(spot.shape), glass);
      mesh.rotation.set(i * 0.7 + spot.x * 3, i * 1.3 + spot.y * 2, i * 0.4);
      this.scene.add(mesh);
      return { spot, mesh, spin: new THREE.Vector3(0.05 + (i % 3) * 0.03, 0.09 + (i % 2) * 0.05, 0.02), phase: i * 1.7 + spot.x * 5 };
    });
    if (this.items.length && !this.renderer) this.start();
    this.layout();
  }

  start() {
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return; // no WebGL: the section reads the same without its objects
    }
    // painted in the page's own black: the glass needs a ground to refract, or it reads as grey plastic
    const ground = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--p-bg').trim() || '#0a0a0a');
    this.renderer.setClearColor(ground, 1);
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.scene.background = ground;
    this.scene.environment = studio(this.renderer);
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(4, 6, 6);
    this.scene.add(key);
    this.canvas.classList.add('is-live');
  }

  layout() {
    if (!this.renderer) return;
    this.w = this.canvas.clientWidth;
    this.h = this.canvas.clientHeight;
    if (!this.w || !this.h) return;
    // a canvas taller than the screen draws at 1x, the rest at up to 1.5x
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.h > window.innerHeight * 1.2 ? 1 : 1.5));
    this.renderer.setSize(this.w, this.h, false);
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
  }

  onScreen() {
    const r = this.canvas.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }

  draw(t: number, dt: number, lean: THREE.Vector2, still: boolean) {
    if (!this.renderer || !this.w || !this.items.length) return;
    const unit = VIEW_H / this.h;
    const size = Math.min(this.w * 0.13, window.innerHeight * 0.2) * unit;
    for (const it of this.items) {
      const float = still ? 0 : Math.sin(t * 0.6 + it.phase) * 0.12;
      it.mesh.position.set(it.spot.x * this.w * unit, -(it.spot.y - 0.5) * this.h * unit + float, it.spot.z ?? 0);
      it.mesh.scale.setScalar(size * it.spot.s);
      if (!still) {
        it.mesh.rotation.x += it.spin.x * dt;
        it.mesh.rotation.y += it.spin.y * dt;
        it.mesh.rotation.z += it.spin.z * dt;
      }
    }
    this.scene.rotation.y = still ? 0 : lean.x * 0.12;
    this.scene.rotation.x = still ? 0 : -lean.y * 0.08;
    this.renderer.render(this.scene, this.camera);
  }
}

export function mountGlassScenes(canvases: HTMLCanvasElement[]) {
  const stages = canvases
    .filter((c) => SPOTS[c.dataset.scene || ''])
    .map((c) => new Stage(c, SPOTS[c.dataset.scene!]));
  if (!stages.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(max-width: 639px)');
  const pointer = new THREE.Vector2();
  const lean = new THREE.Vector2();
  const clock = new THREE.Clock();
  let t = 0;
  let loop = 0;

  const drawAll = (dt: number) => {
    const still = reduced.matches;
    lean.lerp(pointer, still ? 1 : 0.04);
    for (const s of stages) if (still || s.onScreen()) s.draw(t, dt, lean, still);
  };
  const frame = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;
    drawAll(dt);
    loop = requestAnimationFrame(frame);
  };
  // moving: one loop for every canvas; reduced motion: each canvas drawn once, again only on a resize
  const run = () => {
    cancelAnimationFrame(loop);
    if (reduced.matches) drawAll(0);
    else {
      clock.getDelta();
      loop = requestAnimationFrame(frame);
    }
  };

  addEventListener('pointermove', (e) => pointer.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1), { passive: true });
  const ro = new ResizeObserver(() => {
    stages.forEach((s) => s.layout());
    if (reduced.matches) drawAll(0);
  });
  stages.forEach((s) => ro.observe(s.canvas));
  phone.addEventListener('change', () => {
    stages.forEach((s) => s.build(phone.matches));
    run();
  });
  reduced.addEventListener('change', run);

  stages.forEach((s) => s.build(phone.matches));
  run();
}
