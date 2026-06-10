# CLAUDE.md – DigiPub Startseite
## Master-Referenz für alle Design-, Copy- und Code-Entscheidungen

> Dieses File ist der Einstiegspunkt für Claude Code.
> Vor jeder Entscheidung: hier nachschlagen, dann die referenzierten Docs öffnen.
> Nichts implementieren das hier oder in den Docs nicht erlaubt ist.

---

## Schnellreferenz

| Was | Wo |
|---|---|
| UX-Prinzipien, Framework-Regeln | `docs/ux-principles.md` |
| Personas + User Stories | `docs/personas.md` |
| Alle Sektions-Copy + Tonalität | `docs/copywriting.md` |
| Directus Content Model | `docs/content-model.md` |
| DE/EN Mehrsprachigkeit | `docs/i18n.md` |
| Lighthouse + A11y + Performance | `docs/performance.md` |
| Design Tokens (nach Figma-Phase) | `docs/design-system.md` |
| Komponenteninventar (wächst) | `docs/components.md` |
| WebGL + Parallax Spec | `docs/webgl-parallax.md` |

---

## Projekt-Kontext

**Was:** Startseite digipub.de – vollständige Neuentwicklung
**Warum:** Aktueller Auftritt widerspricht der Positionierung. Ziel: Vertrauen, nicht Conversion.
**Wer:** Unternehmen jeder Größe und Branche, die offen für eine neue Denkweise sind.
**Gefühl nach dem Besuch:** "Ich vertraue denen, auch wenn ich noch nicht weiß was ich brauche."

---

## Tech Stack

### Frontend
```
Framework:     Astro (aktuellste stable Version)
Styling:       Tailwind CSS + CSS Custom Properties (Tokens)
Components:    shadcn/ui (als Basis, angepasst)
Sprache:       TypeScript (strict mode)
Icons:         Lucide oder Tabler (outline only, nie filled)
Animationen:   GSAP für Scroll-Animationen + Parallax
               Three.js für WebGL-Szenen
```

### Backend / CMS
```
CMS:           Directus (headless)
API:           Directus REST API (kein GraphQL, REST ist ausreichend)
Auth:          Static token für Read-only Zugriff (PUBLIC_DIRECTUS_TOKEN)
Env-Variable:  PUBLIC_DIRECTUS_URL, PUBLIC_DIRECTUS_TOKEN
```

### Deployment
```
Target:        Vercel
Astro-Modus:   SSG mit @astrojs/vercel adapter (statisch, optimal für Performance)
Build:         pnpm build
Preview:       pnpm preview
```

### Wichtige Bibliotheken
```
@astrojs/image       Bildoptimierung
@astrojs/sitemap     Auto-Sitemap für SEO
astro-i18next        Oder natives Astro i18n Routing
three                WebGL-Szenen
gsap                 ScrollTrigger, Parallax
@directus/sdk        Typ-sicherer CMS-Zugriff
```

---

## Seitenstruktur (unveränderlich)

```
① Hero                  – Sofort-Resonanz
② Strukturproblem       – Wiedererkennung ohne Schuldzuweisung
③ Denkweise             – Differenzierung durch Logik, nicht Versprechen
④ Die Reihenfolge       – Methode als visuelles Modell [PEAK-MOMENT]
⑤ Leistungen            – 6 Werkzeuge, keine Pakete
⑥ Cases                 – 4 Cases im Dreiklang
⑦ Haltung + CTA         – "Mehrwert ist Marke" + Calendly [END-MOMENT]
```

Reihenfolge ist nicht verhandelbar.
→ Vollständige Copy: `docs/copywriting.md`
→ UX-Begründung: `docs/ux-principles.md`

---

## Responsiveness – Mobile First

**Pflicht:** Jede Komponente beginnt mit dem Mobile-Layout.
Desktop wird via `md:`, `lg:`, `xl:` Breakpoints ergänzt.

### Breakpoints (Tailwind, angepasst)
```css
sm:   480px   /* Großes Smartphone Landscape */
md:   768px   /* Tablet */
lg:   1024px  /* Desktop */
xl:   1280px  /* Großer Desktop */
2xl:  1536px  /* Wide */
```

### Mobile-First Regeln
- Fluid Typography: `clamp()` für alle Heading-Größen
- Fluid Spacing: `clamp()` für Sektions-Abstände
- Container: max-width 1200px, horizontal padding 16px (mobile) → 40px (desktop)
- Keine fixen Pixel-Werte für Layouts
- Touch-Targets: minimum 44×44px
- WebGL-Szenen: auf Viewportgröße anpassen, auf sehr kleinen Screens deaktivieren

### Desktop darf nicht verlieren
- Typografische Hierarchien müssen auf Desktop ihre volle Wirkung entfalten
- Sektionen wie ④ (Reihenfolge) und ⑦ (Haltung) brauchen Desktop-spezifische
  Weißraum-Behandlung (großzügiger als Mobile)
- Das visuelle Vier-Stufen-Modell: horizontal auf Desktop, vertikal auf Mobile

---

## WebGL – WOW/AHA-Momente

**Zweck:** Das "schwere" Thema (Strukturprobleme, Digitalisierung) spielerisch erlebbar machen.
Zeigen dass DigiPub nicht steif ist – sondern mit Leichtigkeit an Komplexität herangeht.

### Einsatzorte (vorläufig)
```
Hero:          Abstrakte Struktur-Visualisierung (Nodes/Verbindungen)
               die auf Mausbewegung reagiert → zeigt: Zusammenhänge sind gestaltbar
Sektion 4:     Das Vier-Stufen-Modell als interaktive 3D-Grafik
               (Schritte bauen sich beim Scrollen auf)
```

### Harte Regeln für WebGL
```
PERFORMANCE:
- WebGL darf LCP (Largest Contentful Paint) NICHT blockieren
- Lazy load: IntersectionObserver, nur wenn in viewport
- requestIdleCallback für Initialisierung
- Maximale JS-Bundle-Größe für WebGL-Szene: 150kb gzipped
- Kein WebGL im Above-the-fold Bereich ohne preload

FALLBACKS:
- prefers-reduced-motion → statische SVG statt WebGL-Animation
- WebGL nicht verfügbar → CSS-animierte SVG-Fallback
- Langsame Verbindung (Save-Data Header) → kein WebGL

INHALT:
- Abstrakt und strukturell – keine photorealistischen Szenen
- Farbpalette identisch mit Design System Tokens
- Keine Texte innerhalb von WebGL-Szenen (a11y)
- Jede Szene hat ein beschreibendes aria-label
```

---

## Parallax & Scroll-Animationen

**Zweck:** Tiefe und Spielfreude zeigen. Das Layout lebt.
**Werkzeug:** GSAP ScrollTrigger

### Regeln
```
- prefers-reduced-motion: ALLE Animationen deaktivieren, nicht nur verlangsamen
- Parallax nur auf dekorativen Elementen, nie auf Text-Content
- Maximale Parallax-Verschiebung: 30% der Elementhöhe
- Kein Parallax auf Hero-Überschriften (Lesbarkeit)
- Scroll-triggered Animationen: Elemente bauen sich auf (opacity + translateY)
  Standard: { opacity: 0, y: 30 } → { opacity: 1, y: 0, duration: 0.6 }
- Stagger für Listen und Kacheln: 0.1s zwischen Elementen
```

---

## Mehrsprachigkeit (DE / EN)

→ Vollständige Strategie: `docs/i18n.md`

### Kurzregeln
```
- Standardsprache: Deutsch (/de/ oder /)
- Englisch: /en/
- Sprachumschalter: im Header, sichtbar ohne Scrollen
- hreflang Tags: auf jeder Seite für beide Sprachen
- Kanonische URLs: je Sprache eigenständig
- CMS: Directus Translations-Felder für alle Inhalte
- Kein Auto-Redirect nach Browser-Sprache (explizite Nutzerwahl)
```

---

## Accessibility (WCAG 2.1 AA – Pflicht)

**Nicht verhandelbar. Lighthouse Accessibility Score: 100.**

### Kontrast-Mindestanforderungen
```
Normaler Text (< 18px):   Kontrastverhältnis ≥ 4.5:1
Großer Text (≥ 18px):     Kontrastverhältnis ≥ 3:1
UI-Komponenten:           Kontrastverhältnis ≥ 3:1
Dekorative Elemente:      kein Mindest-Kontrast
```

### Weitere Pflichten
```
- Alle Bilder: aussagekräftige alt-Texte (oder alt="" wenn dekorativ)
- WebGL-Szenen: aria-label + role="img"
- Tastatur-Navigation: alle interaktiven Elemente fokussierbar
- Focus-Styles: sichtbar und konsistent (nie outline: none ohne Ersatz)
- Skip-Link: "Zum Inhalt springen" als erstes Element
- Sprachattribut: <html lang="de"> bzw. <html lang="en">
- Überschriftenhierarchie: h1 → h2 → h3 (keine Ebene überspringen)
- Buttons vs. Links: Buttons für Aktionen, Links für Navigation
- Formulare (Calendly): korrekte Labels, Fehlermeldungen auf Deutsch
```

---

## Performance – Lighthouse Score 100 (alle Kategorien)

→ Vollständige Regeln: `docs/performance.md`

### Core Web Vitals Targets (Pflicht)
```
LCP (Largest Contentful Paint):   < 1.5s
FID / INP (Interaction):          < 100ms
CLS (Cumulative Layout Shift):    < 0.05
FCP (First Contentful Paint):     < 1.0s
TTI (Time to Interactive):        < 2.0s
Speed Index:                      < 1.5s
```

### Wichtigste Regeln
```
- Keine render-blockierenden Ressourcen (CSS inline, JS defer/async)
- Bilder: WebP/AVIF, width+height immer gesetzt, lazy loading ab fold 2
- Above-the-fold Bild (falls vorhanden): preload
- Schriften: font-display: swap, preconnect für Fontquellen
- Kein Layout Shift: Bildgrößen reservieren, Webfonts ohne FOUT
- Drittanbieter (Calendly): nur per Click laden (nicht im initial load)
- WebGL: code-split, dynamisch importiert
- Tailwind: purge konfiguriert, kein ungenutztes CSS
```

---

## DSGVO & Integrationen

### Cookie Consent
```
- Tool: Cookiebot (bereits bei anderen DigiPub-Projekten im Einsatz)
- Calendly: erst nach Cookie-Zustimmung laden (Functional Cookies)
- Analytics: erst nach Cookie-Zustimmung laden
- WebGL/GSAP: keine Tracking-Relevanz, kein Consent nötig
```

### Analytics
```
- Tool: PostHog EU Cloud (Frankfurt) – DSGVO-konform, cookieless möglich
- EU-Region in PostHog-Account wählen (wichtig beim Setup)
- Kein Google Analytics: mehrere EU-DPAs haben GA als DSGVO-widrig eingestuft
```

### Calendly-Integration
```
- Einbindung: als Popup (nicht als eingebettetes Widget im Initial Load)
- Auslöser: Klick auf "Gespräch anfangen"
- Lazy load: Calendly-Script erst bei Klick laden
- Kein automatisches Öffnen, kein Exit-Intent
```

### SEO
```
- Sitemap: auto-generiert via @astrojs/sitemap
- Robots.txt: alle Seiten indexierbar
- Open Graph: pro Seite und Sprache
- Structured Data: Organization schema auf Startseite
- hreflang: DE/EN korrekt verknüpft
- Canonical: je Sprachversion eigenständig
```

---

## Code-Qualität & Konventionen

### TypeScript
```typescript
// Strict mode immer an
// Keine any-Types
// Directus-Typen aus dem SDK generieren
// Props immer explizit typisiert
```

### Dateistruktur Komponenten
```
src/components/
  sections/          ← Eine Datei pro Sektion (Hero.astro, Problem.astro etc.)
  ui/                ← Wiederverwendbare UI-Elemente (Button, Card, Badge etc.)
  webgl/             ← Alle Three.js Szenen als isolierte Komponenten
  layout/            ← Header, Footer, LanguageToggle
```

### Naming Conventions
```
Komponenten:     PascalCase  (HeroSection.astro)
CSS-Klassen:     kebab-case via Tailwind
TS-Variablen:    camelCase
Konstanten:      SCREAMING_SNAKE_CASE
Directus-Felder: snake_case (Directus-Standard)
i18n-Schlüssel:  dot.notation (sections.hero.headline)
```

### Komponenten-Regeln
```
- Jede Sektion ist eine eigene .astro Komponente
- Keine Inline-Styles (alles via Tailwind oder CSS Custom Properties)
- Keine magischen Zahlen – alles referenziert Design-Tokens
- Kein direkter DOM-Zugriff in Astro-Komponenten (nur in <script>-Blöcken)
- Props immer mit Defaults
```

---

## Offene Entscheidungen (müssen vor Build-Start geklärt werden)

```

    → SSG bevorzugt für Performance. SSR nötig wenn Directus-Preview gewünscht.


[ ] Design System Tokens: Farben und Typografie
    → Blockiert design-system.md und tokens.css
    → Aus Figma exportieren sobald vorhanden

[ ] Directus-Instanz URL + Auth
    → PUBLIC_DIRECTUS_URL für .env.example

[ ] WebGL-Szenen konkret
    → docs/webgl-parallax.md sobald erste Figma-Screens vorliegen
```
