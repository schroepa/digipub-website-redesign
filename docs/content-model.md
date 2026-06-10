# Content Model – Directus Collections
## Alle CMS-verwalteten Inhalte der DigiPub Startseite

---

## Grundprinzip

Was ins CMS kommt: alles was sich ohne Code-Deploy ändern soll.
Was hardcoded bleibt: Layout-Entscheidungen, heilige Sätze, Animationslogik.

**Heilige Sätze (nie CMS-verwaltet):**
- "Andere beginnen bei Schritt drei. Wir beginnen bei Schritt eins."
- "Mehrwert ist Marke."
→ Diese sind Bestandteil des Layouts (Peak-End Rule), nicht des Contents.

---

## Collections Übersicht

| Collection | Typ | Zweck |
|---|---|---|
| `site_settings` | Singleton | Globale Einstellungen |
| `hero` | Singleton | Sektion 1 |
| `problem_section` | Singleton | Sektion 2 |
| `approach_section` | Singleton | Sektion 3 |
| `process_steps` | Collection (sortierbar) | Sektion 4 |
| `services` | Collection (sortierbar) | Sektion 5 |
| `cases` | Collection (sortierbar) | Sektion 6 |
| `closing_section` | Singleton | Sektion 7 |
| `navigation` | Singleton | Header-Nav |

---

## `site_settings` (Singleton)

| Feld | Typ | Beschreibung |
|---|---|---|
| `site_name` | string | "DigiPub" |
| `meta_description` | translations | Standard-Meta DE + EN |
| `og_image` | image | Standard OG-Bild (1200×630px) |
| `calendly_url` | string | Vollständiger Calendly-Link |
| `analytics_id` | string | PostHog/Matomo Project-ID |

---

## `hero` (Singleton)

| Feld | Typ | Translations |
|---|---|---|
| `headline_line1` | string | ✓ |
| `headline_line2` | string | ✓ |
| `subline_line1` | string | ✓ |
| `subline_line2` | string | ✓ |
| `body` | text | ✓ |
| `cta_label` | string | ✓ |

---

## `problem_section` (Singleton)

| Feld | Typ | Translations |
|---|---|---|
| `headline_line1` | string | ✓ |
| `headline_line2` | string | ✓ |
| `items` | json array | ✓ (je Item ein string) |
| `closing_statement` | text | ✓ |

---

## `approach_section` (Singleton)

| Feld | Typ | Translations |
|---|---|---|
| `headline_line1` | string | ✓ |
| `headline_line2` | string | ✓ |
| `questions` | json array | ✓ |
| `body_closing` | string | ✓ |
| `contrast_line1` | string | ✓ |
| `contrast_line2` | string | ✓ |

---

## `process_steps` (Collection, sortierbar, max. 4)

| Feld | Typ | Translations |
|---|---|---|
| `sort` | integer | – |
| `number` | string | – (①②③④, kein Translate) |
| `title` | string | ✓ |
| `description` | string | ✓ (max. 2 Zeilen) |

---

## `services` (Collection, sortierbar, max. 6 published)

| Feld | Typ | Translations |
|---|---|---|
| `sort` | integer | – |
| `status` | enum (published/draft) | – |
| `slug` | string | – (für Link zur Leistungsseite) |
| `title` | string | ✓ |
| `description` | text | ✓ (max. 2 Sätze) |
| `icon` | string | – (Lucide/Tabler Icon-Name) |

**Regel:** Niemals mehr als 6 `status: published`. (Hick's Law)

---

## `cases` (Collection, sortierbar, max. 4 featured)

| Feld | Typ | Translations |
|---|---|---|
| `sort` | integer | – |
| `status` | enum (published/draft) | – |
| `featured` | boolean | – (max. 4 true auf Startseite) |
| `company` | string | – |
| `industry` | string | ✓ |
| `problem` | text | ✓ (1 Satz) |
| `action` | text | ✓ (1 Satz) |
| `result` | text | ✓ (1 Satz) |
| `cta_label` | string | ✓ |
| `case_study_url` | string | – |

---

## `closing_section` (Singleton)

| Feld | Typ | Translations |
|---|---|---|
| `body` | text | ✓ (3 Sätze) |
| `cta_intro` | text | ✓ |
| `cta_label` | string | ✓ |

**Hardcoded (nicht CMS):**
- `headline`: "Mehrwert ist Marke." → heiliger Satz, im Layout fest verankert

---

## `navigation` (Singleton)

| Feld | Typ | Translations |
|---|---|---|
| `items` | json array | ✓ (label + url je Item) |
| `cta_label` | string | ✓ |

`cta_url` kommt immer aus `site_settings.calendly_url`.

---

## Directus API – Astro Integration

```typescript
// src/lib/directus.ts
import { createDirectus, rest, readItem, readItems, readSingleton } from '@directus/sdk'

const directus = createDirectus(import.meta.env.PUBLIC_DIRECTUS_URL)
  .with(rest())

export default directus

// Beispiel: Hero laden
export async function getHero(locale: 'de' | 'en') {
  return await directus.request(
    readSingleton('hero', {
      deep: { translations: { _filter: { languages_code: { _eq: locale } } } }
    })
  )
}
```

---

## .env.example

```
PUBLIC_DIRECTUS_URL=https://cms.digipub.de
PUBLIC_DIRECTUS_TOKEN=your-static-read-token
```
