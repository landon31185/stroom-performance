# Stroom Performance

This file complements `README.md`. Read the README for setup, stack, and user-facing project context. Read this file for local decisions, guardrails, and handoff pointers.

## First Read

1. `README.md`
2. `src/lib/site.ts`
3. `src/styles/global.css`
4. `src/pages/wholesale.astro`
5. `astro.config.mjs`

## Project State

- Site is live in production at `stroom-performance.vercel.app`
- Repo deploys from `main` via Vercel
- Current strategy is wholesaler-first credibility, not live ecommerce
- Product/catalog content is illustrative until Jake provides real supplier/store inputs

## Decision Log

### 2026-07-17: Strategic frame

- Treat the site as a pitch to wholesalers first
- Do not build checkout/cart flows yet
- `/wholesale` is the highest-priority conversion path

### 2026-07-17: Brand system

- Chosen direction is `04 Moto Stencil`
- Brand primitives live at the top of `src/styles/global.css`
- Semantic tokens should be consumed by components; do not spread raw hex values through the app
- Text on solid orange must use the dark ink color, not white

### 2026-07-17: OG/image token duplication is intentional

- `src/pages/api/og.ts` cannot read CSS variables
- Keep `src/lib/site.ts` `brandColors` aligned with `src/styles/global.css`

### 2026-07-17: Dependency constraints

- Keep `@astrojs/vercel` on `10.x` while Astro stays on `6.x`
- Keep the single-version Vite override in `package.json`
- Leave Astro dev toolbar disabled unless you are explicitly re-testing that version pairing

### 2026-07-18: Homepage art direction

- Primary visual anchor is `Locomotive`; `Obys` is only an accent
- Homepage signature is the timing-board / run-sheet hero, not a generic ecommerce hero
- Shared chrome and cards should reinforce that same motorsport/editorial system

### 2026-07-18: React usage

- React is allowed where it adds real experiential value without hurting semantics
- Current use is decorative only: `src/components/HeroAtmosphere.tsx`
- Keep critical SEO/AI/OG/schema content in Astro/HTML, not inside client-only React islands

## High-Risk Mistakes

- Do not treat placeholder products as a real catalog
- Do not introduce a second source of truth for brand colors
- Do not change the domain constants unless the real domain is confirmed
- Do not wire Shopify until the real store domain and Storefront token exist

## Open External Dependencies

Blocked on Jake:

- Real domain
- Real logo SVG and final sampled orange hex
- Shopify store domain and Storefront token
- Fitment model decision: app+altitude vs YMME
- Decision on whether Build / Data Log become first-class objects

## Good Next Work

- Wire the wholesale form to a real backend
- Build the SEO/GEO content cluster now that the site exists
- Replace placeholder brand assets when Jake provides finals
- Bring collection, product, and about pages up to the new homepage / wholesale visual level

## File Pointers

- Site constants and metadata: `src/lib/site.ts`
- Global brand tokens and layout primitives: `src/styles/global.css`
- Wholesale funnel and current backend gap: `src/pages/wholesale.astro`
- OG image generator: `src/pages/api/og.ts`
- Astro/Vercel/dev-toolbar config: `astro.config.mjs`
- Shopify integration stub: `src/lib/shopify.ts`

## When Updating This File

- Add short dated decisions
- Prefer pointers over explanations
- Do not duplicate setup instructions or route inventory from `README.md`
