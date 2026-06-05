const BASE = "https://directus.deutsche-musik.de";
const TOKEN = "Fh-LXSXZTiwbSxnXFHDUcjgKDC9CeHb3";

const items = [
  {
    status: "published", slug: "smart-catering",
    title: "Case Study: Smart Catering",
    subtitle: "Markenaufbau & Digitalisierung in der Betriebsgastronomie",
    description: "Wie ein Leistungsbereich der Sander Gruppe zur eigenständigen Marke wurde – durch Sprache, Struktur und Gestaltung.",
    excerpt: "Smart Catering machte ein bestehendes Portfolio durch Sprache, Struktur und Gestaltung sichtbar.",
    kunde: "Sander Gruppe / Smart Catering", branche: "Betriebsgastronomie",
    tags: "Markenaufbau, Designsystem, Automatisierung",
    ausgangslage_text: "- Vorhandene operative Kompetenz, starkes Portfolio, jahrzehntelange Erfahrung\n- Fehlende klare Kommunikationssprache\nDie Kommunikation orientierte sich am Erlebnis der Mitarbeitenden. Die eigentlichen Entscheider – Geschäftsführung, HR, Facility-Management – wurden nicht präzise adressiert.",
    ziele_left_title: "Marke, Positionierung & Kommunikation",
    ziele_left_text: "- Entwicklung von Smart Catering als eigenständige Marke\n- Zielgruppengerechte Ansprache von Entscheidern\n- Explizite Formulierung impliziter Mehrwerte\n- Ersatz emotionaler Narrative durch lösungsorientierte Argumentationslogik",
    ziele_right_title: "Struktur, System & Befähigung",
    ziele_right_text: "- Strukturierung in modulare Angebotsarchitektur\n- Einführung skalierbares Designsystem\n- Pragmatische Digitalisierung zentraler Arbeitsprozesse\n- Kompetenzaufbau für eigenständige Weiterentwicklung",
    vorgehen_items: [
      { title: "Informations-Architektur & UX-Logik", text: "Bevor Strukturen entstehen, muss verstanden werden, was das Angebot wirklich leistet. Hierarchische Gliederung, modulare Struktur, logische Progression und konsistente Benennung. Komplexität wird nicht verkürzt, sie wird strukturiert." },
      { title: "Answer-First-Strukturierung", text: "Zentrale Antwort zuerst, Details folgen strukturiert. SEO- und Content-Strategie-Prinzipien auf Angebots- und Präsentationsdokumente übertragen." },
      { title: "Form Follows Function", text: "Gestaltung ist ein Werkzeug, keine Dekoration. Modulare, wiederverwendbare Bausteine in Figma, konsistente Markenführung, kundenindividuelle Echtzeit-Anpassbarkeit." },
      { title: "Digitalisierung als Prozessstrategie", text: "Digitalisierung beginnt dort, wo tatsächlich gearbeitet wird. An realen Reibungspunkten ansetzen, sofort spürbaren Nutzen schaffen, Akzeptanz durch Erleben." },
    ],
    ergebnis_text: "- Komplexe Angebotswelten werden durch Struktur beherrschbar\n- Zielgruppenorientierung entscheidet über Positionierung\n- Unstrukturierter Inhalt kann durch Design nicht gerettet werden\n- Digitalisierung beginnt im Prozess, nicht im System\n- Nachhaltige Transformation entsteht durch Kompetenzaufbau",
    kpis: [],
  },
  {
    status: "published", slug: "portazon",
    title: "Case Study: Portazon – Smart City Super App",
    subtitle: "Zusammenarbeit mit Stadtwerken Trier und A EINS Business Intelligence GmbH",
    description: "Zur Digitalisierung der Region Trier: Eine Super-App mit E-Auto-Laden, Parken, Deutschland-Ticket, Marktplatz-Shopping und digitalem Kundencenter.",
    excerpt: "70.000+ Downloads, 1 Mio.+ Interaktionen – wie Portazon zur regionalen Super-App wurde.",
    kunde: "Portazon / Stadtwerke Trier", branche: "Smart City / Digitalplattform",
    tags: "SEO / GEO, Markenaufbau, Automatisierung",
    ausgangslage_text: "- Beta-Phase ohne stabile Nutzerbasis\n- Fehlende Priorisierung für Feature-Entwicklung\n- Nicht eingebundene Partner\n- Schleppende Nutzergewinnung\n- Unkonkrete Skalierungsstrategie\n- Geringe Markenbekanntheit regional\n- Fehlende Online-Offline-Strategie",
    ziele_left_title: "Sichtbarkeit & Wachstum",
    ziele_left_text: "- SEO-basierte Sichtbarkeit aufbauen\n- Conversion maximieren (App-Downloads, aktive Nutzung)\n- Markenbekanntheit in allen Lebensbereichen der Stadtbewohner",
    ziele_right_title: "Partner & Skalierung",
    ziele_right_text: "- Partnergewinnung und Onboarding\n- Online-Offline-Konversionsstrategie entwickeln\n- Skalierungsstrategie für die Region",
    vorgehen_items: [
      { title: "Kategorien-Management", text: "Markt- und Umfeldanalysen, Identifikation lokaler Interessen, digitale Mehrwertabbildung, Anbieter-Identifikation, Kategorie- und Themenbereiche-Definition." },
      { title: "Content-Management", text: "Content-Integration mit SWT.de, Erstellung für Web, Social Media und App. Aufbau nachhaltiger Content-Teams und Redaktionsprozesse. SEO-Content zu Lifestyle, Events und Regionalem." },
      { title: "Partner-Management & Stakeholder", text: "Zusammenarbeit mit Uni Trier, Hochschulen, Trier Marketing. Partnergewinnung und strukturiertes Onboarding." },
      { title: "Kampagnensteuerung", text: "Meta Ads, Google Ads, Copywriting. Monitoring via Firebase, GTM, GA, GSC, Looker Studio." },
    ],
    ergebnis_text: "- Erfolgreicher App-Launch als regionale Super-App\n- Sichtbarkeits- und Markenaufbau realisiert\n- Regionale Markenposition etabliert\n- Online-Offline-Conversion umgesetzt",
    kpis: [{ value: "70.000+", label: "App-Downloads" }, { value: "1 Mio.+", label: "Interaktionen" }],
  },
  {
    status: "published", slug: "haidacher",
    title: "Case Study: Tischlerei Haidacher",
    subtitle: "Wie wir der Tischlerei Haidacher halfen, ohne Veränderung des Markenauftritts digital sichtbar zu werden.",
    description: "Markantes, ästhetisches Design – aber kaum Suchmaschinen-Sichtbarkeit. Mit gezieltem SEO änderte sich das in drei Monaten.",
    excerpt: "Klicks von 137 auf 300 in 3 Monaten – ohne eine einzige Designänderung.",
    kunde: "Tischlerei Haidacher", branche: "Tischlerei / Innenausbau (Südtirol)",
    tags: "SEO / GEO",
    ausgangslage_text: "- Markantes, ästhetisches Design, aber mangelnde Suchmaschinen-Sichtbarkeit\n- Inhalte ohne ausreichende Keyword-Abdeckung für relevante Suchbegriffe\n- Bilder nicht indexiert und in der Bildersuche nicht auffindbar",
    ziele_left_title: "Sichtbarkeit & Keywords",
    ziele_left_text: "- Erhöhung der Sichtbarkeit in Google für hochwertige Suchbegriffe im Innenausbau\n- Verwendung fachlicher Sprache zur Ansprache von Innendesignern und Architekten\n- Snippet-Optimierung zur besseren Auffindbarkeit",
    ziele_right_title: "Bild-SEO & Indexierung",
    ziele_right_text: "- Indexierung und fachliche Beschreibung der Bilder\n- Fachlich präzise Alt-Tags für alle relevanten Bilder\n- Indexierungsmanagement aufbauen",
    vorgehen_items: [
      { title: "Workshop mit der Tischlerei Haidacher", text: "SEO-Grundlagen und Möglichkeiten ohne Designänderungen erläutert. Sensibilisierung für Snippets, Bild-SEO und Keywords." },
      { title: "Snippet-Optimierung", text: "Entwicklung eines Keyword-Sets in Fachsprache für die Zielgruppe. Erstellung optimierter HTML-Titel und Meta Descriptions." },
      { title: "Bild-SEO & Indexierung", text: "Fachlich präzise Formulierung von Alt-Tags für Bilder. Indexierung der Bilder für die Google Bildersuche." },
    ],
    ergebnis_text: "- Verbesserte organische Sichtbarkeit ohne Markenpräsenz-Veränderung\n- Erstmalig fachlich relevante Keyword-Rankings erzielt\n- Relevante Snippets verbessern Auffindbarkeit nachhaltig\n- Indexierte Bilder als zusätzlicher Sichtbarkeitstreiber\n- Ansprache von Innendesignern und Architekten gestärkt\n- Team befähigt, neue Projekte SEO-optimiert anzulegen",
    kpis: [{ value: "137 → 300", label: "Klicks in 3 Monaten" }],
  },
  {
    status: "published", slug: "walter-de-gruyter",
    title: "Technisches SEO & Headless CMS für Walter De Gruyter",
    subtitle: "SEO-optimiertes Content-Management, Headless CMS-Aufbau und technische SEO-Analyse",
    description: "Wie wir De Gruyter beim Content-Management, dem Aufbau eines Headless CMS und der CMS-Auswahl durch eine technische SEO-Analyse unterstützt haben.",
    excerpt: "Stabiles Content-Management und technisches SEO-Fundament für einen der führenden Wissenschaftsverlage.",
    kunde: "Walter De Gruyter", branche: "Wissenschaftsverlage / Publishing",
    tags: "SEO / GEO, Automatisierung",
    ausgangslage_text: "- Fehlende interne Kapazitäten für tägliche Content-Verwaltung\n- Veraltete Prozesse und CMS-Beschränkungen verhinderten effektive Content-Erstellung\n- Notwendigkeit einer fundierten CMS-Neubewertung\n- Risiko von Sichtbarkeitsverlust durch technische SEO-Mängel",
    ziele_left_title: "Content & Prozesse",
    ziele_left_text: "- Tagesaktuelle, optimierte Content-Verwaltung etablieren\n- Flexible, effiziente Content-Produktionsumgebung aufbauen\n- CMS-Auswahl durch technische SEO-Analyse unterstützen",
    ziele_right_title: "SEO & Sichtbarkeit",
    ziele_right_text: "- Digitale Sichtbarkeit und Markenpräsenz stärken\n- Technische SEO-Mängel identifizieren und beheben\n- Langfristige SEO-Grundlage schaffen",
    vorgehen_items: [
      { title: "SEO-optimiertes Content-Management", text: "Projektmanagement zur Anforderungssteuerung, tägliche Content-Verwaltung im bestehenden CMS, SEO-Optimierung vor Veröffentlichung." },
      { title: "Headless CMS mit Craft CMS", text: "Visuelle Content-Verwaltung entwickelt (mit Welance GmbH). HTML-Export/Import-Funktionalität, vereinfachte Produktions- und Vorschauprozesse." },
      { title: "Technische SEO-Analyse", text: "Analyse von Indexierung, Duplicate Content, Canonicals, Ladezeiten. Strukturierte Daten, Meta-Tags, Überschriftenstruktur evaluiert. Handlungsempfehlungen abgeleitet." },
    ],
    ergebnis_text: "- Stabile, tagesaktuelle Content-Verwaltung etabliert\n- Effiziente und visuelle Content-Produktion dank Headless CMS\n- Technische SEO-Anforderungen frühzeitig erkannt\n- Technisches SEO ist entscheidend für CMS-Auswahl und Plattformstrategie",
    kpis: [],
  },
];

for (const item of items) {
  const res = await fetch(`${BASE}/items/digipub_case_studies`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(item),
  });
  const json = await res.json();
  if (json.errors) console.error(`${item.slug}:`, json.errors[0].message);
  else console.log(`✓ ${item.slug} (ID ${json.data.id})`);
}
