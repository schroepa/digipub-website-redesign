# Homepage Rebuild – Design Spec
**Datum:** 2026-06-09
**Seite:** `/` (Startseite)
**Datei:** `src/pages/index.astro` + neue Komponenten

---

## Ziel

Die Startseite von einem Service-Katalog in eine überzeugende, persönliche Konversions-Maschine verwandeln. Zwei gleichwertige Ziele: Erstgespräch buchen (Calendly) UND Glaubwürdigkeit / Markenaufbau. Kein AI Slop, keine generischen Agentur-Floskeln — echte Zahlen, echte Gesichter, echte Sprache.

---

## Farbsystem (verbindlich)

| Farbe | Wert | Rolle |
|-------|------|-------|
| Fast-Schwarz | `#1a1a1a` | Dunkle Sektionen, primäre Buttons, Headlines |
| Weiß | `#ffffff` | Standard-Hintergrund, Kacheln |
| Gray-50 | `#f9fafb` | Abwechselnde helle Sektionen |
| **Marken-Blau** | `#2563eb` | KPI-Zahlen, FAQ Open-State, aktive Links, Inline-Links |
| Gray-600 | `text-gray-600` | Fließtext |
| Gray-400 | `text-gray-400` | Mono-Labels, Subtext, Footer-Spalten-Headings |
| ~~Orange~~ | ~~`#d97706`~~ | ~~nicht verwendet~~ |

**Regel:** Blau ist ausschließlich für Trust-Signale — nie dekorativ. Orange wird nicht verwendet.

---

## Seitenstruktur (vollständig)

```
1. Hero          ✅ bleibt unverändert
2. Logos-Bar     NEU — Kundenlogos grayscale
3. Leistungen    NEU — 3 Kacheln kompakt (ersetzt 5 lange Blöcke)
4. Ergebnisse    NEU — Zahlen aus echten Projekten
5. Team/Faces    NEU — Founder-Moment
6. FAQ           NEU — Accordion, anivahealth-inspiriert
7. Aktuelles     bleibt (dark section, repositioniert)
8. Finaler CTA   NEU — Calendly-Block
9. Footer        NEU — strukturiert, anivahealth-inspiriert
```

---

## Sektion 2: Logos-Bar

**Zweck:** Sofortige Glaubwürdigkeit direkt nach dem Hero-Moment.

**HTML-Struktur:**
```
<section class="bg-white border-b border-gray-100 py-10">
  <div class="max-w-7xl mx-auto px-6">
    <p class="text-xs font-mono text-gray-400 uppercase tracking-widest text-center mb-8">
      Unternehmen, die uns vertrauen
    </p>
    <div class="flex flex-wrap items-center justify-center gap-10 md:gap-16">
      <!-- 4 Logos -->
    </div>
  </div>
</section>
```

**Logos (4 Stück):**
- Portazon / Stadtwerke Trier
- Walter de Gruyter
- Smart Catering (Sander Gruppe)
- Tischlerei Haidacher

**Stil:**
- `filter: grayscale(1); opacity: 0.4;`
- `hover: filter: grayscale(0); opacity: 1;` mit `transition: all 0.3s ease`
- Einheitliche Höhe: `h-8` (32px)
- Auf Mobile: 2×2 Grid, `gap-8`
- Vorerst Platzhalter-Text in `font-semibold text-gray-300` bis echte Logo-Dateien vorliegen

---

## Sektion 3: 3 Kern-Leistungen

**Zweck:** Schnell scanbare Einladung — kein Katalog, sondern eine Auswahl.

**Hintergrund:** `bg-gray-50 border-y border-gray-200`

**Aufbau:**
```
<section class="bg-gray-50 border-y border-gray-200 py-16">
  <div class="max-w-7xl mx-auto px-6">
    <div class="mb-12 max-w-xl">
      <p class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">Leistungen</p>
      <h2 class="text-2xl md:text-3xl font-semibold text-[#1a1a1a] leading-snug">
        Was wir wirklich gut können.
      </h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- 3 Kacheln -->
    </div>
    <!-- Sublink -->
    <p class="mt-8 text-sm text-gray-400">
      Auch: 
      <a href="/leistungen/designsystem" class="text-[#1a1a1a] hover:text-[#2563eb] transition-colors">Designsystem</a> · 
      <a href="/leistungen/automatisierung" class="text-[#1a1a1a] hover:text-[#2563eb] transition-colors">Automatisierung</a>
      <span class="ml-1">→</span>
    </p>
  </div>
</section>
```

**3 Kacheln:**

| # | Titel | Mono-Label | Beschreibung (2 Sätze) | Link |
|---|-------|-----------|------------------------|------|
| 1 | Marke & Positionierung | `Branding` | Wir entwickeln Marken, die Entscheider ansprechen — mit Sprache, Struktur und Gestaltung, die Mehrwert sichtbar macht. Keine Dekoration, sondern Strategie. | `/leistungen/markenaufbau-branding` |
| 2 | KI & Automatisierung | `Technologie` | Wir identifizieren echte Use Cases für KI und Automatisierung — und setzen sie um, bevor sie zum Buzzword werden. Entlastung, die sich im Arbeitsalltag zeigt. | `/leistungen/ki-implementierung` |
| 3 | SEO / GEO | `Sichtbarkeit` | Klassische Suchmaschinenoptimierung trifft Generative Engine Optimization. Wir machen Unternehmen auch in KI-basierten Suchsystemen findbar. | `/leistungen/seo-geo` |

**Kachel-Design:**
```
<div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col gap-4">
  <p class="text-xs font-mono text-gray-400 uppercase tracking-widest">{label}</p>
  <!-- SVG Icon, 24×24, stroke-based, stroke-width="1.5", color="#1a1a1a" -->
  <h3 class="text-lg font-semibold text-[#1a1a1a]">{title}</h3>
  <p class="text-gray-600 text-sm leading-relaxed flex-1">{text}</p>
  <a href={link} class="text-sm font-medium text-[#2563eb] hover:opacity-70 transition-opacity">
    Mehr erfahren →
  </a>
</div>
```

**Icons (SVG, stroke-based, kein Fill):**
- Marke: Kreis mit Pfeil nach außen (Positionierung)
- KI: Verbundene Knoten (Netzwerk/Prozess)
- SEO: Aufsteigender Graph oder Lupe mit Pfeil

---

## Sektion 4: Ergebnisse in Zahlen

**Zweck:** Beweis. Nicht "wir sind gut" — die Zahlen sprechen.

**Hintergrund:** `#1a1a1a` (dark section)

**Aufbau:**
```
<section style="background: #1a1a1a;" class="py-20">
  <div class="max-w-7xl mx-auto px-6">
    <div class="mb-12">
      <p class="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">Ergebnisse</p>
      <h2 class="text-2xl md:text-3xl font-semibold text-white leading-snug">
        Keine Versprechen. Zahlen.
      </h2>
      <p class="text-white/50 text-sm mt-2">Aus echten Projekten — keine Hochglanz-Schätzungen.</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
      <!-- 4 KPIs -->
    </div>
  </div>
</section>
```

**4 KPIs:**

| Zahl | Kontext | Quelle |
|------|---------|--------|
| `70.000+` | App-Downloads | Portazon |
| `+119%` | mehr Klicks in 90 Tagen | Tischlerei Haidacher |
| `5` | Branchen, eine Methode | DigiPub intern |
| `seit 2015` | Erfahrung, die sich auszahlt | DigiPub intern |

**KPI-Design:**
```
<div class="flex flex-col gap-2">
  <span class="text-4xl md:text-5xl font-bold text-[#2563eb]">{zahl}</span>
  <span class="text-xs font-mono text-white/40 uppercase tracking-widest leading-snug">{kontext}</span>
</div>
```

**Wichtig:** Zahlen in `#2563eb` (Marken-Blau) auf dunklem Hintergrund — Trust-Signal, das heraussticht.

---

## Sektion 5: Team / Faces

**Zweck:** Persönlichkeit und Vertrauen. Menschen kaufen von Menschen.

**Hintergrund:** `bg-white`

**Layout:** Asymmetrisch — Bild links (45%), Text rechts (55%)

**Aufbau:**
```
<section class="bg-white py-20">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

      <!-- Bild links -->
      <div class="rounded-xl overflow-hidden shadow-md aspect-[4/5] md:aspect-[3/4]">
        <img src="{unsplash-placeholder}" alt="[Name], DigiPub"
             class="w-full h-full object-cover" loading="lazy" />
      </div>

      <!-- Text rechts -->
      <div>
        <p class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
          Hinter DigiPub
        </p>
        <h2 class="text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-6 leading-snug">
          Ich bin [Name].
        </h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          [3–4 Sätze: Wer du bist, warum du das machst, was dich antreibt.
          Echte Sprache — kein "leidenschaftliches Team"-Bullshit.]
        </p>
        <p class="text-gray-600 leading-relaxed mb-8">
          [Optional: 1–2 Sätze zur Arbeitsweise oder Philosophie.]
        </p>
        <!-- Social Links -->
        <div class="flex items-center gap-4">
          <a href="https://www.linkedin.com/company/digipub-de/"
             class="text-gray-400 hover:text-[#2563eb] transition-colors" aria-label="LinkedIn">
            <!-- LinkedIn SVG Icon, 20×20 -->
          </a>
          <a href="https://www.instagram.com/digipub.de/"
             class="text-gray-400 hover:text-[#1a1a1a] transition-colors" aria-label="Instagram">
            <!-- Instagram SVG Icon, 20×20 -->
          </a>
        </div>
      </div>

    </div>
  </div>
</section>
```

**Unsplash-Placeholder:** Portrait-Format, authentische Atmosphäre (kein Studio-Weiß).
Suchbegriff: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80`
(Wird durch echtes Foto ersetzt sobald vorhanden)

---

## Sektion 6: FAQ

**Zweck:** Einwände ausräumen, bevor sie gestellt werden. Anivahealth-inspiriert.

**Hintergrund:** `bg-gray-50 border-y border-gray-200`

**Layout:** Zwei-Spalten auf Desktop (sticky left / scrollable right), Single-Column auf Mobile

**Aufbau:**
```
<section class="bg-gray-50 border-y border-gray-200 py-20">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-12">

      <!-- Left: Sticky Statement (2/5) -->
      <div class="md:col-span-2 md:sticky md:top-24 self-start">
        <p class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">FAQ</p>
        <h2 class="text-2xl md:text-3xl font-semibold text-[#1a1a1a] leading-snug mb-4">
          Häufige Fragen.
        </h2>
        <p class="text-gray-600 leading-relaxed">
          Was Unternehmen uns am häufigsten fragen, bevor wir zusammenarbeiten.
        </p>
      </div>

      <!-- Right: Accordion (3/5) -->
      <div class="md:col-span-3 flex flex-col">
        <!-- FAQ Items -->
      </div>

    </div>
  </div>
</section>
```

**FAQ-Items (5 Stück):**

| Frage | Antwort |
|-------|---------|
| Was kostet eine Zusammenarbeit mit DigiPub? | Projektbasiert, kein Abomodell. Nach einem kostenlosen Erstgespräch erstellen wir ein konkretes Angebot — transparent, ohne versteckte Kosten. Die Investition hängt vom Umfang ab, nicht von einer Pauschale. |
| Für welche Unternehmen arbeitet ihr? | Für mittelständische Unternehmen, die verstanden haben, dass digitale Sichtbarkeit kein Zufall ist — und bereit sind, das zu ändern. Branche ist zweitrangig, Haltung ist entscheidend. |
| Wie lange dauert es, bis wir erste Ergebnisse sehen? | Das hängt vom Bereich ab. SEO: erste messbare Bewegung nach 6–12 Wochen. KI und Automatisierung: erste Entlastung oft nach wenigen Wochen. Markenaufbau: ein laufender Prozess, keine Einmalmaßnahme. |
| Arbeitet ihr remote oder vor Ort? | Beides. Strategische Gespräche und Workshops gerne vor Ort oder per Video — die tägliche Arbeit läuft remote. Wir sind in Berlin, arbeiten aber mit Unternehmen aus dem gesamten deutschsprachigen Raum. |
| Was unterscheidet euch von einer klassischen Werbeagentur? | Wir verkaufen keine Kampagnen. Wir bauen Systeme — Marken, Prozesse, Strukturen, die ohne uns funktionieren. Unser Ziel ist nicht Abhängigkeit, sondern Kompetenzaufbau. |

**Accordion-Item-Design (Vanilla JS, kein Framework):**
```
<div class="faq-item border-b border-gray-200">
  <button class="faq-trigger w-full flex items-center justify-between py-5 text-left gap-4"
          aria-expanded="false">
    <span class="font-semibold text-[#1a1a1a] text-base">{frage}</span>
    <span class="faq-icon shrink-0 w-5 h-5 text-gray-400 transition-transform duration-300">
      <!-- Plus/Minus SVG -->
    </span>
  </button>
  <div class="faq-content overflow-hidden max-h-0 transition-all duration-300 ease-in-out">
    <p class="text-gray-600 leading-relaxed pb-5">{antwort}</p>
  </div>
</div>
```

**Open-State:**
- `border-l-2 border-[#2563eb]` auf dem geöffneten Item (linke blaue Border als Trust-Signal)
- `faq-icon` rotiert 45° (Plus wird zu ×)
- `max-h` Transition für smooth Öffnen

---

## Sektion 7: Aktuelles (unverändert, repositioniert)

Bleibt wie aktuell implementiert. Wird nach FAQ platziert.
Hintergrund: `#1a1a1a`, 3 Post-Kacheln, Directus-ready.

---

## Sektion 8: Finaler CTA / Calendly-Block

**Zweck:** Conversion für warme Besucher am Ende der Seite.

**Hintergrund:** `bg-gray-50 border-t border-gray-200`

**Layout:** Zwei-Spalten — links emotionaler Anker, rechts Calendly

```
<section class="bg-gray-50 border-t border-gray-200 py-20">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

      <!-- Left: Emotionaler Anker -->
      <div>
        <p class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
          Nächster Schritt
        </p>
        <h2 class="text-2xl md:text-3xl font-semibold text-[#1a1a1a] leading-snug mb-4">
          Lass uns reden.
        </h2>
        <p class="text-gray-600 leading-relaxed mb-6">
          Kein Pitch, kein Angebot beim ersten Gespräch.
          Wir hören erst zu — dann reden wir über Lösungen.
        </p>
        <p class="text-sm text-gray-400">
          Lieber eine Mail?
          <a href="mailto:kontakt@digipub.de" class="text-[#2563eb] hover:opacity-70 transition-opacity">
            kontakt@digipub.de
          </a>
        </p>
      </div>

      <!-- Right: Calendly Embed -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
        <!-- Calendly inline embed -->
        <div class="calendly-inline-widget w-full h-full min-h-[500px]"
             data-url="https://calendly.com/nigronet?embed_domain=digipub.de&embed_type=Inline"
             style="min-width:320px;height:500px;">
        </div>
        <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
      </div>

    </div>
  </div>
</section>
```

---

## Sektion 9: Footer

**Hintergrund:** `#1a1a1a`

**Aufbau:**
```
<footer style="background: #1a1a1a;">
  <div class="max-w-7xl mx-auto px-6 py-16">

    <!-- Top: Tagline + Logo -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 pb-12 border-b border-white/10">
      <a href="/">
        <img src="/logo.svg" alt="DigiPub" class="h-6 w-auto brightness-0 invert" />
      </a>
      <p class="text-white/50 text-sm max-w-sm">
        Sichtbarkeit ist kein Zufall. Wir machen sie zur Strategie.
      </p>
    </div>

    <!-- Columns -->
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
          <li><a href="https://www.linkedin.com/company/digipub-de/" class="text-white/60 text-sm hover:text-white transition-colors">LinkedIn</a></li>
          <li><a href="https://www.instagram.com/digipub.de/" class="text-white/60 text-sm hover:text-white transition-colors">Instagram</a></li>
          <li><a href="https://www.facebook.com/DigiPubSeo" class="text-white/60 text-sm hover:text-white transition-colors">Facebook</a></li>
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
      <p class="text-xs text-white/30">&copy; 2025 DigiPub. Alle Rechte vorbehalten.</p>
      <p class="text-xs text-white/30">Made with &#9825; in Berlin</p>
    </div>

  </div>
</footer>
```

---

## Komponenten-Architektur

### Neue/geänderte Dateien

| Datei | Aktion | Inhalt |
|-------|--------|--------|
| `src/components/LogosBar.astro` | NEU | Kundenlogos-Sektion |
| `src/components/Leistungen3.astro` | NEU | 3 Kern-Leistungen Kacheln |
| `src/components/Ergebnisse.astro` | NEU | KPI-Zahlen dark section |
| `src/components/Team.astro` | NEU | Founder-Moment |
| `src/components/FAQ.astro` | NEU | Accordion FAQ + JS |
| `src/components/CTACalendly.astro` | NEU | Finaler CTA + Calendly |
| `src/components/Footer.astro` | NEU | Site Footer |
| `src/layouts/Layout.astro` | ÄNDERN | Footer aus Layout auslagern oder Footer-Komponente einbinden |
| `src/pages/index.astro` | ÄNDERN | Neue Komponenten einbinden, alte Leistungs-Blöcke + USPs entfernen |

### Was entfernt wird aus `index.astro`
- Die 5 langen alternierenden Bild/Text-Blöcke (`leistungen.map(...)`)
- Die generischen USP-Kacheln am Ende

### Was bleibt
- `<HeroCanvas />` — unverändert
- `Aktuelles`-Sektion — unverändert, nur repositioniert (nach FAQ)

---

## Implementierungs-Hinweise

1. **Keine deutschen Anführungszeichen** in JS-Strings — HTML-Entities verwenden
2. **Tailwind 4** — kein `tailwind.config.js`, kein `@apply`
3. **FAQ-Accordion** — Vanilla JS im `<script>`-Tag, kein React
4. **Calendly-Script** — nur einmal laden, async
5. **Bilder** — `loading="lazy"` außer Hero. Unsplash-Placeholder bis echte Fotos vorliegen
6. **Logo-Placeholder** — bis echte SVG/PNG-Logos vorliegen: Firmenname als `font-semibold text-gray-200 text-sm` Text
7. **Footer** — als eigene Komponente `Footer.astro`, wird in `Layout.astro` eingebunden (ersetzt eventuelle bestehende Footer-Elemente)
