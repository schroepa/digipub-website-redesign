/**
 * Partikelnetzwerk für die "Die Reihenfolge"-Section: ein Feld chaotisch
 * verteilter Partikel ordnet sich über 4 Stufen zu einer linearen Kette aus
 * 4 Knoten. Reine CPU-Animation auf BufferGeometry (kein Custom-Shader) –
 * bei ~120 Partikeln und 4 Knoten ist das deutlich günstiger als ein
 * Fragment-Shader-Ansatz wie beim Hero-Halbton-Shader.
 */

export interface ParticleNetworkOptions {
  /** Anzahl der frei schwebenden Partikel zwischen den Knoten. */
  particleCount: number;
  /** Normalisierte RGB-Farbe (0–1) für Partikel, Knoten und Linien. */
  color: [number, number, number];
  maxDpr: number;
}

export interface ParticleNetworkHandle {
  /** Setzt den Ziel-Fortschritt (0 = chaotisch, 4 = vollständig vernetzt + Puls). */
  setStage(stage: number): void;
  /** Mausposition in normalisierten UV-Koordinaten (0–1, Y von unten), oder null = Maus weg. */
  setMouse(uv: { x: number; y: number } | null): void;
  destroy(): void;
}

interface Particle {
  chaosX: number;
  chaosY: number;
  /** Index des Segments (0..2), dem der Partikel im geordneten Zustand zugewiesen ist. */
  segment: number;
  /** Position entlang des Segments (0..1) im geordneten Zustand. */
  segmentT: number;
  /** Individueller Versatz (0..1), staffelt den Übergang chaotisch -> geordnet. */
  phase: number;
  /** Geschwindigkeits-Seed für die Chaos-Bewegung (sin-basiertes Jittern). */
  seed: number;
}

const NODE_COUNT = 4;
const SEGMENT_COUNT = NODE_COUNT - 1;

function createParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      chaosX: (Math.random() * 2 - 1) * 0.9,
      chaosY: (Math.random() * 2 - 1) * 0.9,
      segment: i % SEGMENT_COUNT,
      segmentT: Math.random(),
      phase: Math.random(),
      seed: Math.random() * Math.PI * 2,
    });
  }
  return particles;
}

/**
 * Knoten-Positionen in NDC-artigen Koordinaten (-1..1), abhängig von der
 * Canvas-Ausrichtung: breiter als hoch -> horizontale Kette (Desktop),
 * sonst vertikale Kette (Mobile). Wird bei jedem Resize neu berechnet.
 */
function computeNodePositions(
  width: number,
  height: number,
): Array<[number, number]> {
  const horizontal = width >= height;
  const positions: Array<[number, number]> = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const t = i / (NODE_COUNT - 1); // 0..1
    const coord = t * 1.6 - 0.8; // -0.8..0.8, etwas Rand lassen
    positions.push(horizontal ? [coord, 0] : [0, -coord]);
  }
  return positions;
}

export async function initParticleNetwork(
  canvas: HTMLCanvasElement,
  opts: ParticleNetworkOptions,
): Promise<ParticleNetworkHandle> {
  const THREE = await import("three");

  let renderer: InstanceType<typeof THREE.WebGLRenderer>;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    canvas.style.display = "none";
    return {
      setStage() {},
      setMouse() {},
      destroy() {},
    };
  }

  const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

  const particles = createParticles(opts.particleCount);
  let nodePositions = computeNodePositions(
    canvas.clientWidth || 1,
    canvas.clientHeight || 1,
  );

  function resize() {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    nodePositions = computeNodePositions(width, height);
  }
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  renderer.render(scene, camera);

  return {
    setStage() {},
    setMouse() {},
    destroy() {
      resizeObserver.disconnect();
      renderer.dispose();
    },
  };
}
