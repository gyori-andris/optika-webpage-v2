/**
 * Screenshot capture script for Nádor Optika WordPress site.
 *
 * Usage (once homeserver01 is back up):
 *   npx playwright test scripts/screenshot.ts --project=chromium
 *   OR:
 *   npx ts-node scripts/screenshot.ts
 *
 * Outputs: docs/screenshots/{page}-{viewport}.png
 */

import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'https://optika.andris.boo';
const OUT_DIR = path.join(process.cwd(), 'docs/screenshots');

const PAGES = [
  { slug: '',             name: 'home' },
  { slug: 'szemuveg',    name: 'szemuveg' },
  { slug: 'kontaktlencse', name: 'kontaktlencse' },
  { slug: 'latásvizsgalat', name: 'latásvizsgalat' },
  { slug: 'napszemuveg', name: 'napszemuveg' },
  { slug: 'hallasvizsgalat', name: 'hallasvizsgalat' },
  { slug: 'munkavedelem', name: 'munkavedelem' },
  { slug: 'kapcsolat',   name: 'kapcsolat' },
  { slug: 'rolunk',      name: 'rolunk' },
  { slug: 'arak',        name: 'arak' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile',  width: 390,  height: 844 },
];

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();

  for (const viewport of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await ctx.newPage();

    for (const p of PAGES) {
      const url = `${BASE_URL}/${p.slug}`.replace(/\/$/, '') + (p.slug ? '/' : '/');
      console.log(`[${viewport.name}] ${url}`);

      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 20_000 });
        // Dismiss any cookie banners / overlays
        await page.evaluate(() => {
          const selectors = ['.cookie-banner', '#cookie-notice', '.cc-window'];
          selectors.forEach(sel => {
            document.querySelectorAll<HTMLElement>(sel).forEach(el => el.remove());
          });
        });
        await page.screenshot({
          path: path.join(OUT_DIR, `${p.name}-${viewport.name}.png`),
          fullPage: true,
        });
      } catch (err) {
        console.error(`  FAILED: ${err}`);
      }
    }

    await ctx.close();
  }

  await browser.close();
  console.log(`\nDone — screenshots saved to ${OUT_DIR}`);
})();
