import { createDirectus, rest, staticToken, readItems } from "@directus/sdk";

// ── Typen ────────────────────────────────────────────────────────────────────

interface DirectusSchema {
  digipub_posts: Post[];
  digipub_leistungen: Leistung[];
}

interface Post {
  id: number; status: string; date_created: string;
  title: string; slug: string; excerpt: string;
  content: string; cover_image?: string; category?: string; read_time?: number;
}

export interface KeyTakeaway {
  title: string;
  text: string;
}

export interface LeistungCard {
  title: string;
  text: string;
  ziel: string;
}

export interface WiesoItem {
  text: string;
}

export interface Leistung {
  id: number;
  status: string;
  slug: string;
  number: string;           // z.B. "01 / 05"
  title: string;            // H1 Hero
  subtitle: string;         // Hero-Untertitel
  hero_text: string;        // Hero-Beschreibung

  intro_title: string;
  intro_text_1: string;
  intro_bold: string;
  intro_text_2: string;
  intro_image?: string;     // Directus Asset-ID

  section1_title: string;
  section1_text: string;
  section1_bold: string;
  section1_image?: string;

  section2_title: string;
  section2_text: string;
  section2_bold: string;
  section2_image?: string;

  ansatz_title: string;
  ansatz_text_1: string;
  ansatz_text_2: string;
  ansatz_bold: string;
  ansatz_image?: string;

  leistungen_title: string;
  key_takeaways: KeyTakeaway[];
  leistungen_cards: LeistungCard[];
  wieso_title: string;
  wieso_subtitle: string;
  wieso_items: WiesoItem[];
}

// ── Client ───────────────────────────────────────────────────────────────────

const directusUrl = import.meta.env.DIRECTUS_URL || "https://directus.deutsche-musik.de";
const directusToken = import.meta.env.DIRECTUS_TOKEN || "";

export const directus = createDirectus<DirectusSchema>(directusUrl)
  .with(staticToken(directusToken)).with(rest());

export function getAssetUrl(id: string, width?: number) {
  return `${directusUrl}/assets/${id}${width ? `?width=${width}&format=webp` : ""}`;
}

// ── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts(limit = 10) {
  try {
    return await directus.request(readItems("digipub_posts", {
      filter: { status: { _eq: "published" } },
      sort: ["-date_created"], limit,
      fields: ["id","title","slug","excerpt","date_created","cover_image","category","read_time"],
    }));
  } catch { return []; }
}

export async function getPost(slug: string) {
  try {
    const posts = await directus.request(readItems("digipub_posts", {
      filter: { slug: { _eq: slug }, status: { _eq: "published" } }, limit: 1,
    }));
    return posts[0] || null;
  } catch { return null; }
}

// ── Case Studies ─────────────────────────────────────────────────────────────

export interface VorgehenItem { title: string; text: string; }
export interface KPI { value: string; label: string; }

export interface CaseStudy {
  id: number; status: string; slug: string; date_created: string;
  title: string; subtitle: string; description: string; excerpt: string;
  kunde: string; branche: string; tags: string;
  hero_image?: string; kunde_logo?: string;
  ausgangslage_text: string;
  ziele_left_title: string; ziele_left_text: string;
  ziele_right_title: string; ziele_right_text: string;
  vorgehen_items: VorgehenItem[];
  ergebnis_text: string;
  kpis: KPI[];
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    return (await directus.request(readItems("digipub_case_studies" as any, {
      filter: { status: { _eq: "published" } },
      sort: ["-date_created"],
    }))) as CaseStudy[];
  } catch { return []; }
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const items = await directus.request(readItems("digipub_case_studies" as any, {
      filter: { slug: { _eq: slug }, status: { _eq: "published" } }, limit: 1,
    }));
    return (items[0] as CaseStudy) || null;
  } catch { return null; }
}

// ── Leistungen ───────────────────────────────────────────────────────────────

export async function getLeistung(slug: string): Promise<Leistung | null> {
  try {
    const items = await directus.request(readItems("digipub_leistungen", {
      filter: { slug: { _eq: slug }, status: { _eq: "published" } },
      limit: 1,
    }));
    return (items[0] as Leistung) || null;
  } catch { return null; }
}

export async function getLeistungen(): Promise<Leistung[]> {
  try {
    return (await directus.request(readItems("digipub_leistungen", {
      filter: { status: { _eq: "published" } },
      sort: ["number"],
    }))) as Leistung[];
  } catch { return []; }
}
