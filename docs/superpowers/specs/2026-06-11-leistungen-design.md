# Leistungen (Sektion 5) – Design Spec

> Phase 3 von "Startseite Rebuild nach neuer CLAUDE.md / copywriting.md".
> Baut auf der Design-Tokens Foundation (Phase 1) und dem Section-Wrapper
> aus Phase 2 (Strukturproblem & Denkweise) auf.

---

## Scope

**In Scope:**
- Neue Komponente `src/components/sections/Leistungen.astro`
- Ersetzt die bestehende `src/components/Leistungen3.astro` (wird gelöscht)
- 6 Leistungs-Zeilen laut `docs/copywriting.md` (Sektion 5), editorial Listen-Layout
- Subtile vertikale Verbindungslinie durch die Icon-Positionen (Strukturhinweis laut Copywriting "Visuelle Richtung")
- Scroll-Reveal für Zeilen (Wiederverwendung von `initScrollAnimate`) und für die Verbindungslinie (neue Funktion `initLineGrow` in `src/lib/scrollAnimate.ts`)
- Neue Dependency: `lucide-astro` (Icons, outline-only gemäß CLAUDE.md)
- Einbindung in `index.astro` an Position "5. LEISTUNGEN" (ersetzt `<Leistungen3 />`)

**Out of Scope:**
- Sektion 6 (Cases), Sektion 7 (Haltung+CTA), Sektion 4 (Die Reihenfolge) – folgen in späteren Phasen
- Eigene Unterseite für "Informationsarchitektur" (verlinkt vorerst auf `/leistungen`)
- Änderungen an den bestehenden Leistungs-Unterseiten (`/leistungen/*`)

---

## 1. Inhalt (wörtlich aus `docs/copywriting.md`)

**Headline:** "Was wir einsetzen."

**Subline:** "Keine isolierten Leistungen.<br />Dieselbe Denkweise. Die richtigen Werkzeuge."

**6 Zeilen** (in dieser Reihenfolge – Informationsarchitektur bewusst zuerst):

| # | Titel | Beschreibung | Link | Lucide-Icon |
|---|---|---|---|---|
| 1 | Informationsarchitektur | "Struktur, die für Besucher funktioniert – nicht für interne Zuständigkeiten." | `/leistungen` | `Network` |
| 2 | Markenaufbau | "Den echten Mehrwert in Sprache, Haltung und Gestaltung übersetzen." | `/leistungen/markenaufbau-branding` | `Sparkles` |
| 3 | Designsysteme | "Konsistenz, die skaliert – über alle Kanäle und Touchpoints." | `/leistungen/designsystem` | `LayoutGrid` |
| 4 | SEO / GEO | "Nachfrage verstehen – in klassischen und KI-basierten Suchsystemen." | `/leistungen/seo-geo` | `Search` |
| 5 | KI-Implementierung | "Dort einsetzen, wo KI echte Entlastung bringt." | `/leistungen/ki-implementierung` | `BrainCircuit` |
| 6 | Automatisierung | "Wiederkehrende Prozesse digitalisieren – damit der Fokus beim Kerngeschäft bleibt." | `/leistungen/automatisierung` | `Workflow` |

---

## 2. Struktur – `Leistungen.astro`

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

### Layout
- Editorial-Listen-Layout, identische Spaltenbreiten (`grid-cols-[40px_1fr_24px]`) auf allen Breakpoints – kein Layoutwechsel nötig (Mobile-First erfüllt durch Single-Column-Charakter)
- Icon-Kreis 40×40px (`rounded-full border border-border bg-background`), Icon `w-5 h-5 text-foreground`, `stroke-width={1.5}` (outline-only)
- Ganze Zeile ist `<a>` (großer Klickbereich, erfüllt 44×44px Touch-Target durch `py-8`)
- Pfeil `→` rechts, `group-hover:translate-x-1`
- `bg-background` (konsistent mit Sektion 2+3)

---

## 3. Verbindungslinie (`initLineGrow`)

Neue Funktion in `src/lib/scrollAnimate.ts`, ergänzt `initScrollAnimate` und `initConnectionDiagram`:

```ts
export function initLineGrow(el: HTMLElement): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    el.style.transform = "scaleY(1)";
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.style.transition = "transform 1s ease";
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = "scaleY(1)";
            });
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(el);
}
```

- `el` startet mit `scale-y-0` (Tailwind-Klasse, `transform-origin: top` via `origin-top`)
- Bei `prefers-reduced-motion: reduce`: Linie ist sofort vollständig sichtbar (`scaleY(1)`), kein Observer
- Linie liegt bei `left: 20px` (= horizontale Mitte der 40px-Icon-Kreise), spannt die volle Höhe der Liste (`top-0 bottom-0`)
- Farbe `bg-border` (gleicher Token wie Trennlinien der Liste)

---

## 4. Integration in `index.astro`

```astro
---
import Leistungen from "../components/sections/Leistungen.astro";
// ... bestehende Imports, Leistungen3-Import entfernen
---
...
<!-- 5. LEISTUNGEN -->
<Leistungen />
...
```

`src/components/Leistungen3.astro` wird gelöscht.

---

## 5. Neue Dependency

```bash
npm install lucide-astro
```

`lucide-astro@0.556.0` (zum Zeitpunkt der Spec verfügbar) – stellt einzelne Icons als Astro-Komponenten bereit (tree-shakeable, kein globaler Bundle-Impact).

---

## Datei-Übersicht

| Datei | Status |
|---|---|
| `src/components/sections/Leistungen.astro` | neu |
| `src/components/Leistungen3.astro` | gelöscht |
| `src/lib/scrollAnimate.ts` | modifiziert (neue Funktion `initLineGrow`) |
| `src/pages/index.astro` | modifiziert (Import + 1 Zeile Markup) |
| `package.json` / `package-lock.json` | modifiziert (neue Dependency `lucide-astro`) |

---

## Offene Punkte für spätere Phasen (zur Erinnerung, nicht Teil dieser Spec)

- Eigene Unterseite `/leistungen/informationsarchitektur` (aktuell verlinkt Kachel 1 auf `/leistungen`)
- Sektion 6 "Cases" (nächste Phase nach dieser)
- Sektion 4 "Die Reihenfolge" (Peak-Moment, WebGL) – zuletzt, eigenes Brainstorming nötig
