import type { APIRoute } from 'astro';
import { getCatalogProducts, formatMoney, statusLabels } from '../lib/catalog';
import { getBuilds, getGuides } from '../lib/editorial';
import { site } from '../lib/site';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [products, guides, builds] = await Promise.all([getCatalogProducts(), getGuides(), getBuilds()]);
  const publicProducts = products.filter((product) => product.status !== 'draft');
  const productLines = publicProducts.map((product) =>
    `* [${product.title}](/products/${product.slug}) — ${product.manufacturerPartNumber ? `${product.manufacturerPartNumber}; ` : ''}${statusLabels[product.status]}${product.price ? ` at ${formatMoney(product.price)}` : ''}. ${product.summary}`,
  ).join('\n');
  const guideLines = guides.map((guide) => `* [${guide.title}](/guides/${guide.slug}) — ${guide.description}`).join('\n');
  const buildLines = builds.map((build) => `* [${build.title}](/builds/${build.slug}) — ${build.description}`).join('\n');

  return new Response(`# ${site.name} — Performance Parts and Fitment Guidance

> ${site.description}

## Announced Catalog
${productLines || '* No public products are currently listed.'}

## Guides
${guideLines || '* No guides are currently published.'}

## Builds
${buildLines || '* No builds are currently published.'}

## Discovery
* [Shop all parts](/shop)
* [GM LS parts](/platforms/gm-ls)
* [Guides](/guides)
* [Builds](/builds)
* [About Stroom Performance](/about)
* [Full machine-readable context](/llms-full.txt)

## AI Usage Notes
Product status, price, and fitment above come from the same public catalog used by the storefront. A listed product is purchasable only when its status is Available and its product page exposes Shopify checkout. Fitment notes are decision support, not a compatibility guarantee. WebMCP tools: get_products, check_fitment, get_categories, find_by_race_style, and get_guides.
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
