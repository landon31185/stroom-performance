import type { APIRoute } from 'astro';
import { getCatalogProducts, formatMoney } from '../../lib/catalog';
import { getGuides } from '../../lib/editorial';
import { platforms, raceStyles, systems } from '../../lib/site';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [products, guides] = await Promise.all([getCatalogProducts(), getGuides()]);
  const publicProducts = products.filter((product) => product.status !== 'draft');
  const populated = (facet: 'platform' | 'system' | 'raceStyle', slug: string) => publicProducts.some((product) =>
    facet === 'platform' ? product.platforms.includes(slug)
      : facet === 'system' ? product.system === slug
        : product.raceStyles.includes(slug));

  return Response.json({
    generatedAt: new Date().toISOString(),
    products: publicProducts.map((product) => ({
      slug: product.slug,
      title: product.title,
      brand: product.brand,
      partNumber: product.manufacturerPartNumber,
      system: product.system,
      platforms: product.platforms,
      raceStyles: product.raceStyles,
      status: product.status,
      price: product.price ? formatMoney(product.price) : undefined,
      url: `/products/${product.slug}`,
      fitment: product.fitment,
    })),
    categories: {
      platforms: platforms.filter((item) => populated('platform', item.slug)).map((item) => ({ ...item, url: `/platforms/${item.slug}` })),
      systems: systems.filter((item) => populated('system', item.slug)).map((item) => ({ ...item, url: `/collections/${item.slug}` })),
      raceStyles: raceStyles.filter((item) => populated('raceStyle', item.slug)).map((item) => ({ ...item, url: `/collections/${item.slug}` })),
    },
    guides: guides.map((guide) => ({ slug: guide.slug, title: guide.title, description: guide.description, url: `/guides/${guide.slug}` })),
  }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=86400' } });
};
