# Stroom Shopify CMS Setup

Shopify is the merchant-facing source of truth. Astro renders the storefront and
falls back to `src/content` only until the Shopify catalog is populated.

## 1. Store and API access

1. Create or open the Stroom Shopify store.
2. Install Shopify's **Headless** sales channel.
3. Create Storefront API credentials with public read access for products,
   collections, blogs, articles, metafields, and metaobjects.
4. Add the values from `.env.example` to local development and Vercel.
5. Set `PUBLIC_SITE_URL` to the final canonical domain before indexing.

The Storefront token is read-only. Admin API credentials are not used by the
website and must never be exposed to the browser.

## 2. Product metafields

Create these product definitions in **Settings → Custom data → Products**.
Use namespace `stroom` exactly so the existing GraphQL queries resolve them.

| Key | Shopify type | Required | Purpose |
| --- | --- | --- | --- |
| `system` | Single-line text | Yes | `engine`, `fuel`, `drivetrain`, `electronics`, or `safety` |
| `platforms` | List of single-line text | Yes | Start with `gm-ls`; later add `gen3-hemi` |
| `race_styles` | List of single-line text | No | `street-strip`, `index`, or `no-prep` |
| `status` | Single-line text | Yes | `draft`, `announced`, `available`, or `unavailable` |
| `specs` | List of single-line text | No | Scannable, manufacturer-verified specifications |
| `fitment_application` | Multi-line text | Yes before sale | Plain-language compatible application |
| `fitment_required_mods` | List of single-line text | No | Required supporting parts or changes |
| `fitment_confidence` | Single-line text | Yes | `verified-on-car`, `vendor-stated`, or `inferred` |
| `fitment_notes` | Multi-line text | No | Combination-dependent caveats |
| `featured` | True/false | No | Homepage merchandising flag |
| `sort_order` | Integer | No | Lower values appear first |

Product status controls publishing language. A product receives an Add to Cart
action and Offer schema only when it is `available`, has a live variant and
price, and Shopify reports it as available for sale.

## 3. Collections and editorial content

- Create automated collections for each system and platform using the product
  metafields above. Collection handles should match the website slugs.
- Create a Shopify blog with handle `guides`. Published articles from that blog
  automatically replace the local guide fallback.
- Create a merchant-owned metaobject definition with type `stroom_build` and
  public Storefront access. Fields: `title`, `description`, `body`, `vehicle`,
  `platforms`, `race_styles`, `parts_used`, `image_url`, `image_alt`, and
  `video_url`. List fields use lists of text; `parts_used` stores product handles.
- Fitment starts as product metafields for a manageable v1. Promote it to a
  reusable `stroom_fitment` metaobject when several products share an exact
  application and the owner needs one edit to update all of them.

## 4. Initial product migration

Enter the four verified GM LS products as **Draft** Shopify products first:

- PAC 1218 Beehive Valve Springs
- BTR Stage 2 Turbo Camshaft V2
- BTR Equalizer 1 Intake Manifold
- Holley Terminator X for GM LS1/LS6

Copy only manufacturer-confirmed facts. Add an original or licensed product
image with descriptive alt text. Keep status `announced` until Stroom has a real
price, supplier process, shipping policy, and sellable variant.

## 5. Publishing and rebuilds

Create a Vercel Deploy Hook and save it as `VERCEL_DEPLOY_HOOK_URL`. Register
`https://<production-domain>/api/shopify-publish` as a Shopify webhook endpoint
for product, collection, article, and metaobject create/update/delete topics.
Use the Shopify webhook signing secret as `SHOPIFY_WEBHOOK_SECRET`. The endpoint
validates Shopify's HMAC before requesting a new Vercel deployment.

## Owner workflow

1. Add or update the product in Shopify.
2. Complete status, system, platform, specifications, and fitment metafields.
3. Add price and inventory only after supplier and fulfillment details are real.
4. Preview the Shopify record, then publish it to the Headless channel.
5. Wait for the Vercel rebuild and verify the product page and checkout.
6. Add a Guide or Build when it materially helps a customer select or install it.

Do not duplicate products in Markdown after Shopify goes live. The local files
remain emergency/demo fallback content, not a second owner workflow.

## SEO and AI publication model

The owner edits facts once in Shopify. A successful Shopify webhook triggers a
Vercel rebuild, and the Astro catalog layer republishes those facts everywhere:

| Surface | Shopify-managed values | Code-managed policy/template |
| --- | --- | --- |
| Product pages | Product, variant, media, price, inventory, status, fitment fields | Layout, canonical rules, checkout eligibility |
| JSON-LD | Product facts, article facts, price, availability | Schema types and the rule that Offer requires a purchasable variant |
| Sitemap | Public product, guide, build, platform, and collection URLs | Empty/draft exclusion rules |
| `llms.txt` and `llms-full.txt` | Current public catalog, Guides, Builds, status, fitment | Format, disclaimers, machine-interface documentation |
| WebMCP | Current products, fitment, populated facets, and Guides | Tool definitions, filters, and compatibility disclaimer |
| Open Graph and metadata | Page title, summary, and product image | Brand treatment, canonical domain, fallback image |
| `robots.txt` | Nothing owner-edited | Crawler access and generated sitemap location |

The generated public catalog at `/api/ai-catalog.json` is the bridge used by
WebMCP. Draft products are excluded. The two `llms` files and the catalog JSON
are generated during the same deployment as the storefront, so they should not
be edited manually.
