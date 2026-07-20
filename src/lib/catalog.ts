import { getCollection, render } from 'astro:content';
import {
  getShopifyProducts,
  isShopifyConfigured,
  type CatalogFitment,
  type CatalogStatus,
  type Money,
} from './shopify';

export interface CatalogProduct {
  source: 'local' | 'shopify';
  slug: string;
  title: string;
  brand: string;
  summary: string;
  descriptionHtml?: string;
  system: string;
  platforms: string[];
  raceStyles: string[];
  status: CatalogStatus;
  price?: Money;
  availableForSale: boolean;
  image?: string;
  imageAlt?: string;
  manufacturerPartNumber?: string;
  variantId?: string;
  specs: string[];
  fitment?: CatalogFitment;
  featured: boolean;
  order: number;
  referenceUrl?: string;
  localEntry?: Awaited<ReturnType<typeof getCollection<'products'>>>[number];
}

async function getLocalProducts(): Promise<CatalogProduct[]> {
  const entries = await getCollection('products');
  return entries.map((entry) => ({
    source: 'local',
    slug: entry.id,
    title: entry.data.title,
    brand: entry.data.brand,
    summary: entry.data.summary,
    system: entry.data.system,
    platforms: entry.data.platforms,
    raceStyles: entry.data.raceStyles,
    status: entry.data.status,
    price: entry.data.price ? { amount: entry.data.price, currencyCode: 'USD' } : undefined,
    availableForSale: entry.data.status === 'available' && Boolean(entry.data.price),
    image: entry.data.image,
    manufacturerPartNumber: entry.data.manufacturerPartNumber,
    specs: entry.data.specs,
    fitment: entry.data.fitment ? {
      application: entry.data.fitment.application,
      requiredMods: entry.data.fitment.requiredMods,
      confidence: entry.data.fitment.confidence,
      notes: entry.data.fitment.notes,
    } : undefined,
    featured: entry.data.featured,
    order: entry.data.order,
    referenceUrl: entry.data.referenceUrl,
    localEntry: entry,
  }));
}

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  if (isShopifyConfigured()) {
    try {
      const products = await getShopifyProducts();
      if (products.length) return products.filter((product) => product.status !== 'draft').sort((a, b) => a.order - b.order);
    } catch (error) {
      console.warn('[catalog] Shopify unavailable; rendering the verified local fallback.', error);
    }
  }
  return (await getLocalProducts()).filter((product) => product.status !== 'draft').sort((a, b) => a.order - b.order);
}

export async function getCatalogProduct(slug: string): Promise<CatalogProduct | undefined> {
  return (await getCatalogProducts()).find((product) => product.slug === slug);
}

export async function getProductDescription(product: CatalogProduct) {
  if (!product.localEntry) return undefined;
  return render(product.localEntry);
}

export function formatMoney(money?: Money): string {
  if (!money) return 'Pricing pending';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: money.currencyCode }).format(money.amount);
}

export const statusLabels: Record<CatalogStatus, string> = {
  draft: 'Draft',
  announced: 'Announced',
  available: 'Available',
  unavailable: 'Unavailable',
};
