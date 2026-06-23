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

  // ── Partikel (Points) ──────────────────────────────────────────────────
  const particlePositions = new Float32Array(particles.length * 3);
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3),
  );
  const particleMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(...opts.color),
    size: 0.025,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
  });
  const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particlePoints);

  // ── Knoten (eigenes, größeres Points-Objekt je Knoten für individuelle Opacity) ──
  const nodeMeshes = nodePositions.map(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3),
    );
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(...opts.color),
      size: 0.09,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    return { points, material };
  });

  // ── Linien zwischen den Knoten (eine je Segment, einzeln steuerbar) ────
  const lineMeshes = Array.from({ length: SEGMENT_COUNT }, () => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(6), 3),
    );
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(...opts.color),
      transparent: true,
      opacity: 0,
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    return { line, material };
  });

  // ── Puls-Punkt: läuft bei Stufe 4 kontinuierlich die Kette entlang ─────
  const pulseGeometry = new THREE.BufferGeometry();
  pulseGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3),
  );
  const pulseMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(...opts.color),
    size: 0.14,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0,
  });
  const pulsePoint = new THREE.Points(pulseGeometry, pulseMaterial);
  scene.add(pulsePoint);

  function resize() {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    nodePositions = computeNodePositions(width, height);

    nodeMeshes.forEach(({ points }, i) => {
      const [x, y] = nodePositions[i];
      const pos = points.geometry.attributes.position as InstanceType<
        typeof THREE.BufferAttribute
      >;
      pos.setXYZ(0, x, y, 0);
      pos.needsUpdate = true;
    });

    lineMeshes.forEach(({ line }, i) => {
      const [ax, ay] = nodePositions[i];
      const [bx, by] = nodePositions[i + 1];
      const pos = line.geometry.attributes.position as InstanceType<
        typeof THREE.BufferAttribute
      >;
      pos.setXYZ(0, ax, ay, 0);
      pos.setXYZ(1, bx, by, 0);
      pos.needsUpdate = true;
    });
  }
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let targetStage = reduceMotion ? NODE_COUNT : 0;
  let displayStage = 0;
  let time = 0;
  let pulseTime = 0;

  const targetMouse = new THREE.Vector2(0.5, 0.5);
  let targetMouseActive = 0;
  let mouseActive = 0;

  function updateParticlePositions() {
    const pos = particleGeometry.attributes.position as InstanceType<
      typeof THREE.BufferAttribute
    >;
    const orderAmount = Math.min(displayStage / NODE_COUNT, 1);

    particles.forEach((p, i) => {
      const [ax, ay] = nodePositions[p.segment];
      const [bx, by] = nodePositions[p.segment + 1];
      const orderedX = ax + (bx - ax) * p.segmentT;
      const orderedY = ay + (by - ay) * p.segmentT;

      // Gestaffelter individueller Übergang chaotisch -> geordnet.
      const span = 1 - p.phase * 0.3;
      let localProgress = span <= 0 ? 1 : (orderAmount - p.phase * 0.3) / span;
      localProgress = Math.max(0, Math.min(1, localProgress));

      // Mausreaktion: Partikel in der Nähe rücken stärker zur Linie.
      if (mouseActive > 0.01) {
        const dx = orderedX - (targetMouse.x * 2 - 1);
        const dy = orderedY - (targetMouse.y * 2 - 1);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const boost = mouseActive * Math.exp(-dist * 3.5) * 0.6;
        localProgress = Math.min(1, localProgress + boost);
      }

      const jitterX = Math.sin(time * 0.6 + p.seed) * 0.04 * (1 - localProgress);
      const jitterY = Math.cos(time * 0.5 + p.seed * 1.3) * 0.04 * (1 - localProgress);

      const x = p.chaosX + jitterX + (orderedX - (p.chaosX + jitterX)) * localProgress;
      const y = p.chaosY + jitterY + (orderedY - (p.chaosY + jitterY)) * localProgress;

      pos.setXYZ(i, x, y, 0);
    });

    pos.needsUpdate = true;
  }

  function updateNodesAndLines() {
    nodeMeshes.forEach(({ material }, i) => {
      const target = displayStage >= i + 1 ? 1 : 0;
      material.opacity += (target - material.opacity) * 0.08;
    });

    lineMeshes.forEach(({ material }, i) => {
      const target = displayStage >= i + 2 ? 1 : 0;
      material.opacity += (target - material.opacity) * 0.08;
    });
  }

  /** Bewegt den Puls-Punkt entlang der vollständigen Kette (0..1 über alle Segmente). */
  function updatePulse() {
    const fullyConnected = displayStage >= NODE_COUNT - 0.02;
    const targetOpacity = fullyConnected ? 0.9 : 0;
    pulseMaterial.opacity += (targetOpacity - pulseMaterial.opacity) * 0.08;
    if (!fullyConnected) return;

    const loopT = (pulseTime % 1 + 1) % 1; // 0..1, läuft endlos
    const totalT = loopT * SEGMENT_COUNT;
    const segmentIndex = Math.min(Math.floor(totalT), SEGMENT_COUNT - 1);
    const segmentT = totalT - segmentIndex;
    const [ax, ay] = nodePositions[segmentIndex];
    const [bx, by] = nodePositions[segmentIndex + 1];

    const pos = pulseGeometry.attributes.position as InstanceType<
      typeof THREE.BufferAttribute
    >;
    pos.setXYZ(0, ax + (bx - ax) * segmentT, ay + (by - ay) * segmentT, 0);
    pos.needsUpdate = true;
  }

  let rafId: number | null = null;
  let inView = false;
  let tabHidden = document.hidden;
  let destroyed = false;

  function renderFrame() {
    rafId = null;
    if (destroyed) return;

    if (!reduceMotion) {
      time += 0.016;
      displayStage += (targetStage - displayStage) * 0.05;
      mouseActive += (targetMouseActive - mouseActive) * 0.08;
      if (displayStage >= NODE_COUNT - 0.02) pulseTime += 0.03;

      updateParticlePositions();
      updateNodesAndLines();
      updatePulse();
    }

    renderer.render(scene, camera);
    if (!reduceMotion) scheduleFrame();
  }

  function scheduleFrame() {
    if (rafId === null && inView && !tabHidden) {
      rafId = requestAnimationFrame(renderFrame);
    }
  }

  if (reduceMotion) {
    displayStage = NODE_COUNT;
    updateParticlePositions();
    updateNodesAndLines();
    pulseMaterial.opacity = 0; // Stilles Endbild – kein laufender Puls bei reduzierter Bewegung.
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

  return {
    setStage(stage: number) {
      targetStage = Math.max(0, Math.min(NODE_COUNT, stage));
      scheduleFrame();
    },
    setMouse(uv) {
      if (uv) {
        targetMouse.set(uv.x, uv.y);
        targetMouseActive = 1;
      } else {
        targetMouseActive = 0;
      }
    },
    destroy() {
      destroyed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      particleGeometry.dispose();
      particleMaterial.dispose();
      nodeMeshes.forEach(({ points, material }) => {
        points.geometry.dispose();
        material.dispose();
      });
      lineMeshes.forEach(({ line, material }) => {
        line.geometry.dispose();
        material.dispose();
      });
      pulseGeometry.dispose();
      pulseMaterial.dispose();
      renderer.dispose();
    },
  };
}
