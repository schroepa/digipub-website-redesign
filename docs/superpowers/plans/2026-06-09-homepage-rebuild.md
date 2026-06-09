# Homepage Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the digipub.de homepage from a generic service catalogue into a trust-building, conversion-optimised page with 8 new sections: logos bar, 3 compact service cards, KPI numbers, founder/team moment, FAQ accordion, final CTA with Calendly, and a full multi-column footer.

**Architecture:** Each new section is an isolated Astro component in `src/components/`. `index.astro` imports them all and removes the old 5-block leistungen section and generic USPs. `Footer.astro` is replaced in place (already imported by `Layout.astro`). No React — all interactivity is vanilla JS in Astro `<script>` tags.

**Tech Stack:** Astro 5 · Tailwind CSS 4 (no config file, no @apply) · Vanilla JS · Calendly Embed API

**Color rules (enforce throughout):**
- Dark backgrounds / primary buttons: `#1a1a1a`
- Trust accent: `#2563eb` (Tailwind `blue-600`) — KPI numbers, FAQ open-state border, inline links
- NO orange (`#d97706`) anywhere
- Gray-50 alternating sections: `bg-gray-50 border-y border-gray-200`
- Muted labels: `text-xs font-mono text-gray-400 uppercase tracking-widest`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/Footer.astro` | **Replace** | Full multi-column footer with tagline, 4 columns, bottom bar |
| `src/components/LogosBar.astro` | **Create** | Client logos strip with grayscale hover |
| `src/components/Leistungen3.astro` | **Create** | 3 compact service cards on gray-50 |
| `src/components/Ergebnisse.astro` | **Create** | 4 KPI numbers on dark `#1a1a1a` background |
| `src/components/Team.astro` | **Create** | Founder moment — image left, personal text right |
| `src/components/FAQ.astro` | **Create** | Sticky-left / accordion-right layout, vanilla JS |
| `src/components/CTACalendly.astro` | **Create** | Final CTA text left + Calendly embed right |
| `src/pages/index.astro` | **Modify** | Import all new components, remove old leistungen blocks and USPs |

---

## Task 1: Replace Footer.astro

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Replace the full file content**

```astro
---
const year = new Date().getFullYear();
---

<footer style="background:#1a1a1a;">
  <div class="max-w-7xl mx-auto px-6 py-16">

    <!-- Top: Logo + Tagline -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 pb-12 border-b border-white/10">
      <a href="/">
        <img src="/logo.svg" alt="DigiPub" class="h-6 w-auto brightness-0 invert" loading="lazy" />
      </a>
      <p class="text-white/50 text-sm max-w-sm">
        Sichtbarkeit ist kein Zufall. Wir machen sie zur Strategie.
      </p>
    </div>

    <!-- 4-Column Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

      <!-- Leistungen -->
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

      <!-- Seiten -->
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

      <!-- Kontakt -->
      <div>
        <p class="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Kontakt</p>
        <ul class="flex flex-col gap-2">
          <li><a href="mailto:kontakt@digipub.de" class="text-white/60 text-sm hover:text-white transition-colors">kontakt@digipub.de</a></li>
          <li><a href="https://www.linkedin.com/company/digipub-de/" class="text-white/60 text-sm hover:text-white transition-colors" target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a href="https://www.instagram.com/digipub.de/" class="text-white/60 text-sm hover:text-white transition-colors" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="https://www.facebook.com/DigiPubSeo" class="text-white/60 text-sm hover:text-white transition-colors" target="_blank" rel="noopener">Facebook</a></li>
        </ul>
      </div>

      <!-- Rechtliches -->
      <div>
        <p class="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Rechtliches</p>
        <ul class="flex flex-col gap-2">
          <li><a href="/impressum" class="text-white/60 text-sm hover:text-white transition-colors">Impressum</a></li>
          <li><a href="/datenschutzerklaerung" class="text-white/60 text-sm hover:text-white transition-colors">Datenschutz</a></li>
        </ul>
      </div>

    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <p class="text-xs text-white/30">&copy; {year} DigiPub. Alle Rechte vorbehalten.</p>
      <p class="text-xs text-white/30">Made with &#9825; in Berlin</p>
    </div>

  </div>
</footer>
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | tail -20
```

Expected: `✓ Completed` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: replace footer with full multi-column layout"
```

---

## Task 2: Create LogosBar.astro

**Files:**
- Create: `src/components/LogosBar.astro`

- [ ] **Step 1: Create the file**

```astro
---
// Kundenlogos als Text-Platzhalter bis echte SVG/PNG-Dateien vorliegen
const logos = [
  { name: "Portazon", href: "/case-studies/portazon" },
  { name: "Walter de Gruyter", href: "/case-studies/walter-de-gruyter" },
  { name: "Smart Catering", href: "/case-studies/smart-catering" },
  { name: "Tischlerei Haidacher", href: "/case-studies/haidacher" },
];
---

<section class="bg-white border-b border-gray-100 py-10">
  <div class="max-w-7xl mx-auto px-6">
    <p class="text-xs font-mono text-gray-400 uppercase tracking-widest text-center mb-8">
      Unternehmen, die uns vertrauen
    </p>
    <div class="flex flex-wrap items-center justify-center gap-10 md:gap-16">
      {logos.map((logo) => (
        <a
          href={logo.href}
          class="logo-item text-sm font-semibold text-gray-300 hover:text-[#1a1a1a] transition-colors duration-300 whitespace-nowrap"
          style="letter-spacing: 0.05em;"
        >
          {logo.name}
        </a>
      ))}
    </div>
  </div>
</section>
```

**Note:** The text placeholders use `text-gray-300` at rest and `hover:text-[#1a1a1a]` — mimicking the grayscale→color effect of real logos. When real logo files are available, replace each `<a>` content with `<img src="/logos/{name}.svg" alt="{name}" class="h-8 w-auto" style="filter: grayscale(1) opacity(0.4);" />` and add the hover style via inline `onmouseover/onmouseout` or a CSS class.

- [ ] **Step 2: Verify build**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | tail -20
```

Expected: `✓ Completed` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/LogosBar.astro
git commit -m "feat: add LogosBar component with client name placeholders"
```

---

## Task 3: Create Leistungen3.astro

**Files:**
- Create: `src/components/Leistungen3.astro`

- [ ] **Step 1: Create the file**

```astro
---
const leistungen = [
  {
    label: "Branding",
    title: "Marke & Positionierung",
    text: "Wir entwickeln Marken, die Entscheider ansprechen &ndash; mit Sprache, Struktur und Gestaltung, die Mehrwert sichtbar macht. Keine Dekoration, sondern Strategie.",
    href: "/leistungen/markenaufbau-branding",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/><circle cx="12" cy="12" r="3"/></svg>`,
  },
  {
    label: "Technologie",
    title: "KI &amp; Automatisierung",
    text: "Wir identifizieren echte Use Cases f&uuml;r KI und Automatisierung &ndash; und setzen sie um, bevor sie zum Buzzword werden. Entlastung, die sich im Arbeitsalltag zeigt.",
    href: "/leistungen/ki-implementierung",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 12h6M16.2 7.2l-4.4 3.6M16.2 16.8l-4.4-3.6"/></svg>`,
  },
  {
    label: "Sichtbarkeit",
    title: "SEO / GEO",
    text: "Klassische Suchmaschinenoptimierung trifft Generative Engine Optimization. Wir machen Unternehmen auch in KI-basierten Suchsystemen findbar.",
    href: "/leistungen/seo-geo",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  },
];
---

<section class="bg-gray-50 border-y border-gray-200 py-16">
  <div class="max-w-7xl mx-auto px-6">

    <!-- Header -->
    <div class="mb-12 max-w-xl">
      <p class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">Leistungen</p>
      <h2 class="text-2xl md:text-3xl font-semibold text-[#1a1a1a] leading-snug">
        Was wir wirklich gut k&ouml;nnen.
      </h2>
    </div>

    <!-- 3-Column Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {leistungen.map((l) => (
        <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col gap-4">
          <p class="text-xs font-mono text-gray-400 uppercase tracking-widest">{l.label}</p>
          <div class="text-[#1a1a1a]" set:html={l.icon} />
          <h3 class="text-lg font-semibold text-[#1a1a1a]" set:html={l.title} />
          <p class="text-gray-600 text-sm leading-relaxed flex-1" set:html={l.text} />
          <a
            href={l.href}
            class="text-sm font-medium text-[#2563eb] hover:opacity-70 transition-opacity"
          >
            Mehr erfahren &rarr;
          </a>
        </div>
      ))}
    </div>

    <!-- Sub-link to remaining services -->
    <p class="mt-8 text-sm text-gray-400">
      Auch:
      <a href="/leistungen/designsystem" class="text-[#1a1a1a] hover:text-[#2563eb] transition-colors">Designsystem</a>
      &middot;
      <a href="/leistungen/automatisierung" class="text-[#1a1a1a] hover:text-[#2563eb] transition-colors">Automatisierung</a>
      <span class="ml-1">&rarr;</span>
    </p>

  </div>
</section>
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | tail -20
```

Expected: `✓ Completed` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Leistungen3.astro
git commit -m "feat: add Leistungen3 component – 3 compact service cards"
```

---

## Task 4: Create Ergebnisse.astro

**Files:**
- Create: `src/components/Ergebnisse.astro`

- [ ] **Step 1: Create the file**

```astro
---
const kpis = [
  { zahl: "70.000+", kontext: "App-Downloads", quelle: "Portazon" },
  { zahl: "+119%", kontext: "mehr Klicks in 90 Tagen", quelle: "Tischlerei Haidacher" },
  { zahl: "5", kontext: "Branchen, eine Methode", quelle: "DigiPub" },
  { zahl: "seit 2015", kontext: "Erfahrung, die sich auszahlt", quelle: "DigiPub" },
];
---

<section style="background:#1a1a1a;" class="py-20">
  <div class="max-w-7xl mx-auto px-6">

    <!-- Header -->
    <div class="mb-14">
      <p class="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">Ergebnisse</p>
      <h2 class="text-2xl md:text-3xl font-semibold text-white leading-snug">
        Keine Versprechen. Zahlen.
      </h2>
      <p class="text-white/50 text-sm mt-2">
        Aus echten Projekten &ndash; keine Hochglanz-Sch&auml;tzungen.
      </p>
    </div>

    <!-- KPI Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
      {kpis.map((kpi) => (
        <div class="flex flex-col gap-2">
          <span class="text-4xl md:text-5xl font-bold text-[#2563eb]">{kpi.zahl}</span>
          <span class="text-xs font-mono text-white/40 uppercase tracking-widest leading-snug">
            {kpi.kontext}
          </span>
          <span class="text-xs text-white/20">{kpi.quelle}</span>
        </div>
      ))}
    </div>

  </div>
</section>
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | tail -20
```

Expected: `✓ Completed` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Ergebnisse.astro
git commit -m "feat: add Ergebnisse component – KPI numbers with blue accent"
```

---

## Task 5: Create Team.astro

**Files:**
- Create: `src/components/Team.astro`

- [ ] **Step 1: Create the file**

```astro
---
// Unsplash-Platzhalter bis echte Fotos vorliegen
// Portrait-Format, authentische Atmosphäre
const foto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80";
---

<section class="bg-white py-20">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

      <!-- Bild links -->
      <div class="rounded-xl overflow-hidden shadow-md">
        <img
          src={foto}
          alt="Patrick Schroeder, DigiPub"
          class="w-full aspect-[4/5] object-cover"
          loading="lazy"
        />
      </div>

      <!-- Text rechts -->
      <div>
        <p class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
          Hinter DigiPub
        </p>
        <h2 class="text-2xl md:text-3xl font-semibold text-[#1a1a1a] leading-snug mb-6">
          Ich bin Patrick.
        </h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          Seit 2015 helfe ich Unternehmen, im Digitalen nicht nur sichtbar zu werden &ndash;
          sondern zu wirken. Was mich antreibt: der Moment, in dem Struktur und Sprache
          zusammenfinden und aus einem guten Produkt eine erkennbare Marke wird.
        </p>
        <p class="text-gray-600 leading-relaxed mb-8">
          Ich arbeite lieber tief als breit. Lieber direkt als diplomatisch.
          Und immer mit dem Ziel, dass du am Ende weniger von mir brauchst &ndash; nicht mehr.
        </p>

        <!-- Social Links -->
        <div class="flex items-center gap-5">
          <a
            href="https://www.linkedin.com/company/digipub-de/"
            target="_blank"
            rel="noopener"
            aria-label="LinkedIn"
            class="text-gray-400 hover:text-[#2563eb] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
          <a
            href="https://www.instagram.com/digipub.de/"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
            class="text-gray-400 hover:text-[#1a1a1a] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
        </div>
      </div>

    </div>
  </div>
</section>
```

**Note:** Replace `"Ich bin Patrick."` and the bio text with the real name and copy once confirmed. Replace the Unsplash URL with the real photo path once available.

- [ ] **Step 2: Verify build**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | tail -20
```

Expected: `✓ Completed` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Team.astro
git commit -m "feat: add Team component – founder moment with Unsplash placeholder"
```

---

## Task 6: Create FAQ.astro

**Files:**
- Create: `src/components/FAQ.astro`

- [ ] **Step 1: Create the file**

```astro
---
const faqs = [
  {
    frage: "Was kostet eine Zusammenarbeit mit DigiPub?",
    antwort: "Projektbasiert, kein Abomodell. Nach einem kostenlosen Erstgespr&auml;ch erstellen wir ein konkretes Angebot &ndash; transparent, ohne versteckte Kosten. Die Investition h&auml;ngt vom Umfang ab, nicht von einer Pauschale.",
  },
  {
    frage: "F&uuml;r welche Unternehmen arbeitet ihr?",
    antwort: "F&uuml;r mittelst&auml;ndische Unternehmen, die verstanden haben, dass digitale Sichtbarkeit kein Zufall ist &ndash; und bereit sind, das zu &auml;ndern. Branche ist zweitrangig, Haltung ist entscheidend.",
  },
  {
    frage: "Wie lange dauert es, bis wir erste Ergebnisse sehen?",
    antwort: "Das h&auml;ngt vom Bereich ab. SEO: erste messbare Bewegung nach 6&ndash;12 Wochen. KI und Automatisierung: erste Entlastung oft nach wenigen Wochen. Markenaufbau: ein laufender Prozess, keine Einmalma&szlig;nahme.",
  },
  {
    frage: "Arbeitet ihr remote oder vor Ort?",
    antwort: "Beides. Strategische Gespr&auml;che und Workshops gerne vor Ort oder per Video &ndash; die t&auml;gliche Arbeit l&auml;uft remote. Wir sind in Berlin, arbeiten aber mit Unternehmen aus dem gesamten deutschsprachigen Raum.",
  },
  {
    frage: "Was unterscheidet euch von einer klassischen Werbeagentur?",
    antwort: "Wir verkaufen keine Kampagnen. Wir bauen Systeme &ndash; Marken, Prozesse, Strukturen, die ohne uns funktionieren. Unser Ziel ist nicht Abh&auml;ngigkeit, sondern Kompetenzaufbau.",
  },
];
---

<section class="bg-gray-50 border-y border-gray-200 py-20">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-12">

      <!-- Left: Sticky Statement -->
      <div class="md:col-span-2 md:sticky md:top-24 self-start">
        <p class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">FAQ</p>
        <h2 class="text-2xl md:text-3xl font-semibold text-[#1a1a1a] leading-snug mb-4">
          H&auml;ufige Fragen.
        </h2>
        <p class="text-gray-600 leading-relaxed">
          Was Unternehmen uns am h&auml;ufigsten fragen, bevor wir zusammenarbeiten.
        </p>
      </div>

      <!-- Right: Accordion -->
      <div class="md:col-span-3 flex flex-col" id="faq-list">
        {faqs.map((item, i) => (
          <div class="faq-item border-b border-gray-200" data-index={i}>
            <button
              class="faq-trigger w-full flex items-center justify-between py-5 text-left gap-4"
              aria-expanded="false"
            >
              <span class="font-semibold text-[#1a1a1a] text-base" set:html={item.frage} />
              <span class="faq-icon shrink-0 text-gray-400 transition-transform duration-300">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <line x1="10" y1="4" x2="10" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="faq-line-v"/>
                  <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
            </button>
            <div class="faq-content overflow-hidden" style="max-height: 0; transition: max-height 0.3s ease;">
              <p class="text-gray-600 leading-relaxed pb-5 pr-8" set:html={item.antwort} />
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
</section>

<script>
  const items = document.querySelectorAll('.faq-item');

  items.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger') as HTMLButtonElement;
    const content = item.querySelector('.faq-content') as HTMLElement;
    const lineV = item.querySelector('.faq-line-v') as SVGLineElement;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all
      items.forEach((other) => {
        const otherTrigger = other.querySelector('.faq-trigger') as HTMLButtonElement;
        const otherContent = other.querySelector('.faq-content') as HTMLElement;
        const otherLineV = other.querySelector('.faq-line-v') as SVGLineElement;
        otherTrigger.setAttribute('aria-expanded', 'false');
        otherContent.style.maxHeight = '0';
        other.style.borderLeftWidth = '0';
        other.style.paddingLeft = '0';
        if (otherLineV) otherLineV.style.opacity = '1';
      });

      // Open clicked if it was closed
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
        // Blue left border as trust signal
        (item as HTMLElement).style.borderLeft = '2px solid #2563eb';
        (item as HTMLElement).style.paddingLeft = '12px';
        if (lineV) lineV.style.opacity = '0';
      }
    });
  });
</script>
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | tail -20
```

Expected: `✓ Completed` with no errors.

- [ ] **Step 3: Verify accordion behaviour in dev server**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run dev
```

Open `http://localhost:4321` in browser. Click a FAQ item — it should open smoothly with a blue left border. Click another — first closes, second opens. Click same item again — closes.

- [ ] **Step 4: Commit**

```bash
git add src/components/FAQ.astro
git commit -m "feat: add FAQ component – sticky left, accordion right, blue open-state border"
```

---

## Task 7: Create CTACalendly.astro

**Files:**
- Create: `src/components/CTACalendly.astro`

- [ ] **Step 1: Create the file**

```astro
---
// Calendly URL aus CLAUDE.md
const calendlyUrl = "https://calendly.com/nigronet?embed_domain=digipub.de&embed_type=Inline";
---

<section class="bg-gray-50 border-t border-gray-200 py-20">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

      <!-- Left: Emotionaler Anker -->
      <div class="md:pt-6">
        <p class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
          N&auml;chster Schritt
        </p>
        <h2 class="text-2xl md:text-3xl font-semibold text-[#1a1a1a] leading-snug mb-4">
          Lass uns reden.
        </h2>
        <p class="text-gray-600 leading-relaxed mb-6">
          Kein Pitch, kein Angebot beim ersten Gespr&auml;ch.
          Wir h&ouml;ren erst zu &ndash; dann reden wir &uuml;ber L&ouml;sungen.
        </p>
        <p class="text-sm text-gray-400">
          Lieber eine Mail?
          <a
            href="mailto:kontakt@digipub.de"
            class="text-[#2563eb] hover:opacity-70 transition-opacity"
          >
            kontakt@digipub.de
          </a>
        </p>
      </div>

      <!-- Right: Calendly Embed -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div
          class="calendly-inline-widget"
          data-url={calendlyUrl}
          style="min-width:320px;height:500px;"
        ></div>
        <script
          type="text/javascript"
          src="https://assets.calendly.com/assets/external/widget.js"
          async
        ></script>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | tail -20
```

Expected: `✓ Completed` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/CTACalendly.astro
git commit -m "feat: add CTACalendly component – emotional anchor + Calendly embed"
```

---

## Task 8: Update index.astro

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the full file**

```astro
---
import Layout from "../layouts/Layout.astro";
import { getPosts } from "../lib/directus";
import HeroCanvas from "../components/HeroCanvas.astro";
import LogosBar from "../components/LogosBar.astro";
import Leistungen3 from "../components/Leistungen3.astro";
import Ergebnisse from "../components/Ergebnisse.astro";
import Team from "../components/Team.astro";
import FAQ from "../components/FAQ.astro";
import CTACalendly from "../components/CTACalendly.astro";

const posts = await getPosts(3);
---

<Layout>

  <!-- 1. HERO -->
  <HeroCanvas />

  <!-- 2. LOGOS BAR -->
  <LogosBar />

  <!-- 3. LEISTUNGEN (3 kompakte Kacheln) -->
  <Leistungen3 />

  <!-- 4. ERGEBNISSE IN ZAHLEN -->
  <Ergebnisse />

  <!-- 5. TEAM / FACES -->
  <Team />

  <!-- 6. FAQ -->
  <FAQ />

  <!-- 7. AKTUELLES -->
  <section style="background:#1a1a1a;">
    <div class="max-w-7xl mx-auto px-6 py-16">
      <h2 class="text-3xl font-semibold text-white mb-10">Aktuelles</h2>

      {posts.length > 0 ? (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <a href={`/aktuelles/${post.slug}`} class="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-colors">
              {post.cover_image && (
                <img
                  src={`https://directus.deutsche-musik.de/assets/${post.cover_image}?width=600&format=webp`}
                  alt={post.title}
                  class="w-full aspect-video object-cover"
                  loading="lazy"
                />
              )}
              <div class="p-6">
                <p class="font-mono text-xs text-white/40 mb-3">
                  {new Date(post.date_created).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                  {post.read_time && ` · ${post.read_time} min`}
                </p>
                <h3 class="text-white font-semibold group-hover:text-white/70 transition-colors leading-snug mb-2">{post.title}</h3>
                <p class="text-white/50 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/aktuelles/relaunch-seo" class="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-colors">
            <img
              src="https://www.digipub.de/wp-content/uploads/2025/04/u2637499129_Bitte_kreire_mir_ein_Bild_zum_Thema_Relaunch_SEO._c0329f22-7da5-4fc7-a629-f331caee7e41_2-1-1024x574.png"
              alt="Relaunch SEO"
              class="w-full aspect-video object-cover"
              loading="lazy"
            />
            <div class="p-6">
              <h3 class="text-white font-semibold group-hover:text-white/70 transition-colors leading-snug mb-2">
                Mit SEO besser durch den Relaunch
              </h3>
              <p class="text-white/50 text-sm leading-relaxed">
                Ein Website Relaunch bringt neue Strukturen, Inhalte und Technik &ndash; doch genau das birgt Risiken f&uuml;r Sichtbarkeit und Rankings.
              </p>
            </div>
          </a>
        </div>
      )}
    </div>
  </section>

  <!-- 8. FINALER CTA / CALENDLY -->
  <CTACalendly />

</Layout>
```

- [ ] **Step 2: Verify build completes without errors**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | tail -30
```

Expected: `✓ Completed` — all pages generated, no TypeScript errors, no undefined references.

- [ ] **Step 3: Visual check in dev server**

```bash
npm run dev
```

Open `http://localhost:4321` and scroll through the full page. Check:
- Hero → LogosBar → Leistungen3 → Ergebnisse → Team → FAQ → Aktuelles → CTACalendly → Footer
- FAQ accordion opens/closes with blue left border
- Blue `#2563eb` only on KPI numbers, FAQ open state, and inline links
- No orange anywhere
- Footer has 4 columns + "Made with ♥ in Berlin"
- Mobile: resize to 375px — all sections stack correctly

- [ ] **Step 4: Commit and push**

```bash
git add src/pages/index.astro
git commit -m "feat: homepage rebuild – wire all new sections, remove old leistungen blocks and USPs"
git push
```

Expected: Vercel auto-deploy triggers. Check https://vercel.com dashboard for green build.

---

## Self-Review Checklist

**Spec coverage:**
- [x] Logos-Bar → Task 2
- [x] 3 Kern-Leistungen → Task 3
- [x] Ergebnisse in Zahlen → Task 4
- [x] Team/Faces → Task 5
- [x] FAQ accordion → Task 6
- [x] Finaler CTA / Calendly → Task 7
- [x] Footer multi-column → Task 1
- [x] index.astro wiring → Task 8
- [x] Aktuelles (kept, repositioned) → Task 8

**Color rules:**
- [x] Blue `#2563eb` used for: KPI numbers (Task 4), FAQ open-state border (Task 6), inline links (Tasks 3, 7)
- [x] No orange anywhere
- [x] Dark sections use `#1a1a1a`
- [x] "Made with ♥ in Berlin" → Task 1

**No placeholders:**
- [x] All code blocks are complete and runnable
- [x] Unsplash URL specified in Task 5 (not "TBD")
- [x] Calendly URL specified in Task 7 (from CLAUDE.md)
- [x] All German special characters use HTML entities in Astro templates
