/**
 * Aktiviert das Scroll-Reveal-Pattern für alle `[data-animate]`-Elemente
 * innerhalb von `root`. Elemente starten mit `opacity: 0; transform: translateY(30px)`
 * (siehe Markup) und animieren beim ersten Eintritt in den Viewport gestaffelt
 * zu `opacity: 1; transform: translateY(0)`.
 *
 * Respektiert `prefers-reduced-motion: reduce` (Elemente sind dann sofort sichtbar,
 * kein Observer, keine Transition).
 */
export function initScrollAnimate(
  root: HTMLElement,
  selector = "[data-animate]",
  staggerMs = 100,
): void {
  const elements = Array.from(root.querySelectorAll<HTMLElement>(selector));
  if (elements.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    elements.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        elements.forEach((el, i) => {
          const delay = i * staggerMs;
          el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            });
          });
        });

        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(root);
}

/**
 * Aktiviert das Zeichen-Reveal für ein `ConnectionDiagram`-SVG: Linien
 * (`[data-line]`) zeichnen sich per `stroke-dashoffset` nach, Knoten
 * (`[data-node]`) faden gestaffelt ein – jeweils beim ersten Eintritt
 * des SVGs in den Viewport.
 *
 * Respektiert `prefers-reduced-motion: reduce` (sofort vollständig sichtbar).
 */
export function initConnectionDiagram(svg: SVGSVGElement, staggerMs = 100): void {
  const lines = Array.from(svg.querySelectorAll<SVGLineElement>("[data-line]"));
  const nodes = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-node]"));

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    lines.forEach((line) => {
      line.style.strokeDasharray = "none";
      line.style.strokeDashoffset = "0";
    });
    nodes.forEach((node) => {
      node.style.opacity = "1";
    });
    return;
  }

  lines.forEach((line) => {
    const length = line.getTotalLength();
    line.style.strokeDasharray = `${length}`;
    line.style.strokeDashoffset = `${length}`;
  });
  nodes.forEach((node) => {
    node.style.opacity = "0";
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        lines.forEach((line, i) => {
          const delay = i * staggerMs;
          line.style.transition = `stroke-dashoffset 0.6s ease ${delay}ms`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              line.style.strokeDashoffset = "0";
            });
          });
        });

        nodes.forEach((node, i) => {
          const delay = i * staggerMs;
          node.style.transition = `opacity 0.6s ease ${delay}ms`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              node.style.opacity = "1";
            });
          });
        });

        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(svg);
}
