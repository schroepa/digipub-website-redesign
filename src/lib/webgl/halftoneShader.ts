/**
 * Prozeduraler Halbton-Dot-Shader (Domain-Warping, kein Perlin/Simplex).
 * Rendert ein Raster aus Kreisen, deren Radius von einem überlagerten,
 * phasenverschobenen Sinuswellen-Feld gesteuert wird.
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
  uniform float uAmplitude;
  uniform float uPixelSize;
  uniform float uGooeyness;
  uniform float uContrast;
  uniform float uBias;
  uniform int uInvert;
  uniform vec3 uFg;
  uniform float uWaveTime;
  uniform float uWaveFrequency;
  uniform float uWaveAmplitude;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  uniform float uRippleTime;
  uniform float uRippleSpread;
  uniform float uRippleSpeed;

  float fieldLuma(vec2 uv, float time) {
    vec2 c = 2.0 * uv - 1.0;
    float ds = uAmplitude;
    c += ds * 0.4 * sin(c.yx + vec2(1.2, 3.4) + time);
    c += ds * 0.2 * sin(5.2 * c.yx + vec2(3.5, 0.4) + time);
    c += ds * 0.3 * sin(3.5 * c.yx + vec2(1.2, 3.1) + time);
    c += ds * 1.6 * sin(0.4 * c.yx + vec2(0.8, 2.4) + time);

    // Wasser-Ripple: konzentrische Wellen, die vom Mauszeiger ausgehen
    // und mit der Distanz abklingen (uMouseActive steuert das Ein-/Ausklingen).
    vec2 toMouse = uv - uMouse;
    float distToMouse = length(toMouse);
    float ripple = uMouseActive * exp(-distToMouse * uRippleSpread)
      * sin(distToMouse * 32.0 - uRippleTime * uRippleSpeed);
    c += ripple * 1.6;

    float L = length(c);
    float v = 0.0;
    for (int i = 0; i < 4; i++) {
      v = mix(v, float(i) / 3.0, cos(float(i) * L));
    }
    return clamp(v, 0.0, 1.0);
  }

  float lumaToRadius(float luma, float pixelSize, float biasOffset) {
    float v = clamp((luma - 0.5 + uBias + biasOffset) * uContrast + 0.5, 0.0, 1.0);
    if (uInvert == 1) v = 1.0 - v;
    return v * pixelSize * 0.6 + pixelSize * 0.05;
  }

  float smin(float a, float b, float k) {
    if (k <= 0.001) return min(a, b);
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
  }

  void main() {
    vec2 pixelCoord = gl_FragCoord.xy;
    vec2 baseCellIndex = floor(pixelCoord / uPixelSize);
    float minDist = 1.0e5;
    float smoothK = uGooeyness * 1.5;

    const int R = 1;
    for (int dx = -R; dx <= R; dx++) {
      for (int dy = -R; dy <= R; dy++) {
        vec2 cellIndex = baseCellIndex + vec2(float(dx), float(dy));
        if (mod(cellIndex.x + cellIndex.y, 2.0) > 0.5) continue;

        vec2 cellCenter = (cellIndex + 0.5) * uPixelSize;
        vec2 fieldUv = cellCenter / uResolution;
        float luma = fieldLuma(fieldUv, uTime);

        float cellY = cellCenter.y / uResolution.y;
        float wavePhase = cellY * uWaveFrequency * 6.2831853 - uWaveTime;
        float waveBias = sin(wavePhase) * uWaveAmplitude;

        float dist = length(pixelCoord - cellCenter);
        float radius = lumaToRadius(luma, uPixelSize, waveBias);
        minDist = smin(minDist, dist - radius, smoothK * uPixelSize);
      }
    }

    float aa = max(fwidth(minDist), 0.0001);
    float shape = 1.0 - smoothstep(-aa, aa, minDist);

    gl_FragColor = vec4(uFg, shape);
  }
`;

export interface HalftoneShaderOptions {
  amplitude: number;
  timeSpeed: number;
  pixelSize: number;
  gooeyness: number;
  contrast: number;
  bias: number;
  invert: boolean;
  waveAmplitude: number;
  waveFrequency: number;
  waveTimeSpeed: number;
  maxDpr: number;
  rippleSpread: number;
  rippleSpeed: number;
  /** Normalisierte RGB-Farbe (0–1) für die Punkte. */
  color: [number, number, number];
}

/**
 * Initialisiert die Three.js-Szene auf `canvas` und startet den Render-Loop.
 * Pausiert automatisch außerhalb des Viewports oder im Hintergrund-Tab.
 * Gibt eine Cleanup-Funktion zurück (Renderer dispose, Listener entfernen).
 */
export async function initHalftoneShader(
  canvas: HTMLCanvasElement,
  opts: HalftoneShaderOptions,
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
    uAmplitude: { value: opts.amplitude },
    uPixelSize: { value: opts.pixelSize * dpr },
    uGooeyness: { value: opts.gooeyness },
    uContrast: { value: opts.contrast },
    uBias: { value: opts.bias },
    uInvert: { value: opts.invert ? 1 : 0 },
    uFg: { value: new THREE.Vector3(...opts.color) },
    uWaveTime: { value: 0 },
    uWaveFrequency: { value: opts.waveFrequency },
    uWaveAmplitude: { value: opts.waveAmplitude },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uMouseActive: { value: 0 },
    uRippleTime: { value: 0 },
    uRippleSpread: { value: opts.rippleSpread },
    uRippleSpeed: { value: opts.rippleSpeed },
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
    uniforms.uPixelSize.value = opts.pixelSize * dpr;
  }
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  let time = 0;
  let waveTime = 0;
  let rippleTime = 0;
  let rafId: number | null = null;
  let inView = false;
  let tabHidden = document.hidden;

  // Maus-Reaktivität: Zielwerte werden bei pointermove gesetzt, im Render-Loop
  // sanft eingelerpt (statt hart zu springen) und beim Verlassen wieder zu 0.
  const targetMouse = new THREE.Vector2(0.5, 0.5);
  let targetActive = 0;

  function onPointerMove(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    targetMouse.set(
      (e.clientX - rect.left) / rect.width,
      1 - (e.clientY - rect.top) / rect.height,
    );
    targetActive = 1;
  }
  function onPointerLeave() {
    targetActive = 0;
  }

  if (!reduceMotion) {
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
  }

  function renderFrame() {
    rafId = null;
    if (!reduceMotion) {
      time += opts.timeSpeed;
      waveTime += opts.waveTimeSpeed;
      uniforms.uTime.value = time;
      uniforms.uWaveTime.value = waveTime;

      uniforms.uMouse.value.lerp(targetMouse, 0.08);
      uniforms.uMouseActive.value +=
        (targetActive - uniforms.uMouseActive.value) * 0.06;
      if (uniforms.uMouseActive.value > 0.002) {
        rippleTime += 1;
        uniforms.uRippleTime.value = rippleTime * 0.05;
      }
    }
    renderer.render(scene, camera);
    if (!reduceMotion) scheduleFrame();
  }

  function scheduleFrame() {
    if (rafId === null && inView && !tabHidden) {
      rafId = requestAnimationFrame(renderFrame);
    }
  }

  // Statisches Bild reicht bei reduzierter Bewegung – ein Frame, kein Loop.
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
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
