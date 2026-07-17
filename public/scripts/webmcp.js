/**
 * Stroom Performance — WebMCP browser tools.
 *
 * Exposes the store's object model to in-browser AI agents via
 * navigator.modelContext. Tools map directly onto the ORCA object map:
 *   get_products       → Product (reference / Shopify-owned once live)
 *   check_fitment      → Fitment junction (the altitude/DA differentiator)
 *   get_categories     → Category (Shop by System + Shop by Racing Style)
 *   find_by_race_style  → Product filtered by racing-style facet
 *   get_guides         → Guide / How-To (content→commerce)
 *   get_wholesale_info → operator/supplier acquisition path (immediate goal)
 *
 * TODO(stroom): the product data below is a representative placeholder set that
 * mirrors src/content/products. Once the Shopify Storefront API is live, replace
 * PRODUCTS with a fetch to the Storefront GraphQL endpoint (see src/lib/shopify.ts)
 * so get_products / check_fitment / find_by_race_style return the real catalog.
 */
if (typeof window !== 'undefined' && window.navigator?.modelContext) {
  const mcp = window.navigator.modelContext;

  // Representative catalog — NOT a live/complete product list. Availability is
  // honest: mostly "coming-soon" until supplier accounts open.
  const PRODUCTS = [
    {
      slug: 'squash-intank-hat', title: 'Squash Performance Intank Hat', brand: 'Squash Performance',
      system: 'fuel', raceStyles: ['no-prep', 'index'], availability: 'coming-soon',
      url: '/products/squash-intank-hat',
      fitment: { application: 'Turbo street/strip and No-Prep builds needing more fuel volume', daRange: 'up to ~6,600 ft DA', requiredMods: ['trap-door access panel'], confidence: 'verified-on-car' },
    },
    {
      slug: 'motion-valley-plate', title: 'Motion Race Works Valley Plate', brand: 'Motion Race Works',
      system: 'engine', raceStyles: ['no-prep', 'street-strip'], availability: 'coming-soon',
      url: '/products/motion-valley-plate',
      fitment: { application: 'Boosted LS-based engines', daRange: null, requiredMods: [], confidence: 'vendor-stated' },
    },
    {
      slug: 'high-da-torque-converter', title: 'High-DA Torque Converter', brand: 'TODO: converter partner',
      system: 'drivetrain', raceStyles: ['no-prep', 'index'], availability: 'build-to-order',
      url: '/products/high-da-torque-converter',
      fitment: { application: 'Automatic-trans boosted cars racing at elevation', daRange: 'stall tuned to your home DA (4,000–7,000 ft)', requiredMods: [], confidence: 'verified-on-car' },
    },
    {
      slug: 'holley-terminator-x', title: 'Holley Terminator X EFI', brand: 'Holley',
      system: 'electronics', raceStyles: ['street-strip', 'index', 'no-prep'], availability: 'coming-soon',
      url: '/products/holley-terminator-x',
      fitment: { application: 'EFI conversions and boosted combos needing programmable control', daRange: null, requiredMods: [], confidence: 'vendor-stated' },
    },
    {
      slug: 'engine-diaper', title: 'Engine Diaper', brand: 'TODO: safety supplier',
      system: 'safety', raceStyles: ['no-prep', 'index', 'street-strip'], availability: 'coming-soon',
      url: '/products/engine-diaper',
      fitment: { application: 'Any high-boost car subject to containment rules', daRange: null, requiredMods: [], confidence: 'inferred' },
    },
  ];

  const CATEGORIES = {
    system: [
      { slug: 'fuel', name: 'Fuel', url: '/collections/fuel' },
      { slug: 'engine', name: 'Engine', url: '/collections/engine' },
      { slug: 'drivetrain', name: 'Drivetrain', url: '/collections/drivetrain' },
      { slug: 'electronics', name: 'Electronics', url: '/collections/electronics' },
      { slug: 'safety', name: 'Safety', url: '/collections/safety' },
    ],
    raceStyle: [
      { slug: 'no-prep', name: 'No Prep', url: '/collections/no-prep' },
      { slug: 'index', name: 'Index', url: '/collections/index' },
      { slug: 'street-strip', name: 'Street/Strip', url: '/collections/street-strip' },
    ],
  };

  const GUIDES = [
    { slug: 'trap-door-fuel-pump-access', title: 'Cutting a Trap Door for Fuel-Pump Access', difficulty: 'advanced', url: '/guides/trap-door-fuel-pump-access' },
    { slug: 'high-altitude-tuning-basics', title: 'High-Altitude Tuning Basics — Reading DA', difficulty: 'intermediate', url: '/guides/high-altitude-tuning-basics' },
  ];

  mcp.registerTool('get_products', {
    description: 'Returns Stroom Performance parts (representative catalog; live catalog launching via Shopify). Each includes system, racing styles, availability, and URL.',
    parameters: {
      system: { type: 'string', description: 'Optional system filter: fuel, engine, drivetrain, electronics, safety' },
    },
    execute: ({ system } = {}) => {
      const list = system ? PRODUCTS.filter((p) => p.system === system) : PRODUCTS;
      return list.map(({ slug, title, brand, system, raceStyles, availability, url }) => ({ slug, title, brand, system, raceStyles, availability, url }));
    },
  });

  mcp.registerTool('check_fitment', {
    description: 'The altitude differentiator. Given a vehicle/application and a density altitude, returns Stroom parts likely to fit with altitude notes and a confidence level. Stub logic over the representative catalog until Shopify + the Fitment data layer are live.',
    parameters: {
      application: { type: 'string', description: 'The build/application in plain language, e.g. "boosted LS automatic drag car"' },
      altitudeFt: { type: 'number', description: 'Home density altitude in feet, e.g. 6600' },
    },
    execute: ({ application = '', altitudeFt } = {}) => {
      const q = String(application).toLowerCase();
      const high = typeof altitudeFt === 'number' && altitudeFt >= 4000;
      const matches = PRODUCTS.filter((p) => {
        const app = p.fitment?.application?.toLowerCase() || '';
        // naive keyword overlap on application; real logic will use fitment metaobjects
        return q === '' || app.split(/\W+/).some((w) => w.length > 3 && q.includes(w));
      });
      return {
        note: high
          ? 'High density altitude detected — converter stall, boost, and fueling all shift. Confirm each part against your actual DA.'
          : 'Provide a density altitude (altitudeFt) for altitude-specific guidance — that is where Stroom adds value.',
        results: (matches.length ? matches : PRODUCTS).map((p) => ({
          title: p.title, url: p.url, system: p.system, availability: p.availability,
          altitudeNote: p.fitment?.daRange || 'no altitude note yet', confidence: p.fitment?.confidence || 'inferred',
        })),
        disclaimer: 'TODO(stroom): stub logic. Real fitment comes from the Stroom-authored Fitment data layer (Shopify Metaobjects) — not supplier passthrough.',
      };
    },
  });

  mcp.registerTool('get_categories', {
    description: 'Returns the Stroom category facets: Shop by System (Fuel, Engine, Drivetrain, Electronics, Safety) and Shop by Racing Style (No Prep, Index, Street/Strip).',
    parameters: {},
    execute: () => CATEGORIES,
  });

  mcp.registerTool('find_by_race_style', {
    description: 'Returns parts suited to a racing style: no-prep, index, or street-strip.',
    parameters: {
      style: { type: 'string', description: 'Racing style: no-prep, index, or street-strip' },
    },
    execute: ({ style } = {}) => {
      if (!style) return { error: 'Provide a style: no-prep, index, or street-strip' };
      return PRODUCTS.filter((p) => p.raceStyles.includes(style)).map(({ title, url, system, availability }) => ({ title, url, system, availability }));
    },
  });

  mcp.registerTool('get_guides', {
    description: 'Returns Stroom Performance how-to guides (fabrication, high-altitude tuning, data-log analysis).',
    parameters: {},
    execute: () => GUIDES,
  });

  mcp.registerTool('get_wholesale_info', {
    description: 'For suppliers/manufacturers/distributors: how to become a Stroom dealer or drop-ship partner. Stroom is opening accounts now, ahead of the public catalog launch.',
    parameters: {},
    execute: () => ({
      pitch: 'Stroom brings a high-intent, high-altitude drag-racing audience and a niche nobody else owns. Drop-ship terms, no dead stock on our side.',
      wantedSystems: ['fuel', 'engine', 'drivetrain', 'electronics', 'safety'],
      inquiryUrl: '/wholesale',
      email: 'dealers@stroomperformance.com',
    }),
  });
}
