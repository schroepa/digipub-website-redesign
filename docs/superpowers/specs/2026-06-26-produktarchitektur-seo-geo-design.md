# Design: Produkt-/Need-Seitenarchitektur — Vertical Slice SEO/GEO

## Kontext

Die vier vom Nutzer bereitgestellten Wireframe-Dokumente (`Content-Architektur – 3 Seitentypen`, `Wireframe – Produktübersicht`, `Wireframe – Produktseite`, `Wireframe – Need-Seite`) beschreiben eine SEO/GEO-optimierte (GEO = Generative Engine Optimization) Content-Architektur mit drei Seitentypen pro Leistungsbereich:

1. **Produktübersicht (Pillar)** — eine pro Leistungsbereich, listet alle buchbaren Produkte, konsolidiert Autorität.
2. **Produktseite (Cluster)** — einzelnes buchbares Angebot mit Preis/Format/Deliverables.
3. **Need-Seite (Cluster)** — einzelner Schmerzpunkt, Einstiegspunkt über Long-Tail-SEO/KI-Suche, führt zur passenden Produktseite.

Informationsfluss: SoMe/Long-Tail-SEO → Need-Seite → Produktseite → Produktübersicht.

**Begriffsklärung (wichtig fürs Datenmodell):** *Leistungsbereich* (z. B. "SEO/GEO") ist eine Herangehensweise/Haltung, *Produkt* ist eine eigenständige buchbare Einheit mit eigenem Namen/Slug innerhalb eines Leistungsbereichs. Beide sind nie dieselbe Entität, auch wenn ein Produktname inhaltlich nahe am Leistungsbereich liegen könnte.

**Scope-Entscheidung:** Das Gesamtvorhaben (3 Seitentypen × 5 Leistungsbereiche, vollständige Directus-Content-Modellierung, Rollout auf alle Produkte/Needs) ist zu groß für einen Implementierungsplan. Dieser Spec deckt den ersten Vertical Slice ab: **das vollständige Muster für den Leistungsbereich SEO/GEO**, mit genau den in den Wireframes durchgearbeiteten Beispielen:
- Produktübersicht SEO/GEO (erweitert die bestehende `seo-geo.astro`)
- Eine Produktseite: "SEO-Relaunch-Begleitung"
- Eine Need-Seite: "Niemand denkt an SEO beim Relaunch" (latenter Need)

Weitere Produkte/Needs, die anderen 4 Leistungsbereiche, eine echte Directus-Content-Modellierung und i18n sind **explizit nicht Teil dieses Slices** (siehe "Out of Scope").

## Bestehender Zustand (Re-Check vor Planung)

- `/leistungen/seo-geo.astro` existiert bereits live, mit einem älteren Komponenten-Set (`LeistungHero`, `KeyTakeaways`, `VertiefungsKacheln`, `UnserAnsatz`, `LeistungKacheln`, `WiesoDigiPub`, `FAQ`, `CalendlySection`), Daten aus Directus (`getLeistung(slug)`) mit Fallback in `leistungen-data.ts`.
- Es gibt noch **keine** Produktseiten oder Need-Seiten irgendwo auf der Seite.
- `DIRECTUS_TOKEN` in der lokalen `.env` ist leer — keine Schreib-, nicht einmal Leserechte auf die Directus-Instanz verfügbar. Bestehende Directus-Aufrufe laufen faktisch über den Fallback.
- i18n (`/de/`, `/en/`) ist nur dokumentiert (`docs/i18n.md`), nicht implementiert. Aktuell rein deutschsprachig, keine Mehrsprachigkeits-Komplexität in diesem Slice.
- Es gibt zwei stilistisch unterschiedliche Bestandssysteme: die alten `/leistungen/*`-Komponenten (hartkodierte Hex-Farben, `gray-*`-Klassen, Schatten-Cards) und der neue Editorial-Stil von der Startseiten-Überarbeitung (`Strukturproblem.astro`, `Denkweise.astro`, `Leistungen.astro`, `Cases.astro`, `Haltung.astro`: echte Design-Tokens, Mono-Kicker mit Index, Hairlines statt Schatten-Cards, Flow-Line-Mechanik). **Entscheidung: neuer Editorial-Stil**, validiert per Live-Mockup im Browser-Companion (Tokens `--color-foreground`/`--color-primary`/`--color-muted-foreground`/`--color-border`, `--text-section`/`--text-peak`/`--text-body`, Geist/Geist Mono — keine fremden Farben/Schriften).

## 1. Architektur & Dateien

Drei Routen, URL-Tiefe spiegelt die Breadcrumb-Hierarchie aus den Wireframes 1:1:

| Seitentyp | Route | Datei |
|---|---|---|
| Produktübersicht | `/leistungen/seo-geo` | `src/pages/leistungen/seo-geo.astro` (erweitert, nicht ersetzt) |
| Produktseite | `/leistungen/seo-geo/seo-relaunch-begleitung` | `src/pages/leistungen/seo-geo/[produkt].astro` |
| Need-Seite | `/leistungen/seo-geo/seo-relaunch-begleitung/niemand-denkt-an-seo-beim-relaunch` | `src/pages/leistungen/seo-geo/[produkt]/[need].astro` |

Beide dynamischen Routen nutzen `getStaticPaths()` über die statischen Daten-Arrays (siehe Abschnitt 4) — in diesem Slice je genau ein Pfad (`seo-relaunch-begleitung` bzw. `niemand-denkt-an-seo-beim-relaunch`), aber so geschrieben, dass weitere Produkte/Needs später nur Dateneinträge brauchen, keine neue Routing-Logik.

Daten statisch in `src/lib/produkte-data.ts` (Produkte) und `src/lib/needs-data.ts` (Needs) — exakt das Fallback-Objekt-Muster von `leistungen-data.ts`. Directus-Migration ist ein eigener Folge-Schritt (Datenquelle austauschen, Seitenstruktur/Optik bleibt unverändert), sobald ein Token mit Schema-Schreibrechten vorliegt.

**Neue Komponenten** in `src/components/produkte/`, alle im neuen Editorial-Stil (Tokens, Mono-Kicker, Hairlines):

- `Breadcrumb.astro` — Mono, Props: `items: {label: string, href?: string}[]`, wiederverwendbar für alle drei Tiefen (2/3/4 Ebenen).
- `ProduktDetails.astro` — 2×2-Hairline-Grid (Format/Preisrahmen/Deliverables/Einstieg); dasselbe Grid-Prinzip wird in der Need-Seite für die Impact-Zahlen-Kacheln wiederverwendet (3 statt 4 Spalten).
- `VergleichsTabelle.astro` — Hairline-Tabelle, Props: `rows: {kriterium, ohne, mit}[]`; `mit`-Spalte in `text-primary`. Wird identisch auf Produkt- und Need-Seite verwendet.
- `FaqAkkordeon.astro` — neue Optik (Mono-Nummerierung statt Icon-Kreis), ersetzt `FAQ.astro`.
- `ProduktNavigation.astro` — Hairline-Card-Grid, gleiches Prinzip wie `Leistungen.astro` auf der Startseite (Hairline-Kreuz statt Schatten-Card, `primary`-Hover auf dem Titel).
- `SystemDiagramm.astro` — rendert das Pillar-Systemdiagramm ("SEO-Grundlagen → Content-Architektur → GEO/AEO") über die **bestehende Flow-Line-Mechanik** (`lib/flowLine.ts` + `[data-flow-line]`/`[data-flow-node]` aus `global.css`, identisch zur Reihenfolge-Section), 3 Knoten statt 4, mit `figcaption`.
- `CaseStudyTabs.astro` — neu, abstrahiert von der FAQ-Akkordeon-Optik: Hairline-Liste links (Projektnamen) + Inhaltsfläche rechts; alle Tab-Inhalte als DOM-Text vorhanden (CSS-`display`-Toggle, kein JS-only-Rendering — GEO-Pflicht aus dem Wireframe).

**Geänderte Bestandsdateien:**
- `src/components/leistungen/KeyTakeaways.astro` — `variant="table"`-Zweig auf Tokens umgestellt (kein `text-[#1a1a1a]`/`gray-*` mehr).
- `src/pages/leistungen/seo-geo.astro` — ergänzt um `SystemDiagramm` und `ProduktNavigation`; `FAQ.astro`-Import wird zu `FaqAkkordeon.astro`.
- **Gelöscht** sobald `FaqAkkordeon.astro` produktiv ist: `src/components/leistungen/FAQ.astro` (keine anderen Verwender außerhalb der Leistungsseiten).

Neuer gemeinsamer Helper `src/lib/schemaOrg.ts` (siehe Abschnitt 3).

## 2. Seitenstruktur je Typ

**Produktübersicht** (`seo-geo.astro`) — bestehende Blöcke (Hero, Intro, Vertiefungs-Kacheln, Unser Ansatz) bleiben unverändert stehen. Ergänzt um, in dieser Reihenfolge nach "Unser Ansatz":
1. `SystemDiagramm` (Flow-Line, 3 Knoten, `figcaption` mit der Text-Variante aus dem Wireframe)
2. `ProduktNavigation` — Cards für alle 7 im Wireframe genannten Produkte (Reihenfolge: Einstiegsprodukte zuerst, dann Sprints, dann Retainer/Individuell). In diesem Slice verlinkt nur die Card "SEO-Relaunch-Begleitung" auf eine echte Produktseite; die anderen 6 Cards sind vorbereitet (gleiche Komponente, `href` zeigt vorerst auf `#`) und werden in Folge-Slices mit echten Produktseiten verknüpft.

`KeyTakeaways` (überarbeitet) und `FaqAkkordeon` (überarbeitet) bleiben an ihrer bisherigen Stelle in der Seite, nur im neuen Stil.

**Produktseite** (`[produkt].astro`) — 11 Blöcke aus dem Wireframe:
`Breadcrumb` (3 Ebenen) → H1 + Answer-First (Problem als Aussage) → Kontext/Warum-entsteht-das-Problem (Fließtext) → `ProduktDetails` → `VergleichsTabelle` → Ablauf (nummerierte Schritte mit Deliverable je Schritt, gleiches visuelles Prinzip wie die Schritt-Liste in `Reihenfolge.astro`) → Case-Study-Auszug (DOM-Text, kein Slider) → Need-Cards (Hairline-Card-Grid wie `ProduktNavigation`, führen zu Need-Seiten) → `FaqAkkordeon` → verwandte Produkte (Link-Leiste) → CTA-Leiste + Rücklink zur Produktübersicht.

**Need-Seite** (`[need].astro`) — 10 Blöcke:
`Breadcrumb` (4 Ebenen) → H1 + Answer-First (Problem als Aussage, nicht als Frage) → Impact-Zahlen (3 Kacheln, `ProduktDetails`-Grid-Prinzip mit 3 statt 4 Spalten) → konkretes Szenario (Fließtext) → Lösungsweg (nummerierte Schritte) → Vorher/Nachher (`VergleichsTabelle`) → Warum DigiPub (Fließtext, need-spezifisch, kein generisches Agentur-Selbstlob) → Social-Hook-Zitat (**nur weil `typ: "latent"`** — bei aktiven Needs entfällt dieser Block) → `FaqAkkordeon` → CTA-Leiste + bidirektionaler Rücklink zur Produktseite.

## 3. GEO: Answer-First & Schema.org (JSON-LD)

**Answer-First-Prinzip:** Auf allen drei Seiten folgt direkt nach der H1 (kein Element dazwischen) ein 2–3-Satz-Absatz mit mindestens einem zitierfähigen Faktoid (konkrete Zahl oder benannte Entität), keine Marketingsprache. Visuell: `border-left: 2px solid var(--color-primary)`, gedämpfte Textfarbe — validiert im Browser-Mockup.

**JSON-LD** wird als `<script type="application/ld+json">` direkt aus den statischen Produkt-/Need-Daten gerendert, kein Backend nötig:

| Seitentyp | Schema |
|---|---|
| Produktübersicht | `ProfessionalService` mit `hasOfferCatalog` (Liste der Produkte als `itemListElement`) |
| Produktseite | `Service` + verschachteltes `Offer` (`priceRange`, `provider`, `areaServed: "DACH"`), zusätzlich `FAQPage` aus den FAQ-Daten |
| Need-Seite | `FAQPage` (Frage = Need-Titel, Antwort = `answerFirst`), `HowTo` (Schritte aus `loesungsweg`) |

`BreadcrumbList` zusätzlich auf **allen drei** Seiten, Tiefe passend zur jeweils angezeigten Breadcrumb (2/3/4 Ebenen).

Gemeinsamer Helper `src/lib/schemaOrg.ts` exportiert je eine Bau-Funktion (`buildServiceSchema`, `buildFaqPageSchema`, `buildHowToSchema`, `buildBreadcrumbSchema`), die ein JSON-LD-Objekt aus den Produkt-/Need-Daten zurückgeben — vermeidet Code-Duplikation über die drei Seiten hinweg.

## 4. Datenmodell (statisch, Directus-Migration später)

```ts
// src/lib/produkte-data.ts
export interface Produkt {
  slug: string;
  leistungsbereich: "seo-geo";
  title: string;
  answerFirst: string;
  kontextText: string;
  format: "Sprint" | "Audit" | "Retainer" | "Individuell";
  dauer: string;
  preisrahmen: string;
  deliverables: string[];
  geeignetFuer: string[];
  nichtGeeignetFuer: string[];
  vergleich: { kriterium: string; ohne: string; mit: string }[];
  ablauf: { titel: string; text: string; deliverable: string }[];
  caseStudy: {
    kunde: string; ausgangslage: string; vorgehen: string; ergebnis: string;
    branche: string; seitenanzahl: string; dauer: string; messbar: string;
  };
  needSlugs: string[];
  faq: { frage: string; antwort: string }[];
}

// src/lib/needs-data.ts
export interface Need {
  slug: string;
  produktSlug: string;
  typ: "aktiv" | "latent";
  title: string;
  answerFirst: string;
  impactZahlen: { label: string; wert: string; kontext: string }[];
  szenario: string;
  loesungsweg: string[];
  vorherNachher: { kriterium: string; ohne: string; mit: string }[];
  warumDigipub: string;
  socialHook?: string;
  faq: { frage: string; antwort: string }[];
}
```

Inhalte für das jeweils eine Beispiel je Datei werden direkt aus den vier Wireframe-Dokumenten übernommen (dort als vollständiger Beispielinhalt ausformuliert).

## Out of Scope (für diesen Slice)

- Die anderen 4 Leistungsbereiche (Markenaufbau, Design, Automatisierung, KI-Implementierung) und ihre Produkte/Needs.
- Weitere Produkte/Needs innerhalb SEO/GEO über die zwei Beispiele hinaus (die übrigen 6 `ProduktNavigation`-Cards bleiben vorerst unverlinkt, `href="#"`).
- Echte Directus-Collections für Produkte/Needs (kein Schema-Schreibzugriff verfügbar; Datenquelle ist vorerst statisch).
- i18n/Mehrsprachigkeit (aktuell nicht implementiert, nicht Teil dieses Slices).
- Änderungen an der globalen Header-Navigation (bestehender "Leistungen"-Link bleibt unverändert).
- Automatisierte Tests (kein Test-Framework im Projekt; Verifikation erfolgt manuell im Dev-Server, wie im Rest dieses Projekts üblich).
