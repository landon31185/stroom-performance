import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// System + racing-style facets from the ORCA object map.
const SYSTEMS = ['fuel', 'engine', 'drivetrain', 'electronics', 'safety'] as const;
const RACE_STYLES = ['no-prep', 'index', 'street-strip'] as const;
const PLATFORMS = ['gm-ls', 'gen3-hemi'] as const;

/**
 * Product (reference — Shopify-owned once live).
 * Entries represent products the client intends to sell. `availability:
 * coming-soon` is the default until Shopify provides real price and inventory.
 * Fitment and altitude fields remain Stroom-authored guidance.
 */
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    brand: z.string(),                       // Squash Performance, Motion Race Works, Holley…
    manufacturerPartNumber: z.string().optional(),
    system: z.enum(SYSTEMS),
    platforms: z.array(z.enum(PLATFORMS)).default([]),
    raceStyles: z.array(z.enum(RACE_STYLES)).default([]),
    price: z.number().optional(),            // absent while pre-catalog
    availability: z.enum(['in-stock', 'build-to-order', 'coming-soon']).default('coming-soon'),
    summary: z.string(),
    specs: z.array(z.string()).default([]),
    referenceUrl: z.string().url().optional(),
    // Fitment / altitude — the differentiator. Stroom-authored, confidence-tagged.
    fitment: z
      .object({
        application: z.string(),             // vehicle/application anchor
        daRange: z.string().optional(),      // e.g. "good to ~6,600 ft DA"
        requiredMods: z.array(z.string()).default([]),
        confidence: z.enum(['verified-on-car', 'vendor-stated', 'inferred']).default('inferred'),
        notes: z.string().optional(),
      })
      .optional(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
  }),
});

/**
 * Guide / How-To (core — site-owned). Drives HowTo schema + the
 * content→commerce flywheel (parts used → shoppable).
 */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    tools: z.array(z.string()).default([]),
    partsUsed: z.array(z.string()).default([]),  // product slugs → shoppable
    steps: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
    videoUrl: z.string().optional(),             // YouTube source
    order: z.number().default(99),
  }),
});

/**
 * Build (core? — DECISION NEEDED per object map). Jake's own car documented
 * over time. Modeled here so the IA supports it; kept to a single seed until
 * Jake confirms editorial scope (Build-first vs Guides-first).
 */
const builds = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/builds' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    vehicle: z.string(),
    altitude: z.string(),                        // home DA, e.g. "6,600 ft"
    raceStyles: z.array(z.enum(RACE_STYLES)).default([]),
    partsUsed: z.array(z.string()).default([]),
    videoUrl: z.string().optional(),
    order: z.number().default(99),
  }),
});

/**
 * Category (reference — Shopify Collection once live). JSON entries for the
 * two facet dimensions so category pages have authored copy + ordering.
 */
const categories = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/categories' }),
  schema: z.object({
    name: z.string(),
    facet: z.enum(['system', 'race-style']),
    description: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = { products, guides, builds, categories };
