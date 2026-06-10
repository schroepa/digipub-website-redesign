# Design-Tokens Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the shadcn-style HSL color-token system with full Light/Dark Mode + toggle, a skip-link, and migrate Header, Footer and HeroCanvas to the new tokens — the technical foundation for the upcoming 7-section homepage rebuild.

**Architecture:** All colors move from hardcoded hex/Tailwind-gray classes to semantic CSS custom properties (`--background`, `--foreground`, `--border`, etc.) defined as HSL triples in `src/styles/global.css`, mapped to Tailwind utilities via `@theme inline`. Dark mode is class-based (`.dark` on `<html>`), toggled by a new `ThemeToggle.astro` component and persisted via `localStorage`, with an inline anti-FOUC script in `<head>`. Header, Footer, and HeroCanvas are migrated 1:1 to the new token classes; a new `SkipLink.astro` is added for accessibility.

**Tech Stack:** Astro 5, Tailwind CSS 4 (`@theme inline`, `@custom-variant`), vanilla `<script>` blocks, no new dependencies.

---

## Task 1: Color Tokens, Dark-Mode Variant & Spacing/Typography Tokens

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add HSL color tokens for Light and Dark mode**

Insert the following block immediately after the existing `@theme { ... }` block (after line 8) in `src/styles/global.css`:

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

  --text-hero:    clamp(3rem, 2rem + 5vw, 5rem);
  --text-section: clamp(2.25rem, 1.6rem + 3.25vw, 3.5rem);
  --text-peak:    clamp(1.875rem, 1.4rem + 2.38vw, 2.75rem);
  --text-body:    clamp(1rem, 0.9rem + 0.5vw, 1.125rem);

  --section-gap:   clamp(64px, 5vw + 40px, 128px);
  --container-px:  clamp(16px, 4vw, 40px);
  --container-max: 1200px;
  --peak-space:    80px;
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

- [ ] **Step 2: Add the Tailwind `@theme inline` mapping and dark-mode custom variant**

Insert this block directly after the `.dark { ... }` block added in Step 1:

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

@custom-variant dark (&:where(.dark, .dark *));
```

- [ ] **Step 3: Wire `body` to the new background/foreground tokens**

The current `body` rule (around line 11-16, now shifted down by the inserted blocks) hardcodes `background-color: #f5f5f5; color: #1a1a1a;`. Replace just those two declarations:

```css
body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
```

Leave `h1,h2,h3,h4`, `::selection`, `::-webkit-scrollbar*`, and the `.rich-text*` rules unchanged — they're decorative/out of scope per the spec.

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: Build completes successfully ("X page(s) built"), no CSS errors. The page background will now render near-black (`hsl(0 0% 4%)`) only if `.dark` is on `<html>` — at this point `<html>` has no class yet, so the page should still render light (white background, near-black text), since `:root` provides the light values by default.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "Design-Tokens: HSL Light/Dark Farb-Tokens, Radii, Spacing/Typography-Tokens"
```

---

## Task 2: Anti-FOUC Dark-Mode Script in Layout

**Files:**
- Modify: `src/layouts/Layout.astro:20-33` (the `<head>` block)

- [ ] **Step 1: Add the inline anti-FOUC script as the first child of `<head>`**

In `src/layouts/Layout.astro`, the `<head>` currently starts at line 20:

```astro
  <head>
    <meta charset="UTF-8" />
```

Change it to:

```astro
  <head>
    <script is:inline>
      (function () {
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (stored === "dark" || (!stored && prefersDark)) {
          document.documentElement.classList.add("dark");
        }
      })();
    </script>
    <meta charset="UTF-8" />
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: Build completes successfully, no errors. The inline script appears as the first element inside `<head>` in the generated HTML output (check `dist/index.html`).

Run: `grep -A1 "<head>" dist/index.html | head -5`
Expected: Output shows `<script>` as the first line after `<head>`.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "Layout: Anti-FOUC Inline-Script fuer Dark-Mode-Klasse"
```

---

## Task 3: SkipLink Component

**Files:**
- Create: `src/components/SkipLink.astro`
- Modify: `src/layouts/Layout.astro:34-36` (body start, `<main>` tag)

- [ ] **Step 1: Create `src/components/SkipLink.astro`**

```astro
---
---
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md"
>
  Zum Inhalt springen
</a>
```

- [ ] **Step 2: Import and place `SkipLink` as the first element in `<body>`, add `id="main-content"` to `<main>`**

In `src/layouts/Layout.astro`, add the import alongside the other component imports (after line 4):

```astro
import "../styles/global.css";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import SkipLink from "../components/SkipLink.astro";
```

Then change the body opening (originally lines 34-36):

```astro
  <body>
    <Header />
    <main><slot /></main>
    <Footer />
```

to:

```astro
  <body>
    <SkipLink />
    <Header />
    <main id="main-content"><slot /></main>
    <Footer />
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: Build completes successfully, "X page(s) built", no errors.

Run: `grep -o 'Zum Inhalt springen' dist/index.html`
Expected: Output contains `Zum Inhalt springen` (confirms the skip link rendered).

Run: `grep -o 'id="main-content"' dist/index.html`
Expected: Output contains `id="main-content"`.

- [ ] **Step 4: Commit**

```bash
git add src/components/SkipLink.astro src/layouts/Layout.astro
git commit -m "Skip-Link fuer Tastatur-Navigation hinzufuegen"
```

---

## Task 4: ThemeToggle Component

**Files:**
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Create `src/components/ThemeToggle.astro`**

```astro
---
---
<button
  id="theme-toggle"
  type="button"
  aria-label="Heller/Dunkler Modus"
  class="inline-flex items-center justify-center w-11 h-11 rounded-md text-foreground hover:bg-accent transition-colors"
>
  <svg class="theme-icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
  <svg class="theme-icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
</button>

<style>
  .theme-icon-sun { display: none; }
  .theme-icon-moon { display: block; }
  :global(.dark) .theme-icon-sun { display: block; }
  :global(.dark) .theme-icon-moon { display: none; }
</style>

<script>
  document.querySelectorAll<HTMLButtonElement>("#theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  });
</script>
```

Note: `document.querySelectorAll("#theme-toggle")` is used (instead of `getElementById`) because the component will be rendered twice in `Header.astro` (desktop nav + mobile overlay) — both buttons must toggle the same state and stay in sync since both read the shared `.dark` class on `<html>`.

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: Build completes successfully, no TypeScript/Astro errors (the `<script>` block uses a generic type parameter on `querySelectorAll`, valid in Astro's TS-checked script blocks).

- [ ] **Step 3: Commit**

```bash
git add src/components/ThemeToggle.astro
git commit -m "ThemeToggle-Komponente: Sonne/Mond-Button mit localStorage-Persistenz"
```

---

## Task 5: Header Migration to Tokens + ThemeToggle Integration

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Import `ThemeToggle` in the frontmatter**

Change the frontmatter (lines 1-18) from:

```astro
---
const nav = [
```

to:

```astro
---
import ThemeToggle from "./ThemeToggle.astro";

const nav = [
```

- [ ] **Step 2: Migrate the `<header>` background and the desktop nav classes**

Change line 20:

```astro
<header class="bg-white sticky top-0 z-50">
```

to:

```astro
<header class="bg-background sticky top-0 z-50">
```

Change the desktop nav link classes (lines 34-35):

```astro
            class={`px-4 py-2 text-sm rounded transition-colors flex items-center gap-1
              ${currentPath.startsWith(item.href) ? "text-[#1a1a1a] bg-gray-100 font-medium" : "text-gray-600 hover:text-[#1a1a1a] hover:bg-gray-100"}`}
```

to:

```astro
            class={`px-4 py-2 text-sm rounded transition-colors flex items-center gap-1
              ${currentPath.startsWith(item.href) ? "text-foreground bg-accent font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
```

- [ ] **Step 3: Migrate the dropdown panel and its links**

Change line 46:

```astro
              <div class="bg-white rounded-lg p-1 min-w-[220px] shadow-xl border border-gray-200">
```

to:

```astro
              <div class="bg-popover rounded-lg p-1 min-w-[220px] shadow-xl border border-border">
```

Change the dropdown link classes (lines 50-51):

```astro
                    class={`block px-3 py-2 text-sm rounded transition-colors
                      ${currentPath === child.href ? "text-[#1a1a1a] bg-gray-100 font-medium" : "text-gray-600 hover:text-[#1a1a1a] hover:bg-gray-100"}`}
```

to:

```astro
                    class={`block px-3 py-2 text-sm rounded transition-colors
                      ${currentPath === child.href ? "text-foreground bg-accent font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
```

- [ ] **Step 4: Insert `<ThemeToggle />` between the desktop nav and the Kontakt CTA, migrate the CTA**

Change the Kontakt CTA block (lines 63-70):

```astro
    <!-- Kontakt CTA (Desktop) -->
    <a
      href="/kontakt"
      class="hidden md:inline-flex items-center px-5 py-2 text-sm font-medium text-white rounded hover:opacity-80 transition-opacity"
      style="background:#1a1a1a;"
    >
      Kontakt
    </a>
```

to:

```astro
    <!-- Theme Toggle (Desktop) -->
    <div class="hidden md:block">
      <ThemeToggle />
    </div>

    <!-- Kontakt CTA (Desktop) -->
    <a
      href="/kontakt"
      class="hidden md:inline-flex items-center px-5 py-2 text-sm font-medium bg-foreground text-background rounded hover:opacity-80 transition-opacity"
    >
      Kontakt
    </a>
```

- [ ] **Step 5: Migrate the hamburger button and mobile overlay background/borders**

Change line 73:

```astro
    <button id="mob-btn" class="md:hidden p-2 text-gray-600 relative w-9 h-9 flex items-center justify-center" aria-label="Menü öffnen">
```

to:

```astro
    <button id="mob-btn" class="md:hidden p-2 text-muted-foreground relative w-9 h-9 flex items-center justify-center" aria-label="Menü öffnen">
```

Change the mobile overlay container (line 91):

```astro
  class="md:hidden fixed inset-0 z-40 bg-white flex flex-col px-6 pt-24 pb-12"
```

to:

```astro
  class="md:hidden fixed inset-0 z-40 bg-background flex flex-col px-6 pt-24 pb-12"
```

- [ ] **Step 6: Migrate mobile nav link classes**

Change lines 99-100:

```astro
          class={`block py-3 text-2xl font-semibold border-b border-gray-100 transition-colors
            ${currentPath.startsWith(item.href) ? "text-[#1a1a1a]" : "text-[#1a1a1a] hover:text-gray-600"}`}
```

to:

```astro
          class={`block py-3 text-2xl font-semibold border-b border-border transition-colors
            ${currentPath.startsWith(item.href) ? "text-foreground" : "text-foreground hover:text-muted-foreground"}`}
```

Change lines 109-110:

```astro
                class={`py-1.5 text-sm transition-colors
                  ${currentPath === child.href ? "text-[#1a1a1a] font-medium" : "text-gray-600 hover:text-[#1a1a1a]"}`}
```

to:

```astro
                class={`py-1.5 text-sm transition-colors
                  ${currentPath === child.href ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
```

- [ ] **Step 7: Add `<ThemeToggle />` to the mobile overlay and migrate the mobile Kontakt CTA**

Change the mobile Kontakt CTA block (lines 121-127):

```astro
  <a
    href="/kontakt"
    class="mt-auto block text-center px-5 py-3.5 text-sm font-medium text-white rounded hover:opacity-80 transition-opacity"
    style="background:#1a1a1a;"
  >
    Kontakt
  </a>
</div>
```

to:

```astro
  <div class="mt-auto flex flex-col gap-3">
    <div class="flex justify-center">
      <ThemeToggle />
    </div>
    <a
      href="/kontakt"
      class="block text-center px-5 py-3.5 text-sm font-medium bg-foreground text-background rounded hover:opacity-80 transition-opacity"
    >
      Kontakt
    </a>
  </div>
</div>
```

- [ ] **Step 8: Verify the build**

Run: `npm run build`
Expected: Build completes successfully, no errors.

Run: `grep -c "ThemeToggle" src/components/Header.astro`
Expected: `3` (one import + two usages).

Run: `grep -E "#1a1a1a|bg-white|text-gray-600|bg-gray-100|border-gray-200|border-gray-100" src/components/Header.astro`
Expected: No output (all hardcoded colors replaced).

- [ ] **Step 9: Commit**

```bash
git add src/components/Header.astro
git commit -m "Header: Migration auf Farb-Tokens, ThemeToggle in Desktop- und Mobile-Nav"
```

---

## Task 6: Footer Migration to Tokens + Tagline Update

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Migrate the `<footer>` background**

Change line 14:

```astro
<footer style="background:#1a1a1a;">
```

to:

```astro
<footer class="bg-background border-t border-border">
```

- [ ] **Step 2: Migrate the logo and tagline**

Change lines 19-24:

```astro
      <a href="/">
        <img src="/logo.svg" alt="DigiPub" class="h-6 w-auto brightness-0 invert" loading="lazy" />
      </a>
      <p class="text-white/50 text-sm max-w-sm">
        Sichtbarkeit ist kein Zufall. Wir machen sie zur Strategie.
      </p>
```

to:

```astro
      <a href="/">
        <img src="/logo.svg" alt="DigiPub" class="h-6 w-auto dark:brightness-0 dark:invert" loading="lazy" />
      </a>
      <p class="text-muted-foreground text-sm max-w-sm">
        Mehrwert ist Marke. Lass uns ihn gemeinsam sichtbar machen.
      </p>
```

- [ ] **Step 3: Migrate the "Leistungen" column (lines 31-40)**

Change:

```astro
      <div>
        <p class="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Leistungen</p>
        <ul class="flex flex-col gap-2">
          <li><a href="/leistungen/markenaufbau-branding" class="text-white/60 text-sm hover:text-white transition-colors">Markenaufbau</a></li>
          <li><a href="/leistungen/seo-geo" class="text-white/60 text-sm hover:text-white transition-colors">SEO / GEO</a></li>
          <li><a href="/leistungen/designsystem" class="text-white/60 text-sm hover:text-white transition-colors">Designsystem</a></li>
          <li><a href="/leistungen/automatisierung" class="text-white/60 text-sm hover:text-white transition-colors">Automatisierung</a></li>
          <li><a href="/leistungen/ki-implementierung" class="text-white/60 text-sm hover:text-white transition-colors">KI-Implementierung</a></li>
        </ul>
      </div>
```

to:

```astro
      <div>
        <p class="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Leistungen</p>
        <ul class="flex flex-col gap-2">
          <li><a href="/leistungen/markenaufbau-branding" class="text-muted-foreground text-sm hover:text-foreground transition-colors">Markenaufbau</a></li>
          <li><a href="/leistungen/seo-geo" class="text-muted-foreground text-sm hover:text-foreground transition-colors">SEO / GEO</a></li>
          <li><a href="/leistungen/designsystem" class="text-muted-foreground text-sm hover:text-foreground transition-colors">Designsystem</a></li>
          <li><a href="/leistungen/automatisierung" class="text-muted-foreground text-sm hover:text-foreground transition-colors">Automatisierung</a></li>
          <li><a href="/leistungen/ki-implementierung" class="text-muted-foreground text-sm hover:text-foreground transition-colors">KI-Implementierung</a></li>
        </ul>
      </div>
```

- [ ] **Step 4: Migrate the "Seiten" column (lines 43-52)**

Change:

```astro
      <div>
        <p class="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Seiten</p>
        <ul class="flex flex-col gap-2">
          <li><a href="/" class="text-white/60 text-sm hover:text-white transition-colors">Home</a></li>
          <li><a href="/case-studies" class="text-white/60 text-sm hover:text-white transition-colors">Case Studies</a></li>
          <li><a href="/referenzen" class="text-white/60 text-sm hover:text-white transition-colors">Referenzen</a></li>
          <li><a href="/aktuelles" class="text-white/60 text-sm hover:text-white transition-colors">Aktuelles</a></li>
          <li><a href="/kontakt" class="text-white/60 text-sm hover:text-white transition-colors">Kontakt</a></li>
        </ul>
      </div>
```

to:

```astro
      <div>
        <p class="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Seiten</p>
        <ul class="flex flex-col gap-2">
          <li><a href="/" class="text-muted-foreground text-sm hover:text-foreground transition-colors">Home</a></li>
          <li><a href="/case-studies" class="text-muted-foreground text-sm hover:text-foreground transition-colors">Case Studies</a></li>
          <li><a href="/referenzen" class="text-muted-foreground text-sm hover:text-foreground transition-colors">Referenzen</a></li>
          <li><a href="/aktuelles" class="text-muted-foreground text-sm hover:text-foreground transition-colors">Aktuelles</a></li>
          <li><a href="/kontakt" class="text-muted-foreground text-sm hover:text-foreground transition-colors">Kontakt</a></li>
        </ul>
      </div>
```

- [ ] **Step 5: Migrate the "Kontakt + Social" column (lines 55-72)**

Change:

```astro
      <div>
        <p class="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Kontakt</p>
        <ul class="flex flex-col gap-2 mb-4">
          <li><a href="mailto:kontakt@digipub.de" class="text-white/60 text-sm hover:text-white transition-colors">kontakt@digipub.de</a></li>
        </ul>
        <!-- Social Icons -->
        <div class="flex items-center gap-3">
          <a href="https://www.linkedin.com/company/digipub-de/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="text-white/40 hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a href="https://www.instagram.com/digipub.de/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="text-white/40 hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="https://www.facebook.com/DigiPubSeo" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="text-white/40 hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
        </div>
      </div>
```

to:

```astro
      <div>
        <p class="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Kontakt</p>
        <ul class="flex flex-col gap-2 mb-4">
          <li><a href="mailto:kontakt@digipub.de" class="text-muted-foreground text-sm hover:text-foreground transition-colors">kontakt@digipub.de</a></li>
        </ul>
        <!-- Social Icons -->
        <div class="flex items-center gap-3">
          <a href="https://www.linkedin.com/company/digipub-de/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="text-muted-foreground hover:text-foreground transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a href="https://www.instagram.com/digipub.de/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="text-muted-foreground hover:text-foreground transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="https://www.facebook.com/DigiPubSeo" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="text-muted-foreground hover:text-foreground transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
        </div>
      </div>
```

- [ ] **Step 6: Migrate the "Rechtliches" column (lines 75-81)**

Change:

```astro
      <div>
        <p class="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Rechtliches</p>
        <ul class="flex flex-col gap-2">
          <li><a href="/impressum" class="text-white/60 text-sm hover:text-white transition-colors">Impressum</a></li>
          <li><a href="/datenschutzerklaerung" class="text-white/60 text-sm hover:text-white transition-colors">Datenschutz</a></li>
        </ul>
      </div>
```

to:

```astro
      <div>
        <p class="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Rechtliches</p>
        <ul class="flex flex-col gap-2">
          <li><a href="/impressum" class="text-muted-foreground text-sm hover:text-foreground transition-colors">Impressum</a></li>
          <li><a href="/datenschutzerklaerung" class="text-muted-foreground text-sm hover:text-foreground transition-colors">Datenschutz</a></li>
        </ul>
      </div>
```

- [ ] **Step 7: Migrate the "DigiPub + KI" column (lines 84-101)**

Change:

```astro
      <div>
        <p class="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">DigiPub + KI</p>
        <ul class="flex flex-col gap-3">
          {aiTools.map((tool) => (
            <li>
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors group"
              >
                <span class="text-white/30 group-hover:text-white/60 transition-colors" set:html={tool.icon} />
                {tool.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
```

to:

```astro
      <div>
        <p class="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">DigiPub + KI</p>
        <ul class="flex flex-col gap-3">
          {aiTools.map((tool) => (
            <li>
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors group"
              >
                <span class="text-muted-foreground group-hover:text-foreground transition-colors" set:html={tool.icon} />
                {tool.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
```

- [ ] **Step 8: Migrate the bottom bar (lines 105-109)**

Change:

```astro
    <!-- Bottom Bar -->
    <div class="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <p class="text-xs text-white/30">&copy; {year} DigiPub. Alle Rechte vorbehalten.</p>
      <p class="text-xs text-white/30">Made with &#9825; in Berlin</p>
    </div>
```

to:

```astro
    <!-- Bottom Bar -->
    <div class="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-t border-border">
      <p class="text-xs text-muted-foreground">&copy; {year} DigiPub. Alle Rechte vorbehalten.</p>
      <p class="text-xs text-muted-foreground">Made with &#9825; in Berlin</p>
    </div>
```

(The `border-t border-border` on the bottom bar replaces the visual separation that the previous fixed-dark background gave for free; without it, the bottom bar blends into the columns above on light backgrounds. Adjust the existing `pt-6` spacing is unaffected — `border-t` simply adds a 1px top border before the existing top padding.)

- [ ] **Step 9: Verify the build**

Run: `npm run build`
Expected: Build completes successfully, no errors.

Run: `grep -E "#1a1a1a|text-white|bg-white" src/components/Footer.astro`
Expected: No output (all hardcoded colors replaced).

Run: `grep -o "Mehrwert ist Marke" dist/index.html`
Expected: Output contains `Mehrwert ist Marke` (new tagline rendered).

- [ ] **Step 10: Commit**

```bash
git add src/components/Footer.astro
git commit -m "Footer: vollstaendige Migration auf Farb-Tokens (folgt Light/Dark-Toggle), neue Tagline"
```

---

## Task 7: HeroCanvas Color Migration

**Files:**
- Modify: `src/components/HeroCanvas.astro`

- [ ] **Step 1: Migrate the section background and border**

Change line 7:

```astro
  class="relative bg-white overflow-hidden border-b border-gray-200"
```

to:

```astro
  class="relative bg-background overflow-hidden border-b border-border"
```

- [ ] **Step 2: Migrate the label and subtext muted-text colors**

Change line 26:

```astro
        class="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6 opacity-0"
```

to:

```astro
        class="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 opacity-0"
```

Change line 61:

```astro
        class="text-base text-gray-600 leading-relaxed mb-8 max-w-lg opacity-0"
```

to:

```astro
        class="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg opacity-0"
```

Change line 77:

```astro
        <div class="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
```

to:

```astro
        <div class="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
```

- [ ] **Step 3: Migrate the headline and kinetic-line text colors**

Change line 32:

```astro
      <h1 class="font-bold text-[#1a1a1a] leading-tight tracking-tight mb-3"
```

to:

```astro
      <h1 class="font-bold text-foreground leading-tight tracking-tight mb-3"
```

Change line 49:

```astro
        class="font-bold text-[#1a1a1a] mb-8 opacity-0 whitespace-nowrap"
```

to:

```astro
        class="font-bold text-foreground mb-8 opacity-0 whitespace-nowrap"
```

- [ ] **Step 4: Migrate the inline-style underline and CTA background**

Change line 54:

```astro
          style="border-bottom: 3px solid #1a1a1a; padding-bottom: 3px; display: inline-block;"
```

to:

```astro
          style="border-bottom: 3px solid hsl(var(--foreground)); padding-bottom: 3px; display: inline-block;"
```

Change lines 71-72:

```astro
          class="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-bold rounded-lg hover:opacity-80 transition-opacity mb-4"
          style="background: #1a1a1a;"
```

to:

```astro
          class="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-bold rounded-lg hover:opacity-80 transition-opacity mb-4"
```

(Removing the now-redundant `style="background: #1a1a1a;"` attribute entirely — `bg-foreground` covers it.)

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: Build completes successfully, no errors.

Run: `grep -E "#1a1a1a|bg-white|text-gray-400|text-gray-600|border-gray-200" src/components/HeroCanvas.astro`
Expected: No output (all hardcoded colors replaced). Note: the fBm noise-cloud canvas RGB color arrays (further down in the file, inside the `<script>` block) are intentionally left unchanged per spec — this grep only targets the HTML/Tailwind classes and inline styles checked above, which don't overlap with the canvas script's RGB arrays.

- [ ] **Step 6: Commit**

```bash
git add src/components/HeroCanvas.astro
git commit -m "HeroCanvas: Hintergrund-/Text-/Border-Farben auf Tokens migriert"
```

---

## Task 8: Final Build, Dark-Mode QA, and Visual Check

**Files:**
- None (verification only)

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: Build completes successfully, "X page(s) built" with no errors or warnings about unknown CSS classes.

- [ ] **Step 2: Start the dev server**

Run: `npm run dev` (in background / separate terminal)
Expected: Server starts on `http://localhost:4321` (or reported port).

- [ ] **Step 3: Visual check — Light Mode (default)**

Open `http://localhost:4321/` in a browser.
Expected:
- Page background is white, text is near-black (unchanged from before).
- Header background is white, nav text dark-gray/black, active nav item has light-gray pill background.
- A sun/moon toggle button is visible in the header, to the left of the "Kontakt" button (desktop) — shows the moon icon (since we're in light mode).
- Footer background is white (no longer black), text is gray, links hover to near-black, tagline reads "Mehrwert ist Marke. Lass uns ihn gemeinsam sichtbar machen."
- HeroCanvas section: white background, dark headline text, noise-cloud canvas still renders its colored blobs.

- [ ] **Step 4: Visual check — Dark Mode (toggle)**

Click the theme-toggle button in the header.
Expected:
- `<html>` gains class `dark` (verify via browser devtools).
- Page background turns near-black, all text turns near-white.
- Header background turns near-black, nav text light-gray/white.
- Toggle button now shows the sun icon.
- Footer background turns near-black, matching the page — no longer a visually separate "always dark" block, but seamlessly blended.
- Footer logo (`/logo.svg`) appears inverted (white) via `dark:brightness-0 dark:invert`.
- Reload the page (`Cmd+R`): dark mode persists (no FOUC flash of light mode before switching to dark) — confirms `localStorage` + anti-FOUC script work together.

- [ ] **Step 5: Visual check — Mobile**

Resize the browser to a mobile width (e.g. 375px) or use devtools device toolbar.
Expected:
- Hamburger menu opens a fullscreen overlay using `bg-background` (white in light mode, near-black in dark mode).
- The theme-toggle button appears centered above the "Kontakt" button inside the mobile overlay.
- Tapping it toggles dark mode the same as the desktop toggle (shared `.dark` class on `<html>`).

- [ ] **Step 6: Skip-link check**

With the page loaded and focus on `<body>`, press `Tab` once.
Expected: A "Zum Inhalt springen" link becomes visible (top-left, focus styles `bg-foreground text-background`). Pressing `Enter` moves focus to `<main id="main-content">`.

- [ ] **Step 7: Stop the dev server**

Stop the background dev server process.

- [ ] **Step 8: Final commit (if any QA fixes were needed)**

If Steps 3-6 revealed issues, fix them in the relevant component file(s), re-run Steps 1-6, then commit:

```bash
git add -A
git commit -m "Design-Tokens Foundation: QA-Fixes nach visueller Pruefung"
```

If no fixes were needed, no commit is required for this task.
