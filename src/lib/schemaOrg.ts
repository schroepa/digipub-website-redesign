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
