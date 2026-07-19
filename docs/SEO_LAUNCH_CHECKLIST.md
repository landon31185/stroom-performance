# SEO Launch Checklist

## Before indexing

- Confirm the final domain and set `PUBLIC_SITE_URL` in Vercel.
- Confirm every indexable product has unique title, summary, useful body copy,
  licensed media, alt text, platform, system, fitment, and canonical URL.
- Keep empty platform/collection pages `noindex,follow`; the templates do this
  automatically until at least one product exists.
- Do not mark announced products as in stock or emit Offer schema without a real
  Shopify price and purchasable variant.
- Remove draft products from the Headless publication.
- Test responsive images, mobile layout, keyboard navigation, and Core Web Vitals.
- Verify sitemap URLs, canonical URLs, redirects, robots.txt, breadcrumbs, and
  structured data against the production deployment.

## Search services

- Add Google Search Console verification to `PUBLIC_GOOGLE_SITE_VERIFICATION`.
- Add Bing Webmaster verification to `PUBLIC_BING_SITE_VERIFICATION`.
- Add GA4 measurement ID to `PUBLIC_GA_MEASUREMENT_ID`, or leave analytics off.
- Submit `/sitemap.xml` after the domain is live.
- Connect Shopify's Google & YouTube channel only when prices, inventory,
  shipping, returns, tax, and contact policies are complete.

## Initial organic architecture

1. GM LS platform landing page.
2. Engine and Electronics collection pages backed by real products.
3. Unique product pages targeting exact manufacturer/part-number intent.
4. Fitment and selection guides that link to relevant products.
5. Build pages showing how products work together in a complete combination.
6. Gen III Hemi pages only after confirmed products create substantive content.

Review Search Console coverage, queries, click-through rate, and merchant errors
monthly. Expand from customer questions and real inventory, not placeholder SEO
pages.
