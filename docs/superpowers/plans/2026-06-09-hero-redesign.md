# Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bestehenden Hero-Bereich der Startseite durch eine neue `HeroCanvas.astro`-Komponente ersetzen, die Soft Pastel Noise Clouds (fBm), Maus-Parallax und zweiphasige Kinetic Typography (Scramble → Blur Morph) enthält.

**Architecture:** Eine einzige neue Komponente `src/components/HeroCanvas.astro` kapselt Canvas + gesamtes Vanilla-JS. Die Startseite `src/pages/index.astro` tauscht die alte Hero-Section gegen `<HeroCanvas />` aus. Kein React, kein externe Library — nur Browser-APIs.

**Tech Stack:** Astro 5, Vanilla JS (Canvas 2D, requestAnimationFrame, Simplex Noise inline), Tailwind CSS 4

---

## Dateiübersicht

| Aktion | Datei | Verantwortung |
|---|---|---|
| Create | `src/components/HeroCanvas.astro` | Canvas-Element, HTML-Struktur, gesamtes JS |
| Modify | `src/pages/index.astro` | Alte Hero-Section ersetzen durch `<HeroCanvas />` |

---

## Task 1: HeroCanvas.astro – HTML-Struktur

**Files:**
- Create: `src/components/HeroCanvas.astro`

- [ ] **Schritt 1: Komponente anlegen**

Erstelle `src/components/HeroCanvas.astro` mit folgendem Inhalt:

```astro
---
// Keine Props nötig – Inhalte sind statisch
---

<section
  id="hero"
  class="relative bg-white overflow-hidden"
  style="min-height: clamp(520px, 80vh, 800px);"
>
  <!-- Canvas liegt hinter dem Inhalt -->
  <canvas
    id="hero-canvas"
    class="absolute inset-0 w-full h-full"
    aria-hidden="true"
  ></canvas>

  <!-- Inhalt -->
  <div class="relative z-10 max-w-7xl mx-auto px-6 flex items-center h-full"
       style="min-height: inherit;">
    <div class="max-w-2xl py-24">

      <!-- Label -->
      <p
        id="hero-label"
        class="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6 opacity-0"
      >
        Digitalagentur &middot; Marke &middot; KI &middot; Automatisierung
      </p>

      <!-- Headline -->
      <h1 class="font-bold text-[#1a1a1a] leading-tight tracking-tight mb-3"
          style="font-size: clamp(2.2rem, 5vw, 3.5rem);">
        <span id="hero-line1" class="block opacity-0" style="transform: translateY(16px);">
          Sichtbarkeit ist kein Zufall.
        </span>
        <span id="hero-line2" class="block opacity-0" style="transform: translateY(16px);">
          Wir machen sie zur Strategie.
        </span>
      </h1>

      <!-- Kinetische Zeile -->
      <p class="font-bold text-[#1a1a1a] mb-6 opacity-0"
         id="hero-kinetic"
         style="font-size: clamp(2.2rem, 5vw, 3.5rem); transform: translateY(16px); line-height: 1.2;">
        Wir machen dich
        <span
          id="hero-word"
          style="border-bottom: 3px solid #1a1a1a; padding-bottom: 2px; display: inline-block;"
        >sichtbar</span>.
      </p>

      <!-- Subtext -->
      <p
        id="hero-sub"
        class="text-base text-gray-600 leading-relaxed mb-8 max-w-lg opacity-0"
      >
        Wir verbinden Markenaufbau, KI-Implementierung und Automatisierung
        &ndash; damit dein Unternehmen nicht nur sichtbar wird, sondern wirkt.
      </p>

      <!-- CTA + Trust -->
      <div id="hero-cta" class="opacity-0">
        <a
          href="/kontakt"
          class="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-bold rounded-lg hover:opacity-80 transition-opacity mb-4"
          style="background: #1a1a1a;"
        >
          Los geht&rsquo;s
          <span aria-hidden="true">&rarr;</span>
        </a>
        <div class="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
          <span>&#10003; Kostenlose Erstberatung</span>
          <span>&#10003; Kein Bullshit</span>
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Schritt 2: Build prüfen**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | grep -E "error|Error|Complete"
```

Erwartet: `✓ Completed` — keine Errors.

- [ ] **Schritt 3: Commit**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website"
git add src/components/HeroCanvas.astro
git commit -m "feat: add HeroCanvas component – HTML structure"
```

---

## Task 2: index.astro – Hero-Section ersetzen

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Schritt 1: Import hinzufügen**

In `src/pages/index.astro`, im Frontmatter-Block (`---`) folgende Zeile hinzufügen direkt nach der ersten Import-Zeile:

```astro
import HeroCanvas from "../components/HeroCanvas.astro";
```

- [ ] **Schritt 2: Alte Hero-Section ersetzen**

Die folgende Sektion in `src/pages/index.astro` (Zeilen 63–74):

```astro
  <!-- HERO -->
  <section class="bg-white py-16 text-center border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-6">
      <h1 class="text-5xl md:text-7xl font-semibold text-[#1a1a1a] tracking-tight mb-4">
        Mehrwert ist Marke
      </h1>
      <p class="text-xl text-gray-500 mb-12">
        Sichtbarkeit & Digitalisierung für dein Unternehmen
      </p>

    </div>
  </section>
```

ersetzen durch:

```astro
  <!-- HERO -->
  <HeroCanvas />
```

- [ ] **Schritt 3: Build prüfen**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | grep -E "error|Error|Complete"
```

Erwartet: `✓ Completed`

- [ ] **Schritt 4: Commit**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website"
git add src/pages/index.astro
git commit -m "feat: wire HeroCanvas into index page"
```

---

## Task 3: Noise Cloud Renderer (fBm + Canvas 2D)

**Files:**
- Modify: `src/components/HeroCanvas.astro` — `<script>`-Block anhängen

- [ ] **Schritt 1: Script-Block mit Noise-Renderer hinzufügen**

Am Ende von `src/components/HeroCanvas.astro`, nach dem schliessenden `</section>`-Tag, folgenden Block anhängen:

```astro
<script>
// ── 1. Simplex Noise 2D (inline, keine externe Library) ─────────────────────
function buildNoise() {
  const perm = new Uint8Array(256);
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const G = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;

  function simplex2(x, y) {
    const s = (x + y) * F2;
    const i = Math.floor(x + s) | 0;
    const j = Math.floor(y + s) | 0;
    const t = (i + j) * G2;
    const x0 = x - (i - t), y0 = y - (j - t);
    const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const g0 = p[(i + p[j & 255]) & 255] & 7;
    const g1 = p[(i + i1 + p[(j + j1) & 255]) & 255] & 7;
    const g2 = p[(i + 1 + p[(j + 1) & 255]) & 255] & 7;
    const n0 = (t => t < 0 ? 0 : t*t*t*t * (G[g0][0]*x0 + G[g0][1]*y0))(0.5 - x0*x0 - y0*y0);
    const n1 = (t => t < 0 ? 0 : t*t*t*t * (G[g1][0]*x1 + G[g1][1]*y1))(0.5 - x1*x1 - y1*y1);
    const n2 = (t => t < 0 ? 0 : t*t*t*t * (G[g2][0]*x2 + G[g2][1]*y2))(0.5 - x2*x2 - y2*y2);
    return 70 * (n0 + n1 + n2);
  }

  // fBm: 5 Oktaven
  return function fbm(x, y) {
    let v = 0, amp = 0.5, freq = 1, max = 0;
    for (let i = 0; i < 5; i++) {
      v += simplex2(x * freq, y * freq) * amp;
      max += amp;
      amp *= 0.5;
      freq *= 2.1;
    }
    return v / max;
  };
}

// ── 2. Canvas Setup ──────────────────────────────────────────────────────────
const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const fbm = buildNoise();

// Offscreen Canvas für Blur-Rendering
const off = document.createElement('canvas');
const octx = off.getContext('2d')!;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  off.width = W;
  off.height = H;
  ctx.scale(dpr, dpr);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ── 3. Cloud-Definitionen (Soft Pastel) ─────────────────────────────────────
const CLOUDS = [
  { cx: 0.78, cy: 0.28, r: 200, g: 210, b: 255, opacity: 1.05, scale: 2.2, speed: 0.40, blur: 14, falloff: 2.2, px: 0.08, py: 0.05 },
  { cx: 0.85, cy: 0.68, r: 185, g: 245, b: 220, opacity: 0.90, scale: 2.5, speed: 0.30, blur: 12, falloff: 2.0, px: 0.06, py: 0.07 },
  { cx: 0.58, cy: 0.38, r: 235, g: 215, b: 255, opacity: 0.80, scale: 1.8, speed: 0.50, blur: 16, falloff: 2.5, px: 0.10, py: 0.04 },
];

// ── 4. Parallax State ────────────────────────────────────────────────────────
let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;
const isMobile = window.matchMedia('(max-width: 768px)').matches;

if (!isMobile) {
  window.addEventListener('mousemove', (e) => {
    tmx = e.clientX / window.innerWidth;
    tmy = e.clientY / window.innerHeight;
  });
}

// ── 5. Render Loop ───────────────────────────────────────────────────────────
let t = 0;

function renderClouds() {
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;

  // Smooth parallax
  mx += (tmx - mx) * 0.04;
  my += (tmy - my) * 0.04;

  ctx.clearRect(0, 0, W, H);

  CLOUDS.forEach((c) => {
    const px = (c.cx + (mx - 0.5) * c.px) * W;
    const py = (c.cy + (my - 0.5) * c.py) * H;

    // Mobile: leicht reduzierte Opacity
    const opacityMult = isMobile ? 0.7 : 1.0;

    // Pixel-Berechnung in 2×2-Blöcken (Performance)
    const imgD = octx.createImageData(W, H);
    const d = imgD.data;

    for (let iy = 0; iy < H; iy += 2) {
      for (let ix = 0; ix < W; ix += 2) {
        const fx = (ix / W - px / W) * c.scale;
        const fy = (iy / H - py / H) * c.scale;
        let n = fbm(fx + t * c.speed, fy + t * c.speed * 0.7);
        n = (n + 0.5) * 0.5; // Remap zu 0..1

        const dx = (ix - px) / W * 0.8;
        const dy = (iy - py) / H * 0.8;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const falloff = Math.max(0, 1 - dist * c.falloff);

        let alpha = Math.max(0, (n - 0.28) * 2.5 * falloff) * c.opacity * opacityMult;
        alpha = Math.min(1, alpha);
        const a = Math.round(alpha * 255);
        if (a < 2) continue;

        for (let oy = 0; oy < 2; oy++) {
          for (let ox = 0; ox < 2; ox++) {
            const idx = ((iy + oy) * W + (ix + ox)) * 4;
            d[idx]     = c.r;
            d[idx + 1] = c.g;
            d[idx + 2] = c.b;
            d[idx + 3] = a;
          }
        }
      }
    }

    octx.putImageData(imgD, 0, 0);
    ctx.filter = `blur(${c.blur}px)`;
    ctx.drawImage(off, 0, 0);
    ctx.filter = 'none';
  });

  t += 0.003;
  requestAnimationFrame(renderClouds);
}

renderClouds();
</script>
```

- [ ] **Schritt 2: Build prüfen**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | grep -E "error|Error|Complete"
```

Erwartet: `✓ Completed`

- [ ] **Schritt 3: Dev-Server starten und visuell prüfen**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run dev
```

Öffne `http://localhost:4321` — die Wolken sollten rechts im Hero sichtbar sein, weich und animiert.

- [ ] **Schritt 4: Commit**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website"
git add src/components/HeroCanvas.astro
git commit -m "feat: add fBm noise cloud renderer to HeroCanvas"
```

---

## Task 4: Kinetic Typography – Scramble + Blur Morph

**Files:**
- Modify: `src/components/HeroCanvas.astro` — bestehenden `<script>`-Block erweitern

- [ ] **Schritt 1: Wort-Sequenz und Scramble-Funktion anhängen**

Im `<script>`-Block von `src/components/HeroCanvas.astro`, direkt **vor** dem abschliessenden `</script>`-Tag, folgendes einfügen:

```typescript
// ── 6. Kinetic Typography ────────────────────────────────────────────────────
const WORDS = ['sichtbar', 'relevant', 'messbar', 'wirksam', 'unverwechselbar'];
const SCRAMBLE_CHARS = '!@#$%^&*<>?abcdefghijklmnopqrstuvwxyz';
const wordEl = document.getElementById('hero-word') as HTMLElement;

let wordIndex = 0;

// Phase 1: Scramble (einmalig beim Load, auf erstes Wort)
function scrambleIn(target: string, onDone: () => void) {
  let iteration = 0;
  const maxIter = target.length * 5;
  const iv = setInterval(() => {
    wordEl.textContent = target.split('').map((char, i) => {
      if (i < Math.floor(iteration / 4)) return char;
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }).join('');
    iteration++;
    if (iteration > maxIter) {
      clearInterval(iv);
      wordEl.textContent = target;
      onDone();
    }
  }, 30);
}

// Phase 2: Blur Morph (laufend)
function blurMorphTo(next: string) {
  wordEl.style.transition = 'filter 0.35s ease, opacity 0.35s ease';
  wordEl.style.filter = 'blur(8px)';
  wordEl.style.opacity = '0';
  setTimeout(() => {
    wordEl.textContent = next;
    wordEl.style.filter = 'blur(0px)';
    wordEl.style.opacity = '1';
  }, 360);
}

function startCycling() {
  setInterval(() => {
    wordIndex = (wordIndex + 1) % WORDS.length;
    blurMorphTo(WORDS[wordIndex]);
  }, 2500);
}
```

- [ ] **Schritt 2: Scramble beim Load auslösen**

Direkt nach dem obigen Block (noch vor `</script>`), folgendes einfügen:

```typescript
// Scramble beim ersten Render, dann Cycling starten
scrambleIn(WORDS[0], startCycling);
```

- [ ] **Schritt 3: Build prüfen**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | grep -E "error|Error|Complete"
```

Erwartet: `✓ Completed`

- [ ] **Schritt 4: Visuell prüfen**

`http://localhost:4321` — beim Laden scrambled das Wort "sichtbar" auf, danach wechselt es alle 2.5 Sekunden mit Blur-Morph.

- [ ] **Schritt 5: Commit**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website"
git add src/components/HeroCanvas.astro
git commit -m "feat: add two-phase kinetic typography (scramble + blur morph)"
```

---

## Task 5: Einlauf-Animation (Staggered Fade-in)

**Files:**
- Modify: `src/components/HeroCanvas.astro` — `<script>`-Block erweitern

- [ ] **Schritt 1: Animate-Funktion anhängen**

Im `<script>`-Block, direkt **vor** `scrambleIn(WORDS[0], startCycling);`, folgendes einfügen:

```typescript
// ── 7. Staggered Entrance Animation ─────────────────────────────────────────
function animateIn(el: HTMLElement | null, delay: number, slide = false) {
  if (!el) return;
  el.style.transition = `opacity 0.6s ease ${delay}ms${slide ? `, transform 0.6s ease ${delay}ms` : ''}`;
  // Kurzes rAF damit Browser den Ausgangszustand registriert
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      if (slide) el.style.transform = 'translateY(0)';
    });
  });
}

animateIn(document.getElementById('hero-label'),   0);
animateIn(document.getElementById('hero-line1'),  100, true);
animateIn(document.getElementById('hero-line2'),  200, true);
animateIn(document.getElementById('hero-kinetic'),300, true);
animateIn(document.getElementById('hero-sub'),    450);
animateIn(document.getElementById('hero-cta'),    600);
```

- [ ] **Schritt 2: Build prüfen**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | grep -E "error|Error|Complete"
```

Erwartet: `✓ Completed`

- [ ] **Schritt 3: Visuell prüfen**

`http://localhost:4321` — beim Laden sollten alle Elemente gestaffelt einlaufen: Label → Zeile 1 → Zeile 2 → Kinetische Zeile (mit Scramble) → Subtext → CTA.

- [ ] **Schritt 4: Commit**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website"
git add src/components/HeroCanvas.astro
git commit -m "feat: add staggered entrance animation to hero elements"
```

---

## Task 6: Abschluss – Border entfernen & finaler Check

**Files:**
- Modify: `src/components/HeroCanvas.astro` — optionale Trennlinie nach unten

- [ ] **Schritt 1: Subtile Border nach unten hinzufügen**

In `src/components/HeroCanvas.astro`, das öffnende `<section>`-Tag anpassen — `border-b border-gray-200` ergänzen:

```astro
<section
  id="hero"
  class="relative bg-white overflow-hidden border-b border-gray-200"
  style="min-height: clamp(520px, 80vh, 800px);"
>
```

- [ ] **Schritt 2: Produktions-Build**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website" && npm run build 2>&1 | tail -5
```

Erwartet: `17 page(s) built` — keine Errors.

- [ ] **Schritt 3: Visuell-Checkliste abhaken**

Öffne `http://localhost:4321` und prüfe:
- [ ] Noise Clouds rechts sichtbar, weich, morphend
- [ ] Wolken bewegen sich bei Mausbewegung (Parallax)
- [ ] Beim Load: Label → Headline → Kinetische Zeile scrambled auf
- [ ] Danach: Wörter wechseln alle 2.5s mit Blur Morph
- [ ] CTA-Button sichtbar, verlinkt auf `/kontakt`
- [ ] Trust-Elemente sichtbar
- [ ] Mobile (DevTools): Wolken sichtbar, kein Parallax, Text lesbar

- [ ] **Schritt 4: Final Commit**

```bash
cd "/Users/ptrck/Documents/digipub iota/digipub-website"
git add src/components/HeroCanvas.astro
git commit -m "feat: finalize hero – border, visual QA complete"
```
