import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://moolulu.github.io',
  base: 'Arazim-Website',

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },

  integrations: [sitemap()]
});