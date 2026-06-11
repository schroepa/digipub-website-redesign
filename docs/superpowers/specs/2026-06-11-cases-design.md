# Cases (Sektion 6) – Design Spec

> Phase 4 von "Startseite Rebuild nach neuer CLAUDE.md / copywriting.md".
> Baut auf der Design-Tokens Foundation (Phase 1), dem Section-Wrapper
> aus Phase 2 (Strukturproblem & Denkweise) und der Leistungen-Sektion
> (Phase 3) auf.

---

## Scope

**In Scope:**
- Neue Komponente `src/components/sections/Cases.astro`
- 4 Cases laut `docs/copywriting.md` (Sektion 6), im Dreiklang
  Ausgangslage / Was wir taten / Jetzt
- Pro Case ein visuelles Element: Prozesspfeil (1 Linie + 3 Knoten),
  scroll-animiert via Reuse von `initConnectionDiagram`
  (`src/lib/scrollAnimate.ts`, bereits vorhanden)
- Scroll-Reveal für die Case-Blöcke (Reuse von `initScrollAnimate`)
- Editorial-Listen-Layout (`divide-y`/`border-t`/`border-b`, analog
  Leistungen-Sektion) statt Logo-Raster
- Einbindung in `index.astro` als neue Sektion 6, direkt nach Leistungen,
  mit Renumerierung der nachfolgenden Sektions-Kommentare

**Out of Scope:**
- Eigene Detailseite `/case-studies/initiative-handarbeit` (Case 4 erhält
  vorerst keinen aktiven Link, siehe unten)
- Sektion 7 (Haltung+CTA), Sektion 4 (Die Reihenfolge) – folgen in
  späteren Phasen
- Änderungen an bestehenden Case-Study-Detailseiten
  (`src/pages/case-studies/*`)

---

## 1. Inhalt (wörtlich aus `docs/copywriting.md`)

**Headline:** "Was daraus entsteht."

**Subline:** "Unternehmen, die ihre Stärke<br />jetzt auch zeigen können."

**4 Cases** (in dieser Reihenfolge):

| # | Case | Ausgangslage | Was wir taten | Jetzt | Link |
|---|---|---|---|---|---|
| 01 | Portazon – Smart City Super App, Trier | Eine neue Plattform mit großer Idee – aber ohne Struktur, die sie trägt. | Wir haben Content-Architektur, Partnerstrategie und Monitoring aufgebaut. | Portazon ist heute sichtbar – lokal verankert, digital durchdacht. | `/case-studies/portazon` |
| 02 | Haidacher – Tischlerei, Südtirol | Eine exklusive Handwerkstradition, die online schlicht nicht zu finden war. | Sichtbarkeit aufgebaut – ohne das Erscheinungsbild anzutasten. | Erstmals relevante Rankings. Doppelte Sichtbarkeit. Ganz im Stil des Hauses. | `/case-studies/haidacher` |
| 03 | De Gruyter – Wissenschaftsverlag | Ein traditionsreicher Verlag mit gewachsenen Systemen und unklaren Entscheidungsgrundlagen. | Klarheit in Redaktion, Technik und Content-Management geschaffen. | Bessere Entscheidungen. Mehr Sichtbarkeit. Ohne den Prozess zu stören. | `/case-studies/walter-de-gruyter` |
| 04 | Initiative Handarbeit | Sichtbarkeit verloren in einem hart umkämpften Markt. | Strategie, Struktur und neue Inhaltstypen gemeinsam mit dem Team entwickelt. | Rankings zurückgewonnen. Neues Wachstum planbar gemacht. | _(kein Link, siehe §4)_ |

---

## 2. Struktur – `Cases.astro`

```astro
---
import Section from "../ui/Section.astro";

const cases = [
  {
    nr: "01",
    name: "Portazon",
    subtitle: "Smart City Super App, Trier",
    ausgangslage: "Eine neue Plattform mit großer Idee – aber ohne Struktur, die sie trägt.",
    massnahme: "Wir haben Content-Architektur, Partnerstrategie und Monitoring aufgebaut.",
    ergebnis: "Portazon ist heute sichtbar – lokal verankert, digital durchdacht.",
    href: "/case-studies/portazon",
  },
  {
    nr: "02",
    name: "Haidacher",
    subtitle: "Tischlerei, Südtirol",
    ausgangslage: "Eine exklusive Handwerkstradition, die online schlicht nicht zu finden war.",
    massnahme: "Sichtbarkeit aufgebaut – ohne das Erscheinungsbild anzutasten.",
    ergebnis: "Erstmals relevante Rankings. Doppelte Sichtbarkeit. Ganz im Stil des Hauses.",
    href: "/case-studies/haidacher",
  },
  {
    nr: "03",
    name: "De Gruyter",
    subtitle: "Wissenschaftsverlag",
    ausgangslage: "Ein traditionsreicher Verlag mit gewachsenen Systemen und unklaren Entscheidungsgrundlagen.",
    massnahme: "Klarheit in Redaktion, Technik und Content-Management geschaffen.",
    ergebnis: "Bessere Entscheidungen. Mehr Sichtbarkeit. Ohne den Prozess zu stören.",
    href: "/case-studies/walter-de-gruyter",
  },
  {
    nr: "04",
    name: "Initiative Handarbeit",
    subtitle: "",
    ausgangslage: "Sichtbarkeit verloren in einem hart umkämpften Markt.",
    massnahme: "Strategie, Struktur und neue Inhaltstypen gemeinsam mit dem Team entwickelt.",
    ergebnis: "Rankings zurückgewonnen. Neues Wachstum planbar gemacht.",
    href: null,
  },
];
---

<Section id="cases">
  <div class="max-w-2xl mb-12">
    <h2 style="font-size: var(--text-section);" class="font-bold text-foreground mb-4">
      Was daraus entsteht.
    </h2>
    <p class="text-muted-foreground" style="font-size: var(--text-body);">
      Unternehmen, die ihre Stärke<br />jetzt auch zeigen können.
    </p>
  </div>

  <div class="divide-y divide-border border-t border-b border-border">
    {cases.map((c) => (
      <div data-animate class="py-12 md:py-16">
        <p class="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-6">
          {c.nr} — {c.name}{c.subtitle && ` · ${c.subtitle}`}
        </p>

        <svg
          viewBox="0 0 600 90"
          class="w-full h-auto mb-8"
          role="img"
          aria-label={`Prozess: ${c.ausgangslage} → ${c.massnahme} → ${c.ergebnis}`}
          data-connection-diagram
        >
          <line data-line x1="20" y1="45" x2="580" y2="45" stroke="hsl(var(--border))" stroke-width="1.5" />
          <circle data-node cx="20" cy="45" r="6" fill="hsl(var(--border))" />
          <circle data-node cx="300" cy="45" r="6" fill="hsl(var(--foreground))" />
          <circle data-node cx="580" cy="45" r="8" fill="hsl(var(--foreground))" />
        </svg>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h3 class="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Ausgangslage</h3>
            <p class="text-foreground" style="font-size: var(--text-body);">{c.ausgangslage}</p>
          </div>
          <div>
            <h3 class="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Was wir taten</h3>
            <p class="text-foreground" style="font-size: var(--text-body);">{c.massnahme}</p>
          </div>
          <div>
            <h3 class="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Jetzt</h3>
            <p class="text-foreground" style="font-size: var(--text-body);">{c.ergebnis}</p>
          </div>
        </div>

        <div class="mt-6">
          {c.href ? (
            <a href={c.href} class="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
              → Zur Case Study
            </a>
          ) : (
            <span aria-disabled="true" class="text-sm font-medium text-muted-foreground">
              → Zur Case Study (in Kürze)
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
</Section>

<script>
  import { initScrollAnimate, initConnectionDiagram } from "../../lib/scrollAnimate";

  const section = document.getElementById("cases");
  if (section) {
    initScrollAnimate(section);
    section
      .querySelectorAll<SVGSVGElement>("svg[data-connection-diagram]")
      .forEach((svg) => initConnectionDiagram(svg));
  }
</script>
```

### Layout
- Editorial-Listen-Layout: `divide-y divide-border border-t border-b border-border`
  (gleiches Pattern wie Leistungen-Sektion), jeder Case ist ein Block mit
  großzügigem vertikalen Abstand (`py-12 md:py-16`)
- Mono-Label "01 — NAME · SUBTITLE" (analog bestehender Mono-Labels,
  z.B. Ergebnisse-Sektion)
- Prozesspfeil-SVG: 1 horizontale Linie (`data-line`) + 3 Knoten
  (`data-node`, Start/Mitte/Ende), Farben über Tokens
  (`hsl(var(--border))`, `hsl(var(--foreground))`)
- 3 Textspalten via `grid-cols-1 md:grid-cols-3` (Mobile gestapelt,
  Desktop nebeneinander), jede Spalte mit Mono-Label
  ("Ausgangslage" / "Was wir taten" / "Jetzt") + Fließtext
- `bg-background` (konsistent mit Sektion 2/3/5)

---

## 3. Animation (Reuse, keine neue Funktion nötig)

- **Case-Blöcke:** `initScrollAnimate(section)` – jeder `[data-animate]`-Block
  faded/slided gestaffelt ein (bestehendes Pattern aus Sektion 2/3/5)
- **Prozesspfeil:** `initConnectionDiagram(svg)` – bereits vorhanden in
  `src/lib/scrollAnimate.ts` (genutzt von `ConnectionDiagram.astro` in
  Sektion 2/3). Zeichnet die Linie via `stroke-dashoffset` und faded die
  3 Knoten gestaffelt ein, beim ersten Eintritt der jeweiligen SVG in den
  Viewport. Respektiert `prefers-reduced-motion`.
- Keine neue Animationsfunktion nötig – beide Funktionen existieren bereits
  und werden lediglich pro Case-SVG erneut aufgerufen.

---

## 4. "Initiative Handarbeit" – Platzhalter-Link

Für Case 4 existiert aktuell keine Detailseite unter `/case-studies/`.
Anstelle eines `<a href="#">` (würde zur Seitenmitte springen – schlecht
für Tastatur-Navigation und A11y) wird ein nicht-klickbares
`<span aria-disabled="true">` mit identischer Typografie und dem Zusatz
"(in Kürze)" gerendert. Optisch bleibt der "→ Zur Case Study"-Stil
erhalten, ohne einen funktionslosen Link anzubieten.

Sobald die Detailseite existiert, wird `href: null` durch
`href: "/case-studies/initiative-handarbeit"` ersetzt – keine weitere
Strukturänderung nötig.

---

## 5. Integration in `index.astro`

Cases wird offizielle Sektion 6 (laut CLAUDE.md-Seitenstruktur), direkt
nach Leistungen eingefügt. Die nachfolgenden Sektions-Kommentare werden
um 1 hochgezählt:

```astro
---
import Cases from "../components/sections/Cases.astro";
// ... bestehende Imports
---
...
<!-- 5. LEISTUNGEN -->
<Leistungen />

<!-- 6. CASES -->
<Cases />

<!-- 7. ERGEBNISSE IN ZAHLEN -->
<Ergebnisse />

<!-- 8. TEAM / FACES -->
<Team />

<!-- 9. FAQ -->
<FAQ />

<!-- 10. AKTUELLES -->
...

<!-- 11. FINALER CTA / CALENDLY -->
<CTACalendly />
```

---

## Datei-Übersicht

| Datei | Status |
|---|---|
| `src/components/sections/Cases.astro` | neu |
| `src/pages/index.astro` | modifiziert (neuer Import, neue Sektion, Renumerierung der Kommentare 6–10 → 7–11) |
| `src/lib/scrollAnimate.ts` | unverändert (Reuse von `initConnectionDiagram`/`initScrollAnimate`) |

---

## Offene Punkte für spätere Phasen (zur Erinnerung, nicht Teil dieser Spec)

- Eigene Unterseite `/case-studies/initiative-handarbeit` (aktuell Platzhalter
  ohne Link)
- Sektion 7 "Haltung + CTA" (nächste Phase nach dieser)
- Sektion 4 "Die Reihenfolge" (Peak-Moment, WebGL) – zuletzt, eigenes
  Brainstorming nötig
