# Design-Tokens Foundation – Design Spec

> Phase 1 von "Startseite Rebuild nach neuer CLAUDE.md / copywriting.md".
> Ziel: Technisches Fundament (Farb-Tokens, Dark Mode, Skip-Link, Header/Footer)
> auf das die neuen 7 Homepage-Sektionen (Phase 2+) aufbauen.

---

## Scope

**In Scope:**
- Vollständiges Light/Dark Color-Token-System (HSL CSS Custom Properties, shadcn-kompatibel) gemäß `docs/design-system.md`
- Klassenbasierter Dark Mode (`.dark` auf `<html>`) inkl. Theme-Toggle im Header, persistiert in `localStorage`, FOUC-frei
- Weitere Design-Tokens als CSS Custom Properties: Border-Radii, Fluid-Typography (`--text-hero`, `--text-section`, `--text-peak`, `--text-body`), Spacing (`--section-gap`, `--container-px`, `--container-max`, `--peak-space`)
- Skip-Link ("Zum Inhalt springen") als erstes Body-Element
- Header: Migration auf neue Tokens (`bg-background`, `text-foreground`, `border-border`, CTA-Button)
- Footer: vollständige Migration auf neue Tokens (folgt Light/Dark-Toggle), Tonalitäts-Update der Tagline auf "Du"
- HeroCanvas: Hintergrund/Text-/Border-Farben auf Tokens umstellen (Copy/Inhalt bleibt unverändert, das ist Phase 2)

**Out of Scope (spätere Phasen):**
- Inhaltliche Neufassung der 7 Homepage-Sektionen (Hero-Copy, Strukturproblem, Denkweise, Reihenfolge, Leistungen, Cases, Haltung+CTA)
- Entfernen von LogosBar, Leistungen3, Ergebnisse, Team, FAQ aus `index.astro` (Dateien bleiben erhalten, werden aber erst entfernt wenn die jeweilige neue Sektion sie ersetzt)
- WebGL-Canvas-Farbverläufe (dekorative fBm-Cloud-Blobs) – bleiben unverändert, da dekorativ und nicht Teil der Tonalität/Kontrast-Anforderungen
- Andere Seiten (`/leistungen/*`, `/case-studies/*`, `/referenzen`, `/aktuelles/*`, `/kontakt`) – nutzen die neuen Tokens automatisch dort, wo sie Header/Footer/global.css verwenden, werden aber nicht aktiv nachmigriert

---

## 1. Color Tokens (`src/styles/global.css`)

HSL-Tripel-Variablen unter `:root` und `.dark`, exakt aus `docs/design-system.md` übernommen:

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

### Tailwind-Mapping (Tailwind 4 `@theme inline`)

```css
@theme inline {
  --color-background:           hsl(var(--background));
  --color-foreground:           hsl(var(--foreground));
  --color-card:                 hsl(var(--card));
  --color-card-foreground:      hsl(var(--card-foreground));
  --color-popover:              hsl(var(--popover));
  --color-popover-foreground:   hsl(var(--popover-foreground));
  --color-primary:              hsl(var(--primary));
  --color-primary-foreground:   hsl(var(--primary-foreground));
  --color-secondary:            hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted:                hsl(var(--muted));
  --color-muted-foreground:     hsl(var(--muted-foreground));
  --color-accent:               hsl(var(--accent));
  --color-accent-foreground:    hsl(var(--accent-foreground));
  --color-border:               hsl(var(--border));
  --color-input:                hsl(var(--input));
  --color-ring:                 hsl(var(--ring));
  --color-destructive:          hsl(var(--destructive));
  --color-success:              hsl(var(--success));
  --color-warning:              hsl(var(--warning));
  --color-info:                 hsl(var(--info));

  --radius-xs:  2px;
  --radius-sm:  6px;
  --radius-md:  8px;
  --radius-lg:  10px;
  --radius-xl:  14px;
  --radius-2xl: 18px;
}
```

Damit stehen `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `rounded-lg` (10px) usw. als Utilities zur Verfügung.

### Dark-Mode-Variant

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Erlaubt `dark:bg-background` etc. – Tailwind generiert die Variante anhand der `.dark`-Klasse statt `prefers-color-scheme`.

---

## 2. Dark-Mode-Mechanik & Toggle

### Anti-FOUC Inline-Script

Im `<head>` von `Layout.astro`, **vor** dem Stylesheet-Link, als blockierendes Inline-Script:

```html
<script is:inline>
  (function () {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  })();
</script>
```

### `ThemeToggle.astro`

Neue Komponente in `src/components/`. Button mit Sonne/Mond-Icon (Tabler/Lucide-Stil, `outline`, passend zu bestehenden Header-Icons), `aria-label="Theme wechseln"`, 44×44px Touch-Target.

```astro
<button id="theme-toggle" aria-label="Heller/Dunkler Modus" class="...">
  <svg class="sun-icon" ...>...</svg>
  <svg class="moon-icon" ...>...</svg>
</button>

<script>
  const btn = document.getElementById("theme-toggle");
  btn?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
</script>
```

Icon-Sichtbarkeit (Sonne im Dark Mode zeigen, Mond im Light Mode) per CSS: `.dark .sun-icon { display: block }` / `.sun-icon { display: none }` usw. (kein Layout Shift, kein FOUC).

**Platzierung:** Im Header, rechts neben der Desktop-Nav, vor dem Kontakt-CTA. In der Mobile-Overlay-Nav unterhalb der Nav-Links.

---

## 3. Weitere Tokens (Spacing & Fluid Typography)

In `global.css`, als `:root`-Variablen (noch ungenutzt bis Phase 2, aber bereits verfügbar):

```css
:root {
  --text-hero:    clamp(3rem,    2rem + 5vw,     5rem);
  --text-section: clamp(2.25rem, 1.6rem + 3.25vw, 3.5rem);
  --text-peak:    clamp(1.875rem, 1.4rem + 2.38vw, 2.75rem);
  --text-body:    clamp(1rem,    0.9rem + 0.5vw,  1.125rem);

  --section-gap:   clamp(64px, 5vw + 40px, 128px);
  --container-px:  clamp(16px, 4vw, 40px);
  --container-max: 1200px;
  --peak-space:    80px;
}
```

---

## 4. Skip-Link

Neue `SkipLink.astro`:

```astro
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md"
>
  Zum Inhalt springen
</a>
```

In `Layout.astro`: als erstes Element im `<body>`, vor `<Header />`. `<main>` bekommt `id="main-content"`.

---

## 5. Header-Migration

Ersetzungen in `Header.astro` (1:1 Token-Mapping, keine Layout-Änderungen):

| Alt | Neu |
|---|---|
| `bg-white` (header) | `bg-background` |
| `text-[#1a1a1a]` | `text-foreground` |
| `text-gray-600` | `text-muted-foreground` |
| `bg-gray-100` (aktiver Nav-Item) | `bg-accent` |
| `border-gray-200` (Dropdown) | `border-border` |
| `style="background:#1a1a1a"` (Kontakt-CTA) | `bg-foreground text-background` |
| Mobile-Overlay `bg-white` | `bg-background` |
| Mobile-Overlay `border-gray-100` | `border-border` |

ThemeToggle wird zwischen Desktop-Nav und Kontakt-CTA eingefügt; in der Mobile-Overlay unterhalb der Nav-Links, oberhalb des Kontakt-Buttons.

---

## 6. Footer-Migration

Footer folgt jetzt vollständig dem Light/Dark-Toggle (vorher fest `#1a1a1a`):

| Alt | Neu |
|---|---|
| `style="background:#1a1a1a"` | `bg-background` (mit `border-t border-border`, da im Light Mode sonst kein Übergang zur Seite sichtbar ist) |
| `text-white/50`, `text-white/40`, `text-white/30`, `text-white/60` | `text-muted-foreground` (alle Abstufungen vereinheitlicht – das Token-System kennt keine gestaffelten Opazitäten) |
| `hover:text-white` | `hover:text-foreground` |
| Logo `class="h-6 w-auto brightness-0 invert"` (für weißes Logo auf Dunkel) | `class="h-6 w-auto dark:brightness-0 dark:invert"` (im Light Mode unverändertes Logo, im Dark Mode invertiert) |

### Tonalität – neue Tagline

Alt: *"Sichtbarkeit ist kein Zufall. Wir machen sie zur Strategie."*

Neu (passend zu `copywriting.md` Sektion 7 "Mehrwert ist Marke"):
> "Mehrwert ist Marke. Lass uns ihn gemeinsam sichtbar machen."

(Footer-Prompt-Text für KI-Tools bleibt unverändert – ist funktional, kein Marketing-Copy.)

---

## 7. HeroCanvas-Migration (nur Farben, kein Copy)

| Alt | Neu |
|---|---|
| `bg-white` (Section) | `bg-background` |
| `border-gray-200` | `border-border` |
| `text-[#1a1a1a]` (H1, H2) | `text-foreground` |
| `border-bottom: 3px solid #1a1a1a` (Unterstreichung) | `border-bottom: 3px solid hsl(var(--foreground))` |
| `style="background: #1a1a1a"` (Button/Akzent-Element) | `style="background: hsl(var(--foreground))"` |

Die fBm-Noise-Cloud-Canvas (Zeilen ~138–173) und ihre RGB-Farbverläufe bleiben unverändert – dekoratives Element, nicht Teil der Tonalitäts-/Kontrastanforderungen.

---

## Offene Punkte für Phase 2 (zur Erinnerung, nicht Teil dieser Spec)

- Hero-Copy ("Dein Unternehmen ist gut...")
- Sektionen 2–7 laut `copywriting.md`
- Entfernen der alten Sektionen aus `index.astro`
- Strukturdiagramme/Visuals statt Fotos
