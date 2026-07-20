import type { APIRoute } from 'astro';
import { getCatalogProducts, formatMoney, statusLabels } from '../lib/catalog';
import { getBuilds, getGuides } from '../lib/editorial';
import { site, platformName, raceStyleName, systemName } from '../lib/site';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [products, guides, builds] = await Promise.all([getCatalogProducts(), getGuides(), getBuilds()]);
  const productSections = products.filter((product) => product.status !== 'draft').map((product) => `## ${product.title}
URL: ${site.url}/products/${product.slug}
Brand: ${product.brand}
Part number: ${product.manufacturerPartNumber || 'Not supplied'}
Status: ${statusLabels[product.status]}
Price: ${product.price ? formatMoney(product.price) : 'Not published'}
Platform: ${product.platforms.map(platformName).join(', ') || 'Not supplied'}
System: ${systemName(product.system)}
Racing styles: ${product.raceStyles.map(raceStyleName).join(', ') || 'Not supplied'}
Summary: ${product.summary}
Specifications: ${product.specs.join('; ') || 'Not supplied'}
Fitment application: ${product.fitment?.application || 'Not supplied'}
Fitment confidence: ${product.fitment?.confidence || 'Not supplied'}
Required modifications: ${product.fitment?.requiredMods.join('; ') || 'None supplied'}
Fitment notes: ${product.fitment?.notes || 'None supplied'}
`).join('\n');
  const guideSections = guides.map((guide) => `* [${guide.title}](${site.url}/guides/${guide.slug}) — ${guide.description}`).join('\n');
  const buildSections = builds.map((build) => `* [${build.title}](${site.url}/builds/${build.slug}) — ${build.description}`).join('\n');

  return new Response(`# ${site.name} — Full Catalog Context

> ${site.description}

## Object Model
Product connects to Variant, Platform, System, Racing Style, Fitment, Guide, and Build. Shopify owns public product, variant, price, inventory, media, article, and checkout data. Stroom adds fitment confidence and complete-combination context through Shopify metafields and metaobjects.

# Announced Catalog
${productSections || 'No public products are currently listed.'}

# Guides
${guideSections || 'No guides are currently published.'}

# Builds
${buildSections || 'No builds are currently published.'}

# Commerce and Fitment Rules
- Do not infer price, inventory, availability, shipping timing, or compatibility when a field is absent.
- Only products marked Available and offering Shopify checkout are purchasable.
- Fitment depends on the complete vehicle and component combination and should be confirmed before purchase.
- Draft Shopify products are excluded from this file, the public catalog API, and WebMCP.

# Machine Interfaces
- Sitemap: ${site.url}/sitemap.xml
- Catalog JSON: ${site.url}/api/ai-catalog.json
- WebMCP tools: get_products, check_fitment, get_categories, find_by_race_style, get_guides
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
