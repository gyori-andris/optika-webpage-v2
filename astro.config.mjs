// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // output: 'static' is the default in Astro v6 and now supports per-route SSR
  // via `export const prerender = false`. The Cloudflare adapter handles SSR routes
  // (Keystatic UI + contact form API) as Cloudflare Workers.
  adapter: cloudflare(),
  integrations: [keystatic(), react()],
});