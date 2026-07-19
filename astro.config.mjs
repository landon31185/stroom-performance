import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// TODO(stroom): swap `site` for the real production domain once registered.
// Placeholder until Jake confirms (stroomperformance.com assumed).
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://stroomperformance.com',
  adapter: vercel(),
  trailingSlash: 'never',
  // Dev-only overlay 504s under this Vite/Astro version pairing (unrelated
  // to the site itself — production build is unaffected). Disabled to keep
  // the dev console clean; safe to re-enable if a future Astro bump fixes it.
  devToolbar: { enabled: false },
  integrations: [
    react(),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    experimentalLayout: 'responsive',
  },
  prefetch: {
    defaultStrategy: 'viewport',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
