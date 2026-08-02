import { defineConfig } from 'astro/config';

// r102: site URL moved from the r101 placeholder 'https://pulse.local'
// to the canonical R97-HOTFIX deploy host 'https://ebjklgbf0qvnp.space.minimax.io'
// so og:url, sitemap.xml, and Base.astro's siteUrl fallback never ship
// 'pulse.tld' / 'pulse.local' (banned by the brief). scripts/og-gen.mjs
// has a hardcoded fallback to the same canonical host so the OG pills
// never regress to a placeholder if astro.config drifts again.
export default defineConfig({
  site: 'https://ebjklgbf0qvnp.space.minimax.io',
  compressHTML: true,
  // 'always' → CSS всегда external (link tag). 'auto' на главной странице
  // почему-то выкидывал global.css (есть только noscript inline).
  build: { inlineStylesheets: 'always' }
});
