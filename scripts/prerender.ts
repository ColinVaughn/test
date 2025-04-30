import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from '../src/entry-server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Routes to pre-render
const routes = [
  '/',
  '/customize',
  '/prebuilt',
  '/gaming-pcs',
  '/workstations',
  '/about',
  '/support',
];

async function prerender() {
  const template = fs.readFileSync(
    path.resolve(__dirname, '../dist/index.html'),
    'utf-8'
  );

  // Create output directory
  const outDir = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Pre-render each route
  for (const url of routes) {
    const { html: appHtml, helmetContext } = render(url);
    const { helmet } = helmetContext as any;

    // Replace the root div with server-rendered HTML
    let renderedHtml = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    // Update meta tags
    if (helmet) {
      renderedHtml = renderedHtml
        .replace('</head>', `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}</head>`);
    }

    // Write the rendered HTML to a file
    const filePath = path.join(outDir, url === '/' ? 'index.html' : `${url}/index.html`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, renderedHtml);

    console.log(`Pre-rendered ${url}`);
  }

  console.log('Pre-rendering complete!');
}

prerender().catch(console.error); 