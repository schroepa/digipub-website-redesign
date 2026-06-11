# Sektion 7 "Haltung + CTA" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `Haltung.astro` section (Sektion 7, "Mehrwert ist Marke" + Calendly, END-MOMENT) and wire it into `index.astro` as the new final section, removing the now out-of-scope Ergebnisse/Team/FAQ/Aktuelles/CTACalendly sections (and their now-dead `getPosts`/`fallbackPosts`/`posts` code) so the homepage matches the 7-section structure required by `CLAUDE.md`.

**Architecture:** New `src/components/sections/Haltung.astro` reuses the existing `Section.astro` wrapper and `initScrollAnimate` (same pattern as `Cases.astro`), renders headline + body + a bottom CTA bar with two buttons (Calendly popup via lazy-loaded script, and a `mailto:` link). `index.astro` gets a new import + `<Haltung />` placement as Sektion 7, and the old Sektion 7-11 (Ergebnisse/Team/FAQ/Aktuelles/CTACalendly) imports, code, and markup are removed. The component files `Ergebnisse.astro`, `Team.astro`, `FAQ.astro`, `CTACalendly.astro` remain in the repo (unused) for potential future reuse.

**Tech Stack:** Astro 5, TypeScript strict, Tailwind CSS 4 (CSS custom property tokens from `src/styles/global.css`), existing `src/lib/scrollAnimate.ts` helper (`initScrollAnimate`).

---

## Task 1: Create `src/components/sections/Haltung.astro`

**Files:**
- Create: `src/components/sections/Haltung.astro`

This is the new Sektion 7 component: headline + two body paragraphs ("Mehrwert ist Marke." + supporting text), and a bottom CTA bar with a CTA statement on the left and two buttons on the right (primary "Gespräch anfangen →" opens a lazy-loaded Calendly popup, secondary "E-Mail schreiben" is a `mailto:` link).

- [ ] **Step 1: Create the file**

```astro
---
import Section from "../ui/Section.astro";
---

<Section id="haltung">
  <div data-animate style="opacity: 0; transform: translateY(30px);">
    <div class="max-w-2xl mb-12">
      <h2 style="font-size: var(--text-section);" class="font-bold text-foreground mb-4">
        Mehrwert ist Marke.
      </h2>
      <p class="text-muted-foreground mb-4" style="font-size: var(--text-body);">
        Nicht Design macht Marke. Nicht Werbung macht Marke.
        Marke entsteht, wenn ein Unternehmen seinen echten Mehrwert
        sichtbar, verständlich und nutzbar macht.
      </p>
      <p class="text-muted-foreground" style="font-size: var(--text-body);">
        Das ist es, wofür wir arbeiten.
        Mit jedem, der offen ist, diesen Weg zu gehen.
      </p>
    </div>

    <div class="border-t border-border pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <p class="text-muted-foreground max-w-md" style="font-size: var(--text-body);">
        Dein Unternehmen hat diesen Mehrwert. Lass uns gemeinsam
        herausfinden, wie wir ihn sichtbar machen.
      </p>
      <div class="flex flex-wrap gap-3">
        <button
          id="haltung-calendly-btn"
          type="button"
          class="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-semibold rounded-lg hover:opacity-80 transition-opacity"
        >
          Gespräch anfangen →
        </button>
        <a
          href="mailto:kontakt@digipub.de"
          class="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground text-sm font-semibold rounded-lg hover:opacity-70 transition-opacity"
        >
          E-Mail schreiben
        </a>
      </div>
    </div>
  </div>
</Section>

<script>
  import { initScrollAnimate } from "../../lib/scrollAnimate";

  const section = document.getElementById("haltung");
  if (section) {
    initScrollAnimate(section);
  }

  const CALENDLY_URL = "https://calendly.com/nigronet";

  function openCalendly() {
    window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
  }

  function loadCalendlyAndOpen() {
    if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="calendly.com/assets/external/widget.js"]'
    );

    if (existingScript) {
      if (window.Calendly) {
        openCalendly();
      } else {
        existingScript.addEventListener("load", openCalendly, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.addEventListener("load", openCalendly, { once: true });
    document.head.appendChild(script);
  }

  document.getElementById("haltung-calendly-btn")?.addEventListener("click", loadCalendlyAndOpen);
</script>
```

- [ ] **Step 2: Add the `Calendly` global type declaration**

The script above uses `window.Calendly`, which TypeScript doesn't know about. Add a type declaration in the same `<script>` block by declaring the global before it's used. Edit the `<script>` block from Step 1: add this `declare global` block immediately after the `import` line:

```astro
<script>
  import { initScrollAnimate } from "../../lib/scrollAnimate";

  declare global {
    interface Window {
      Calendly?: {
        initPopupWidget: (options: { url: string }) => void;
      };
    }
  }

  const section = document.getElementById("haltung");
  if (section) {
    initScrollAnimate(section);
  }

  const CALENDLY_URL = "https://calendly.com/nigronet";

  function openCalendly() {
    window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
  }

  function loadCalendlyAndOpen() {
    if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="calendly.com/assets/external/widget.js"]'
    );

    if (existingScript) {
      if (window.Calendly) {
        openCalendly();
      } else {
        existingScript.addEventListener("load", openCalendly, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.addEventListener("load", openCalendly, { once: true });
    document.head.appendChild(script);
  }

  document.getElementById("haltung-calendly-btn")?.addEventListener("click", loadCalendlyAndOpen);
</script>
```

- [ ] **Step 3: Type-check**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npx astro check 2>&1 | tail -5
```

Expected: 34 pre-existing errors (baseline), 0 warnings, 6 hints — 0 new errors from `Haltung.astro`.

- [ ] **Step 4: Commit**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && git add src/components/sections/Haltung.astro && git commit -m "feat: add Haltung section (Sektion 7) with Calendly lazy-load CTA"
```

---

## Task 2: Wire `Haltung` into `index.astro`, remove out-of-scope sections

**Files:**
- Modify: `src/pages/index.astro`

Current full content of `src/pages/index.astro` (131 lines):

```astro
---
import Layout from "../layouts/Layout.astro";
import { getPosts } from "../lib/directus";
import HeroCanvas from "../components/HeroCanvas.astro";
import Strukturproblem from "../components/sections/Strukturproblem.astro";
import Denkweise from "../components/sections/Denkweise.astro";
import LogosBar from "../components/LogosBar.astro";
import Leistungen from "../components/sections/Leistungen.astro";
import Cases from "../components/sections/Cases.astro";
import Ergebnisse from "../components/Ergebnisse.astro";
import Team from "../components/Team.astro";
import FAQ from "../components/FAQ.astro";
import CTACalendly from "../components/CTACalendly.astro";

const fetchedPosts = await getPosts(3);

const fallbackPosts = [
  {
    slug: "relaunch-seo",
    cover: "https://www.digipub.de/wp-content/uploads/2025/04/u2637499129_Bitte_kreire_mir_ein_Bild_zum_Thema_Relaunch_SEO._c0329f22-7da5-4fc7-a629-f331caee7e41_2-1-1024x574.png",
    date: "Apr 2025 · 5 min",
    title: "Mit SEO besser durch den Relaunch",
    excerpt: "Ein Website Relaunch bringt neue Strukturen, Inhalte und Technik – doch genau das birgt Risiken für Sichtbarkeit und Rankings.",
  },
  {
    slug: "ki-im-arbeitsalltag",
    cover: "https://www.digipub.de/wp-content/uploads/2025/11/u2637499129_digitale_Matrix_dreht_sich_um_zufriedenen_Nutzer__083b13f9-3139-4de5-9ac3-47d2e29efa3c_0-1024x574.png",
    date: "Mai 2025 · 4 min",
    title: "KI im Arbeitsalltag – wo der Hebel wirklich ansetzt",
    excerpt: "Die meisten KI-Projekte scheitern nicht an der Technik, sondern an der Auswahl der Use Cases. Wir zeigen, wie man die richtigen findet.",
  },
  {
    slug: "designsysteme-skalieren-marken",
    cover: "https://www.digipub.de/wp-content/uploads/2025/11/u2637499129_Netzwerk_aus_Knoten_und_Kanten_in_Wolkenform_-ar_e39ad9a2-5a17-4a91-a5d9-f27d771febfe_2-1024x574.png",
    date: "Jun 2025 · 6 min",
    title: "Wie Designsysteme Marken skalierbar machen",
    excerpt: "Ein konsistentes Designsystem spart nicht nur Zeit in der Umsetzung – es stärkt auch die Wiedererkennbarkeit einer Marke über alle Kanäle hinweg.",
  },
];

const posts = fetchedPosts.length > 0
  ? fetchedPosts.map((post) => ({
      slug: post.slug,
      cover: post.cover_image ? `https://directus.deutsche-musik.de/assets/${post.cover_image}?width=600&format=webp` : null,
      date: `${new Date(post.date_created).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}${post.read_time ? ` · ${post.read_time} min` : ""}`,
      title: post.title,
      excerpt: post.excerpt,
    }))
  : fallbackPosts;
---

<Layout>

  <!-- 1. HERO -->
  <HeroCanvas />

  <!-- 2. STRUKTURPROBLEM -->
  <Strukturproblem />

  <!-- 3. DENKWEISE -->
  <Denkweise />

  <!-- 4. LOGOS BAR -->
  <LogosBar />

  <!-- 5. LEISTUNGEN -->
  <Leistungen />

  <!-- 6. CASES -->
  <Cases />

  <!-- 7. ERGEBNISSE IN ZAHLEN -->
  <Ergebnisse />

  <!-- 8. TEAM / FACES -->
  <Team />

  <!-- 9. FAQ -->
  <FAQ />

  <!-- 10. AKTUELLES -->
  <section class="bg-white border-t border-gray-100 py-16">
    <div class="max-w-7xl mx-auto px-6">

      <div class="flex items-end justify-between mb-10">
        <div>
          <p class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">Aktuelles</p>
          <h2 class="text-2xl md:text-3xl font-semibold text-[#1a1a1a] leading-snug">
            Was uns besch&auml;ftigt.
          </h2>
        </div>
        <a href="/aktuelles" class="hidden md:inline-flex text-sm font-medium text-[#2563eb] hover:opacity-70 transition-opacity">
          Alle Artikel &rarr;
        </a>
      </div>

      <div class="divide-y divide-gray-200 border-t border-b border-gray-200">
        {posts.map((post) => (
          <a href={`/aktuelles/${post.slug}`} class="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center py-8">
            {post.cover && (
              <img
                src={post.cover}
                alt={post.title}
                class="md:col-span-3 w-full aspect-video object-cover rounded-lg"
                loading="lazy"
              />
            )}
            <div class={post.cover ? "md:col-span-9" : "md:col-span-12"}>
              <p class="font-mono text-xs text-gray-400 mb-2">{post.date}</p>
              <h3 class="font-semibold text-[#1a1a1a] group-hover:text-[#2563eb] transition-colors leading-snug mb-2">{post.title}</h3>
              <p class="text-gray-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
            </div>
          </a>
        ))}
      </div>

      <!-- Mobile: Alle Artikel Link -->
      <div class="mt-8 md:hidden">
        <a href="/aktuelles" class="text-sm font-medium text-[#2563eb] hover:opacity-70 transition-opacity">
          Alle Artikel &rarr;
        </a>
      </div>

    </div>
  </section>

  <!-- 11. FINALER CTA / CALENDLY -->
  <CTACalendly />

</Layout>
```

- [ ] **Step 1: Replace the entire file with the new content**

Replace the full content of `src/pages/index.astro` with:

```astro
---
import Layout from "../layouts/Layout.astro";
import HeroCanvas from "../components/HeroCanvas.astro";
import Strukturproblem from "../components/sections/Strukturproblem.astro";
import Denkweise from "../components/sections/Denkweise.astro";
import LogosBar from "../components/LogosBar.astro";
import Leistungen from "../components/sections/Leistungen.astro";
import Cases from "../components/sections/Cases.astro";
import Haltung from "../components/sections/Haltung.astro";
---

<Layout>

  <!-- 1. HERO -->
  <HeroCanvas />

  <!-- 2. STRUKTURPROBLEM -->
  <Strukturproblem />

  <!-- 3. DENKWEISE -->
  <Denkweise />

  <!-- 4. LOGOS BAR -->
  <LogosBar />

  <!-- 5. LEISTUNGEN -->
  <Leistungen />

  <!-- 6. CASES -->
  <Cases />

  <!-- 7. HALTUNG + CTA -->
  <Haltung />

</Layout>
```

- [ ] **Step 2: Type-check and build**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npx astro check 2>&1 | tail -5 && npm run build 2>&1 | tail -10
```

Expected: 34 pre-existing errors (baseline, no new ones), build succeeds. Note: the baseline errors are unrelated to `index.astro`/`Haltung.astro` — if the error count changes, investigate before proceeding.

- [ ] **Step 3: Live browser QA**

Start the dev/preview server and verify in the browser:
- The homepage now ends with Sektion 7 "Haltung + CTA" directly after Cases — no Ergebnisse (dark KPI section), Team, FAQ, Aktuelles, or old CTACalendly sections appear
- Sektion 7 shows: headline "Mehrwert ist Marke.", two body paragraphs, a `border-t` divider, then a CTA bar with the text "Dein Unternehmen hat diesen Mehrwert..." on the left and two buttons ("Gespräch anfangen →" and "E-Mail schreiben") on the right
- Scrolling the section into view triggers the fade/slide-in animation (opacity 0 → 1, translateY 30px → 0)
- Click "Gespräch anfangen →": Calendly popup opens (verify `widget.css`/`widget.js` are loaded only after the click, e.g. via Network tab — not on initial page load)
- Click "Gespräch anfangen →" a second time: popup opens again without re-fetching the script
- "E-Mail schreiben" is a working `mailto:kontakt@digipub.de` link
- Check both light and dark mode (toggle via `#theme-toggle`) — button colors (`bg-foreground`/`text-background`, `border-border`/`text-foreground`) adapt correctly
- Check mobile width (e.g. 390px) — CTA bar stacks vertically, buttons wrap; and desktop width (e.g. 1280px) — CTA text and buttons sit side by side, no horizontal overflow

- [ ] **Step 4: Commit**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && git add src/pages/index.astro && git commit -m "feat: wire Haltung section into homepage as Sektion 7, remove out-of-scope sections"
```

---

## Self-Review Notes

- **Spec coverage:** Task 1 covers the new `Haltung.astro` component with content, layout, scroll-reveal, and Calendly lazy-load (Spec §Architektur, §Inhalt, §Layout, §Calendly Lazy-Load). Task 2 covers `index.astro` integration and removal of out-of-scope sections/dead code (Spec §index.astro Änderungen). Spec's "Nicht-Ziele" (Sektion ④, file deletions, cookie-consent gate, WebGL) require no tasks — explicitly out of scope.
- **Placeholder scan:** No TBD/TODO; all code blocks are complete and copy-pasteable, including the full replacement content for `index.astro`.
- **Type consistency:** `initScrollAnimate(section)` matches its existing definition in `src/lib/scrollAnimate.ts` (`initScrollAnimate(root: HTMLElement, ...)`), same usage as in `Cases.astro`. The `window.Calendly` global is declared via `declare global { interface Window { ... } }` in Task 1 Step 2, matching the `Calendly.initPopupWidget({ url: string })` call signature used in both `openCalendly()` and the existing `CTACalendly.astro` (`Calendly.initPopupWidget({url:'...'})`).
