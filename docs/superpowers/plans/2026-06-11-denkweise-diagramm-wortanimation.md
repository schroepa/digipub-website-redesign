# Diagramm "Denkweise" + Wort-für-Wort Scroll-Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ConnectionDiagram in Sektion "Denkweise" zu einer aussagekräftigen "Konvergenz"-Visualisierung umbauen und die beiden Peak-Statements in Sektion "Strukturproblem" und "Denkweise" als volle-Breite-Blöcke mit Wort-für-Wort-Scroll-Reveal (Desktop: Pin+Scrub via GSAP, Mobile: einmaliger Stagger) darstellen.

**Architecture:** Ein neues Lib-Modul `src/lib/wordReveal.ts` kapselt die Wort-Splitting- und Reveal-Logik (Desktop GSAP ScrollTrigger Pin+Scrub, Mobile IntersectionObserver-Stagger, reduced-motion Fallback). `ConnectionDiagram.astro` erhält neue Konvergenz-Geometrie (4 kleine Knoten → 1 großer Knoten); `scrollAnimate.ts` bekommt einen zusätzlichen Pulse-Effekt für den letzten Knoten. `Strukturproblem.astro` und `Denkweise.astro` lösen ihr jeweiliges Peak-Statement aus dem `max-w-2xl`-Textblock heraus, platzieren es als vollbreiten Block mit dem neuen `--text-statement`-Token und initialisieren `initWordReveal`.

**Tech Stack:** Astro 5 (TypeScript strict), Tailwind CSS 4 mit CSS Custom Properties, GSAP + ScrollTrigger (neu), bestehendes `scrollAnimate.ts`-Pattern (IntersectionObserver, prefers-reduced-motion).

---

## Vorab: Baseline prüfen

Bevor du mit Task 1 beginnst, einmal die aktuelle Baseline feststellen:

```bash
npx astro check
```

Erwartet: 34 Fehler, 0 Warnungen, 6 Hinweise (alle bestehend, nicht von diesem Plan verursacht). Diese Zahl darf sich durch die folgenden Tasks **nicht verschlechtern** — nach jedem Task erneut prüfen.

---

### Task 1: `--text-statement` Design-Token hinzufügen

**Files:**
- Modify: `src/styles/global.css:33-41`

- [ ] **Step 1: Token in `:root` ergänzen**

In `src/styles/global.css` befindet sich folgender Block (Zeilen 33–41):

```css
  --text-hero:    clamp(3rem, 2rem + 5vw, 5rem);
  --text-section: clamp(2.25rem, 1.6rem + 3.25vw, 3.5rem);
  --text-peak:    clamp(1.875rem, 1.4rem + 2.38vw, 2.75rem);
  --text-body:    clamp(1rem, 0.9rem + 0.5vw, 1.125rem);

  --section-gap:   clamp(64px, 5vw + 40px, 128px);
  --container-px:  clamp(16px, 4vw, 40px);
  --container-max: 1200px;
  --peak-space:    80px;
```

Ändere ihn zu (neue Zeile nach `--text-peak`):

```css
  --text-hero:      clamp(3rem, 2rem + 5vw, 5rem);
  --text-section:   clamp(2.25rem, 1.6rem + 3.25vw, 3.5rem);
  --text-peak:      clamp(1.875rem, 1.4rem + 2.38vw, 2.75rem);
  --text-statement: clamp(1.75rem, 1.1rem + 3.5vw, 3.75rem);
  --text-body:      clamp(1rem, 0.9rem + 0.5vw, 1.125rem);

  --section-gap:   clamp(64px, 5vw + 40px, 128px);
  --container-px:  clamp(16px, 4vw, 40px);
  --container-max: 1200px;
  --peak-space:    80px;
```

- [ ] **Step 2: Build-Check**

Run: `npx astro check`
Expected: Gleiche Werte wie Baseline (34/0/6) — CSS-Tokens werden von `astro check` nicht typgeprüft, dieser Schritt stellt nur sicher, dass nichts kaputtgegangen ist.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add --text-statement design token"
```

---

### Task 2: GSAP als Dependency hinzufügen

**Files:**
- Modify: `package.json`

- [ ] **Step 1: GSAP installieren**

```bash
pnpm add gsap
```

Dadurch wird `package.json` automatisch um den `gsap`-Eintrag unter `dependencies` ergänzt und `pnpm-lock.yaml` aktualisiert.

- [ ] **Step 2: Installation prüfen**

Run: `node -e "console.log(require('gsap/package.json').version)"`
Expected: Eine Versionsnummer wird ausgegeben (z.B. `3.12.x`), kein Fehler.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add gsap dependency for scroll-scrubbed word reveal"
```

---

### Task 3: `src/lib/wordReveal.ts` erstellen

**Files:**
- Create: `src/lib/wordReveal.ts`

**Kontext:** Dieses Modul splittet den Text eines Elements in `<span class="word">`-Elemente und animiert sie beim Scrollen ein. Es folgt dem bestehenden Pattern aus `src/lib/scrollAnimate.ts` (`prefers-reduced-motion` zuerst prüfen, dann IntersectionObserver für den einfachen Fall). Für den Desktop-Fall wird zusätzlich GSAP + ScrollTrigger verwendet (Pin + Scrub), dynamisch importiert, damit Mobile-Nutzer das GSAP-Bundle nicht laden.

- [ ] **Step 1: Datei mit vollständigem Inhalt anlegen**

```typescript
/**
 * Zerlegt den Textinhalt von `el` in `<span class="word">`-Elemente
 * (vorhandene `<br />`-Zeilenumbrüche bleiben erhalten) und animiert sie
 * beim Scrollen von `opacity: 0.15` auf `1`.
 *
 * Desktop (>= 1024px): Pin + Scroll-Scrub via GSAP ScrollTrigger
 * (analog welance.com) – die Wörter färben sich während des Scrollens
 * durch eine 200vh-Wrapper-Zone sequenziell ein.
 *
 * Mobile (< 1024px): einmaliges, gestaffeltes Fade-in via
 * IntersectionObserver beim ersten Eintritt in den Viewport.
 *
 * Respektiert `prefers-reduced-motion: reduce` (Wörter sofort sichtbar,
 * kein Pin, kein Observer).
 */
export function initWordReveal(el: HTMLElement): void {
  const words = wrapWords(el);
  if (words.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    words.forEach((word) => {
      word.style.opacity = "1";
    });
    return;
  }

  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

  if (isDesktop) {
    void initDesktopScrub(el, words);
  } else {
    initMobileStagger(el, words);
  }
}

function wrapWords(el: HTMLElement): HTMLSpanElement[] {
  const words: HTMLSpanElement[] = [];

  Array.from(el.childNodes).forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE) return;

    const text = node.textContent ?? "";
    const fragment = document.createDocumentFragment();

    text.split(/(\s+)/).forEach((part) => {
      if (part.length === 0) return;

      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
        return;
      }

      const span = document.createElement("span");
      span.className = "word";
      span.style.opacity = "0.15";
      span.textContent = part;
      fragment.appendChild(span);
      words.push(span);
    });

    node.replaceWith(fragment);
  });

  return words;
}

async function initDesktopScrub(
  el: HTMLElement,
  words: HTMLSpanElement[],
): Promise<void> {
  const { default: gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  const wrapper = document.createElement("div");
  wrapper.style.height = "200vh";
  wrapper.style.position = "relative";

  el.parentElement?.insertBefore(wrapper, el);
  wrapper.appendChild(el);

  el.style.position = "sticky";
  el.style.top = "50%";
  el.style.transform = "translateY(-50%)";

  gsap.to(words, {
    opacity: 1,
    stagger: 1 / words.length,
    ease: "none",
    scrollTrigger: {
      trigger: wrapper,
      start: "top top",
      end: "+=100%",
      scrub: true,
    },
  });
}

function initMobileStagger(
  el: HTMLElement,
  words: HTMLSpanElement[],
  staggerMs = 30,
): void {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        words.forEach((word, i) => {
          const delay = i * staggerMs;
          word.style.transition = `opacity 0.4s ease ${delay}ms`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              word.style.opacity = "1";
            });
          });
        });

        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(el);
}
```

- [ ] **Step 2: Build-Check**

Run: `npx astro check`
Expected: Gleiche Werte wie Baseline (34/0/6) — die neue Datei ist strikt typisiert und darf keine neuen Fehler erzeugen. Falls `gsap/ScrollTrigger` einen Typfehler wirft, prüfe ob `gsap` korrekt installiert ist (Task 2).

- [ ] **Step 3: Commit**

```bash
git add src/lib/wordReveal.ts
git commit -m "feat: add initWordReveal with desktop pin/scrub and mobile stagger fallback"
```

---

### Task 4: ConnectionDiagram zu Konvergenz-Geometrie umbauen

**Files:**
- Modify: `src/components/diagrams/ConnectionDiagram.astro`
- Modify: `src/lib/scrollAnimate.ts:106-114`

**Kontext:** Das Diagramm soll jetzt 4 kleine Knoten ("Fragen") zeigen, die über Linien zu einem großen Knoten ("Lösung") konvergieren – passend zur Aussage "Erst danach entstehen Lösungen." Der große Knoten erhält zusätzlich einen kurzen Scale-Pulse nach seinem Fade-in.

- [ ] **Step 1: `ConnectionDiagram.astro` komplett ersetzen**

Ersetze den gesamten Inhalt von `src/components/diagrams/ConnectionDiagram.astro` mit:

```astro
---
---

<svg
  viewBox="0 0 400 300"
  class="w-full h-64 lg:h-full"
  role="img"
  aria-label="Schematische Darstellung von vier Fragen, die in einer gemeinsamen Lösung zusammenlaufen"
  data-connection-diagram
  xmlns="http://www.w3.org/2000/svg"
>
  <g stroke="hsl(var(--border))" stroke-width="2" fill="none">
    <line data-line x1="60" y1="50" x2="300" y2="150" />
    <line data-line x1="60" y1="120" x2="300" y2="150" />
    <line data-line x1="60" y1="190" x2="300" y2="150" />
    <line data-line x1="60" y1="250" x2="300" y2="150" />
  </g>
  <g fill="hsl(var(--foreground))">
    <circle data-node cx="60" cy="50" r="8" />
    <circle data-node cx="60" cy="120" r="8" />
    <circle data-node cx="60" cy="190" r="8" />
    <circle data-node cx="60" cy="250" r="8" />
    <circle data-node cx="300" cy="150" r="16" />
  </g>
</svg>

<script>
  import { initConnectionDiagram } from "../../lib/scrollAnimate";

  document.querySelectorAll<SVGSVGElement>("svg[data-connection-diagram]").forEach((svg) => {
    initConnectionDiagram(svg);
  });
</script>

<style>
  @keyframes connection-diagram-pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.25);
    }
  }

  :global(.connection-diagram-pulse) {
    transform-box: fill-box;
    transform-origin: center;
    animation: connection-diagram-pulse 0.4s ease;
  }
</style>
```

- [ ] **Step 2: Pulse-Logik in `scrollAnimate.ts` ergänzen**

In `src/lib/scrollAnimate.ts` befindet sich in `initConnectionDiagram` der folgende Block (Zeilen 106–114):

```typescript
        nodes.forEach((node, i) => {
          const delay = i * staggerMs;
          node.style.transition = `opacity 0.6s ease ${delay}ms`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              node.style.opacity = "1";
            });
          });
        });
```

Ersetze ihn durch:

```typescript
        nodes.forEach((node, i) => {
          const delay = i * staggerMs;
          node.style.transition = `opacity 0.6s ease ${delay}ms`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              node.style.opacity = "1";
            });
          });

          if (i === nodes.length - 1) {
            setTimeout(() => {
              node.classList.add("connection-diagram-pulse");
            }, delay + 600);
          }
        });
```

Damit erhält der zuletzt im DOM stehende Knoten (der große "Lösungs"-Knoten, `cx="300" cy="150" r="16"`) nach Abschluss seines Fade-ins (`600ms` Transition + Stagger-Delay) die Pulse-Klasse.

- [ ] **Step 3: Build-Check**

Run: `npx astro check`
Expected: Gleiche Werte wie Baseline (34/0/6).

- [ ] **Step 4: Commit**

```bash
git add src/components/diagrams/ConnectionDiagram.astro src/lib/scrollAnimate.ts
git commit -m "feat: redesign ConnectionDiagram as convergence visualization with pulse accent"
```

---

### Task 5: `Strukturproblem.astro` – Statement als vollbreiter Wort-Reveal-Block

**Files:**
- Modify: `src/components/sections/Strukturproblem.astro`

**Kontext:** Das fett gesetzte Peak-Statement wird aus dem `max-w-2xl`-Block herausgelöst und als eigener, vollbreiter Block (innerhalb des Section-Containers, also bis `--container-max: 1200px`) direkt darunter platziert. Es nutzt `--text-statement` statt `--text-peak` und wird per `initWordReveal` animiert statt per `data-animate`.

- [ ] **Step 1: Datei komplett ersetzen**

Ersetze den gesamten Inhalt von `src/components/sections/Strukturproblem.astro` mit:

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
  </div>

  <div style="margin-top: var(--peak-space);">
    <p
      data-statement
      class="font-bold text-foreground"
      style="font-size: var(--text-statement); line-height: 1.3;"
    >
      Das ist kein Versagen.<br />
      Das ist das, was passiert, wenn ein Unternehmen wächst &ndash;<br />
      und die digitale Struktur nicht mitgewachsen ist.
    </p>
  </div>
</Section>

<script>
  import { initScrollAnimate } from "../../lib/scrollAnimate";
  import { initWordReveal } from "../../lib/wordReveal";

  const section = document.getElementById("strukturproblem");
  if (section) initScrollAnimate(section);

  const statement = document.querySelector<HTMLElement>("#strukturproblem [data-statement]");
  if (statement) initWordReveal(statement);
</script>
```

- [ ] **Step 2: Build-Check**

Run: `npx astro check`
Expected: Gleiche Werte wie Baseline (34/0/6).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Strukturproblem.astro
git commit -m "feat: move Strukturproblem statement to full-width word-reveal block"
```

---

### Task 6: `Denkweise.astro` – Statement als vollbreiter Wort-Reveal-Block

**Files:**
- Modify: `src/components/sections/Denkweise.astro`

**Kontext:** Analog zu Task 5, aber für Sektion "Denkweise". Das Peak-Statement wird aus dem 2-spaltigen Grid (Text + `ConnectionDiagram`) herausgelöst und unterhalb des Grids als vollbreiter Block platziert.

- [ ] **Step 1: Datei komplett ersetzen**

Ersetze den gesamten Inhalt von `src/components/sections/Denkweise.astro` mit:

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
    </div>

    <ConnectionDiagram />
  </div>

  <div style="margin-top: var(--peak-space);">
    <p
      data-statement
      class="font-bold text-foreground"
      style="font-size: var(--text-statement); line-height: 1.3;"
    >
      Die meisten fangen bei den Maßnahmen an.<br />
      Wir fangen davor an.
    </p>
  </div>
</Section>

<script>
  import { initScrollAnimate } from "../../lib/scrollAnimate";
  import { initWordReveal } from "../../lib/wordReveal";

  const section = document.getElementById("denkweise");
  if (section) initScrollAnimate(section);

  const statement = document.querySelector<HTMLElement>("#denkweise [data-statement]");
  if (statement) initWordReveal(statement);
</script>
```

- [ ] **Step 2: Build-Check**

Run: `npx astro check`
Expected: Gleiche Werte wie Baseline (34/0/6).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Denkweise.astro
git commit -m "feat: move Denkweise statement to full-width word-reveal block"
```

---

### Task 7: Finaler Build + visuelle QA

**Files:** keine (Verifikation)

**Kontext:** Dieser Task führt keine Code-Änderungen mehr durch, sondern verifiziert das Gesamtergebnis im Browser. Falls hier visuelle Probleme auffallen (z.B. das Statement ist während des Pinnings nicht vertikal zentriert), darf in dieser Phase noch nachjustiert werden – z.B. durch Anpassen von `top`/`transform` in `initDesktopScrub` (`src/lib/wordReveal.ts`) oder per CSS in den betroffenen `.astro`-Dateien.

- [ ] **Step 1: Production-Build prüfen**

Run: `npx astro check && npx astro build`
Expected: `astro check` liefert Baseline-Werte (34/0/6), `astro build` läuft ohne Fehler durch.

- [ ] **Step 2: Dev-Server starten und Sektionen "Strukturproblem" + "Denkweise" im Browser prüfen (Light Mode)**

Prüfe:
- Sektion "Strukturproblem": Statement ("Das ist kein Versagen...") ist vollbreit (bis `--container-max`), deutlich größer als der übrige Fließtext, Wörter starten gedimmt und färben sich beim Scrollen sequenziell ein
- Sektion "Denkweise": ConnectionDiagram zeigt 4 kleine Knoten links, die zu einem großen Knoten rechts konvergieren; Linien zeichnen sich nach, Knoten faden ein, großer Knoten pulsiert kurz nach dem Einblenden
- Sektion "Denkweise": Statement ("Die meisten fangen...") ist vollbreit, größer, Wort-Reveal funktioniert analog

- [ ] **Step 3: Dark Mode prüfen**

Gleiche Checks wie Step 2, aber mit aktiviertem Dark Mode (ThemeToggle) – Diagramm-Farben (`hsl(var(--foreground))`, `hsl(var(--border))`) und Statement-Text müssen ausreichend Kontrast haben.

- [ ] **Step 4: Mobile-Viewport prüfen (< 1024px)**

Browser auf eine Breite < 1024px verkleinern (z.B. 390px):
- Beide Statements sind als vollbreite Blöcke sichtbar
- Wort-Reveal läuft als einmaliger Stagger beim Scrollen ins Sichtfeld (kein Pinning, keine 200vh-Scrollzone)
- Diagramm bleibt lesbar (`h-64` auf Mobile)

- [ ] **Step 5: `prefers-reduced-motion: reduce` prüfen**

Mit aktivierter "Reduce Motion"-Einstellung (Browser-DevTools-Emulation):
- Beide Statements sind sofort vollständig sichtbar (keine gedimmten Wörter)
- Diagramm-Linien/Knoten sind sofort sichtbar, kein Pulse

- [ ] **Step 6: Commit (falls in Step 1–5 Anpassungen nötig waren)**

Falls Anpassungen gemacht wurden:

```bash
git add -A
git commit -m "fix: adjust word-reveal centering and diagram details after visual QA"
```

Falls keine Anpassungen nötig waren, diesen Schritt überspringen.

---

## Self-Review (durchgeführt)

- **Spec-Abdeckung:** ConnectionDiagram-Konvergenz (Task 4), `wordReveal.ts` mit Desktop-Pin/Scrub + Mobile-Stagger + reduced-motion (Task 3), `--text-statement`-Token (Task 1), Layout-Umbau beider Sektionen (Task 5+6), GSAP-Dependency (Task 2), abschließende QA (Task 7) — alle Spec-Anforderungen abgedeckt.
- **Placeholder-Scan:** Keine TBD/TODO, alle Code-Blöcke vollständig.
- **Typkonsistenz:** `initWordReveal(el: HTMLElement)` wird in Task 5 und 6 identisch aufgerufen; `initConnectionDiagram` Signatur unverändert; `connection-diagram-pulse`-Klassenname konsistent zwischen `ConnectionDiagram.astro` (CSS) und `scrollAnimate.ts` (JS).
