# Produkte-Bereich (Migration nach /produkte/*) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produkt- und Need-Seiten von `/leistungen/seo-geo/*` in einen eigenen `/produkte/*`-Bereich umziehen, ein vollwertiges Produktübersichts-Pillar und eine `/produkte`-Einstiegsseite bauen, die Leistungsseite auf ihre Haltungs-Rolle zurückbauen (mit Brücken-Modul) und den Header um den Menüpunkt "Produkte" mit Teaser-Microcopy erweitern.

**Architecture:** Reine Umzugs- und Assemblier-Arbeit: Die beiden dynamischen Routen werden per `git mv` verschoben (Import-Tiefe bleibt identisch, nur Pfad-Konstanten/Breadcrumbs/Schema-URLs ändern sich). Das neue Pillar `/produkte/seo-geo` assembliert ausschließlich vorhandene Komponenten (`Breadcrumb`, `ProduktDetails`, `SystemDiagramm`, `ProduktNavigation`, `CaseStudyTabs`, `FaqAkkordeon`) mit Wireframe-Inhalten; drei Blöcke ziehen von der Leistungsseite dorthin um. Keine neuen Komponenten, keine Datenmodell-Änderungen außer einem FAQ-Export-Umzug.

**Tech Stack:** Astro 5 (SSG), TypeScript, Tailwind CSS 4 (Design-Tokens), kein neues Package.

**Referenz-Spec:** `docs/superpowers/specs/2026-07-04-produkte-bereich-migration-design.md`

---

## Voraussetzungen & Konventionen

- **Dev-Server:** läuft bereits (`npm run dev`, `http://localhost:4321`) — niemals starten/stoppen/neustarten; neue/verschobene Dateien unter `src/pages/` werden automatisch erkannt.
- **TypeScript-Check:** `npx astro check` crasht in dieser Umgebung reproduzierbar mit OOM (bekannt, projektunabhängig — kein Blocker). Fallback für `.ts`-Dateien: `npx tsc --noEmit --strict --target es2022 --module esnext --moduleResolution bundler --skipLibCheck <dateien>`. `.astro`-Dateien werden über das gerenderte HTML verifiziert (curl gegen den laufenden Dev-Server).
- **Grep-Konvention:** gerendertes HTML ist einzeilig — Vorkommen mit `grep -o "..." | wc -l` zählen, nicht `grep -c`.
- **Stil-Regeln:** nur Design-Tokens (`text-foreground`, `text-primary`, `text-muted-foreground`, `border-border`, `bg-background`, `--text-*`); keine Hex-Farben, keine `gray-*`, keine Schatten. Heading-Hierarchie: h1 → h2 (Block-Label als Mono-Kicker gestylt) → h3.
- **Typografie:** – „ “ → · müssen exakt erhalten bleiben.
- Alle Commits enden mit `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Dynamische Routen nach `/produkte/seo-geo/` verschieben

**Files:**
- Move: `src/pages/leistungen/seo-geo/[produkt].astro` → `src/pages/produkte/seo-geo/[produkt].astro`
- Move: `src/pages/leistungen/seo-geo/[produkt]/[need].astro` → `src/pages/produkte/seo-geo/[produkt]/[need].astro`
- Modify: beide Dateien (nur Pfad-Konstanten, Breadcrumbs, Schema-URLs, Rücklinks)

Die Import-Pfade (`../../../` bzw. `../../../../`) bleiben unverändert — die Verschachtelungstiefe ist vor und nach dem Umzug identisch.

- [ ] **Step 1: Dateien verschieben**

```bash
mkdir -p "src/pages/produkte/seo-geo/[produkt]"
git mv "src/pages/leistungen/seo-geo/[produkt].astro" "src/pages/produkte/seo-geo/[produkt].astro"
git mv "src/pages/leistungen/seo-geo/[produkt]/[need].astro" "src/pages/produkte/seo-geo/[produkt]/[need].astro"
rmdir "src/pages/leistungen/seo-geo/[produkt]" "src/pages/leistungen/seo-geo" 2>/dev/null || true
```

- [ ] **Step 2: `[produkt].astro` anpassen (4 Edits)**

**(a)** Pfad-Konstante:
```astro
const pfad = `/leistungen/seo-geo/${p.slug}`;
```
→
```astro
const pfad = `/produkte/seo-geo/${p.slug}`;
```

**(b)** Schema-Breadcrumb (jetzt 4 Ebenen, URL-spiegelnd):
```astro
const breadcrumbSchema = buildBreadcrumbSchema([
  { label: "DigiPub", url: new URL("/", Astro.site).href },
  { label: "SEO/GEO", url: new URL("/leistungen/seo-geo", Astro.site).href },
  { label: p.name, url: pageUrl },
]);
```
→
```astro
const breadcrumbSchema = buildBreadcrumbSchema([
  { label: "DigiPub", url: new URL("/", Astro.site).href },
  { label: "Produkte", url: new URL("/produkte", Astro.site).href },
  { label: "SEO/GEO", url: new URL("/produkte/seo-geo", Astro.site).href },
  { label: p.name, url: pageUrl },
]);
```

**(c)** Sichtbare Breadcrumb:
```astro
    <Breadcrumb
      items={[
        { label: "DigiPub", href: "/" },
        { label: "SEO/GEO", href: "/leistungen/seo-geo" },
        { label: p.name },
      ]}
    />
```
→
```astro
    <Breadcrumb
      items={[
        { label: "DigiPub", href: "/" },
        { label: "Produkte", href: "/produkte" },
        { label: "SEO/GEO", href: "/produkte/seo-geo" },
        { label: p.name },
      ]}
    />
```

**(d)** Verwandte-Produkte-Pills und Rücklink — alle drei Vorkommen von `/leistungen/seo-geo` im Template auf `/produkte/seo-geo` umstellen:
```astro
            href={e.slug ? `/leistungen/seo-geo/${e.slug}` : "/leistungen/seo-geo"}
```
→
```astro
            href={e.slug ? `/produkte/seo-geo/${e.slug}` : "/produkte/seo-geo"}
```
und
```astro
        <a href="/leistungen/seo-geo" class="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground">
          Oder zurück zur Übersicht: SEO/GEO – alle Produkte →
        </a>
```
→
```astro
        <a href="/produkte/seo-geo" class="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground">
          Oder zurück zur Übersicht: SEO/GEO – alle Produkte →
        </a>
```

- [ ] **Step 3: `[need].astro` anpassen (3 Edits)**

**(a)** Pfad-Konstante:
```astro
const produktPfad = `/leistungen/seo-geo/${p.slug}`;
```
→
```astro
const produktPfad = `/produkte/seo-geo/${p.slug}`;
```

**(b)** Schema-Breadcrumb (jetzt 5 Ebenen):
```astro
const breadcrumbSchema = buildBreadcrumbSchema([
  { label: "DigiPub", url: new URL("/", Astro.site).href },
  { label: "SEO/GEO", url: new URL("/leistungen/seo-geo", Astro.site).href },
  { label: p.name, url: new URL(produktPfad, Astro.site).href },
  { label: n.name, url: pageUrl },
]);
```
→
```astro
const breadcrumbSchema = buildBreadcrumbSchema([
  { label: "DigiPub", url: new URL("/", Astro.site).href },
  { label: "Produkte", url: new URL("/produkte", Astro.site).href },
  { label: "SEO/GEO", url: new URL("/produkte/seo-geo", Astro.site).href },
  { label: p.name, url: new URL(produktPfad, Astro.site).href },
  { label: n.name, url: pageUrl },
]);
```

**(c)** Sichtbare Breadcrumb:
```astro
    <Breadcrumb
      items={[
        { label: "DigiPub", href: "/" },
        { label: "SEO/GEO", href: "/leistungen/seo-geo" },
        { label: p.name, href: produktPfad },
        { label: n.name },
      ]}
    />
```
→
```astro
    <Breadcrumb
      items={[
        { label: "DigiPub", href: "/" },
        { label: "Produkte", href: "/produkte" },
        { label: "SEO/GEO", href: "/produkte/seo-geo" },
        { label: p.name, href: produktPfad },
        { label: n.name },
      ]}
    />
```
(Der Rücklink am Seitenende nutzt bereits `{produktPfad}` und zieht automatisch mit.)

- [ ] **Step 4: Verifizieren**

```bash
curl -s -o /dev/null -w "neu Produkt: %{http_code}\n" http://localhost:4321/produkte/seo-geo/seo-relaunch-begleitung
curl -s -o /dev/null -w "neu Need:    %{http_code}\n" http://localhost:4321/produkte/seo-geo/seo-relaunch-begleitung/niemand-denkt-an-seo-beim-relaunch
curl -s -o /dev/null -w "alt Produkt: %{http_code}\n" http://localhost:4321/leistungen/seo-geo/seo-relaunch-begleitung
curl -s http://localhost:4321/produkte/seo-geo/seo-relaunch-begleitung | grep -o 'href="/leistungen/seo-geo' | wc -l
```
Expected: neue URLs `200`, alte URL `404`, letzter Zähler `0` (keine Alt-Links mehr auf der Produktseite).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: Produkt-/Need-Routen nach /produkte/seo-geo/* verschoben (Pfade, Breadcrumbs, Schema)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Pillar-FAQ-Daten von `leistungen-data.ts` nach `produkte-data.ts` umziehen

**Files:**
- Modify: `src/lib/produkte-data.ts` (neuer Export ans Dateiende)
- Modify: `src/lib/leistungen-data.ts` (`faq_items` aus dem `seo-geo`-Eintrag entfernen)

- [ ] **Step 1: Export in `produkte-data.ts` ergänzen** — ans Ende der Datei (nach `getProdukt`):

```ts
/** FAQ der Produktübersicht SEO/GEO (Wireframe Block 8) – lebt bei der
 *  Produktarchitektur, nicht bei den Haltungs-Seiten. */
export const seoGeoPillarFaq: { frage: string; antwort: string }[] = [
  {
    frage: "Was ist der Unterschied zwischen SEO und GEO?",
    antwort:
      "SEO optimiert Seiten für klassische Suchmaschinen wie Google – mit dem Ziel, in den organischen Ergebnissen zu erscheinen. GEO (Generative Engine Optimization) geht weiter: es optimiert Inhalte so, dass KI-Systeme wie ChatGPT, Perplexity oder Google AI Overviews sie als vertrauenswürdige Quelle zitieren. Entscheidend: Ohne solides technisches SEO-Fundament kann keine GEO-Maßnahme greifen. Die Reihenfolge ist keine Empfehlung, sondern eine technische Voraussetzung.",
  },
  {
    frage: "Für welche Unternehmensgrößen ist DigiPub geeignet?",
    antwort:
      "Primär für KMU und Mittelstand im DACH-Raum mit 10 bis 1.500 Mitarbeitenden – von Startups, die ein solides digitales Fundament benötigen, bis zu Mittelständlern oder Verlagen. DigiPub arbeitet als Einzelberater oder mit einem flexiblen Netzwerk – ohne die Fixkosten einer Agentur, mit der Tiefe eines Senior-Profils.",
  },
  {
    frage: "Wie lange dauert ein typisches SEO-Projekt bei DigiPub?",
    antwort:
      "Ein SEO-Grundlagen-Audit ist in 2–3 Wochen abgeschlossen und liefert einen priorisierten Maßnahmenplan. Sprint-Projekte laufen 4–8 Wochen. Für nachhaltige Sichtbarkeit empfiehlt sich ein monatliches Steuerungsmandat – die ersten messbaren Ergebnisse sind bei konsequenter Umsetzung nach 3–6 Monaten sichtbar.",
  },
  {
    frage: "Arbeitet DigiPub auch mit unserer bestehenden Webagentur zusammen?",
    antwort:
      "Ja – das ist der häufigste Fall. DigiPub liefert die strategische und technische SEO-Grundlage als Briefing-Dokument, das die Agentur direkt umsetzen kann. Eine direkte Abstimmung mit der Agentur ist auf Wunsch möglich.",
  },
];
```

- [ ] **Step 2: `faq_items` aus `leistungen-data.ts` entfernen** — im `"seo-geo"`-Eintrag die komplette `faq_items: [ ... ],`-Property löschen (die 4 Einträge mit exakt denselben Texten wie oben; nichts anderes in der Datei anfassen).

- [ ] **Step 3: TypeScript-Check**

Run: `npx tsc --noEmit --strict --target es2022 --module esnext --moduleResolution bundler --skipLibCheck src/lib/produkte-data.ts`
Expected: keine Ausgabe.

- [ ] **Step 4: Verifizieren (FAQ verschwindet von der Leistungsseite — erwarteter Zwischenzustand)**

```bash
curl -s http://localhost:4321/leistungen/seo-geo | grep -o "faq-akkordeon" | wc -l
```
Expected: `0` (der Guard `d.faq_items && ...` greift; das FAQ erscheint in Task 3 auf dem Pillar wieder).

- [ ] **Step 5: Commit**

```bash
git add src/lib/produkte-data.ts src/lib/leistungen-data.ts
git commit -m "refactor: Pillar-FAQ von leistungen-data nach produkte-data umgezogen

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Pillar-Seite `/produkte/seo-geo` (index.astro)

**Files:**
- Create: `src/pages/produkte/seo-geo/index.astro`

Das vollständige Wireframe-Pillar. Astro erlaubt `index.astro` neben `[produkt].astro` im selben Verzeichnis. Die Frontmatter-Daten (caseStudies, systemStufen, systemCaption, produktCards) sind bewusst identisch zu den in Task 4 von der Leistungsseite entfernten — kurzzeitige Duplizierung zwischen Task 3 und 4 ist beabsichtigt.

- [ ] **Step 1: Seite anlegen**

```astro
---
import Layout from "../../../layouts/Layout.astro";
import Section from "../../../components/ui/Section.astro";
import Breadcrumb from "../../../components/produkte/Breadcrumb.astro";
import ProduktDetails from "../../../components/produkte/ProduktDetails.astro";
import SystemDiagramm from "../../../components/produkte/SystemDiagramm.astro";
import ProduktNavigation from "../../../components/produkte/ProduktNavigation.astro";
import CaseStudyTabs from "../../../components/produkte/CaseStudyTabs.astro";
import FaqAkkordeon from "../../../components/produkte/FaqAkkordeon.astro";
import { seoGeoKatalog, seoGeoPillarFaq } from "../../../lib/produkte-data";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildKatalogSchema,
} from "../../../lib/schemaOrg";

const pfad = "/produkte/seo-geo";
const pageUrl = new URL(pfad, Astro.site).href;

const produktCards = seoGeoKatalog.map((e) => ({
  tag: e.tag,
  title: e.title,
  quote: e.frage,
  href: e.slug ? `${pfad}/${e.slug}` : (e.href ?? "#"),
  cta: e.cta,
}));

const katalogSchema = buildKatalogSchema(seoGeoKatalog, pageUrl, pageUrl);
const faqSchema = buildFaqPageSchema(seoGeoPillarFaq);
const breadcrumbSchema = buildBreadcrumbSchema([
  { label: "DigiPub", url: new URL("/", Astro.site).href },
  { label: "Produkte", url: new URL("/produkte", Astro.site).href },
  { label: "SEO/GEO", url: pageUrl },
]);

// ⚠ Dev-Check: Zahlen aus Case Studies verifizieren (Formel: konkrete Zahl
// + benannte Entität, keine Hochrechnung ohne Quellenangabe).
const metriken = [
  { label: "Projekt", value: "12 Märkte", sub: "Weber-Grill EMEA: Rankings in 6 Monaten gesichert" },
  { label: "Projekt", value: "0 Relaunch-Verlust", sub: "Haidacher: Rankings ohne Redesign stabilisiert" },
  { label: "Projekt", value: "Inhouse-fähig", sub: "Cornelsen: SEO-Kompetenz im Team verankert" },
  { label: "Methode", value: "Need-First", sub: "Portazon: Features aus Suchdaten priorisiert" },
];

const abgrenzung = {
  nicht: [
    "Klassische SEO-Agentur mit Junior-Teams",
    "Retainer ohne Strategie",
    "Copy-Paste aus US-Playbooks",
    "„Holistische Lösungen“",
  ],
  sondern: [
    "Strategischer Sparringspartner",
    "Strategie und Umsetzung in einer Hand",
    "DACH-Markt-Expertise",
    "Netzwerk-Modell, das skaliert",
  ],
};

const fuerWen = {
  geeignet: [
    "KMU und Mittelstand im DACH-Raum (10–1.500 MA)",
    "Unternehmen, die Strategie und Umsetzung brauchen",
    "Teams, die intern befähigt werden wollen",
    "Startups mit Rundumbedarf (Analytics, Ads, SEO)",
    "Mittelständler mit komplexen digitalen Projekten",
  ],
  wenigerGeeignet: [
    "Unternehmen, die nur Texte produzieren lassen wollen",
    "Suche nach der günstigsten SEO-Option ohne Strategie",
    "Projekte ohne Bereitschaft zur internen Mitwirkung",
  ],
};

// ⚠ Dev-Check: Cornelsen + Smart Catering ergänzen, sobald verifizierte
// Case-Inhalte vorliegen (Wireframe sieht 5 Tabs vor).
const caseStudies = [
  {
    name: "Weber-Grill EMEA",
    headline: "Weber-Grill EMEA – Internationaler SEO-Rollout",
    ausgangslage: "Rankings in 12 europäischen Märkten instabil, internationales Sichtbarkeits-Chaos nach mehreren Agenturwechseln.",
    vorgehen: "Technisches SEO-Audit, hreflang-Bereinigung, Aufbau eines internen Redaktionsprozesses, Agentur-Koordination über 6 Monate.",
    ergebnis: "Rankings in 12 Ländern gesichert und ausgebaut – ohne Relaunch, ohne Agenturwechsel.",
    meta: [
      { label: "Branche", value: "Konsumgüter" },
      { label: "Scope", value: "EMEA, 12 Länder" },
      { label: "Dauer", value: "6 Monate" },
      { label: "Ergebnis", value: "Rankings stabilisiert" },
    ],
  },
  {
    name: "Haidacher",
    headline: "Haidacher – Sichtbarkeit für exklusives Handwerk",
    ausgangslage: "Eine exklusive Handwerkstradition, die online schlicht nicht zu finden war.",
    vorgehen: "Sichtbarkeit systematisch aufgebaut – ohne das Erscheinungsbild anzutasten.",
    ergebnis: "Erstmals relevante Rankings. Doppelte Sichtbarkeit. Ganz im Stil des Hauses.",
    meta: [
      { label: "Branche", value: "Handwerk" },
      { label: "Scope", value: "Südtirol" },
      { label: "Ergebnis", value: "Rankings ohne Redesign stabilisiert" },
    ],
  },
  {
    name: "Portazon",
    headline: "Portazon – Smart City Super App",
    ausgangslage: "Eine neue Plattform mit großer Idee – aber ohne Struktur, die sie trägt.",
    vorgehen: "Content-Architektur, Partnerstrategie und Monitoring aufgebaut.",
    ergebnis: "Portazon ist heute sichtbar – lokal verankert, digital durchdacht.",
    meta: [
      { label: "Branche", value: "Smart City" },
      { label: "Scope", value: "Trier" },
      { label: "Ergebnis", value: "Feature-Backlog aus Suchdaten" },
    ],
  },
];

const systemStufen = [
  { title: "SEO-Grundlagen", sub: "Technisches Fundament und strukturierte Inhalte" },
  { title: "Content-Architektur", sub: "Seitentypen entlang echter Suchintentionen" },
  { title: "GEO/AEO", sub: "Sichtbarkeit in KI-gestützten Suchsystemen" },
];
const systemCaption =
  "Das Diagramm zeigt das DigiPub-Sichtbarkeits-System: Technisches SEO und strukturierte Inhalte bilden die Grundlage. Darauf aufbauend optimiert GEO/AEO die Sichtbarkeit in KI-gestützten Suchanfragen (ChatGPT, Perplexity, Google AI Overviews). Ohne solides Fundament ist KI-Optimierung nicht möglich – diese Reihenfolge ist eine technische Notwendigkeit.";

const andereBereiche = [
  { label: "Markenaufbau", href: "/leistungen/markenaufbau-branding" },
  { label: "Designsystem", href: "/leistungen/designsystem" },
  { label: "Automatisierung", href: "/leistungen/automatisierung" },
  { label: "KI-Implementierung", href: "/leistungen/ki-implementierung" },
];
---

<Layout
  title="SEO/GEO-Produkte | Buchbare Sprints, Audits & Retainer | DigiPub"
  description="Digitale Sichtbarkeit für KMU und Mittelstand: buchbare SEO- und GEO-Produkte mit definiertem Format, Umfang und Preis – vom Grundlagen-Audit bis zum Retainer."
>
  <script is:inline type="application/ld+json" set:html={JSON.stringify(katalogSchema)} />
  <script is:inline type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
  <script is:inline type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />

  <Section id="produktuebersicht">
    <Breadcrumb
      items={[
        { label: "DigiPub", href: "/" },
        { label: "Produkte", href: "/produkte" },
        { label: "SEO/GEO" },
      ]}
    />

    <p class="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-primary">
      <span class="text-muted-foreground">Produktübersicht</span> &nbsp;·&nbsp; SEO/GEO
    </p>

    <!-- H1 + Answer-First: GEO-Pflicht – kein Element zwischen H1 und Antwort -->
    <h1
      class="max-w-4xl font-bold text-foreground"
      style="font-size: var(--text-section); line-height: 1.08; letter-spacing: -0.02em;"
    >
      Digitale Sichtbarkeit für KMU und Mittelstand – in Suchmaschinen und KI-Systemen.
    </h1>
    <p
      class="mt-6 max-w-2xl border-l-2 border-primary pl-5 leading-relaxed text-foreground/75"
      style="font-size: var(--text-body);"
    >
      DigiPub entwickelt SEO- und GEO-Strategien für Unternehmen im DACH-Raum, die
      nicht nur bei Google ranken wollen, sondern auch in ChatGPT, Perplexity und
      Google AI Overviews als Autorität zitiert werden. Grundlage ist immer das
      technische und inhaltliche Fundament – ohne das ist jede KI-Optimierung wirkungslos.
    </p>

    <!-- Ergebnis-Metriken (Wireframe Block 2) -->
    <div class="mt-14">
      <h2 class="mb-4 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Ergebnisse aus Projekten</h2>
      <ProduktDetails cells={metriken} />
    </div>

    <!-- Semantische Abgrenzung (Wireframe Block 3) -->
    <div class="mt-14">
      <h2 class="mb-6 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Was DigiPub ist – und was nicht</h2>
      <div class="grid gap-x-12 gap-y-8 sm:grid-cols-2">
        <div class="border-l-2 border-border pl-5">
          <p class="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Nicht</p>
          <ul class="space-y-2">
            {abgrenzung.nicht.map((eintrag) => (
              <li class="text-muted-foreground" style="font-size: var(--text-body);">{eintrag}</li>
            ))}
          </ul>
        </div>
        <div class="border-l-2 border-primary pl-5">
          <p class="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-primary">Sondern</p>
          <ul class="space-y-2">
            {abgrenzung.sondern.map((eintrag) => (
              <li class="text-foreground" style="font-size: var(--text-body);">{eintrag}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <!-- Das Sichtbarkeits-System (Wireframe Block 4) -->
    <div class="mt-14">
      <h2 class="mb-10 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Das Sichtbarkeits-System</h2>
      <SystemDiagramm stufen={systemStufen} caption={systemCaption} />
    </div>

    <!-- Produkt-Navigation (Wireframe Block 5) -->
    <div class="mt-14 border-t border-border pt-14">
      <ProduktNavigation
        title="Was wir anbieten"
        cards={produktCards}
        note="Reihenfolge: Einstiegsprodukte zuerst, dann Sprints, dann Retainer. Preise werden auf den Produktseiten transparent genannt."
      />
    </div>

    <!-- Für wen (Wireframe Block 6) -->
    <div class="mt-14">
      <h2 class="mb-6 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Für wen DigiPub passt – und für wen nicht</h2>
      <div class="grid gap-x-12 gap-y-8 border-y border-border py-8 sm:grid-cols-2">
        <div>
          <p class="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-primary">Gut geeignet</p>
          <ul class="space-y-2">
            {fuerWen.geeignet.map((eintrag) => (
              <li class="text-foreground" style="font-size: var(--text-body);">{eintrag}</li>
            ))}
          </ul>
        </div>
        <div>
          <p class="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Weniger geeignet</p>
          <ul class="space-y-2">
            {fuerWen.wenigerGeeignet.map((eintrag) => (
              <li class="text-muted-foreground" style="font-size: var(--text-body);">{eintrag}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <!-- Case Studies (Wireframe Block 7) -->
    <div class="mt-14">
      <CaseStudyTabs cases={caseStudies} />
    </div>

    <!-- FAQ (Wireframe Block 8) -->
    <div class="mt-14">
      <FaqAkkordeon items={seoGeoPillarFaq} />
    </div>

    <!-- Andere Leistungsbereiche + Herangehensweise (Wireframe Block 9) -->
    <div class="mt-14 border-t border-border pt-8">
      <h2 class="mb-4 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Weitere DigiPub-Leistungen</h2>
      <div class="flex flex-wrap gap-3">
        {andereBereiche.map((bereich) => (
          <a
            href={bereich.href}
            class="border border-border px-4 py-2 font-mono text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {bereich.label} →
          </a>
        ))}
      </div>
      <p class="mt-6 text-muted-foreground" style="font-size: var(--text-body);">
        Du willst erst verstehen, wie wir denken?
        <a href="/leistungen/seo-geo" class="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary">Unsere Herangehensweise im Bereich SEO/GEO →</a>
      </p>
    </div>

    <!-- CTA (Wireframe Block 10) -->
    <div class="mt-16 border-t border-border pt-10">
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <a
          href="/kontakt"
          class="inline-flex w-fit items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80"
        >
          Sichtbarkeits-Analyse anfragen →
        </a>
        <p class="text-sm text-muted-foreground">
          Kostenloses 45-Min-Gespräch. Keine generische Demo – eine Analyse Ihrer konkreten Ausgangslage.
        </p>
      </div>
    </div>
  </Section>
</Layout>
```

- [ ] **Step 2: Verifizieren**

```bash
curl -s -o /tmp/pillar.html -w "HTTP %{http_code}\n" http://localhost:4321/produkte/seo-geo
for s in "Digitale Sichtbarkeit für KMU" "Was wir anbieten" "Weber-Grill EMEA" "faq-akkordeon" "Das Sichtbarkeits-System" "Sondern" "Gut geeignet" "Unsere Herangehensweise im Bereich SEO/GEO"; do printf "%s: " "$s"; grep -o "$s" /tmp/pillar.html | wc -l; done
grep -o 'href="/produkte/seo-geo/seo-relaunch-begleitung"' /tmp/pillar.html | wc -l
node -e '
const html = require("fs").readFileSync("/tmp/pillar.html","utf8");
const m = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>(.*?)<\/script>/gs)];
console.log("JSON-LD Blöcke:", m.length);
m.forEach((x)=>{ const j = JSON.parse(x[1]); console.log(" -", j["@type"]); });
'
tr -d "\n" < /tmp/pillar.html | grep -oE "</h1>.{0,90}" | head -c 150
```
Expected: `HTTP 200`; alle Marker ≥ 1 (Weber-Grill ≥ 2: Tab + Panel); Produktlink ≥ 1; JSON-LD: 3 Blöcke (`ProfessionalService`, `FAQPage`, `BreadcrumbList`); nach `</h1>` folgt direkt das `border-primary`-`<p>` (Answer-First-Invariante).

- [ ] **Step 3: Commit**

```bash
git add src/pages/produkte/seo-geo/index.astro
git commit -m "feat: Produktübersicht /produkte/seo-geo (vollständiges Wireframe-Pillar, 10 Blöcke)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Rückbau `/leistungen/seo-geo` (Haltung + Brücke)

**Files:**
- Modify: `src/pages/leistungen/seo-geo.astro`

- [ ] **Step 1: Imports entfernen** — diese 5 Zeilen löschen (der `FaqAkkordeon`-Import und `buildBreadcrumbSchema` bleiben!):

```astro
import SystemDiagramm from "../../components/produkte/SystemDiagramm.astro";
import ProduktNavigation from "../../components/produkte/ProduktNavigation.astro";
import CaseStudyTabs from "../../components/produkte/CaseStudyTabs.astro";
import { seoGeoKatalog } from "../../lib/produkte-data";
```
und in der Schema-Import-Zeile `buildKatalogSchema` entfernen:
```astro
import { buildBreadcrumbSchema, buildKatalogSchema } from "../../lib/schemaOrg";
```
→
```astro
import { buildBreadcrumbSchema } from "../../lib/schemaOrg";
```

- [ ] **Step 2: Frontmatter-Daten entfernen** — diese Blöcke komplett löschen (Zeilen ~35–106 im aktuellen Stand): `const produktCards = ...`, `const katalogSchema = ...`, `const caseStudies = [...]` (inkl. Dev-Check-Kommentar), `const systemStufen = [...]`, `const systemCaption = ...`. **Behalten:** `const uebersichtUrl = ...` und `const breadcrumbSchema = ...`.

- [ ] **Step 3: Katalog-Schema-Script entfernen** — diese Zeile löschen (das `breadcrumbSchema`-Script bleibt):

```astro
  <script is:inline type="application/ld+json" set:html={JSON.stringify(katalogSchema)} />
```

- [ ] **Step 4: Die drei Sektionen entfernen** — die kompletten Blöcke `<section id="system-diagramm" ...>...</section>`, `<section id="produkte" ...>...</section>` (zwischen `<StatementBar ... />` und `<SimpleCTA />`) und `<section id="case-studies" ...>...</section>` (zwischen `<WiesoDigiPub ... />` und dem FAQ-Block) löschen. Der FAQ-Block (`{d.faq_items && ...}` mit `FaqAkkordeon`) bleibt als schlafender Guard stehen.

- [ ] **Step 5: Brücken-Modul einfügen** — direkt nach dem schließenden Tag von `<LeistungIntro ... />`, vor `<KeyTakeaways ... />`:

```astro
  <!-- Brücke zu den buchbaren Produkten (Anti-Bounce, im ersten Scroll sichtbar) -->
  <section id="produkt-bruecke" class="bg-background">
    <div class="mx-auto max-w-7xl px-6 py-10">
      <a
        href="/produkte/seo-geo"
        class="group flex flex-col gap-2 border-y border-border py-6 sm:flex-row sm:items-baseline sm:justify-between"
      >
        <span class="font-mono text-xs uppercase tracking-[0.15em] text-primary">Direkt loslegen?</span>
        <span class="font-bold text-foreground transition-colors group-hover:text-primary" style="font-size: var(--text-body);">
          Buchbare SEO/GEO-Produkte – Sprints, Audits &amp; Retainer
          <span class="ml-1 inline-block font-mono text-sm transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </span>
      </a>
    </div>
  </section>
```

- [ ] **Step 6: Verifizieren**

```bash
curl -s -o /tmp/leistung.html -w "HTTP %{http_code}\n" http://localhost:4321/leistungen/seo-geo
for s in 'id="produkt-bruecke"' 'href="/produkte/seo-geo"' 'id="system-diagramm"' 'id="produkte"' 'id="case-studies"' "faq-akkordeon" "Was wir anbieten"; do printf "%s: " "$s"; grep -o "$s" /tmp/leistung.html | wc -l; done
node -e '
const html = require("fs").readFileSync("/tmp/leistung.html","utf8");
const m = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>(.*?)<\/script>/gs)];
console.log("JSON-LD Blöcke:", m.length);
m.forEach((x)=>{ const j = JSON.parse(x[1]); console.log(" -", j["@type"]); });
'
```
Expected: `HTTP 200`; `produkt-bruecke` = 1, Brücken-Link ≥ 1; `system-diagramm`/`produkte`/`case-studies`/`faq-akkordeon`/"Was wir anbieten" alle = 0; JSON-LD: 1 Block (`BreadcrumbList`).

- [ ] **Step 7: Commit**

```bash
git add src/pages/leistungen/seo-geo.astro
git commit -m "refactor: Leistungsseite SEO/GEO auf Haltungs-Rolle zurückgebaut, Brücken-Modul ergänzt

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Einstiegsseite `/produkte` (index.astro)

**Files:**
- Create: `src/pages/produkte/index.astro`

- [ ] **Step 1: Seite anlegen**

```astro
---
import Layout from "../../layouts/Layout.astro";
import Section from "../../components/ui/Section.astro";
import Breadcrumb from "../../components/produkte/Breadcrumb.astro";
import ProduktNavigation from "../../components/produkte/ProduktNavigation.astro";
import { seoGeoKatalog } from "../../lib/produkte-data";
import { buildBreadcrumbSchema } from "../../lib/schemaOrg";

const pageUrl = new URL("/produkte", Astro.site).href;

const produktCards = seoGeoKatalog.map((e) => ({
  tag: e.tag,
  title: e.title,
  quote: e.frage,
  href: e.slug ? `/produkte/seo-geo/${e.slug}` : (e.href ?? "#"),
  cta: e.cta,
}));

const breadcrumbSchema = buildBreadcrumbSchema([
  { label: "DigiPub", url: new URL("/", Astro.site).href },
  { label: "Produkte", url: pageUrl },
]);

const weitereBereiche = [
  { label: "Markenaufbau", href: "/leistungen/markenaufbau-branding" },
  { label: "Designsystem", href: "/leistungen/designsystem" },
  { label: "Automatisierung", href: "/leistungen/automatisierung" },
  { label: "KI-Implementierung", href: "/leistungen/ki-implementierung" },
];
---

<Layout
  title="Produkte | Buchbare Sprints, Audits & Retainer | DigiPub"
  description="Buchbare DigiPub-Produkte: Sprints, Audits und Retainer mit definiertem Format, Umfang und Preis. Den Anfang macht der Leistungsbereich SEO/GEO."
>
  <script is:inline type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />

  <Section id="produkte-einstieg">
    <Breadcrumb
      items={[
        { label: "DigiPub", href: "/" },
        { label: "Produkte" },
      ]}
    />

    <p class="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-primary">
      <span class="text-muted-foreground">Übersicht</span> &nbsp;·&nbsp; Produkte
    </p>

    <!-- H1 + Answer-First: erklärt die Leistungen/Produkte-Trennung (GEO-Faktoid) -->
    <h1
      class="max-w-4xl font-bold text-foreground"
      style="font-size: var(--text-section); line-height: 1.08; letter-spacing: -0.02em;"
    >
      Buchbare Produkte.
    </h1>
    <p
      class="mt-6 max-w-2xl border-l-2 border-primary pl-5 leading-relaxed text-foreground/75"
      style="font-size: var(--text-body);"
    >
      Unsere Leistungsbereiche beschreiben, wie wir denken und arbeiten. Unsere
      Produkte sind konkrete, buchbare Pakete daraus – Sprints, Audits und Retainer
      mit definiertem Format, Umfang und Preis. Den Anfang macht der Bereich SEO/GEO;
      weitere Leistungsbereiche folgen.
    </p>

    <!-- Bereich SEO/GEO -->
    <div class="mt-14">
      <div class="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <h2 class="font-bold text-foreground" style="font-size: var(--text-peak); letter-spacing: -0.01em;">SEO/GEO</h2>
        <a href="/produkte/seo-geo" class="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground">
          Zur Bereichs-Übersicht →
        </a>
      </div>
      <ProduktNavigation cards={produktCards} />
    </div>

    <!-- Weitere Bereiche: ehrlich als "in Vorbereitung" -->
    <div class="mt-14">
      <h2 class="mb-4 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Weitere Bereiche</h2>
      <ul>
        {weitereBereiche.map((bereich) => (
          <li class="flex flex-wrap items-baseline justify-between gap-2 border-t border-border py-4">
            <span class="font-bold text-foreground" style="font-size: var(--text-body);">{bereich.label}</span>
            <span class="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
              Produkte in Vorbereitung · <a href={bereich.href} class="underline decoration-border underline-offset-4 transition-colors hover:text-foreground">Zur Herangehensweise →</a>
            </span>
          </li>
        ))}
        <li class="border-t border-border"></li>
      </ul>
    </div>

    <!-- CTA -->
    <div class="mt-16 border-t border-border pt-10">
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <a
          href="/kontakt"
          class="inline-flex w-fit items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80"
        >
          Gespräch anfragen →
        </a>
        <p class="text-sm text-muted-foreground">
          Unsicher, welches Produkt passt? Ein kostenloses 45-Min-Gespräch klärt die Ausgangslage.
        </p>
      </div>
    </div>
  </Section>
</Layout>
```

- [ ] **Step 2: Verifizieren**

```bash
curl -s -o /tmp/produkte.html -w "HTTP %{http_code}\n" http://localhost:4321/produkte
for s in "Buchbare Produkte." "Zur Bereichs-Übersicht" "In Vorbereitung" "Produkte in Vorbereitung" 'href="/produkte/seo-geo/seo-relaunch-begleitung"'; do printf "%s: " "$s"; grep -o "$s" /tmp/produkte.html | wc -l; done
node -e '
const html = require("fs").readFileSync("/tmp/produkte.html","utf8");
const m = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>(.*?)<\/script>/gs)];
m.forEach((x)=>{ const j = JSON.parse(x[1]); console.log(j["@type"]); });
'
```
Expected: `HTTP 200`; H1 ≥ 1; Pillar-Link ≥ 1; "In Vorbereitung" ≥ 6 (6 unverlinkte Katalog-Karten); "Produkte in Vorbereitung" = 4 (die 4 Bereichs-Zeilen); Produktseiten-Link ≥ 1; JSON-LD: `BreadcrumbList`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/produkte/index.astro
git commit -m "feat: /produkte-Einstiegsseite (Answer-First zur Leistungen/Produkte-Trennung, Katalog, Bereichs-Teaser)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Header-Navigation (Menüpunkt "Produkte" + Teaser) und Footer-Link

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Nav-Array erweitern** — in `Header.astro` das `nav`-Array ersetzen:

```astro
const nav = [
  {
    label: "Leistungen",
    href: "/leistungen",
    children: [
      { label: "Marken-Aufbau / Branding", href: "/leistungen/markenaufbau-branding" },
      { label: "SEO / GEO", href: "/leistungen/seo-geo" },
      { label: "Designsystem", href: "/leistungen/designsystem" },
      { label: "Automatisierung", href: "/leistungen/automatisierung" },
      { label: "KI-Implementierung", href: "/leistungen/ki-implementierung" },
    ],
  },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Referenzen", href: "/referenzen" },
];
```
→
```astro
const nav = [
  {
    label: "Leistungen",
    href: "/leistungen",
    teaser: "Wie wir denken und arbeiten",
    children: [
      { label: "Marken-Aufbau / Branding", href: "/leistungen/markenaufbau-branding" },
      { label: "SEO / GEO", href: "/leistungen/seo-geo" },
      { label: "Designsystem", href: "/leistungen/designsystem" },
      { label: "Automatisierung", href: "/leistungen/automatisierung" },
      { label: "KI-Implementierung", href: "/leistungen/ki-implementierung" },
    ],
  },
  {
    label: "Produkte",
    href: "/produkte",
    teaser: "Buchbare Sprints, Audits & Retainer – mit Preis und Umfang",
    children: [
      { label: "Alle Produkte", href: "/produkte" },
      { label: "SEO / GEO", href: "/produkte/seo-geo" },
    ],
  },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Referenzen", href: "/referenzen" },
];
```

- [ ] **Step 2: Desktop-Dropdown um Teaser-Zeile erweitern** — im Desktop-Dropdown-Container, direkt nach der öffnenden `<div class="bg-popover rounded-lg p-1 min-w-[220px] shadow-xl border border-border">` und vor `{item.children.map(...)}` einfügen:

```astro
                {item.teaser && (
                  <p class="border-b border-border px-3 pb-2 pt-1.5 font-mono text-[11px] leading-snug text-muted-foreground">{item.teaser}</p>
                )}
```

(Das Dropdown wird nur bei `item.children` gerendert — beide neuen Top-Level-Items haben children, die Teaser erscheinen also in beiden Dropdowns.)

- [ ] **Step 3: Mobile-Nav um Teaser-Zeile erweitern** — im Mobile-Overlay, direkt nach dem schließenden `</a>` des Label-Links (`{item.label}`) und vor dem `{item.children && (`-Block einfügen:

```astro
        {item.teaser && (
          <p class="pt-1 font-mono text-[11px] leading-snug text-muted-foreground">{item.teaser}</p>
        )}
```

- [ ] **Step 4: Footer-Link ergänzen** — in `Footer.astro`, Spalte "Seiten", nach der `Home`-Zeile einfügen:

```astro
          <li><a href="/produkte" class="text-muted-foreground text-sm hover:text-foreground transition-colors">Produkte</a></li>
```

- [ ] **Step 5: Verifizieren**

```bash
curl -s -o /tmp/nav.html -w "HTTP %{http_code}\n" http://localhost:4321/
for s in ">Produkte<" "Buchbare Sprints, Audits &amp; Retainer" "Wie wir denken und arbeiten" 'href="/produkte/seo-geo"' "Alle Produkte"; do printf "%s: " "$s"; grep -o "$s" /tmp/nav.html | wc -l; done
```
Expected: `HTTP 200`; "Produkte"-Label ≥ 2 (Desktop + Mobile + Footer); beide Teaser je ≥ 2 (Desktop-Dropdown + Mobile); Pillar-Link ≥ 2; "Alle Produkte" ≥ 2. (Hinweis: `&` wird im HTML zu `&amp;` — deshalb der Ampersand-encodierte Suchstring.)

- [ ] **Step 6: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro
git commit -m "feat: Menüpunkt Produkte mit Teaser-Microcopy (Desktop + Mobile) und Footer-Link

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Gesamt-Verifikation

**Files:** keine Änderungen erwartet — reiner Verifikations-Task; gefundene Fehler werden behoben und als `fix:`-Commit nachgezogen.

- [ ] **Step 1: Alle Routen + Alt-URLs**

```bash
for url in "/produkte" "/produkte/seo-geo" "/produkte/seo-geo/seo-relaunch-begleitung" "/produkte/seo-geo/seo-relaunch-begleitung/niemand-denkt-an-seo-beim-relaunch" "/leistungen/seo-geo"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4321$url"); echo "$code  $url"
done
curl -s -o /dev/null -w "alt (soll 404): %{http_code}\n" http://localhost:4321/leistungen/seo-geo/seo-relaunch-begleitung
```
Expected: 5× `200`, Alt-URL `404`.

- [ ] **Step 2: Link-Kette der neuen Journey**

```bash
curl -s http://localhost:4321/produkte | grep -o 'href="/produkte/seo-geo"' | wc -l                                  # Einstieg → Pillar (≥1)
curl -s http://localhost:4321/produkte/seo-geo | grep -o 'href="/produkte/seo-geo/seo-relaunch-begleitung"' | wc -l # Pillar → Produkt (≥1)
curl -s http://localhost:4321/produkte/seo-geo/seo-relaunch-begleitung | grep -o 'href="/produkte/seo-geo/seo-relaunch-begleitung/niemand-denkt-an-seo-beim-relaunch"' | wc -l  # Produkt → Need (≥1)
curl -s http://localhost:4321/produkte/seo-geo/seo-relaunch-begleitung/niemand-denkt-an-seo-beim-relaunch | grep -o 'href="/produkte/seo-geo/seo-relaunch-begleitung"' | wc -l  # Need → Produkt (≥2)
curl -s http://localhost:4321/leistungen/seo-geo | grep -o 'href="/produkte/seo-geo"' | wc -l                        # Brücke Haltung → Produkte (≥1)
curl -s http://localhost:4321/produkte/seo-geo | grep -o 'href="/leistungen/seo-geo"' | wc -l                        # Rückweg Pillar → Haltung (≥1)
```
Expected: alle Zähler wie annotiert — die Brücken existieren in beide Richtungen.

- [ ] **Step 3: JSON-LD aller vier Seiten parsen**

```bash
for url in "/produkte" "/produkte/seo-geo" "/produkte/seo-geo/seo-relaunch-begleitung" "/produkte/seo-geo/seo-relaunch-begleitung/niemand-denkt-an-seo-beim-relaunch"; do
  echo "== $url"
  curl -s "http://localhost:4321$url" | node -e '
let html = ""; process.stdin.on("data", (d) => (html += d)); process.stdin.on("end", () => {
  const m = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>(.*?)<\/script>/gs)];
  m.forEach((x) => { const j = JSON.parse(x[1]); console.log(" -", j["@type"]); });
});'
done
```
Expected: `/produkte`: BreadcrumbList; Pillar: ProfessionalService + FAQPage + BreadcrumbList; Produktseite: Service + FAQPage + BreadcrumbList; Need-Seite: FAQPage + HowTo + BreadcrumbList — alle ohne Parse-Fehler.

- [ ] **Step 4: Keine verwaisten Alt-Pfade im Quellcode**

```bash
grep -rn "leistungen/seo-geo/seo-relaunch" src/ || echo "OK – keine Alt-Pfade"
grep -rn "seoGeoPillarFaq" src/pages/ | wc -l   # genau 1 Verwender (Pillar)
```
Expected: `OK – keine Alt-Pfade`; Pillar-FAQ-Verwendung = 1.

- [ ] **Step 5: Production-Build**

```bash
npm run build 2>&1 | tail -5
```
Expected: Build erfolgreich (alle Seiten generiert, Sitemap erstellt), keine Fehler.

- [ ] **Step 6: Manueller Browser-Check (Controller mit Preview-Zugriff bzw. Nutzer)**

1. Header Desktop: „Produkte" zwischen „Leistungen" und „Case Studies"; beide Dropdowns zeigen die Teaser-Zeile; Mobile-Menü zeigt Teaser unter den Labels.
2. `/produkte`: Answer-First erklärt die Trennung; SEO/GEO-Karten klickbar; 4 Bereiche „in Vorbereitung".
3. `/produkte/seo-geo`: alle 10 Blöcke in Reihenfolge; Flow-Line animiert; Tabs wechseln; FAQ auf/zu; „Unsere Herangehensweise →" führt zur Leistungsseite.
4. `/leistungen/seo-geo`: Brücken-Modul im ersten Scroll sichtbar; die drei Pillar-Sektionen sind weg; Seite wirkt wieder wie eine Haltungs-Seite.
5. Dark Mode: alle neuen/geänderten Bereiche lesbar.

---

## Self-Review (bereits eingearbeitet)

- **Spec-Abdeckung:** §1 Routen (T1/T3/T5), §2 Einstiegsseite (T5), §3 Pillar mit allen 10 Blöcken + Answer-First + Schema-Umzug (T3), §4 Rückbau + Brücke (T4), §5 Navigation + Footer (T6), §6 Anti-Bounce-Matrix (T4 Brücke, T6 Teaser, T3 Block 9 Rückweg, T5 Answer-First — Messung ist Follow-up), §7 Datenänderungen (T2). Out-of-Scope respektiert (keine Redirects, keine weiteren Bereiche, keine Startseiten-Änderung).
- **Typ-Konsistenz:** `seoGeoPillarFaq: {frage, antwort}[]` (T2) passt auf `FaqAkkordeon`-Props und `buildFaqPageSchema` (T3); `produktCards`-Mapping identisch in T3/T5 und kompatibel mit `ProduktNavigation`-Props (`tag/title/quote/href/cta`); `metriken`-Zellen passen auf `ProduktDetails` (`label/value/sub`, 4 Zellen → 2×2/4-Grid); `buildKatalogSchema(katalog, url, produktBasisPfad)`-Aufruf in T3 nutzt die bestehende Signatur.
- **Placeholder-Scan:** keine TBD/TODO; `⚠ Dev-Check`-Kommentare sind die etablierte redaktionelle Konvention (Zahlen/Cases verifizieren), Code vollständig lauffähig.
- **Bewusste Details:** (1) Breadcrumbs spiegeln die URL-Hierarchie (5 Ebenen auf der Need-Seite — vom Spec so entschieden). (2) Kurzzeitige Daten-Duplizierung zwischen T3 (Pillar erstellt) und T4 (Leistungsseite bereinigt) ist beabsichtigt; nach T4 existieren caseStudies/systemStufen nur noch auf dem Pillar. (3) Die Verifikations-Zählwerte nutzen durchgängig `grep -o | wc -l` (einzeiliges HTML).
