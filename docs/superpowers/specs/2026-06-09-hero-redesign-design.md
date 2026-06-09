# Hero Redesign – Design Spec
**Datum:** 2026-06-09
**Seite:** `/` (Startseite)
**Datei:** `src/pages/index.astro`

---

## Ziel

Den Hero-Bereich der Startseite so überarbeiten, dass Erstbesucher in unter 3 Sekunden verstehen was DigiPub macht, sich angesprochen fühlen und einen klaren nächsten Schritt vor sich haben. Persönlichkeit und Unverwechselbarkeit sind explizite Designziele — kein generisches Agentur-Template.

---

## Entschiedene Designparameter

### Grundstimmung
**Dynamisch & Zukunftsorientiert** — Energie, Aufbruch, Direktheit. Wir gestalten die digitale Zukunft mit dem Besucher zusammen.

### Layout
- Linksbündig, max-w-2xl für Textblock
- Viel freier Raum rechts — dort leben die Noise Clouds
- Kein zentriertes Layout (zu generisch)
- Kein Split-Layout (bricht mit bestehendem Seitendesign)

### Inhalt (von oben nach unten)
1. **Label:** `Digitalagentur · Marke · KI · Automatisierung` — 11px, uppercase, letter-spacing, gray-400
2. **Headline:** `Sichtbarkeit ist kein Zufall.` (Zeile 1) + `Wir machen sie zur Strategie.` (Zeile 2) — text-5xl md:text-6xl, font-weight 800, #1a1a1a
3. **Kinetisches Wort:** Eine zusätzliche Zeile `Wir machen dich [WORT]` mit rotierendem Wort — alternativ integriert in Zeile 2 (zu entscheiden bei Implementierung)
4. **Subtext:** `Wir verbinden Markenaufbau, KI-Implementierung und Automatisierung – damit dein Unternehmen nicht nur sichtbar wird, sondern wirkt.` — text-base, gray-600, max-w-lg
5. **CTA:** `Los geht's →` — Background #1a1a1a, text weiß, padding 12px 24px, border-radius 8px, font-weight 700
6. **Trust-Elemente:** `✓ Kostenlose Erstberatung` und `✓ Kein Bullshit` — 12px, gray-400, nebeneinander

---

## Hintergrundeffekt: Soft Pastel Noise Clouds

### Technologie
- **Canvas 2D** mit fraktaler Brownian Motion (fBm) — kein WebGL nötig, läuft auf allen Geräten
- **5 Noise-Oktaven** via Simplex Noise 2D — erzeugt organische Wolkentextur mit interner Helligkeitsvariation
- **3 Wolken-Schichten**, jede unabhängig animiert

### Farbpalette
| Wolke | Farbe | RGB | Opacity |
|---|---|---|---|
| 1 (oben rechts) | Soft Blau | `200, 210, 255` | 1.1 |
| 2 (unten rechts) | Mint/Grün | `185, 245, 220` | 0.9 |
| 3 (Mitte) | Soft Lila | `235, 215, 255` | 0.8 |

### Wolken-Parameter
- **Hintergrund:** `#ffffff`
- **Blur:** 12–16px (Canvas-Filter) für weiche Kanten
- **Falloff:** Radiale Abdunklung vom Zentrum nach außen — keine harten Kanten
- **Morphing:** Kontinuierlich via Noise-Zeit-Offset, `t += 0.003` pro Frame
- **Position:** Wolken befinden sich rechts (cx: 0.55–0.85) um den Textbereich nicht zu überlagern

### Parallax (Mausbewegung)
- Jede Wolke reagiert auf `mousemove` mit unterschiedlichem Faktor (px: 0.06–0.10, py: 0.04–0.07)
- Smooth via linearer Interpolation: `mx += (targetMx - mx) * 0.04` pro Frame
- Auf Touch-Geräten (mobile): kein Parallax, Wolken driften nur

### Performance
- Pixelberechnung in 2x2-Blöcken (Schachbrettmuster) — halbiert Rechenaufwand, visuell nicht sichtbar
- Offscreen-Canvas für Blur-Rendering
- `requestAnimationFrame` — pausiert bei Tab-Wechsel automatisch
- Canvas-Größe: 1x devicePixelRatio (kein Upscaling nötig bei Blur-Effekten)

---

## Kinetic Typography

### Zwei-Phasen-Animation

**Phase 1 — Page Load (einmalig):**
Scramble/Decode-Effekt auf dem rotierenden Wort. Buchstaben durchlaufen zufällige Sonderzeichen (`!@#$%^&*`) bevor sich das erste Wort "entschlüsselt". Dauer: ~800ms. Wirkt wie ein Terminal-Decode.

**Phase 2 — Cycling (laufend):**
Blur Morph zwischen den Wörtern. Altes Wort blur → neue aus Blur. Transition-Dauer: 400ms. Interval: 2500ms.

### Wort-Sequenz
`sichtbar` → `relevant` → `messbar` → `wirksam` → `unverwechselbar` → (loop)

### Integration in Headline
Die Kinetic-Zeile ist eine eigenständige dritte Zeile unterhalb der zweigeteilten Headline:
```
Sichtbarkeit ist kein Zufall.
Wir machen sie zur Strategie.
Wir machen dich [WORT].          ← kinetisch
```
Alternativ: Das rotierende Wort ist direkt in Zeile 2 integriert. Finale Entscheidung bei Implementierung nach visuellem Test.

### Einlauf-Animation (Page Load)
Alle Hero-Elemente laufen gestaffelt ein:
- Label: fade in, delay 0ms
- Headline Zeile 1: fade + slide up, delay 100ms
- Headline Zeile 2: fade + slide up, delay 200ms
- Kinetische Zeile: fade + slide up, delay 300ms → startet sofort Scramble
- Subtext: fade, delay 450ms
- CTA + Trust: fade, delay 600ms

---

## Komponenten-Architektur

### Neue Datei: `src/components/HeroCanvas.astro`
Enthält Canvas-Element + das gesamte JavaScript für:
- fBm Noise Cloud Renderer
- Parallax Mouse Handler
- Kinetic Typography (Scramble + BlurMorph)
- Einlauf-Animation

### Änderung: `src/pages/index.astro`
- Bestehende Hero-Section ersetzen
- `<HeroCanvas />` einbinden
- Neue Texte und Struktur

### Kein React nötig
Rein vanilla JavaScript im `<script>`-Tag der Astro-Komponente. Kein Client-Side-Framework — besser für Performance und Astro's Static Build.

---

## Mobile

- Canvas läuft auf Mobile ohne Parallax (nur Morphing)
- Wolken-Opacity auf Mobile leicht reduziert (×0.7) um Performance zu schonen
- Headline-Größe: text-4xl auf Mobile
- Trust-Elemente: untereinander statt nebeneinander
- Canvas-Höhe auf Mobile: 100% des Viewport-Heights minus Navbar

---

## Was diesen Hero von anderen unterscheidet

1. **Noise Clouds statt CSS-Blur-Orbs** — organisch, morphend, keine perfekten Kreise
2. **Zwei-Phasen Kinetic Typography** — Scramble beim Load, dann Blur Morph
3. **Parallax mit fBm** — reagiert auf Maus, fühlt sich lebendig an
4. **"Kein Bullshit" als Trust-Element** — ehrlich und differenzierend
5. **Starke, provokante Headline** — keine Agentur-Floskeln
