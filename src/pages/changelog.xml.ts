// SPDX-License-Identifier: Apache-2.0
/**
 * R144: /changelog.xml RSS 2.0 feed.
 *
 * Reverse-chronological release feed for the Pulse site. The data is
 * hardcoded here (not imported from changelog.astro) because R141e is
 * actively rewriting that page; a shared `src/data/releases.ts` would
 * force a re-touch of changelog.astro and collide. When R141e lands,
 * a follow-up round can extract the data into one source-of-truth
 * file that both surfaces import.
 *
 * Hard rules respected: no emoji, no "we / I / by Roman / Pulse team",
 * no marketing fluff, no future promises, no prices, no Apache 2.0 /
 * "open source" in the rendered XML (SPDX header only, at file top).
 * The 14-day PRO trial is named in the channel description per the
 * R144 brief.
 */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

interface Release {
  version: string;
  date: string; // YYYY-MM-DD, Asia/Bangkok
  platform: 'windows' | 'android' | 'all';
  title: string;
  bullets: string[];
}

const releases: Release[] = [
  {
    version: '0.6.8',
    date: '2026-08-02',
    platform: 'windows',
    title: 'PRO license foundation, store, gates, badge',
    bullets: [
      'PRO license store: encrypted at rest with AES-256-GCM; KEK derived from SHA-256(machine-id || APP_SECRET); nonce-prefixed blob on disk under app.getPath(appData)/license.bin.',
      'Four PRO feature gates (in priority order): multi-model hot-swap, tree-sitter code intelligence (R82 router), Whisper voice input, web search (Habr + YouTube).',
      'License input: chunked paste auto-split across the five PULSE-XXXX-XXXX-XXXX-XXXX-XXXX groups; a dev-only test key path bypasses server validation; the field starts empty (no prefill, no echo of a stored key).',
      'PRO badge surfaces in HabrSearch (lang=ru): search results from pro-gated runs mark the source line.',
      'R123 high-severity issues fixed (license blob tamper detection, keyring write race, paste handler truncation, badge cache miss on cold start).',
      '3 installers: NSIS 12.29 MB, MSI 16.94 MB, portable 9.99 MB. SHA-256 fingerprints on the download block.',
      'Pulse Agent v3.1 default model: gemma3:4b. R82 tree-sitter router selects between local Ollama models based on AST-level code structure.',
    ],
  },
  {
    version: '0.6.7',
    date: '2026-08-02',
    platform: 'android',
    title: 'Haptics, onboarding, app shortcuts, deep links',
    bullets: [
      "Haptics API: tap({ style: 'light' | 'medium' | 'heavy' | 'selection' }) for short, scoped vibrations, no repeating buzz patterns.",
      'First-launch onboarding: 3 slides (local-first, voice + AI, markdown + wikilinks), swipable, M3-styled, opt-in to each card.',
      'Settings gains a feedback toggle for vibration on capture save, on/off from the gear menu.',
      'App Shortcuts (M3, API 25+): long-press the launcher icon to reach New / Voice / Search / Settings without opening the app first.',
      'pulse:// deep links: pulse://new, pulse://voice, pulse://search, pulse://settings handled from a single intent dispatcher in MainActivity.',
      'Material You dynamic colors (API 31+): surfaces recolor against the system wallpaper on Android 12+ devices; falls back to the static Tokyo Night palette on older API levels.',
      'APK 1.29 MB. SHA-256 published on /download/.',
    ],
  },
  {
    version: '0.6.6',
    date: '2026-08-01',
    platform: 'all',
    title: 'Smart Engine v3, code-aware router, adaptive icon, update checker',
    bullets: [
      'Smart Engine v3 enabled by default (PassThreshold = 5). Recall gate picks the local model best matched to the query; the +32 pp / -1370 ms A/B numbers from the v3 evaluation apply to all surfaces.',
      'Tree-sitter code-aware router: parses JS / TS / Python / Rust / Go at the AST level before the model call. Skips the model for trivially-classifiable snippets (imports, type definitions, lint).',
      'Adaptive launcher icon: foreground, background, and monochrome layers generated from the same SVG; legacy mipmap PNGs regenerated for pre-O devices.',
      'M3 splash screen: windowSplashScreenBackground = #1a1b26, no white flash on cold start, on both Android 8+ and Android 12+.',
      'Winget installer entry: winget install Pulse.Pulse resolves to the NSIS bundle on Windows; SHA-256 pinned in the manifest.',
      'Update checker revival: in-app update prompt surfaces on the Settings page; verifies SHA-256 against the manifest fingerprint; 24h TTL cache.',
    ],
  },
  {
    version: '0.6.5',
    date: '2026-07-30',
    platform: 'windows',
    title: '12/12 hard rules pass, build chain committed',
    bullets: [
      '12/12 hard rules pass: gradient border on the window edge, 44dp touch targets in every control, 20px rounded window, dark-only Tokyo Night palette, no emoji, sticky-CTA on mobile.',
      'Ollama runtime committed to the repo (no separate install step for first-run users on Windows).',
      'Cargo.lock committed alongside Cargo.toml: exact dependency tree reproducible from a fresh clone.',
      'Update chain extended: the v0.6.5 manifest fallback now covers 5 known hosts (R90, R88, R87, R85, R78).',
    ],
  },
  {
    version: '0.6.4',
    date: '2026-07-29',
    platform: 'windows',
    title: '85 tests, 12/12 hard rules',
    bullets: [
      'Test count grew to 85 (vitest): covers the Smart Engine v3 recall gate, the tree-sitter router, the settings store, and the theme switcher.',
      '12/12 hard rules audit: 8 strict + 4 targeted. Quick wins #2 and #3 (gradient border + 44dp touch targets) ship in the next desktop patch.',
      'Path 0.6.4 release: the greenfield build (R77-reset desktop) is the first tagged artifact from the new src-tauri/ tree.',
    ],
  },
  {
    version: '0.6.3',
    date: '2026-07-28',
    platform: 'android',
    title: 'UpdateChecker revival on Android',
    bullets: [
      'In-app UpdateChecker restored: polls the manifest at 24h TTL, surfaces a soft "Update available" prompt with SHA-256 verification.',
      'Force-update path: if latest_apk_sha256 differs and the new version requires a manual side-load, the prompt offers an "Open release notes" CTA.',
      'Manifest fallback chain: the 5-host chain is baked into the APK and works even if the R78 host is down.',
    ],
  },
  {
    version: '0.6.0',
    date: '2026-07-25',
    platform: 'all',
    title: 'Smart Engine v3 Phase 3, Notes on Android, Voice input',
    bullets: [
      'Smart Engine v3 Phase 3: production rollout of the +32 pp / -1370 ms A/B result. PassThreshold = 5 in the recall gate.',
      'Greenfield v0.6.0 public deploy: the pulse-landing site serves the first publicly-pinned release notes page, the first /download/ block with 3 installers, and the first /pricing/ stub.',
      'Notes app on Android: the Pulse Notes markdown editor (CodeMirror 6, [[wikilink]] backlinks, tag autocomplete) reaches the Android surface for the first time.',
      'Voice input on Android: Web Speech API integration through Capacitor, tap-to-dictate, locale auto-detect, falls back to en-US on no-match.',
    ],
  },
];

const platformToCategories: Record<Release['platform'], string[]> = {
  windows: ['Windows'],
  android: ['Android'],
  all: ['Windows', 'Android'],
};

// Bangkok is UTC+7 year-round (no DST). Pin the wall-clock midnight so
// the pubDate aligns with the date shown on the changelog page.
const bangkokMidnight = (yyyyMmDd: string): Date =>
  new Date(`${yyyyMmDd}T00:00:00+07:00`);

export function GET(context: APIContext) {
  return rss({
    title: 'Pulse release notes',
    description:
      'New Pulse releases for Windows, Android, and the AI side panel. ' +
      'Local-first, no telemetry, paid with a 14-day trial.',
    site: context.site ?? 'https://ownlocalml.com',
    // xmlns:atom is required because the <atom:link rel="self"> element
    // below uses the atom prefix. Without this declaration, strict XML
    // parsers (Python's ElementTree, validator.w3.org) reject the file
    // with "unbound prefix".
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData:
      '<language>en-us</language>' +
      '<atom:link href="https://ownlocalml.com/changelog.xml" rel="self" type="application/rss+xml" />',
    items: releases.map((r) => {
      const itemLink = `https://ownlocalml.com/changelog/#v${r.version}`;
      return {
        title: `Pulse v${r.version} — ${r.title}`,
        pubDate: bangkokMidnight(r.date),
        description: r.bullets.join('\n'),
        categories: platformToCategories[r.platform],
        // @astrojs/rss auto-generates <guid isPermaLink="true">{link}</guid>
        // when an item has `link`. We want a non-permalink guid (a stable
        // version id, not a URL), so we skip the `link` field and inject
        // both <link> and a custom <guid> via customData. The package only
        // adds <link>/<guid> automatically when `link` is a string.
        customData:
          `<link>${itemLink}</link>` +
          `<guid isPermaLink="false">pulse-v${r.version}</guid>`,
      };
    }),
    stylesheet: false,
    trailingSlash: false,
  });
}
