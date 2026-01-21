// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server', // <--- ADD THIS LINE
  integrations: [react()],
  adapter: vercel()
});