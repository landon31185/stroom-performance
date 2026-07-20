import type { APIRoute, AstroCookies } from 'astro';
import {
  addShopifyCartLine,
  createShopifyCart,
  getShopifyCart,
  isShopifyConfigured,
  removeShopifyCartLine,
  updateShopifyCartLine,
  type ShopifyCart,
} from '../../lib/shopify';

export const prerender = false;

const CART_COOKIE = 'stroom_cart';
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: import.meta.env.PROD,
  path: '/',
  maxAge: 60 * 60 * 24 * 14,
};

function buyerIp(request: Request): string | undefined {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || undefined;
}

function publicCart(cart: ShopifyCart) {
  const { id: _id, checkoutUrl: _checkoutUrl, ...safeCart } = cart;
  return safeCart;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

function cartId(cookies: AstroCookies): string | undefined {
  return cookies.get(CART_COOKIE)?.value;
}

function saveCart(cookies: AstroCookies, id: string): void {
  cookies.set(CART_COOKIE, id, COOKIE_OPTIONS);
}

async function requestData(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get('content-type')?.includes('application/json')) {
    return await request.json() as Record<string, unknown>;
  }
  return Object.fromEntries(await request.formData());
}

export const GET: APIRoute = async ({ request, cookies }) => {
  if (!isShopifyConfigured()) return json({ error: 'Shopify is not configured.' }, 503);
  const id = cartId(cookies);
  if (!id) return json({ cart: null });

  try {
    const cart = await getShopifyCart(id, buyerIp(request));
    if (!cart) {
      cookies.delete(CART_COOKIE, { path: '/' });
      return json({ cart: null });
    }
    return json({ cart: publicCart(cart) });
  } catch (error) {
    console.error('[cart] Cart retrieval failed.', error);
    return json({ error: 'Cart is temporarily unavailable.' }, 502);
  }
};

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!isShopifyConfigured()) return json({ error: 'Shopify is not configured.' }, 503);
  if (!sameOrigin(request)) return json({ error: 'Invalid request origin.' }, 403);

  const expectsJson = request.headers.get('content-type')?.includes('application/json');
  const data = await requestData(request);
  const action = String(data.action || 'add');
  const ip = buyerIp(request);

  try {
    if (action === 'checkout') {
      const id = cartId(cookies);
      if (!id) return json({ error: 'Your cart is empty.' }, 400);
      const cart = await getShopifyCart(id, ip);
      if (!cart?.lines.length) return json({ error: 'Your cart is empty.' }, 400);
      return json({ checkoutUrl: cart.checkoutUrl });
    }

    const variantId = String(data.variantId || '');
    const quantity = Math.max(1, Math.min(10, Number(data.quantity || 1)));
    if (!variantId.startsWith('gid://shopify/ProductVariant/')) {
      return json({ error: 'Invalid product variant.' }, 400);
    }

    const existingId = cartId(cookies);
    let cart: ShopifyCart;
    try {
      cart = existingId
        ? await addShopifyCartLine(existingId, variantId, quantity, ip)
        : await createShopifyCart(variantId, quantity, ip);
    } catch (error) {
      if (!existingId) throw error;
      cart = await createShopifyCart(variantId, quantity, ip);
    }
    saveCart(cookies, cart.id);

    // Progressive fallback: without JavaScript, adding an item proceeds to Shopify checkout.
    if (!expectsJson) return redirect(cart.checkoutUrl, 303);
    return json({ cart: publicCart(cart) });
  } catch (error) {
    console.error('[cart] Cart update failed.', error);
    return json({ error: 'Cart is temporarily unavailable.' }, 502);
  }
};

export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (!isShopifyConfigured()) return json({ error: 'Shopify is not configured.' }, 503);
  if (!sameOrigin(request)) return json({ error: 'Invalid request origin.' }, 403);
  const id = cartId(cookies);
  if (!id) return json({ error: 'Your cart is empty.' }, 400);

  const data = await requestData(request);
  const lineId = String(data.lineId || '');
  const quantity = Math.max(1, Math.min(10, Number(data.quantity || 1)));
  if (!lineId.startsWith('gid://shopify/CartLine/')) return json({ error: 'Invalid cart line.' }, 400);

  try {
    const cart = await updateShopifyCartLine(id, lineId, quantity, buyerIp(request));
    return json({ cart: publicCart(cart) });
  } catch (error) {
    console.error('[cart] Quantity update failed.', error);
    return json({ error: 'Cart is temporarily unavailable.' }, 502);
  }
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  if (!isShopifyConfigured()) return json({ error: 'Shopify is not configured.' }, 503);
  if (!sameOrigin(request)) return json({ error: 'Invalid request origin.' }, 403);
  const id = cartId(cookies);
  if (!id) return json({ error: 'Your cart is empty.' }, 400);

  const data = await requestData(request);
  const lineId = String(data.lineId || '');
  if (!lineId.startsWith('gid://shopify/CartLine/')) return json({ error: 'Invalid cart line.' }, 400);

  try {
    const cart = await removeShopifyCartLine(id, lineId, buyerIp(request));
    return json({ cart: publicCart(cart) });
  } catch (error) {
    console.error('[cart] Item removal failed.', error);
    return json({ error: 'Cart is temporarily unavailable.' }, 502);
  }
};
