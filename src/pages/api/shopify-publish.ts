import type { APIRoute } from 'astro';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const secret = import.meta.env.SHOPIFY_WEBHOOK_SECRET;
  const deployHook = import.meta.env.VERCEL_DEPLOY_HOOK_URL;
  if (!secret || !deployHook) return new Response('Publish hook is not configured.', { status: 503 });
  const body = await request.text();
  const provided = request.headers.get('x-shopify-hmac-sha256') || '';
  const expected = createHmac('sha256', secret).update(body, 'utf8').digest('base64');
  const valid = provided.length === expected.length
    && timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  if (!valid) return new Response('Unauthorized', { status: 401 });

  const response = await fetch(deployHook, { method: 'POST' });
  if (!response.ok) return new Response('Deployment could not be triggered.', { status: 502 });
  return Response.json({ accepted: true }, { status: 202 });
};
