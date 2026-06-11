# Leistungen (Sektion 5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy `Leistungen3.astro` (3 tiles, hardcoded colors) with a new `Leistungen.astro` section (6 rows per `docs/copywriting.md`), using the `Section.astro` wrapper, design tokens, Lucide icons, and a scroll-animated vertical connector line.

**Architecture:** New `src/components/sections/Leistungen.astro` renders an editorial list of 6 linked rows (icon + title + description + arrow), each with `data-animate` for the existing `initScrollAnimate` reveal. A new `initLineGrow` helper in `src/lib/scrollAnimate.ts` animates a vertical connector line (`scaleY(0)` → `scaleY(1)`) through the icon column on scroll-into-view, respecting `prefers-reduced-motion`. `index.astro` swaps `<Leistungen3 />` for `<Leistungen />`, and `Leistungen3.astro` is deleted.

**Tech Stack:** Astro 5, TypeScript strict, Tailwind CSS 4 (CSS custom property tokens from `src/styles/global.css`), `lucide-astro` (new dependency), `IntersectionObserver`.

---

## Task 1: Add `lucide-astro` dependency

**Files:**
- Modify: `package.json`, `package-lock.json` (via npm)

- [ ] **Step 1: Install the package**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm install lucide-astro
```

Expected: `package.json` gains a `"lucide-astro": "^0.556.0"` (or similar) dependency, `package-lock.json` updated, `node_modules/lucide-astro` exists.

- [ ] **Step 2: Verify the package exports the icons we need**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && node -e "console.log(Object.keys(require('lucide-astro')).filter(k => ['Network','Sparkles','LayoutGrid','Search','BrainCircuit','Workflow'].includes(k)))"
```

Expected output includes all 6 names: `[ 'Network', 'Sparkles', 'LayoutGrid', 'Search', 'BrainCircuit', 'Workflow' ]`

If any icon name is missing, find the closest available outline icon name in `node_modules/lucide-astro/dist/esm/icons/` (kebab-case filenames map to PascalCase exports) and use that instead — keep the visual intent (Informationsarchitektur→network/structure, Markenaufbau→sparkles/brand, Designsysteme→grid/components, SEO/GEO→search, KI-Implementierung→brain/circuit, Automatisierung→workflow/repeat).

- [ ] **Step 3: Commit**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && git add package.json package-lock.json && git commit -m "chore: add lucide-astro dependency for outline icons"
```

---

## Task 2: Add `initLineGrow` to `src/lib/scrollAnimate.ts`

**Files:**
- Modify: `src/lib/scrollAnimate.ts` (append new exported function)

The file currently exports `initScrollAnimate` and `initConnectionDiagram`. We add a third function, `initLineGrow`, following the same `prefers-reduced-motion` + `IntersectionObserver` + double-`requestAnimationFrame` pattern used by the other two.

- [ ] **Step 1: Append `initLineGrow` to the end of the file**

Append this to `src/lib/scrollAnimate.ts` (after the closing `}` of `initConnectionDiagram`, which is the last line of the current file):

```ts

/**
 * Aktiviert die Wachstums-Animation für die vertikale Verbindungslinie
 * in `Leistungen.astro`: `el` startet mit `transform: scaleY(0)` (siehe
 * Markup, `origin-top`) und animiert beim ersten Eintritt in den Viewport
 * zu `scaleY(1)`.
 *
 * Respektiert `prefers-reduced-motion: reduce` (sofort vollständig sichtbar,
 * kein Observer, keine Transition).
 */
export function initLineGrow(el: HTMLElement): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    el.style.transform = "scaleY(1)";
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        el.style.transition = "transform 1s ease";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transform = "scaleY(1)";
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

- [ ] **Step 2: Type-check**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npx astro check 2>&1 | tail -5
```

Expected: same baseline as before this change (34 pre-existing errors, 0 warnings, 6 hints — no new errors from `scrollAnimate.ts`).

- [ ] **Step 3: Commit**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && git add src/lib/scrollAnimate.ts && git commit -m "feat: add initLineGrow scroll animation helper"
```

---

## Task 3: Create `src/components/sections/Leistungen.astro`

**Files:**
- Create: `src/components/sections/Leistungen.astro`

This is the new Sektion 5 component: header (headline + subline) and an editorial list of 6 rows, each a full-row link with icon, title, description, and arrow. A vertical connector line runs through the icon column.

- [ ] **Step 1: Create the file**

```astro
---
import Section from "../ui/Section.astro";
import { Network, Sparkles, LayoutGrid, Search, BrainCircuit, Workflow } from "lucide-astro";

const leistungen = [
  {
    title: "Informationsarchitektur",
    text: "Struktur, die für Besucher funktioniert – nicht für interne Zuständigkeiten.",
    href: "/leistungen",
    icon: Network,
  },
  {
    title: "Markenaufbau",
    text: "Den echten Mehrwert in Sprache, Haltung und Gestaltung übersetzen.",
    href: "/leistungen/markenaufbau-branding",
    icon: Sparkles,
  },
  {
    title: "Designsysteme",
    text: "Konsistenz, die skaliert – über alle Kanäle und Touchpoints.",
    href: "/leistungen/designsystem",
    icon: LayoutGrid,
  },
  {
    title: "SEO / GEO",
    text: "Nachfrage verstehen – in klassischen und KI-basierten Suchsystemen.",
    href: "/leistungen/seo-geo",
    icon: Search,
  },
  {
    title: "KI-Implementierung",
    text: "Dort einsetzen, wo KI echte Entlastung bringt.",
    href: "/leistungen/ki-implementierung",
    icon: BrainCircuit,
  },
  {
    title: "Automatisierung",
    text: "Wiederkehrende Prozesse digitalisieren – damit der Fokus beim Kerngeschäft bleibt.",
    href: "/leistungen/automatisierung",
    icon: Workflow,
  },
];
---

<Section id="leistungen">
  <div class="max-w-2xl mb-12">
    <h2 style="font-size: var(--text-section);" class="font-bold text-foreground mb-4">
      Was wir einsetzen.
    </h2>
    <p class="text-muted-foreground" style="font-size: var(--text-body);">
      Keine isolierten Leistungen.<br />
      Dieselbe Denkweise. Die richtigen Werkzeuge.
    </p>
  </div>

  <div class="relative">
    <div
      data-line
      class="absolute top-0 bottom-0 w-px bg-border origin-top scale-y-0"
      style="left: 20px;"
      aria-hidden="true"
    ></div>

    <div class="divide-y divide-border border-t border-b border-border">
      {leistungen.map(({ title, text, href, icon: Icon }) => (
        <a
          href={href}
          data-animate
          class="group grid grid-cols-[40px_1fr_24px] items-start gap-4 py-8"
          style="opacity: 0; transform: translateY(30px);"
        >
          <span class="relative z-10 flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background">
            <Icon class="w-5 h-5 text-foreground" stroke-width={1.5} aria-hidden="true" />
          </span>
          <div>
            <h3 class="font-bold text-foreground mb-1" style="font-size: var(--text-body);">
              {title}
            </h3>
            <p class="text-muted-foreground" style="font-size: var(--text-body);">
              {text}
            </p>
          </div>
          <span
            class="self-center text-muted-foreground transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          >
            &rarr;
          </span>
        </a>
      ))}
    </div>
  </div>
</Section>

<script>
  import { initScrollAnimate, initLineGrow } from "../../lib/scrollAnimate";

  const section = document.getElementById("leistungen");
  if (section) {
    initScrollAnimate(section);
    const line = section.querySelector<HTMLElement>("[data-line]");
    if (line) initLineGrow(line);
  }
</script>
```

- [ ] **Step 2: Type-check**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npx astro check 2>&1 | tail -5
```

Expected: 34 pre-existing errors (baseline), 0 new errors from `Leistungen.astro`.

- [ ] **Step 3: Commit**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && git add src/components/sections/Leistungen.astro && git commit -m "feat: add Leistungen section (Sektion 5) with 6 rows and connector line"
```

---

## Task 4: Wire `Leistungen` into `index.astro`, remove `Leistungen3.astro`

**Files:**
- Modify: `src/pages/index.astro:8` (import) and `src/pages/index.astro:65-66` (markup)
- Delete: `src/components/Leistungen3.astro`

Current state of `src/pages/index.astro` (relevant lines):

Line 8:
```astro
import Leistungen3 from "../components/Leistungen3.astro";
```

Lines 65-66:
```astro
  <!-- 5. LEISTUNGEN (3 kompakte Kacheln) -->
  <Leistungen3 />
```

- [ ] **Step 1: Replace the import**

In `src/pages/index.astro`, change line 8 from:

```astro
import Leistungen3 from "../components/Leistungen3.astro";
```

to:

```astro
import Leistungen from "../components/sections/Leistungen.astro";
```

- [ ] **Step 2: Replace the markup**

Change:

```astro
  <!-- 5. LEISTUNGEN (3 kompakte Kacheln) -->
  <Leistungen3 />
```

to:

```astro
  <!-- 5. LEISTUNGEN -->
  <Leistungen />
```

- [ ] **Step 3: Delete the legacy component**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && rm src/components/Leistungen3.astro
```

- [ ] **Step 4: Type-check and build**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npx astro check 2>&1 | tail -5 && npm run build 2>&1 | tail -10
```

Expected: 34 pre-existing errors (baseline, no new ones — in particular no "Cannot find module '../components/Leistungen3.astro'" error), build succeeds.

- [ ] **Step 5: Live browser QA**

Start the dev/preview server and verify in the browser:
- Section "Was wir einsetzen." appears between LogosBar and Ergebnisse, with subline "Keine isolierten Leistungen. Dieselbe Denkweise. Die richtigen Werkzeuge."
- All 6 rows render in order: Informationsarchitektur, Markenaufbau, Designsysteme, SEO / GEO, KI-Implementierung, Automatisierung — each with an icon, title, description, and arrow
- Each row is a clickable link (hover shows arrow shifting right); links point to `/leistungen`, `/leistungen/markenaufbau-branding`, `/leistungen/designsystem`, `/leistungen/seo-geo`, `/leistungen/ki-implementierung`, `/leistungen/automatisierung`
- Scrolling the section into view triggers: rows fade/slide in staggered, vertical connector line grows from top to bottom through the icon circles
- Check both light and dark mode (toggle via `#theme-toggle`) — icons, borders, and line use token colors and adapt correctly
- Check mobile width (e.g. 390px) and desktop width (e.g. 1280px) — layout remains a single-column list at both, no horizontal overflow

- [ ] **Step 6: Commit**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && git add src/pages/index.astro && git rm src/components/Leistungen3.astro && git commit -m "feat: wire Leistungen section into homepage, remove legacy Leistungen3"
```

---

## Self-Review Notes

- **Spec coverage:** Task 1 covers the new dependency (Spec §5), Task 2 covers `initLineGrow` (Spec §3), Task 3 covers the new component with content, layout, icons, and connector line (Spec §1, §2), Task 4 covers integration and removal of the legacy component (Spec §4, file overview). All spec sections are covered.
- **Placeholder scan:** No TBD/TODO; all code blocks are complete and copy-pasteable.
- **Type consistency:** `initLineGrow(el: HTMLElement)` signature matches its usage in Task 3 (`section.querySelector<HTMLElement>("[data-line]")`). `initScrollAnimate(section)` matches the existing signature (`root: HTMLElement`, defaults for selector/stagger). Icon names (`Network`, `Sparkles`, `LayoutGrid`, `Search`, `BrainCircuit`, `Workflow`) are consistent between Task 1's verification step and Task 3's import.
