# Design System
## Vollständig aus Figma extrahiert – DigiPub Design System

> Quelle: https://www.figma.com/design/dJRNwI1eXiTGKNj7gRCNQy/DigiPub-Design-System
> Alle Werte direkt via Figma MCP ausgelesen. Verbindlich – keine Abweichungen im Code.
> Letzte Aktualisierung: aus `🚀 Themes` Collection (vollständig aufgelöst)

---

## Fonts

| Token | Wert |
|---|---|
| `font-sans` | `Geist` |
| `font-mono` | `Geist Mono` |

```css
font-family: 'Geist', system-ui, sans-serif;
font-family: 'Geist Mono', monospace;
```

Self-hosted empfohlen (DSGVO + Performance).
Download: https://vercel.com/font

---

## Farbarchitektur – 3 Ebenen

```
💨 Tailwind   Primitive Palette (slate, gray, neutral, blue, ...)
🚀 Themes     Aufgelöste Semantic Tokens (light + dark Varianten)
☀️ Mode       Mode-Switcher (referenziert Themes)
```

**Regel:** Im Code immer `hsl(var(--token))` verwenden – niemals Hex-Werte hardcoden.

---

## Semantic Tokens – Light / Dark (vollständig aufgelöst)

### Basis

| Token | Light | Dark |
|---|---|---|
| `background` | `#ffffff` | `#0a0a0a` |
| `foreground` | `#0a0a0a` | `#fafafa` |
| `card` | `#ffffff` | `#171717` |
| `card-foreground` | `#0a0a0a` | `#fafafa` |
| `popover` | `#ffffff` | `#171717` |
| `popover-foreground` | `#0a0a0a` | `#fafafa` |

### Interaktiv

| Token | Light | Dark |
|---|---|---|
| `primary` | `#2563eb` | `#e5e5e5` |
| `primary-foreground` | `#ffffff` | `#1e40af` |
| `secondary` | `#f5f5f5` | `#262626` |
| `secondary-foreground` | `#171717` | `#fafafa` |
| `accent` | `#f5f5f5` | `#262626` |
| `accent-foreground` | `#171717` | `#fafafa` |
| `muted` | `#f5f5f5` | `#262626` |
| `muted-foreground` | `#737373` | `#a3a3a3` |

### Rahmen & Eingabe

| Token | Light | Dark |
|---|---|---|
| `border` | `#e5e5e5` | `rgba(255,255,255,0.1)` |
| `input` | `#e5e5e5` | `rgba(255,255,255,0.15)` |
| `ring` | `#a3a3a3` | `#737373` |

### Status

| Token | Light | Dark |
|---|---|---|
| `destructive` | `#dc2626` | `#f87171` |
| `success` | `#16a34a` | `#16a34a` |
| `warning` | `#d97706` | `#d97706` |
| `info` | `#0284c7` | `#0284c7` |

### Sidebar

| Token | Light | Dark |
|---|---|---|
| `sidebar` | `#fafafa` | `#171717` |
| `sidebar-foreground` | `#0a0a0a` | `#fafafa` |
| `sidebar-primary` | `#171717` | `#1d4ed8` |
| `sidebar-border` | `#e5e5e5` | `rgba(255,255,255,0.1)` |
| `sidebar-ring` | `#a3a3a3` | `#737373` |

---

## CSS Custom Properties (shadcn/ui kompatibel, HSL)

```css
:root {
  --background:           0 0% 100%;
  --foreground:           0 0% 4%;
  --card:                 0 0% 100%;
  --card-foreground:      0 0% 4%;
  --popover:              0 0% 100%;
  --popover-foreground:   0 0% 4%;
  --primary:              217 91% 60%;
  --primary-foreground:   0 0% 100%;
  --secondary:            0 0% 96%;
  --secondary-foreground: 0 0% 9%;
  --muted:                0 0% 96%;
  --muted-foreground:     0 0% 45%;
  --accent:               0 0% 96%;
  --accent-foreground:    0 0% 9%;
  --border:               0 0% 90%;
  --input:                0 0% 90%;
  --ring:                 0 0% 64%;
  --destructive:          0 72% 51%;
  --success:              142 72% 29%;
  --warning:              38 92% 50%;
  --info:                 199 89% 40%;
}

.dark {
  --background:           0 0% 4%;
  --foreground:           0 0% 98%;
  --card:                 0 0% 9%;
  --card-foreground:      0 0% 98%;
  --popover:              0 0% 9%;
  --popover-foreground:   0 0% 98%;
  --primary:              0 0% 90%;
  --primary-foreground:   221 74% 41%;
  --secondary:            0 0% 15%;
  --secondary-foreground: 0 0% 98%;
  --muted:                0 0% 15%;
  --muted-foreground:     0 0% 64%;
  --accent:               0 0% 15%;
  --accent-foreground:    0 0% 98%;
  --border:               0 0% 100% / 0.10;
  --input:                0 0% 100% / 0.15;
  --ring:                 0 0% 45%;
  --destructive:          0 91% 71%;
  --success:              142 72% 29%;
  --warning:              38 92% 50%;
  --info:                 199 89% 40%;
}
```

---

## Border Radii (aus Figma)

| Token (Figma) | Wert | CSS Var | Tailwind-Klasse |
|---|---|---|---|
| `border radius/none` | `0` | `--radius-none` | `rounded-none` |
| `border radius/xs` | `2px` | `--radius-xs` | `rounded-xs` |
| `border radius/sm` | `6px` | `--radius-sm` | `rounded-sm` |
| `border radius/md` | `8px` | `--radius-md` | `rounded-md` |
| `border radius/lg` | `10px` | `--radius-lg` | `rounded-lg` |
| `border radius/xl` | `14px` | `--radius-xl` | `rounded-xl` |
| `border radius/2xl` | `18px` | `--radius-2xl` | `rounded-2xl` |
| `border radius/rounded` | `9999px` | `--radius-full` | `rounded-full` |

**Anwendungsregeln:**
- Leistungs-/Case-Kacheln: `rounded-lg` (10px)
- Buttons: `rounded-md` (8px)
- Inputs: `rounded-md` (8px)
- Badges/Tags: `rounded-sm` (6px) oder `rounded-full`
- Modals/Overlays: `rounded-xl` (14px)

---

## Typografische Skala (aus Figma Themes Collection)

| Token (Figma) | Größe | Verwendung |
|---|---|---|
| `typography/h1` | `36px` | Seltenes Display-Heading |
| `typography/h2` | `30px` | Sektions-Headlines |
| `typography/h3` | `24px` | Unter-Headlines |
| `typography/h4` | `20px` | Kachel-Headlines |
| `typography/Lead` | `20px` | Intro-Texte |
| `typography/Large` | `18px` | Sublines |
| `typography/Paragraph` | `16px` | Standard Body |
| `typography/List` | `16px` | Listen |
| `typography/Blockquote` | `16px` | Zitate |
| `typography/Small` | `14px` | Hilfstexte, Captions |
| `typography/Muted` | `14px` | Dezenter Text |
| `typography/Inline code` | `14px` | Code |

**Fluid-Overrides für die Startseite** (via `clamp()`, überschreiben Figma-Festwerte auf Desktop):

```css
--text-hero:    clamp(3rem,   2rem + 5vw,    5rem);      /* Hero-Headline */
--text-section: clamp(2.25rem,1.6rem + 3.25vw,3.5rem);   /* Sektions-h2  */
--text-peak:    clamp(1.875rem,1.4rem + 2.38vw,2.75rem); /* Peak-Satz    */
--text-body:    clamp(1rem,   0.9rem + 0.5vw, 1.125rem); /* Body         */
```

---

## Schatten-System (aus Figma)

Das Design System definiert ein vollständiges Tailwind-ähnliches Shadow-System:

| Größe | Layer | Y | Blur | Spread | Farbe |
|---|---|---|---|---|---|
| `2xs` | 1 | 1 | 0 | 0 | black/0.05 |
| `xs` | 1 | 1 | 2 | 0 | black/0.05 |
| `sm` | 1+2 | 1/1 | 3/2 | 0/-1 | black/0.1 |
| `md` | 1+2 | 4/2 | 6/4 | -1/-2 | black/0.1 |
| `lg` | 1+2 | 10/4 | 15/6 | -3/-4 | black/0.1 |
| `xl` | 1+2 | 20/8 | 25/10 | -5/-6 | black/0.1 |
| `2xl` | 1 | 25 | 50 | -12 | black/0.25 |

Anwendungsregel: Keine dekorativen Schatten auf der Startseite.
Schatten nur für: fokussierte Elemente, schwebende Tooltips, Calendly-Popup.

---

## Spacing (Tailwind 4px-Raster, aus Figma bestätigt)

Vollständige Skala von 0px bis 384px (Tailwind-Standard).
Zusätzliche Startseiten-Tokens:

```css
--section-gap:   clamp(64px, 5vw + 40px, 128px);
--container-px:  clamp(16px, 4vw, 40px);
--container-max: 1200px;
--peak-space:    80px;  /* Weißraum um "Andere beginnen bei Schritt 3" */
```

---

## Tailwind Config (komplett)

```js
// tailwind.config.mjs
export default {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      borderRadius: {
        none: '0',
        xs:   '2px',
        sm:   '6px',
        md:   '8px',
        lg:   '10px',
        xl:   '14px',
        '2xl':'18px',
        full: '9999px',
      },
      colors: {
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        destructive: { DEFAULT: 'hsl(var(--destructive))' },
        success:     { DEFAULT: 'hsl(var(--success))' },
        warning:     { DEFAULT: 'hsl(var(--warning))' },
        info:        { DEFAULT: 'hsl(var(--info))' },
      },
    },
  },
}
```
