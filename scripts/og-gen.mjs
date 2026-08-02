#!/usr/bin/env node
// pulse-landing: generate 4 Open Graph PNG variants (1200x630).
// Pure Node + @resvg/resvg-js — no canvas, no headless browser.
//
// Usage:  node scripts/og-gen.mjs
// Output: public/og-home.png, public/og-notes.png,
//         public/og-install.png, public/og-pricing.png
//
// Run `npm run og:gen` (alias for this script).
//
// Design rules: 12-point hard rules (DARK only, Tokyo Night palette,
// no emoji, no marketing copy, descriptive text only).

import { writeFile, mkdir } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

// --- Variants ---------------------------------------------------------------

const variants = [
  {
    name: 'home',
    title: 'Pulse',
    subtitle: 'Local-first AI side panel',
    site: 'pulse.tld'
  },
  {
    name: 'notes',
    title: 'Pulse Notes',
    subtitle: 'Markdown notes on Android',
    site: 'pulse.tld / notes'
  },
  {
    name: 'install',
    title: 'Install Pulse',
    subtitle: 'macOS / Windows / Linux',
    site: 'pulse.tld / install'
  },
  {
    name: 'pricing',
    title: 'Pricing',
    subtitle: 'Apache 2.0 — always free',
    site: 'pulse.tld / pricing'
  }
];

// --- SVG template (1200x630, Tokyo Night) ----------------------------------

// Escape the few XML-significant characters in user-supplied text.
const xmlEscape = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const svg = ({ title, subtitle, site }) => `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${xmlEscape(title)} — ${xmlEscape(subtitle)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#1a1b26"/>
      <stop offset="50%"  stop-color="#1f2235"/>
      <stop offset="100%" stop-color="#16161e"/>
    </linearGradient>
    <linearGradient id="border" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#bb9af7"/>
      <stop offset="30%"  stop-color="#7aa2f7"/>
      <stop offset="60%"  stop-color="#7dcfff"/>
      <stop offset="100%" stop-color="#9ece6a"/>
    </linearGradient>
    <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#c0caf5"/>
      <stop offset="100%" stop-color="#bb9af7"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.15" cy="0.2" r="0.6">
      <stop offset="0%"   stop-color="#bb9af7" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#bb9af7" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.85" cy="0.85" r="0.55">
      <stop offset="0%"   stop-color="#7aa2f7" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#7aa2f7" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glowA)"/>
  <rect width="1200" height="630" fill="url(#glowB)"/>

  <!-- Top gradient border (matches nav rule) -->
  <rect x="0" y="0" width="1200" height="6" fill="url(#border)"/>

  <!-- Logo mark (Pulse rings + dot, mirrors <Pulse> header brand) -->
  <g transform="translate(80, 90)">
    <circle cx="32" cy="32" r="22" fill="none" stroke="#bb9af7" stroke-width="3" opacity="0.9"/>
    <circle cx="32" cy="32" r="22" fill="none" stroke="#bb9af7" stroke-width="3" opacity="0.5"/>
    <circle cx="32" cy="32" r="22" fill="none" stroke="#bb9af7" stroke-width="3" opacity="0.25"/>
    <circle cx="32" cy="32" r="14" fill="#bb9af7"/>
    <circle cx="37" cy="29" r="3" fill="#1a1b26"/>
    <text x="76" y="44" font-family="ui-sans-serif, system-ui, sans-serif" font-size="28" font-weight="700" fill="#c0caf5" letter-spacing="3">PULSE</text>
  </g>

  <!-- Title (huge, white → purple) -->
  <text x="80" y="340" font-family="ui-sans-serif, system-ui, sans-serif" font-size="120" font-weight="800" fill="url(#titleGrad)" letter-spacing="-2">${xmlEscape(title)}</text>

  <!-- Subtitle -->
  <text x="80" y="420" font-family="ui-sans-serif, system-ui, sans-serif" font-size="40" font-weight="500" fill="#a9b1d6">${xmlEscape(subtitle)}</text>

  <!-- Footer chip: site path, monospaced, dim -->
  <g transform="translate(80, 540)">
    <rect x="0" y="0" width="280" height="48" rx="24" fill="none" stroke="#2f334d" stroke-width="2"/>
    <text x="140" y="32" font-family="ui-monospace, ui-monospace, monospace" font-size="20" font-weight="500" fill="#7dcfff" text-anchor="middle">${xmlEscape(site)}</text>
  </g>
</svg>`;

// --- Render loop ------------------------------------------------------------

const OUT_DIR = 'public';

await mkdir(OUT_DIR, { recursive: true });

for (const v of variants) {
  const r = new Resvg(svg(v), {
    background: '#1a1b26',
    fitTo: { mode: 'width', value: 1200 },
    font: { loadSystemFonts: true }
  });
  const png = r.render().asPng();
  const out = `${OUT_DIR}/og-${v.name}.png`;
  await writeFile(out, png);
  console.log(`  ok  ${out}  (${png.length} bytes)`);
}

console.log(`\nWrote ${variants.length} OG variants to ${OUT_DIR}/`);
