# Design: Kinetic-Statement-Effekt (Ersatz für Wort-Opacity-Scrub)

## Kontext

Die drei Abgrenzungssätze der Startseite (`data-statement` in `Strukturproblem.astro`, `Denkweise.astro`, `Reihenfolge.astro`) nutzen aktuell `lib/wordReveal.ts`: ein Wort-für-Wort-Opacity-Scrub via GSAP-ScrollTrigger-Pin (Desktop) bzw. gestaffeltes Opacity-Fade-in (Mobile). Dieses Muster ("Wörter färben sich beim Scrollen ein") ist inzwischen sehr verbreitet und soll durch einen eigenständigeren Kinetic-Text-Effekt ersetzt werden: **Variable-Weight Reveal + Magnetic Hover**, validiert per interaktivem Live-Mockup im Brainstorming (Browser-Companion, Option A von drei vorgestellten Richtungen).

Betroffen sind ausschließlich die drei genannten `data-statement`-Instanzen — nicht die Haltung-Headline „Mehrwert ist Marke." (bleibt unverändert als normales Fade-in) und keine anderen Texte der Seite.

## 1. Architektur

`src/lib/wordReveal.ts` wird ersatzlos gelöscht und durch `src/lib/kineticStatement.ts` ersetzt (Export: `initKineticStatement(el: HTMLElement)`), da `wordReveal.ts` ausschließlich von diesen drei Stellen importiert wird.

Der Textinhalt von `el` wird zweistufig zerlegt: pro Wort ein `<span class="kw-word">`, darin pro Buchstabe ein `<span class="kw-letter">`. Vorhandene `<br />`-Zeilenumbrüche bleiben unverändert erhalten (gleiche Logik wie im bisherigen `wrapWords`).

- **Desktop (`min-width: 1024px`):** Bestehende GSAP-ScrollTrigger-Pin-Mechanik (200vh-Wrapper, `scrub: true`) bleibt strukturell erhalten. Statt `opacity` wird pro Wort ein Fortschrittswert 0→1 gestaffelt animiert, der directly im `onUpdate`-Callback auf `wordEl.style.fontVariationSettings` (`'wght' ${200 + p*700}`) und `wordEl.style.filter` (`blur(${(1-p)*6}px)`) gemappt wird.
- **Magnetic Hover (Desktop, zusätzliche unabhängige Ebene):** Ein `mousemove`-Listener auf dem Statement-Wrapper berechnet für jeden `.kw-letter` die Distanz zum Cursor. Buchstaben innerhalb eines Einflussradius (~140px) verschieben sich leicht vom Cursor weg (`translate`) und erhalten zusätzliches Schriftgewicht (additiv zum Scroll-Fortschritt, hart gekappt bei `wght 900`). Bei `mouseleave` federn alle Buchstaben über eine CSS-Transition (`transform`, `font-variation-settings`, jeweils ~0.3–0.4s ease-out) zurück in ihren scroll-bestimmten Zustand.
- **Mobile (`< 1024px`):** Kein Pinning, kein Hover (keine Maus). Stattdessen ein einmaliges, wortweise gestaffeltes Reveal via `IntersectionObserver` (Trigger beim ersten Eintritt in den Viewport, analog zum bisherigen `initMobileStagger`), das jedes Wort von `wght 200` + `blur(6px)` zu `wght 900` + `blur(0)` animiert (CSS-Transition statt GSAP, kein Scroll-Bezug nötig).
- **`prefers-reduced-motion: reduce`:** Alle Wörter sofort `wght 900`, `blur(0)`, kein Pin, kein `IntersectionObserver`, kein `mousemove`-Listener wird registriert.

## 2. Layout & Größe

Auf Desktop bricht der Statement-Block aus dem `<Section>`-Container aus: volle Bildschirmbreite, zentrierter Text, via Breakout-Utility-Klasse `.kinetic-breakout` in `global.css`:

```css
.kinetic-breakout {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  text-align: center;
}
```

Neuer fluider Typografie-Token `--text-kinetic` in `global.css` (neben den bestehenden `--text-*`-Tokens), deutlich größer als `--text-statement`:

```css
--text-kinetic: clamp(2.5rem, 1.2rem + 6.5vw, 6.5rem);
```

Auf Mobile (`< 1024px`) **kein** Breakout — der Satz bleibt im normalen Container bei der bisherigen `--text-statement`-Größe, da auf schmalen Viewports kein sinnvoller Breakout-Effekt entsteht und Magnetic-Hover ohnehin irrelevant ist (Touch). Die Breakout-Klasse und `--text-kinetic` werden daher nur ab `lg:` (Tailwind `lg:` bzw. äquivalentes CSS) angewendet; darunter gilt die bisherige `max-w-3xl` + `--text-statement`-Behandlung unverändert.

## 3. Interaktion im Detail

- Zeilenumbrüche (`<br />`) werden wie bisher beim Aufbrechen in Wort-Spans erhalten.
- Wort-Granularität für den Scroll-Fortschritt (matcht bestehendes Stagger-Verhalten), Buchstaben-Granularität ausschließlich für den Magnetic-Hover-Effekt.
- Magnetic-Hover-Radius, maximale Verschiebung und Gewichts-Boost sind als benannte Konstanten im Modul definiert (keine Magic Numbers im Code verstreut), grob an die Live-Demo-Werte angelehnt (Einflussradius ~140px, max. Verschiebung ~35% der Distanz, Gewichts-Boost bis max. `wght 900`).
- Kein neuer Dependency-Bedarf: GSAP/ScrollTrigger ist bereits Projekt-Dependency und wird wie im bisherigen `wordReveal.ts` dynamisch importiert (`await import("gsap")`).

## 4. Dateien & Migration

- **Löschen:** `src/lib/wordReveal.ts`
- **Neu:** `src/lib/kineticStatement.ts`
- **Ändern:** `src/styles/global.css` — `--text-kinetic`-Token, `.kinetic-breakout`-Utility, Basis-Styles für `.kw-word`/`.kw-letter` (`display: inline-block`, initiale `font-variation-settings`/`filter`, Transition-Definitionen für den Hover-Rückfederungs-Fall)
- **Ändern:** `Strukturproblem.astro`, `Denkweise.astro`, `Reihenfolge.astro` — jeweiliger `data-statement`-Block bekommt die Breakout-Wrapper-Struktur (nur ab `lg:`) und größere Typografie; Script-Import wechselt von `initWordReveal` auf `initKineticStatement`.

## Out of Scope

- Die Haltung-Headline „Mehrwert ist Marke." (bleibt normales Fade-in, kein Kinetic-Effekt).
- Live-Reaktion auf Breakpoint-Wechsel durch Fenster-Resize (wird einmalig bei Initialisierung per `matchMedia` bestimmt, kein Resize-Listener — konsistent mit dem bisherigen `wordReveal.ts`-Verhalten und anderen Stellen im Projekt, z. B. Hero).
- Automatisierte Tests (kein Test-Framework im Projekt; Verifikation erfolgt manuell im Dev-Server, wie im Rest dieses Projekts üblich).
