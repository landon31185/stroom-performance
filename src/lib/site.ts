// Single source of truth for brand identity + facet taxonomy.
// TODO(stroom): confirm domain, YouTube URL, and contact email with Jake.

// Brand color tokens. Mirrors the CSS custom properties in
// src/styles/global.css (--color-ink, --color-paper, --color-orange,
// --color-muted) — update both places together. This copy exists because
// @vercel/og (Satori) can't read CSS custom properties, so anywhere that
// generates images outside the page (e.g. api/og.ts) imports from here
// instead of hardcoding hex values.
export const brandColors = {
  ink: '#16171a',
  paper: '#f1efec',
  orange: '#e8672e',
  orangeInk: '#b8480e',
  muted: '#8b8b8b',
} as const;

export const site = {
  name: 'Stroom Performance',
  // TODO(stroom): real production domain (placeholder until registered).
  url: 'https://stroomperformance.com',
  tagline: 'Curated performance parts with fitment-minded guidance.',
  description:
    'Stroom Performance is a premium performance-parts storefront built around curated systems, fitment-minded guidance, and real-world product judgment. Shop fuel, engine, drivetrain, electronics, and race support with more confidence and less guesswork.',
  // Credibility engine: the existing YouTube following comes first.
  youtube: 'https://www.youtube.com/@StroomPerformance', // TODO(stroom): confirm exact channel URL
  contactEmail: 'hello@stroomperformance.com',
  owner: 'Jake',
  heroFilm: {
    enabled: true,
    src: '/media/stroom-hero-loop.mp4',
    poster: '/media/stroom-hero-poster.jpg',
  },
} as const;

// ── Shop by System (Category facet — from the ORCA object map) ──
export const systems = [
  { slug: 'fuel', name: 'Fuel', blurb: 'Pumps, hats, plumbing, and delivery parts for stable fueling under load.' },
  { slug: 'engine', name: 'Engine', blurb: 'Hard parts and supporting hardware for boosted combinations that need to hold up.' },
  { slug: 'drivetrain', name: 'Drivetrain', blurb: 'Converters and driveline pieces chosen around repeatability, launch, and use case.' },
  { slug: 'electronics', name: 'Electronics', blurb: 'EFI, boost control, sensors, and data tools for cleaner decision-making.' },
  { slug: 'safety', name: 'Safety', blurb: 'Containment and race support essentials for serious builds and harder passes.' },
] as const;

// ── Shop by Racing Style (Category facet) ──
export const raceStyles = [
  { slug: 'no-prep', name: 'No Prep', blurb: 'Parts and tuning for an un-prepped surface where traction is never guaranteed.' },
  { slug: 'index', name: 'Index', blurb: 'Consistency-first builds for bracket and index classes (e.g. 7.0).' },
  { slug: 'street-strip', name: 'Street/Strip', blurb: 'Dual-duty combos that drive home and still run hard at the track.' },
] as const;

export const platforms = [
  { slug: 'gm-ls', name: 'GM LS' },
  { slug: 'gen3-hemi', name: 'Gen III Hemi' },
] as const;

export type SystemSlug = (typeof systems)[number]['slug'];
export type RaceStyleSlug = (typeof raceStyles)[number]['slug'];

export function systemName(slug: string) {
  return systems.find((s) => s.slug === slug)?.name ?? slug;
}
export function raceStyleName(slug: string) {
  return raceStyles.find((s) => s.slug === slug)?.name ?? slug;
}
export function platformName(slug: string) {
  return platforms.find((p) => p.slug === slug)?.name ?? slug;
}
