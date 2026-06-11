# Diagramm "Denkweise" + Wort-für-Wort Scroll-Animation – Design Spec

## Kontext

Zwei Verbesserungen für die Sektionen ② "Strukturproblem" und ③ "Denkweise" der DigiPub-Startseite:

1. Das `ConnectionDiagram` in Sektion ③ ist aktuell ein generisches, 5-Knoten-Netzwerk ohne inhaltlichen Bezug zum Text. Es soll die Kernaussage der Sektion ("4 Fragen → Lösungen") visuell abbilden.
2. Die beiden fett gesetzten "Peak"-Statements (Sektion ② und ③) sollen die volle Container-Breite nutzen, größer dargestellt werden und sich beim Scrollen Wort für Wort einfärben – analog zu welance.com.

Beide Statements:

**Sektion ②:**
> Das ist kein Versagen.
> Das ist das, was passiert, wenn ein Unternehmen wächst –
> und die digitale Struktur nicht mitgewachsen ist.

**Sektion ③:**
> Die meisten fangen bei den Maßnahmen an.
> Wir fangen davor an.

Copy bleibt unverändert – nur Layout, Größe und Animation ändern sich.

## Architektur

### 1. `ConnectionDiagram.astro` – Konvergenz-Geometrie

ViewBox bleibt `0 0 400 300`. Neue Geometrie:

```
Kleine Knoten (r=8, fill="hsl(var(--foreground))"):  (60,50), (60,120), (60,190), (60,250)
Großer Knoten (r=16, fill="hsl(var(--foreground))"): (300,150)

4 Linien (stroke="hsl(var(--border))"): jeweils von einem kleinen Knoten zu (300,150)
```

Visualisiert: 4 Fragen (kleine Knoten) laufen zu einer Lösung (großer Knoten) zusammen – passend zu "Erst danach entstehen Lösungen."

**Neues `aria-label`:**
> "Schematische Darstellung von vier Fragen, die in einer gemeinsamen Lösung zusammenlaufen"

**Animation:** Bestehendes Verhalten aus `initConnectionDiagram` (Linien zeichnen sich gestaffelt nach, Knoten faden gestaffelt ein) bleibt erhalten. Zusätzlich: Der große "Lösungs"-Knoten (letzter Knoten im DOM) erhält nach seinem Fade-in einen kurzen Scale-Pulse (CSS-Keyframe-Animation, `transform-box: fill-box`, `transform-origin: center`, z.B. `scale(1) → scale(1.25) → scale(1)` über 0.4s), um den Konvergenzpunkt zu betonen. Bei `prefers-reduced-motion: reduce`: kein Pulse, Knoten direkt in Endgröße sichtbar (bestehendes Verhalten).

### 2. Neues Modul `src/lib/wordReveal.ts`

Neue Dependencies: `gsap` (inkl. `gsap/ScrollTrigger`).

**Funktion `initWordReveal(el: HTMLElement): void`**

1. **Wort-Splitting:** Der Textinhalt von `el` wird zur Laufzeit in `<span class="word">Wort</span>`-Elemente zerlegt. Bestehende `<br />`-Zeilenumbrüche im Markup bleiben erhalten (werden beim Splitting übersprungen, nicht in Wörter zerlegt). Jedes Wort startet mit `opacity: 0.15` (Inline-Style).

2. **`prefers-reduced-motion: reduce`:** Alle `.word`-Spans sofort auf `opacity: 1`, kein Pin, kein ScrollTrigger, kein Observer. Funktion kehrt danach zurück.

3. **Desktop (`window.matchMedia("(min-width: 1024px)")`):**
   - `el` wird in einen Wrapper-Div eingefügt (oder der bestehende Eltern-Container wird dafür genutzt) mit `height: 200vh`
   - `el` selbst erhält `position: sticky; top: 50%; transform: translateY(-50%)` (vertikale Zentrierung während des Pins)
   - `gsap.to(".word", { opacity: 1, stagger: <berechnet>, scrollTrigger: { trigger: <wrapper>, start: "top top", end: "+=100%", scrub: true } })`
   - `stagger` wird so berechnet, dass alle Wörter gleichmäßig über die Pin-Distanz verteilt eingefärbt werden (z.B. `stagger: { each: 1 / wordCount, ease: "none" }` o.ä. – Implementierungsdetail im Plan)

4. **Mobile (`< 1024px`):**
   - Kein Wrapper, kein Pin, kein ScrollTrigger
   - `IntersectionObserver` (analog `initScrollAnimate`, `threshold: 0.2`): beim ersten Eintritt in den Viewport faden alle `.word`-Spans gestaffelt (`staggerMs`-Pattern, ca. 30ms/Wort) von `opacity: 0.15` auf `1`, einmalig, nicht reversibel

5. **Resize:** Kein explizites Handling für Breakpoint-Wechsel zur Laufzeit (Edge Case, vernachlässigbar – Seite wird bei Resize i.d.R. neu geladen oder der Effekt bleibt im initialen Modus)

### 3. Neuer Token `--text-statement` in `global.css`

```css
--text-statement: clamp(1.75rem, 1.1rem + 3.5vw, 3.75rem);
```

Größer als `--text-peak` (`clamp(1.875rem, 1.4rem + 2.38vw, 2.75rem)`), skaliert aber stärker mit der Viewport-Breite – passend für 3-zeiligen Text über die volle Containerbreite (bis 1200px).

### 4. Layout-Änderungen

**`Strukturproblem.astro`:**
- Peak-Statement (`<p data-animate>`) wird aus dem `max-w-2xl`-Block herausgelöst
- Neuer Block direkt danach, **ohne** `max-w-2xl` (volle Container-Breite), `margin-top: var(--peak-space)`
- `<p>` nutzt `--text-statement` statt `--text-peak`, `data-animate` + Inline-Styles (`opacity:0; transform:translateY(30px)`) entfallen – stattdessen `initWordReveal`

**`Denkweise.astro`:**
- Peak-Statement wird aus dem 2-spaltigen Grid (Text + `ConnectionDiagram`) herausgelöst
- Neuer Block **unterhalb** des Grids, volle Container-Breite, `margin-top: var(--peak-space)`
- Gleiche Umstellung auf `--text-statement` + `initWordReveal`

**Beide Sektionen:** Der `<script>`-Block ruft zusätzlich zu `initScrollAnimate` jetzt auch `initWordReveal(statementEl)` für das jeweilige Statement-Element auf.

## Nicht-Ziele

- Sektion ④ "Die Reihenfolge" ist nicht Teil dieses Specs (separates, noch nicht gebautes Vorhaben)
- Keine Copy-Änderungen an den Statements
- Kein Resize-Handling zwischen Mobile/Desktop-Modus zur Laufzeit
- Kein generisches/parametrisierbares `ConnectionDiagram` (wird nur für Denkweise verwendet, Cases.astro hat ein eigenes inline-SVG)

## Self-Review

- **Placeholder-Scan:** Keine TBD/TODO, alle Werte (Koordinaten, Token-Werte, aria-label) konkret angegeben
- **Konsistenz:** `initWordReveal` folgt dem bestehenden Pattern aus `scrollAnimate.ts` (prefers-reduced-motion zuerst, IntersectionObserver für Mobile-Fallback), ergänzt um GSAP für den Desktop-Scrub-Fall
- **Scope:** Fokussiert auf 2 Sektionen + 1 Diagramm-Komponente + 1 neues Lib-Modul + 1 Token; keine weitere Dekomposition nötig
- **Ambiguität:** Stagger-Berechnung für `initWordReveal` ist als "Implementierungsdetail im Plan" markiert – wird in der Implementierungsplanung konkretisiert (z.B. `gsap.utils.distribute` oder manuelle Stagger-Werte basierend auf `wordCount`)
