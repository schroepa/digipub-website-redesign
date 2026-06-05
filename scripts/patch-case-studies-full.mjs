const BASE = "https://directus.deutsche-musik.de";
const TOKEN = "Fh-LXSXZTiwbSxnXFHDUcjgKDC9CeHb3";

const patches = [
  {
    id: 1,
    ausgangslage_text: "Smart Catering verfügte über hohe operative Kompetenz, ein starkes Leistungsportfolio und jahrzehntelange Erfahrung. Was fehlte, war keine Leistung, sondern eine Sprache dafür.\n\nDie Kommunikation orientierte sich am Erlebnis der Mitarbeitenden. Die eigentlichen Entscheider – Geschäftsführung, HR, Facility-Management – wurden nicht präzise adressiert. Das Angebot war intern logisch, aber nicht aus der Perspektive derer strukturiert, die es beauftragen.\n\nDie zentrale Herausforderung: Wie wird ein komplexes Leistungsangebot so aufbereitet, dass Entscheider es schnell erfassen, bewerten und strategisch einordnen können?",
    ziele_left_title: "Marke, Positionierung & Kommunikation",
    ziele_left_text: "- Entwicklung von Smart Catering als eigenständige Marke mit klarer Struktur, eigenem Wording und konsistenter Argumentationslogik\n- Zielgruppengerechte Ansprache von Entscheidern – Geschäftsführung, HR, Facility-Management – mit Fokus auf Wirtschaftlichkeit, Implementierung und Prozesssicherheit\n- Explizite Formulierung impliziter Mehrwerte, um operative Stärke nachvollziehbar und bewertbar zu machen\n- Ersatz emotionaler Narrative durch eine klare, lösungsorientierte Argumentationslogik",
    ziele_right_title: "Struktur, System & Befähigung",
    ziele_right_text: "- Strukturierung des Leistungsangebots in eine modulare, nachvollziehbare Angebotsarchitektur, die Entscheidungsprozesse vereinfacht\n- Einführung eines konsistenten, skalierbaren Designsystems für Angebotsproduktion, Präsentation und Markenführung\n- Pragmatische Digitalisierung zentraler Arbeitsprozesse mit unmittelbar spürbarem Nutzen\n- Kompetenzaufbau im Unternehmen für langfristige, eigenständige Weiterentwicklung",
    vorgehen_items: [
      { title: "Informations-Architektur & UX-Logik", text: "Bevor Strukturen entstehen, muss verstanden werden, was das Angebot wirklich leistet. Dieses Zuhören ist keine Vorstufe, es ist die Grundlage. Oft entsteht hier eine Formulierung des Mehrwertes, die dem Unternehmen selbst noch nicht in dieser Klarheit bewusst war.\n\nAuf dieser Basis entsteht eine Architektur nach Prinzipien aus UX-Design und SEO: Hierarchische Gliederung und modulare Struktur, logische Progression und konsistente Benennung, durchgängige Navigationslogik innerhalb der Dokumente.\n\nKomplexität wird nicht verkürzt, sie wird strukturiert. Ein Entscheider darf nie verloren gehen." },
      { title: "Answer-First-Strukturierung", text: "Die Angebotslogik folgt einem klaren Prinzip: Die zentrale Antwort steht zuerst, Details folgen in strukturierter Vertiefung. Jede Ebene beantwortet eine konkrete Frage.\n\nBekannt aus SEO und Content-Strategie wird hier konsequent auf Angebots- und Präsentationsdokumente übertragen." },
      { title: "Form Follows Function", text: "Gestaltung ist ein Werkzeug, keine Dekoration. Das Figma-Designsystem macht diesen Ansatz technisch greifbar: Modulare, wiederverwendbare Bausteine, konsistente Markenführung über alle Vertriebskanäle, kundenindividuelle Anpassbarkeit in Echtzeit, kein Dateichaos, kein Versionsdurcheinander.\n\nVisuelle Sprache, die Kompetenz vermittelt – nicht solche, die sie übertüncht." },
      { title: "Digitalisierung als Prozessstrategie", text: "Digitalisierung beginnt dort, wo tatsächlich gearbeitet wird – nicht im System, sondern im Prozess. An realen Reibungspunkten ansetzen, sofort spürbaren Nutzen schaffen, Akzeptanz durch Erleben, nicht durch Überzeugungsarbeit.\n\nWenn Werkzeuge sinnvoll integriert werden, verändert sich das Arbeiten selbst. Digitalisierung wird Teil der Praxis – nicht des Programms." },
    ],
    ergebnis_text: "Smart Catering existierte als Leistung. Jetzt existiert es als Marke mit einer Sprache, einer Struktur und einer Gestaltung, die Entscheider direkt adressiert. Die Grundlage für den Vertrieb ist gelegt. Die nächste Phase beginnt.\n\n- Komplexe Angebotswelten werden durch Struktur beherrschbar.\n- Zielgruppenorientierung entscheidet über Positionierung.\n- Wenn Inhalt nicht strukturiert ist, kann Design ihn nicht retten.\n- Digitalisierung beginnt im Prozess, nicht im System.\n- Nachhaltige Transformation entsteht durch Kompetenzaufbau.",
  },
  {
    id: 2,
    ausgangslage_text: "- Die Portazon-App befand sich in einer unausgereiften Beta-Phase und hatte keine stabile Nutzerbasis.\n- Es fehlte eine klare Priorisierung und Strukturierung für die Entwicklung und Integration relevanter Features.\n- Wichtige Partner für Marktplatz, Mobilität und Services waren noch nicht eingebunden oder aktiv ongeboardet.\n- Die Nutzergewinnung war schleppend, es fehlte an Sichtbarkeit und aktivierenden Kampagnen.\n- Die Monetarisierungsidee und langfristige Skalierung als White-Label-Lösung für andere Städte war noch unkonkret.\n- Die Marke war weder in der Stadt noch in der Region ausreichend bekannt, es fehlte an einer strategischen Platzierung im Alltag der Zielgruppen.\n- Es bestand keine klare Online-Offline-Strategie, um App-Nutzung, Partnerintegration und Offline-Marketingaktivitäten effizient zu verzahnen.",
    ziele_left_title: "Sichtbarkeit & Wachstum",
    ziele_left_text: "- Nachhaltige Sichtbarkeit durch SEO-Konzepte.\n- Conversion-Maximierung: App-Downloads und aktive Nutzung der App-Features.\n- Markenbekanntheit in allen Lebensbereichen der Stadtbewohner und Touristen.\n- Etablierung als digitaler Marktplatz und Förderer der Region.",
    ziele_right_title: "Partner & Skalierung",
    ziele_right_text: "- Gewinnung neuer Partner (Wirtschaft, Freizeit, Gastronomie, Mobilität) zur Nutzung der Reichweite der App.\n- Entwicklung von Marketingkonzepten für Online-Offline- und Offline-Online-Conversions zur Stärkung der App-Nutzung.",
    vorgehen_items: [
      { title: "Kategorien-Management", text: "Durchführung von Markt- und Umfeldanalysen. Identifikation der Interessen der Trierer Bevölkerung und der aktuellen Angebotsstruktur. Prüfung, wie dieser Mehrwert digital in der App abgebildet werden kann. Identifikation von Anbietern, die ihre Services über die App erweitern können. Definition von Produkt- und Dienstleistungskategorien für digitale Angebote. Definition von regionalen Themenbereichen für Blog, App-Content und Features." },
      { title: "Content-Management", text: "Content-Verzahnung mit den Inhalten des Webauftritts der Stadtwerke Trier (SWT.de). Erstellung, Planung und Steuerung von Content für Web, Social Media und App. Aufbau nachhaltiger Content-Teams und Redaktionsprozesse. Kampagnenplanung inklusive Schulung und Teambuilding. Feature-Content (How-Tos, Aktuelles, Reichweiten-Content). SEO-Content (Lifestyle, Events, Regionales, Produkte, Partner). Social Media Content-Planung, thematische Gleichschaltung. UX-optimierter App-Content inkl. Storytelling." },
      { title: "Partner-Management & Stakeholder", text: "Zusammenarbeit mit Uni Trier, Hochschulen, Trier Marketing, Geo-Portal Trier und weiteren Partnern. Partnergewinnung und Onboarding. Erleichterung des Produktmanagements und Partner-Onboardings." },
      { title: "Kampagnensteuerung", text: "Zusammenarbeit mit Agenturen und Freelancern für Meta Ads, Google Ads, Copywriting, Tracking, Analyse. Controlling und Kampagnenkoordination. Monitoring & Reporting via Firebase, GTM, GA, GSC, Looker Studio." },
      { title: "Feature-Entwicklung & Innovation", text: "Enge Zusammenarbeit mit AEins-Innovation. Ideenfindung, Testing und kontinuierliche Verbesserung von Features." },
      { title: "Markenaufbau: 16BC Streetwear", text: "Aufbau und Release der Streetwear-Marke 16BC inklusive Shopify-Shop als Marketinginstrument und Submarke." },
    ],
    ergebnis_text: "- Erfolgreicher Launch & Ausbau der Portazon-App als regionale Super-App.\n- Sichtbarkeits- und Markenaufbau durch alle OM-Kanäle.\n- Etablierung als Marke in der regionalen Landschaft.\n- Beitrag zur Digitalisierung der Region.\n- Umsetzung von Online-Offline- und Offline-Online-Conversion-Strategien.\n\nLearnings:\n- Smart City-Projekte brauchen Technik, Content und Stakeholder-Verzahnung.\n- Regionale Plattformen wachsen mit der Region und ihren Partnern.\n- DigiPub liefert Strategie, Struktur und Befähigung für skalierbare digitale Lösungen.",
    kpis: [{ value: "70.000+", label: "App-Downloads" }, { value: "1 Mio.+", label: "Interaktionen" }, { value: "↑ stabil", label: "Steigende Sichtbarkeit" }],
  },
  {
    id: 3,
    ausgangslage_text: "- Markante, ästhetische Ansprache, jedoch fehlende Sichtbarkeit in Suchmaschinen.\n- Inhalte ohne ausreichende Keyword-Abdeckung für relevante Suchbegriffe.\n- Bilder nicht indexiert, also für die Suche nicht auffindbar und somit nicht in der Lage, Rankings in der Bildersuche zu generieren.",
    ziele_left_title: "Sichtbarkeit & Keywords",
    ziele_left_text: "- Erhöhung der Sichtbarkeit in Google für hochwertige Suchbegriffe im Innenausbau.\n- Verwendung fachlicher Sprache zur Ansprache von Innendesignern und Architekten.\n- Snippet-Optimierung zur besseren Auffindbarkeit.",
    ziele_right_title: "Bild-SEO & Indexierung",
    ziele_right_text: "- Indexierung und fachliche Beschreibung der Bilder.\n- Fachlich präzise Formulierung von Alt-Tags für alle relevanten Bilder.\n- Indexierungsmanagement aufbauen.",
    vorgehen_items: [
      { title: "Workshop mit der Tischlerei Haidacher", text: "SEO-Grundlagen und Möglichkeiten ohne Designänderungen erklärt. Sensibilisierung für Snippets, Bild-SEO und Keywords." },
      { title: "Snippet-Optimierung", text: "Entwicklung eines Keyword-Sets in Fachsprache für die Zielgruppe. Erstellung optimierter HTML-Titel und Meta Descriptions." },
      { title: "Bild-SEO & Indexierung", text: "Fachlich präzise Formulierung von Alt-Tags für Bilder. Indexierung der Bilder für die Google Bildersuche." },
    ],
    ergebnis_text: "- Verbesserte organische Sichtbarkeit ohne Veränderung der Markenpräsenz.\n- Fachlich relevante Keyword-Rankings erstmals erzielt.\n- Klicks haben sich von 137 auf 300 in drei Monaten gesteigert.\n- Relevante Snippets steigern Auffindbarkeit.\n- Indexierte Bilder als zusätzlicher Sichtbarkeitstreiber.\n- Ansprache von Innendesignern und Architekten als Zielgruppe gestärkt.\n- Befähigung des Unternehmens, neue Projekte und Case Studies fachlich korrekt und SEO-optimiert anzulegen.",
    kpis: [{ value: "137 → 300", label: "Klicks in 3 Monaten" }],
  },
  {
    id: 4,
    ausgangslage_text: "- Keine Inhouse-Kapazitäten für die tägliche Content-Pflege, wodurch Aktualität und SEO-Chancen litten.\n- Veraltete Prozesse und CMS-Beschränkungen, die eine effektive Content-Erstellung und Vorschau verhinderten.\n- Bedarf an einer fundierten Entscheidung für ein neues CMS, das technische und SEO-Anforderungen erfüllt.\n- Risiko von Sichtbarkeitsverlusten durch technische SEO-Schwächen im möglichen Zielsystem.",
    ziele_left_title: "Content & Prozesse",
    ziele_left_text: "- Sicherstellung einer tagesaktuellen, optimierten Content-Pflege und Webseitenmanagement.\n- Aufbau einer flexiblen, effizienten Content-Produktionsumgebung.\n- Unterstützung bei der CMS-Auswahl durch eine fundierte technische SEO-Analyse.",
    ziele_right_title: "SEO & Sichtbarkeit",
    ziele_right_text: "- Stärkung der digitalen Sichtbarkeit und Markenpräsenz.\n- Technische SEO-Mängel frühzeitig identifizieren und beheben.\n- Langfristige, nachhaltige SEO-Grundlage schaffen.",
    vorgehen_items: [
      { title: "SEO-optimiertes Content-Management", text: "Bereitstellung eines Projektmanagers zur Steuerung und Übersetzung interner Anforderungen in Tickets. Tägliche Pflege und Veröffentlichung von Inhalten direkt im CMS von De Gruyter. SEO-Optimierung bestehender und neuer Inhalte vor Veröffentlichung." },
      { title: "Aufbau eines Headless CMS mit Craft CMS (mit Welance GmbH)", text: "Entwicklung eines Headless CMS zur visuellen und effizienten Content-Pflege. HTML-Export/Import zur Nutzung im bestehenden De Gruyter CMS. Vereinfachung der Content-Produktion und Vorschauprozesse für das Team." },
      { title: "Technische SEO-Analyse zur CMS-Auswahl", text: "Durchführung einer technischen SEO-Analyse eines Referenzsystems (content.sciendo.com). Analyse zu Indexierung, Duplicate Content, Canonicals, Ladezeiten, strukturierten Daten, Meta-Tags, Überschriftenstruktur. Identifikation potenzieller SEO-Schwächen des Zielsystems und Ableitung von Handlungsempfehlungen." },
    ],
    ergebnis_text: "- Tagesaktuelle, stabile Content-Pflege zur Sicherung von Relevanz und Sichtbarkeit.\n- Effiziente und visuelle Content-Produktion dank des Headless CMS.\n- Technische SEO-Anforderungen frühzeitig erkannt und berücksichtigt.\n- Fundierte Entscheidungsgrundlage für die CMS-Auswahl.\n- Nachhaltige Stärkung der digitalen Sichtbarkeit von De Gruyter.\n\nLearnings:\n- Technisches SEO ist entscheidend für CMS-Auswahl und Plattformstrategie.\n- Headless CMS vereinfacht komplexe Content-Prozesse.\n- DigiPub liefert Struktur, SEO-Expertise und skalierbare Lösungen für Verlage.",
  },
];

for (const { id, ...data } of patches) {
  const res = await fetch(`${BASE}/items/digipub_case_studies/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.errors) console.error(`ID ${id}:`, json.errors[0].message);
  else console.log(`✓ ID ${id} aktualisiert`);
}
