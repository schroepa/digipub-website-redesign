/**
 * Topografisches Konturlinien-Feld: konzentrische, sich nach außen
 * verjüngende Linien, die von einem Zentrum nahe der Unterkante ausgehen
 * (Anmutung wie Höhenlinien / Radar). Sanft animiert und scroll-reaktiv –
 * als atmosphärischer Hintergrund hinter der End-Sektion.
 */

export const vertexShader = /* glsl */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform float uScroll;
  uniform float uOpacity;
  uniform float uFreq;
  uniform float uChirp;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;          // 0..1
    float aspect = uResolution.x / uResolution.y;

    // Zentrum knapp unterhalb der Unterkante → Linien laufen nach oben aus.
    vec2 d = uv - vec2(0.5, 1.18);
    d.x *= aspect;
    float dist = length(d);

    // Verjüngung: Frequenz steigt mit der Distanz (Chirp) → Linien bündeln
    // sich nach außen/unten. Zeit + Scroll verschieben das Feld nach innen.
    float phase = dist * uFreq + dist * dist * uChirp;
    phase -= uTime * 0.5 + uScroll * 7.0;

    float rings = sin(phase);
    float grad = fwidth(phase) + 1e-4;
    // Dünne, knackige Linien (1.0 auf der Linie, 0.0 dazwischen).
    float line = 1.0 - smoothstep(0.0, grad * 2.2, abs(rings));

    // Überdichte Regionen ausblenden (Anti-Moiré).
    line *= smoothstep(3.2, 1.0, grad);
    // Nach oben ausblenden, Zentrum nicht zukleistern.
    line *= smoothstep(0.0, 0.6, uv.y);
    line *= smoothstep(0.015, 0.16, dist);

    gl_FragColor = vec4(uColor, line * uOpacity);
  }
`;

export interface ContourFieldOptions {
  color: [number, number, number];
  opacity: number;
  freq: number;
  chirp: number;
  timeSpeed: number;
  maxDpr: number;
}

/**
 * Initialisiert die Three.js-Szene auf `canvas` und startet den Render-Loop.
 * Pausiert außerhalb des Viewports / im Hintergrund-Tab. Liest die
 * Scroll-Position aus der Canvas-Lage im Viewport. Gibt eine Cleanup-Funktion
 * zurück. Bei `prefers-reduced-motion` ein statischer Frame ohne Animation.
 */
export async function initContourField(
  canvas: HTMLCanvasElement,
  opts: ContourFieldOptions,
): Promise<() => void> {
  const THREE = await import("three");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let renderer: InstanceType<typeof THREE.WebGLRenderer>;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
  } catch {
    canvas.style.display = "none";
    return () => {};
  }

  const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uColor: { value: new THREE.Vector3(...opts.color) },
    uScroll: { value: 0 },
    uOpacity: { value: opts.opacity },
    uFreq: { value: opts.freq },
    uChirp: { value: opts.chirp },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  function resize() {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    uniforms.uResolution.value.set(width * dpr, height * dpr);
  }
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  // Scroll-Fortschritt der Sektion (0 = gerade von unten hereinkommend,
  // 1 = nach oben hinausgescrollt) – sanft eingelerpt.
  let targetScroll = 0;
  function readScroll() {
    const rect = canvas.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    targetScroll = Math.max(
      0,
      Math.min(1, (vh - rect.top) / (vh + rect.height)),
    );
  }
  readScroll();
  uniforms.uScroll.value = targetScroll;
  window.addEventListener("scroll", readScroll, { passive: true });

  let time = 0;
  let rafId: number | null = null;
  let inView = false;
  let tabHidden = document.hidden;

  function renderFrame() {
    rafId = null;
    if (!reduceMotion) {
      time += opts.timeSpeed;
      uniforms.uTime.value = time;
      uniforms.uScroll.value += (targetScroll - uniforms.uScroll.value) * 0.08;
    }
    renderer.render(scene, camera);
    if (!reduceMotion) scheduleFrame();
  }

  function scheduleFrame() {
    if (rafId === null && inView && !tabHidden) {
      rafId = requestAnimationFrame(renderFrame);
    }
  }

  renderFrame();

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      inView = entries[0]?.isIntersecting ?? false;
      if (inView) scheduleFrame();
    },
    { threshold: 0 },
  );
  intersectionObserver.observe(canvas);

  function onVisibilityChange() {
    tabHidden = document.hidden;
    if (!tabHidden) scheduleFrame();
  }
  document.addEventListener("visibilitychange", onVisibilityChange);

  return function cleanup() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("scroll", readScroll);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
