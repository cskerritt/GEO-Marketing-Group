import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://geostudio.io',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
      customPages: [],
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});
