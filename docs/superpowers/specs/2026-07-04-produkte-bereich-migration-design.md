# Design: Produkte-Bereich — Migration von /leistungen/seo-geo/* nach /produkte/*

## Kontext & Anlass

Der Vertical Slice SEO/GEO (Spec `2026-06-26-produktarchitektur-seo-geo-design.md`, umgesetzt in 17 Commits bis `befbd42`) hat die Produkt- und Need-Seiten unter `/leistungen/seo-geo/...` verschachtelt und die Produktübersicht in die bestehende Leistungsseite integriert. Das widersprach dem Zielbild des Nutzers: **Leistungen = Haltung/Herangehensweise, Produkte = buchbare Pakete — zwei getrennte Bereiche der Informationsarchitektur.** Die Fehlerkette ist analysiert (Ausgangsannahme "Wireframe-Pillar = bestehende Leistungsseite" wurde nie hinterfragt); dieser Spec korrigiert sie.

**Beschlossene Entscheidungen (Nutzer, 2026-07-04):**
1. **Label "Produkte"** mit disambiguierender Microcopy — keine Umbenennung von "Leistungen".
2. **Menüziel `/produkte`** als schlanke Einstiegsseite; `/produkte/seo-geo` als vollwertige Bereichs-Übersicht (Wireframe-Pillar).
3. **Block-Umzug:** Systemdiagramm, Produkt-Navigation, Case-Tabs und FAQ ziehen von der Leistungsseite auf das neue Pillar; die Leistungsseite kehrt zur Haltungs-Rolle zurück und erhält ein früh platziertes Brücken-Modul.

**Randbedingung:** Die bisherigen Slice-Commits sind nicht gepusht, die alten URLs waren nie öffentlich — Umzug ohne Redirects möglich. Bestehende Datenmodelle, alle 7 Komponenten, Schema-Builder und Inhalte sind URL-agnostisch und werden unverändert weiterverwendet.

## 1. Routen & Seiten

| Seite | Route | Datei | Status |
|---|---|---|---|
| Produkte-Einstieg | `/produkte` | `src/pages/produkte/index.astro` | **neu** |
| Produktübersicht SEO/GEO (Pillar) | `/produkte/seo-geo` | `src/pages/produkte/seo-geo/index.astro` | **neu** (Blöcke ziehen um) |
| Produktseite | `/produkte/seo-geo/seo-relaunch-begleitung` | `src/pages/produkte/seo-geo/[produkt].astro` | **verschoben** aus `/leistungen/seo-geo/[produkt].astro` |
| Need-Seite | `/produkte/seo-geo/seo-relaunch-begleitung/niemand-denkt-an-seo-beim-relaunch` | `src/pages/produkte/seo-geo/[produkt]/[need].astro` | **verschoben** |
| Leistungsseite SEO/GEO | `/leistungen/seo-geo` | `src/pages/leistungen/seo-geo.astro` | **zurückgebaut** (Haltung + Brücke) |

Die verschobenen Routen sind inhaltlich identisch zu heute; es ändern sich nur: Pfad-Konstante (`const pfad = \`/produkte/seo-geo/${p.slug}\``), Breadcrumb-Items, Schema-URLs und der Rücklink-Text/-Ziel ("zurück zur Übersicht" → `/produkte/seo-geo`).

**Breadcrumbs spiegeln die URL-Hierarchie:** DigiPub → Produkte → SEO/GEO → [Produkt] → [Need] (5 Ebenen auf der Need-Seite; Mono-Breadcrumb trägt das). `BreadcrumbList`-Schema jeweils passend zur Tiefe.

## 2. `/produkte` — schlanke Einstiegsseite (neu)

Editorial-Stil, `<Section>`-Wrapper, Aufbau:
1. `Breadcrumb` (DigiPub → Produkte)
2. Mono-Kicker + H1 ("Buchbare Produkte") + **Answer-First-Absatz**, der die Leistungen/Produkte-Trennung explizit erklärt (zitierfähiges GEO-Faktoid): sinngemäß *"Unsere Leistungsbereiche beschreiben, wie wir denken. Unsere Produkte sind konkrete, buchbare Pakete daraus — Sprints, Audits und Retainer mit definiertem Format, Umfang und Preis."*
3. Bereich **SEO/GEO**: Mono-Kicker-h2 + Link zum Pillar (`/produkte/seo-geo`) + `ProduktNavigation` mit dem bestehenden `seoGeoKatalog` (8 Karten, verlinkte/unverlinkte Zustände funktionieren bereits).
4. Die **anderen 4 Leistungsbereiche** als schlichte Hairline-Zeilen "in Vorbereitung" (ehrlich, keine toten Karten) — Reihenfolge wie im Header-Dropdown.
5. CTA-Leiste (→ `/kontakt`).

Schema: `BreadcrumbList`. (Der `hasOfferCatalog` bleibt bereichsspezifisch auf dem Pillar — kein Duplikat auf `/produkte`.)

## 3. `/produkte/seo-geo` — Pillar (neu, Blöcke ziehen um)

Das vollständige Wireframe-Pillar, jetzt als eigene Seite statt als Anbau der Leistungsseite. Damit wird auch die dokumentierte Abweichung Nr. 1 des Vorgänger-Specs (fehlender Answer-First auf der Produktübersicht) aufgelöst. Blöcke in Reihenfolge:

1. `Breadcrumb` (DigiPub → Produkte → SEO/GEO)
2. Mono-Kicker + **H1 + Answer-First** (Wireframe Block 1: "Digitale Sichtbarkeit für KMU und Mittelstand – in Suchmaschinen und KI-Systemen." + Answer-Absatz, direkt nach H1, Primary-Border)
3. **Ergebnis-Metriken** (Wireframe Block 2): `ProduktDetails` mit 4 Zellen (Weber-Grill: 12 Märkte in 6 Monaten / Haidacher: 0 Relaunch-Verlust / Cornelsen: Inhouse-fähig / Portazon: Need-First) — mit `⚠ Dev-Check`-Kommentar (Zahlen verifizieren)
4. **Semantische Abgrenzung** (Wireframe Block 3): zweispaltiges Inline-Layout mit Mono-Labels NICHT / SONDERN (Inhalte aus dem Wireframe; Formulierung differenziert positiv, lehnt nicht ab)
5. `SystemDiagramm` (**Umzug** von der Leistungsseite, identische Daten)
6. `ProduktNavigation` "Was wir anbieten" (**Umzug**, identische Daten)
7. **Für wen geeignet / weniger geeignet** (Wireframe Block 6): zweispaltiges Inline-Layout (Muster existiert auf der Produktseite), Inhalte aus dem Wireframe
8. `CaseStudyTabs` (**Umzug**, identische 3 Cases + Dev-Check für Cornelsen/Smart Catering)
9. `FaqAkkordeon` (**Umzug**: die 4 FAQ-Inhalte wandern von `leistungen-data.ts` in einen neuen Export `seoGeoPillarFaq` in `produkte-data.ts` — sie gehören zur Produktarchitektur)
10. **Leistungsbereich-Navigation** (Wireframe Block 9): Link-Pills zu den 4 anderen Leistungsbereichen (`/leistungen/*`) + Rücklink zur Haltungs-Seite `/leistungen/seo-geo` ("Unsere Herangehensweise →")
11. CTA-Leiste ("Sichtbarkeits-Analyse anfragen" → `/kontakt`)

Schema: `ProfessionalService` + `hasOfferCatalog` (**Umzug** von der Leistungsseite; `produktBasisPfad` → `/produkte/seo-geo`), `FAQPage` (aus den 4 FAQ), `BreadcrumbList` (3 Ebenen).

## 4. Rückbau `/leistungen/seo-geo` (Haltung + Brücke)

- **Entfernen:** die drei Sektionen `#system-diagramm`, `#produkte`, `#case-studies`; das `katalogSchema`; die zugehörigen Frontmatter-Daten (caseStudies, systemStufen, systemCaption, produktCards) und Imports. Das `breadcrumbSchema` (DigiPub → SEO/GEO) bleibt.
- **FAQ:** `faq_items` werden aus dem `seo-geo`-Eintrag in `leistungen-data.ts` entfernt (Umzug zum Pillar). Der `FaqAkkordeon`-Block auf der Seite bleibt als schlafender Guard stehen (konsistent mit den anderen 4 Leistungsseiten).
- **Hinzufügen — Brücken-Modul, früh platziert** (direkt nach `LeistungIntro`, im ersten Scroll sichtbar): schlanke Hairline-Leiste im Editorial-Stil — Mono-Kicker "Direkt loslegen?" + ein Satz + Pfeil-Link *"Buchbare SEO/GEO-Produkte — Sprints, Audits & Retainer →"* auf `/produkte/seo-geo`. Kein Card-Grid, keine Preise — die Haltungs-Seite bleibt Haltung.

## 5. Navigation (Header, Desktop + Mobile)

`Header.astro`-Nav-Array wird erweitert; das Datenmodell bekommt optionale Teaser:
- **"Leistungen"** erhält `teaser: "Wie wir denken und arbeiten"` — angezeigt als kleine Mono-Zeile am Kopf des Dropdowns (Desktop) bzw. als Sub-Zeile unter dem Item (Mobile).
- **Neuer Punkt "Produkte"** direkt nach "Leistungen" (Reihenfolge erzählt die Philosophie: Verstehen vor Buchen), `href: "/produkte"`, `teaser: "Buchbare Sprints, Audits & Retainer — mit Preis und Umfang"`, `children`: "Alle Produkte" (`/produkte`) + "SEO/GEO" (`/produkte/seo-geo`). Weitere Bereiche kommen als Children dazu, sobald sie Produkte haben.
- Dropdown-Rendering wird um die optionale Teaser-Zeile erweitert (eine Ergänzung im bestehenden Markup, kein Umbau); Mobile-Nav rendert Teaser als `text-xs text-muted-foreground`-Zeile.
- Aktiv-Zustand: bestehende `currentPath.startsWith(item.href)`-Logik greift automatisch. Achtung Detail: `startsWith("/produkte")` und `startsWith("/leistungen")` kollidieren nicht.

Footer: in der Link-Spalten-Navigation ein "Produkte"-Link auf `/produkte` (eine Zeile, gleiche Optik wie Bestand).

## 6. Anti-Bounce-Mechanik (Zusammenfassung der Maßnahmen in diesem Spec)

| Berührungspunkt | Maßnahme | Wo umgesetzt |
|---|---|---|
| Menü | Teaser-Zeilen unter beiden Punkten, Desktop + Mobile | §5 |
| Leistungsseite | Brücken-Modul früh (erster Scroll) | §4 |
| Produktseiten | Rücklink "Unsere Herangehensweise →" auf dem Pillar | §3 Block 10 |
| `/produkte`-Einstieg | Answer-First erklärt die Trennung in einem Satz | §2 |
| Messung | PostHog-Klickpfade, sobald Analytics live (bestehender Plan) | Follow-up |

## 7. Datenänderungen

- `produkte-data.ts`: neuer Export `seoGeoPillarFaq: { frage: string; antwort: string }[]` (Inhalte 1:1 aus `leistungen-data.ts` übernommen). Alle anderen Interfaces/Daten unverändert.
- `leistungen-data.ts`: `faq_items` aus dem `seo-geo`-Eintrag entfernt.
- Keine Änderungen an `needs-data.ts`, `schemaOrg.ts` oder den 7 Komponenten.

## Out of Scope

- Redirects (alte URLs waren nie öffentlich).
- Produkt-/Need-Seiten für die anderen 4 Leistungsbereiche; weitere SEO/GEO-Produkte über das eine hinaus.
- Startseiten-Änderungen (z. B. Produkt-Teaser in Sektion "Leistungen") — möglicher Folge-Schritt nach PostHog-Daten.
- Directus-Migration (weiterhin eigener Schritt; nimmt die zwei dorthin vertagten Punkte mit: CMS-Feld-Merge, JSON-LD-Escaping).
- Brücken-Module auf den anderen 4 Leistungsseiten (erst sinnvoll, wenn deren Bereiche Produkte haben).
