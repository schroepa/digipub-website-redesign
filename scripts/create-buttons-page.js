// Buttons Style Guide Page – using Component Tokens exclusively
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

const calIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--button-primary-foreground)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--button-primary-foreground)"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="var(--button-primary-foreground)"></rect><line x1="16" y1="2" x2="16" y2="6" stroke="var(--button-primary-foreground)"></line><line x1="8" y1="2" x2="8" y2="6" stroke="var(--button-primary-foreground)"></line><line x1="3" y1="10" x2="21" y2="10" stroke="var(--button-primary-foreground)"></line></svg>';
const moonIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>';

function sectionLabel(text) {
  return `<span style="font-family: var(--font-mono); font-size: var(--typography-label); font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--primary)">${text}</span>`;
}

function specLine(text) {
  return `<span style="font-family: var(--font-mono); font-size: var(--typography-caption); color: var(--muted-foreground)">${text}</span>`;
}

async function run() {
  const info = await callMcp('get_basic_info', {});
  console.log('Current page:', info.pageName);

  if (info.pageName !== 'Buttons') {
    const page = await callMcp('create_page', { name: 'Buttons' });
    await callMcp('open_page', { pageId: page.pageId });
  }

  // Clean old artboards on Buttons page
  const pageRoot = await callMcp('get_basic_info', {});
  const rootId = pageRoot.rootNodeId || pageRoot.id;
  const children = await callMcp('get_children', { nodeId: rootId });
  const oldIds = children.children
    .filter(n => n.name && n.name.startsWith('Buttons'))
    .map(n => n.id);
  if (oldIds.length) {
    console.log(`Deleting ${oldIds.length} old Buttons artboards...`);
    await callMcp('delete_nodes', { nodeIds: oldIds });
  }

  // Create the artboard
  const ab = await callMcp('create_artboard', {
    name: 'Buttons · Varianten',
    styles: {
      width: '1440px',
      height: 'fit-content',
      top: '0px',
      left: '0px',
      backgroundColor: 'var(--background)',
      padding: '48px',
      display: 'flex',
      flexDirection: 'column',
      gap: '48px'
    }
  });
  const abId = ab.id;
  console.log('Artboard created:', abId);

  // Title
  await callMcp('write_html', { targetNodeId: abId, mode: 'insert-children', html:
    '<div layer-name="Section Title" style="display: flex; flex-direction: column; gap: 4px; padding-bottom: 16px; border-bottom: 2px solid var(--foreground)">' +
      '<span style="font-family: var(--font-mono); font-size: var(--typography-label); font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted-foreground)">Komponenten</span>' +
      '<span style="font-family: var(--font-sans); font-size: var(--typography-h2); font-weight: 700; color: var(--foreground); letter-spacing: -0.02em">Buttons</span>' +
    '</div>'
  });

  // Primary Button (uses --button-primary-background & --button-primary-foreground)
  await callMcp('write_html', { targetNodeId: abId, mode: 'insert-children', html:
    '<div layer-name="Primary Button" style="display: flex; flex-direction: column; gap: 12px">' +
      sectionLabel('Primary Button') +
      '<div style="display: flex; gap: 16px; align-items: center">' +
        '<div layer-name="Default" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background-color: var(--button-primary-background); color: var(--button-primary-foreground); font-family: var(--font-sans); font-size: var(--typography-small); font-weight: 600; border-radius: var(--button-radius); cursor: pointer">Termin buchen ' + calIcon + '</div>' +
        '<div layer-name="Hover" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background-color: var(--button-primary-background); color: var(--button-primary-foreground); font-family: var(--font-sans); font-size: var(--typography-small); font-weight: 600; border-radius: var(--button-radius); opacity: var(--button-hover-opacity)">Hover</div>' +
        '<div layer-name="Disabled" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background-color: var(--button-primary-background); color: var(--button-primary-foreground); font-family: var(--font-sans); font-size: var(--typography-small); font-weight: 600; border-radius: var(--button-radius); opacity: var(--button-disabled-opacity)">Disabled</div>' +
      '</div>' +
      specLine('bg: var(--button-primary-background) · text: var(--button-primary-foreground) · radius: var(--button-radius)') +
    '</div>'
  });

  // Secondary Button (uses --button-secondary-background & --button-secondary-foreground & --button-secondary-border)
  await callMcp('write_html', { targetNodeId: abId, mode: 'insert-children', html:
    '<div layer-name="Secondary Button" style="display: flex; flex-direction: column; gap: 12px">' +
      sectionLabel('Secondary / Outline Button') +
      '<div style="display: flex; gap: 16px; align-items: center">' +
        '<div layer-name="Default" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background-color: var(--button-secondary-background); color: var(--button-secondary-foreground); font-family: var(--font-sans); font-size: var(--typography-small); font-weight: 600; border-radius: var(--button-radius); border: var(--border-width-default) solid var(--button-secondary-border)">E-Mail schreiben</div>' +
        '<div layer-name="Hover" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background-color: var(--button-secondary-hover-background); color: var(--button-secondary-foreground); font-family: var(--font-sans); font-size: var(--typography-small); font-weight: 600; border-radius: var(--button-radius); border: var(--border-width-default) solid var(--button-secondary-hover-border)">Hover</div>' +
        '<div layer-name="Disabled" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background-color: var(--button-secondary-background); color: var(--button-secondary-foreground); font-family: var(--font-sans); font-size: var(--typography-small); font-weight: 600; border-radius: var(--button-radius); border: var(--border-width-default) solid var(--button-secondary-border); opacity: var(--button-disabled-opacity)">Disabled</div>' +
      '</div>' +
      specLine('bg: var(--button-secondary-background) · border: var(--button-secondary-border) · text: var(--button-secondary-foreground) · radius: var(--button-radius)') +
    '</div>'
  });

  // Warning / CTA Button (uses --button-cta-background & --button-cta-foreground)
  await callMcp('write_html', { targetNodeId: abId, mode: 'insert-children', html:
    '<div layer-name="Warning CTA Button" style="display: flex; flex-direction: column; gap: 12px">' +
      sectionLabel('Warning / CTA Button') +
      '<div style="display: flex; gap: 16px; align-items: center">' +
        '<div layer-name="Default" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background-color: var(--button-cta-background); color: var(--button-cta-foreground); font-family: var(--font-sans); font-size: var(--typography-small); font-weight: 500; border-radius: var(--radius-md)">Jetzt Termin buchen</div>' +
        '<div layer-name="Hover" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background-color: var(--button-cta-background); color: var(--button-cta-foreground); font-family: var(--font-sans); font-size: var(--typography-small); font-weight: 500; border-radius: var(--radius-md); opacity: var(--button-hover-opacity)">Hover</div>' +
      '</div>' +
      specLine('bg: var(--button-cta-background) · text: var(--button-cta-foreground) · radius: var(--radius-md)') +
    '</div>'
  });

  // Ghost Button
  await callMcp('write_html', { targetNodeId: abId, mode: 'insert-children', html:
    '<div layer-name="Ghost Button" style="display: flex; flex-direction: column; gap: 12px">' +
      sectionLabel('Ghost / Icon Button') +
      '<div style="display: flex; gap: 16px; align-items: center">' +
        '<div layer-name="Default" style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; background-color: transparent; color: var(--foreground); border-radius: var(--radius-md)">' + moonIcon + '</div>' +
        '<div layer-name="Hover" style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; background-color: var(--accent); color: var(--accent-foreground); border-radius: var(--radius-md)">' + moonIcon + '</div>' +
      '</div>' +
      specLine('bg: transparent · hover: var(--accent) · radius: var(--radius-md)') +
    '</div>'
  });

  await callMcp('finish_working_on_nodes', { nodeIds: [abId] });
  console.log('\n✅ Buttons page generated with component tokens!');
}

run().catch(console.error);
