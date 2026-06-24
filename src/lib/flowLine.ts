/**
 * Steuert eine "Flow-Line": eine gestrichelte, fließende Linie (CSS, siehe
 * global.css), die beim Eintritt in den Viewport von 0 → 1 wächst. Erreicht
 * die wachsende Front einen Knoten (`[data-flow-node]` mit `data-at` = Position
 * 0..1 entlang der Linie), wird er "eingeschaltet" und pulsiert einmalig.
 *
 * Respektiert `prefers-reduced-motion`: Endzustand sofort, kein Wachstum,
 * kein Marching-Ants-Flow (Letzteres via CSS-Media-Query deaktiviert).
 *
 * Erwartete Struktur:
 *   <div data-flow>
 *     <div data-flow-line data-dir="h|v"></div>
 *     <span data-flow-node data-at="0"></span> …
 *   </div>
 */
export function initFlowLine(
  root: HTMLElement,
  opts: { durationMs?: number; threshold?: number } = {},
): void {
  const line = root.querySelector<HTMLElement>("[data-flow-line]");
  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>("[data-flow-node]"),
  );
  if (!line) return;

  const durationMs = opts.durationMs ?? 1500;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function applyProgress(p: number) {
    root.style.setProperty("--flow-p", String(p));
    nodes.forEach((node) => {
      const at = Number(node.dataset.at ?? "0");
      if (p + 1e-4 >= at && !node.classList.contains("is-on")) {
        node.classList.add("is-on");
        // Einmaliger Puls – Animation per Reflow neu starten.
        node.classList.remove("pulse");
        void node.offsetWidth;
        node.classList.add("pulse");
      }
    });
  }

  if (prefersReduced) {
    applyProgress(1);
    return;
  }

  let started = false;
  function run() {
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / durationMs, 1);
      // easeInOutQuad
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      applyProgress(eased);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        run();
        obs.disconnect();
      });
    },
    { threshold: opts.threshold ?? 0.35 },
  );
  io.observe(root);
}

/** Initialisiert alle `[data-flow]`-Diagramme innerhalb von `root`. */
export function initFlowLines(
  root: ParentNode = document,
  opts?: { durationMs?: number; threshold?: number },
): void {
  root
    .querySelectorAll<HTMLElement>("[data-flow]")
    .forEach((el) => initFlowLine(el, opts));
}
