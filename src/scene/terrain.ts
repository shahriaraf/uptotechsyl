/**
 * The hero's 3D layer: Sylhet's tea hills drawn as terrace rows, one line across the hills per row. The
 * height comes from layered noise on the GPU, contour bands light up in tea green like terraced rows, the
 * hills roll slowly, and a soft swell follows the pointer. Plain WebGL, no library: one context, one
 * draw call. It pauses off screen and in a hidden tab, draws one still frame under reduced motion, and
 * removes itself (leaving the hero's CSS ground) if WebGL or the shaders are unavailable.
 */

const vertex = `
  precision highp float;
  attribute vec2 aPos;
  uniform mat4 uProj;
  uniform mat4 uView;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseOn;
  varying float vBand;
  varying float vFade;
  varying float vLift;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float hills(vec2 p) {
    float h = 0.0;
    float a = 1.0;
    for (int k = 0; k < 4; k++) { h += a * noise(p); p = p * 2.03 + 11.0; a *= 0.48; }
    return h;
  }

  void main() {
    vec2 q = aPos * 0.16 + vec2(uTime * 0.035, uTime * 0.02);
    float h = hills(q) * 3.4 - 1.6;
    float d = distance(aPos, uMouse);
    float swell = exp(-d * d * 0.09) * 0.9 * uMouseOn;
    h += swell;
    vLift = swell;
    float c = fract(h * 4.5);
    vBand = smoothstep(0.0, 0.08, c) * (1.0 - smoothstep(0.08, 0.18, c));
    vec4 mv = uView * vec4(aPos.x, h, aPos.y, 1.0);
    vFade = clamp(1.0 - (-mv.z - 6.0) / 26.0, 0.0, 1.0);
    gl_Position = uProj * mv;
  }
`;

const fragment = `
  precision mediump float;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying float vBand;
  varying float vFade;
  varying float vLift;
  void main() {
    vec3 col = mix(uInk * 0.8, uAccent, clamp(vBand + vLift * 0.9, 0.0, 1.0));
    float a = vFade * (0.42 + vBand * 0.58 + vLift * 0.5);
    gl_FragColor = vec4(col * a, a);
  }
`;

type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function perspective(fovDeg: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan((fovDeg * Math.PI) / 360);
  const nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}

/** the camera's basis and view matrix, looking from eye at target */
function lookAt(eye: V3, target: V3) {
  const z = norm(sub(eye, target)); // backward
  const x = norm(cross([0, 1, 0], z)); // right
  const y = cross(z, x); // up
  const view = new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1]);
  return { view, x, y, z };
}

function hex(css: string, fallback: string): V3 {
  const m = /^#?([0-9a-f]{6})$/i.exec(css.trim()) ? css.trim().replace('#', '') : fallback.replace('#', '');
  const n = parseInt(m, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

export function mountTerrain(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
  const vs = gl && compile(gl, gl.VERTEX_SHADER, vertex);
  const fs = gl && compile(gl, gl.FRAGMENT_SHADER, fragment);
  const prog = gl && vs && fs ? gl.createProgram() : null;
  if (gl && prog && vs && fs) {
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
  }
  if (!gl || !prog || !gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    canvas.remove(); // no WebGL or a rejected shader: the hero keeps its CSS ground
    return;
  }
  gl.useProgram(prog);

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 767px)').matches;
  const ratio = Math.min(window.devicePixelRatio, small ? 1 : 1.25);

  // the terrace rows: one line across the hills per row, as segment pairs; denser on a desktop
  const cols = small ? 110 : 200;
  const rows = small ? 40 : 64;
  const W = 46, D = 34;
  const pos = new Float32Array(rows * (cols - 1) * 4);
  let k = 0;
  for (let j = 0; j < rows; j++) {
    const z = (j / (rows - 1)) * -D + 8;
    for (let i = 0; i < cols - 1; i++) {
      pos[k++] = (i / (cols - 1) - 0.5) * W;
      pos[k++] = z;
      pos[k++] = ((i + 1) / (cols - 1) - 0.5) * W;
      pos[k++] = z;
    }
  }
  const count = pos.length / 2;
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const loc = (n: string) => gl.getUniformLocation(prog, n);
  const uProj = loc('uProj'), uView = loc('uView'), uTime = loc('uTime'), uMouse = loc('uMouse'), uMouseOn = loc('uMouseOn');
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.clearColor(0, 0, 0, 0);
  // the colours follow the page's theme: glowing lines on dark, inked lines on light
  const colours = () => {
    const css = getComputedStyle(document.documentElement);
    const light = document.documentElement.dataset.theme === 'light';
    gl.uniform3fv(loc('uInk'), hex(css.getPropertyValue('--ink'), light ? '#10120f' : '#edf0e8'));
    gl.uniform3fv(loc('uAccent'), hex(light ? css.getPropertyValue('--accent-text') : css.getPropertyValue('--accent'), light ? '#3f6a00' : '#c5f25a'));
    if (light) gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // ordinary ink: additive light vanishes on paper
    else gl.blendFunc(gl.ONE, gl.ONE); // additive: crossing lines glow
  };
  colours();

  const FOV = 42;
  const target: V3 = [0, -0.5, -4];
  const eye: V3 = [0, 6.5, 12.5];
  let aspect = 1;
  let cam = lookAt(eye, target);

  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * ratio));
    canvas.height = Math.max(1, Math.round(h * ratio));
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = w / Math.max(1, h);
    // narrow screens step back so the hills still fill the width
    eye[2] = w < h ? 16 : 12.5;
    gl.uniformMatrix4fv(uProj, false, perspective(FOV, aspect, 0.1, 80));
  };
  size();
  new ResizeObserver(() => {
    size();
    if (still) draw();
  }).observe(canvas);

  // the pointer, cast from the camera onto the ground plane (y = 0)
  const goal = [0, -2];
  const mouse = [0, -2];
  let mouseOn = 0;
  let mouseGoal = 0;
  const host = canvas.parentElement!;
  host.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = -((e.clientY - r.top) / r.height) * 2 + 1;
    const t = Math.tan((FOV * Math.PI) / 360);
    const dir: V3 = norm([
      cam.x[0] * nx * t * aspect + cam.y[0] * ny * t - cam.z[0],
      cam.x[1] * nx * t * aspect + cam.y[1] * ny * t - cam.z[1],
      cam.x[2] * nx * t * aspect + cam.y[2] * ny * t - cam.z[2],
    ]);
    if (dir[1] < -1e-4) {
      const s = -eye[1] / dir[1];
      goal[0] = eye[0] + dir[0] * s;
      goal[1] = eye[2] + dir[2] * s;
    }
    mouseGoal = 1;
  });
  host.addEventListener('pointerleave', () => (mouseGoal = 0));

  let time = 12;
  const draw = () => {
    cam = lookAt(eye, target);
    gl.uniformMatrix4fv(uView, false, cam.view);
    gl.uniform1f(uTime, time);
    gl.uniform2f(uMouse, mouse[0], mouse[1]);
    gl.uniform1f(uMouseOn, mouseOn);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, count);
  };

  let visible = true;
  let raf = 0;
  let last = performance.now();
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    mouseOn += (mouseGoal - mouseOn) * Math.min(1, dt * 3);
    const m = Math.min(1, dt * 4);
    mouse[0] += (goal[0] - mouse[0]) * m;
    mouse[1] += (goal[1] - mouse[1]) * m;
    // a slow drift of the camera with the pointer
    eye[0] += (goal[0] * 0.04 - eye[0]) * dt;
    draw();
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const play = () => {
    cancelAnimationFrame(raf);
    last = performance.now();
    if (still) return draw();
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  };

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    play();
  }).observe(canvas);
  document.addEventListener('visibilitychange', play);

  window.addEventListener('themechange', () => {
    colours();
    draw();
  });

  draw();
  canvas.classList.add('is-live');
  play();
}
