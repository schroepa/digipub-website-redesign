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
  /** Spaltenlabels der Vorher/Nachher-Tabelle – falls nicht gesetzt, greifen
   *  die generischen Defaults der VergleichsTabelle ("Ohne/Mit DigiPub"). */
  vergleichsLabels?: { ohne: string; mit: string };
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
    vergleichsLabels: { ohne: "Ohne SEO-Briefing", mit: "Mit DigiPub-Briefing" },
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
