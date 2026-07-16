// Premium, UX-optimized Style Guide Generator for Paper
// 100% token-based, including interactive and developer-friendly previews.

const PAPER_MCP_URL = 'http://127.0.0.1:29979/mcp';

async function callMcp(method, args) {
  const payload = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: { name: method, arguments: args },
    id: Date.now() + Math.floor(Math.random() * 10000)
  };
  const res = await fetch(PAPER_MCP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  const dataLine = text.split('\n').find(l => l.startsWith('data: '));
  if (dataLine) {
    const data = JSON.parse(dataLine.substring(6));
    if (data.error) throw new Error(`MCP Error: ${JSON.stringify(data.error)}`);
    const ct = data.result?.content?.[0]?.text;
    return ct ? JSON.parse(ct) : null;
  }
  throw new Error(`No data line: ${text}`);
}

const PAGE_W = 1440;
const ROW_GAP = 120;
let cursorY = 0;

async function makeArtboard(name, width, html) {
  const ab = await callMcp('create_artboard', {
    name,
    styles: {
      width: `${width}px`,
      height: 'fit-content',
      top: `${cursorY}px`,
      left: '0px',
      backgroundColor: 'var(--background)',
      padding: '64px',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-10)'
    }
  });
  const id = ab.id;
  await callMcp('write_html', { html, targetNodeId: id, mode: 'insert-children' });
  return id;
}

// ─── UX Components & Layout Helpers ───

function sectionTitle(title, subtitle) {
  return `
    <div layer-name="Section Title" style="display: flex; flex-direction: column; gap: var(--space-2); padding-bottom: var(--space-6); border-bottom: var(--border-width-thick) solid var(--foreground)">
      <span style="font-family: var(--font-mono); font-size: var(--typography-label); font-weight: var(--font-weight-semibold); letter-spacing: var(--tracking-widest); text-transform: uppercase; color: var(--muted-foreground)">${subtitle}</span>
      <span style="font-family: var(--font-sans); font-size: var(--typography-h1); font-weight: var(--font-weight-bold); color: var(--foreground); letter-spacing: var(--tracking-tighter); line-height: var(--leading-tight)">${title}</span>
    </div>`;
}

function subGroupTitle(title) {
  return `
    <div layer-name="Subgroup: ${title}" style="display: flex; flex-direction: column; gap: var(--space-1); margin-top: var(--space-6); padding-bottom: var(--space-2); border-bottom: var(--border-width-default) solid var(--border)">
      <span style="font-family: var(--font-sans); font-size: var(--typography-large); font-weight: var(--font-weight-bold); color: var(--primary)">${title}</span>
    </div>`;
}

function tokenPill(name) {
  return `<code style="display: inline-block; background-color: var(--secondary); color: var(--secondary-foreground); padding: var(--space-1) var(--space-2.5); border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: var(--typography-caption); font-weight: var(--font-weight-medium); border: var(--border-width-default) solid var(--border)">var(${name})</code>`;
}

function colorRow(name, cssLight, cssDark, contrastText, lightDesc, darkDesc) {
  return `
    <div layer-name="Color: ${name}" style="display: grid; grid-template-cols: 1fr 1fr; gap: var(--space-6); padding: var(--space-4) 0; border-bottom: var(--border-width-default) solid var(--border)">
      <!-- Light mode preview -->
      <div style="display: flex; align-items: center; gap: var(--space-4)">
        <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background-color: var(${cssLight}); border: var(--border-width-default) solid var(--border)"></div>
        <div style="display: flex; flex-direction: column; gap: var(--space-0.5)">
          <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">${name} (Light)</span>
          ${tokenPill(cssLight)}
          <span style="font-family: var(--font-sans); font-size: var(--typography-caption); color: var(--muted-foreground)">${lightDesc || ''}</span>
        </div>
      </div>
      <!-- Dark mode preview -->
      <div style="display: flex; align-items: center; gap: var(--space-4)">
        <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background-color: var(${cssDark}); border: var(--border-width-default) solid var(--border-dark)"></div>
        <div style="display: flex; flex-direction: column; gap: var(--space-0.5)">
          <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">${name} (Dark)</span>
          ${tokenPill(cssDark)}
          <span style="font-family: var(--font-sans); font-size: var(--typography-caption); color: var(--muted-foreground)">${darkDesc || ''}</span>
        </div>
      </div>
    </div>`;
}

// ─── Typography Sample ───
function typeSample(label, cssVar, weightVar, usage) {
  return `
    <div layer-name="Type: ${label}" style="display: flex; flex-direction: column; gap: var(--space-1); padding: var(--space-4) 0; border-bottom: 1px solid var(--border)">
      <div style="display: flex; align-items: baseline; justify-content: space-between">
        <span style="font-family: var(--font-mono); font-size: var(--typography-label); font-weight: var(--font-weight-medium); color: var(--muted-foreground); letter-spacing: var(--tracking-wide)">${label} · var(${cssVar})</span>
        <span style="font-family: var(--font-sans); font-size: var(--typography-label); color: var(--ring)">${usage}</span>
      </div>
      <span style="font-family: var(--font-sans); font-size: var(${cssVar}); font-weight: var(${weightVar}); color: var(--foreground); letter-spacing: var(--tracking-normal)">Die Struktur bestimmt das Ergebnis.</span>
    </div>`;
}

// ─── Font Weight Sample ───
function weightSample(label, cssVar) {
  return `
    <div layer-name="Weight: ${label}" style="display: flex; align-items: baseline; gap: var(--space-6); padding: var(--space-3) 0; border-bottom: 1px solid var(--border)">
      <span style="font-family: var(--font-sans); font-size: var(--typography-h4); font-weight: var(${cssVar}); color: var(--foreground); min-width: 320px">Die Struktur bestimmt das Ergebnis.</span>
      <div style="display: flex; flex-direction: column; gap: var(--space-0.5)">
        <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">${label}</span>
        <span style="font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--muted-foreground)">var(${cssVar})</span>
      </div>
    </div>`;
}

// ─── Line Height Sample ───
function lineHeightSample(label, cssVar, desc) {
  return `
    <div layer-name="Leading: ${label}" style="display: flex; align-items: flex-start; gap: var(--space-6); padding: var(--space-3) 0; border-bottom: 1px solid var(--border)">
      <div style="background-color: var(--secondary); padding: var(--space-3); border-radius: var(--radius-sm); min-width: 360px">
        <span style="font-family: var(--font-sans); font-size: var(--typography-paragraph); font-weight: var(--font-weight-regular); color: var(--foreground); line-height: var(${cssVar})">Mehrwert entsteht durch Klarheit: Wir schärfen Nutzen, Haltung und Prozesse – für Kunden und Marke.</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: var(--space-0.5)">
        <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">${label}</span>
        <span style="font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--muted-foreground)">var(${cssVar}) · ${desc}</span>
      </div>
    </div>`;
}

// ─── Letter Spacing Sample ───
function trackingSample(label, cssVar, desc) {
  return `
    <div layer-name="Tracking: ${label}" style="display: flex; align-items: baseline; gap: var(--space-6); padding: var(--space-3) 0; border-bottom: 1px solid var(--border)">
      <span style="font-family: var(--font-sans); font-size: var(--typography-large); font-weight: var(--font-weight-semibold); color: var(--foreground); letter-spacing: var(${cssVar}); min-width: 320px; text-transform: uppercase">DIGIPUB</span>
      <div style="display: flex; flex-direction: column; gap: var(--space-0-5)">
        <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">${label}</span>
        <span style="font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--muted-foreground)">var(${cssVar}) · ${desc}</span>
      </div>
    </div>`;
}

// ─── Radius Sample ───
function radiusSample(label, cssVar) {
  return `
    <div layer-name="Radius: ${label}" style="display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3) 0; border-bottom: 1px solid var(--border)">
      <div style="width: 48px; height: 48px; border-radius: var(${cssVar}); background-color: var(--foreground)"></div>
      <div style="display: flex; flex-direction: column; gap: var(--space-0-5)">
        <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">${label}</span>
        <span style="font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--muted-foreground)">var(${cssVar})</span>
      </div>
    </div>`;
}

// ─── Shadow Sample ───
function shadowSample(label, shadow) {
  return `
    <div layer-name="Shadow: ${label}" style="display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4) 0; border-bottom: 1px solid var(--border)">
      <div style="width: 64px; height: 48px; border-radius: var(--radius-md); background-color: var(--background); box-shadow: ${shadow}; border: 1px solid var(--border)"></div>
      <div style="display: flex; flex-direction: column; gap: var(--space-0-5)">
        <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">${label}</span>
        <span style="font-family: var(--font-mono); font-size: var(--typography-label); color: var(--muted-foreground)">${shadow}</span>
      </div>
    </div>`;
}

// ─── Spacing Sample ───
function spacingSample(label, cssVar, px) {
  return `
    <div layer-name="Space: ${label}" style="display: flex; align-items: center; gap: var(--space-4); padding: var(--space-2) 0; border-bottom: 1px solid var(--secondary)">
      <div style="width: var(${cssVar}); height: var(--space-4); border-radius: var(--radius-xs); background-color: var(--primary); flex-shrink: 0"></div>
      <span style="font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--muted-foreground); white-space: nowrap">${label} · var(${cssVar}) · ${px}</span>
    </div>`;
}

// ─── Breakpoint Sample ───
function breakpointSample(label, cssVar, px, desc) {
  return `
    <div layer-name="Breakpoint: ${label}" style="display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3) 0; border-bottom: 1px solid var(--border)">
      <div style="width: 80px; height: 48px; border-radius: var(--radius-sm); border: 2px solid var(--primary); display: flex; align-items: center; justify-content: center">
        <span style="font-family: var(--font-mono); font-size: var(--typography-caption); font-weight: var(--font-weight-bold); color: var(--primary)">${px}</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: var(--space-0-5)">
        <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">${label}</span>
        <span style="font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--muted-foreground)">var(${cssVar}) · ${desc}</span>
      </div>
    </div>`;
}

async function run() {
  const info = await callMcp('get_basic_info', {});
  const rootId = info.rootNodeId || info.id;
  const children = await callMcp('get_children', { nodeId: rootId });
  const oldIds = children.children
    .filter(n => n.name && n.name.startsWith('Style Guide'))
    .map(n => n.id);
  if (oldIds.length) {
    console.log(`Deleting ${oldIds.length} old artboards...`);
    await callMcp('delete_nodes', { nodeIds: oldIds });
  }

  // ═══════════════════════════════════════════════
  // 1. COVER (UX Enhanced)
  // ═══════════════════════════════════════════════
  console.log('1/6 Cover...');
  await makeArtboard('Style Guide · Cover', PAGE_W, `
    <div layer-name="Cover Content" style="display: flex; flex-direction: column; gap: var(--space-8); padding: var(--space-20) 0; max-width: 800px">
      <img src="paper-asset:///Users/ptrck/Developer/digipub-website/public/logo.svg" style="height: 32px; width: 156px" layer-name="Logo SVG">
      <div style="display: flex; flex-direction: column; gap: var(--space-2)">
        <span style="font-family: var(--font-sans); font-size: var(--typography-display); font-weight: var(--font-weight-bold); color: var(--foreground); letter-spacing: var(--tracking-tighter); line-height: var(--leading-none)">DigiPub Design System</span>
        <span style="font-family: var(--font-sans); font-size: var(--typography-display); font-weight: var(--font-weight-bold); color: var(--primary); letter-spacing: var(--tracking-tighter); line-height: var(--leading-none)">Style Guide &amp; Editor Specs</span>
      </div>
      <span style="font-family: var(--font-sans); font-size: var(--typography-large); color: var(--muted-foreground); line-height: var(--leading-relaxed)">
        Verbindliche Systemreferenz für Designer und Entwickler. Alle Komponenten des Projekts basieren auf diesem vereinheitlichten Token-Satz. Dieser Style Guide ist 100% tokenisiert.
      </span>
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-3)">
        <div style="padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); background-color: var(--secondary); border: var(--border-width-default) solid var(--border); font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--secondary-foreground)">143 Tokens</div>
        <div style="padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); background-color: var(--secondary); border: var(--border-width-default) solid var(--border); font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--secondary-foreground)">10 Token-Klassen</div>
        <div style="padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); background-color: var(--secondary); border: var(--border-width-default) solid var(--border); font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--secondary-foreground)">Light / Dark Mode</div>
        <div style="padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); background-color: var(--secondary); border: var(--border-width-default) solid var(--border); font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--secondary-foreground)">shadcn/ui-kompatibel</div>
      </div>
    </div>`);
  cursorY += 700 + ROW_GAP;

  // ═══════════════════════════════════════════════
  // 2. FARBEN (Light vs. Dark Side-by-Side)
  // ═══════════════════════════════════════════════
  console.log('2/6 Colors...');
  await makeArtboard('Style Guide · Farben', PAGE_W, `
    ${sectionTitle('Farbarchitektur', 'Color Tokens · Light vs. Dark modes side-by-side')}
    
    <div style="display: flex; flex-direction: column; gap: var(--space-4)">
      ${subGroupTitle('Basis / Layout')}
      ${colorRow('background', '--background', '--background-dark', '21:1 AAA', 'Seitenhintergrund', 'Dunkler Seitenhintergrund')}
      ${colorRow('foreground', '--foreground', '--foreground-dark', '21:1 AAA', 'Primärer Text', 'Dunkler Primärtext')}

      ${colorRow('card', '--card', '--card-dark', '21:1 AAA', 'Kartenhintergrund', 'Dunkler Kartenhintergrund')}
      ${colorRow('card-foreground', '--card-foreground', '--card-foreground-dark', '21:1 AAA', 'Text auf Karten', 'Dunkler Kartentext')}
      ${colorRow('popover', '--popover', '--popover-dark', '21:1 AAA', 'Tooltips und Popups', 'Dunkle Popups')}
      ${colorRow('popover-foreground', '--popover-foreground', '--popover-foreground-dark', '21:1 AAA', 'Text in Popups', 'Dunkler Popuptext')}

      ${subGroupTitle('Interaktive Elemente')}
      ${colorRow('primary', '--primary', '--primary-dark', '4.5:1 AA', 'Primäre Aktionsfarbe (Link/Button)', 'Silbergrau / Weißlicher Akzent')}
      ${colorRow('primary-foreground', '--primary-foreground', '--primary-foreground-dark', '21:1 AAA', 'Text auf Primärfarbe', 'Dunkelblau auf Primär')}
      ${colorRow('secondary', '--secondary', '--secondary-dark', '1.1:1', 'Sekundäre Buttons/Badges', 'Dunkle Strukturflächen')}
      ${colorRow('secondary-foreground', '--secondary-foreground', '--secondary-foreground-dark', '15:1 AAA', 'Text auf sekundären Flächen', 'Heller Text')}
      ${colorRow('accent', '--accent', '--accent-dark', '1.1:1', 'Hover-Flächen / Highlights', 'Hover-Strukturen')}
      ${colorRow('accent-foreground', '--accent-foreground', '--accent-foreground-dark', '15:1 AAA', 'Hover-Text', 'Heller Hover-Text')}
      ${colorRow('muted', '--muted', '--muted-dark', '1.1:1', 'Dezente Hintergründe', 'Dezente dunkle Flächen')}
      ${colorRow('muted-foreground', '--muted-foreground', '--muted-foreground-dark', '4.5:1 AA', 'Metadaten / Nebentext', 'Grauer Nebentext')}

      ${subGroupTitle('Rahmen & Linien')}
      ${colorRow('border', '--border', '--border-dark', '', 'Trennlinien / Standardrahmen', 'Transluzenter weißer Rahmen')}
      ${colorRow('input', '--input', '--input-dark', '', 'Formularfelder Rahmen', 'Transluzenter Inputrahmen')}
      ${colorRow('ring', '--ring', '--ring-dark', '', 'Tastatur-Fokusringe', 'Fokus-Indikator')}

      ${subGroupTitle('Status-Indikatoren')}
      ${colorRow('destructive', '--destructive', '--destructive-dark', '4.5:1 AA', 'Fehler / Löschen', 'Hellrot')}
      ${colorRow('success', '--success', '--success-dark', '4.5:1 AA', 'Erfolgreich durchgeführt', 'Erfolg')}
      ${colorRow('warning', '--warning', '--warning-dark', '4.5:1 AA', 'Warnungen / Calendly Button', 'Warnungen / Warnungsbutton')}
      ${colorRow('info', '--info', '--info-dark', '4.5:1 AA', 'Hinweise / Informationen', 'Hinweise')}

      ${subGroupTitle('Sidebar')}
      ${colorRow('sidebar', '--sidebar', '--card-dark', '', 'Sidebar Hintergrund', 'Sidebar Dunkel')}
      ${colorRow('sidebar-foreground', '--sidebar-foreground', '--foreground-dark', '', 'Sidebar Text', 'Sidebar Text Dunkel')}
      ${colorRow('sidebar-primary', '--sidebar-primary', '--primary-dark', '', 'Aktives Item', 'Aktives Item Dunkel')}
      ${colorRow('sidebar-border', '--sidebar-border', '--border-dark', '', 'Sidebar Rahmen', 'Sidebar Rahmen Dunkel')}
      ${colorRow('sidebar-ring', '--sidebar-ring', '--ring-dark', '', 'Sidebar Fokus', 'Sidebar Fokus Dunkel')}

      ${subGroupTitle('Component-Tokens')}
      ${colorRow('button-primary-background', '--button-primary-background', '--foreground-dark', '', 'Primary Action Background', 'Dark Primary Action Background')}
      ${colorRow('button-primary-foreground', '--button-primary-foreground', '--background-dark', '', 'Primary Action Text Color', 'Dark Primary Action Text Color')}
      ${colorRow('button-secondary-background', '--button-secondary-background', '--background-dark', '', 'Secondary Action Background', 'Dark Secondary Action Background')}
      ${colorRow('button-secondary-foreground', '--button-secondary-foreground', '--foreground-dark', '', 'Secondary Action Text Color', 'Dark Secondary Action Text Color')}
      ${colorRow('button-secondary-border', '--button-secondary-border', '--border-dark', '', 'Secondary Action Border Color', 'Dark Secondary Action Border Color')}
      ${colorRow('button-secondary-hover-background', '--button-secondary-hover-background', '--accent-dark', '', 'Secondary Hover Background', 'Dark Secondary Hover Background')}
      ${colorRow('button-secondary-hover-border', '--button-secondary-hover-border', '--foreground-dark', '', 'Secondary Hover Border', 'Dark Secondary Hover Border')}
      ${colorRow('button-cta-background', '--button-cta-background', '--warning-dark', '', 'Calendly CTA Background', 'Dark Calendly CTA Background')}
      ${colorRow('button-cta-foreground', '--button-cta-foreground', '--primary-foreground-dark', '', 'Calendly CTA Text Color', 'Dark Calendly CTA Text Color')}
      ${colorRow('card-background-component', '--card-background-component', '--card-dark', '', 'Card Background', 'Dark Card Background')}
      ${colorRow('card-border-component', '--card-border-component', '--border-dark', '', 'Card Border Color', 'Dark Card Border Color')}
      ${colorRow('input-background-component', '--input-background-component', '--background-dark', '', 'Input Field Background', 'Dark Input Field Background')}
      ${colorRow('input-border-component', '--input-border-component', '--border-dark', '', 'Input Field Border Color', 'Dark Input Field Border Color')}
    </div>`);
  cursorY += 3400 + ROW_GAP;

  // ═══════════════════════════════════════════════
  // 3. TYPOGRAFIE & HIERARCHIE
  // ═══════════════════════════════════════════════
  console.log('3/6 Typography...');
  await makeArtboard('Style Guide · Typografie', PAGE_W, `
    ${sectionTitle('Typografie &amp; Hierarchie', 'Font Family, Weights, Sizes, Heights &amp; Spacings')}
    
    <div style="display: grid; grid-template-cols: 1fr 1.2fr; gap: var(--space-10)">
      <!-- Font info column -->
      <div style="display: flex; flex-direction: column; gap: var(--space-6)">
        ${subGroupTitle('Schriftfamilien')}
        <div style="display: flex; flex-direction: column; gap: var(--space-2)">
          <span style="font-family: var(--font-sans); font-size: var(--typography-h3); font-weight: var(--font-weight-semibold); color: var(--foreground)">Geist Sans</span>
          ${tokenPill('--font-sans')}
          <span style="font-family: var(--font-sans); font-size: var(--typography-paragraph); color: var(--muted-foreground); line-height: var(--leading-relaxed)">
            Der primäre Zeichensatz für alle Headlines, UI-Elemente, Buttons und Fließtexte. Bietet maximale Lesbarkeit.
          </span>
        </div>
        <div style="display: flex; flex-direction: column; gap: var(--space-2)">
          <span style="font-family: var(--font-mono); font-size: var(--typography-h3); font-weight: var(--font-weight-semibold); color: var(--foreground)">Geist Mono</span>
          ${tokenPill('--font-mono')}
          <span style="font-family: var(--font-mono); font-size: var(--typography-paragraph); color: var(--muted-foreground); line-height: var(--leading-relaxed)">
            Für Labels, Overlines, Code-Bausteine, technische Parameter und Metadaten.
          </span>
        </div>

        ${subGroupTitle('Schriftgewichte')}
        <div style="display: flex; flex-direction: column; gap: var(--space-3)">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-paragraph); font-weight: var(--font-weight-regular); color: var(--foreground)">Regular (400)</span>
            ${tokenPill('--font-weight-regular')}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-paragraph); font-weight: var(--font-weight-medium); color: var(--foreground)">Medium (500)</span>
            ${tokenPill('--font-weight-medium')}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-paragraph); font-weight: var(--font-weight-semibold); color: var(--foreground)">Semibold (600)</span>
            ${tokenPill('--font-weight-semibold')}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-paragraph); font-weight: var(--font-weight-bold); color: var(--foreground)">Bold (700)</span>
            ${tokenPill('--font-weight-bold')}
          </div>
        </div>

        ${subGroupTitle('Zeichenabstand')}
        <div style="display: flex; flex-direction: column; gap: var(--space-3)">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-small); letter-spacing: var(--tracking-tighter); text-transform: uppercase; color: var(--foreground)">Tighter (-0.03em)</span>
            ${tokenPill('--tracking-tighter')}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-small); letter-spacing: var(--tracking-tight); text-transform: uppercase; color: var(--foreground)">Tight (-0.02em)</span>
            ${tokenPill('--tracking-tight')}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-small); letter-spacing: var(--tracking-normal); color: var(--foreground)">Normal (-0.01em)</span>
            ${tokenPill('--tracking-normal')}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-small); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--foreground)">Wide (0.05em)</span>
            ${tokenPill('--tracking-wide')}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-small); letter-spacing: var(--tracking-wider); text-transform: uppercase; color: var(--foreground)">Wider (0.1em)</span>
            ${tokenPill('--tracking-wider')}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-small); letter-spacing: var(--tracking-widest); text-transform: uppercase; color: var(--foreground)">Widest (0.15em)</span>
            ${tokenPill('--tracking-widest')}
          </div>
        </div>
      </div>

      <!-- Font size & scale column -->
      <div style="display: flex; flex-direction: column; gap: var(--space-6)">
        ${subGroupTitle('Schriftgrößen &amp; Typografische Skala')}
        <div style="display: flex; flex-direction: column; gap: var(--space-4)">
          ${typeSample('Display', '--typography-display', '--font-weight-bold', '48px · Cover / Hero')}
          ${typeSample('H1', '--typography-h1', '--font-weight-bold', '36px · Große Headlines')}
          ${typeSample('H2', '--typography-h2', '--font-weight-bold', '30px · Sektions-Headline')}
          ${typeSample('H3', '--typography-h3', '--font-weight-semibold', '24px · Sub-Headline')}
          ${typeSample('H4', '--typography-h4', '--font-weight-semibold', '20px · Kachel-Headline')}
          ${typeSample('Lead', '--typography-lead', '--font-weight-regular', '20px · Intro-Texte')}
          ${typeSample('Large', '--typography-large', '--font-weight-semibold', '18px · Sublines / UI-Titel')}
          ${typeSample('Paragraph', '--typography-paragraph', '--font-weight-regular', '16px · Standard Body-Text')}
          ${typeSample('List', '--typography-list', '--font-weight-regular', '16px · Listenpunkte')}
          ${typeSample('Blockquote', '--typography-blockquote', '--font-weight-regular', '16px · Zitate')}
          ${typeSample('Small', '--typography-small', '--font-weight-regular', '14px · Hilfs- &amp; Formulartext')}
          ${typeSample('Muted', '--typography-muted', '--font-weight-regular', '14px · Dezenter Zusatztext')}
          ${typeSample('Inline Code', '--typography-inline-code', '--font-weight-regular', '14px · Code-Formatierung')}
          ${typeSample('Caption', '--typography-caption', '--font-weight-regular', '12px · Metadaten')}
          ${typeSample('Label', '--typography-label', '--font-weight-semibold', '11px · Overlines / Badges')}
        </div>

        ${subGroupTitle('Zeilenhöhen')}
        <div style="display: flex; flex-direction: column; gap: var(--space-4)">
          ${lineHeightSample('None', '--leading-none', '1.0')}
          ${lineHeightSample('Tight', '--leading-tight', '1.1 · Headlines')}
          ${lineHeightSample('Snug', '--leading-snug', '1.25 · Sub-Headlines')}
          ${lineHeightSample('Normal', '--leading-normal', '1.5 · Standard Fließtext')}
          ${lineHeightSample('Relaxed', '--leading-relaxed', '1.6 · Längere Lesetexte')}
          ${lineHeightSample('Loose', '--leading-loose', '1.8 · Großer Weißraum')}
        </div>
      </div>
    </div>`);
  cursorY += 2400 + ROW_GAP;

  // ═══════════════════════════════════════════════
  // 4. SPACING, CONTAINER & LAYOUT GRID
  // ═══════════════════════════════════════════════
  console.log('4/6 Spacing & Grid...');
  await makeArtboard('Style Guide · Spacing · Grid', PAGE_W, `
    ${sectionTitle('Spacing &amp; Grid-System', 'Layout-Abstände, Max-Breiten &amp; Responsive Breakpoints')}
    
    <div style="display: grid; grid-template-cols: 1.2fr 1fr; gap: var(--space-10)">
      <!-- Spacing Scale -->
      <div style="display: flex; flex-direction: column; gap: var(--space-6)">
        ${subGroupTitle('Spacing-Skala (4px Grid)')}
        <div style="display: flex; flex-direction: column; gap: var(--space-1)">
          ${spacingSample('Space 0.5', '--space-0-5', '2px')}
          ${spacingSample('Space 1', '--space-1', '4px')}
          ${spacingSample('Space 1.5', '--space-1-5', '6px')}
          ${spacingSample('Space 2', '--space-2', '8px')}
          ${spacingSample('Space 2.5', '--space-2-5', '10px')}
          ${spacingSample('Space 3', '--space-3', '12px')}
          ${spacingSample('Space 3.5', '--space-3-5', '14px')}
          ${spacingSample('Space 4', '--space-4', '16px')}
          ${spacingSample('Space 5', '--space-5', '20px')}
          ${spacingSample('Space 6', '--space-6', '24px')}
          ${spacingSample('Space 7', '--space-7', '28px')}
          ${spacingSample('Space 8', '--space-8', '32px')}
          ${spacingSample('Space 9', '--space-9', '36px')}
          ${spacingSample('Space 10', '--space-10', '40px')}
          ${spacingSample('Space 11', '--space-11', '44px')}
          ${spacingSample('Space 12', '--space-12', '48px')}
          ${spacingSample('Space 14', '--space-14', '56px')}
          ${spacingSample('Space 16', '--space-16', '64px')}
          ${spacingSample('Space 20', '--space-20', '80px')}
          ${spacingSample('Space 24', '--space-24', '96px')}
          ${spacingSample('Space 28', '--space-28', '112px')}
          ${spacingSample('Space 32', '--space-32', '128px')}
          ${spacingSample('Space 36', '--space-36', '144px')}
          ${spacingSample('Space 40', '--space-40', '160px')}
          ${spacingSample('Space 44', '--space-44', '176px')}
          ${spacingSample('Space 48', '--space-48', '192px')}
          ${spacingSample('Space 56', '--space-56', '224px')}
          ${spacingSample('Space 64', '--space-64', '256px')}
          ${spacingSample('Space 72', '--space-72', '288px')}
          ${spacingSample('Space 80', '--space-80', '320px')}
          ${spacingSample('Space 96', '--space-96', '384px')}
        </div>
      </div>

      <!-- Layout parameters and simulator -->
      <div style="display: flex; flex-direction: column; gap: var(--space-6)">
        ${subGroupTitle('Container &amp; Margins')}
        <div style="display: flex; flex-direction: column; gap: var(--space-4)">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">Maximale Seitenbreite</span>
            ${tokenPill('--container-max')}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">Sektionsabstand</span>
            ${tokenPill('--section-gap')}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">Inneres Padding</span>
            ${tokenPill('--container-px')}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-2)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">Peak Weißraum</span>
            ${tokenPill('--peak-space')}
          </div>
        </div>

        <!-- Layout grid simulation box -->
        <div style="background-color: var(--secondary); border-radius: var(--radius-lg); padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); border: var(--border-width-default) solid var(--border)">
          <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-bold); color: var(--foreground)">Visualisierte Grid-Ausrichtung</span>
          <div style="display: grid; grid-template-cols: repeat(12, 1fr); gap: var(--space-2); height: 80px">
            ${Array.from({length:12}).map(()=> `<div style="border: 1px dashed var(--primary); background-color: rgba(37, 99, 235, 0.05); border-radius: var(--radius-xs)"></div>`).join('')}
          </div>
          <span style="font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--muted-foreground)">12-Spalten-Raster für Desktop-Layouts basierend auf var(--container-max)</span>
        </div>

        ${subGroupTitle('Breakpoints')}
        <div style="display: flex; flex-direction: column">
          ${breakpointSample('sm', '--breakpoint-sm', '640px', 'Mobile Landscape')}
          ${breakpointSample('md', '--breakpoint-md', '768px', 'Tablets (iPad, etc.)')}
          ${breakpointSample('lg', '--breakpoint-lg', '1024px', 'Standard Laptops &amp; Desktops')}
          ${breakpointSample('xl', '--breakpoint-xl', '1280px', 'Große Desktop-Bildschirme')}
          ${breakpointSample('2xl', '--breakpoint-2xl', '1536px', 'Widescreen-Monitore')}
        </div>
      </div>
    </div>`);
  cursorY += 2500 + ROW_GAP;

  // ═══════════════════════════════════════════════
  // 5. RADII & SHADOWS
  // ═══════════════════════════════════════════════
  console.log('5/6 Radii & Shadows...');
  await makeArtboard('Style Guide · Radien · Schatten', PAGE_W, `
    ${sectionTitle('Radien &amp; Schatten', 'Border Radius, Border Widths &amp; Box Shadow System')}
    
    <div style="display: grid; grid-template-cols: 1fr 1fr; gap: var(--space-10)">
      <!-- Radii Column -->
      <div style="display: flex; flex-direction: column; gap: var(--space-6)">
        ${subGroupTitle('Border Radii')}
        <div style="display: flex; flex-direction: column">
          ${radiusSample('none', '--radius-none')}
          ${radiusSample('xs', '--radius-xs')}
          ${radiusSample('sm', '--radius-sm')}
          ${radiusSample('md', '--radius-md')}
          ${radiusSample('lg', '--radius-lg')}
          ${radiusSample('xl', '--radius-xl')}
          ${radiusSample('2xl', '--radius-2xl')}
          ${radiusSample('full', '--radius-full')}
        </div>
        
        ${subGroupTitle('Border Widths')}
        <div style="display: flex; flex-direction: column; gap: var(--space-4)">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) 0; border-bottom: var(--border-width-default) solid var(--border)">
            <div style="display: flex; align-items: center; gap: var(--space-4)">
              <div style="width: 40px; height: 16px; border: var(--border-width-default) solid var(--foreground); background-color: var(--background)"></div>
              <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">Default (1px)</span>
            </div>
            ${tokenPill('--border-width-default')}
          </div>
          <div style="display: flex; align-items: center; justify-content: justify-content; justify-content: space-between; padding: var(--space-3) 0; border-bottom: var(--border-width-default) solid var(--border)">
            <div style="display: flex; align-items: center; gap: var(--space-4)">
              <div style="width: 40px; height: 16px; border: var(--border-width-thick) solid var(--foreground); background-color: var(--background)"></div>
              <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">Thick (2px)</span>
            </div>
            ${tokenPill('--border-width-thick')}
          </div>
        </div>
      </div>

      <!-- Shadows Column -->
      <div style="display: flex; flex-direction: column; gap: var(--space-6)">
        ${subGroupTitle('Shadow System')}
        <div style="display: flex; flex-direction: column">
          ${shadowSample('2xs', '0 1px 0 0 rgba(0,0,0,0.05)')}
          ${shadowSample('xs', '0 1px 2px 0 rgba(0,0,0,0.05)')}
          ${shadowSample('sm', '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)')}
          ${shadowSample('md', '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)')}
          ${shadowSample('lg', '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)')}
          ${shadowSample('xl', '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)')}
          ${shadowSample('2xl', '0 25px 50px -12px rgba(0,0,0,0.25)')}
        </div>
      </div>
    </div>`);
  cursorY += 1500 + ROW_GAP;

  // ═══════════════════════════════════════════════
  // 6. SYSTEM OVERLAYS & CONTROLS (Z-Index, Transitions, Opacity)
  // ═══════════════════════════════════════════════
  console.log('6/6 System Parameters...');
  await makeArtboard('Style Guide · System', PAGE_W, `
    ${sectionTitle('System &amp; Interaktionsparameter', 'Opacity, Transitions &amp; Z-Index Layers')}
    
    <div style="display: grid; grid-template-cols: 1fr 1.2fr; gap: var(--space-10)">
      <!-- Opacity & Transitions -->
      <div style="display: flex; flex-direction: column; gap: var(--space-6)">
        ${subGroupTitle('Opacity (Transparenz)')}
        <div style="display: flex; flex-direction: column; gap: var(--space-4)">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-3)">
            <div style="display: flex; align-items: center; gap: var(--space-4)">
              <div style="width: 48px; height: 32px; border-radius: var(--radius-sm); background-color: var(--primary); opacity: var(--opacity-hover)"></div>
              <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">Hover (80%)</span>
            </div>
            ${tokenPill('--opacity-hover')}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-3)">
            <div style="display: flex; align-items: center; gap: var(--space-4)">
              <div style="width: 48px; height: 32px; border-radius: var(--radius-sm); background-color: var(--primary); opacity: var(--opacity-disabled)"></div>
              <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">Disabled (50%)</span>
            </div>
            ${tokenPill('--opacity-disabled')}
          </div>
        </div>

        ${subGroupTitle('Transitions (Animationen)')}
        <div style="display: flex; flex-direction: column; gap: var(--space-4)">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-3)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">Schnell (150ms ease)</span>
            ${tokenPill('--transition-fast')}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: var(--border-width-default) solid var(--border); padding-bottom: var(--space-3)">
            <span style="font-family: var(--font-sans); font-size: var(--typography-small); font-weight: var(--font-weight-semibold); color: var(--foreground)">Standard (200ms ease-in-out)</span>
            ${tokenPill('--transition-normal')}
          </div>
        </div>
      </div>

      <!-- Z-Index Visualizer (overlapping layers stack) -->
      <div style="display: flex; flex-direction: column; gap: var(--space-6)">
        ${subGroupTitle('Z-Index Schichten-Modell')}
        <div style="position: relative; height: 280px; width: 100%; display: flex; align-items: center; justify-content: center; background-color: var(--secondary); border-radius: var(--radius-lg); border: var(--border-width-default) solid var(--border)">
          
          <!-- Base layer -->
          <div style="position: absolute; bottom: 40px; left: 60px; width: 240px; height: 80px; background-color: var(--background); border: var(--border-width-default) solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); padding: var(--space-2); display: flex; flex-direction: column; justify-content: space-between">
            <span style="font-family: var(--font-sans); font-size: var(--typography-caption); font-weight: var(--font-weight-semibold); color: var(--foreground)">Base Content</span>
            <span style="font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--muted-foreground)">z-index: 0</span>
          </div>

          <!-- Dropdown Layer -->
          <div style="position: absolute; bottom: 80px; left: 140px; width: 220px; height: 80px; background-color: var(--card); border: var(--border-width-default) solid var(--primary); border-radius: var(--radius-md); box-shadow: var(--shadow-md); padding: var(--space-2); display: flex; flex-direction: column; justify-content: space-between">
            <div style="display: flex; align-items: center; justify-content: space-between">
              <span style="font-family: var(--font-sans); font-size: var(--typography-caption); font-weight: var(--font-weight-semibold); color: var(--foreground)">Dropdown Menu</span>
              ${tokenPill('--z-dropdown')}
            </div>
            <span style="font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--muted-foreground)">z-index: 1000</span>
          </div>

          <!-- Sticky Header Layer -->
          <div style="position: absolute; bottom: 120px; left: 220px; width: 200px; height: 80px; background-color: var(--card); border: var(--border-width-default) solid var(--warning); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); padding: var(--space-2); display: flex; flex-direction: column; justify-content: space-between">
            <div style="display: flex; align-items: center; justify-content: space-between">
              <span style="font-family: var(--font-sans); font-size: var(--typography-caption); font-weight: var(--font-weight-semibold); color: var(--foreground)">Sticky Navigation</span>
              ${tokenPill('--z-sticky')}
            </div>
            <span style="font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--muted-foreground)">z-index: 1020</span>
          </div>

          <!-- Modal Layer -->
          <div style="position: absolute; bottom: 160px; left: 300px; width: 180px; height: 80px; background-color: var(--background); border: var(--border-width-thick) solid var(--destructive); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); padding: var(--space-2); display: flex; flex-direction: column; justify-content: space-between">
            <div style="display: flex; align-items: center; justify-content: space-between">
              <span style="font-family: var(--font-sans); font-size: var(--typography-caption); font-weight: var(--font-weight-semibold); color: var(--foreground)">Overlay / Modal</span>
              ${tokenPill('--z-modal')}
            </div>
            <span style="font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--muted-foreground)">z-index: 1050</span>
          </div>

        </div>
      </div>
    </div>`);

  console.log('\n✅ Premium UX Style Guide complete!');
}

run().catch(console.error);
