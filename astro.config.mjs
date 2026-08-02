import { defineConfig } from 'astro/config';

// r104: site URL placeholder for the r104 unification deploy. The actual
// URL on the live host is whatever website_deploy returns at build time
// (each deploy gets a fresh space.minimax.io subdomain). The constant
// here is the floor — if PULSE_SITE is not set and Astro.site is unset,
// the og:url and sitemap.xml entries fall back to this. The brief
// explicitly bans 'pulse.local' / 'pulse.tld' as production URLs.
// scripts/og-gen.mjs and Base.astro:siteUrl use the same fallback.
const PULSE_SITE = process.env.PULSE_SITE || 'https://ncfosklh79sxf.space.minimax.io';

export default defineConfig({
  site: PULSE_SITE,
  compressHTML: true,
  // 'always' → CSS всегда external (link tag). 'auto' на главной странице
  // почему-то выкидывал global.css (есть только noscript inline).
  build: { inlineStylesheets: 'always' }
});
