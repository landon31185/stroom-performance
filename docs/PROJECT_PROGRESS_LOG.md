# Stroom Performance Progress Log

**Project:** Stroom Performance  
**Last updated:** 2026-07-31 18:22 PDT  
**Current phase:** Shopify owner onboarding and first real-product launch

## Done

- Built and deployed the custom Astro/Vercel direct-to-consumer storefront.
- Established the DTC information architecture around Products, Variants, Platforms, Systems, Fitment, Guides, Builds, Cart, Order, and Customer.
- Reworked the homepage and mobile hero into a media-led editorial composition with accessible motion fallbacks.
- Removed wholesale-oriented messaging and placeholder design clutter.
- Added initial GM LS reference products with honest `announced` states, fitment, specifications, and technical-image fallbacks.
- Built product pages that support Shopify multi-image galleries, variants, price changes, availability, cart, and hosted checkout handoff.
- Added SEO, canonical metadata, sitemaps, robots, JSON-LD safety rules, `llms.txt`, AI catalog output, and WebMCP surfaces.
- Added an owner-source media library and reviewed each supplied image for future editorial use.
- Added owner-friendly product/media intake documentation and linked it from the Shopify setup guide.

## Ready now

- The storefront can render real Shopify product data once the Headless channel and Storefront API credentials are connected.
- The product template can handle actual product images, variants, pricing, availability, fitment, and related products.
- The demo cart becomes real Shopify cart and hosted checkout once the store is connected.
- Existing GM LS reference pages remain safe previews until real product facts are supplied.

## Next

1. Gain Shopify collaborator access or create the Stroom Shopify store.
2. Enable the Shopify Headless sales channel and create Storefront API credentials.
3. Have the owner complete one product block in [`OWNER_PRODUCT_AND_MEDIA_INTAKE.md`](./OWNER_PRODUCT_AND_MEDIA_INTAKE.md).
4. Enter that product as a Shopify draft, including approved media, price, SKU, supplier/fulfillment, variants, and fitment.
5. Connect Shopify environment variables in Vercel and test the first product page, cart, and Shopify checkout.
6. Confirm shipping, returns, warranty, support email, taxes, and drop-ship workflow before publishing products for purchase.
7. Replace technical placeholders with approved product photography; use the source-media inventory only for build and editorial context.
8. Confirm the production domain, then complete Search Console, Bing, GA4, Merchant Center, and final launch QA.

## Owner inputs still needed

- Shopify access and the final production domain.
- A confirmed supplier/drop-ship process.
- For each product: exact title, price, SKU, supplier SKU, variants, stock or lead time, shipping details, approved media, fitment, warranty, and return constraints.
- Explicit approval for any supplied build or track photo to appear publicly.

## Key references

- [`SHOPIFY_CMS_SETUP.md`](./SHOPIFY_CMS_SETUP.md) - technical Shopify configuration
- [`OWNER_NEXT_STEPS.md`](./OWNER_NEXT_STEPS.md) - sendable owner launch instructions
- [`OWNER_PRODUCT_AND_MEDIA_INTAKE.md`](./OWNER_PRODUCT_AND_MEDIA_INTAKE.md) - owner product worksheet
- [`OWNER_MEDIA_INVENTORY.md`](./OWNER_MEDIA_INVENTORY.md) - source-photo subjects and future roles
- [`SEO_LAUNCH_CHECKLIST.md`](./SEO_LAUNCH_CHECKLIST.md) - final search and launch validation

## Recent commits

| Commit | What changed |
| --- | --- |
| `b5c9b1e` | Added owner product/media intake and media inventory |
| `0140d79` | Added owner-supplied source-media library |
| `edfc712` | Prepared product pages for a live Shopify catalog |

## Update rule

After each material working session, add one dated entry under this heading:

### Updates

- **2026-07-31 18:22 PDT** - Created this repository-level progress log to track completed work, owner dependencies, and the Shopify activation sequence.
