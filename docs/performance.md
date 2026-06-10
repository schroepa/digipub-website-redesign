# Performance & Accessibility
## Lighthouse 100 – Nicht verhandelbar

---

## Ziel-Scores (alle Kategorien)

```
Performance:     100
Accessibility:   100
Best Practices:  100
SEO:             100
```

Jeder Deploy wird gegen diese Scores geprüft.
Ein Score < 100 ist ein Build-Fehler.

---

## Core Web Vitals – Konkrete Targets

| Metrik | Ziel | Kritisch ab |
|---|---|---|
| LCP (Largest Contentful Paint) | < 1.5s | > 2.5s |
| INP (Interaction to Next Paint) | < 100ms | > 200ms |
| CLS (Cumulative Layout Shift) | < 0.05 | > 0.1 |
| FCP (First Contentful Paint) | < 1.0s | > 1.8s |
| TTI (Time to Interactive) | < 2.0s | > 3.8s |
| Speed Index | < 1.5s | > 3.4s |
| TBT (Total Blocking Time) | < 50ms | > 200ms |

---

## Performance-Regeln nach Kategorie

### JavaScript
```
- Kein JavaScript im Critical Path das LCP blockiert
- WebGL: dynamisch importiert, code-split, lazy via IntersectionObserver
- GSAP: nur laden wenn Animationen im Viewport sind (plugin lazy-load)
- Calendly: Script-Tag erst bei Klick auf CTA injizieren
- Bundle-Limits:
    Gesamt JS (initial): < 100kb gzipped
    WebGL-Chunk:         < 150kb gzipped
    GSAP-Chunk:          < 30kb gzipped
```

### CSS
```
- Tailwind: purge vollständig konfiguriert (kein ungenutztes CSS)
- Critical CSS: Above-the-fold Styles inline im <head>
- Kein @import in CSS-Dateien (blockiert Rendering)
- font-display: swap für alle Custom Fonts
- Kein ungenutztes CSS > 5kb
```

### Bilder
```
- Format: WebP primär, AVIF als moderne Alternative, JPEG/PNG als Fallback
- Astro <Image>: IMMER verwenden, nie natives <img> ohne Optimierung
- width + height: immer angeben (verhindert CLS)
- loading="lazy": ab fold 2 (alles unterhalb Hero)
- loading="eager" + fetchpriority="high": nur für Hero-Bild falls vorhanden
- sizes-Attribut: responsive Größen immer angeben
- Alt-Texte: aussagekräftig oder alt="" wenn rein dekorativ
```

### Fonts
```
- Preconnect für Fontquellen: <link rel="preconnect" href="...">
- Preload für kritische Font-Weights: <link rel="preload" as="font">
- font-display: swap (kein unsichtbarer Text während Ladephase)
- Maximal 2 Schriftfamilien (Display + Text)
- Maximal 3 Weights pro Familie
- Variable Fonts bevorzugen wenn verfügbar (1 Request statt 3)
```

### Drittanbieter
```
- Cookiebot:  im <head>, aber async
- Calendly:   NICHT im Initial Load. Script on-demand injizieren:
              document.getElementById('calendly-btn').addEventListener('click', () => {
                const s = document.createElement('script')
                s.src = 'https://assets.calendly.com/assets/external/widget.js'
                document.head.appendChild(s)
                // dann Popup öffnen
              })
- Analytics:  nach Cookie-Consent, async
- Kein Google Fonts direkt (Datenschutz + Performance) → self-hosted
```

### HTML
```
- Meta viewport: <meta name="viewport" content="width=device-width, initial-scale=1">
- Charset: <meta charset="UTF-8"> als erstes im <head>
- Title: max. 60 Zeichen, aussagekräftig je Seite
- Meta Description: 120–160 Zeichen
- Open Graph: og:title, og:description, og:image, og:url immer vollständig
- Structured Data: Organization auf Startseite (JSON-LD im <head>)
```

---

## Accessibility – WCAG 2.1 AA (Pflicht)

### Kontrast-Mindestanforderungen
```
Normaler Text (< 18px regular, < 14px bold):  ≥ 4.5:1
Großer Text (≥ 18px regular, ≥ 14px bold):   ≥ 3:1
UI-Komponenten + grafische Objekte:           ≥ 3:1
Dekorative Elemente:                          kein Mindest-Kontrast
```

**Tool:** https://webaim.org/resources/contrastchecker/
**Automatisiert:** axe DevTools oder Lighthouse Accessibility Audit

### Tastatur-Navigation
```
- Alle interaktiven Elemente: per Tab erreichbar
- Logische Tab-Reihenfolge (DOM-Reihenfolge = visuelle Reihenfolge)
- Focus-Styles: immer sichtbar, nie outline: none ohne Ersatz
  Standard: focus-visible:ring-2 focus-visible:ring-offset-2
- Skip-Link: "Zum Inhalt springen" als erstes DOM-Element
  <a href="#main-content" class="sr-only focus:not-sr-only">Zum Inhalt springen</a>
- Escape-Key: schließt alle Modals/Popups/Overlays
```

### ARIA & Semantik
```
- Überschriftenhierarchie: h1 → h2 → h3 (keine Ebene überspringen)
  h1: Seitenname/-kontext (nur einmal pro Seite)
  h2: Sektionsüberschriften
  h3: Unterabschnitte innerhalb Sektionen
- Bilder: alt="" wenn dekorativ, beschreibend wenn inhaltlich
- WebGL-Szenen: role="img" aria-label="[Beschreibung der Szene]"
- Icons ohne Text: aria-label auf dem Container-Element
- Icons neben Text: aria-hidden="true" auf dem Icon
- Buttons: für Aktionen. Links: für Navigation.
  Niemals <div onClick> statt <button>
- Formulare: jedes Input hat ein zugehöriges <label>
```

### Sprache & Internationalisierung
```
- <html lang="de"> (DE) bzw. <html lang="en"> (EN)
- Sprachwechsel-Button: aria-label="Sprache wechseln / Switch language"
- Fremdsprachige Textpassagen: lang-Attribut auf dem Element
```

### Reduzierte Bewegung
```css
@media (prefers-reduced-motion: reduce) {
  /* ALLE Animationen deaktivieren */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* WebGL-Szenen: statisches Fallback-Bild einblenden */
  .webgl-scene { display: none; }
  .webgl-fallback { display: block; }
}
```

---

## Automated Testing

```
# Vor jedem Commit (lokal)
pnpm lighthouse:check    # Lighthouse CI gegen localhost
pnpm a11y:check          # axe-core Accessibility Scan

# CI/CD (vor Deployment)
- Lighthouse CI: alle 4 Scores müssen 100 sein
- Build schlägt fehl wenn Score < 100
```

---

## Checkliste vor Deployment

```
[ ] Lighthouse Performance:    100
[ ] Lighthouse Accessibility:  100
[ ] Lighthouse Best Practices: 100
[ ] Lighthouse SEO:            100
[ ] LCP < 1.5s
[ ] CLS < 0.05
[ ] Kein Layout Shift durch Fonts (font-display: swap gesetzt)
[ ] Alle Bilder: width + height gesetzt
[ ] Alle Bilder: alt-Texte vorhanden
[ ] Alle WebGL-Szenen: aria-label gesetzt + Fallback vorhanden
[ ] prefers-reduced-motion: getestet (alle Animationen off)
[ ] Tastatur-Navigation: alle Elemente erreichbar
[ ] Focus-Styles: auf allen Elementen sichtbar
[ ] Skip-Link: funktioniert
[ ] hreflang: DE und EN korrekt verlinkt
[ ] Canonical URLs: je Sprachversion gesetzt
[ ] Cookiebot: Calendly + Analytics erst nach Consent
[ ] Calendly: on-demand geladen, nicht im Initial Load
[ ] Mobile: auf iPhone SE (375px) getestet
[ ] Mobile: Touch-Targets ≥ 44×44px
```
