# Stroom Performance — Claude Code Context

Read `README.md` first — it has the full stack, brand token architecture, and current blockers. This file is the decision log and things that are easy to get wrong.

## Quick orientation

- Live: stroom-performance.vercel.app, deploys on push to `main` (Vercel git-connected)
- Strategic frame: **wholesaler pitch, not a live store.** No cart/checkout. Don't build toward one unless explicitly asked.
- Brand and logo are placeholders by design — see README's Brand section before touching colors.

## Decision log

- **2026-07-17 — Fork audit run and clean.** This project started as a fork of the Wholesome Healthcare Astro stack. Confirmed 0 old-brand references (`grep -ri "wholesome|carli|healthcare"` across `src/`, `public/`, config files, all clean) before any feature work.
- **2026-07-17 — Chose "04 Moto Stencil" brand direction** over a runner-up "Modernist / Mono Red" concept. Reasoning: closer to Jake's existing YouTube brand identity, protects his following.
- **2026-07-17 — `@astrojs/vercel` repinned from `^11.0.0` to `^10.0.8`.** The scaffold had 11.x, which requires Astro 7; the project is on Astro 6. Don't bump one without the other.
- **2026-07-17 — Added a `vite` override in `package.json`.** Without it, npm resolves two different Vite majors across `astro`/`@astrojs/react`/`@tailwindcss/vite`, and the Tailwind Vite plugin fails at build time. If you ever remove this override, re-verify `npm run build` and `npm ls vite` (should show one version, not a split tree).
- **2026-07-17 — Disabled `devToolbar` in `astro.config.mjs`.** It 504s in dev under the current Astro/Vite pairing. Dev-only; production build is unaffected. Fine to re-enable and retest after a future framework bump.
- **2026-07-17 — `ogImageUrl` logic fixed in `BaseLayout.astro`.** It previously always built a dynamic `/api/og` URL regardless of the `ogImage` prop, so `public/og-default.svg` was unreachable dead code. Now a page can pass `ogImage="/og-default.svg"` (or any relative/absolute path) to opt out of the dynamic per-page OG image.
- **2026-07-17 — Fitment model still undecided.** Recommendation on record is application+altitude (Stroom-native) with a light YMME backbone, but Jake hasn't confirmed. Don't hardcode either model into the schema/content collections until it's settled — `src/content.config.ts` and product frontmatter should stay loose here.

## Common failure mode to avoid

Don't reference `--color-ink` directly in a component for text/icon color — it's the *dark primitive*, not "the ink-colored text token." Use `--color-ink-text` (light text on the dark-forward base) or `--color-accent-ink` (required dark text on solid orange). This exact mistake caused a real near-invisible mobile-nav close icon once already.
