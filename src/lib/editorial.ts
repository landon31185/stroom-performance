import { getCollection } from 'astro:content';
import { getShopifyBuilds, getShopifyGuides, isShopifyConfigured } from './shopify';

export async function getGuides() {
  if (isShopifyConfigured()) {
    try {
      const guides = await getShopifyGuides();
      if (guides.length) return guides;
    } catch (error) {
      console.warn('[editorial] Shopify guides unavailable; using local fallback.', error);
    }
  }
  return (await getCollection('guides')).map((entry) => ({
    source: 'local' as const, slug: entry.id, title: entry.data.title, description: entry.data.description,
    publishedAt: entry.data.date, tags: [entry.data.difficulty], bodyHtml: '',
    image: undefined as string | undefined, imageAlt: undefined as string | undefined, entry,
  }));
}

export async function getBuilds() {
  if (isShopifyConfigured()) {
    try {
      const builds = await getShopifyBuilds();
      if (builds.length) return builds;
    } catch (error) {
      console.warn('[editorial] Shopify builds unavailable; using local fallback.', error);
    }
  }
  return (await getCollection('builds')).map((entry) => ({
    source: 'local' as const, slug: entry.id, title: entry.data.title, description: entry.data.description,
    vehicle: entry.data.vehicle, platforms: [] as string[], raceStyles: entry.data.raceStyles,
    partsUsed: entry.data.partsUsed, videoUrl: entry.data.videoUrl, bodyHtml: '',
    image: undefined as string | undefined, imageAlt: undefined as string | undefined, entry,
  }));
}
