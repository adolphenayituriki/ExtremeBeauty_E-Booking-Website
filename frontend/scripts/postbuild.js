/**
 * postbuild.js
 *
 * Pre-renders every public route of the SPA into a static HTML snapshot using a
 * headless Chrome/Edge browser. Snapshots are written into the build output
 * (build/<route>/index.html). Vercel's filesystem precedence serves these
 * static HTML files to crawlers (Google, Bing, etc.) instead of an empty JS
 * shell, while the SPA catch-all still handles everything else.
 *
 * Safety: every failure path silently skips pre-rendering, so the deployment
 * always works — even on machines without Chrome/Edge installed.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const frontendRoot = path.join(__dirname, '..');
const buildDir = path.join(frontendRoot, 'build');
const PORT = 45678;
const BASE_URL = `http://localhost:${PORT}`;

const STATIC_ROUTES = ['', 'services', 'about', 'booking', 'contact', 'tracking', 'teaching'];

const SERVICE_ROUTES = [
  'service/microblading-eyebrows',
  'service/ombre-microshading',
  'service/hybrid-combination-brows',
  'service/brows-lamination',
  'service/lash-lift',
  'service/classic-set',
  'service/hybrid-set',
  'service/volume-set',
  'service/mega-volume-set',
  'service/wispy-sets',
  'service/lash-removal',
  'service/eyebrows-retouch',
  'service/training-session',
];

const ALL_ROUTES = [...STATIC_ROUTES, ...SERVICE_ROUTES];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function startServer() {
  const server = http.createServer((req, res) => {
    let urlPath;
    try {
      urlPath = decodeURIComponent(new URL(req.url, BASE_URL).pathname);
    } catch {
      urlPath = '/';
    }
    let filePath = path.normalize(path.join(buildDir, urlPath === '/' ? 'index.html' : urlPath));
    if (!filePath.startsWith(buildDir)) filePath = path.join(buildDir, 'index.html');
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(buildDir, 'index.html');
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

function findBrowser() {
  const candidates = [process.env.CHROME_PATH];
  if (process.platform === 'win32') {
    candidates.push(
      process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
      process.env.PROGRAMFILES + '\\Microsoft\\Edge\\Application\\msedge.exe',
      process.env['PROGRAMFILES(X86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
      process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe'
    );
  } else if (process.platform === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium'
    );
  } else {
    candidates.push(
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/opt/google/chrome/chrome'
    );
  }
  return candidates.filter(Boolean).find((p) => typeof p === 'string' && p.length > 0 && fs.existsSync(p)) || null;
}

async function prerender() {
  if (process.env.PRERENDER_DISABLE === '1') {
    console.log('[postbuild] Pre-render disabled via PRERENDER_DISABLE=1. Skipping.');
    return;
  }

  const browserPath = findBrowser();
  if (!browserPath) {
    console.warn('[postbuild] No Chrome/Edge found; skipping pre-render. Set CHROME_PATH to enable.');
    return;
  }

  console.log(`[postbuild] Pre-rendering ${ALL_ROUTES.length} routes with ${browserPath}...`);

  let puppeteer;
  try {
    puppeteer = require('puppeteer-core');
  } catch {
    console.warn('[postbuild] puppeteer-core unavailable; skipping pre-render.');
    return;
  }

  const server = await startServer();
  let browser = null;

  try {
    browser = await puppeteer.launch({
      executablePath: browserPath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  } catch (error) {
    console.warn('[postbuild] Could not launch browser:', error.message, '-> skipping pre-render.');
    server.close();
    return;
  }

  let rendered = 0;
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('/api/') || req.resourceType() === 'media') {
        req.abort();
      } else {
        req.continue();
      }
    });

    for (const route of ALL_ROUTES) {
      const relFile = route === '' ? 'index.html' : `${route}/index.html`;
      const outPath = path.join(buildDir, relFile);
      try {
        await page.goto(`${BASE_URL}/${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise((r) => setTimeout(r, 2500));
      } catch (error) {
        console.warn(`[postbuild] timeout while loading "/${route}":`, error.message);
      }
      const html = await page.content();
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html, 'utf8');
      rendered += 1;
    }

    await browser.close();
    server.close();
    console.log(`[postbuild] Pre-rendered ${rendered}/${ALL_ROUTES.length} routes.`);
  } catch (error) {
    console.error('[postbuild] ERROR during pre-render:', error.message);
    if (browser) await browser.close().catch(() => {});
    server.close();
  }
}

prerender().catch((error) => {
  console.error('[postbuild] Unexpected failure:', error);
});