import { defineConfig } from 'astro/config';

// r116: site URL pinned to ownlocalml.com (Cloudflare R2-hosted, custom
// domain set up by Roman in the CF dashboard). PULSE_SITE env override
// remains for ad-hoc rebuilds against a different host. The brief
// explicitly bans 'pulse.local' / 'pulse.tld' as production URLs.
// scripts/og-gen.mjs and Base.astro:siteUrl use the same fallback.
const PULSE_SITE = process.env.PULSE_SITE || 'https://ownlocalml.com';

export default defineConfig({
  site: PULSE_SITE,
  compressHTML: true,
  // 'always' → CSS всегда external (link tag). 'auto' на главной странице
  // почему-то выкидывал global.css (есть только noscript inline).
  build: { inlineStylesheets: 'always' }
  // R144: @astrojs/rss is a runtime helper, NOT a config-time integration.
  // It is imported directly inside src/pages/changelog.xml.ts. Listing
  // it in `integrations` here breaks Astro's config validator (the
  // factory returns a Promise). The package still needs to be in
  // package.json dependencies so `import rss from '@astrojs/rss'` resolves.
});
