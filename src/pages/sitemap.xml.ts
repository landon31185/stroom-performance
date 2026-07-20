import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getCatalogProducts } from '../lib/catalog';
import { getGuides } from '../lib/editorial';
import { platforms, site } from '../lib/site';

export const prerender = true;
const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] as string);

export const GET: APIRoute = async () => {
  const [products, guides, categories] = await Promise.all([
    getCatalogProducts(), getGuides(), getCollection('categories'),
  ]);
  const urls = new Set(['/', '/about', '/shop', '/guides', '/builds']);
  products.filter((product) => product.status === 'available').forEach((product) => urls.add(`/products/${product.slug}`));
  guides.forEach((guide) => urls.add(`/guides/${guide.slug}`));
  categories.forEach((category) => {
    const populated = products.some((product) => category.data.facet === 'system' ? product.system === category.id : product.raceStyles.includes(category.id));
    if (populated) urls.add(`/collections/${category.id}`);
  });
  platforms.forEach((platform) => {
    if (products.some((product) => product.platforms.includes(platform.slug))) urls.add(`/platforms/${platform.slug}`);
  });
  const body = [...urls].sort().map((path) => `<url><loc>${escapeXml(`${site.url}${path === '/' ? '' : path}`)}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
