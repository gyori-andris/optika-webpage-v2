// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';

export default defineConfig({
  // Static by default (Astro v6). Per-route SSR for Keystatic UI + contact form
  // via `export const prerender = false`. Node adapter runs as a standalone server.
  adapter: node({ mode: 'standalone' }),
  integrations: [keystatic(), react()],
});