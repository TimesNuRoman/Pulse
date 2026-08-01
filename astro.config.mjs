import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pulse.local',
  compressHTML: true,
  // 'always' → CSS всегда external (link tag). 'auto' на главной странице
  // почему-то выкидывал global.css (есть только noscript inline).
  build: { inlineStylesheets: 'always' }
});
