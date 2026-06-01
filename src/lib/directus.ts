import { createDirectus, rest, staticToken, readItems } from "@directus/sdk";

interface DirectusSchema {
  digipub_posts: {
    id: number; status: string; date_created: string;
    title: string; slug: string; excerpt: string;
    content: string; cover_image?: string; category?: string; read_time?: number;
  }[];
}

const directusUrl = import.meta.env.DIRECTUS_URL || "https://directus.deutsche-musik.de";
const directusToken = import.meta.env.DIRECTUS_TOKEN || "";

export const directus = createDirectus<DirectusSchema>(directusUrl)
  .with(staticToken(directusToken)).with(rest());

export function getAssetUrl(id: string, width?: number) {
  return `${directusUrl}/assets/${id}${width ? `?width=${width}&format=webp` : ""}`;
}

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
