import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://moolulu.github.io',
  base: 'Arazim-Website',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  }
});
