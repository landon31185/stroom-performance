import { ImageResponse } from '@vercel/og';
import type { APIRoute } from 'astro';
import { brandColors } from '../../lib/site';

export const prerender = false;

// Dark, technical OG card matching the Stroom brand (Moto Stencil: orange on near-black).
export const GET: APIRoute = async ({ url }) => {
  const title = url.searchParams.get('title') || 'Stroom Performance';
  const sub = url.searchParams.get('description') || 'Curated performance parts with fitment-minded guidance';

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '72px 80px',
          background: brandColors.ink,
          fontFamily: 'system-ui, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '10px' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { color: brandColors.paper, fontSize: '22px', fontWeight: '700', letterSpacing: '0.02em', textTransform: 'uppercase' },
                    children: 'Stroom',
                  },
                },
                {
                  type: 'span',
                  props: { style: { color: brandColors.orange, fontSize: '22px', fontWeight: '700' }, children: '/' },
                },
                {
                  type: 'span',
                  props: {
                    style: { color: brandColors.paper, fontSize: '22px', fontWeight: '700', letterSpacing: '0.02em', textTransform: 'uppercase' },
                    children: 'Performance',
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '18px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: brandColors.paper,
                      fontSize: title.length > 40 ? '52px' : '66px',
                      fontWeight: '800',
                      lineHeight: '1.05',
                      letterSpacing: '-0.02em',
                      maxWidth: '900px',
                      textTransform: 'uppercase',
                    },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { color: brandColors.orange, fontSize: '26px', fontWeight: '500', letterSpacing: '0.01em' },
                    children: sub,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '14px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '10px 22px',
                      background: brandColors.orange,
                      // Text ON solid orange must be dark ink, never white/paper (contrast rule).
                      color: brandColors.ink,
                      fontSize: '16px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                    },
                    children: 'No Prep · Index · Density Altitude',
                  },
                },
                {
                  type: 'span',
                  props: { style: { color: brandColors.muted, fontSize: '16px' }, children: 'stroomperformance.com' },
                },
              ],
            },
          },
        ],
      },
    } as any,
    { width: 1200, height: 630 },
  );
};
