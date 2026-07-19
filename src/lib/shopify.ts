/**
 * Shopify Storefront API client — STUB.
 *
 * TODO(stroom): Stroom has verified reference products but no live Shopify
 * inventory yet. When the commerce catalog is ready:
 *   1. Create a Shopify store, add products + the "Shop by System" /
 *      "Shop by Racing Style" collections.
 *   2. Generate a Storefront API access token (read-only, public-safe).
 *   3. Fill SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_TOKEN in `.env`
 *      (see .env.example).
 *   4. Replace the seed-content fallback below with real GraphQL calls.
 *
 * Per the object model, Shopify OWNS commerce (Product, Variant, Order,
 * Customer, Cart). This site only READS it. The two things Shopify cannot
 * model — including Stroom-authored fitment guidance — lives in
 * Astro content collections + (eventually) Shopify Metaobjects, NOT here.
 */

const STORE_DOMAIN = import.meta.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = import.meta.env.SHOPIFY_API_VERSION ?? '2025-01';

export interface ShopifyProduct {
  handle: string;
  title: string;
  price: string;
  available: boolean;
  featuredImage?: string;
}

/** True once real Storefront credentials are configured. */
export function isShopifyConfigured(): boolean {
  return Boolean(STORE_DOMAIN && STOREFRONT_TOKEN);
}

/**
 * Run a Storefront GraphQL query. Throws until credentials are set — callers
 * should guard with `isShopifyConfigured()` and fall back to seed content.
 */
export async function storefront<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new Error(
      'TODO(stroom): Shopify Storefront API not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN in .env.',
    );
  }
  const endpoint = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify Storefront error: ${res.status}`);
  const json = (await res.json()) as { data: T; errors?: unknown };
  if (json.errors) throw new Error(`Shopify Storefront GraphQL error: ${JSON.stringify(json.errors)}`);
  return json.data;
}

/**
 * Fetch products. Returns [] until Shopify is wired up, so pages render a
 * "catalog coming soon" state instead of crashing. Once live, swap the body
 * for a real `storefront(PRODUCTS_QUERY)` call.
 */
export async function getShopifyProducts(_limit = 12): Promise<ShopifyProduct[]> {
  if (!isShopifyConfigured()) return [];
  // TODO(stroom): implement real query, e.g.
  //   const data = await storefront(PRODUCTS_QUERY, { first: _limit });
  //   return data.products.edges.map(...)
  return [];
}
