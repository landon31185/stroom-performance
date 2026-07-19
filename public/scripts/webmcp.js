/** Stroom Performance browser tools for AI-assisted product discovery. */
if (typeof window !== 'undefined' && window.navigator?.modelContext) {
  const mcp = window.navigator.modelContext;

  // Keep this reference data aligned with src/content/products until Shopify is live.
  const PRODUCTS = [
    {
      slug: 'pac-1218-valve-springs', title: 'PAC 1218 Beehive Valve Springs',
      brand: 'PAC Racing Springs', partNumber: 'PAC-1218-16', system: 'engine',
      platforms: ['gm-ls'], raceStyles: ['street-strip', 'index', 'no-prep'],
      availability: 'coming-soon', url: '/products/pac-1218-valve-springs',
      fitment: 'GM Gen III/IV LS applications using compatible retainers, seats, and installed height',
    },
    {
      slug: 'btr-stage-2-turbo-cam-v2', title: 'BTR Stage 2 Turbo Camshaft V2',
      brand: 'Brian Tooley Racing', partNumber: 'BTR-TURBOSTG2', system: 'engine',
      platforms: ['gm-ls'], raceStyles: ['street-strip', 'index', 'no-prep'],
      availability: 'coming-soon', url: '/products/btr-stage-2-turbo-cam-v2',
      fitment: 'Turbocharged GM Gen III/IV LS engines; complete combination review required',
    },
    {
      slug: 'btr-equalizer-1-intake', title: 'BTR Equalizer 1 Intake Manifold',
      brand: 'Brian Tooley Racing', partNumber: 'IMA-01', system: 'engine',
      platforms: ['gm-ls'], raceStyles: ['street-strip', 'index', 'no-prep'],
      availability: 'coming-soon', url: '/products/btr-equalizer-1-intake',
      fitment: 'Cathedral-port GM LS combinations; confirm accessories, fuel system, and throttle control',
    },
    {
      slug: 'holley-terminator-x-550-909t', title: 'Holley Terminator X for GM LS1/LS6',
      brand: 'Holley EFI', partNumber: '550-909T', system: 'electronics',
      platforms: ['gm-ls'], raceStyles: ['street-strip', 'index', 'no-prep'],
      availability: 'coming-soon', url: '/products/holley-terminator-x-550-909t',
      fitment: 'GM LS1/LS6 with 24x crank, 1x cam signal, and EV6 high-impedance injectors',
    },
  ];

  const CATEGORIES = {
    platform: [
      { slug: 'gm-ls', name: 'GM LS', state: 'verified-products' },
      { slug: 'gen3-hemi', name: 'Gen III Hemi', state: 'products-being-confirmed' },
    ],
    system: ['fuel', 'engine', 'drivetrain', 'electronics', 'safety'].map((slug) => ({ slug, url: `/collections/${slug}` })),
    raceStyle: ['no-prep', 'index', 'street-strip'].map((slug) => ({ slug, url: `/collections/${slug}` })),
  };

  const GUIDES = [
    { slug: 'trap-door-fuel-pump-access', title: 'Cutting a Trap Door for Fuel-Pump Access', url: '/guides/trap-door-fuel-pump-access' },
    { slug: 'high-altitude-tuning-basics', title: 'High-Altitude Tuning Basics - Reading DA', url: '/guides/high-altitude-tuning-basics' },
  ];

  mcp.registerTool('get_products', {
    description: 'Returns verified Stroom reference products. Coming-soon items do not have live price or inventory.',
    parameters: {
      system: { type: 'string', description: 'Optional system filter' },
      platform: { type: 'string', description: 'Optional platform filter: gm-ls or gen3-hemi' },
    },
    execute: ({ system, platform } = {}) => PRODUCTS.filter((product) =>
      (!system || product.system === system) && (!platform || product.platforms.includes(platform)),
    ),
  });

  mcp.registerTool('check_fitment', {
    description: 'Returns candidate products and fitment notes for a described application. Final compatibility must be verified before purchase.',
    parameters: { application: { type: 'string', description: 'Build or application in plain language' } },
    execute: ({ application = '' } = {}) => ({
      application,
      results: PRODUCTS.map(({ title, partNumber, url, fitment, availability }) => ({ title, partNumber, url, fitment, availability })),
      disclaimer: 'Compatibility depends on the complete vehicle and component combination. Coming-soon does not mean in stock.',
    }),
  });

  mcp.registerTool('get_categories', {
    description: 'Returns platform, system, and racing-style discovery facets.',
    parameters: {},
    execute: () => CATEGORIES,
  });

  mcp.registerTool('find_by_race_style', {
    description: 'Returns reference products associated with a racing style.',
    parameters: { style: { type: 'string', description: 'no-prep, index, or street-strip' } },
    execute: ({ style } = {}) => PRODUCTS.filter((product) => product.raceStyles.includes(style)),
  });

  mcp.registerTool('get_guides', {
    description: 'Returns Stroom setup and installation guides.',
    parameters: {},
    execute: () => GUIDES,
  });
}
