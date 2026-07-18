# Stroom Performance

Astro site for **Stroom Performance** — Jake's high-altitude No-Prep / Index drag racing performance-parts store (Shopify drop-ship). The niche moat is **fitment/altitude awareness**: whether a part actually works at a given density altitude (DA). Nobody else in this space answers that question.

**Live:** https://stroom-performance.vercel.app (production, deploys automatically on push to `main`)
**Repo:** github.com/landon31185/stroom-performance

## Current strategic frame — read this first

The site is currently a **pitch to win wholesalers, not a live store**. There is no product catalog or checkout yet — commerce is "coming soon." The goal right now is credibility: brand, the existing YouTube following, and the altitude-fitment differentiator. `/wholesale` is the dealer-inquiry funnel and is the most important page on the site today.

Do not add checkout/cart functionality or treat the `src/content/products/*` files as a real catalog — they're placeholder copy demonstrating what a listing *will* look like once supplier accounts open.

## Stack

- Astro 6 (static output, Vercel adapter, `server` build mode)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React 19 (minimal use, via `@astrojs/react`)
- Content collections for products/guides/builds/categories (`src/content/`)
- `@vercel/og` for dynamic per-page OG images (`src/pages/api/og.ts`)

```bash
npm install
npm run dev      # localhost:4321
npm run build    # verify before pushing — see gotchas below
```

## Brand: "04 Moto Stencil"

Dark badge + orange accent slash. Authentic motorsport/decal energy, dark-forward chrome with a single orange accent.

**The current logo, favicon, and OG image are placeholders** — a simple geometric badge, not Jake's real mark. Expect these to be replaced wholesale. Don't over-invest polishing them further.

### Token architecture (why it's split this way)

`src/styles/global.css` uses two layers on purpose:

1. **Primitives** — the raw palette: `--color-ink #16171a`, `--color-paper #f1efec`, `--color-orange #e8672e`, `--color-orange-ink #b8480e`, `--color-muted #8b8b8b`. Swapping the brand later means editing only these five lines.
2. **Semantic roles** — what components actually consume: `--color-base`, `--color-surface`, `--color-ink-text`, `--color-accent`, etc. No component should reference a primitive directly, with two intentional exceptions (`--color-base` and `--color-accent-ink`, which are tied to the ink primitive by brand rule regardless of theme).

This split is what makes a future light mode cheap: a `:root[data-theme="light"] { --color-base: var(--color-paper); ... }` override block only needs to touch the semantic layer.

**Hard rule:** text on solid orange must be dark ink, never white/paper. Black-on-orange ≈ 6.4:1 (AA pass); white-on-orange ≈ 3.3:1 (fails). This is why `--color-accent-ink` exists and why `.btn-primary`, `::selection`, `.steps-list`, and the OG generator all use it explicitly. If you add a new solid-orange-background element, use `--color-accent-ink` for its text, not `--color-ink-text`.

Colors are duplicated in `src/lib/site.ts` (`brandColors`) because `@vercel/og` (Satori) can't read CSS custom properties — `api/og.ts` imports from there instead of hardcoding hex. **If you change the palette, update both `global.css` primitives and `site.ts`'s `brandColors` together.**

## Known dependency gotchas (already fixed once — don't reintroduce)

- `@astrojs/vercel` must stay on the `10.x` line. `11.x` requires Astro 7; this project is pinned to Astro 6. If you bump Astro to 7, you can bump the adapter to match — do both together.
- `package.json` has a `"vite"` override pinning a single Vite major. Without it, `@astrojs/react` and `@tailwindcss/vite` can resolve a different Vite version than Astro's own, which breaks `@tailwindcss/vite` at build time with a cryptic rolldown error. If `npm run build` ever fails with `Missing field tsconfigPaths on BindingViteResolvePluginConfig`, check `npm ls vite` for a split tree first.
- The Astro dev toolbar is disabled in `astro.config.mjs` (`devToolbar: { enabled: false }`) — it 504s under this version pairing in dev. Dev-only, doesn't affect the production build. Safe to re-enable and test after a future Astro/Vite bump.

## What's blocked on Jake (owner decisions/assets, not code)

- Real domain — `site.ts` and `astro.config.mjs` still point at a placeholder `stroomperformance.com`
- Shopify store domain + Storefront API token — integration code exists in `src/lib/shopify.ts`, nothing to point it at yet
- Real logo SVG + exact sampled orange hex (see Brand section above)
- Fitment model: application+altitude (recommended, Stroom-native) vs. YMME — not yet decided
- Whether Build / Data Log become first-class objects (currently leaning Guides-first)

## Unblocked next work

- Wire the wholesale inquiry form to a real backend — it currently falls back to a `mailto:` link. See the TODO comment in `src/pages/wholesale.astro`.
- SEO/GEO content cluster — was blocked on the site existing, now unblocked.
- `public/llms.txt`, `llms-full.txt`, and the WebMCP tool script (`public/scripts/webmcp.js`) exist and are AI-crawler/agent-ready, but reflect the placeholder catalog — revisit once real products/domain exist.
