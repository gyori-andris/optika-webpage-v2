# Nádor Optika — Astro + Keystatic rewrite

## Project purpose

Replacement for the WordPress/Elementor site at `optika.andris.boo`.
Same visuals, but static-first, Git-backed CMS, and deployable to Cloudflare Pages.
The old WordPress site lives in `/Users/andris/Documents/optika_webpage/` and on GitHub at
`gyori-andris/optika-webpage` (keep it untouched — reference only).

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Astro 6 (static default, per-route SSR via `export const prerender = false`) |
| Adapter | `@astrojs/node` (standalone) — runs as a Node.js HTTP server |
| CMS | Keystatic (git-backed, GitHub OAuth) |
| Styling | Plain CSS with design tokens in `src/styles/tokens.css` |
| Contact form | `src/pages/api/contact.ts` — wire up Resend (API key via env var `RESEND_API_KEY`) |
| Package manager | pnpm (`~/.local/bin/pnpm`) |
| Deploy target | Podman + systemd in LXC CT 117 (next to WordPress), port 4321 |
| Container image | `git.andris.boo/gyori-andris/optika-webpage-v2:latest` (Forgejo registry) |
| CI/CD | Forgejo Actions (`.forgejo/workflows/docker.yaml`) — builds + pushes on push to main |

## Commands

```bash
~/.local/bin/pnpm dev          # dev server (localhost:4321)
~/.local/bin/pnpm build        # production build
~/.local/bin/pnpm preview      # preview the build locally
npx playwright install chromium  # one-time, already done
```

## Remotes

| Name | URL |
|------|-----|
| `origin` | `ssh://git@git.andris.boo:222/gyori-andris/optika-webpage-v2.git` (Forgejo) |
| `github` | `git@github.com:gyori-andris/optika-webpage-v2.git` |

Push to both after changes:
```bash
git push origin main && git push github main
```

## Content model (Keystatic)

Singletons: `settings` (site name, phone, email, address, map URL), `openingHours`
Collections: `pages`, `services`, `teamMembers`, `testimonials`

Content lives in `src/content/`. Images for team in `public/images/team/`.

## Design tokens

See `src/styles/tokens.css`. Import in any Astro component:
```astro
<style>
  /* tokens are global — no import needed once Layout.astro links them */
  h1 { font-family: var(--font-heading); color: var(--color-primary); }
</style>
```

Add `<link rel="stylesheet" href="/src/styles/tokens.css" />` to `Layout.astro`
(or `@import` in a global stylesheet slot).

Colors: `--color-primary` #2A367A navy · `--color-secondary` #FF002C red · `--color-accent` #05C18E green
Fonts: Inter (headings) · Heebo (body)

## Migration status

| Task | Status |
|------|--------|
| Project scaffold + remotes | Done |
| Design tokens extracted | Done |
| Keystatic config | Done |
| Layout.astro shell | Done |
| Contact form API route (stub) | Done — needs Resend wired up |
| `src/styles/tokens.css` | Done |
| Screenshot script (`scripts/screenshot.ts`) | Done — blocked until homeserver01 recovers |
| Media migration (481 images) | Pending — copy from optika_webpage/wordpress/wp-content/uploads/ |
| Shared components (Header, Footer) | Pending |
| Home page | Pending |
| Services pages (6) | Pending |
| About / Team page | Pending |
| Contact page | Pending |
| Podman + systemd deployment | Pending — needs CT 117 reachable + Forgejo CI configured |
| Keystatic GitHub OAuth | Pending — needs OAuth app configured on github.com |
| Forgejo `REGISTRY_TOKEN` secret | Pending — create token in Forgejo, add to repo secrets |

## Media migration (when ready)

```bash
rsync -av \
  /Users/andris/Documents/optika_webpage/wordpress/wp-content/uploads/2023/10/ \
  /Users/andris/Documents/optika-webpage/public/images/uploads/
```

481 images, ~35 MB total. Astro's `<Image>` component handles optimisation.

## Screenshot capture (when homeserver01 is back)

```bash
cd /Users/andris/Documents/optika-webpage
npx ts-node scripts/screenshot.ts
# or: node --loader ts-node/esm scripts/screenshot.ts
```

Output: `docs/screenshots/{page}-{desktop,mobile}.png`

## Notes

- `output: 'hybrid'` was removed — invalid in Astro v6 (static is default; use `prerender = false` per-route)
- Keystatic emits a `virtual:keystatic-config` pre-bundle warning on dev server start — harmless
- WordPress site (homeserver01 + CT 117) is currently unreachable (100% packet loss as of 2026-04-12)
