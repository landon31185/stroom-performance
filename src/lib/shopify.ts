const STORE_DOMAIN = import.meta.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '');
const STOREFRONT_TOKEN = import.meta.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = import.meta.env.SHOPIFY_API_VERSION ?? '2026-04';

export type CatalogStatus = 'draft' | 'announced' | 'available' | 'unavailable';

export interface Money {
  amount: number;
  currencyCode: string;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  title: string;
  variantTitle: string;
  productHandle: string;
  image?: string;
  imageAlt?: string;
  price: Money;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: Money;
  total: Money;
  lines: ShopifyCartLine[];
}

export interface CatalogFitment {
  application: string;
  requiredMods: string[];
  confidence: 'verified-on-car' | 'vendor-stated' | 'inferred';
  notes?: string;
}

export interface ShopifyProduct {
  source: 'shopify';
  slug: string;
  title: string;
  brand: string;
  summary: string;
  descriptionHtml: string;
  system: string;
  platforms: string[];
  raceStyles: string[];
  status: CatalogStatus;
  price?: Money;
  compareAtPrice?: Money;
  availableForSale: boolean;
  image?: string;
  imageAlt?: string;
  manufacturerPartNumber?: string;
  variantId?: string;
  specs: string[];
  fitment?: CatalogFitment;
  featured: boolean;
  order: number;
}

export interface ShopifyGuide {
  source: 'shopify';
  slug: string;
  title: string;
  description: string;
  bodyHtml: string;
  publishedAt: string;
  image?: string;
  imageAlt?: string;
  tags: string[];
}

export interface ShopifyBuild {
  source: 'shopify';
  slug: string;
  title: string;
  description: string;
  bodyHtml: string;
  vehicle: string;
  platforms: string[];
  raceStyles: string[];
  partsUsed: string[];
  image?: string;
  imageAlt?: string;
  videoUrl?: string;
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface ProductNode {
  handle: string;
  title: string;
  vendor: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage?: { url: string; altText?: string };
  variants: { nodes: Array<{
    id: string;
    sku?: string;
    availableForSale: boolean;
    price: { amount: string; currencyCode: string };
    compareAtPrice?: { amount: string; currencyCode: string };
  }> };
  system?: { value: string };
  platforms?: { value: string };
  raceStyles?: { value: string };
  status?: { value: string };
  specs?: { value: string };
  fitmentApplication?: { value: string };
  fitmentRequiredMods?: { value: string };
  fitmentConfidence?: { value: string };
  fitmentNotes?: { value: string };
  featured?: { value: string };
  sortOrder?: { value: string };
}

const PRODUCT_FIELDS = `
  handle
  title
  vendor
  description
  descriptionHtml
  availableForSale
  featuredImage { url altText }
  variants(first: 1) {
    nodes { id sku availableForSale price { amount currencyCode } compareAtPrice { amount currencyCode } }
  }
  system: metafield(namespace: "stroom", key: "system") { value }
  platforms: metafield(namespace: "stroom", key: "platforms") { value }
  raceStyles: metafield(namespace: "stroom", key: "race_styles") { value }
  status: metafield(namespace: "stroom", key: "status") { value }
  specs: metafield(namespace: "stroom", key: "specs") { value }
  fitmentApplication: metafield(namespace: "stroom", key: "fitment_application") { value }
  fitmentRequiredMods: metafield(namespace: "stroom", key: "fitment_required_mods") { value }
  fitmentConfidence: metafield(namespace: "stroom", key: "fitment_confidence") { value }
  fitmentNotes: metafield(namespace: "stroom", key: "fitment_notes") { value }
  featured: metafield(namespace: "stroom", key: "featured") { value }
  sortOrder: metafield(namespace: "stroom", key: "sort_order") { value }
`;

function listValue(field?: { value: string }): string[] {
  if (!field?.value) return [];
  try {
    const parsed = JSON.parse(field.value);
    return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
  } catch {
    return field.value.split(',').map((value) => value.trim()).filter(Boolean);
  }
}

function statusValue(node: ProductNode): CatalogStatus {
  const value = node.status?.value;
  if (value === 'draft' || value === 'announced' || value === 'available' || value === 'unavailable') return value;
  return node.availableForSale ? 'available' : 'announced';
}

function normalizeProduct(node: ProductNode): ShopifyProduct {
  const variant = node.variants.nodes[0];
  const confidence = node.fitmentConfidence?.value;
  const fitmentConfidence = confidence === 'verified-on-car' || confidence === 'vendor-stated'
    ? confidence
    : 'inferred';
  const application = node.fitmentApplication?.value;

  return {
    source: 'shopify',
    slug: node.handle,
    title: node.title,
    brand: node.vendor || 'Stroom Performance',
    summary: node.description,
    descriptionHtml: node.descriptionHtml,
    system: node.system?.value || 'engine',
    platforms: listValue(node.platforms),
    raceStyles: listValue(node.raceStyles),
    status: statusValue(node),
    price: variant ? { amount: Number(variant.price.amount), currencyCode: variant.price.currencyCode } : undefined,
    compareAtPrice: variant?.compareAtPrice
      ? { amount: Number(variant.compareAtPrice.amount), currencyCode: variant.compareAtPrice.currencyCode }
      : undefined,
    availableForSale: Boolean(node.availableForSale && variant?.availableForSale),
    image: node.featuredImage?.url,
    imageAlt: node.featuredImage?.altText,
    manufacturerPartNumber: variant?.sku,
    variantId: variant?.id,
    specs: listValue(node.specs),
    fitment: application ? {
      application,
      requiredMods: listValue(node.fitmentRequiredMods),
      confidence: fitmentConfidence,
      notes: node.fitmentNotes?.value,
    } : undefined,
    featured: node.featured?.value === 'true',
    order: Number(node.sortOrder?.value || 99),
  };
}

export function isShopifyConfigured(): boolean {
  return Boolean(STORE_DOMAIN && STOREFRONT_TOKEN);
}

export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  buyerIp?: string,
): Promise<T> {
  if (!isShopifyConfigured()) throw new Error('Shopify Storefront API credentials are not configured.');

  const response = await fetch(`https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN as string,
      ...(buyerIp ? { 'Shopify-Storefront-Buyer-IP': buyerIp } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const payload = await response.json() as GraphqlResponse<T>;
  if (!response.ok || payload.errors?.length || !payload.data) {
    const detail = payload.errors?.map((error) => error.message).join('; ') || response.statusText;
    throw new Error(`Shopify Storefront API request failed: ${detail}`);
  }
  return payload.data;
}

export async function getShopifyProducts(limit = 50): Promise<ShopifyProduct[]> {
  if (!isShopifyConfigured()) return [];
  const data = await storefront<{ products: { nodes: ProductNode[] } }>(`
    query CatalogProducts($first: Int!) {
      products(first: $first, sortKey: TITLE) { nodes { ${PRODUCT_FIELDS} } }
    }
  `, { first: limit });
  return data.products.nodes.map(normalizeProduct).filter((product) => product.status !== 'draft');
}

export async function getShopifyProduct(handle: string): Promise<ShopifyProduct | undefined> {
  if (!isShopifyConfigured()) return undefined;
  const data = await storefront<{ product: ProductNode | null }>(`
    query CatalogProduct($handle: String!) {
      product(handle: $handle) { ${PRODUCT_FIELDS} }
    }
  `, { handle });
  return data.product ? normalizeProduct(data.product) : undefined;
}

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          title
          price { amount currencyCode }
          image { url altText }
          product { handle title featuredImage { url altText } }
        }
      }
    }
  }
`;

interface CartNode {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: { nodes: Array<{
    id: string;
    quantity: number;
    merchandise: {
      title: string;
      price: { amount: string; currencyCode: string };
      image?: { url: string; altText?: string };
      product: { handle: string; title: string; featuredImage?: { url: string; altText?: string } };
    };
  }> };
}

function normalizeCart(cart: CartNode): ShopifyCart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: {
      amount: Number(cart.cost.subtotalAmount.amount),
      currencyCode: cart.cost.subtotalAmount.currencyCode,
    },
    total: {
      amount: Number(cart.cost.totalAmount.amount),
      currencyCode: cart.cost.totalAmount.currencyCode,
    },
    lines: cart.lines.nodes.map((line) => ({
      id: line.id,
      quantity: line.quantity,
      title: line.merchandise.product.title,
      variantTitle: line.merchandise.title,
      productHandle: line.merchandise.product.handle,
      image: line.merchandise.image?.url || line.merchandise.product.featuredImage?.url,
      imageAlt: line.merchandise.image?.altText || line.merchandise.product.featuredImage?.altText,
      price: {
        amount: Number(line.merchandise.price.amount),
        currencyCode: line.merchandise.price.currencyCode,
      },
    })),
  };
}

type CartPayload = { cart?: CartNode | null; userErrors: Array<{ message: string }> };

function cartFromPayload(payload: CartPayload): ShopifyCart {
  if (!payload.cart || payload.userErrors.length) {
    throw new Error(payload.userErrors.map((error) => error.message).join('; ') || 'Cart could not be updated.');
  }
  return normalizeCart(payload.cart);
}

export async function createShopifyCart(variantId: string, quantity = 1, buyerIp?: string): Promise<ShopifyCart> {
  const data = await storefront<{ cartCreate: CartPayload }>(`
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }
  `, { input: { lines: [{ merchandiseId: variantId, quantity }] } }, buyerIp);
  return cartFromPayload(data.cartCreate);
}

export async function getShopifyCart(cartId: string, buyerIp?: string): Promise<ShopifyCart | undefined> {
  const data = await storefront<{ cart: CartNode | null }>(`
    query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }
  `, { id: cartId }, buyerIp);
  return data.cart ? normalizeCart(data.cart) : undefined;
}

export async function addShopifyCartLine(cartId: string, variantId: string, quantity = 1, buyerIp?: string): Promise<ShopifyCart> {
  const data = await storefront<{ cartLinesAdd: CartPayload }>(`
    mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }
  `, { cartId, lines: [{ merchandiseId: variantId, quantity }] }, buyerIp);
  return cartFromPayload(data.cartLinesAdd);
}

export async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number, buyerIp?: string): Promise<ShopifyCart> {
  const data = await storefront<{ cartLinesUpdate: CartPayload }>(`
    mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }
  `, { cartId, lines: [{ id: lineId, quantity }] }, buyerIp);
  return cartFromPayload(data.cartLinesUpdate);
}

export async function removeShopifyCartLine(cartId: string, lineId: string, buyerIp?: string): Promise<ShopifyCart> {
  const data = await storefront<{ cartLinesRemove: CartPayload }>(`
    mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }
  `, { cartId, lineIds: [lineId] }, buyerIp);
  return cartFromPayload(data.cartLinesRemove);
}

export async function getShopifyGuides(limit = 50): Promise<ShopifyGuide[]> {
  if (!isShopifyConfigured()) return [];
  const data = await storefront<{
    blog: null | { articles: { nodes: Array<{
      handle: string; title: string; excerpt: string; contentHtml: string; publishedAt: string; tags: string[];
      image?: { url: string; altText?: string };
    }> } };
  }>(`
    query Guides($first: Int!) {
      blog(handle: "guides") {
        articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
          nodes { handle title excerpt contentHtml publishedAt tags image { url altText } }
        }
      }
    }
  `, { first: limit });
  return (data.blog?.articles.nodes || []).map((article) => ({
    source: 'shopify', slug: article.handle, title: article.title, description: article.excerpt,
    bodyHtml: article.contentHtml, publishedAt: article.publishedAt, tags: article.tags,
    image: article.image?.url, imageAlt: article.image?.altText,
  }));
}

function metaobjectFields(fields: Array<{ key: string; value?: string }>): Record<string, string> {
  return Object.fromEntries(fields.filter((field) => field.value != null).map((field) => [field.key, field.value as string]));
}

export async function getShopifyBuilds(limit = 50): Promise<ShopifyBuild[]> {
  if (!isShopifyConfigured()) return [];
  const data = await storefront<{
    metaobjects: { nodes: Array<{ handle: string; fields: Array<{ key: string; value?: string }> }> };
  }>(`
    query Builds($first: Int!) {
      metaobjects(type: "stroom_build", first: $first) { nodes { handle fields { key value } } }
    }
  `, { first: limit });
  return data.metaobjects.nodes.map((node) => {
    const fields = metaobjectFields(node.fields);
    return {
      source: 'shopify', slug: node.handle, title: fields.title || node.handle,
      description: fields.description || '', bodyHtml: fields.body || '', vehicle: fields.vehicle || '',
      platforms: listValue(fields.platforms ? { value: fields.platforms } : undefined),
      raceStyles: listValue(fields.race_styles ? { value: fields.race_styles } : undefined),
      partsUsed: listValue(fields.parts_used ? { value: fields.parts_used } : undefined),
      image: fields.image_url, imageAlt: fields.image_alt, videoUrl: fields.video_url,
    };
  });
}
