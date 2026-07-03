import type { Leistung } from "./directus";

// Reihenfolge der Leistungsseiten für die Pfadnavi-Pfeile (Pagination)
export const leistungenOrder = [
  "markenaufbau-branding",
  "seo-geo",
  "designsystem",
  "automatisierung",
  "ki-implementierung",
];

export const leistungenFallback: Record<string, Leistung> = {

  "markenaufbau-branding": {
    id: 1, status: "published",
    slug: "markenaufbau-branding",
    number: "01 / 05",
    breadcrumb: "Markenaufbau",
    nav_intro_label: "Markenaufbau",
    title: "Digitaler Markenaufbau heute",
    subtitle: "Warum moderne Markenführung digitaler wird",
    hero_text: "Markenaufbau heute bedeutet, den echten Mehrwert eines Unternehmens über alle analogen und digitalen Touchpoints hinweg sichtbar, erlebbar und vertrauenswürdig zu machen.",

    intro_title: "Markenaufbau muss digital gedacht werden!",
    intro_text_1: "Markenaufbau heute bedeutet, den echten Mehrwert eines Unternehmens über alle analogen und digitalen Touchpoints hinweg sichtbar, erlebbar und vertrauenswürdig zu machen.",
    intro_bold: "Mehrwert ist Marke. Und Marke entsteht, wenn Menschen, Prozesse und digitale Systeme zusammenfinden.",
    intro_text_2: "Unternehmen, die ihre Marke neu ausrichten, verbinden Strategie, Design, Sprache und digitale Prozesse zu einem System, das Wiedererkennbarkeit schafft, Vertrauen stärkt und Wachstum fördert.",
    intro_image: undefined,

    section1_title: "Markenaufbau als Transformationsprozess",
    section1_text: "Unternehmen, die bisher vor allem analoge Produkte oder Dienstleistungen anbieten, stehen vor einem tiefgreifenden Wandel: Digitalisierung verändert Strukturen, Prozesse, Kundenverhalten und damit zwangsläufig die Marke.",
    section1_bold: "Markenaufbau ist deshalb mehr als Logo und Kommunikation. Er ist ein Transformationsprozess, der Außenwirkung und Innenleben des Unternehmens miteinander verbindet.",
    section1_image: undefined,

    section2_title: "Markenbildung als Übersetzungsleistung",
    section2_text: "Digitale Systeme, Automatisierung und KI erzeugen eine Rückkopplung in die Organisation:\n- Teams arbeiten anders\n- Entscheidungen werden datengetriebener\n- Kundenerwartungen steigen\n- Kommunikation wird schneller, spezifischer, personalisierter\nMarkenbildung übersetzt diese Veränderungen in klare Positionierung, passende Sprache, kohärentes Design und spürbaren Mehrwert.",
    section2_bold: "",
    section2_image: undefined,

    ansatz_title: "Unser Ansatz",
    ansatz_text_1: "Markenaufbau beginnt beim Verstehen:\n- Was ist der echte Mehrwert?\n- Wer sind die Menschen dahinter?\n- Welche Zielgruppe soll erreicht werden?\n- Welche Sprache spricht die Zielgruppe?\n- Welche Prozesse, Produkte oder digitalen Services prägen die Marke heute und in Zukunft?",
    ansatz_text_2: "Diese Fragen stammen aus der strategischen SEO- und GEO-Arbeit, denn Sichtbarkeit entsteht dort, wo Relevanz, Nutzerintention und Markenversprechen übereinstimmen.",
    ansatz_bold: "Daraus entsteht eine Marke, die authentisch, nutzerzentriert und zukunftsfähig ist.",
    ansatz_image: undefined,

    leistungen_title: "Leistungen im Marken-Aufbau",
    key_takeaways: [
      { title: "Markenaufbau bedeutet heute", text: "Den echten Mehrwert eines Unternehmens sichtbar, verständlich und vertrauenswürdig zu machen." },
      { title: "Digitaler Wandel & Marke sind untrennbar", text: "Jede Veränderung in Prozessen, Services oder Strukturen formt auch die Außenwirkung." },
      { title: "Mehrwert ist Marke", text: "Eine starke Marke entsteht dort, wo Nutzen, Zielgruppenverständnis und klare Kommunikation zusammenkommen." },
      { title: "Konsistenz über alle Touchpoints", text: "Design, Sprache und digitale Systeme müssen eine erkennbare, glaubwürdige Welt erzeugen." },
      { title: "Vertrauen als Kern", text: "Durch klare Positionierung, relevante Inhalte und EEAT-/GEO-Prinzipien entsteht Autorität im Markt." },
    ],
    leistungen_cards: [
      { title: "Strategische Markenentwicklung", text: "Wir definieren die Grundlagen für eine starke, klare Positionierung: Werte, Mission, Vision, Markenversprechen & Nutzenargumentation, Wettbewerb & Alleinstellung (USP/UVP), Leitplanken für Kommunikation, Tonalität und Markenverhalten sowie Übertragung in digitale Angebote, Touchpoints und Services.", ziel: "Die Marke erhält einen Kompass, der intern wie extern Orientierung schafft." },
      { title: "Visuelle Identität & digitales Designsystem", text: "Eine starke Marke braucht eine visuelle Sprache, die Wiedererkennung erzeugt, analog und digital. Wir entwickeln: Logo & Markenzeichen, Farb- & Formwelten, Typografie, Iconografie & Bildstil, Komponenten für Websites und mobile Anwendungen sowie Regeln für KI-generierte Bilder.", ziel: "Eine konsistente, funktionale Markenwelt, die auf allen Kanälen einheitlich wirkt." },
      { title: "Marken-Kommunikation & Zielgruppen-Ansprache", text: "Marke wird durch Sprache erlebbar. Wir entwickeln: Tonalitätsleitfäden, Argumentationslinien für Entscheidungsträger (B2B) und Konsumenten (B2C), Nutzenbotschaften, Storytelling und Guidelines für KI-gestützte Contentproduktion.", ziel: "Eine Sprache, die Vertrauen aufbaut und die Zielgruppe emotional wie rational abholt." },
      { title: "Zielgruppenrelevanz & Nutzerzentrierung", text: "Markenaufbau ist nur erfolgreich, wenn die Botschaft die Menschen trifft, für die sie gemacht ist. Wir analysieren: Bedürfnisse & Erwartungen, Mediennutzung, Entscheidungsverhalten, Barrieren & Pain Points sowie Chancen für personalisierte Kommunikation.", ziel: "Die Marke spricht die Sprache der Zielgruppe, nicht die des Unternehmens." },
      { title: "Vertrauen, Autorität & Erfahrung (SEO/GEO & EEAT)", text: "Vertrauen ist heute ein technisches und inhaltliches Thema. Wir entwickeln Marken so, dass sie auch für Suchmaschinen, KI-Suchsysteme und Bewertungsalgorithmen vertrauenswürdig wirken: EEAT, GEO, Social Proof, konsistente Datenstruktur und Guidelines für Content, der KI-Antwortsysteme zuverlässig bedient.", ziel: "Die Marke wird sichtbar, glaubwürdig und relevant, für Menschen und Maschinen." },
      { title: "Markenbekanntheit & nachhaltige Sichtbarkeit", text: "Wir begleiten die Marke auf dem Weg zum Markt: Storylines für Social Media & PR, Einführungskampagnen, Contentstrategien, Employer Branding und interne Kommunikation sowie Erfolgsmessung & datenbasierte Optimierung.", ziel: "Die Marke verankert sich langfristig im Markt und im Gedächtnis der Zielgruppe." },
    ],
    wieso_title: "Wieso mit DigiPub?",
    wieso_subtitle: "Markenaufbau heute bedeutet, den echten Mehrwert eines Unternehmens sichtbar, erlebbar und vertrauenswürdig zu machen, über alle analogen und digitalen Touchpoints hinweg.",
    wieso_items: [
      { text: "Wir teilen Wissen, statt es in Silos zu halten." },
      { text: "Mitarbeitende wachsen aktiv mit." },
      { text: "Ein echtes Gegenüber für nachhaltige Weiterentwicklung." },
      { text: "Wir arbeiten vom aktuellen Reifegrad aus." },
      { text: "Tiefe Zusammenarbeit verbessert Prozesse nachhaltig." },
      { text: "Gemeinsame Entwicklung statt Ergebnisübergabe." },
    ],
  },

  "seo-geo": {
    id: 2, status: "published",
    slug: "seo-geo",
    number: "02 / 05",
    breadcrumb: "SEO / GEO",
    nav_intro_label: "SEO / GEO",
    title: "SEO/GEO in KI-Zeiten",
    subtitle: "Warum SEO/GEO heute relevant ist",
    hero_text: "SEO (Search Engine Optimization) bleibt die Grundlage und GEO (Generative Engine Optimization) ergänzt sie: Wir sorgen dafür, dass deine Inhalte nicht nur ranken, sondern auch in generativen Antworten zitiert, empfohlen und korrekt wiedergegeben werden.",

    intro_title: "Relevanz. Sichtbarkeit. Leads.",
    intro_text_1: "Das gelingt über Helpful-Content, E-E-A-T-Signale, saubere Technik, Plattformpräsenz und ein Reporting, das KI-Sichtbarkeit messbar macht.",
    intro_bold: "Von Menschen verstanden. Von Maschinen zitiert.",
    intro_text_2: "Sichtbarkeit entsteht durch Relevanz. Je spezifischer die Zielgruppe, desto höher die Chance auf SEO- und GEO-Sichtbarkeit.",
    intro_image: undefined,

    section1_title: "GEO baut auf SEO auf",
    section1_text: "GEO ist ohne SEO nicht zu denken. Bevor Inhalte in generativen Antworten erscheinen können, müssen die grundlegenden SEO-Regeln erfüllt sein: technische Zugänglichkeit, klare Struktur, inhaltliche Relevanz und eine saubere Nutzerführung. Generative Suchsysteme greifen nicht auf Inhalte zu, die sie nicht verstehen oder nicht erreichen können.",
    section1_bold: "Viele der heute unter GEO diskutierten Handlungsanweisungen sind Weiterentwicklungen bekannter SEO-Best Practices. GEO erweitert diese Anforderungen um die Frage, wie Inhalte zitiert, zusammengefasst und eingeordnet werden.",
    section1_image: undefined,

    section2_title: "SEO & GEO als Rückkopplung",
    section2_text: "GEO verändert nicht nur Sichtbarkeit, sondern Arbeitsweisen. Inhalte entstehen näher an der Praxis, Answer-first und zunehmend aus erster Hand. Hersteller, Fachbereiche und Verantwortliche bringen ihr Wissen direkt ein und erklären Entscheidungen, Prozesse und den Aufwand hinter Produkten und Leistungen.",
    section2_bold: "Diese Rückkopplung wirkt ins Unternehmen zurück: Praxiswissen wird sichtbar, Qualität und Aktualität werden verbindlich, Sichtbarkeit wird zur Vertrauensfrage.",
    section2_image: undefined,

    ansatz_title: "Unser Ansatz",
    ansatz_text_1: "Sichtbarkeit entsteht durch Relevanz. Deshalb klären wir zuerst den echten Mehrwert: Warum dieses Produkt? Warum jetzt? Und was unterscheidet es wirklich von bestehenden Angeboten?",
    ansatz_text_2: "Wir arbeiten Answer-first und identifizieren gezielt Informationslücken in generativen Suchsystemen. Unsere Leitfragen: Relevante Themen definieren, reale Prompts verstehen, Vertrauen & Belege klären, Content-Lücken schließen.",
    ansatz_bold: "So entsteht Content, der Mehrwert stiftet, Vertrauen aufbaut und langfristig sichtbar bleibt.",

    leistungen_title: "Leistungen im SEO & GEO",
    key_takeaways: [
      { title: "GEO ist kein Trick", text: "SEO-Basics + zitierfähige Inhalte + Vertrauen sind der Hebel." },
      { title: "KI-Ergebnisse sind volatil", text: "Inhalte müssen gepflegt, geprüft und nachjustiert werden (Studien zeigen ~70% Wechsel in 2-3 Monaten bei AI Overviews)." },
      { title: "Sichtbarkeit wird neu definiert", text: "Mentions, Citations, Share of Voice ergänzen Ranking-KPIs." },
      { title: "Prompts statt Keywords", text: "Nutzer fragen natürlicher und komplexer. Content muss direkter antworten und besser strukturiert sein." },
      { title: "Offpage zählt anders", text: "Erwähnungen (auch ohne Link) und Präsenz auf relevanten Plattformen beeinflussen, ob KI dich nennt." },
      { title: "SEO-Basics bleiben das Fundament", text: "Als Grundlage für alles, was GEO darauf aufbaut." },
    ],
    leistungen_cards: [
      { title: "Content & Sprache: zitierfähig statt generisch", text: "Answer-first-Redaktion (direkte Antworten, klare Absätze, Listen, FAQ), Content-Qualität & Spezialisierung (Nutzwert, Daten, Praxisbelege), E-E-A-T-Ausbau: Autorenprofile, Cases, Testimonials, Referenzen sowie Content-Refresh-Programm: Aktualisieren statt Content-Friedhof.", ziel: "Inhalte, die ranken und in generativen Antworten zitiert werden." },
      { title: "Technisches Fundament: SEO-Basics für GEO", text: "Struktur & Informationsarchitektur (Themencluster, interne Verlinkung), strukturierte Daten / Schema (z.B. FAQ/HowTo/Produkt), Performance & Mobile UX als Grundlage sowie KI-Traffic-Fallen vermeiden (z.B. 404s durch halluzinierte URLs auffangen).", ziel: "Saubere Basis, auf der GEO-Maßnahmen greifen." },
      { title: "Prompt-Funnel-Matrix", text: "Prompt-Research (Awareness bis Conversion), Content-Planung je Funnel-Stufe: Ratgeber, Vergleiche/Top X, Leistungs-/Proof-Seiten sowie Gap-Analyse: Wo werden Wettbewerber genannt, wir aber nicht?", ziel: "Sichtbarkeit entlang der gesamten Customer Journey." },
      { title: "Plattform- & Offpage-Strategie", text: "Digital PR & Platzierungen (Fachmedien, Rankings, Best of, Interviews), Community-/Foren-Strategie (hilfreiche Beiträge, echte Expertise), Reputation: Reviews/Testimonials systematisch fördern sowie Knowledge-/Entity-Pflege (konsistente Unternehmensinfos).", ziel: "Erwähnungen, die KI aufgreift und weitergibt." },
      { title: "Vertrauen, Autorität & Erfahrung (EEAT)", text: "E-E-A-T stärken (Experience, Expertise, Authority, Trust), GEO umsetzen für KI-Antwortsysteme, Social Proof: Cases, Referenzen, Bewertungen sowie konsistente digitale Identität (Schema, Entitäten, Unternehmensdaten).", ziel: "Sichtbar, glaubwürdig und relevant, für Menschen und Maschinen." },
      { title: "Tracking & Analyse: KI-Sichtbarkeit messbar machen", text: "KPIs wie Mention/Citation-Tracking & Share of Voice in generativen Antworten, Tool-Setups/Workflows (z.B. SISTRIX AI Overviews, Ahrefs Brand Radar für AI-Plattform-Visibility) sowie Monitoring der Volatilität & schnelle Nachsteuerung.", ziel: "Transparenz über SEO- und GEO-Performance in einem System." },
    ],
    wieso_title: "Wieso mit DigiPub?",
    wieso_subtitle: "Unsere Arbeit im SEO ist der Ausgangspunkt für vieles, was wir tun. Viele der Fragen nach Relevanz, Zielgruppe, Mehrwert und Klarheit durchziehen das gesamte Unternehmen.",
    wieso_items: [
      { text: "Wir bleiben nah am Need: Sichtbarkeit, Vertrauen, Leads, nicht Buzzwords." },
      { text: "Wir holen Teams dort ab, wo sie stehen, und bauen Kompetenz auf." },
      { text: "Wir verbinden SEO, Content, Marke, PR und Daten zu einem System." },
      { text: "Wir arbeiten vom aktuellen Reifegrad aus." },
      { text: "Wir messen Wirkung auch dort, wo Search sich verändert: Mentions, Citations, Share of Voice." },
      { text: "Wir arbeiten iterativ, weil KI-Ergebnisse volatil sind und bleiben dran." },
    ],
    faq_items: [
      {
        question: "Was ist der Unterschied zwischen SEO und GEO?",
        answer:
          "SEO optimiert Seiten für klassische Suchmaschinen wie Google – mit dem Ziel, in den organischen Ergebnissen zu erscheinen. GEO (Generative Engine Optimization) geht weiter: es optimiert Inhalte so, dass KI-Systeme wie ChatGPT, Perplexity oder Google AI Overviews sie als vertrauenswürdige Quelle zitieren. Entscheidend: Ohne solides technisches SEO-Fundament kann keine GEO-Maßnahme greifen. Die Reihenfolge ist keine Empfehlung, sondern eine technische Voraussetzung.",
      },
      {
        question: "Für welche Unternehmensgrößen ist DigiPub geeignet?",
        answer:
          "Primär für KMU und Mittelstand im DACH-Raum mit 10 bis 1.500 Mitarbeitenden – von Startups, die ein solides digitales Fundament benötigen, bis zu Mittelständlern oder Verlagen. DigiPub arbeitet als Einzelberater oder mit einem flexiblen Netzwerk – ohne die Fixkosten einer Agentur, mit der Tiefe eines Senior-Profils.",
      },
      {
        question: "Wie lange dauert ein typisches SEO-Projekt bei DigiPub?",
        answer:
          "Ein SEO-Grundlagen-Audit ist in 2–3 Wochen abgeschlossen und liefert einen priorisierten Maßnahmenplan. Sprint-Projekte laufen 4–8 Wochen. Für nachhaltige Sichtbarkeit empfiehlt sich ein monatliches Steuerungsmandat – die ersten messbaren Ergebnisse sind bei konsequenter Umsetzung nach 3–6 Monaten sichtbar.",
      },
      {
        question: "Arbeitet DigiPub auch mit unserer bestehenden Webagentur zusammen?",
        answer:
          "Ja – das ist der häufigste Fall. DigiPub liefert die strategische und technische SEO-Grundlage als Briefing-Dokument, das die Agentur direkt umsetzen kann. Eine direkte Abstimmung mit der Agentur ist auf Wunsch möglich.",
      },
    ],
  },

  "designsystem": {
    id: 3, status: "published",
    slug: "designsystem",
    number: "03 / 05",
    breadcrumb: "Designsystem",
    nav_intro_label: "Designsystem",
    title: "Vom Mehrwert zur konsistenten Gestaltung mit Designsystem",
    subtitle: "Konsistenz über alle Touchpoints",
    hero_text: "Marken entstehen heute über viele Berührungspunkte: Websites, Social Media, Präsentationen, Angebote, Screens oder Newsletter. Damit diese Touchpoints nicht auseinanderlaufen, braucht Gestaltung ein klares System.",

    intro_title: "Form follows Function",
    intro_text_1: "Ein Designsystem übersetzt Inhalt und Funktion in eine konsistente visuelle Sprache. Es sorgt dafür, dass Gestaltung verständlich, wiedererkennbar und skalierbar bleibt, unabhängig davon, wo sie eingesetzt wird.",
    intro_bold: "Wir entwickeln skalierbare Gestaltungssysteme, die Marken stärken, Prozesse vereinfachen und Teams schneller machen, immer auf Basis eines tragfähigen Konzepts.",
    intro_text_2: "Denn Design wirkt nur dann, wenn Inhalt, Funktion und Form zusammenspielen.",
    intro_image: undefined,

    section1_title: "Warum ein Multibrand-Designsystem?",
    section1_text: "Sobald mehrere Marken, Produktlinien oder Länderauftritte parallel existieren, entsteht schnell gestalterischer Wildwuchs: Unterschiedliche Farben, Schriften, Vorlagen und Ad-hoc-Entscheidungen. Das Ergebnis sind Inkonsistenzen, langsame Abstimmungen und ein Auftritt, der an Wiedererkennbarkeit verliert.",
    section1_bold: "Ein Multibrand-Designsystem schafft hier Ordnung. Es ist die Single Source of Truth für Gestaltung: verbindlich für Design, Marketing, Content und Entwicklung.",
    section1_image: undefined,

    section2_title: "Designsystem ist nicht UI-Kit",
    section2_text: "Ein Designsystem ist mehr als eine Sammlung schöner Komponenten. Gestaltung ergibt nur dann Sinn, wenn das Konzept hinter dem Inhalt klar ist. Ein Konzept muss verständlich sein, Informationen brauchen Hierarchie, Rhythmus und Gewicht, Wahrnehmung entsteht durch Struktur, nicht durch Überfrachtung.",
    section2_bold: "Bildsprache, Typografie und Layout müssen ineinandergreifen, damit Inhalte verständlich und emotional wirksam werden. Design ohne konzeptionelles Verständnis bleibt Oberfläche.",
    section2_image: undefined,

    ansatz_title: "Unser Ansatz",
    ansatz_text_1: "Design mit konzeptionellem Verständnis in 5 Schritten: Klärung von Marken, Zielgruppen und Inhalten, Definition von Struktur, Hierarchie und Regeln, Übersetzung in eine visuelle Systematik, Systematisierung für mehrere Marken und Befähigung der Teams im Umgang mit dem System.",
    ansatz_text_2: "So entsteht ein Designsystem, das trägt, statt zu belasten, und mit dem Unternehmen mitwächst.",
    ansatz_bold: "Daraus entsteht ein Designsystem, das verstanden wird, genutzt wird und mit dem Unternehmen wächst.",

    leistungen_title: "Leistungen im Design-System",
    key_takeaways: [
      { title: "Gestaltung macht den Mehrwert einer Marke verständlich", text: "Ein Designsystem übersetzt Inhalte, Funktion und Markenlogik in eine konsistente visuelle Sprache." },
      { title: "Form Follows Function", text: "Gestalterische Entscheidungen leiten sich aus Inhalt, Nutzung und Wahrnehmung ab, nicht aus Geschmack." },
      { title: "Konsistenz über alle Touchpoints hinweg", text: "Website, Präsentationen, Angebote, Social Media oder Screens folgen denselben Prinzipien und wirken als zusammenhängende Markenwelt." },
      { title: "Single Source of Truth für Gestaltung", text: "Ein Designsystem schafft klare Regeln und ersetzt individuelle Entscheidungen durch nachvollziehbare Strukturen." },
      { title: "Skalierbar für Teams, Kanäle und Wachstum", text: "Gestaltung bleibt konsistent, auch wenn neue Formate, Inhalte oder Marken hinzukommen." },
      { title: "Gestaltung, die verstanden und genutzt wird", text: "Klare Systeme reduzieren Wildwuchs, erleichtern Abstimmungen und schaffen Orientierung." },
    ],
    leistungen_cards: [
      { title: "Designsystem-Strategie & Systemarchitektur", text: "Wir definieren die Struktur, auf der alle Marken, Anwendungen und Touchpoints aufbauen. Wir erarbeiten: Designsystem-Ziele & Einsatzkontexte, Multibrand-Logik (Core-System + markenspezifische Layer), Regeln für Konsistenz und bewusste Abweichung, Hierarchien, Modularität & Skalierbarkeit sowie Governance: Wie das System gepflegt und weiterentwickelt wird.", ziel: "Ein belastbares System, das Orientierung schafft, Wildwuchs verhindert und mit dem Unternehmen mitwächst." },
      { title: "Visuelle Systematik, Bildsprache & Informationsdesign", text: "Form folgt Funktion: visuelle Entscheidungen leiten sich aus Inhalt, Nutzung und Wahrnehmung ab. Wir entwickeln: Farb- & Formsysteme, Typografie-Systeme, Abstands-, Grid- & Layoutlogiken, Bildsprache & visuelle Narrative, Informationshierarchien & Leseführung sowie Regeln für Reduktion statt Überfrachtung.", ziel: "Inhalte werden verstanden, wiedererkannt und erinnert, nicht nur gestaltet." },
      { title: "Design-Tokens, Komponenten- & Layoutsysteme", text: "Wir übersetzen Konzept und visuelle Regeln in konkrete, wiederverwendbare Bausteine. Wir entwickeln: Design-Tokens (Farben, Typografie, Spacing etc.), markenspezifische Variablen, UI-Komponenten, modulare Layoutsysteme sowie Vorlagen für wiederkehrende Formate.", ziel: "Schneller arbeiten, weniger Reibung, gleichbleibende Qualität, unabhängig von Marke oder Kanal." },
      { title: "Figma-Implementierung, Kollaboration & Enablement", text: "Ein Designsystem ist kein Artefakt, sondern ein Arbeitswerkzeug. Wir setzen um: Figma als Single Source of Truth, zentrale Libraries & Multibrand-Setups, gemeinsame Nutzung für Design, Marketing & Content, Dokumentation direkt im System sowie Einführung, Schulung & Befähigung der Teams.", ziel: "Ein lebendiges Designsystem, das genutzt, gepflegt und eigenständig weiterentwickelt wird." },
      { title: "Interaktive digitale Touchpoints", text: "Web, Kampagnen & Landingpages, Social Media, Newsletter, Apps und E-Mail-Kommunikation: Das Designsystem stellt sicher, dass alle interaktiven Touchpoints konsistent wirken, verständlich bleiben und skalierbar sind.", ziel: "Konsistenter Markenauftritt bei hoher Dynamik, ohne gestalterischen Wildwuchs." },
      { title: "Statische Touchpoints & Übertragbarkeit", text: "Angebote, Präsentationen & Pitch-Decks, Screens & Displays, Meeting-Hintergründe sowie physische & hybride Anwendungen: Farben, Typografie, Layoutprinzipien und Bildsprache werden so definiert, dass sie auch außerhalb digitaler Oberflächen funktionieren.", ziel: "Professioneller, konsistenter Auftritt auf allen Kanälen, analog wie digital." },
    ],
    wieso_title: "Wieso mit DigiPub?",
    wieso_subtitle: "Wir denken Designsysteme nicht als Selbstzweck, sondern als Übersetzung von Marke, Inhalt und Funktion. Unser Fokus liegt auf Verständlichkeit, Wartbarkeit und Wirkung, nicht auf Overengineering.",
    wieso_items: [
      { text: "Wir denken Designsysteme konzeptionell, nicht dekorativ." },
      { text: "Wir bauen Systeme, die verstanden und genutzt werden, nicht nur gestaltet." },
      { text: "Ein Designsystem ist für uns ein gemeinsamer Arbeitsraum, kein Artefakt." },
      { text: "Wir arbeiten vom realen Reifegrad der Marken und Teams aus." },
      { text: "Tiefe Zusammenarbeit schafft Klarheit, Konsistenz und Geschwindigkeit." },
      { text: "Designsysteme entstehen gemeinsam, nicht als Übergabeprojekt." },
    ],
  },

  "automatisierung": {
    id: 4, status: "published",
    slug: "automatisierung",
    number: "04 / 05",
    breadcrumb: "Automatisierung",
    nav_intro_label: "Automatisierung",
    title: "Prozess-Automatisierung",
    subtitle: "Mehr Zeit für das, was wirklich zählt",
    hero_text: "Automatisierung hilft Unternehmen, Zeit zu sparen, Qualität zu sichern und Engpässe zu lösen, dort wo reale Probleme den Arbeitsalltag bremsen.",

    intro_title: "Automatisierung strategisch denken, nicht isoliert umsetzen",
    intro_text_1: "Gemeint sind nicht visionäre Zukunftsszenarien, sondern ganz konkrete Situationen: Wiederkehrende Aufgaben, manuelle Abstimmungen, fehleranfällige Übergaben oder Prozesse, die mit dem Wachstum nicht mehr mithalten.",
    intro_bold: "Richtig eingesetzt, entlastet Automatisierung Mitarbeitende, verbessert Abläufe und schafft Freiräume für das, was wirklich Wert stiftet.",
    intro_text_2: "Oft sind es bereits kleine Automatisierungen, die spürbare Wirkung entfalten und erst sichtbar machen, wo weiteres Potenzial liegt.",
    intro_image: undefined,

    section1_title: "Automatisierung muss sinnvoll gedacht werden",
    section1_text: "Automatisierung verspricht Entlastung, erzeugt aber oft Unsicherheit: Was automatisieren wir? Was nicht? Wo lohnt sich der Aufwand wirklich? Viele Unternehmen spüren: Es fehlt Zeit, Prozesse sind langsam oder fehleranfällig, Mitarbeitende sind mit operativen Aufgaben gebunden, Digitalisierung fühlt sich fragmentiert an.",
    section1_bold: "Unsere Antwort: Nicht alles automatisieren. Sondern das Richtige.",
    section1_image: undefined,

    section2_title: "Automatisierung als Rückkopplung ins Unternehmen",
    section2_text: "Automatisierung verändert nicht nur Abläufe, sondern auch den Arbeitsalltag: Aufgaben verschieben sich, Verantwortung wird klarer, Entscheidungen basieren stärker auf Daten, Zusammenarbeit wird transparenter, Qualität wird reproduzierbar.",
    section2_bold: "Richtig umgesetzt, wirkt Automatisierung in das Unternehmen zurück: auf Prozesse, Rollen und den Habitus der Mitarbeitenden.",
    section2_image: undefined,

    ansatz_title: "Unser Ansatz: Reale Probleme lösen",
    ansatz_text_1: "Automatisierung beginnt bei uns nicht mit Tools, sondern mit Fragen. Wo entstehen Engpässe? Welche Aufgaben kosten unverhältnismäßig viel Zeit? Wo fehlen Ressourcen oder Personal? Welche Prozesse sind fehleranfällig oder unklar? Wo leidet Qualität oder Verlässlichkeit?",
    ansatz_text_2: "In ernsthaften Automatisierungsprojekten fällt das Wort KI in den ersten zwei Wochen meist kaum. Automatisierung muss bestehende, reale Probleme lösen, keine hypothetischen.",
    ansatz_bold: "So entsteht echte Wertschöpfung, statt Aktionismus oder Geldverbrennung.",

    leistungen_title: "Leistungen der Automatisierung",
    key_takeaways: [
      { title: "Automatisierung ist kein Selbstzweck", text: "Sie löst reale Probleme." },
      { title: "Wirkung entsteht dort", text: "Wo Prozesse wiederholt, fehleranfällig oder unnötig manuell sind." },
      { title: "Gute Automatisierung beginnt mit Verstehen", text: "Nicht mit Tools." },
      { title: "KI ist Teil der Lösung", text: "Aber nicht ihr Ausgangspunkt." },
      { title: "Schon kleine Automatisierungen", text: "Können große Wirkung entfalten." },
      { title: "Automatisierung schafft Klarheit", text: "Über Prozesse, Rollen und Zusammenarbeit." },
    ],
    leistungen_cards: [
      { title: "Analyse & Priorisierung", text: "Bevor automatisiert wird, schaffen wir Transparenz und eine belastbare Entscheidungsgrundlage: Prozessaufnahme & Reifegradbewertung, Identifikation von Zeitfressern und Engpässen, Bewertung von Automatisierungs-Potenzialen nach Wirkung & Aufwand sowie eine klare Entscheidungs-Grundlage: Was lohnt sich wirklich?", ziel: "Fokus statt Tool-Wildwuchs." },
      { title: "Automatisierung mit Augenmaß", text: "Wir automatisieren dort, wo Wiederholungen entstehen, Medienbrüche vorliegen, manuelle Übertragungen Fehler verursachen und Skalierung blockiert wird. Immer mit Blick auf Wartbarkeit, Verständlichkeit und Akzeptanz im Team.", ziel: "Messbare Entlastung, die langfristig tragfähig ist." },
      { title: "Sales / CRM & Lead-Ops", text: "Automatische Lead-Erfassung & -Weiterleitung, Follow-ups & Erinnerungen sowie CRM-Synchronisation.", ziel: "Schnellere Reaktion, weniger Nacharbeit, bessere Conversion." },
      { title: "Marketing & Content", text: "Content-Vorbereitung & Veröffentlichung, Social-Media-Planung sowie Reporting & Auswertung.", ziel: "Zeitersparnis, konsistente Präsenz, weniger operative Last." },
      { title: "Support & Anfragen", text: "Ticket-Routing, Priorisierung sowie Wissenszugang & Standardantworten.", ziel: "Entlastung von Teams, schnellere Reaktionszeiten." },
      { title: "Daten-Sync, Reporting, Finanzen & Abrechnung", text: "Zusammenführung von Daten aus verschiedenen Systemen, automatisierte Reports & Dashboards, Rechnungserstellung, Zahlungsabgleich und Mahnprozesse.", ziel: "Bessere Entscheidungen, weniger manuelle Arbeit, bessere Cashflow-Sichtbarkeit." },
    ],
    wieso_title: "Wieso mit DigiPub?",
    wieso_subtitle: "Automatisierung entfaltet ihren Wert nicht durch Tools, sondern durch Verständnis. Wir begleiten Unternehmen nicht mit vorgefertigten Lösungen, sondern mit einem klaren Blick auf reale Probleme.",
    wieso_items: [
      { text: "Wir lösen reale Probleme, keine Buzzwords." },
      { text: "Wir holen Unternehmen dort ab, wo sie stehen." },
      { text: "Wir denken Automatisierung prozessorientiert." },
      { text: "Mitarbeitende werden eingebunden und wachsen mit." },
      { text: "Wissen wird geteilt, nicht gebunkert." },
      { text: "Automatisierung wird verständlich, wartbar und nachhaltig." },
    ],
  },

  "ki-implementierung": {
    id: 5, status: "published",
    slug: "ki-implementierung",
    number: "05 / 05",
    breadcrumb: "KI-Implementierung",
    nav_intro_label: "KI-Implementierung",
    title: "Fortschritt mit Augenmaß. Sicherheit statt Risiko.",
    subtitle: "Klarheit vor Technologie. Mehrwert statt Aktionismus.",
    hero_text: "KI im Unternehmen bedeutet nicht, möglichst viele Tools einzuführen, sondern die richtigen nächsten Schritte zu identifizieren. Wir helfen Unternehmen dabei, aus den unendlichen Möglichkeiten genau dort anzusetzen, wo KI datengetrieben, nachvollziehbar und schrittweise konkreten, messbaren Mehrwert schafft.",

    intro_title: "Strategie vor Technologie: Den Hype beherrschbar machen",
    intro_text_1: "Viele Unternehmen spüren den Druck, etwas mit KI machen zu müssen, fürchten aber den Kontrollverlust oder rechtliche Fallstricke. Das eigentliche Risiko ist dabei selten die Technik selbst, sondern ein unstrukturierter Einsatz. Ohne klare Regeln und saubere Daten führt KI zu digitalem Müll in Lichtgeschwindigkeit.",
    intro_bold: "Das beste KI Projekt hat am Anfang nichts mit KI zu tun, sondern mit einem realen wirtschaftlichen Problem.",
    intro_text_2: "KI kommt bei uns nicht um jeden Preis zum Einsatz, sondern dort, wo Automatisierung an ihre Grenzen stößt und menschliche Fähigkeiten wie Interpretation, Personalisierung oder Skalierung sinnvoll unterstützt werden.",
    intro_image: undefined,

    section1_title: "KI als Brücke zwischen Mensch und Prozess",
    section1_text: "Richtig eingesetzt, übernimmt KI die Aufgaben, die für klassische Regeln zu komplex sind: das Interpretieren von unstrukturierten Texten, das Zusammenfassen von Wissen oder das Übersetzen von Nutzerabsichten in Ergebnisse.",
    section1_bold: "KI sollte nicht im Zentrum stehen, sondern im Hintergrund wirken, als intelligenter Assistent, der Zuarbeit leistet, während die fachliche Verantwortung und die finale Entscheidung immer beim Menschen bleiben.",
    section1_image: undefined,

    section2_title: "Modularer Aufbau statt Big Bang",
    section2_text: "KI-Projekte scheitern oft am Big-Bang-Versuch. Wir setzen auf einen modularen Aufbau, der Vertrauen schafft: 1. Governance & Compliance (klären zuerst das Dürfen), 2. Guided Prompting (methodische KI-Steuerung), 3. Spezialisierte Assistenten (isolierte Aufgaben), 4. Skalierung & Agenten (erst wenn die Basis sicher steht).",
    section2_bold: "Immer ausgehend vom aktuellen Reifegrad des Unternehmens, ohne Verpflichtungsgefühl, ohne Hype, dafür mit Struktur, Verantwortung und Klarheit.",
    section2_image: undefined,

    ansatz_title: "Unser Ansatz",
    ansatz_text_1: "KI-Projekte scheitern oft am Big Bang-Versuch. Wir setzen auf einen modularen Aufbau, der Vertrauen schafft: Governance & Compliance, Guided Prompting, spezialisierte Assistenten und erst dann Skalierung & Agenten.",
    ansatz_text_2: "Dieser kontrollierte Einsatz sorgt dafür, dass die Qualität deiner Marke gewahrt bleibt, während die Effizienz massiv steigt.",
    ansatz_bold: "Daraus entsteht eine Marke, die authentisch, nutzerzentriert und zukunftsfähig ist.",

    leistungen_title: "KI-Leistungen",
    key_takeaways: [
      { title: "Sicherheit ist das Fundament", text: "DSGVO-Konformität und AI Act sind keine Hürden, sondern deine Leitplanken." },
      { title: "Ordnung vor Intelligenz", text: "KI entfaltet ihre Wirkung nur auf sauberen Prozessen und Daten." },
      { title: "Schrittweise Evolution", text: "Wir starten mit sicherem Prompting und skalieren bis zu autonomen Agenten." },
      { title: "Kontrolle bleibt menschlich", text: "Wir bauen Assistenzsysteme, keine unkontrollierbaren Blackboxes." },
      { title: "Methodik statt Hype", text: "Gutes Prompt-Engineering ist das Betriebssystem für effiziente KI-Nutzung." },
      { title: "Reale Probleme lösen", text: "Wir implementieren KI dort, wo sie messbare Zeit spart und Engpässe auflöst." },
    ],
    leistungen_cards: [
      { title: "Governance, Sicherheit & AI Act", text: "Wir schaffen den rechtlichen und ethischen Rahmen für deinen KI-Einsatz: Datenschutz & DSGVO (Auswahl und Setup konformer Systeme wie Azure OpenAI, lokale LLMs), AI Act Readiness (Prüfung der Anwendungen auf Konformität) sowie Risk-Management (Vermeidung von Halluzinationen und Fehlentscheidungen durch Kontrollinstanzen).", ziel: "Sicherer, rechtlich konformer KI-Einsatz von Anfang an." },
      { title: "Prompt-Engineering & Befähigung", text: "Wir machen dein Team zum Dirigenten der KI: Methodisches Prompting (Standard-Prompts für wiederkehrende Aufgaben), Workflow-Design (Integration von KI-Schritten in den Arbeitsalltag) sowie Tool-Kuratierung (die passenden Werkzeuge für deinen spezifischen Bedarf).", ziel: "Dein Team arbeitet souverän und effizient mit KI." },
      { title: "Information & Analyse", text: "KI als Werkzeug, um Datenmengen beherrschbar zu machen: Daten-Normalisierung (Umwandlung unstrukturierter Infos in nutzbare Formate), Recherche & Monitoring (schnelle Auswertung von Markt- und Wettbewerbsdaten) sowie Synthese (intelligente Zusammenfassung komplexer Dokumente und Protokolle).", ziel: "Bessere Entscheidungen durch strukturierte Information." },
      { title: "Content, Code & Kreation", text: "Skalierung deines Outputs ohne Qualitätsverlust: Systematische Content-Produktion (strukturierte Erstellung von Texten und Medien), Code-Assistenz (Erstellung und Prüfung von Skripten) sowie Marken-Konsistenz (KI-Workflows, die deine Sprache und Tonalität halten).", ziel: "Mehr Output, gleiche Qualität, weniger manuelle Last." },
      { title: "Wissens-Assistenten & Bots", text: "Dein Unternehmenswissen, sofort und sicher abrufbar: Interne Wissens-Bots (Chat mit deinen Dokumenten, sicher und ohne Datenabfluss), Support-Assistenten (intelligente Vorqualifizierung und Entlastung) sowie Transparenz (Wissen wird nutzbar, statt in Ordnerstrukturen zu versinken).", ziel: "Schnellerer Wissensabruf, entlastete Teams." },
      { title: "Interne Entlastung & Verwaltung", text: "Oft der schnellste ROI: Zusammenfassungen & strukturierte Extraktion von Informationen, Protokolle & Dokumentation, Vorlagen & Wissensmanagement sowie Onboarding neuer Mitarbeitender.", ziel: "Zeitersparnis dort, wo sie sofort spürbar ist." },
    ],
    wieso_title: "Wieso mit DigiPub?",
    wieso_subtitle: "KI entfaltet ihren Wert erst durch Verständnis und Integration. Wir verkaufen keine isolierten Tools, sondern einen schrittweisen Entwicklungsprozess, der dein Team mitnimmt.",
    wieso_items: [
      { text: "Nähe zu bestehenden Prozessen." },
      { text: "Kleine, wirksame Schritte statt Umbruch." },
      { text: "Früher, erlebbarer Mehrwert." },
      { text: "KI als Teil des Alltags, nicht als Projekt." },
      { text: "Change, der mitwächst." },
      { text: "Erfolge, die Lust auf Weiterentwicklung machen." },
    ],
  },
};
