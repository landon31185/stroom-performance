import type { APIRoute } from 'astro';
import { createShopifyCheckout, isShopifyConfigured } from '../../lib/shopify';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  if (!isShopifyConfigured()) return new Response('Shopify is not configured.', { status: 503 });
  const form = await request.formData();
  const variantId = String(form.get('variantId') || '');
  const quantity = Math.max(1, Math.min(10, Number(form.get('quantity') || 1)));
  if (!variantId.startsWith('gid://shopify/ProductVariant/')) {
    return new Response('Invalid product variant.', { status: 400 });
  }
  try {
    return redirect(await createShopifyCheckout(variantId, quantity), 303);
  } catch (error) {
    console.error('[cart] Shopify cart creation failed.', error);
    return new Response('Checkout is temporarily unavailable.', { status: 502 });
  }
};
