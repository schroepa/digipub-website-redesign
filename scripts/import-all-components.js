import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';

// Config
const WORKSPACE_DIR = '/Users/ptrck/Developer/digipub-website';
const HTML_FILE = path.join(WORKSPACE_DIR, 'dist/index.html');
const PAPER_MCP_URL = 'http://127.0.0.1:29979/mcp';

// Dictionary to map Tailwind classes to CSS styles
const tailwindStyles = {
  // Positioning
  'absolute': { position: 'absolute' },
  'relative': { position: 'relative' },
  'fixed': { position: 'fixed' },
  'sticky': { position: 'sticky' },
  'top-0': { top: '0px' },
  'left-0': { left: '0px' },
  'right-0': { right: '0px' },
  'bottom-0': { bottom: '0px' },
  'inset-0': { top: '0px', left: '0px', right: '0px', bottom: '0px' },
  'left-1/2': { left: '50%' },
  '-translate-x-1/2': { transform: 'translateX(-50%)' },
  '-translate-y-1/2': { transform: 'translateY(-50%)' },
  'top-1/2': { top: '50%' },
  'z-50': { zIndex: 50 },
  'z-40': { zIndex: 40 },
  'top-full': { top: '100%' },

  // Flex
  'flex': { display: 'flex' },
  'inline-flex': { display: 'inline-flex' },
  'flex-col': { flexDirection: 'column' },
  'flex-row': { flexDirection: 'row' },
  'flex-wrap': { flexWrap: 'wrap' },
  'items-center': { alignItems: 'center' },
  'items-baseline': { alignItems: 'baseline' },
  'items-start': { alignItems: 'flex-start' },
  'items-end': { alignItems: 'flex-end' },
  'justify-between': { justifyContent: 'space-between' },
  'justify-center': { justifyContent: 'center' },
  'justify-start': { justifyContent: 'flex-start' },
  'justify-end': { justifyContent: 'flex-end' },
  'flex-1': { flex: '1 1 0%' },
  'shrink-0': { flexShrink: '0' },
  
  // Grid mapping (to flex columns/rows with wrap)
  'grid': { display: 'flex', flexWrap: 'wrap', flexDirection: 'row' },
  'grid-cols-1': { flexDirection: 'column' },
  'grid-cols-2': { flexDirection: 'row', flexWrap: 'wrap' },
  'grid-cols-3': { flexDirection: 'row', flexWrap: 'wrap' },
  'grid-cols-4': { flexDirection: 'row', flexWrap: 'wrap' },
  'md:grid-cols-3': { flexDirection: 'row', flexWrap: 'wrap' },
  'lg:grid-cols-[0.85fr_1.15fr]': { flexDirection: 'row', flexWrap: 'wrap' },
  'lg:grid-cols-[1.1fr_0.9fr]': { flexDirection: 'row', flexWrap: 'wrap' },
  'md:grid-cols-5': { flexDirection: 'row', flexWrap: 'wrap' },
  
  // Spacing & Padding & Margin (ignored or converted)
  'px-6': { paddingLeft: '24px', paddingRight: '24px' },
  'py-16': { paddingTop: '64px', paddingBottom: '64px' },
  'py-8': { paddingTop: '32px', paddingBottom: '32px' },
  'py-12': { paddingTop: '48px', paddingBottom: '48px' },
  'py-24': { paddingTop: '96px', paddingBottom: '96px' },
  'pt-24': { paddingTop: '96px' },
  'pb-12': { paddingBottom: '48px' },
  'pb-10': { paddingBottom: '40px' },
  'py-6': { paddingTop: '24px', paddingBottom: '24px' },
  'py-7': { paddingTop: '28px', paddingBottom: '28px' },
  'py-2': { paddingTop: '8px', paddingBottom: '8px' },
  'px-4': { paddingLeft: '16px', paddingRight: '16px' },
  'px-5': { paddingLeft: '20px', paddingRight: '20px' },
  'pl-4': { paddingLeft: '16px' },
  'pl-9': { paddingLeft: '36px' },
  'pt-1': { paddingTop: '4px' },
  'pb-2': { paddingBottom: '8px' },
  'pt-12': { paddingTop: '48px' },
  'gap-8': { gap: '32px' },
  'gap-6': { gap: '24px' },
  'gap-5': { gap: '20px' },
  'gap-3': { gap: '12px' },
  'gap-1': { gap: '4px' },
  'gap-[5px]': { gap: '5px' },
  'gap-x-16': { columnGap: '64px', gap: '64px' },
  'gap-y-12': { rowGap: '48px' },
  'gap-y-10': { rowGap: '40px' },
  'gap-x-8': { columnGap: '32px', gap: '32px' },
  'gap-y-6': { rowGap: '24px' },
  'gap-x-4': { columnGap: '16px', gap: '16px' },
  'gap-y-1': { rowGap: '4px' },
  
  // Heights & Widths
  'w-full': { width: '100%' },
  'h-full': { height: '100%' },
  'h-16': { height: '64px' },
  'h-6': { height: '24px' },
  'w-auto': { width: 'auto' },
  'h-9': { height: '36px' },
  'w-9': { width: '36px' },
  'w-5': { width: '20px' },
  'h-[2px]': { height: '2px' },
  'w-11': { width: '44px' },
  'h-11': { height: '44px' },
  'max-w-7xl': { maxWidth: '1280px', width: '100%' },
  'max-w-3xl': { maxWidth: '768px', width: '100%' },
  'max-w-4xl': { maxWidth: '896px', width: '100%' },
  'max-w-lg': { maxWidth: '512px', width: '100%' },
  'max-w-sm': { maxWidth: '384px', width: '100%' },
  'min-w-[220px]': { minWidth: '220px' },
  
  // Opacity & Pointer Events
  'opacity-0': { opacity: 0 },
  'pointer-events-none': { pointerEvents: 'none' },
  
  // Typography
  'font-bold': { fontWeight: '700' },
  'font-medium': { fontWeight: '500' },
  'font-semibold': { fontWeight: '600' },
  'font-mono': { fontFamily: 'var(--font-mono)' },
  'text-xs': { fontSize: '12px' },
  'text-sm': { fontSize: '14px' },
  'text-base': { fontSize: '16px' },
  'text-2xl': { fontSize: '24px' },
  'text-3xl': { fontSize: '30px' },
  'tracking-tight': { letterSpacing: '-0.02em' },
  'tracking-widest': { letterSpacing: '0.1em' },
  'tracking-[0.2em]': { letterSpacing: '0.2em' },
  'leading-tight': { lineHeight: '1.25' },
  'leading-relaxed': { lineHeight: '1.625' },
  
  // Colors & Backgrounds
  'bg-background': { backgroundColor: 'var(--background)' },
  'bg-popover': { backgroundColor: 'var(--popover)' },
  'bg-accent': { backgroundColor: 'var(--accent)' },
  'bg-foreground': { backgroundColor: 'var(--foreground)' },
  'bg-current': { backgroundColor: 'currentColor' },
  'text-foreground': { color: 'var(--foreground)' },
  'text-background': { color: 'var(--background)' },
  'text-muted-foreground': { color: 'var(--muted-foreground)' },
  'text-primary': { color: 'var(--primary)' },
  'border-border': { borderColor: 'var(--border)' },
  'border-t': { borderTop: '1px solid var(--border)' },
  'border-b': { borderBottom: '1px solid var(--border)' },
  'border-l': { borderLeft: '1px solid var(--border)' },
  'border': { border: '1px solid var(--border)' },
  
  // Border radius
  'rounded': { borderRadius: 'var(--radius-sm)' },
  'rounded-md': { borderRadius: 'var(--radius-md)' },
  'rounded-lg': { borderRadius: 'var(--radius-lg)' },
  'rounded-full': { borderRadius: 'var(--radius-full)' },

  // Visibility / Display Overrides
  'hidden': { display: 'none' },
  'block': { display: 'block' },
  'inline-block': { display: 'inline-block' }
};

// Helper to convert style objects to inline CSS strings
function styleObjToString(styleObj) {
  return Object.entries(styleObj)
    .map(([key, val]) => `${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${val}`)
    .join('; ');
}

// Convert Tailwind classes to inline styles for a given viewport width (390, 768, 1440)
function processNode(node, width) {
  if (node.nodeType !== 1) return; // Only process element nodes
  
  const classAttr = node.getAttribute('class') || '';
  const existingStyle = node.getAttribute('style') || '';
  const classes = classAttr.split(/\s+/).filter(Boolean);
  
  let inlineStyles = {};

  // 1. Gather all classes and categorize them by breakpoint
  let activeClasses = [];
  classes.forEach(cls => {
    if (cls.startsWith('lg:')) {
      if (width >= 1024) activeClasses.push({ bp: 3, cls: cls.substring(3) });
    } else if (cls.startsWith('md:')) {
      if (width >= 768) activeClasses.push({ bp: 2, cls: cls.substring(3) });
    } else if (cls.startsWith('sm:')) {
      if (width >= 480) activeClasses.push({ bp: 1, cls: cls.substring(3) });
    } else {
      activeClasses.push({ bp: 0, cls });
    }
  });

  // Sort active classes so that higher breakpoints override lower ones
  activeClasses.sort((a, b) => a.bp - b.bp);

  // Map classes to styles
  activeClasses.forEach(({ cls }) => {
    const style = tailwindStyles[cls];
    if (style) {
      Object.assign(inlineStyles, style);
    }
    
    // Parse aspect-[A/B]
    if (cls.startsWith('aspect-[')) {
      const match = cls.match(/aspect-\[(\d+)\/(\d+)\]/);
      if (match) {
        inlineStyles.aspectRatio = `${match[1]}/${match[2]}`;
      }
    }
  });

  // Specific Theme Toggle fix (Hide Moon icon in light mode by default)
  if (classes.includes('theme-icon-moon')) {
    inlineStyles.display = 'none';
  } else if (classes.includes('theme-icon-sun')) {
    inlineStyles.display = 'block';
  }

  // 2. Responsive Grid column width mapping
  const parent = node.parentNode;
  if (parent && parent.nodeType === 1) {
    const parentClass = parent.getAttribute('class') || '';
    const isParentGrid = parentClass.split(/\s+/).includes('grid');
    if (isParentGrid) {
      let cols = 1;
      const parentClasses = parentClass.split(/\s+/);
      
      if (width >= 1024) { // Desktop
        const lgColMatch = parentClasses.find(c => c.startsWith('lg:grid-cols-'));
        const mdColMatch = parentClasses.find(c => c.startsWith('md:grid-cols-'));
        const colMatch = parentClasses.find(c => c.startsWith('grid-cols-'));
        
        if (lgColMatch) {
          cols = lgColMatch.includes('[') ? lgColMatch : (parseInt(lgColMatch.replace('lg:grid-cols-', ''), 10) || 1);
        } else if (mdColMatch) {
          cols = parseInt(mdColMatch.replace('md:grid-cols-', ''), 10) || 1;
        } else if (colMatch) {
          cols = parseInt(colMatch.replace('grid-cols-', ''), 10) || 1;
        }
      } else if (width >= 768) { // Tablet
        const mdColMatch = parentClasses.find(c => c.startsWith('md:grid-cols-'));
        const smColMatch = parentClasses.find(c => c.startsWith('sm:grid-cols-'));
        const colMatch = parentClasses.find(c => c.startsWith('grid-cols-'));
        
        if (mdColMatch) {
          cols = parseInt(mdColMatch.replace('md:grid-cols-', ''), 10) || 1;
        } else if (smColMatch) {
          cols = parseInt(smColMatch.replace('sm:grid-cols-', ''), 10) || 1;
        } else if (colMatch) {
          cols = parseInt(colMatch.replace('grid-cols-', ''), 10) || 1;
        }
      } else { // Mobile
        const colMatch = parentClasses.find(c => c.startsWith('grid-cols-'));
        if (colMatch) {
          cols = parseInt(colMatch.replace('grid-cols-', ''), 10) || 1;
        }
      }
      
      // Assign width to grid children to keep them in row layout and avoid squeezed columns
      if (typeof cols === 'number') {
        if (cols === 2) {
          inlineStyles.width = 'calc(50% - 16px)';
          inlineStyles.flex = '0 0 calc(50% - 16px)';
        } else if (cols === 3) {
          inlineStyles.width = 'calc(33.33% - 24px)';
          inlineStyles.flex = '0 0 calc(33.33% - 24px)';
        } else if (cols === 4) {
          inlineStyles.width = 'calc(25% - 24px)';
          inlineStyles.flex = '0 0 calc(25% - 24px)';
        } else if (cols === 5) {
          inlineStyles.width = 'calc(20% - 26px)';
          inlineStyles.flex = '0 0 calc(20% - 26px)';
        } else {
          inlineStyles.width = '100%';
          inlineStyles.flex = '0 0 100%';
        }
      } else if (typeof cols === 'string') {
        // Custom columns like lg:grid-cols-[0.85fr_1.15fr]
        const elementSiblings = parent.childNodes.filter(n => n.nodeType === 1);
        const childIndex = elementSiblings.indexOf(node);
        
        if (cols.includes('0.85fr') && childIndex !== -1) {
          if (childIndex === 0) {
            inlineStyles.width = 'calc(42.5% - 32px)';
            inlineStyles.flex = '0 0 calc(42.5% - 32px)';
          } else {
            inlineStyles.width = 'calc(57.5% - 32px)';
            inlineStyles.flex = '0 0 calc(57.5% - 32px)';
          }
        } else if (cols.includes('1.1fr') && childIndex !== -1) {
          if (childIndex === 0) {
            inlineStyles.width = 'calc(55% - 32px)';
            inlineStyles.flex = '0 0 calc(55% - 32px)';
          } else {
            inlineStyles.width = 'calc(45% - 32px)';
            inlineStyles.flex = '0 0 calc(45% - 32px)';
          }
        }
      }
    }
  }

  // If the node is absolute and centered, but has no top property, add an explicit top: 12px to keep it vertically centered inside the header container
  if (inlineStyles.position === 'absolute' && classes.includes('left-1/2') && classes.includes('-translate-x-1/2')) {
    if (!inlineStyles.top && !classes.some(c => c.startsWith('top-'))) {
      inlineStyles.top = '12px';
    }
  }

  // 3. Build style string
  let styleStr = styleObjToString(inlineStyles);
  if (existingStyle) {
    styleStr = styleStr ? `${styleStr}; ${existingStyle}` : existingStyle;
  }
  
  // 4. Force reveal only elements that have animation indicators (data-animate / data-statement)
  const isAnimated = node.hasAttribute('data-animate') || node.hasAttribute('data-statement');
  if (isAnimated && styleStr) {
    styleStr = styleStr
      .replace(/opacity\s*:\s*0\s*;?/g, 'opacity: 1;')
      .replace(/transform\s*:\s*translateY\([^)]+\)\s*;?/g, 'transform: none;')
      .replace(/opacity\s*:\s*0/g, 'opacity: 1')
      .replace(/transform\s*:\s*translateY\([^)]+\)/g, 'transform: none');
  }
  
  if (styleStr) {
    node.setAttribute('style', styleStr);
  }
  
  // 5. Clean up attributes not needed in Paper
  node.removeAttribute('class');
  node.removeAttribute('data-animate');
  
  // 6. Resolve relative asset paths and fix logo width (collapsing issue)
  const src = node.getAttribute('src');
  if (src && src.startsWith('/')) {
    node.setAttribute('src', `paper-asset://${WORKSPACE_DIR}/public${src}`);
    if (src.includes('logo.svg')) {
      node.setAttribute('style', (node.getAttribute('style') || '') + '; width: 117px; height: 24px;');
    }
  }

  // Recursive call for children
  node.childNodes.forEach(child => processNode(child, width));
}

// Recursively traverse and add semantic layer names to elements
function addSemanticLayerNames(node) {
  if (node.nodeType !== 1) return;
  
  const tagName = node.tagName.toLowerCase();
  const id = node.getAttribute('id');
  const classes = (node.getAttribute('class') || '').split(/\s+/).filter(Boolean);
  
  let name = '';
  
  if (tagName === 'header') {
    name = 'Header';
  } else if (tagName === 'nav') {
    name = 'Navigation';
  } else if (tagName === 'footer') {
    name = 'Footer';
  } else if (tagName === 'section') {
    name = id ? `Section: ${id.charAt(0).toUpperCase() + id.slice(1)}` : 'Section';
  } else if (tagName === 'main') {
    name = 'Main Content';
  } else if (tagName === 'article') {
    name = 'Article Card';
  } else if (tagName === 'img') {
    const src = node.getAttribute('src') || '';
    name = src.includes('logo') ? 'Logo SVG' : 'Image';
  } else if (id === 'theme-toggle') {
    name = 'Theme Toggle Button';
  } else if (id === 'mob-btn') {
    name = 'Mobile Menu Button';
  } else if (id === 'mob-menu') {
    name = 'Mobile Menu Overlay';
  } else if (tagName === 'a') {
    const href = node.getAttribute('href') || '';
    if (href === '/') {
      name = 'Logo Link';
    } else if (href === '/kontakt') {
      name = 'Kontakt Button';
    } else {
      const text = node.text.trim();
      name = text ? `Link: ${text}` : 'Link';
    }
  } else if (tagName === 'button') {
    const text = node.text.trim();
    name = text ? `Button: ${text}` : 'Button';
  } else if (tagName === 'svg') {
    name = 'Icon';
  } else if (classes.includes('theme-icon-sun')) {
    name = 'Sun Icon';
  } else if (classes.includes('theme-icon-moon')) {
    name = 'Moon Icon';
  } else if (classes.includes('hamburger-icon')) {
    name = 'Hamburger Icon';
  } else if (classes.includes('close-icon')) {
    name = 'Close Icon';
  } else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4') {
    const text = node.text.trim();
    name = text ? `${tagName.toUpperCase()}: ${text.substring(0, 30)}` : 'Heading';
  } else if (tagName === 'p') {
    const text = node.text.trim();
    name = text ? `Paragraph: ${text.substring(0, 30)}...` : 'Paragraph';
  } else if (tagName === 'ul' || tagName === 'ol') {
    name = 'List Container';
  } else if (tagName === 'li') {
    name = 'List Item';
  } else if (classes.includes('border') && classes.includes('rounded-lg')) {
    name = 'Card Container';
  }
  
  if (name) {
    node.setAttribute('layer-name', name);
  }
  
  node.childNodes.forEach(addSemanticLayerNames);
}

// Call JSON-RPC MCP server
async function callMcp(method, args) {
  const payload = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: method,
      arguments: args
    },
    id: Date.now() + Math.floor(Math.random() * 1000)
  };

  const res = await fetch(PAPER_MCP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const text = await res.text();
  const lines = text.split('\n');
  const dataLine = lines.find(l => l.startsWith('data: '));
  if (dataLine) {
    try {
      const data = JSON.parse(dataLine.substring(6));
      if (data.error) {
        throw new Error(`MCP Error for ${method}: ${JSON.stringify(data.error)}`);
      }
      
      const contentText = data.result?.content?.[0]?.text;
      if (!contentText) {
        throw new Error(`MCP Error: Result content is missing text: ${JSON.stringify(data)}`);
      }
      
      try {
        return JSON.parse(contentText);
      } catch (parseErr) {
        throw new Error(`Failed parsing content text for ${method}. Content: "${contentText}". Parse error: ${parseErr.message}`);
      }
    } catch (jsonErr) {
      throw new Error(`Failed parsing data line for ${method}. Line: "${dataLine}". Error: ${jsonErr.message}`);
    }
  }
  
  throw new Error(`No data line returned from MCP stream for ${method}. Full response: "${text}"`);
}

async function run() {
  console.log('Reading compiled HTML file...');
  const htmlContent = fs.readFileSync(HTML_FILE, 'utf8');
  const root = parse(htmlContent);

  // Extract components
  const components = {
    'Header': root.querySelector('header'),
    'Hero': root.querySelector('section#hero'),
    'Strukturproblem': root.querySelector('section#strukturproblem'),
    'Denkweise': root.querySelector('section#denkweise'),
    'Reihenfolge': root.querySelector('section#reihenfolge'),
    'Leistungen': root.querySelector('section#leistungen'),
    'Cases': root.querySelector('section#cases'),
    'Haltung': root.querySelector('section#haltung'),
    'Footer': root.querySelector('footer')
  };

  // We delete ALL previously created artboards matching these names
  const info = await callMcp('get_basic_info', {});
  const rootId = info.rootNodeId || info.id;
  const children = await callMcp('get_children', { nodeId: rootId });
  const oldArtboards = children.children
    .filter(n => n.name && Object.keys(components).some(comp => n.name.startsWith(`${comp} -`)))
    .map(n => n.id);

  if (oldArtboards.length > 0) {
    console.log(`Deleting ${oldArtboards.length} old artboards...`);
    await callMcp('delete_nodes', { nodeIds: oldArtboards });
  }

  const viewports = [
    { name: 'Desktop', width: 1440, height: '900px' },
    { name: 'Tablet', width: 768, height: '900px' },
    { name: 'Mobile', width: 390, height: '844px' }
  ];

  let i = 0;
  for (const [compName, compNode] of Object.entries(components)) {
    if (!compNode) {
      console.warn(`Warning: Component ${compName} not found in HTML!`);
      continue;
    }

    console.log(`\nImporting ${compName}...`);

    for (let vpIndex = 0; vpIndex < viewports.length; vpIndex++) {
      const vp = viewports[vpIndex];
      
      // 1. Create a clone of the parsed node to avoid modifying other viewports
      const clone = parse(compNode.outerHTML).firstChild;
      
      // 2. Add semantic layer names before modifying tag structures
      addSemanticLayerNames(clone);
      
      // 3. Process classes and styles for the given viewport width
      processNode(clone, vp.width);
      
      // Remove script tags from clone
      clone.querySelectorAll('script').forEach(s => s.remove());
      
      let cleanHtml = clone.outerHTML.trim();

      // 4. Replace HTML5 tags with divs so Paper imports them cleanly
      cleanHtml = cleanHtml
        .replace(/<header\b/gi, '<div')
        .replace(/<\/header>/gi, '</div>')
        .replace(/<nav\b/gi, '<div')
        .replace(/<\/nav>/gi, '</div>')
        .replace(/<footer\b/gi, '<div')
        .replace(/<\/footer>/gi, '</div>')
        .replace(/<main\b/gi, '<div')
        .replace(/<\/main>/gi, '</div>')
        .replace(/<section\b/gi, '<div')
        .replace(/<\/section>/gi, '</div>')
        .replace(/<article\b/gi, '<div')
        .replace(/<\/article>/gi, '</div>');

      // 5. Coordinate Positioning
      const topPos = i * 1500; // 1500px row height for generous spacing
      let leftPos = 0;
      if (vp.name === 'Tablet') {
        leftPos = 1520; // 1440px desktop + 80px gap
      } else if (vp.name === 'Mobile') {
        leftPos = 2368; // 1520px + 768px tablet + 80px gap
      }

      const artboardName = `${compName} - ${vp.name}`;
      console.log(`Creating artboard: "${artboardName}" at (${leftPos}px, ${topPos}px)...`);
      
      try {
        const artboard = await callMcp('create_artboard', {
          name: artboardName,
          styles: {
            width: `${vp.width}px`,
            height: vp.name === 'Mobile' ? '844px' : '900px',
            top: `${topPos}px`,
            left: `${leftPos}px`,
            backgroundColor: 'var(--background)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column'
          }
        });
        
        const artboardId = artboard.nodeId || artboard.id || artboard.artboardId;
        console.log(`Artboard created with ID: ${artboardId}. Writing component HTML...`);

        // 6. Write HTML into the artboard
        await callMcp('write_html', {
          html: cleanHtml,
          targetNodeId: artboardId,
          mode: 'insert-children'
        });

        // 7. Update height to fit-content and reinforce coordinates
        await callMcp('update_styles', {
          updates: [
            {
              nodeIds: [artboardId],
              styles: { 
                height: 'fit-content',
                top: `${topPos}px`,
                left: `${leftPos}px`
              }
            }
          ]
        });

        console.log(`✓ Completed: ${compName} - ${vp.name}`);
      } catch (err) {
        console.error(`✗ Failed importing ${compName} for ${vp.name}:`, err.message);
      }
    }
    i++;
  }

  console.log('\nAll imports finished!');
}

run();
