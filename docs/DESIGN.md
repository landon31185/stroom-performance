# Stroom Performance Design System

This is the implementation contract for people and agents working on the Stroom storefront. It records the current production system, not a generic future redesign.

## Product and visual thesis

Stroom is a premium direct-to-consumer performance-parts storefront. The design should feel like a precise technical catalog with real racing proof: quiet black-and-white surfaces, one controlled warm red-orange action color, strong display typography, fine orange track lines, and media that does real explanatory work.

Do not make a generic startup, agency, crypto, or dashboard interface. Preserve the OOUX relationships and make customer decisions easier: platform, system, fitment, guidance, and build context.

## Source of truth

- Global implementation: `src/styles/global.css`
- Shared shell and loaded fonts: `src/layouts/BaseLayout.astro`
- Current project record: Obsidian `Stroom Performance - Project Status and Next Steps`
- Agent design direction: `.codex/skills/stroom-design-direction/SKILL.md` in the user environment

When the implementation and an older design note disagree, follow the implementation and update this document plus the project status note.

## Foundations

### Color

Use semantic variables in components. Do not introduce literal colors into new component styles unless a reviewed media treatment requires one.

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Base dark | `--color-base` | `#16171a` via `--color-ink` | Main canvas and dark sections |
| Surface | `--color-surface` | `#1d1e22` | Panels and cards |
| Raised surface | `--color-surface-2` | `#24262b` | Nested or raised areas only |
| Paper | `--color-paper` | `#f5f4f1` | Light editorial/catalog sections |
| Primary text on dark | `--color-ink-text` | `#f5f4f1` | Main dark-theme text |
| Secondary text | `--color-ink-muted` | `#85868c` | Supporting copy, never essential text alone |
| Divider | `--color-line` | `#303238` | Hairline borders and grid rules |
| Action accent | `--color-accent` | `#eb5f3a` | Primary CTA, links, active state, emphasis |
| Accent hover | `--color-accent-hi` | `#f0824f` | Interactive hover only |
| Accent on light | `--color-orange-ink` | `#5b2014` | Small text and links on paper |
| Accent text on solid accent | `--color-accent-ink` | `#16171a` | Required text/icon color on solid CTA |

Accessibility rule: text on solid orange is always dark ink, never white. The red-orange is reserved for action and meaningful state; it is not a general headline fill or decorative wash.

### Typography

| Role | Current production family | Weights / behavior | Use |
| --- | --- | --- | --- |
| Display | Archivo | `600–900`, width `100–125`; uppercase, tight tracking | H1, section titles, purchase controls |
| Reading | Hanken Grotesk | `400–700`; relaxed line height | Body, product descriptions, navigation |
| Utility | SF Mono / Roboto Mono fallback | Tabular numbers where needed | SKU, technical values, low-emphasis system data |
| Wordmark | SVG asset | Not live type | Brand lockup only |

Production font loading is in `BaseLayout.astro`. Archivo and Hanken are serviceable current implementation fonts, but they are not the final premium type recommendation. Do not replace them without a licensed-font decision and visual QA. The preferred future direction is a compressed editorial display face with a calmer neo-grotesk body and mono companion.

| Type token/class | Size | Leading | Tracking | Use |
| --- | --- | --- | --- | --- |
| `.heading-hero` | `clamp(2.75rem, 7vw, 5.5rem)` | `0.98` | `-0.02em` | One thesis per page |
| `.heading-section` | `clamp(1.75rem, 4vw, 2.75rem)` | `1.05` | `-0.01em` | Section titles |
| `.heading-card` | `clamp(1.125rem, 2.5vw, 1.375rem)` | `1.2` | default | Product and content-card titles |
| `.body-large` | `clamp(1rem, 1.5vw, 1.1875rem)` | `1.7` | default | Introductory copy |
| `.label-small` | `0.75rem` | inherited | `0.18em`, uppercase | Real state, provenance, or navigation labels only |
| `.readout` | context-specific | context-specific | `0.02em` | Actual technical data only |

Never add small uppercase eyebrow text merely to make a section feel designed. Labels must communicate a real product, fitment, navigation, availability, or provenance attribute.

### Spacing and layout

All new or substantially revised UI should use this scale. Existing raw values can migrate gradually; do not create a second arbitrary scale.

| Token | Value | Typical role |
| --- | --- | --- |
| `--space-1` | `4px` | Fine optical adjustment only |
| `--space-2` | `8px` | Icon/label gaps |
| `--space-3` | `12px` | Compact internal gaps |
| `--space-4` | `16px` | Default component gap |
| `--space-5` | `20px` | Phone page gutter |
| `--space-6` | `24px` | Tablet gutter / compact panel padding |
| `--space-8` | `32px` | Card padding / component separation |
| `--space-10` | `40px` | Small section gap |
| `--space-12` | `48px` | Standard section padding on small screens |
| `--space-16` | `64px` | Standard desktop section padding |
| `--space-20` | `80px` | Major editorial break |
| `--space-24` | `96px` | Large desktop section spacing |
| `--space-32` | `128px` | Hero/major compositional whitespace |

Use `--layout-content-max: 76rem` for the standard `.wrap` container. Phone gutters are `1.25rem`; `640px+` gutters are `1.5rem`. Full-bleed media can escape the container only when it is intentional and tested on mobile.

### Shape, borders, and elevation

- Default corner radius: `--radius-none` / `0`. Avoid rounded cards and pills except intentional utility controls such as carousel arrows.
- Default border: `--border-hairline solid var(--color-line)`.
- Elevation comes from surface contrast, media crop, whitespace, and one hairline. Do not add soft drop shadows.
- The cut-corner primary CTA is reserved for the primary action. Secondary actions are rectangular outlines.
- Do not add a decorative left strip, fake data blocks, or unrelated HUD ornaments.

## Components and interaction rules

| Element | Required treatment |
| --- | --- |
| Primary CTA | Orange fill, dark text, Archivo, cut corner, action verb; one primary action per decision area |
| Secondary CTA | Transparent, hairline outline, paper text on dark / ink on light |
| Text link | Warm red-orange; underline when inside reading copy; visible focus state |
| Card | Surface or paper field, hairline border, no radius; hover moves up at most `2px` and can gain accent border |
| Product media | Real photo/video carries the visual weight; use a truthful fallback, not a fake product image |
| Track-line atmosphere | Fine, low-contrast orange spatial overlay behind content/media; never cross key reading paths at harmful contrast |
| Header | Quiet, utility-oriented, fixed; do not crowd it with labels or badges |
| Footer | Strong closing composition, but utility links remain readable and grouped by a real task |

## Motion

Use motion to reveal hierarchy or product/racing context, never as decoration.

| Token | Value | Use |
| --- | --- | --- |
| `--duration-fast` | `150ms` | Button/link feedback |
| `--duration-standard` | `200ms` | Card, border, and color state |
| `--duration-slow` | `320ms` | Intentional rails/media transforms |
| `--ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` | Editorial transforms |

Existing patterns: restrained `translateY(-1px)` CTA response, `translateY(-2px)` card response, rail motion, and viewport reveals. Maintain the existing `prefers-reduced-motion: reduce` behavior: no reveals, no transitions, no view transitions, and poster-first video fallback.

Do not introduce GSAP or complex scroll choreography without a discrete user-facing purpose, a mobile behavior, a reduced-motion path, and performance validation.

## Responsive contract

| Range | Composition rule |
| --- | --- |
| `<640px` | `1.25rem` gutters; single decision path; no overlap used only to preserve a desktop composition |
| `640–959px` | `1.5rem` gutters; two-column layouts are allowed only when each reading column remains viable |
| `960px+` | Editorial whitespace and multi-column scanning; keep the primary reading path clear |
| `1024px+` | Desktop header treatment; mobile navigation control is removed |

Mobile is an intentional composition. For heroes, text leads, then CTA, then controlled media preview; no card may cover the headline or media subject. Test at `375x812`, `390x844`, `430x932`, `768x1024`, and `1440x900` for material layout changes.

## Agent guardrails

1. Start with the page job and the buyer decision, then choose a component pattern.
2. Reuse semantic color, type, spacing, and motion tokens. Add a token only when it will serve multiple components.
3. Favor whitespace, type scale, real media, and hairlines before a new card, label, badge, or effect.
4. Do not alter SEO, OOUX relationships, schema, product truthfulness, or accessibility while making visual work.
5. Do not use `announced`, placeholder, or vendor-reference content to imply inventory, price, or availability.
6. Run `npm run build` and inspect desktop plus mobile before committing visual work.
7. Update this file and the Obsidian design-system artifact when a shared visual decision changes.

## Deprecated or review-required patterns

- The early `.tag` and `.altitude-panel` patterns are implementation legacy. Use only for meaningful state/fitment content, never decorative labels.
- Do not create small labels above large headlines by default.
- Do not use peach/orange display headlines, generic gradient overlays, glassmorphism, or rounded dashboard modules.
- Do not make a typeface change without license confirmation and visual review.
