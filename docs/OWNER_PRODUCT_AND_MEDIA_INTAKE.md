# Stroom Owner Product and Media Intake

Use this worksheet before adding a product to Shopify. It prevents incomplete
product records, false availability claims, and avoidable follow-up questions.

## One product at a time

Copy this block for each product the owner wants to sell.

```text
Product name:
Brand:
Manufacturer part number:
Stroom SKU:
Supplier / drop-ship source:
Product type: Engine / Fuel / Drivetrain / Electronics / Safety / Merchandise
Compatible platform(s): GM LS / Gen III Hemi / other
Racing use case: Street/Strip / Index / No Prep / other

Retail price:
MAP or pricing restrictions:
Variant options: e.g. size, color, engine generation, finish
Supplier SKU for each variant:
Availability: available / announced / unavailable
Inventory method: supplier feed / manually confirmed / stocked by Stroom
Typical lead time:

Fitment application:
Required supporting parts or changes:
Known incompatibilities:
Manufacturer source or evidence link:
Warranty:
Returns exception, if any:

Shipping weight:
Shipping dimensions:
Ship-from location:
Supplier order-routing process:

Product description source or approved copy:
Approved product photos or media link:
Who owns or licensed the media:
Required image alt text:
```

## First Shopify-ready batch

These reference products already have a storefront template. They are not ready
to sell until the owner completes the fields above and supplies approved media.

| Product | Manufacturer part number | Missing to sell |
| --- | --- | --- |
| PAC 1218 Beehive Valve Springs | `PAC-1218-16` | Price, supplier source, variants, shipping, approved media, final fitment confirmation |
| BTR Stage 2 Turbo Camshaft V2 | `BTR-TURBOSTG2` | Price, supplier source, variants, shipping, approved media, final fitment confirmation |
| BTR Equalizer 1 Intake Manifold | `IMA-01` | Price, supplier source, variants, shipping, approved media, final fitment confirmation |
| Holley Terminator X for GM LS1/LS6 | `550-909T` | Price, supplier source, variants, shipping, approved media, final fitment confirmation |
| Stroom license plate frame | Pending owner SKU | Price, inventory, shipping, approved product photo, variant decision |

## Media approval rules

- A source photo is not automatically a product photo. Confirm what it shows and whether Stroom has permission to use it.
- Product images should show the actual sellable product, not only a related vehicle or build.
- Build/context images can support Guides, Builds, platform pages, and editorial sections once the owner confirms the vehicle and components pictured.
- Keep original source files unchanged. Add named, web-optimized derivatives only after a placement has been selected.
- Record a descriptive alt text for every image; name the visible subject, not its visual treatment.

## What happens after this is complete

1. The product is entered as a Shopify draft with its images, variants, pricing, and fitment fields.
2. The storefront renders it in the existing product template.
3. A preview confirms media crop, product facts, cart behavior, and schema before publishing.
4. Publishing to the Headless channel triggers a Vercel update, which republishes the same facts to the website, sitemap, JSON-LD, `llms.txt`, and WebMCP catalog.
