# Produkt-/Need-Seitenarchitektur (Vertical Slice SEO/GEO) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das vollständige 3-Seitentypen-Muster (Produktübersicht / Produktseite / Need-Seite) für den Leistungsbereich SEO/GEO — mit Answer-First-Blöcken, JSON-LD-Schema-Markup und den durchgearbeiteten Wireframe-Inhalten.

**Architecture:** Statische Daten in `produkte-data.ts`/`needs-data.ts` (Muster von `leistungen-data.ts`), ein purer Schema-Helper `schemaOrg.ts`, sieben kleine Astro-Komponenten in `src/components/produkte/` im Editorial-Stil der Startseite (Design-Tokens, Mono-Kicker, Hairlines, Flow-Line-Mechanik aus `lib/flowLine.ts`). Zwei neue dynamische Routen (`[produkt].astro`, `[produkt]/[need].astro`) via `getStaticPaths()`, die bestehende `seo-geo.astro` wird ergänzt, nicht ersetzt.

**Tech Stack:** Astro 5 (SSG), TypeScript, Tailwind CSS 4 (Tokens aus `global.css`), kein neues Package.

**Referenz-Spec:** `docs/superpowers/specs/2026-06-26-produktarchitektur-seo-geo-design.md`

---

## Voraussetzungen & Konventionen

- **Dev-Server:** läuft bereits als `npm run dev` (typisch `http://localhost:4321` — Port ggf. an die tatsächliche Ausgabe anpassen). Neue Dateien unter `src/pages/` werden ohne Neustart erkannt.
- **TypeScript-Check:** `npx astro check` crasht in dieser Umgebung reproduzierbar mit OOM (bekanntes, projektunabhängiges Umgebungsproblem — nicht als Blocker behandeln). Etablierter Fallback für reine `.ts`-Dateien:
  ```bash
  npx tsc --noEmit --strict --target es2022 --module esnext --moduleResolution bundler --skipLibCheck <dateien>
  ```
  `.astro`-Dateien werden über das gerenderte HTML des Dev-Servers verifiziert (curl).
- **Stil-Regeln (nicht verhandelbar):** Nur Design-Tokens (`text-foreground`, `text-primary`, `text-muted-foreground`, `border-border`, `bg-background`, `--text-*`-Variablen). Keine Hex-Farben, keine `gray-*`-Klassen, keine Schatten-Cards in neuen Komponenten.
- **Heading-Hierarchie (a11y, CLAUDE.md):** h1 = Seitentitel, h2 = Block-Label (visuell als kleiner Mono-Kicker gestylt — Ebene ≠ Größe), h3 = Einträge innerhalb eines Blocks. Keine Ebene überspringen.
- **Interface-Erweiterungen gegenüber Spec (additiv, alle Spec-Felder bleiben):** `Produkt` erhält zusätzlich `name`, `preisMin`, `preisHinweis`, `vergleichCaption`, `needCards`, `ctaLabel`; `ablauf[].deliverable` ist optional (Wireframe-Schritttexte enthalten das Deliverable bereits). `Need` erhält zusätzlich `name`, `vorherNachherCaption`, `ctaLabel`. Neu: `KatalogEintrag` + `seoGeoKatalog` (die 7 Übersichts-Cards + Individuell-Card sind keine vollständigen Produkte).
- **Dev-Check-Konvention:** Zahlen/Case-Inhalte, die die Wireframes selbst mit „⚠ Dev-Check" markieren, werden übernommen und im Code mit `// ⚠ Dev-Check:`-Kommentar geflaggt — kein Blocker, aber redaktionell zu verifizieren.

---

### Task 1: `produkte-data.ts` — Produkt-Interface, Produkt „SEO-Relaunch-Begleitung", Katalog

**Files:**
- Create: `src/lib/produkte-data.ts`

- [ ] **Step 1: Datei anlegen**

```ts
// Statische Produkt-Daten für die Produkt-/Need-Seitenarchitektur (Vertical
// Slice SEO/GEO). Directus-Migration folgt als eigener Schritt, sobald ein
// Token mit Schema-Schreibrechten existiert – dann wird nur die Datenquelle
// getauscht, die Interfaces bleiben.
// Referenz: docs/superpowers/specs/2026-06-26-produktarchitektur-seo-geo-design.md

export interface Produkt {
  slug: string;
  leistungsbereich: "seo-geo";
  /** Produktname (Breadcrumb, Schema.org, Karten) – NICHT die H1. */
  name: string;
  /** H1: das Problem als Aussage, nicht der Produktname. */
  title: string;
  /** Answer-First-Block: 2–3 extrahierbare Sätze mit Faktoid, direkt nach der H1. */
  answerFirst: string;
  /** "Warum dieses Problem entsteht" – Kontext in der Sprache des Entscheiders. */
  kontextText: string;
  format: "Sprint" | "Audit" | "Retainer" | "Individuell";
  dauer: string;
  preisrahmen: string;
  /** Numerischer Mindestpreis für Schema.org PriceSpecification (EUR). */
  preisMin?: number;
  preisHinweis: string;
  deliverables: string[];
  geeignetFuer: string[];
  nichtGeeignetFuer: string[];
  vergleich: { kriterium: string; ohne: string; mit: string }[];
  /** figcaption der Vergleichstabelle – GEO-Pflicht (LLM-extrahierbare Textvariante). */
  vergleichCaption: string;
  ablauf: { titel: string; text: string; deliverable?: string }[];
  caseStudy: {
    kunde: string;
    ausgangslage: string;
    vorgehen: string;
    ergebnis: string;
    branche: string;
    seitenanzahl: string;
    dauer: string;
    messbar: string;
  };
  /** Slugs der Need-Seiten, die zu diesem Produkt existieren. */
  needSlugs: string[];
  /** Need-Karten (Wireframe Block 8) – needSlug nur gesetzt, wenn die Seite existiert. */
  needCards: { title: string; quote: string; needSlug?: string }[];
  faq: { frage: string; antwort: string }[];
  ctaLabel: string;
}

/** Eintrag der Produkt-Navigation auf der Produktübersicht (Wireframe Block 5). */
export interface KatalogEintrag {
  /** z. B. "Einstieg · Sprint · 2–3 Wochen" */
  tag: string;
  title: string;
  /** Leitfrage in der Sprache des Entscheiders, ohne Anführungszeichen. */
  frage: string;
  /** Gesetzt = Produktseite existiert unter /leistungen/seo-geo/<slug>. */
  slug?: string;
  /** Expliziter Link (z. B. Individuell-Card → /kontakt). */
  href?: string;
  cta?: string;
}

export const produkte: Produkt[] = [
  {
    slug: "seo-relaunch-begleitung",
    leistungsbereich: "seo-geo",
    name: "SEO-Relaunch-Begleitung",
    title: "Ihr Relaunch kostet Sie Rankings – wenn SEO nicht von Anfang an dabei ist.",
    answerFirst:
      "70% aller Website-Relaunches führen zu messbaren Sichtbarkeitsverlusten – weil SEO erst nach dem Launch berücksichtigt wird. DigiPub begleitet Relaunches von der URL-Struktur bis zur technischen Übergabe: mit einem Weiterleitungskonzept, einem strukturierten Migrations-Check und einem Monitoring-Setup direkt nach dem Launch.",
    kontextText:
      "Web-Agenturen denken in Design und Technik – nicht in Sichtbarkeit. Das Ergebnis: neue Website live, Rankings weg. Besonders kritisch: 301-Weiterleitungen fehlen, URL-Strukturen ändern sich ohne Konzept, Google muss die gesamte Seite neu indexieren. Bei größeren Websites mit 100+ URLs kann das 3–6 Monate dauern – in denen keine organischen Anfragen eingehen.",
    format: "Sprint",
    dauer: "3–4 Wochen",
    preisrahmen: "ab 2.500 €",
    preisMin: 2500,
    preisHinweis: "abhängig von Seitengröße und Komplexität",
    deliverables: [
      "URL-Mapping-Dokument",
      "Weiterleitungskonzept",
      "Technische Übergabe-Checkliste",
      "Post-Launch-Monitoring-Setup",
    ],
    geeignetFuer: [
      "Unternehmen, die eine neue Website planen oder gerade gelauncht haben",
    ],
    nichtGeeignetFuer: [
      "Einzel-Landingpages oder rein technische Migrations-Projekte ohne inhaltliche Komponente",
    ],
    vergleich: [
      { kriterium: "Ranking-Verlust", ohne: "Häufig, 3–6 Monate Erholung", mit: "Minimiert durch Weiterleitungskonzept" },
      { kriterium: "URL-Struktur", ohne: "Agentur entscheidet allein", mit: "SEO-konform geplant und dokumentiert" },
      { kriterium: "Weiterleitungen", ohne: "Fehlen oder sind fehlerhaft", mit: "Vollständiges Mapping vor Launch" },
      { kriterium: "Post-Launch", ohne: "Probleme werden spät entdeckt", mit: "Monitoring ab Tag 1" },
      { kriterium: "Zeitaufwand intern", ohne: "Hoch (Fehler nacharbeiten)", mit: "Gering (strukturierte Übergabe)" },
    ],
    vergleichCaption:
      "Die Tabelle vergleicht einen Website-Relaunch ohne SEO-Begleitung mit dem DigiPub-Relaunch-Sprint. Zentraler Unterschied: Mit strukturiertem URL-Mapping und Weiterleitungskonzept vor dem Launch wird der typische Sichtbarkeitsverlust von 3–6 Monaten auf ein Minimum reduziert – bei gleichzeitig geringerem internen Nacharbeitsaufwand.",
    ablauf: [
      { titel: "Bestands-Crawl", text: "Alle bestehenden URLs werden erfasst und bewertet: welche behalten, welche zusammenführen, welche entfernen." },
      { titel: "URL-Struktur-Konzept", text: "Neue, SEO-konforme Hierarchie als Briefing-Dokument für die Webagentur." },
      { titel: "Weiterleitungskonzept", text: "Vollständiges 301-Mapping: jede alte URL bekommt ein klares Ziel." },
      { titel: "Übergabe-Checkliste", text: "Technische Prüfliste für den Launch-Tag: Indexierung, Canonicals, Search Console, Sitemap." },
      { titel: "Post-Launch-Monitoring", text: "2-wöchiges Monitoring nach Launch: Ranking-Entwicklung, Crawl-Fehler, Search Console Alerts." },
    ],
    // ⚠ Dev-Check: Case-Inhalt an einem echten Relaunch-/Launch-Projekt
    // verifizieren bzw. ersetzen (Portazon-Inhalte aus Startseiten-Copy abgeleitet).
    caseStudy: {
      kunde: "Portazon – Smart City Super App, Trier",
      ausgangslage:
        "Eine neue Plattform mit großer Idee – aber ohne Struktur, die sie trägt. Der Launch stand bevor, ohne Konzept für URL-Struktur und Indexierung.",
      vorgehen:
        "Content-Architektur und URL-Struktur vor dem Launch aufgebaut, Partnerstrategie und Monitoring von Tag 1 an etabliert.",
      ergebnis:
        "Portazon ist heute sichtbar – lokal verankert, digital durchdacht. Kein Sichtbarkeitsverlust beim Launch.",
      branche: "Smart City / Plattform",
      seitenanzahl: "Neuaufbau (keine Alt-URLs)",
      dauer: "Begleitung über den Launch",
      messbar: "Sichtbar ab Tag 1",
    },
    needSlugs: ["niemand-denkt-an-seo-beim-relaunch"],
    needCards: [
      { title: "Niemand denkt an SEO beim Relaunch", quote: "Wir planen gerade einen Relaunch – SEO war bisher kein Thema in den Meetings.", needSlug: "niemand-denkt-an-seo-beim-relaunch" },
      { title: "Alte URLs verschwinden einfach", quote: "Wir haben 300 alte URLs – niemand weiß was damit passiert, wenn die neue Seite online geht." },
      { title: "Designer fragt nach URL-Struktur", quote: "Unser Designer braucht eine URL-Struktur von uns – wir haben keine Ahnung, was wir ihm sagen sollen." },
      { title: "Relaunch-Absturz", quote: "Wir haben eine neue Website live geschaltet und sind bei Google komplett abgestürzt." },
      { title: "Paralyse vor dem Relaunch", quote: "Unsere Website ist uralt, aber wir haben Angst, durch einen Relaunch alles zu zerstören." },
    ],
    faq: [
      {
        frage: "Kann DigiPub die Relaunch-Begleitung auch übernehmen, wenn die Webagentur bereits beauftragt ist?",
        antwort:
          "Ja – das ist der häufigste Fall. DigiPub arbeitet als SEO-Berater parallel zur Webagentur: liefert das URL-Konzept und das Weiterleitungskonzept als Briefing-Dokument, das die Agentur direkt umsetzen kann. Eine direkte Zusammenarbeit mit der Agentur ist möglich und empfehlenswert. Wichtig: Je früher der Einstieg, desto geringer der Aufwand – idealerweise vor der Konzeptionsphase.",
      },
      {
        frage: "Was passiert, wenn der Relaunch bereits live ist und Rankings eingebrochen sind?",
        antwort:
          "Auch dann kann DigiPub helfen – mit einem Notfall-Audit. Zuerst wird die Ursache identifiziert (fehlende Weiterleitungen, Indexierungsprobleme, Canonical-Fehler). Dann folgt ein priorisierter Maßnahmenplan. Die Erholung dauert je nach Seitengröße und Schwere des Problems 4–12 Wochen – mit der richtigen Priorisierung deutlich kürzer als ohne externe Diagnose.",
      },
      {
        frage: "Wie viele URLs kann DigiPub im Relaunch-Sprint begleiten?",
        antwort:
          "Der Standard-Sprint ist für Websites bis 500 URLs ausgelegt. Für größere Seiten (500–5.000 URLs) wird der Aufwand individuell kalkuliert – in der Regel als erweiterter Sprint über 6–8 Wochen. Websites mit mehr als 5.000 URLs erfordern ein separates Projektmandat.",
      },
    ],
    ctaLabel: "Relaunch-Begleitung anfragen",
  },
];

/** Produkt-Navigation der Übersichtsseite (Wireframe Block 5). Reihenfolge:
 *  Einstiegsprodukte → Sprints → Retainer → Individuell. Keine Preis-Badges
 *  über den Tag hinaus. */
export const seoGeoKatalog: KatalogEintrag[] = [
  { tag: "Einstieg · Sprint · 2–3 Wochen", title: "SEO-Grundlagen", frage: "Wir werden bei Google nicht gefunden – wo fangen wir an?" },
  { tag: "Diagnose · Audit · Festpreis", title: "Technisches SEO-Audit", frage: "Etwas ist kaputt – aber wir wissen nicht was." },
  { tag: "Projekt · Sprint · ab 2.500 €", title: "SEO-Relaunch-Begleitung", frage: "Wir launchen eine neue Website – wie verlieren wir keine Rankings?", slug: "seo-relaunch-begleitung" },
  { tag: "KI-Sichtbarkeit · Sprint · 4–6 Wochen", title: "GEO/AEO Sprint", frage: "ChatGPT empfiehlt unsere Konkurrenz – nicht uns." },
  { tag: "Content · Sprint · 4 Wochen", title: "Content & Conversion Sprint", frage: "Wir haben Traffic, aber keine Anfragen." },
  { tag: "Strategie · Sprint · 6 Wochen", title: "Need-Based Content Framework", frage: "Wir wissen nicht, welche Inhalte wir wirklich brauchen." },
  { tag: "Laufend · Retainer · monatlich", title: "Digitaler Sparringspartner", frage: "Wir brauchen jemanden, der strategisch steuert – monatlich." },
  { tag: "Individuell", title: "Ihr Projekt passt in kein Raster?", frage: "Wir entwickeln auch projektspezifische Lösungen – wenn Ihre Situation eine eigene Herangehensweise braucht.", href: "/kontakt", cta: "Gespräch anfragen" },
];

export function getProdukt(slug: string): Produkt | undefined {
  return produkte.find((p) => p.slug === slug);
}
```

- [ ] **Step 2: TypeScript-Check**

Run: `npx tsc --noEmit --strict --target es2022 --module esnext --moduleResolution bundler --skipLibCheck src/lib/produkte-data.ts`
Expected: keine Ausgabe (0 Fehler).

- [ ] **Step 3: Commit**

```bash
git add src/lib/produkte-data.ts
git commit -m "feat: statische Produkt-Daten (SEO-Relaunch-Begleitung + SEO/GEO-Katalog)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: `needs-data.ts` — Need-Interface + Need „Niemand denkt an SEO beim Relaunch"

**Files:**
- Create: `src/lib/needs-data.ts`

- [ ] **Step 1: Datei anlegen**

```ts
// Statische Need-Daten (Vertical Slice SEO/GEO). Directus-Migration folgt
// als eigener Schritt – Interfaces bleiben dabei unverändert.
// Referenz: docs/superpowers/specs/2026-06-26-produktarchitektur-seo-geo-design.md

export interface Need {
  slug: string;
  /** Eltern-Produkt – bestimmt das URL-Nesting /leistungen/seo-geo/<produkt>/<need>. */
  produktSlug: string;
  /** Aktive Needs werden gesucht (SEO reicht); latente brauchen proaktiven Content. */
  typ: "aktiv" | "latent";
  /** Kurzer Need-Name (Breadcrumb, Schema.org, Karten) – NICHT die H1. */
  name: string;
  /** H1: das Problem als Aussage in der Sprache des Entscheiders. */
  title: string;
  answerFirst: string;
  impactZahlen: { label: string; wert: string; kontext: string }[];
  szenario: string;
  /** Konvention: "Titel – Text" – der Teil vor dem ersten " – " wird als
   *  Schritt-Titel gerendert (siehe [need].astro). */
  loesungsweg: string[];
  vorherNachher: { kriterium: string; ohne: string; mit: string }[];
  vorherNachherCaption: string;
  warumDigipub: string;
  /** Nur bei typ "latent": provokanter, teilbarer Satz (LinkedIn-Einstieg). */
  socialHook?: string;
  faq: { frage: string; antwort: string }[];
  ctaLabel: string;
}

export const needs: Need[] = [
  {
    slug: "niemand-denkt-an-seo-beim-relaunch",
    produktSlug: "seo-relaunch-begleitung",
    typ: "latent",
    name: "Niemand denkt an SEO beim Relaunch",
    title: "Ihr Relaunch ist bereits in Planung – und SEO war noch kein Thema im Meeting.",
    answerFirst:
      "In den meisten Website-Projekten wird SEO erst nach dem Launch berücksichtigt – wenn der Schaden bereits entstanden ist. Wer SEO-Anforderungen nicht von Anfang an ins Briefing einbringt, riskiert den Verlust aller bisher aufgebauten Rankings. DigiPub liefert das strukturierte SEO-Briefing, bevor die Agentur mit der Umsetzung beginnt.",
    // ⚠ Dev-Check: Zahlen aus Branchenquellen oder eigenen Cases verifizieren
    // (Formel: konkrete Zahl + Kontext + Quelle oder Beispiel).
    impactZahlen: [
      { label: "Betroffen", wert: "70%", kontext: "aller Relaunches führen zu Sichtbarkeitsverlusten" },
      { label: "Erholung", wert: "3–6 Monate", kontext: "durchschnittliche Erholungszeit nach Ranking-Verlust" },
      { label: "Funkstille", wert: "0 Anfragen", kontext: "organische Anfragen während der Erholungsphase" },
    ],
    szenario:
      "Das Kick-off-Meeting mit der Webagentur läuft gut. Design-Konzept, Technik-Stack, Launch-Datum – alles ist besprochen. Irgendwann fragt die Agentur nach der gewünschten URL-Struktur. Kurze Stille. Niemand im Raum weiß, was das ist oder warum es wichtig sein soll. Die Agentur macht einen Vorschlag, alle nicken – und ein halbes Jahr Arbeit am Sichtbarkeitsaufbau steht auf dem Spiel.",
    loesungsweg: [
      "SEO-Briefing für die Agentur – Klare Anforderungen an URL-Struktur, technische Implementierung und Weiterleitungskonzept – als Dokument, das die Agentur direkt nutzen kann.",
      "Bestands-Crawl der alten Website – Alle bestehenden URLs werden bewertet: behalten, zusammenführen oder entfernen – mit Begründung.",
      "URL-Struktur-Konzept – SEO-konforme Hierarchie, die sowohl für Nutzer als auch für Suchmaschinen funktioniert.",
      "Weiterleitungskonzept – Jede alte URL bekommt ein klares Ziel – als übergabefertiges Dokument für die Entwickler.",
    ],
    vorherNachher: [
      { kriterium: "URL-Struktur", ohne: "Agentur-Entscheidung ohne SEO-Logik", mit: "SEO-konform, dokumentiert" },
      { kriterium: "Weiterleitungen", ohne: "Nachträglich, fehleranfällig", mit: "Vor Launch, vollständig" },
      { kriterium: "Ranking-Risiko", ohne: "Hoch – bis zu 6 Monate Verlust", mit: "Minimal – strukturierter Übergang" },
      { kriterium: "Zeitaufwand intern", ohne: "Hoch (Fehler nacharbeiten)", mit: "Gering (klare Übergabe)" },
    ],
    vorherNachherCaption:
      "Die Tabelle vergleicht einen Relaunch ohne SEO-Briefing mit dem strukturierten DigiPub-Ansatz. Ohne frühzeitiges SEO-Briefing übernimmt die Webagentur URL-Entscheidungen ohne Sichtbarkeits-Logik – mit dem typischen Ergebnis von 3–6 Monaten Ranking-Verlust nach Launch.",
    warumDigipub:
      "DigiPub hat Relaunches für Unternehmen verschiedener Größen begleitet – von mittelständischen Webauftritten bis zu mehrsprachigen EMEA-Rollouts. Das Briefing-Dokument, das dabei entstanden ist, hat sich als Standard-Werkzeug bewährt: verständlich genug für die Agentur, präzise genug für die Entwickler, nachvollziehbar genug für den internen Entscheider. Kein generischer Checklisten-Download – ein auf Ihr Projekt zugeschnittenes Konzept.",
    socialHook:
      "Die meisten Website-Relaunches scheitern nicht an der Technik. Sie scheitern daran, dass niemand in der Planungsphase wusste, welche URLs behalten werden müssen.",
    faq: [
      {
        frage: "Wann ist der richtige Zeitpunkt, um DigiPub in den Relaunch einzubinden?",
        antwort:
          "Idealerweise vor der Beauftragung der Webagentur – oder spätestens beim Kick-off-Meeting. Je früher, desto geringer der Aufwand: Wird DigiPub erst nach dem Launch eingebunden, ist der Schaden bereits entstanden und der Aufwand für die Schadensbegrenzung deutlich höher als eine präventive Begleitung.",
      },
      {
        frage: "Muss die Webagentur in die Zusammenarbeit eingebunden werden?",
        antwort:
          "Nicht zwingend – das Briefing-Dokument ist so aufgebaut, dass die Agentur es ohne direkte Abstimmung mit DigiPub umsetzen kann. Wenn gewünscht, ist ein gemeinsames Abstimmungsgespräch mit der Webagentur möglich und in manchen Fällen sinnvoll – besonders wenn komplexe technische Entscheidungen anstehen.",
      },
      {
        frage: "Was, wenn die Webagentur behauptet, SEO bereits zu berücksichtigen?",
        antwort:
          "Viele Agenturen berücksichtigen grundlegende technische SEO-Anforderungen – aber nicht die strategische Sichtbarkeitslogik. URL-Mapping aus Sichtbarkeits-Perspektive, Weiterleitungskonzept mit Prioritätsstufen und Post-Launch-Monitoring sind Leistungen, die über Standard-Webentwicklung hinausgehen. Ein kurzes Abstimmungsgespräch klärt schnell, was die Agentur abdeckt und wo die Lücken sind.",
      },
    ],
    ctaLabel: "SEO-Briefing für Relaunch anfragen",
  },
];

export function getNeed(slug: string): Need | undefined {
  return needs.find((n) => n.slug === slug);
}
```

- [ ] **Step 2: TypeScript-Check**

Run: `npx tsc --noEmit --strict --target es2022 --module esnext --moduleResolution bundler --skipLibCheck src/lib/needs-data.ts`
Expected: keine Ausgabe.

- [ ] **Step 3: Commit**

```bash
git add src/lib/needs-data.ts
git commit -m "feat: statische Need-Daten (Niemand denkt an SEO beim Relaunch)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: `schemaOrg.ts` — JSON-LD-Helper

**Files:**
- Create: `src/lib/schemaOrg.ts`

Pure Funktionen, keine Astro-Kopplung: URLs werden von den Seiten absolut übergeben (`new URL(pfad, Astro.site).href`).

- [ ] **Step 1: Datei anlegen**

```ts
// JSON-LD-Baukasten für die Produkt-/Need-Seitenarchitektur (GEO).
// Pure Funktionen: Seiten übergeben absolute URLs, hier wird nur das
// Schema-Objekt gebaut. Gerendert als <script type="application/ld+json">.

import type { Produkt, KatalogEintrag } from "./produkte-data";

const ORGANISATION = {
  "@type": "ProfessionalService",
  name: "DigiPub",
  url: "https://www.digipub.de",
  founder: { "@type": "Person", name: "Nicolas Grossman" },
} as const;

export function buildBreadcrumbSchema(
  items: { label: string; url?: string }[],
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function buildFaqPageSchema(
  items: { frage: string; antwort: string }[],
): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.frage,
      acceptedAnswer: { "@type": "Answer", text: f.antwort },
    })),
  };
}

export function buildHowToSchema(name: string, steps: string[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
  };
}

/** Produktseite: Service mit verschachteltem Offer (Wireframe-Pflichtfelder). */
export function buildServiceSchema(p: Produkt, url: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.name,
    description: p.answerFirst,
    serviceType: "SEO-Beratung",
    url,
    areaServed: "DACH",
    provider: ORGANISATION,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      ...(p.preisMin !== undefined
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: p.preisMin,
              priceCurrency: "EUR",
            },
          }
        : {}),
    },
  };
}

/** Produktübersicht: ProfessionalService mit hasOfferCatalog. */
export function buildKatalogSchema(
  katalog: KatalogEintrag[],
  url: string,
  produktBasisPfad: string,
): object {
  return {
    "@context": "https://schema.org",
    ...ORGANISATION,
    "@type": "ProfessionalService",
    url,
    areaServed: "DACH",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "SEO/GEO-Produkte",
      itemListElement: katalog
        .filter((e) => e.tag !== "Individuell")
        .map((e) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: e.title,
            description: e.frage,
            ...(e.slug ? { url: `${produktBasisPfad}/${e.slug}` } : {}),
          },
        })),
    },
  };
}
```

- [ ] **Step 2: TypeScript-Check**

Run: `npx tsc --noEmit --strict --target es2022 --module esnext --moduleResolution bundler --skipLibCheck src/lib/schemaOrg.ts src/lib/produkte-data.ts src/lib/needs-data.ts`
Expected: keine Ausgabe.

- [ ] **Step 3: Commit**

```bash
git add src/lib/schemaOrg.ts
git commit -m "feat: JSON-LD-Helper für Service/Offer, FAQPage, HowTo, BreadcrumbList, OfferCatalog

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Komponenten `Breadcrumb.astro` + `ProduktDetails.astro`

**Files:**
- Create: `src/components/produkte/Breadcrumb.astro`
- Create: `src/components/produkte/ProduktDetails.astro`

Funktionale Verifikation erfolgt in Task 7 (erste Seite, die sie rendert) — bis dahin sind die Dateien unreferenziert.

- [ ] **Step 1: `Breadcrumb.astro` anlegen**

```astro
---
interface Crumb {
  label: string;
  href?: string;
}
interface Props {
  items: Crumb[];
}
const { items } = Astro.props;
---

<nav aria-label="Breadcrumb" class="mb-10 font-mono text-xs text-muted-foreground">
  <ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
    {items.map((item, i) => (
      <li class="flex items-center gap-x-2">
        {i > 0 && <span aria-hidden="true">→</span>}
        {item.href ? (
          <a href={item.href} class="transition-colors hover:text-foreground">{item.label}</a>
        ) : (
          <span aria-current="page" class="text-foreground">{item.label}</span>
        )}
      </li>
    ))}
  </ol>
</nav>
```

- [ ] **Step 2: `ProduktDetails.astro` anlegen**

Generisches Hairline-Fakten-Grid (Hairline-Kreuz-Prinzip wie `Leistungen.astro` der Startseite: `border-t border-l` am Container, `border-b border-r` je Zelle). Wird auf der Produktseite (Format/Preis/Deliverables) und der Need-Seite (Impact-Zahlen, 3 Spalten) verwendet.

```astro
---
interface Cell {
  label: string;
  value: string;
  sub?: string;
}
interface Props {
  cells: Cell[];
}
const { cells } = Astro.props;
const cols =
  cells.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
---

<div class:list={["grid border-l border-t border-border", cols]}>
  {cells.map((cell) => (
    <div class="border-b border-r border-border px-5 py-6">
      <p class="mb-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">{cell.label}</p>
      <p class="font-bold text-foreground" style="font-size: var(--text-body);">{cell.value}</p>
      {cell.sub && <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{cell.sub}</p>}
    </div>
  ))}
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/produkte/Breadcrumb.astro src/components/produkte/ProduktDetails.astro
git commit -m "feat: Breadcrumb- und ProduktDetails-Komponente (Editorial-Stil)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Komponenten `VergleichsTabelle.astro` + `FaqAkkordeon.astro`

**Files:**
- Create: `src/components/produkte/VergleichsTabelle.astro`
- Create: `src/components/produkte/FaqAkkordeon.astro`

- [ ] **Step 1: `VergleichsTabelle.astro` anlegen**

GEO-Pflicht aus den Wireframes: Tabelle in `<figure>` mit `<figcaption>` (LLM-extrahierbare Textvariante).

```astro
---
interface Row {
  kriterium: string;
  ohne: string;
  mit: string;
}
interface Props {
  rows: Row[];
  ohneLabel?: string;
  mitLabel?: string;
  caption?: string;
}
const {
  rows,
  ohneLabel = "Ohne DigiPub",
  mitLabel = "Mit DigiPub",
  caption,
} = Astro.props;
---

<figure class="m-0">
  <div class="overflow-x-auto">
    <table class="w-full border-collapse text-left">
      <thead>
        <tr>
          <th scope="col" class="border-b border-border px-4 py-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Kriterium</th>
          <th scope="col" class="border-b border-border px-4 py-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">{ohneLabel}</th>
          <th scope="col" class="border-b border-border px-4 py-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">{mitLabel}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr>
            <td class="border-b border-border px-4 py-4 text-sm text-muted-foreground">{row.kriterium}</td>
            <td class="border-b border-border px-4 py-4 text-sm text-foreground">{row.ohne}</td>
            <td class="border-b border-border px-4 py-4 text-sm font-semibold text-primary">{row.mit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  {caption && (
    <figcaption class="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">{caption}</figcaption>
  )}
</figure>
```

- [ ] **Step 2: `FaqAkkordeon.astro` anlegen**

Ersetzt perspektivisch `components/leistungen/FAQ.astro` (Task 11). Mono-Nummerierung statt Icon-Kreis, Antworten bleiben im DOM (`hidden`-Klasse — GEO-Anforderung: KI-Crawler lesen nicht interaktiv). Der Titel ist ein `h2`, visuell als Mono-Kicker gestylt (Heading-Ebene ≠ Größe).

```astro
---
interface FaqItem {
  frage: string;
  antwort: string;
}
interface Props {
  items: FaqItem[];
  title?: string;
}
const { items, title = "Häufige Fragen" } = Astro.props;
---

{items.length > 0 && (
  <div class="faq-akkordeon">
    <h2 class="mb-4 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">{title}</h2>
    <div>
      {items.map((item, i) => (
        <div class="faq-item border-t border-border">
          <button
            type="button"
            class="faq-trigger grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-4 py-5 text-left"
            aria-expanded="false"
          >
            <span class="font-mono text-sm text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span class="font-bold text-foreground" style="font-size: var(--text-body);">{item.frage}</span>
            <span class="faq-indicator font-mono text-sm text-muted-foreground" aria-hidden="true">+</span>
          </button>
          <div class="faq-answer hidden pb-6 pl-10 pr-8">
            <p class="max-w-2xl leading-relaxed text-muted-foreground" style="font-size: var(--text-body);">{item.antwort}</p>
          </div>
        </div>
      ))}
      <div class="border-t border-border"></div>
    </div>
  </div>
)}

<script>
  document.querySelectorAll<HTMLElement>(".faq-akkordeon").forEach((root) => {
    root.querySelectorAll<HTMLButtonElement>(".faq-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        if (!item) return;
        const answer = item.querySelector(".faq-answer");
        const indicator = btn.querySelector(".faq-indicator");
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!isOpen));
        answer?.classList.toggle("hidden", isOpen);
        if (indicator) indicator.textContent = isOpen ? "+" : "−";
      });
    });
  });
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/produkte/VergleichsTabelle.astro src/components/produkte/FaqAkkordeon.astro
git commit -m "feat: VergleichsTabelle (figure/figcaption) und FaqAkkordeon (Editorial-Stil)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Komponenten `ProduktNavigation.astro` + `SystemDiagramm.astro` + `CaseStudyTabs.astro`

**Files:**
- Create: `src/components/produkte/ProduktNavigation.astro`
- Create: `src/components/produkte/SystemDiagramm.astro`
- Create: `src/components/produkte/CaseStudyTabs.astro`

- [ ] **Step 1: `ProduktNavigation.astro` anlegen**

Generisches Hairline-Card-Grid (Prinzip von `Leistungen.astro` der Startseite). Wird für die Produkt-Navigation der Übersicht UND die Need-Cards der Produktseite verwendet (gleiche Karten-Anatomie: Tag, Titel, Leitfrage, Pfeil).

```astro
---
interface Card {
  tag?: string;
  title: string;
  quote?: string;
  href: string;
  cta?: string;
}
interface Props {
  title?: string;
  cards: Card[];
  note?: string;
}
const { title, cards, note } = Astro.props;
---

<div>
  {title && (
    <h2 class="mb-8 font-bold text-foreground" style="font-size: var(--text-peak); letter-spacing: -0.01em;">{title}</h2>
  )}
  <div class="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
    {cards.map((card) => (
      <a
        href={card.href}
        class="group flex flex-col border-b border-r border-border p-6"
        aria-disabled={card.href === "#" ? "true" : undefined}
      >
        {card.tag && (
          <span class="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{card.tag}</span>
        )}
        <h3 class="mb-2 font-bold text-foreground transition-colors group-hover:text-primary" style="font-size: var(--text-body); line-height: 1.3;">
          {card.title}
        </h3>
        {card.quote && (
          <p class="mb-4 text-sm italic leading-relaxed text-muted-foreground">„{card.quote}“</p>
        )}
        <span class="mt-auto inline-block font-mono text-xs text-foreground transition-transform group-hover:translate-x-1" aria-hidden="true">
          {card.cta ?? "Zum Produkt"} →
        </span>
      </a>
    ))}
  </div>
  {note && <p class="mt-4 text-sm text-muted-foreground">{note}</p>}
</div>
```

- [ ] **Step 2: `SystemDiagramm.astro` anlegen**

Nutzt die **bestehende** Flow-Line-Mechanik (`[data-flow-line]`/`[data-flow-node]` aus `global.css` + `initFlowLine` aus `lib/flowLine.ts`), identisches h/v-Muster wie `Reihenfolge.astro`, aber generisch für n Stufen. `figcaption` ist Pflicht (GEO: Diagramme ohne Textbeschreibung sind für KI-Crawler unsichtbar).

```astro
---
interface Stufe {
  title: string;
  sub: string;
}
interface Props {
  stufen: Stufe[];
  caption: string;
}
const { stufen, caption } = Astro.props;
const at = (i: number) => (stufen.length > 1 ? i / (stufen.length - 1) : 1);
const edge = 50 / stufen.length; // Linie beginnt/endet unter den Zentren der Randspalten
---

<figure class="system-diagramm m-0">
  <!-- Desktop/Tablet: horizontale Kette -->
  <div class="hidden sm:block">
    <div data-flow class="relative mb-6 flex items-center" style="height: 14px;">
      <div
        data-flow-line
        data-dir="h"
        class="absolute top-1/2 -translate-y-1/2"
        style={`left: ${edge}%; right: ${edge}%;`}
      ></div>
      <div class="relative grid w-full" style={`grid-template-columns: repeat(${stufen.length}, 1fr);`}>
        {stufen.map((_, i) => (
          <div class="flex justify-center">
            <span data-flow-node data-at={at(i)}></span>
          </div>
        ))}
      </div>
    </div>
    <div class="grid gap-6" style={`grid-template-columns: repeat(${stufen.length}, 1fr);`}>
      {stufen.map((stufe) => (
        <div class="text-center">
          <h3 class="mb-1 font-bold text-foreground" style="font-size: var(--text-body);">{stufe.title}</h3>
          <p class="text-sm text-muted-foreground">{stufe.sub}</p>
        </div>
      ))}
    </div>
  </div>

  <!-- Mobile: vertikale Kette -->
  <ol data-flow class="relative sm:hidden">
    <div data-flow-line data-dir="v" class="absolute" style="left: 6px; top: 6px; bottom: 6px;"></div>
    {stufen.map((stufe, i) => (
      <li class="relative pb-8 pl-9 last:pb-0">
        <span data-flow-node data-at={at(i)} class="absolute left-0 top-1"></span>
        <h3 class="mb-1 font-bold text-foreground" style="font-size: var(--text-body);">{stufe.title}</h3>
        <p class="text-sm text-muted-foreground">{stufe.sub}</p>
      </li>
    ))}
  </ol>

  <figcaption class="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">{caption}</figcaption>
</figure>

<script>
  import { initFlowLine } from "../../lib/flowLine";
  document
    .querySelectorAll<HTMLElement>(".system-diagramm [data-flow]")
    .forEach((el) => initFlowLine(el, { durationMs: 1400 }));
</script>
```

- [ ] **Step 3: `CaseStudyTabs.astro` anlegen**

Wireframe Block 7 der Übersicht. GEO-kritisch: **alle** Tab-Inhalte liegen als DOM-Text vor, nur CSS-Sichtbarkeit wird getoggelt.

```astro
---
interface CaseMeta {
  label: string;
  value: string;
}
interface CaseStudy {
  name: string;
  headline: string;
  ausgangslage: string;
  vorgehen: string;
  ergebnis: string;
  meta: CaseMeta[];
}
interface Props {
  title?: string;
  cases: CaseStudy[];
}
const { title = "DigiPub-Projekte", cases } = Astro.props;
---

<div class="case-tabs">
  <h2 class="mb-8 font-bold text-foreground" style="font-size: var(--text-peak); letter-spacing: -0.01em;">{title}</h2>
  <div class="grid gap-10 lg:grid-cols-[0.3fr_0.7fr]">
    <div role="tablist" aria-label="Projekte" class="flex flex-col">
      {cases.map((c, i) => (
        <button
          type="button"
          role="tab"
          id={`case-tab-${i}`}
          aria-controls={`case-panel-${i}`}
          aria-selected={i === 0 ? "true" : "false"}
          class="case-tab px-4 py-3 text-left font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {c.name}
        </button>
      ))}
    </div>
    <div>
      {cases.map((c, i) => (
        <div
          role="tabpanel"
          id={`case-panel-${i}`}
          aria-labelledby={`case-tab-${i}`}
          class:list={["case-panel", i !== 0 && "hidden"]}
        >
          <h3 class="mb-6 font-bold text-foreground" style="font-size: var(--text-body);">{c.headline}</h3>
          <div class="space-y-4">
            {[
              { label: "Ausgangslage", text: c.ausgangslage },
              { label: "Vorgehen", text: c.vorgehen },
              { label: "Ergebnis", text: c.ergebnis },
            ].map((block) => (
              <div>
                <p class="mb-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">{block.label}</p>
                <p class="leading-relaxed text-foreground" style="font-size: var(--text-body);">{block.text}</p>
              </div>
            ))}
          </div>
          {c.meta.length > 0 && (
            <div class="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-4">
              {c.meta.map((m) => (
                <p class="text-sm text-muted-foreground">
                  <span class="font-mono text-xs uppercase tracking-[0.1em]">{m.label}:</span> {m.value}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</div>

<style>
  .case-tab {
    border-left: 2px solid var(--color-border);
  }
  .case-tab[aria-selected="true"] {
    border-left-color: var(--color-primary);
    color: var(--color-primary);
  }
</style>

<script>
  document.querySelectorAll<HTMLElement>(".case-tabs").forEach((root) => {
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[role='tab']"));
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[role='tabpanel']"));
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t, j) => t.setAttribute("aria-selected", String(i === j)));
        panels.forEach((p, j) => p.classList.toggle("hidden", i !== j));
      });
    });
  });
</script>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/produkte/ProduktNavigation.astro src/components/produkte/SystemDiagramm.astro src/components/produkte/CaseStudyTabs.astro
git commit -m "feat: ProduktNavigation, SystemDiagramm (Flow-Line) und CaseStudyTabs

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Produktseite `[produkt].astro`

**Files:**
- Create: `src/pages/leistungen/seo-geo/[produkt].astro`

Hinweis: Astro erlaubt die Koexistenz von `seo-geo.astro` (Datei) und `seo-geo/` (Verzeichnis) — die Datei bedient `/leistungen/seo-geo`, das Verzeichnis die verschachtelten Routen.

- [ ] **Step 1: Seite anlegen**

```astro
---
import Layout from "../../../layouts/Layout.astro";
import Section from "../../../components/ui/Section.astro";
import Breadcrumb from "../../../components/produkte/Breadcrumb.astro";
import ProduktDetails from "../../../components/produkte/ProduktDetails.astro";
import VergleichsTabelle from "../../../components/produkte/VergleichsTabelle.astro";
import FaqAkkordeon from "../../../components/produkte/FaqAkkordeon.astro";
import ProduktNavigation from "../../../components/produkte/ProduktNavigation.astro";
import { produkte, seoGeoKatalog, type Produkt } from "../../../lib/produkte-data";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildServiceSchema,
} from "../../../lib/schemaOrg";

export function getStaticPaths() {
  return produkte.map((p) => ({
    params: { produkt: p.slug },
    props: { produkt: p },
  }));
}

interface Props {
  produkt: Produkt;
}
const { produkt: p } = Astro.props;

const pfad = `/leistungen/seo-geo/${p.slug}`;
const pageUrl = new URL(pfad, Astro.site).href;

const needCards = p.needCards.map((card) => ({
  title: card.title,
  quote: card.quote,
  href: card.needSlug ? `${pfad}/${card.needSlug}` : "#",
  cta: "Mehr dazu",
}));

const verwandte = seoGeoKatalog.filter(
  (e) => e.slug !== p.slug && e.tag !== "Individuell",
);

const serviceSchema = buildServiceSchema(p, pageUrl);
const faqSchema = buildFaqPageSchema(p.faq);
const breadcrumbSchema = buildBreadcrumbSchema([
  { label: "DigiPub", url: new URL("/", Astro.site).href },
  { label: "SEO/GEO", url: new URL("/leistungen/seo-geo", Astro.site).href },
  { label: p.name, url: pageUrl },
]);
---

<Layout
  title={`${p.name} | SEO/GEO | DigiPub`}
  description={p.answerFirst.slice(0, 155)}
>
  <script is:inline type="application/ld+json" set:html={JSON.stringify(serviceSchema)} />
  <script is:inline type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
  <script is:inline type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />

  <Section id="produkt">
    <Breadcrumb
      items={[
        { label: "DigiPub", href: "/" },
        { label: "SEO/GEO", href: "/leistungen/seo-geo" },
        { label: p.name },
      ]}
    />

    <p class="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-primary">
      <span class="text-muted-foreground">{p.format} · {p.dauer}</span> &nbsp;·&nbsp; {p.name}
    </p>

    <!-- H1 + Answer-First: GEO-Pflicht – kein Element zwischen H1 und Antwort-Absatz -->
    <h1
      class="max-w-4xl font-bold text-foreground"
      style="font-size: var(--text-section); line-height: 1.08; letter-spacing: -0.02em;"
    >
      {p.title}
    </h1>
    <p
      class="mt-6 max-w-2xl border-l-2 border-primary pl-5 leading-relaxed text-foreground/75"
      style="font-size: var(--text-body);"
    >
      {p.answerFirst}
    </p>

    <!-- Kontext -->
    <div class="mt-14 max-w-3xl">
      <h2 class="mb-3 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Warum dieses Problem entsteht</h2>
      <p class="leading-relaxed text-muted-foreground" style="font-size: var(--text-body);">{p.kontextText}</p>
    </div>

    <!-- Produkt-Details -->
    <div class="mt-14">
      <h2 class="mb-4 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Produkt-Details</h2>
      <ProduktDetails
        cells={[
          { label: "Format", value: p.format, sub: p.dauer },
          { label: "Preisrahmen", value: p.preisrahmen, sub: p.preisHinweis },
          { label: "Deliverables", value: `${p.deliverables.length} Dokumente`, sub: p.deliverables.join(" · ") },
        ]}
      />
      <div class="grid gap-x-8 gap-y-4 border-b border-border py-6 sm:grid-cols-2">
        <div>
          <h3 class="mb-2 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Geeignet für</h3>
          <ul class="space-y-1">
            {p.geeignetFuer.map((eintrag) => (
              <li class="text-foreground" style="font-size: var(--text-body);">{eintrag}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 class="mb-2 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Nicht geeignet für</h3>
          <ul class="space-y-1">
            {p.nichtGeeignetFuer.map((eintrag) => (
              <li class="text-muted-foreground" style="font-size: var(--text-body);">{eintrag}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <!-- Vergleich -->
    <div class="mt-14">
      <h2 class="mb-4 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Ohne DigiPub vs. mit DigiPub</h2>
      <VergleichsTabelle
        rows={p.vergleich}
        ohneLabel="Ohne SEO-Begleitung"
        mitLabel="Mit DigiPub-Begleitung"
        caption={p.vergleichCaption}
      />
    </div>

    <!-- Ablauf -->
    <div class="mt-14 max-w-3xl">
      <h2 class="mb-4 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Wie die Zusammenarbeit funktioniert</h2>
      <ol>
        {p.ablauf.map((schritt, i) => (
          <li class="grid grid-cols-[auto_1fr] items-baseline gap-5 border-t border-border py-5">
            <span class="font-mono text-sm text-primary tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 class="mb-1 font-bold text-foreground" style="font-size: var(--text-body);">{schritt.titel}</h3>
              <p class="leading-relaxed text-muted-foreground" style="font-size: var(--text-body);">{schritt.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>

    <!-- Case Study (DOM-Text, GEO-Pflicht) -->
    <div class="mt-14">
      <h2 class="mb-3 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Case Study</h2>
      <h3 class="mb-6 max-w-3xl font-bold text-foreground" style="font-size: var(--text-peak); letter-spacing: -0.01em;">
        {p.caseStudy.kunde}
      </h3>
      <div class="grid gap-x-8 gap-y-6 md:grid-cols-3">
        {[
          { label: "Ausgangslage", text: p.caseStudy.ausgangslage },
          { label: "Vorgehen", text: p.caseStudy.vorgehen },
          { label: "Ergebnis", text: p.caseStudy.ergebnis },
        ].map((block) => (
          <div>
            <p class="mb-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">{block.label}</p>
            <p class="leading-relaxed text-foreground" style="font-size: var(--text-body);">{block.text}</p>
          </div>
        ))}
      </div>
      <div class="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-4">
        {[
          { label: "Branche", value: p.caseStudy.branche },
          { label: "Umfang", value: p.caseStudy.seitenanzahl },
          { label: "Dauer", value: p.caseStudy.dauer },
          { label: "Messbar", value: p.caseStudy.messbar },
        ].map((m) => (
          <p class="text-sm text-muted-foreground">
            <span class="font-mono text-xs uppercase tracking-[0.1em]">{m.label}:</span> {m.value}
          </p>
        ))}
      </div>
    </div>

    <!-- Need-Cards -->
    <div class="mt-14">
      <ProduktNavigation
        title="Typische Situationen, die zu diesem Produkt führen"
        cards={needCards}
      />
    </div>

    <!-- FAQ -->
    <div class="mt-14">
      <FaqAkkordeon items={p.faq} title="Häufige Fragen zum Produkt" />
    </div>

    <!-- Verwandte Produkte -->
    <div class="mt-14 border-t border-border pt-8">
      <h2 class="mb-4 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Weitere Produkte im Leistungsbereich</h2>
      <div class="flex flex-wrap gap-3">
        {verwandte.map((e) => (
          <a
            href={e.slug ? `/leistungen/seo-geo/${e.slug}` : "/leistungen/seo-geo"}
            class="border border-border px-4 py-2 font-mono text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {e.title} →
          </a>
        ))}
      </div>
    </div>

    <!-- CTA + Rücklink -->
    <div class="mt-16 border-t border-border pt-10">
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <a
          href="/kontakt"
          class="inline-flex w-fit items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80"
        >
          {p.ctaLabel} →
        </a>
        <a href="/leistungen/seo-geo" class="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground">
          Oder zurück zur Übersicht: SEO/GEO – alle Produkte →
        </a>
      </div>
    </div>
  </Section>
</Layout>
```

- [ ] **Step 2: Rendering verifizieren (Dev-Server)**

```bash
curl -s -o /tmp/produkt.html -w "HTTP %{http_code}\n" http://localhost:4321/leistungen/seo-geo/seo-relaunch-begleitung
grep -c "Ihr Relaunch kostet Sie Rankings" /tmp/produkt.html
grep -c "data-flow\|Bestands-Crawl" /tmp/produkt.html
node -e '
const html = require("fs").readFileSync("/tmp/produkt.html","utf8");
const m = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>(.*?)<\/script>/gs)];
console.log("JSON-LD Blöcke:", m.length);
m.forEach((x)=>{ const j = JSON.parse(x[1]); console.log(" -", j["@type"]); });
'
```
Expected: `HTTP 200`, Headline gefunden (≥1), JSON-LD Blöcke: 3 mit Typen `Service`, `FAQPage`, `BreadcrumbList` (alle parsen fehlerfrei).

- [ ] **Step 3: Commit**

```bash
git add src/pages/leistungen/seo-geo/
git commit -m "feat: Produktseite SEO-Relaunch-Begleitung (11 Blöcke, Service/FAQPage/Breadcrumb-Schema)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Need-Seite `[produkt]/[need].astro`

**Files:**
- Create: `src/pages/leistungen/seo-geo/[produkt]/[need].astro`

- [ ] **Step 1: Seite anlegen**

```astro
---
import Layout from "../../../../layouts/Layout.astro";
import Section from "../../../../components/ui/Section.astro";
import Breadcrumb from "../../../../components/produkte/Breadcrumb.astro";
import ProduktDetails from "../../../../components/produkte/ProduktDetails.astro";
import VergleichsTabelle from "../../../../components/produkte/VergleichsTabelle.astro";
import FaqAkkordeon from "../../../../components/produkte/FaqAkkordeon.astro";
import { needs, type Need } from "../../../../lib/needs-data";
import { getProdukt, type Produkt } from "../../../../lib/produkte-data";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildHowToSchema,
} from "../../../../lib/schemaOrg";

export function getStaticPaths() {
  return needs.map((n) => {
    const produkt = getProdukt(n.produktSlug);
    if (!produkt) {
      throw new Error(`Need "${n.slug}" verweist auf unbekanntes Produkt "${n.produktSlug}"`);
    }
    return {
      params: { produkt: n.produktSlug, need: n.slug },
      props: { need: n, produkt },
    };
  });
}

interface Props {
  need: Need;
  produkt: Produkt;
}
const { need: n, produkt: p } = Astro.props;

const produktPfad = `/leistungen/seo-geo/${p.slug}`;
const pfad = `${produktPfad}/${n.slug}`;
const pageUrl = new URL(pfad, Astro.site).href;

// Ein FAQPage-Schema pro Seite (Google-Vorgabe): Need-Kernfrage + FAQ gemeinsam.
const faqSchema = buildFaqPageSchema([
  { frage: n.name, antwort: n.answerFirst },
  ...n.faq,
]);
const howToSchema = buildHowToSchema(`Lösungsweg: ${n.name}`, n.loesungsweg);
const breadcrumbSchema = buildBreadcrumbSchema([
  { label: "DigiPub", url: new URL("/", Astro.site).href },
  { label: "SEO/GEO", url: new URL("/leistungen/seo-geo", Astro.site).href },
  { label: p.name, url: new URL(produktPfad, Astro.site).href },
  { label: n.name, url: pageUrl },
]);
---

<Layout
  title={`${n.name} | ${p.name} | DigiPub`}
  description={n.answerFirst.slice(0, 155)}
>
  <script is:inline type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
  <script is:inline type="application/ld+json" set:html={JSON.stringify(howToSchema)} />
  <script is:inline type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />

  <Section id="need">
    <Breadcrumb
      items={[
        { label: "DigiPub", href: "/" },
        { label: "SEO/GEO", href: "/leistungen/seo-geo" },
        { label: p.name, href: produktPfad },
        { label: n.name },
      ]}
    />

    <p class="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-primary">
      <span class="text-muted-foreground">Need</span> &nbsp;·&nbsp; {p.name}
    </p>

    <!-- H1 + Answer-First: GEO-Pflicht – kein Element dazwischen -->
    <h1
      class="max-w-4xl font-bold text-foreground"
      style="font-size: var(--text-section); line-height: 1.08; letter-spacing: -0.02em;"
    >
      {n.title}
    </h1>
    <p
      class="mt-6 max-w-2xl border-l-2 border-primary pl-5 leading-relaxed text-foreground/75"
      style="font-size: var(--text-body);"
    >
      {n.answerFirst}
    </p>

    <!-- Impact-Zahlen -->
    <div class="mt-14">
      <h2 class="mb-4 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Das Ausmaß des Problems</h2>
      <ProduktDetails
        cells={n.impactZahlen.map((z) => ({ label: z.label, value: z.wert, sub: z.kontext }))}
      />
    </div>

    <!-- Szenario -->
    <div class="mt-14 max-w-3xl">
      <h2 class="mb-3 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Das Szenario</h2>
      <p class="leading-relaxed text-muted-foreground" style="font-size: var(--text-body);">{n.szenario}</p>
    </div>

    <!-- Lösungsweg (Konvention: "Titel – Text", Split am ersten " – ") -->
    <div class="mt-14 max-w-3xl">
      <h2 class="mb-4 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Der Lösungsweg</h2>
      <ol>
        {n.loesungsweg.map((schritt, i) => {
          const [titel, ...rest] = schritt.split(" – ");
          const text = rest.join(" – ");
          return (
            <li class="grid grid-cols-[auto_1fr] items-baseline gap-5 border-t border-border py-5">
              <span class="font-mono text-sm text-primary tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 class="mb-1 font-bold text-foreground" style="font-size: var(--text-body);">{titel}</h3>
                {text && (
                  <p class="leading-relaxed text-muted-foreground" style="font-size: var(--text-body);">{text}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>

    <!-- Vorher / Nachher -->
    <div class="mt-14">
      <h2 class="mb-4 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Vorher / Nachher</h2>
      <VergleichsTabelle
        rows={n.vorherNachher}
        ohneLabel="Ohne SEO-Briefing"
        mitLabel="Mit DigiPub-Briefing"
        caption={n.vorherNachherCaption}
      />
    </div>

    <!-- Warum DigiPub -->
    <div class="mt-14 max-w-3xl">
      <h2 class="mb-3 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Warum DigiPub</h2>
      <p class="leading-relaxed text-muted-foreground" style="font-size: var(--text-body);">{n.warumDigipub}</p>
    </div>

    <!-- Social Hook – nur bei latenten Needs -->
    {n.socialHook && (
      <blockquote class="mt-14 max-w-3xl border-l-2 border-primary pl-6">
        <p class="font-bold text-foreground" style="font-size: var(--text-peak); line-height: 1.3; letter-spacing: -0.01em;">
          „{n.socialHook}“
        </p>
      </blockquote>
    )}

    <!-- FAQ -->
    <div class="mt-14">
      <FaqAkkordeon items={n.faq} title="Häufige Fragen zu diesem Need" />
    </div>

    <!-- CTA + Rücklink zum Produkt (bidirektionale Verlinkung, GEO) -->
    <div class="mt-16 border-t border-border pt-10">
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <a
          href="/kontakt"
          class="inline-flex w-fit items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80"
        >
          {n.ctaLabel} →
        </a>
        <a href={produktPfad} class="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground">
          Oder zurück zum Produkt: {p.name} →
        </a>
      </div>
    </div>
  </Section>
</Layout>
```

- [ ] **Step 2: Rendering verifizieren**

```bash
curl -s -o /tmp/need.html -w "HTTP %{http_code}\n" http://localhost:4321/leistungen/seo-geo/seo-relaunch-begleitung/niemand-denkt-an-seo-beim-relaunch
grep -c "Ihr Relaunch ist bereits in Planung" /tmp/need.html
grep -c "Die meisten Website-Relaunches scheitern nicht an der Technik" /tmp/need.html
node -e '
const html = require("fs").readFileSync("/tmp/need.html","utf8");
const m = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>(.*?)<\/script>/gs)];
console.log("JSON-LD Blöcke:", m.length);
m.forEach((x)=>{ const j = JSON.parse(x[1]); console.log(" -", j["@type"]); });
'
```
Expected: `HTTP 200`, H1 und Social Hook gefunden (je ≥1), JSON-LD Blöcke: 3 mit Typen `FAQPage`, `HowTo`, `BreadcrumbList`.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/leistungen/seo-geo/[produkt]"
git commit -m "feat: Need-Seite 'Niemand denkt an SEO beim Relaunch' (10 Blöcke, FAQPage/HowTo/Breadcrumb-Schema)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: `KeyTakeaways.astro` — Table-Variante auf Design-Tokens migrieren

**Files:**
- Modify: `src/components/leistungen/KeyTakeaways.astro` (nur der `variant === "table"`-Zweig; der `cards`-Zweig bleibt unverändert, er wird von anderen Seiten in anderem Kontext genutzt)

- [ ] **Step 1: Table-Zweig ersetzen**

Der bisherige `variant === "table"`-Block (Section mit `bg-white`, `border-gray-200`, `text-[#1a1a1a]`, `text-gray-300`, `text-gray-600`) wird ersetzt durch (reiner Token-Swap, identische Struktur):

```astro
{variant === "table" ? (
  <section id="section-takeaways" class="border-y border-border bg-background py-20">
    <div class="max-w-7xl mx-auto px-6">
      <p class="mb-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">Key Takeaways</p>
      <div class="space-y-0">
        {items.map((item, i) => (
          <div class="grid grid-cols-12 items-start gap-6 border-t border-border py-6">
            <span class="col-span-1 pt-1 font-mono text-xs text-muted-foreground tabular-nums">0{i + 1}</span>
            <strong class="col-span-4 font-semibold text-foreground">{item.title}</strong>
            <p class="col-span-7 leading-relaxed text-muted-foreground">{item.text}</p>
          </div>
        ))}
        <div class="border-t border-border"></div>
      </div>
    </div>
  </section>
) : (
```

(Der `) : (`-Rest der Datei — cards-Zweig und schließende Klammern — bleibt byte-identisch.)

- [ ] **Step 2: Verifizieren**

```bash
curl -s http://localhost:4321/leistungen/seo-geo -o /tmp/uebersicht-kt.html -w "HTTP %{http_code}\n"
grep -o 'id="section-takeaways"[^>]*' /tmp/uebersicht-kt.html
grep -c 'text-\[#1a1a1a\]' /tmp/uebersicht-kt.html || true
```
Expected: `HTTP 200`; das `section-takeaways`-Element enthält `border-border bg-background`; im Takeaways-Bereich keine `text-[#1a1a1a]`-Klasse mehr (Rest der Seite kann noch Alt-Klassen enthalten — die stammen aus anderen, hier nicht migrierten Komponenten).

- [ ] **Step 3: Commit**

```bash
git add src/components/leistungen/KeyTakeaways.astro
git commit -m "refactor: KeyTakeaways-Tabelle auf Design-Tokens migriert

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: Produktübersicht `seo-geo.astro` erweitern

**Files:**
- Modify: `src/pages/leistungen/seo-geo.astro`

- [ ] **Step 1: Imports ergänzen/ersetzen**

Im Frontmatter:
1. Die Zeile `import FAQ from "../../components/leistungen/FAQ.astro";` ersetzen durch:
```astro
import FaqAkkordeon from "../../components/produkte/FaqAkkordeon.astro";
```
2. Direkt darunter neu hinzufügen:
```astro
import SystemDiagramm from "../../components/produkte/SystemDiagramm.astro";
import ProduktNavigation from "../../components/produkte/ProduktNavigation.astro";
import CaseStudyTabs from "../../components/produkte/CaseStudyTabs.astro";
import { seoGeoKatalog } from "../../lib/produkte-data";
import { buildBreadcrumbSchema, buildKatalogSchema } from "../../lib/schemaOrg";
```

- [ ] **Step 2: Seitendaten im Frontmatter ergänzen**

Ans Ende des Frontmatter-Blocks (nach der `nextHref`-Zeile):

```ts
const uebersichtUrl = new URL("/leistungen/seo-geo", Astro.site).href;

const produktCards = seoGeoKatalog.map((e) => ({
  tag: e.tag,
  title: e.title,
  quote: e.frage,
  href: e.slug ? `/leistungen/seo-geo/${e.slug}` : (e.href ?? "#"),
  cta: e.cta,
}));

const katalogSchema = buildKatalogSchema(
  seoGeoKatalog,
  uebersichtUrl,
  new URL("/leistungen/seo-geo", Astro.site).href,
);
const breadcrumbSchema = buildBreadcrumbSchema([
  { label: "DigiPub", url: new URL("/", Astro.site).href },
  { label: "SEO/GEO", url: uebersichtUrl },
]);

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
```

- [ ] **Step 3: JSON-LD in den Layout-Body einfügen**

Direkt nach `<Layout ...>` (vor `<LeistungHero ...>`):

```astro
  <script is:inline type="application/ld+json" set:html={JSON.stringify(katalogSchema)} />
  <script is:inline type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
```

- [ ] **Step 4: Neue Blöcke einfügen**

**(a)** Direkt nach `<StatementBar text={d.ansatz_bold} />` (Abschluss des "Unser Ansatz"-Blocks), vor `<SimpleCTA />`:

```astro
  <!-- Das Sichtbarkeits-System (Wireframe Block 4) -->
  <section id="system-diagramm" class="bg-background">
    <div class="mx-auto max-w-7xl px-6 py-20">
      <h2 class="mb-10 font-mono text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">Das Sichtbarkeits-System</h2>
      <SystemDiagramm stufen={systemStufen} caption={systemCaption} />
    </div>
  </section>

  <!-- Produkt-Navigation (Wireframe Block 5) -->
  <section id="produkte" class="border-t border-border bg-background">
    <div class="mx-auto max-w-7xl px-6 py-20">
      <ProduktNavigation
        title="Was wir anbieten"
        cards={produktCards}
        note="Reihenfolge: Einstiegsprodukte zuerst, dann Sprints, dann Retainer. Preise werden auf den Produktseiten transparent genannt."
      />
    </div>
  </section>
```

**(b)** Direkt nach `<WiesoDigiPub ... />`, vor dem FAQ-Block:

```astro
  <!-- Case Studies (Wireframe Block 7, Tab-Komponente, alle Inhalte im DOM) -->
  <section id="case-studies" class="border-t border-border bg-background">
    <div class="mx-auto max-w-7xl px-6 py-20">
      <CaseStudyTabs cases={caseStudies} />
    </div>
  </section>
```

**(c)** Den bestehenden FAQ-Block

```astro
  {d.faq_items && d.faq_items.length > 0 && (
    <FAQ items={d.faq_items} />
  )}
```

ersetzen durch:

```astro
  {d.faq_items && d.faq_items.length > 0 && (
    <section class="border-y border-border bg-background">
      <div class="mx-auto max-w-3xl px-6 py-20">
        <FaqAkkordeon items={d.faq_items.map((f) => ({ frage: f.question, antwort: f.answer }))} />
      </div>
    </section>
  )}
```

- [ ] **Step 5: Verifizieren**

```bash
curl -s -o /tmp/uebersicht.html -w "HTTP %{http_code}\n" http://localhost:4321/leistungen/seo-geo
grep -c "Was wir anbieten" /tmp/uebersicht.html
grep -c 'href="/leistungen/seo-geo/seo-relaunch-begleitung"' /tmp/uebersicht.html
grep -c "Weber-Grill EMEA" /tmp/uebersicht.html
grep -c "faq-akkordeon" /tmp/uebersicht.html
node -e '
const html = require("fs").readFileSync("/tmp/uebersicht.html","utf8");
const m = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>(.*?)<\/script>/gs)];
console.log("JSON-LD Blöcke:", m.length);
m.forEach((x)=>{ const j = JSON.parse(x[1]); console.log(" -", j["@type"]); });
'
```
Expected: `HTTP 200`; "Was wir anbieten" ≥ 1; Link zur Produktseite ≥ 1; Weber-Grill-Tab-Inhalt im DOM ≥ 2 (Tab-Button + Panel); FAQ-Akkordeon vorhanden; JSON-LD: 2 Blöcke (`ProfessionalService`, `BreadcrumbList`).

- [ ] **Step 6: Commit**

```bash
git add src/pages/leistungen/seo-geo.astro
git commit -m "feat: Produktübersicht SEO/GEO um Systemdiagramm, Produkt-Navigation, Case-Tabs und Katalog-Schema ergänzt

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 11: `FAQ.astro` durch `FaqAkkordeon` in den restlichen Leistungsseiten ersetzen + löschen

**Files:**
- Modify: `src/pages/leistungen/markenaufbau-branding.astro`
- Modify: `src/pages/leistungen/designsystem.astro`
- Modify: `src/pages/leistungen/automatisierung.astro`
- Modify: `src/pages/leistungen/ki-implementierung.astro`
- Delete: `src/components/leistungen/FAQ.astro`

Bestandsaufnahme (verifiziert): genau diese 4 Seiten + `seo-geo.astro` (bereits in Task 10 umgestellt) importieren `components/leistungen/FAQ.astro`. Das top-level `src/components/FAQ.astro` ist eine ANDERE Komponente und bleibt unangetastet.

- [ ] **Step 1: Verwender bestätigen**

Run: `grep -rln "leistungen/FAQ" src/`
Expected: exakt die 4 oben genannten Seiten (seo-geo.astro ist nach Task 10 nicht mehr dabei).

- [ ] **Step 2: In jeder der 4 Seiten den Import ersetzen**

`import FAQ from "../../components/leistungen/FAQ.astro";` → `import FaqAkkordeon from "../../components/produkte/FaqAkkordeon.astro";`

- [ ] **Step 3: In jeder der 4 Seiten die Verwendung ersetzen**

Alle 4 Seiten nutzen dasselbe Muster. Ersetzen:

```astro
  {d.faq_items && d.faq_items.length > 0 && (
    <FAQ items={d.faq_items} />
  )}
```

durch:

```astro
  {d.faq_items && d.faq_items.length > 0 && (
    <section class="border-y border-border bg-background">
      <div class="mx-auto max-w-3xl px-6 py-20">
        <FaqAkkordeon items={d.faq_items.map((f) => ({ frage: f.question, antwort: f.answer }))} />
      </div>
    </section>
  )}
```

(Falls eine Seite minimal anders formatiert ist: gleiche Ersetzung sinngemäß — Import-Swap + Wrapper + Prop-Mapping `question/answer` → `frage/antwort`.)

- [ ] **Step 4: Alte Komponente löschen und Restverwendung prüfen**

```bash
git rm src/components/leistungen/FAQ.astro
grep -rn "leistungen/FAQ" src/ || echo "OK – keine Verwender mehr"
```
Expected: `OK – keine Verwender mehr`.

- [ ] **Step 5: Stichprobe verifizieren**

```bash
curl -s -o /tmp/marke.html -w "HTTP %{http_code}\n" http://localhost:4321/leistungen/markenaufbau-branding
grep -c "faq-akkordeon" /tmp/marke.html
```
Expected: `HTTP 200`, `faq-akkordeon` ≥ 1.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: FaqAkkordeon ersetzt leistungen/FAQ auf allen Leistungsseiten

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 12: Gesamt-Verifikation (Link-Integrität, Schema, manueller Browser-Check)

**Files:** keine Änderungen erwartet — reiner Verifikations-Task. Findet er Fehler, werden sie behoben und als `fix:`-Commit nachgezogen.

- [ ] **Step 1: Alle drei Seiten + Link-Kette prüfen**

```bash
for url in \
  "http://localhost:4321/leistungen/seo-geo" \
  "http://localhost:4321/leistungen/seo-geo/seo-relaunch-begleitung" \
  "http://localhost:4321/leistungen/seo-geo/seo-relaunch-begleitung/niemand-denkt-an-seo-beim-relaunch"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url"); echo "$code  $url"
done
# Bidirektionale Verlinkung (GEO-Pflicht):
curl -s http://localhost:4321/leistungen/seo-geo/seo-relaunch-begleitung | grep -c 'href="/leistungen/seo-geo/seo-relaunch-begleitung/niemand-denkt-an-seo-beim-relaunch"'
curl -s http://localhost:4321/leistungen/seo-geo/seo-relaunch-begleitung/niemand-denkt-an-seo-beim-relaunch | grep -c 'href="/leistungen/seo-geo/seo-relaunch-begleitung"'
```
Expected: 3× `200`; beide grep-Zähler ≥ 1 (Produkt → Need und Need → Produkt).

- [ ] **Step 2: JSON-LD aller drei Seiten parsen**

```bash
for url in \
  "http://localhost:4321/leistungen/seo-geo" \
  "http://localhost:4321/leistungen/seo-geo/seo-relaunch-begleitung" \
  "http://localhost:4321/leistungen/seo-geo/seo-relaunch-begleitung/niemand-denkt-an-seo-beim-relaunch"; do
  echo "== $url"
  curl -s "$url" | node -e '
let html = ""; process.stdin.on("data", (d) => (html += d)); process.stdin.on("end", () => {
  const m = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>(.*?)<\/script>/gs)];
  m.forEach((x) => { const j = JSON.parse(x[1]); console.log(" -", j["@type"]); });
});'
done
```
Expected: Übersicht `ProfessionalService` + `BreadcrumbList`; Produktseite `Service` + `FAQPage` + `BreadcrumbList`; Need-Seite `FAQPage` + `HowTo` + `BreadcrumbList` — alle ohne Parse-Fehler.

- [ ] **Step 3: Answer-First-Position prüfen (GEO: kein Element zwischen H1 und Antwort)**

```bash
curl -s http://localhost:4321/leistungen/seo-geo/seo-relaunch-begleitung \
  | tr -d "\n" | grep -oE "</h1>.{0,200}" | head -c 300
```
Expected: direkt nach `</h1>` folgt das `<p ... border-primary ...>`-Element (nur Whitespace dazwischen).

- [ ] **Step 4: Manueller Browser-Check (durch den Nutzer bzw. Controller mit Browser-Zugriff)**

Checkliste auf `http://localhost:4321/leistungen/seo-geo`:
1. Systemdiagramm: Flow-Line wächst beim Scrollen, 3 Knoten pulsieren beim Erreichen; Mobile (<640px): vertikale Kette.
2. Produkt-Navigation: 8 Karten, „SEO-Relaunch-Begleitung" klickbar → Produktseite; Individuell-Karte → /kontakt.
3. Case-Tabs: Klick auf Haidacher/Portazon wechselt den Inhalt; alle Inhalte im DOM (View Source).
4. FAQ-Akkordeon: auf/zu, Indikator wechselt +/−.
5. Produktseite: alle 11 Blöcke in Reihenfolge, Tabelle mit figcaption, Need-Card führt zur Need-Seite.
6. Need-Seite: 4-stufige Breadcrumb, Social-Hook-Zitat vorhanden, Rücklink zum Produkt.
7. Dark Mode (Toggle im Header): alle neuen Blöcke lesbar, Hairlines sichtbar.

- [ ] **Step 5: Abschluss-Commit (nur falls Step 1–4 Fixes erzeugt haben)**

```bash
git status --short   # falls leer: nichts zu tun
```

---

## Self-Review (bereits eingearbeitet)

- **Spec-Abdeckung:** Routen (T7/T8/T10), Datenmodell (T1/T2), Schema-Helper + JSON-LD je Seitentyp inkl. BreadcrumbList überall (T3, T7, T8, T10), alle 7 Komponenten (T4–T6), Answer-First direkt nach H1 (T7/T8 + Positions-Check T12), KeyTakeaways-Migration (T9), FAQ-Ablösung + Löschung (T10/T11), bidirektionale Verlinkung Produkt↔Need (T7/T8 + Check T12). Out-of-Scope-Grenzen respektiert (keine i18n, keine Directus-Collections, unverlinkte Katalog-Cards → `#` bzw. `/kontakt`).
- **Typ-Konsistenz:** `Produkt`/`KatalogEintrag` (T1) und `Need` (T2) werden in T3/T7/T8/T10 mit identischen Feldnamen verwendet; `buildKatalogSchema(katalog, url, produktBasisPfad)`-Signatur in T3 und T10 identisch; `FaqAkkordeon`-Props (`items: {frage, antwort}[]`, `title?`) in T7/T8/T10/T11 identisch; `initFlowLine(el, {durationMs})` entspricht dem realen Export in `lib/flowLine.ts`.
- **Placeholder-Scan:** Keine TBD/TODO. Redaktionelle „⚠ Dev-Check"-Kommentare sind bewusste Übernahmen der Wireframe-Konvention (Zahlen/Case-Inhalte verifizieren), keine Plan-Platzhalter — der Code ist vollständig lauffähig.
- **Bekannte bewusste Entscheidungen:** (1) `ablauf[].deliverable` optional statt Pflicht — Wireframe-Schritttexte enthalten die Deliverables bereits, kein Inhalt erfunden. (2) Ein gemeinsames FAQPage-Schema auf der Need-Seite (Kernfrage + FAQ zusammengeführt) statt zwei FAQPage-Blöcke — Google-Vorgabe: ein FAQPage pro Seite. (3) `needCards` zusätzlich zu `needSlugs` — die 5 Wireframe-Karten existieren, aber nur 1 Need-Seite; Karten ohne `needSlug` zeigen auf `#`.
