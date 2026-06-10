# Strukturproblem & Denkweise (Sektionen 2+3) – Design Spec

> Phase 2 von "Startseite Rebuild nach neuer CLAUDE.md / copywriting.md".
> Baut auf der Design-Tokens Foundation (Phase 1, abgeschlossen) auf:
> nutzt erstmals `--section-gap`, `--container-px`, `--container-max`,
> `--text-section`, `--text-body`, `--text-peak`, `--peak-space`.

---

## Scope

**In Scope:**
- Neue gemeinsame Layout-Komponente `Section.astro` (Wrapper für alle künftigen Homepage-Sektionen)
- Neue Sektion 2 "Strukturproblem" als `Strukturproblem.astro`
- Neue Sektion 3 "Denkweise" als `Denkweise.astro`
- Platzhalter-Verbindungsdiagramm als eigenständige, austauschbare Komponente `ConnectionDiagram.astro` (echtes SVG, keine Bilddatei)
- Einbindung beider neuen Sektionen in `index.astro`, direkt nach `<HeroCanvas />` und vor `<LogosBar />`
- Scroll-Trigger-Animation (Fade + TranslateY, gestaffelt) für Listenzeilen, Schlusspunkt/Abgrenzungssatz und Diagramm-Elemente

**Out of Scope:**
- Entfernen oder Ändern von `LogosBar`, `Leistungen3`, `Ergebnisse`, `Team`, `FAQ`, `CTACalendly` (folgt in späteren Phasen)
- Eine "finale" WebGL/Three.js-Version des Verbindungsdiagramms (das ist Sektion 4 / Peak-Moment, separates Thema)
- Inhaltliche Änderungen an Hero-Copy
- GSAP-Integration (wird erst eingeführt, wenn ein Anwendungsfall die Komplexität rechtfertigt; für diese Sektionen reicht `IntersectionObserver` + CSS-Transitions)

---

## 1. `Section.astro` – Gemeinsamer Layout-Wrapper

Neue Komponente: `src/components/ui/Section.astro`

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

- `id` ist Pflicht-Prop (für Anker-Navigation/Tests)
- `class` optional, wird an `<section>` durchgereicht (z. B. für `border-b border-border`)
- Erste Verwendung der bisher ungenutzten Spacing-Tokens `--section-gap`, `--container-px`, `--container-max`
- Alle künftigen neuen Sektionen (Phase 3+) sollen diesen Wrapper ebenfalls nutzen

---

## 2. Sektion 2 – `Strukturproblem.astro`

Neue Komponente: `src/components/sections/Strukturproblem.astro`

### Inhalt (wörtlich aus `docs/copywriting.md`)

- Headline: "Warum gute Unternehmen / digital unsichtbar bleiben."
- Einleitungssatz: "Es sind fast immer dieselben Muster:"
- 5 fließende Absatzzeilen (keine Bullet-Liste):
  1. "Inhalte, die über Jahre gewachsen sind – ohne roten Faden."
  2. "Zielgruppen, die nicht klar voneinander getrennt adressiert werden."
  3. "Navigationen, die die interne Struktur spiegeln, nicht die Fragen der Besucher."
  4. "Prozesse, die nicht sauber ineinandergreifen."
  5. "Ein Mehrwert, der intern selbstverständlich ist – aber nach außen einfach nicht ankommt."
- Schlusspunkt (3 Zeilen, als ein Absatz mit `<br />`):
  "Das ist kein Versagen. / Das ist das, was passiert, wenn ein Unternehmen wächst – / und die digitale Struktur nicht mitgewachsen ist."

### Struktur

```astro
---
import Section from "../ui/Section.astro";
---
<Section id="strukturproblem">
  <div class="max-w-2xl">
    <h2 style="font-size: var(--text-section);" class="font-bold text-foreground mb-8">
      Warum gute Unternehmen<br />digital unsichtbar bleiben.
    </h2>

    <p class="text-muted-foreground mb-6" style="font-size: var(--text-body);">
      Es sind fast immer dieselben Muster:
    </p>

    <div class="space-y-4 text-foreground" style="font-size: var(--text-body); line-height: 1.7;">
      <p data-animate>Inhalte, die über Jahre gewachsen sind – ohne roten Faden.</p>
      <p data-animate>Zielgruppen, die nicht klar voneinander getrennt adressiert werden.</p>
      <p data-animate>Navigationen, die die interne Struktur spiegeln, nicht die Fragen der Besucher.</p>
      <p data-animate>Prozesse, die nicht sauber ineinandergreifen.</p>
      <p data-animate>Ein Mehrwert, der intern selbstverständlich ist – aber nach außen einfach nicht ankommt.</p>
    </div>

    <div style="margin-top: var(--peak-space);">
      <p class="font-bold text-foreground" style="font-size: var(--text-peak); line-height: 1.3;" data-animate>
        Das ist kein Versagen.<br />
        Das ist das, was passiert, wenn ein Unternehmen wächst –<br />
        und die digitale Struktur nicht mitgewachsen ist.
      </p>
    </div>
  </div>
</Section>
```

### Layout

- Schmale Spalte (`max-w-2xl`), linksbündig im Section-Container (kein zusätzliches Grid)
- `bg-background` (wie Sektion 3 – per Q4b "Beide bg-background")
- Headline nutzt `--text-section`, Schlusspunkt nutzt `--text-peak` mit `--peak-space` Abstand nach oben

---

## 3. Sektion 3 – `Denkweise.astro` + `ConnectionDiagram.astro`

Neue Komponente: `src/components/sections/Denkweise.astro`
Neue Komponente: `src/components/diagrams/ConnectionDiagram.astro`

### Inhalt (wörtlich aus `docs/copywriting.md`)

- Headline: "Wir beginnen nicht mit Maßnahmen. / Wir beginnen mit dem Verstehen."
- 5 fließende Absatzzeilen:
  1. "Bevor irgendwas gebaut, geschrieben oder automatisiert wird, stellen wir dieselben Fragen:"
  2. "Was leistet dein Unternehmen wirklich?"
  3. "Wen willst du erreichen – und mit welchem Mehrwert?"
  4. "Was existiert bereits, was fehlt, was bremst?"
  5. "Erst danach entstehen Lösungen."
- Abgrenzungssatz (2 Zeilen, fett, als ein Absatz mit `<br />`):
  "Die meisten fangen bei den Maßnahmen an. / Wir fangen davor an."

### Struktur

```astro
---
import Section from "../ui/Section.astro";
import ConnectionDiagram from "../diagrams/ConnectionDiagram.astro";
---
<Section id="denkweise">
  <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
    <div class="max-w-2xl">
      <h2 style="font-size: var(--text-section);" class="font-bold text-foreground mb-8">
        Wir beginnen nicht mit Maßnahmen.<br />Wir beginnen mit dem Verstehen.
      </h2>

      <div class="space-y-4 text-foreground" style="font-size: var(--text-body); line-height: 1.7;">
        <p data-animate>Bevor irgendwas gebaut, geschrieben oder automatisiert wird, stellen wir dieselben Fragen:</p>
        <p data-animate>Was leistet dein Unternehmen wirklich?</p>
        <p data-animate>Wen willst du erreichen – und mit welchem Mehrwert?</p>
        <p data-animate>Was existiert bereits, was fehlt, was bremst?</p>
        <p data-animate>Erst danach entstehen Lösungen.</p>
      </div>

      <div style="margin-top: var(--peak-space);">
        <p class="font-bold text-foreground" style="font-size: var(--text-peak); line-height: 1.3;" data-animate>
          Die meisten fangen bei den Maßnahmen an.<br />
          Wir fangen davor an.
        </p>
      </div>
    </div>

    <ConnectionDiagram />
  </div>
</Section>
```

### Layout

- 2-spaltig auf `lg:` (Text links, Diagramm rechts, vertikal zentriert), gestapelt auf Mobile (Text zuerst, Diagramm darunter)
- `bg-background`

### `ConnectionDiagram.astro`

- Eigenständige, austauschbare Komponente (spätere, aufwendigere Versionen ersetzen sie 1:1, ohne `Denkweise.astro` anzufassen)
- Inline-SVG: 5 Knoten (Kreise) in lockerem Cluster, verbunden durch Linien zwischen benachbarten Knoten
- Farben über Tokens: Knoten `fill="hsl(var(--foreground))"`, Verbindungslinien `stroke="hsl(var(--border))"`
- Abmessungen: `viewBox="0 0 400 300"`, responsive `w-full h-64 lg:h-full`
- A11y: `role="img"` + `aria-label="Schematische Darstellung verbundener Punkte, die ein Netzwerk aus Fragen symbolisieren"`
- Animation: Linien zeichnen sich beim Scroll-in-View per `stroke-dasharray`/`stroke-dashoffset`-Transition, Knoten faden gestaffelt ein (0.1s Stagger)
- `prefers-reduced-motion: reduce`: Diagramm wird sofort vollständig sichtbar dargestellt (keine Zeichen-Animation, kein JS-Trigger nötig)

---

## 4. Scroll-Animation (beide Sektionen)

Gemeinsames Pattern, per `<script>`-Block in `Strukturproblem.astro`, `Denkweise.astro` und `ConnectionDiagram.astro`:

- Alle Elemente mit `data-animate` starten mit `opacity: 0; transform: translateY(30px);`
- `IntersectionObserver` (root: viewport, threshold z. B. 0.2) beobachtet die Section
- Beim ersten Eintritt in den Viewport: Elemente erhalten gestaffelt (0.1s Abstand) `opacity: 1; transform: translateY(0)` via CSS-Transition (`opacity 0.6s ease, transform 0.6s ease`), analog zu `animateIn()` in `HeroCanvas.astro`
- `prefers-reduced-motion: reduce`: Observer wird übersprungen, alle `data-animate`-Elemente sind sofort sichtbar (kein `opacity: 0` initial)
- Animation läuft nur einmal (Observer wird nach Trigger `unobserve()`t)

---

## 5. Integration in `index.astro`

```astro
---
import Strukturproblem from "../components/sections/Strukturproblem.astro";
import Denkweise from "../components/sections/Denkweise.astro";
// ... bestehende Imports bleiben
---
...
<HeroCanvas />
<Strukturproblem />
<Denkweise />
<LogosBar />
...
```

---

## Datei-Übersicht

| Datei | Status |
|---|---|
| `src/components/ui/Section.astro` | neu |
| `src/components/sections/Strukturproblem.astro` | neu |
| `src/components/sections/Denkweise.astro` | neu |
| `src/components/diagrams/ConnectionDiagram.astro` | neu |
| `src/pages/index.astro` | modifiziert (2 Imports + 2 Zeilen Markup) |

---

## Offene Punkte für spätere Phasen (zur Erinnerung, nicht Teil dieser Spec)

- Sektion 4 "Die Reihenfolge" (Peak-Moment, WebGL-Diagramm) – braucht eigenes Brainstorming
- Migration von `Leistungen3`, `Ergebnisse`, `Team`, `FAQ` auf Tokens/neue Copy
- Eventuelle spätere GSAP-ScrollTrigger-Migration der hier eingeführten IntersectionObserver-Animationen, falls Komplexität steigt
