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
