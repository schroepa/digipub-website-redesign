# Sektion 7 "Haltung + CTA" – Design Spec

## Kontext

Laut `CLAUDE.md` ist die Startseite auf 7 Sektionen festgelegt:

```
① Hero
② Strukturproblem
③ Denkweise
④ Die Reihenfolge
⑤ Leistungen
⑥ Cases
⑦ Haltung + CTA – "Mehrwert ist Marke" + Calendly [END-MOMENT]
```

Sektionen ①, ②, ③, ⑤, ⑥ existieren bereits in `src/pages/index.astro`. Sektion ④ ("Die Reihenfolge") ist noch nicht gebaut und nicht Teil dieses Specs. Dieses Spec behandelt Sektion ⑦, die letzte Sektion der Startseite (END-MOMENT).

`index.astro` enthält aktuell zusätzlich vier Alt-Sektionen (Ergebnisse, Team, FAQ, inline "Aktuelles") sowie `CTACalendly`, die nicht Teil der 7-Sektionen-Struktur sind. Diese werden aus der Startseite entfernt; die zugehörigen Komponenten-Dateien bleiben im Repo erhalten (möglicher Re-Use auf Unterseiten), bis auf den inline "Aktuelles"-Code, der nur in `index.astro` existiert und komplett entfernt wird.

## Architektur

**Neue Komponente:** `src/components/sections/Haltung.astro`

- Wrapper: `Section.astro` mit `id="haltung"`
- Ein `max-w-2xl` Block mit Headline (`h2`, `--text-section`) und Body (`p`, `--text-body`), linksbündig — konsistent mit Strukturproblem/Denkweise/Cases
- Darunter eine horizontale CTA-Leiste, getrennt durch `border-t border-border`
- Scroll-Reveal: ganzer Inhalt (Headline + Body + CTA-Leiste) als ein `data-animate`-Block, `style="opacity: 0; transform: translateY(30px);"`, aktiviert über `initScrollAnimate` aus `src/lib/scrollAnimate.ts` (gleiches Muster wie `Cases.astro`)
- Buttons nutzen Design-Tokens (`bg-foreground`/`text-background` bzw. `border-border`/`text-foreground`) statt hartkodierter Hex-Werte → funktioniert in Light & Dark Mode
- Kein WebGL, kein Bild, kein Diagramm (laut Copy: "typografisch, kein Bild")

**Calendly:** kein unconditional Script-Load. Stattdessen Lazy-Load on Click (siehe unten).

## Inhalt

Copy 1:1 aus `docs/copywriting.md`, Sektion 7:

**Headline:**
```
Mehrwert ist Marke.
```

**Body** (zwei Absätze, getrennt durch Leerzeile/`<br /><br />` oder zwei `<p>`):
```
Nicht Design macht Marke. Nicht Werbung macht Marke.
Marke entsteht, wenn ein Unternehmen seinen echten Mehrwert
sichtbar, verständlich und nutzbar macht.

Das ist es, wofür wir arbeiten.
Mit jedem, der offen ist, diesen Weg zu gehen.
```

**CTA-Leiste:**
- Text (links): "Dein Unternehmen hat diesen Mehrwert. Lass uns gemeinsam herausfinden, wie wir ihn sichtbar machen."
- Primär-Button (rechts): "Gespräch anfangen →" — öffnet Calendly-Popup (`https://calendly.com/nigronet`)
- Sekundär-Button (rechts): "E-Mail schreiben" — `mailto:kontakt@digipub.de`

Kein "Nächster Schritt"-Mono-Label (entspricht der zuvor durchgeführten font-mono → font-bold Bereinigung; hier wird das Label ganz weggelassen, da die Copy kein Eyebrow-Label vorsieht).

## Layout

**Struktur (Mobile & Desktop):**

```html
<Section id="haltung">
  <div data-animate style="opacity: 0; transform: translateY(30px);">
    <div class="max-w-2xl mb-12">
      <h2 style="font-size: var(--text-section);" class="font-bold text-foreground mb-4">
        Mehrwert ist Marke.
      </h2>
      <p class="text-muted-foreground mb-4" style="font-size: var(--text-body);">
        Nicht Design macht Marke. Nicht Werbung macht Marke.
        Marke entsteht, wenn ein Unternehmen seinen echten Mehrwert
        sichtbar, verständlich und nutzbar macht.
      </p>
      <p class="text-muted-foreground" style="font-size: var(--text-body);">
        Das ist es, wofür wir arbeiten.
        Mit jedem, der offen ist, diesen Weg zu gehen.
      </p>
    </div>

    <div class="border-t border-border pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <p class="text-muted-foreground max-w-md" style="font-size: var(--text-body);">
        Dein Unternehmen hat diesen Mehrwert. Lass uns gemeinsam
        herausfinden, wie wir ihn sichtbar machen.
      </p>
      <div class="flex flex-wrap gap-3">
        <button id="haltung-calendly-btn" class="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-semibold rounded-lg hover:opacity-80 transition-opacity">
          Gespräch anfangen →
        </button>
        <a href="mailto:kontakt@digipub.de" class="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground text-sm font-semibold rounded-lg hover:opacity-70 transition-opacity">
          E-Mail schreiben
        </a>
      </div>
    </div>
  </div>
</Section>
```

- Mobile: CTA-Leiste stapelt vertikal (`flex-col`), Buttons untereinander/nebeneinander via `flex-wrap`
- Desktop (`md:`): CTA-Text links, Buttons rechts in einer Zeile (`flex-row justify-between`)
- Primär-Button ist ein `<button>` (Aktion: öffnet Popup), nicht `<a>` — entspricht der CLAUDE.md-Regel "Buttons für Aktionen, Links für Navigation"

## Calendly Lazy-Load (Click-to-Load)

Inline `<script>` in `Haltung.astro`, analog zum bestehenden `CTACalendly.astro`-Pattern, aber ohne unconditional Script-Tags im Head:

```ts
const CALENDLY_URL = "https://calendly.com/nigronet";

const btn = document.getElementById("haltung-calendly-btn");

function openCalendly() {
  // @ts-expect-error - Calendly global is loaded dynamically
  window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
}

function loadCalendlyAndOpen() {
  if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[src*="calendly.com/assets/external/widget.js"]'
  );

  if (existingScript) {
    if (window.Calendly) {
      openCalendly();
    } else {
      existingScript.addEventListener("load", openCalendly, { once: true });
    }
    return;
  }

  const script = document.createElement("script");
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.addEventListener("load", openCalendly, { once: true });
  document.head.appendChild(script);
}

btn?.addEventListener("click", loadCalendlyAndOpen);
```

- Beim ersten Klick: lädt `widget.css` + `widget.js` nach, öffnet Popup nach `load`
- Bei weiteren Klicks: `window.Calendly` existiert bereits → Popup öffnet sofort
- Kein Auto-Open, kein Exit-Intent — entspricht CLAUDE.md DSGVO-Vorgaben für Calendly

## `index.astro` Änderungen

**Imports entfernen:**
```ts
import { getPosts } from "../lib/directus";
import Ergebnisse from "../components/Ergebnisse.astro";
import Team from "../components/Team.astro";
import FAQ from "../components/FAQ.astro";
import CTACalendly from "../components/CTACalendly.astro";
```

**Neuer Import:**
```ts
import Haltung from "../components/sections/Haltung.astro";
```

**Code entfernen:**
- `const fetchedPosts = await getPosts(3);`
- `const fallbackPosts = [...]` (gesamtes Array)
- `const posts = fetchedPosts.length > 0 ? ... : fallbackPosts;`

**Sections entfernen:**
- `<!-- 7. ERGEBNISSE IN ZAHLEN --> <Ergebnisse />`
- `<!-- 8. TEAM / FACES --> <Team />`
- `<!-- 9. FAQ --> <FAQ />`
- Inline `<!-- 10. AKTUELLES -->` Section (komplettes `<section>`-Element)
- `<!-- 11. FINALER CTA / CALENDLY --> <CTACalendly />`

**Neue Section:**
```astro
<!-- 7. HALTUNG + CTA -->
<Haltung />
```

**Finale Reihenfolge:**
```
1. HERO
2. STRUKTURPROBLEM
3. DENKWEISE
4. LOGOS BAR
5. LEISTUNGEN
6. CASES
7. HALTUNG + CTA
```

## Nicht-Ziele

- Sektion ④ "Die Reihenfolge" ist nicht Teil dieses Specs (separates Vorhaben)
- `Ergebnisse.astro`, `Team.astro`, `FAQ.astro`, `CTACalendly.astro` werden nicht gelöscht, nur aus `index.astro` entfernt
- Kein Cookie-Consent-Gate für Calendly in diesem Schritt (Lazy-Load on Click reduziert die DSGVO-Relevanz bereits erheblich; vollständiges Cookie-Banner-System ist ein separates Vorhaben laut CLAUDE.md DSGVO-Sektion)
- Keine WebGL/Parallax-Elemente

## Self-Review

- **Placeholder-Scan:** Keine TBD/TODO, alle Code-Blöcke vollständig
- **Konsistenz:** Buttons nutzen `bg-foreground`/`text-background`/`border-border`/`text-foreground` — alle bereits in `src/styles/global.css` definierte Tokens (verwendet u.a. in Cases.astro, Footer.astro)
- **Scope:** Fokussiert auf eine neue Komponente + Integration/Cleanup in `index.astro`, keine Dekomposition nötig
- **Ambiguität:** Calendly-URL (`https://calendly.com/nigronet`) und E-Mail (`kontakt@digipub.de`) aus `CTACalendly.astro` übernommen — eindeutig
