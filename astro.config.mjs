import { defineConfig } from 'astro/config';

// r104: site URL pinned to the r104 unification deploy host
// (https://wb7ae24fk5p93.space.minimax.io). PULSE_SITE env override
// remains for ad-hoc rebuilds against a different host. The brief
// explicitly bans 'pulse.local' / 'pulse.tld' as production URLs.
// scripts/og-gen.mjs and Base.astro:siteUrl use the same fallback.
const PULSE_SITE = process.env.PULSE_SITE || 'https://wb7ae24fk5p93.space.minimax.io';

export default defineConfig({
  site: PULSE_SITE,
  compressHTML: true,
  // 'always' → CSS всегда external (link tag). 'auto' на главной странице
  // почему-то выкидывал global.css (есть только noscript inline).
  build: { inlineStylesheets: 'always' }
});
