# Stroom Performance

Astro site for **Stroom Performance**, a direct-to-consumer performance-parts store for GM LS and Gen III Hemi builds. Shopify will own commerce while this frontend owns product discovery, fitment guidance, guides, and builds.

**Live:** https://stroom-performance.vercel.app (production, deploys automatically on push to `main`)
**Repo:** github.com/landon31185/stroom-performance

## Current strategic frame - read this first

The site is consumer-facing. Four verified GM LS reference products live in `src/content/products/`; Gen III Hemi specifics are pending. Do not invent price, inventory, shipping, or compatibility. Until Shopify is connected, product pages must clearly remain `coming-soon` while still providing useful specifications and fitment context.

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

**The current logo, favicon, and OG image are temporary** - a simple geometric badge, not Jake's final mark. Replace them completely when final identity assets arrive.

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
- Shopify admin setup: Headless channel, payment provider, shipping profiles, taxes, policies, checkout branding, and new Customer Accounts
- Real logo SVG + exact sampled orange hex (see Brand section above)
- Fitment model: application+altitude (recommended, Stroom-native) vs. YMME — not yet decided
- Whether Build / Data Log become first-class objects (currently leaning Guides-first)

## Unblocked next work

- Connect the Shopify Storefront API and map live variants, pricing, and availability. The persistent cart UI and secure Shopify-checkout handoff are already implemented and remain hidden until credentials exist.
- Add client-confirmed Gen III Hemi products and fitment details.
- Add product photography without changing product URLs or the content-object model.
- Expand SEO/GEO content around the verified product and platform taxonomy.

## Commerce boundary

Astro owns product discovery and the cart drawer. The server-side `/api/cart` endpoint keeps Shopify's secret-bearing cart ID in an HttpOnly cookie and supports add, update, remove, and checkout actions. Shopify owns checkout, payments, shipping, taxes, discounts, orders, and sensitive customer data; never build custom card-entry fields into this frontend.

To activate commerce, install Shopify's Headless channel, set the Storefront API environment variables in Vercel, publish products to that channel, and configure payments/shipping/taxes/policies in Shopify admin. Enable Shopify's new Customer Accounts and set `PUBLIC_SHOPIFY_ACCOUNT_URL` when its hosted account URL is ready. A fully custom account dashboard can later use the Customer Account API, but is intentionally deferred from launch.
