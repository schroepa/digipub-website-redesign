# DigiPub – Projektdokumentation für Claude Code

## Projektübersicht

Neuimplementierung von digipub.de als performante Astro 5 Site.
Ersetzt WordPress + Elementor durch ein modernes, schnelles Setup.

**Stack:** Astro 5 · React 19 · TypeScript · Tailwind CSS 4 · Directus 11 · Vercel · ShadCN/UI


**Referenz-Seite:** https://digipub.de
**Live:** https://digipub-iota.vercel.app
**GitHub:** https://github.com/nigro-git/digipub
**Directus CMS:** https://directus.deutsche-musik.de/admin

---

## Design-Prinzipien

### Farben
- **Hintergrund:** `#ffffff` (weiß) und `#f9fafb` (gray-50) im Wechsel
- **Text:** `#1a1a1a` (fast schwarz) – KEIN reines #000000
- **Navigation:** `#1a1a1a` Hintergrund, weißer Text
- **Dunkle Sektionen:** `style="background:#1a1a1a"` mit weißem Text
- **Grau-Sektionen:** `class="bg-gray-50 border-y border-gray-200"`
- **KEIN Dunkelgrün** – das war die alte WordPress-Farbe, wird nicht mehr verwendet
- **Akzentfarbe:** Orange `#d97706` nur für CTAs auf dunklem Hintergrund ("Erzähl mal!")

### Typografie
- **Font:** Geist Variable (Sans) + Geist Mono
- **H1:** `text-5xl md:text-7xl font-semibold text-[#1a1a1a] tracking-tight`
- **H2:** `text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-4 leading-snug`
- **Fließtext:** `text-gray-600 leading-relaxed`
- **Bold-Statement:** `font-semibold text-[#1a1a1a]`
- **Mono-Labels:** `text-xs font-mono text-gray-400 uppercase tracking-widest`

### Abstände
- **Sektionen:** `py-16` oder `py-20`
- **Max-Width:** `max-w-7xl mx-auto px-6` auf allen Sektionen
- **Zwischen Bild/Text-Blöcken:** `space-y-20`
- **Grid-Gap:** `gap-12` für 2-Spalten, `gap-8` für 3-Spalten

### Komponenten-Muster
```
// Bild + Text nebeneinander (wie Startseite)
<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
  <div> <!-- Text --> </div>
  <div class="rounded-xl overflow-hidden shadow-md"> <!-- Bild --> </div>
</div>

// Weiße Kachel (USPs, Leistungen)
<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">

// Dunkle Kachel (Wieso DigiPub etc.)
<div class="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/30 transition-colors">

// Button hell
style="background:#1a1a1a;" class="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded hover:opacity-80 transition-opacity"

// Hero-Sektion
<section class="bg-white py-16 text-center border-b border-gray-200">
```

---

## Seitenstruktur

### Fertige Seiten
- `/` – Startseite ✅ (Referenz für Design)
- `/leistungen` – Übersicht ✅
- `/leistungen/markenaufbau-branding` – in Arbeit
- `/leistungen/seo-geo` – Platzhalter
- `/leistungen/designsystem` – Platzhalter
- `/leistungen/automatisierung` – Platzhalter
- `/leistungen/ki-implementierung` – Platzhalter
- `/aktuelles` – Directus-ready ✅
- `/aktuelles/[slug]` – Directus-ready ✅
- `/case-studies` – Platzhalter

### Noch zu bauen
- `/case-studies/[slug]` × 5
- `/referenzen`
- `/kontakt` + Impressum
- `/datenschutzerklaerung`

---

## Startseite als Design-Referenz



Aufbau Startseite:
1. Hero: zentriert, `border-b border-gray-200`
2. Leistungen: Bild/Text abwechselnd, `space-y-20`
3. Aktuelles: dunkle Sektion `background:#1a1a1a`
4. USPs: `bg-gray-50 border-y border-gray-200`, weiße Kacheln

---

## Leistungsseiten – Aufbau-Template

Jede Leistungsseite folgt diesem Schema (angelehnt an Startseite-Stil):

```
1. Hero: Titel + Untertitel (zentriert, border-b)
2. Intro: Bild rechts + Text links
3. Key Takeaways: weiße Kacheln 3-spaltig (bg-gray-50)
4. Vertiefung: 2× Bild/Text-Blöcke
5. Unser Ansatz: dark section (#1a1a1a)
   → inkl. DU? + Erzähl mal! CTAs
6. Leistungen: weiße Kacheln 2-spaltig mit Ziel-Statement
7. Wieso DigiPub: dark section mit weißen/transparenten Kacheln
8. Final CTA: DU?-Box + Calendly nebeneinander
```

---

## Directus CMS

**URL:** https://directus.deutsche-musik.de
**Collections:**
- `digipub_posts` – Blog-Artikel
  - Felder: `title`, `slug`, `excerpt`, `content` (WYSIWYG/HTML), `cover_image` (Asset-ID), `category`, `read_time`, `status`, `date_created`
- `digipub_case_studies` – geplant
- `digipub_leistungen` – geplant (aktuell statisch)

**Assets:** `https://directus.deutsche-musik.de/assets/[ID]?width=600&format=webp`

**Wichtig:** Inhalte in `src/lib/directus.ts`. Bei Directus-Fehler wird ein leerer Array zurückgegeben (kein Build-Fehler).

---

## Deployment

**Vercel** – Auto-Deploy bei Push auf `main`
- Env-Variablen in Vercel: `DIRECTUS_URL`, `DIRECTUS_TOKEN`
- Build-Command: `npm run build` (Astro static)

**Workflow:**
```bash
git add .
git commit -m "beschreibung"
git push
# → Vercel baut automatisch, ca. 1 Minute
```

---

## Bilder

Alle Bilder kommen direkt von der bestehenden WordPress-Seite:
`https://www.digipub.de/wp-content/uploads/...`

Wichtige Bild-URLs:
```
Hero/Markenaufbau:
https://www.digipub.de/wp-content/uploads/2025/11/u2637499129_Aufsteigende_Digitale_Treppe_in_den_Himmel_-ar_1_82697a3c-1fc2-462e-9cb1-95b02a9d72c2_1-1024x574.png

Designsystem/Netzwerk:
https://www.digipub.de/wp-content/uploads/2025/11/u2637499129_Netzwerk_aus_Knoten_und_Kanten_in_Wolkenform_-ar_e39ad9a2-5a17-4a91-a5d9-f27d771febfe_2-1024x574.png

KI/Matrix:
https://www.digipub.de/wp-content/uploads/2025/11/u2637499129_digitale_Matrix_dreht_sich_um_zufriedenen_Nutzer__083b13f9-3139-4de5-9ac3-47d2e29efa3c_0-1024x574.png

Automatisierung/Nodes:
https://www.digipub.de/wp-content/uploads/2025/11/u2637499129_httpss.mj_.runp0dDZhJI-sA_Bitte_ein_Agent_workflow_75aa457d-7289-4910-8b5c-85549dd31453_0-1024x574.png

SEO:
https://www.digipub.de/wp-content/uploads/2025/11/u2637499129_Aufsteigende_Digitale_Treppe_in_den_Himmel_-ar_1_1092d6df-3801-4deb-af05-16387df12f0c_0-1024x574.png

Aktuelles/SEO-Relaunch:
https://www.digipub.de/wp-content/uploads/2025/04/u2637499129_Bitte_kreire_mir_ein_Bild_zum_Thema_Relaunch_SEO._c0329f22-7da5-4fc7-a629-f331caee7e41_2-1-1024x574.png

Logo:
https://www.digipub.de/wp-content/uploads/2021/07/DIGI_PUB1.png

Favicon:
https://www.digipub.de/wp-content/uploads/2026/05/DIGI_PUB_Logo-Favicon_32px.png
```

---

## Inhalte (von digipub.de)

### Navigation
Home · Leistungen (Dropdown) · Case Studies · Referenzen · Kontakt

### Leistungen (5 Bereiche)
1. **Marken-Aufbau / Branding** `/leistungen/markenaufbau-branding`
2. **SEO / GEO** `/leistungen/seo-geo`
3. **Designsystem** `/leistungen/designsystem`
4. **Automatisierung** `/leistungen/automatisierung`
5. **KI-Implementierung** `/leistungen/ki-implementierung`

Alle Texte von: https://www.digipub.de/markenaufbau-branding/ etc.

### Kontakt / Calendly
```
https://calendly.com/nigronet?embed_domain=www.digipub.de&embed_type=Inline
```

### Social Media
- Facebook: https://www.facebook.com/DigiPubSeo
- Instagram: https://www.instagram.com/digipub.de/
- LinkedIn: https://www.linkedin.com/company/digipub-de/

---

## Wichtige Hinweise für Claude Code

1. **Keine deutschen Anführungszeichen** (`„..."`) in JavaScript-Strings – sie brechen den Build. Stattdessen HTML-Entities (`&bdquo;` / `&rdquo;`) in HTML oder normale ASCII-Quotes in JS.

2. **Tailwind 4** – kein `tailwind.config.js`, funktioniert via Vite-Plugin. Keine `@apply` nutzen.

3. **Kein Dunkelgrün** – `#2d4a3e` oder ähnliche Grüntöne sind die alte WordPress-Farbe und werden nicht verwendet.

4. **Immer `max-w-7xl mx-auto px-6`** als Container.

5. **Bilder immer** mit `loading="lazy"` außer Hero-Bilder (`loading="eager"`).

6. **Astro-Arrays mit Umlauten** – in `.map()` Strings mit Umlauten funktionieren, aber Sonderzeichen wie `„"` nicht. Umlaute (ä, ö, ü) sind OK.
