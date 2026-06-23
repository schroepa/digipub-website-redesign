# Design: "Die Reihenfolge" – WebGL-Partikelnetzwerk (Sektion 4)

## Kontext

Laut `CLAUDE.md` / `docs/copywriting.md` / `docs/webgl-parallax.md` fehlt auf der Startseite noch Sektion 4 ("Die Reihenfolge") – der geplante PEAK-MOMENT mit einem interaktiven Vier-Stufen-Modell. Dieser Spec ist der erste von mehreren geplanten Three.js-Erweiterungen auf der Startseite (Hero ist bereits umgesetzt: Halbton-Dot-Shader mit Maus-Ripple). Weitere Sections (Strukturproblem, Leistungen, Cases, Haltung) folgen als eigene, separate Specs.

## Inhalt & Copy (bereits final, aus `docs/copywriting.md`)

- Headline: "Die Reihenfolge entscheidet."
- 4 Stufen:
  1. Mehrwert erkennen – Was steckt wirklich dahinter?
  2. Mehrwert ordnen – Wie wird es kommunizierbar?
  3. Mehrwert sichtbar machen – Über welche Kanäle und Systeme?
  4. Mehrwert automatisieren – Was soll dauerhaft und skalierbar laufen?
- Closing Statement: "Andere beginnen bei Schritt drei. Wir beginnen bei Schritt eins."
- Kein CTA nach dieser Sektion (Vorgabe: den Gedanken sacken lassen).

## 1. Struktur & Komponente

- Neue Datei `src/components/sections/Reihenfolge.astro`, eingehängt in `src/pages/index.astro` zwischen `Denkweise` und `LogosBar`.
- Nutzt den vorhandenen `<Section>`-Wrapper (siehe `Denkweise.astro`/`Strukturproblem.astro` als Referenzmuster).
- Aufbau von oben nach unten:
  1. Headline "Die Reihenfolge entscheidet." (volle Breite)
  2. Visuelles Modell: ein durchgehender WebGL-Canvas als Section-Hintergrund, darüber als Overlay die 4 Stufen-Labels (Nummer, Titel, Subtext). **Horizontal angeordnet auf Desktop, vertikal gestapelt auf Mobile** (Pflicht-Regel aus `CLAUDE.md`).
  3. Closing Statement als `data-statement`-Paragraph mit `initWordReveal` (identisches Pattern wie in `Denkweise.astro`/`Strukturproblem.astro`).
  4. Kein CTA-Button.

## 2. Visuelle Mechanik (Partikel-Netzwerk)

- **4 Knoten** in linearer Kette (1→2→3→4) – spiegelt "Reihenfolge" direkter als ein vermaschtes Netz.
- Umgebendes Partikelfeld (~80–150 Partikel, Anzahl nach Performance-Test final festgelegt).
- Fortschritt 0–4 steuert den Zustand:
  - **Stufe 1:** Partikel chaotisch, keine Verbindungen, Knoten 1 erscheint.
  - **Stufe 2:** Partikel beginnen sich auszurichten, Linie 1→2 zeichnet sich, Knoten 2 erscheint.
  - **Stufe 3:** Linie 2→3 zeichnet sich, Knoten 3 erscheint, Glow nimmt zu.
  - **Stufe 4:** Linie 3→4 schließt die Kette, ein sanfter, kontinuierlicher Puls läuft entlang aller Linien (Automatisierungs-Metapher: Loop, kein einmaliges Aufblitzen).
- Trigger: 4 unabhängige `IntersectionObserver`-Ziele (eines je Stufen-Label) setzen den Fortschritt – **kein Pinning/Scroll-Hijacking**, Section scrollt normal vorbei (gleiches Grundprinzip wie der Hero-Shader-Lazy-Mount, nur mit 4 Stufen statt einem einzelnen Ein/Aus).
- **Maus-Reaktivität:** Partikel in Cursor-Nähe richten sich stärker zur nächsten Verbindungslinie aus bzw. rücken zusammen – als Kraft auf Partikelpositionen (nicht nur Farb-/Shape-Verzerrung wie beim Hero-Ripple).
- Farbe über `primary`-Design-Token, Opacity getrennt für Light/Dark einstellbar (gleiches Muster wie `HeroShaderBackground`).

## 3. Technik, Performance & Fallbacks

- **Geometrie:** `THREE.Points` mit `BufferGeometry` für das Partikelfeld (ein Draw-Call) + `LineSegments`-Mesh für die 4 Verbindungslinien. Bewegte Geometrie statt Fragment-Shader-Loop (günstiger als der Hero-Halbton-Ansatz für diesen Anwendungsfall).
- **Lazy Mount:** gleiches Pattern wie `HeroShaderBackground` – `IntersectionObserver` + `requestIdleCallback`, Three.js wird erst nahe Viewport geladen.
- **Scroll-Trigger:** `IntersectionObserver` auf den 4 Stufen-Labels, kein GSAP ScrollTrigger nötig.
- **`prefers-reduced-motion`:** kein Partikel-Loop, kein Maus-Tracking; ein statischer Frame mit dem fertigen, vollständig verbundenen Netzwerk (analog Hero).
- **Kein WebGL / Save-Data:** Canvas wird versteckt; die 4 Stufen-Texte bleiben als normale, lesbare Liste stehen (kein zusätzliches SVG-Fallback nötig, da der Text die Information bereits vollständig trägt).
- **Bundle:** dynamischer `import("three")`, keine zusätzliche Dependency (Three.js ist bereits vorhanden).
- **a11y:** Canvas-Wrapper `aria-hidden="true"` + beschreibendes `aria-label`; Stufen-Texte sind normale, semantische/fokussierbare Elemente – keine Information steckt exklusiv im Canvas.

## Out of Scope (für diesen Spec)

- Die übrigen Sections (Strukturproblem, Leistungen, Cases, Haltung) – folgen als eigene Specs.
- Exaktes Partikel-Count-Tuning, exakte Glow-/Puls-Parameter – werden im Implementierungs-Feinschliff direkt im Code justiert (analog zu den Hero-Shader-Props).
