import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// TODO(stroom): swap `site` for the real production domain once registered.
// Placeholder until Jake confirms (stroomperformance.com assumed).
export default defineConfig({
  site: 'https://stroomperformance.com',
  adapter: vercel(),
  trailingSlash: 'never',
  integrations: [
    sitemap(),
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
