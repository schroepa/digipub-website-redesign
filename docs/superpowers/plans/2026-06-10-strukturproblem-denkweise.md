# Strukturproblem & Denkweise (Sektionen 2+3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Neue Homepage-Sektionen 2 ("Strukturproblem") und 3 ("Denkweise") implementieren, inkl. eines wiederverwendbaren `Section.astro`-Layout-Wrappers und eines Platzhalter-SVG-Verbindungsdiagramms, und beide direkt nach dem Hero in `index.astro` einbinden.

**Architecture:** Ein gemeinsamer `Section.astro`-Wrapper (`src/components/ui/`) nutzt erstmals die Spacing-Tokens (`--section-gap`, `--container-px`, `--container-max`). Zwei neue Sektions-Komponenten (`src/components/sections/`) verwenden diesen Wrapper und die Typografie-Tokens (`--text-section`, `--text-body`, `--text-peak`, `--peak-space`). Eine geteilte TS-Utility (`src/lib/scrollAnimate.ts`) kapselt das IntersectionObserver-basierte Scroll-Reveal-Pattern (inkl. `prefers-reduced-motion`-Fallback) für Textzeilen und das SVG-Diagramm. Ein eigenständiges `ConnectionDiagram.astro` (`src/components/diagrams/`) rendert ein abstraktes, token-farbiges SVG-Netzwerk.

**Tech Stack:** Astro 5 (TypeScript strict), Tailwind CSS 4 (Tokens aus `src/styles/global.css`), kein zusätzliches Animations-Framework (vanilla `IntersectionObserver`).

---

## Hinweis zur Verifikation

Dieses Projekt hat keine automatisierten Tests. Verifikation pro Task erfolgt über:
1. `npx astro check` (TypeScript/Astro-Typprüfung) – muss ohne Fehler durchlaufen
2. `npm run build` – muss erfolgreich durchlaufen
3. Bei den letzten beiden Tasks zusätzlich: visuelle Prüfung im Dev-Server (Light/Dark, Mobile/Desktop, `prefers-reduced-motion`)

---

### Task 1: `Section.astro` Layout-Wrapper

**Files:**
- Create: `src/components/ui/Section.astro`

- [ ] **Step 1: Komponente anlegen**

```astro
---
interface Props {
  id: string;
  class?: string;
}

const { id, class: className = "" } = Astro.props;
---

<section id={id} class={`bg-background ${className}`}>
  <div
    class="mx-auto"
    style="max-width: var(--container-max); padding-inline: var(--container-px); padding-block: var(--section-gap);"
  >
    <slot />
  </div>
</section>
```

- [ ] **Step 2: Typprüfung**

Run: `npx astro check`
Expected: `0 errors, 0 warnings, 0 hints` (oder bestehende Warnungen unverändert, keine neuen Fehler)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: Build erfolgreich (exit code 0)

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Section.astro
git commit -m "feat: add shared Section layout wrapper using spacing tokens"
```

---

### Task 2: `scrollAnimate.ts` Utility

**Files:**
- Create: `src/lib/scrollAnimate.ts`

- [ ] **Step 1: Utility-Datei anlegen**

```typescript
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
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
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
            line.style.strokeDashoffset = "0";
          });
        });

        nodes.forEach((node, i) => {
          const delay = i * staggerMs;
          node.style.transition = `opacity 0.6s ease ${delay}ms`;
          requestAnimationFrame(() => {
            node.style.opacity = "1";
          });
        });

        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(svg);
}
```

- [ ] **Step 2: Typprüfung**

Run: `npx astro check`
Expected: `0 errors, 0 warnings, 0 hints` (keine neuen Fehler)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: Build erfolgreich (exit code 0)

- [ ] **Step 4: Commit**

```bash
git add src/lib/scrollAnimate.ts
git commit -m "feat: add scroll-reveal utilities with reduced-motion fallback"
```

---

### Task 3: `Strukturproblem.astro` (Sektion 2)

**Files:**
- Create: `src/components/sections/Strukturproblem.astro`

- [ ] **Step 1: Komponente anlegen**

```astro
---
import Section from "../ui/Section.astro";
---

<Section id="strukturproblem">
  <div class="max-w-2xl">
    <h2
      style="font-size: var(--text-section);"
      class="font-bold text-foreground mb-8"
    >
      Warum gute Unternehmen<br />digital unsichtbar bleiben.
    </h2>

    <p class="text-muted-foreground mb-6" style="font-size: var(--text-body);">
      Es sind fast immer dieselben Muster:
    </p>

    <div
      class="space-y-4 text-foreground"
      style="font-size: var(--text-body); line-height: 1.7;"
    >
      <p data-animate style="opacity: 0; transform: translateY(30px);">
        Inhalte, die über Jahre gewachsen sind &ndash; ohne roten Faden.
      </p>
      <p data-animate style="opacity: 0; transform: translateY(30px);">
        Zielgruppen, die nicht klar voneinander getrennt adressiert werden.
      </p>
      <p data-animate style="opacity: 0; transform: translateY(30px);">
        Navigationen, die die interne Struktur spiegeln, nicht die Fragen der Besucher.
      </p>
      <p data-animate style="opacity: 0; transform: translateY(30px);">
        Prozesse, die nicht sauber ineinandergreifen.
      </p>
      <p data-animate style="opacity: 0; transform: translateY(30px);">
        Ein Mehrwert, der intern selbstverständlich ist &ndash; aber nach außen einfach nicht ankommt.
      </p>
    </div>

    <div style="margin-top: var(--peak-space);">
      <p
        class="font-bold text-foreground"
        style="font-size: var(--text-peak); line-height: 1.3; opacity: 0; transform: translateY(30px);"
        data-animate
      >
        Das ist kein Versagen.<br />
        Das ist das, was passiert, wenn ein Unternehmen wächst &ndash;<br />
        und die digitale Struktur nicht mitgewachsen ist.
      </p>
    </div>
  </div>
</Section>

<script>
  import { initScrollAnimate } from "../../lib/scrollAnimate";

  const section = document.getElementById("strukturproblem");
  if (section) initScrollAnimate(section);
</script>
```

- [ ] **Step 2: Typprüfung**

Run: `npx astro check`
Expected: `0 errors, 0 warnings, 0 hints` (keine neuen Fehler)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: Build erfolgreich (exit code 0)

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Strukturproblem.astro
git commit -m "feat: add Strukturproblem section (Sektion 2)"
```

---

### Task 4: `ConnectionDiagram.astro` (Platzhalter-Diagramm)

**Files:**
- Create: `src/components/diagrams/ConnectionDiagram.astro`

- [ ] **Step 1: Komponente anlegen**

```astro
---
---

<svg
  viewBox="0 0 400 300"
  class="w-full h-64 lg:h-full"
  role="img"
  aria-label="Schematische Darstellung verbundener Punkte, die ein Netzwerk aus Fragen symbolisieren"
  xmlns="http://www.w3.org/2000/svg"
>
  <g stroke="hsl(var(--border))" stroke-width="2" fill="none">
    <line data-line x1="60" y1="60" x2="200" y2="40" />
    <line data-line x1="200" y1="40" x2="320" y2="100" />
    <line data-line x1="200" y1="40" x2="120" y2="180" />
    <line data-line x1="120" y1="180" x2="280" y2="220" />
    <line data-line x1="320" y1="100" x2="280" y2="220" />
  </g>
  <g fill="hsl(var(--foreground))">
    <circle data-node cx="60" cy="60" r="8" />
    <circle data-node cx="200" cy="40" r="8" />
    <circle data-node cx="320" cy="100" r="8" />
    <circle data-node cx="120" cy="180" r="8" />
    <circle data-node cx="280" cy="220" r="8" />
  </g>
</svg>

<script>
  import { initConnectionDiagram } from "../../lib/scrollAnimate";

  document.querySelectorAll<SVGSVGElement>("svg[aria-label^='Schematische Darstellung']").forEach((svg) => {
    initConnectionDiagram(svg);
  });
</script>
```

- [ ] **Step 2: Typprüfung**

Run: `npx astro check`
Expected: `0 errors, 0 warnings, 0 hints` (keine neuen Fehler)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: Build erfolgreich (exit code 0)

- [ ] **Step 4: Commit**

```bash
git add src/components/diagrams/ConnectionDiagram.astro
git commit -m "feat: add placeholder SVG ConnectionDiagram component"
```

---

### Task 5: `Denkweise.astro` (Sektion 3)

**Files:**
- Create: `src/components/sections/Denkweise.astro`

- [ ] **Step 1: Komponente anlegen**

```astro
---
import Section from "../ui/Section.astro";
import ConnectionDiagram from "../diagrams/ConnectionDiagram.astro";
---

<Section id="denkweise">
  <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
    <div class="max-w-2xl">
      <h2
        style="font-size: var(--text-section);"
        class="font-bold text-foreground mb-8"
      >
        Wir beginnen nicht mit Maßnahmen.<br />Wir beginnen mit dem Verstehen.
      </h2>

      <div
        class="space-y-4 text-foreground"
        style="font-size: var(--text-body); line-height: 1.7;"
      >
        <p data-animate style="opacity: 0; transform: translateY(30px);">
          Bevor irgendwas gebaut, geschrieben oder automatisiert wird, stellen wir dieselben Fragen:
        </p>
        <p data-animate style="opacity: 0; transform: translateY(30px);">
          Was leistet dein Unternehmen wirklich?
        </p>
        <p data-animate style="opacity: 0; transform: translateY(30px);">
          Wen willst du erreichen &ndash; und mit welchem Mehrwert?
        </p>
        <p data-animate style="opacity: 0; transform: translateY(30px);">
          Was existiert bereits, was fehlt, was bremst?
        </p>
        <p data-animate style="opacity: 0; transform: translateY(30px);">
          Erst danach entstehen Lösungen.
        </p>
      </div>

      <div style="margin-top: var(--peak-space);">
        <p
          class="font-bold text-foreground"
          style="font-size: var(--text-peak); line-height: 1.3; opacity: 0; transform: translateY(30px);"
          data-animate
        >
          Die meisten fangen bei den Maßnahmen an.<br />
          Wir fangen davor an.
        </p>
      </div>
    </div>

    <ConnectionDiagram />
  </div>
</Section>

<script>
  import { initScrollAnimate } from "../../lib/scrollAnimate";

  const section = document.getElementById("denkweise");
  if (section) initScrollAnimate(section);
</script>
```

- [ ] **Step 2: Typprüfung**

Run: `npx astro check`
Expected: `0 errors, 0 warnings, 0 hints` (keine neuen Fehler)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: Build erfolgreich (exit code 0)

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Denkweise.astro
git commit -m "feat: add Denkweise section (Sektion 3) with ConnectionDiagram"
```

---

### Task 6: Integration in `index.astro` + finale QA

**Files:**
- Modify: `src/pages/index.astro:4-10` (Imports), `src/pages/index.astro:51-55` (Markup)

- [ ] **Step 1: Imports ergänzen**

In `src/pages/index.astro`, Zeile 5 (`import LogosBar from "../components/LogosBar.astro";`), direkt davor zwei neue Imports einfügen:

```astro
import Strukturproblem from "../components/sections/Strukturproblem.astro";
import Denkweise from "../components/sections/Denkweise.astro";
import LogosBar from "../components/LogosBar.astro";
```

- [ ] **Step 2: Sektionen einbinden**

In `src/pages/index.astro`, den Block

```astro
  <!-- 1. HERO -->
  <HeroCanvas />

  <!-- 2. LOGOS BAR -->
  <LogosBar />
```

ersetzen durch:

```astro
  <!-- 1. HERO -->
  <HeroCanvas />

  <!-- 2. STRUKTURPROBLEM -->
  <Strukturproblem />

  <!-- 3. DENKWEISE -->
  <Denkweise />

  <!-- LOGOS BAR -->
  <LogosBar />
```

- [ ] **Step 3: Typprüfung**

Run: `npx astro check`
Expected: `0 errors, 0 warnings, 0 hints` (keine neuen Fehler)

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: Build erfolgreich (exit code 0)

- [ ] **Step 5: Visuelle QA im Dev-Server**

Run: `npm run dev`

Im Browser (`http://localhost:4321/`) prüfen:
- Sektion "Strukturproblem" erscheint direkt nach dem Hero, vor der Logoleiste
- Sektion "Denkweise" folgt direkt danach, mit Diagramm rechts (Desktop) bzw. unten (Mobile-Breite simulieren)
- Beide Sektionen scrollen mit Lenis Smooth Scroll, Reveal-Animation triggert beim Scrollen in den Viewport (Textzeilen + Schlusspunkt/Abgrenzungssatz, Diagramm-Linien zeichnen sich nach, Knoten faden ein)
- Light/Dark Mode (Toggle im Header): Texte, Hintergrund und Diagrammfarben (Knoten/Linien) passen sich korrekt an
- `prefers-reduced-motion: reduce` (z. B. via Browser-DevTools emulieren): alle Inhalte sind sofort vollständig sichtbar, keine Animation
- Kontrast und Lesbarkeit der Schlusspunkt-/Abgrenzungssatz-Statements (`--text-peak`) in beiden Themes

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: wire Strukturproblem and Denkweise sections into homepage"
```

---

## Self-Review

**Spec-Abdeckung:**
- `Section.astro`-Wrapper mit `--section-gap`/`--container-px`/`--container-max` → Task 1 ✅
- Sektion 2 "Strukturproblem" (Headline, 5 Absatzzeilen, Schlusspunkt mit `--text-peak`/`--peak-space`) → Task 3 ✅
- Sektion 3 "Denkweise" (Headline, 5 Absatzzeilen, Abgrenzungssatz, 2-spaltiges Layout) → Task 5 ✅
- `ConnectionDiagram.astro` (austauschbares SVG, Token-Farben, A11y-Label, Animation, Reduced-Motion) → Task 4 ✅
- Scroll-Reveal-Pattern mit Stagger + Reduced-Motion-Fallback → Task 2 (Utility) + Tasks 3/4/5 (Anwendung) ✅
- Integration in `index.astro` direkt nach Hero, vor LogosBar → Task 6 ✅

**Platzhalter-Scan:** Keine TBD/TODO, alle Code-Blöcke vollständig.

**Typkonsistenz:** `initScrollAnimate(root: HTMLElement, ...)` und `initConnectionDiagram(svg: SVGSVGElement, ...)` werden in Tasks 3, 4, 5 exakt mit diesen Signaturen importiert und aufgerufen. `data-animate`/`data-line`/`data-node`-Attribute stimmen zwischen Utility-Selektoren und Markup überein.
