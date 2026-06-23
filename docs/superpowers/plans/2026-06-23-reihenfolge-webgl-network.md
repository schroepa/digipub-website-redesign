# "Die Reihenfolge" – WebGL-Partikelnetzwerk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Neue Startseiten-Section "Die Reihenfolge" mit einem scroll- und maus-reaktiven Three.js-Partikelnetzwerk, das sich über 4 Stufen von chaotisch zu vollständig vernetzt aufbaut.

**Architecture:** Ein reines Three.js-Modul (`particleNetwork.ts`, CPU-seitige Partikel-Animation über `BufferGeometry`/`Points`/`LineSegments`, kein Custom-Shader nötig) wird von einer schlanken Astro-Wrapper-Komponente (`ReihenfolgeNetworkBackground.astro`) lazy gemountet – exakt das Pattern aus `HeroShaderBackground.astro`/`halftoneShader.ts`. Eine neue Section-Komponente (`Reihenfolge.astro`) bindet Headline, die 4 Stufen-Labels (Trigger für den Netzwerk-Fortschritt via `IntersectionObserver`, gleiches Pattern wie `scrollAnimate.ts`) und das Closing-Statement (`initWordReveal`) zusammen.

**Tech Stack:** Astro, TypeScript, Three.js (bereits Dependency), Tailwind CSS. Kein Test-Framework im Projekt vorhanden – Verifikation erfolgt manuell über den Dev-Server im Browser (Konsole, Viewport-Resize, `prefers-reduced-motion`-Emulation), analog zur bisherigen Hero-Shader-Arbeit in diesem Projekt.

**Referenz-Spec:** `docs/superpowers/specs/2026-06-23-reihenfolge-webgl-design.md`

---

## Vorbereitung

Dev-Server für die manuellen Verifikationsschritte starten (einmal, bleibt während der ganzen Umsetzung offen):

```bash
npm run dev
```

Erwartete Ausgabe: `astro v5.18.2 ready in ... ms` mit einer `Local: http://localhost:XXXX/`-URL. Diese URL für alle folgenden manuellen Checks im Browser öffnen.

---

### Task 1: `particleNetwork.ts` – Datenmodell & statische Geometrie (ohne Animation)

**Files:**
- Create: `src/lib/webgl/particleNetwork.ts`

Lege zunächst nur das Grundgerüst an: Typen, Optionen, Three.js-Setup (Renderer/Scene/Camera), 4 Knoten-Positionen, Partikel-Zuordnung zu Segmenten – noch **ohne** Stage-Logik, Mausreaktion oder Render-Loop. Das hält den ersten Schritt überschaubar und manuell verifizierbar.

- [ ] **Step 1: Modul mit Typen, Optionen und Knoten-/Partikel-Setup anlegen**

```ts
// src/lib/webgl/particleNetwork.ts

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
```

- [ ] **Step 2: Manuell verifizieren, dass das Modul fehlerfrei lädt**

In einer beliebigen `.astro`-Datei testweise importieren ist hier noch nicht nötig – stattdessen reicht ein TypeScript-Check, da das Modul noch nirgends eingebunden ist:

Run: `npx astro check`
Expected: keine neuen Fehler in `src/lib/webgl/particleNetwork.ts` (bestehende, unveränderte Fehler im Rest des Projekts ignorieren, falls vorhanden).

- [ ] **Step 3: Commit**

```bash
git add src/lib/webgl/particleNetwork.ts
git commit -m "feat: Grundgerüst für particleNetwork-Modul (Knoten, Partikel-Setup)"
```

---

### Task 2: Render-Loop, Stage-Übergang & Mausreaktion

**Files:**
- Modify: `src/lib/webgl/particleNetwork.ts`

Jetzt die eigentliche Animation: Partikel als `THREE.Points`, Knoten als zweites `THREE.Points`, Linien als `THREE.LineSegments`, ein `requestAnimationFrame`-Loop, der den Fortschritt sanft eilerpt und die Positionen/Opacities jeden Frame aktualisiert.

- [ ] **Step 1: Buffer-Geometrien für Partikel, Knoten und Linien anlegen**

Ersetze den Rückgabeblock und füge vor `resize()` Folgendes ein (zwischen `nodePositions`-Deklaration und `function resize()`):

```ts
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
```

- [ ] **Step 2: `resize()` um Knoten-/Linien-Positionierung erweitern**

```ts
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
```

- [ ] **Step 3: Stage-/Maus-State, Render-Loop und Handle implementieren**

Ersetze den bisherigen `renderer.render(scene, camera); return { ... }`-Schlussblock komplett durch:

```ts
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

  function renderFrame() {
    rafId = null;

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
```

- [ ] **Step 4: TypeScript-Check**

Run: `npx astro check`
Expected: keine neuen Fehler in `particleNetwork.ts`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/webgl/particleNetwork.ts
git commit -m "feat: Render-Loop, Stage-Übergang und Mausreaktion für particleNetwork"
```

---

### Task 3: `ReihenfolgeNetworkBackground.astro` – Lazy-Mount-Wrapper

**Files:**
- Create: `src/components/ReihenfolgeNetworkBackground.astro`

Exakt das Pattern aus `HeroShaderBackground.astro`: Color-Probe, lazy IntersectionObserver-Mount, Save-Data-Check, Pointer-Tracking. Zusätzlich: Stage-Observer auf `[data-stage]`-Elemente in der umgebenden Section.

- [ ] **Step 1: Komponente anlegen**

```astro
---
interface Props {
  /** Tailwind-/Design-Token für die Punkte, Knoten und Linien, z. B. "primary". */
  color?: string;
  particleCount?: number;
  maxDpr?: number;
  class?: string;
}

const {
  color = "primary",
  particleCount = 120,
  maxDpr = 1.5,
  class: className,
} = Astro.props;
---

<div
  class:list={["absolute inset-0 -z-10 overflow-hidden pointer-events-none", className]}
  aria-hidden="true"
  aria-label="Animiertes Netzwerk-Diagramm, das sich beim Scrollen zu einer vier-stufigen Kette verbindet"
>
  <div
    class="particle-network-color-probe"
    style={`display: none; background-color: var(--color-${color}, #78716c);`}
  ></div>
  <canvas
    class="particle-network-canvas block h-full w-full pointer-events-auto"
    data-particle-count={particleCount}
    data-max-dpr={maxDpr}
  ></canvas>
</div>

<script>
  import { initParticleNetwork } from "../lib/webgl/particleNetwork";
  import type { ParticleNetworkHandle } from "../lib/webgl/particleNetwork";

  const FALLBACK_COLOR: [number, number, number] = [0.42, 0.4, 0.37];

  function parseColor(probe: HTMLElement): [number, number, number] {
    const computed = getComputedStyle(probe).backgroundColor;
    try {
      const c = document.createElement("canvas");
      c.width = 1;
      c.height = 1;
      const ctx = c.getContext("2d");
      if (!ctx) return FALLBACK_COLOR;
      ctx.fillStyle = computed;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r / 255, g / 255, b / 255];
    } catch {
      return FALLBACK_COLOR;
    }
  }

  function wireStageObserver(canvas: HTMLCanvasElement, handle: ParticleNetworkHandle) {
    const section = canvas.closest("section");
    const labels = section
      ? Array.from(section.querySelectorAll<HTMLElement>("[data-stage]"))
      : [];
    if (labels.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      handle.setStage(labels.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const stage = Number((entry.target as HTMLElement).dataset.stage);
          handle.setStage(stage);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );
    labels.forEach((label) => observer.observe(label));
  }

  function wireMouse(canvas: HTMLCanvasElement, handle: ParticleNetworkHandle) {
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      handle.setMouse({
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      });
    };
    const onLeave = () => handle.setMouse(null);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
  }

  function mount(canvas: HTMLCanvasElement) {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (connection?.saveData) {
      canvas.style.display = "none";
      return;
    }

    let started = false;
    const start = () => {
      if (started) return;
      started = true;

      const probe = canvas.previousElementSibling as HTMLElement | null;
      const color = probe ? parseColor(probe) : FALLBACK_COLOR;
      const data = canvas.dataset;

      void initParticleNetwork(canvas, {
        particleCount: Number(data.particleCount),
        maxDpr: Number(data.maxDpr),
        color,
      }).then((handle) => {
        wireStageObserver(canvas, handle);
        wireMouse(canvas, handle);
      });
    };

    const lazyObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        lazyObserver.disconnect();
        if ("requestIdleCallback" in window) {
          requestIdleCallback(start);
        } else {
          setTimeout(start, 1);
        }
      },
      { threshold: 0, rootMargin: "200px" },
    );
    lazyObserver.observe(canvas);
  }

  document
    .querySelectorAll<HTMLCanvasElement>(".particle-network-canvas")
    .forEach(mount);
</script>
```

- [ ] **Step 2: TypeScript-Check**

Run: `npx astro check`
Expected: keine neuen Fehler.

- [ ] **Step 3: Commit**

```bash
git add src/components/ReihenfolgeNetworkBackground.astro
git commit -m "feat: Lazy-Mount-Wrapper für das Partikelnetzwerk (ReihenfolgeNetworkBackground)"
```

---

### Task 4: `Reihenfolge.astro` – Section-Komponente

**Files:**
- Create: `src/components/sections/Reihenfolge.astro`

Headline, 4 Stufen-Labels (horizontal Desktop / vertikal Mobile via Tailwind), Closing-Statement. Folgt dem Muster von `Denkweise.astro`/`Strukturproblem.astro`.

- [ ] **Step 1: Komponente anlegen**

```astro
---
import Section from "../ui/Section.astro";
import ReihenfolgeNetworkBackground from "../ReihenfolgeNetworkBackground.astro";

const STAGES = [
  { title: "Mehrwert erkennen", sub: "Was steckt wirklich dahinter?" },
  { title: "Mehrwert ordnen", sub: "Wie wird es kommunizierbar?" },
  { title: "Mehrwert sichtbar machen", sub: "Über welche Kanäle und Systeme?" },
  { title: "Mehrwert automatisieren", sub: "Was soll dauerhaft und skalierbar laufen?" },
];
---

<Section id="reihenfolge" class="relative isolate overflow-hidden">
  <ReihenfolgeNetworkBackground color="primary" class="opacity-50 dark:opacity-30" />

  <h2
    style="font-size: var(--text-section);"
    class="font-bold text-foreground mb-16 max-w-2xl"
  >
    Die Reihenfolge entscheidet.
  </h2>

  <div class="flex flex-col gap-10 lg:flex-row lg:gap-6 lg:justify-between">
    {STAGES.map((stage, i) => (
      <div data-stage={i + 1} data-animate class="lg:max-w-56" style="opacity: 0; transform: translateY(30px);">
        <span class="block text-xs font-mono text-muted-foreground mb-2">
          {String(i + 1).padStart(2, "0")}
        </span>
        <h3 class="font-bold text-foreground mb-1" style="font-size: var(--text-body);">
          {stage.title}
        </h3>
        <p class="text-muted-foreground" style="font-size: var(--text-body);">
          {stage.sub}
        </p>
      </div>
    ))}
  </div>

  <div style="margin-top: var(--peak-space);">
    <p
      data-statement
      class="font-bold text-foreground"
      style="font-size: var(--text-statement); line-height: 1.3;"
    >
      Andere beginnen bei Schritt drei.<br />
      Wir beginnen bei Schritt eins.
    </p>
  </div>
</Section>

<script>
  import { initScrollAnimate } from "../../lib/scrollAnimate";
  import { initWordReveal } from "../../lib/wordReveal";

  const section = document.getElementById("reihenfolge");
  if (section) initScrollAnimate(section);

  const statement = document.querySelector<HTMLElement>("#reihenfolge [data-statement]");
  if (statement) initWordReveal(statement);
</script>
```

**Hinweis zur Stage-Reihenfolge:** `data-stage` zählt 1–4 von oben/links nach unten/rechts — identisch zur Lese- und Scroll-Reihenfolge auf Mobile (vertikal gestapelt: Stage 1 oben) wie auf Desktop (horizontal: Stage 1 links). Damit triggert der `IntersectionObserver` in `ReihenfolgeNetworkBackground.astro` die Stufen unabhängig vom Breakpoint in der korrekten Reihenfolge.

- [ ] **Step 2: TypeScript-Check**

Run: `npx astro check`
Expected: keine neuen Fehler.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Reihenfolge.astro
git commit -m "feat: Section-Komponente 'Die Reihenfolge' mit Stufen-Labels und Closing-Statement"
```

---

### Task 5: Einbinden in die Startseite & manuelle Verifikation

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Import und Einbindung zwischen Denkweise und LogosBar**

In `src/pages/index.astro`, Import-Block ergänzen:

```astro
import Reihenfolge from "../components/sections/Reihenfolge.astro";
```

direkt unter der `Denkweise`-Import-Zeile. Und im Markup, zwischen Denkweise- und LogosBar-Block:

```astro
  <!-- 4. DIE REIHENFOLGE -->
  <Reihenfolge />

```

direkt vor dem `<!-- 4. LOGOS BAR -->`-Kommentar (der wird zu `<!-- 5. LOGOS BAR -->`, die nachfolgenden Kommentar-Nummern entsprechend um 1 erhöhen, damit sie weiter mit `CLAUDE.md`s Seitenstruktur übereinstimmen).

- [ ] **Step 2: Dev-Server-Check – Section erscheint, keine Konsolen-Fehler**

Im Browser die Dev-Server-URL öffnen, zur neuen Section scrollen.

Erwartet:
- Section ist sichtbar zwischen "Denkweise" und der Logo-Bar
- Browser-Konsole zeigt keine Fehler
- Beim Scrollen in die Section bauen sich Knoten und Linien nacheinander auf (Stufe 1 → 4), nicht alle gleichzeitig

- [ ] **Step 3: Viewport-Check – horizontal/vertikal-Umschaltung**

Browser-Fenster auf eine schmale Breite (< 1024px, z. B. via DevTools-Mobile-Emulation) verkleinern, Seite neu laden, erneut zur Section scrollen.

Erwartet: Die 4 Stufen-Labels stehen untereinander (vertikal), das Netzwerk verbindet die Knoten vertikal statt horizontal.

- [ ] **Step 4: Maus-Reaktivität prüfen**

Auf Desktop-Breite mit der Maus über den Netzwerk-Bereich fahren, nachdem alle 4 Stufen sichtbar sind.

Erwartet: Partikel in der Nähe des Cursors rücken sichtbar näher an die Verbindungslinien heran; beim Verlassen des Bereichs entspannt sich der Effekt wieder.

- [ ] **Step 5: Puls bei Stufe 4 prüfen**

Weiter scrollen, bis alle 4 Stufen-Labels durchlaufen sind (Kette vollständig verbunden).

Erwartet: Ein kleiner, heller Punkt läuft kontinuierlich und in einer Endlosschleife die Kette von Knoten 1 zu Knoten 4 entlang (keine einmalige Animation, kein Stillstand).

- [ ] **Step 6: `prefers-reduced-motion` prüfen**

In den Browser-DevTools "Emulate CSS prefers-reduced-motion: reduce" aktivieren (Chrome: Rendering-Tab), Seite neu laden, zur Section scrollen.

Erwartet: Netzwerk ist sofort vollständig verbunden (alle 4 Knoten, alle 3 Linien sichtbar), keine Bewegung, **kein laufender Puls**, keine Reaktion auf Mausbewegung.

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: Section 'Die Reihenfolge' in Startseite einbinden"
```

---

## Self-Review-Notizen (bereits eingearbeitet)

- **Spec-Abdeckung:** Struktur (Task 4/5), chaotisch→vernetzt-Übergang inkl. kontinuierlichem Puls bei Stufe 4 (Task 2, `updatePulse()`), Maus-Reaktivität (Task 2/3), Lazy-Mount/`prefers-reduced-motion`/Save-Data-Fallbacks (Task 1–3) sowie horizontale/vertikale Ausrichtung je Breakpoint (Task 1 `computeNodePositions`, verifiziert in Task 5 Step 3) sind jeweils durch einen Task und einen manuellen Verifikationsschritt abgedeckt.
- **Type-Konsistenz geprüft:** `ParticleNetworkHandle`/`ParticleNetworkOptions` aus Task 1 werden in Task 3 unverändert importiert und verwendet (`setStage`, `setMouse`, `destroy`, `particleCount`, `maxDpr`, `color`) – keine abweichenden Namen zwischen den Tasks.
- **Erste Korrekturrunde:** Ursprünglich war der Stufe-4-Puls als "spätere Ergänzung" ausgeklammert, obwohl die Spec ihn explizit fordert ("ein sanfter Puls läuft kontinuierlich entlang aller Linien"). Korrigiert: `updatePulse()` plus zugehöriges `THREE.Points`-Objekt sind jetzt Teil von Task 2, inklusive Verifikationsschritt in Task 5 und Stillstand-Check unter `prefers-reduced-motion`.
