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
  tagline: 'High-altitude performance parts, proven at density altitude.',
  description:
    'Stroom Performance is a specialist performance-parts store built for high-altitude No-Prep and Index drag racing. We curate parts proven to work where thin air, density altitude, and hypoxia change the rules — fuel, boost, converters, and tuning dialed in at 6,600 ft.',
  // Credibility engine: the existing YouTube following comes first.
  youtube: 'https://www.youtube.com/@StroomPerformance', // TODO(stroom): confirm exact channel URL
  // TODO(stroom): real inbox for supplier/wholesale inquiries.
  wholesaleEmail: 'dealers@stroomperformance.com',
  contactEmail: 'hello@stroomperformance.com',
  owner: 'Jake',
  heroFilm: {
    enabled: true,
    src: '/media/stroom-short-source.mp4',
    poster: '/og-default.svg',
  },
} as const;

// ── Shop by System (Category facet — from the ORCA object map) ──
export const systems = [
  { slug: 'fuel', name: 'Fuel', blurb: 'Intank hats, pumps, relays, and delivery sized for thin-air fueling.' },
  { slug: 'engine', name: 'Engine', blurb: 'Valley plates, gaskets, catch cans, and the parts that survive boost.' },
  { slug: 'drivetrain', name: 'Drivetrain', blurb: 'Torque converters and driveline matched to your density altitude.' },
  { slug: 'electronics', name: 'Electronics', blurb: 'EFI, boost control, launch control, sensors, and data logging.' },
  { slug: 'safety', name: 'Safety', blurb: 'Engine diapers and containment for when a run goes wrong.' },
] as const;

// ── Shop by Racing Style (Category facet) ──
export const raceStyles = [
  { slug: 'no-prep', name: 'No Prep', blurb: 'Parts and tuning for an un-prepped surface where traction is never guaranteed.' },
  { slug: 'index', name: 'Index', blurb: 'Consistency-first builds for bracket and index classes (e.g. 7.0).' },
  { slug: 'street-strip', name: 'Street/Strip', blurb: 'Dual-duty combos that drive home and still run hard at the track.' },
] as const;

export type SystemSlug = (typeof systems)[number]['slug'];
export type RaceStyleSlug = (typeof raceStyles)[number]['slug'];

export function systemName(slug: string) {
  return systems.find((s) => s.slug === slug)?.name ?? slug;
}
export function raceStyleName(slug: string) {
  return raceStyles.find((s) => s.slug === slug)?.name ?? slug;
}
