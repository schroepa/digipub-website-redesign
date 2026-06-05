import { createReadStream, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, extname } from "path";

const BASE = "https://directus.deutsche-musik.de";
const TOKEN = "Fh-LXSXZTiwbSxnXFHDUcjgKDC9CeHb3";

const referenzen = [
  { name: "Weber Grill",                  url: "https://www.weber.com/de/de/home/",         logo: "https://www.digipub.de/wp-content/uploads/2022/06/weber-grill-logo_kl-1024x467.jpg" },
  { name: "Sander Catering",              url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2025/11/Sander-Cater-Logo-754x1024.jpg" },
  { name: "Cornelsen Verlag",             url: "https://www.cornelsen.de",                  logo: "https://www.digipub.de/wp-content/uploads/2022/06/Cornelsen_Logo_4C-1024x256.jpg" },
  { name: "A EINS Digital Innovation",    url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2024/09/AEins-Logo.jpeg" },
  { name: "Portazon",                     url: "https://portazon.de",                       logo: "https://www.digipub.de/wp-content/uploads/2025/02/PORTAZON_LOGO_POS_WEBSITE-300x138-1.png" },
  { name: "Stadtwerke Trier",             url: "https://www.swt.de",                        logo: "https://www.digipub.de/wp-content/uploads/2025/02/swt-logo-header.png" },
  { name: "Ecomex",                       url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2022/06/ecomex-logo.png" },
  { name: "Edelman Deutschland",          url: "https://www.edelman.de",                    logo: "https://www.digipub.de/wp-content/uploads/2022/06/Edelman-Deutschland-Logo.jpg" },
  { name: "Franz Cornelsen Bildungsholding", url: "",                                        logo: "https://www.digipub.de/wp-content/uploads/2022/06/Franz-Cornelsen-Bildungsholding-Logo.jpg" },
  { name: "Westermann",                   url: "https://www.westermann.de",                 logo: "https://www.digipub.de/wp-content/uploads/2022/06/Westermann.png" },
  { name: "Vetinäre",                     url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2022/06/Vetinare_Logo.jpg" },
  { name: "Walter de Gruyter",            url: "https://www.degruyter.com",                 logo: "https://www.digipub.de/wp-content/uploads/2022/06/Walter_de_gruyter.jpg" },
  { name: "Bliner Ideenlabor",            url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2022/06/Bliner-Ideenlabor_Logo.jpg" },
  { name: "Welance",                      url: "https://www.welance.de",                    logo: "https://www.digipub.de/wp-content/uploads/2022/06/Welance_Logo.jpg" },
  { name: "Limebit",                      url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2022/06/limebit-logo.png" },
  { name: "Fridays for Future",           url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2022/06/Fridays-for-future.png" },
  { name: "Gemeinsam für Afrika",         url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2022/06/Gemeinsam_fuer_Afrika_Logo.jpg" },
  { name: "Caseking",                     url: "https://www.caseking.de",                   logo: "https://www.digipub.de/wp-content/uploads/2022/06/kaseking-logo.jpg" },
  { name: "Basics09 Grafikagentur",       url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2025/02/Basics09-grafik-agentur-logo.png" },
  { name: "Ophelis",                      url: "https://www.ophelis.de",                    logo: "https://www.digipub.de/wp-content/uploads/2025/02/ophelis-logo.png" },
  { name: "Initiative Handarbeit",        url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2025/02/Initiative-handarbeit-logo.jpg" },
  { name: "Deutsche Musik",              url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2025/02/Deutsche-Musik-Logo.png" },
  { name: "Connemara Fashion",            url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2025/02/Connemara-Fashion-Logo.png" },
  { name: "Fashion Council Germany",      url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2025/02/Screenshot-2024-09-26-135641.png" },
  { name: "Klax Kindergartenpädagogik",   url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2025/02/klax-logo.jpg" },
  { name: "Badisches Staatstheater",      url: "https://www.staatstheater.de",              logo: "https://www.digipub.de/wp-content/uploads/2025/02/Badisches-Staatstheater-Logo-1024x393.png" },
  { name: "LAI FU Berlin",               url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2025/02/logo_lai-fu.png" },
  { name: "Tischlerei Haidacher",         url: "",                                           logo: "https://www.digipub.de/wp-content/uploads/2022/06/Download.webp" },
];

async function uploadLogo(logoUrl, name) {
  // Bild herunterladen
  const res = await fetch(logoUrl);
  if (!res.ok) { console.warn(`  ⚠ Bild nicht gefunden: ${logoUrl}`); return null; }
  const buffer = await res.arrayBuffer();
  const ext = extname(new URL(logoUrl).pathname) || ".jpg";
  const filename = name.toLowerCase().replace(/[^a-z0-9]/g, "-") + ext;

  // Zu Directus hochladen
  const form = new FormData();
  form.append("title", name);
  form.append("file", new Blob([buffer]), filename);

  const upload = await fetch(`${BASE}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: form,
  });
  const json = await upload.json();
  if (json.errors) { console.warn(`  ⚠ Upload-Fehler ${name}:`, json.errors[0].message); return null; }
  return json.data.id;
}

let sort = 1;
for (const ref of referenzen) {
  process.stdout.write(`Uploading ${ref.name}... `);
  const logoId = await uploadLogo(ref.logo, ref.name);

  const item = await fetch(`${BASE}/items/digipub_referenzen`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ status: "published", name: ref.name, logo: logoId, url: ref.url, sort: sort++ }),
  });
  const json = await item.json();
  if (json.errors) console.log(`❌ ${json.errors[0].message}`);
  else console.log(`✓ ID ${json.data.id}`);
}

console.log("\nFertig!");
