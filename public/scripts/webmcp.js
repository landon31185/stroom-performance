/** Stroom Performance browser tools backed by the same catalog as the storefront. */
(async function registerStroomTools() {
  if (typeof window === 'undefined' || !window.navigator?.modelContext) return;

  try {
    const response = await fetch('/api/ai-catalog.json', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
    const catalog = await response.json();
    const products = catalog.products || [];
    const mcp = window.navigator.modelContext;

    mcp.registerTool('get_products', {
      description: 'Returns Stroom products with live public status, price, platform, system, and fitment fields from the storefront catalog.',
      parameters: {
        system: { type: 'string', description: 'Optional system filter' },
        platform: { type: 'string', description: 'Optional platform filter: gm-ls or gen3-hemi' },
      },
      execute: ({ system, platform } = {}) => products.filter((product) =>
        (!system || product.system === system) && (!platform || product.platforms.includes(platform)),
      ),
    });

    mcp.registerTool('check_fitment', {
      description: 'Returns candidate products and authored fitment notes. It does not guarantee compatibility.',
      parameters: { application: { type: 'string', description: 'Build or application in plain language' } },
      execute: ({ application = '' } = {}) => ({
        application,
        results: products.filter((product) => product.fitment).map((product) => ({
          title: product.title,
          partNumber: product.partNumber,
          url: product.url,
          fitment: product.fitment,
          status: product.status,
          price: product.price,
        })),
        disclaimer: 'Compatibility depends on the complete vehicle and component combination. Confirm fitment before purchase.',
      }),
    });

    mcp.registerTool('get_categories', {
      description: 'Returns currently populated platform, system, and racing-style discovery facets.',
      parameters: {},
      execute: () => catalog.categories,
    });

    mcp.registerTool('find_by_race_style', {
      description: 'Returns catalog products associated with a racing style.',
      parameters: { style: { type: 'string', description: 'no-prep, index, or street-strip' } },
      execute: ({ style } = {}) => products.filter((product) => product.raceStyles.includes(style)),
    });

    mcp.registerTool('get_guides', {
      description: 'Returns current Stroom setup, fitment, and installation guides.',
      parameters: {},
      execute: () => catalog.guides,
    });
  } catch (error) {
    console.warn('[webmcp] Stroom catalog tools could not be registered.', error);
  }
})();
