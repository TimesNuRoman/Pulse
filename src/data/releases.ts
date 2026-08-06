// SPDX-License-Identifier: Apache-2.0
/**
 * R239: single source of truth for Pulse release content data.
 *
 * R234 already shipped `src/lib/versions.ts` for version constants
 * (installer URLs, file sizes, SHA-256 fingerprints, version strings).
 * That module reads the `latest_version` and `latest_*_url` fields from
 * `public/updates/{desktop,android}.json`. R239 is the parallel for
 * the editorial content: release notes entries, dates, summaries,
 * bullets, and the `featured` flag that drives the home page
 * spotlight.
 *
 * Before this round, release content was inline-hardcoded in
 * `src/pages/changelog.astro` (7 hand-written entries) and
 * `src/pages/changelog.xml.ts` (its own 7-entry inline copy for the
 * RSS feed). Every new release meant two parallel edits. After R239,
 * the JSON files are the SSOT; both surfaces read from there.
 *
 * Workflow for a new release:
 *   1. Bump version constants in `public/updates/{desktop,android}.json`
 *      (`latest_version`, the size + SHA fields, the `versions[]` array).
 *   2. Prepend a new entry to the `releases[]` array in the same JSON.
 *   3. Run `npm run build`. Done. The /changelog/ page picks it up
 *      automatically; the home page spotlight follows the `featured`
 *      flag.
 *
 * Hard rules: no emoji, no first-person, no marketing fluff, dark-only,
 * Apache-2.0 SPDX, no future promises, no prices, no money tokens.
 *
 * R242: the name `ReleaseChannel` here (R239) is intentionally distinct
 * from R234's `ReleaseTrack` (`src/lib/versions.ts`, which uses
 * `'stable' | 'beta' | 'nightly'` for the installer track). R242
 * renamed R234's type to `ReleaseTrack` to remove the prior collision
 * that this module documented at R239 time. Semantic: R239's
 * `ReleaseChannel` = which product (`'desktop' | 'android'`);
 * R234's `ReleaseTrack` = which channel of the same build
 * (`'stable' | 'beta' | 'nightly'`).
 */

import desktopManifest from '../../public/updates/desktop.json';
import androidManifest from '../../public/updates/android.json';

// === Types ========================================================

/**
 * Which product a release belongs to.
 *
 * R234's `versions.ts` exports a `ReleaseTrack` type (R242 rename
 * from `ReleaseChannel` to avoid the collision this module's JSDoc
 * originally flagged). Semantic split:
 *   R239 `ReleaseChannel` here = which product (`'desktop' | 'android'`).
 *   R234 `ReleaseTrack`        = which channel of the same build
 *                                 (`'stable' | 'beta' | 'nightly'`).
 */
export type ReleaseChannel = 'desktop' | 'android';

/** UI display hint: how prominent the release is. Major renders as a
 *  card with a border; minor as a compact bullet list. Derived from
 *  semver at entry-write time, not auto-computed, because the
 *  "major" / "minor" judgement is editorial (a 0.6.7 patch is still
 *  `major` in the UI if the team decides it ships a flagship change). */
export type ReleaseType = 'major' | 'minor';

export interface ReleaseEntry {
  /** ISO 8601 date string, e.g. "2026-08-04". */
  date: string;
  /** Semver string, e.g. "0.6.9". */
  version: string;
  /** Editorial channel — matches the JSON file the entry came from. */
  channel: ReleaseChannel;
  /** UI display class. Major = card, minor = compact list. */
  type: ReleaseType;
  /** Short headline (3-8 words). Rendered as the entry's `h2`/lede. */
  title: string;
  /** 1-line plain-text summary, no marketing fluff, no emoji, no
   *  first-person, no Markdown, no HTML. */
  summary: string;
  /** 2-5 bullet points — features/fixes. Plain text, no Markdown. */
  bullets: readonly string[];
  /** Optional URL to a more detailed release-notes page or
   *  /changelog/#vX.Y.Z anchor. */
  url?: string;
  /** Whether this is a "Latest" / "Featured" release. Drives the
   *  home page spotlight and the "what changed recently" widget. */
  featured: boolean;
}

/** Per-channel release list, newest first. */
export interface ReleasesData {
  desktop: readonly ReleaseEntry[];
  android: readonly ReleaseEntry[];
}

// === Data =========================================================

/**
 * The full release list per channel. The JSON files are the SSOT;
 * this module re-exports them with strict typing and read-only
 * accessors. Order in the JSON is "newest first" (array index 0
 * is the most recent). Helpers below preserve that invariant.
 */
export const releases: ReleasesData = {
  desktop: desktopManifest.releases as readonly ReleaseEntry[],
  android: androidManifest.releases as readonly ReleaseEntry[],
};

// === Constants ====================================================

/** Latest desktop version (always `releases.desktop[0].version`).
 *  The version string is the SSOT for everything that needs to
 *  know the current build (download CTAs, JSON-LD, footer pills). */
export const LATEST_DESKTOP_VERSION: string = releases.desktop[0].version;

/** Latest Android version. Same semantic as LATEST_DESKTOP_VERSION. */
export const LATEST_ANDROID_VERSION: string = releases.android[0].version;

/** Total number of release entries across both channels. */
export const RELEASES_TOTAL: number = releases.desktop.length + releases.android.length;

// === Query helpers ================================================

/**
 * Returns the full release list for a channel, newest first.
 * The returned array is the same reference as `releases[channel]`
 * (no copy, no clone) — callers must not mutate it.
 */
export function getReleasesByChannel(channel: ReleaseChannel): readonly ReleaseEntry[] {
  return releases[channel];
}

/**
 * Returns the release entry for a specific (channel, version) pair,
 * or `undefined` if no entry matches. Useful for per-version pages
 * and deep-link anchors.
 */
export function getReleaseByVersion(
  channel: ReleaseChannel,
  version: string,
): ReleaseEntry | undefined {
  return releases[channel].find((r) => r.version === version);
}

/**
 * Returns the latest (newest) release for a channel.
 * Throws if the channel has no entries — this is a build-time
 * invariant: an empty release list is a data error, not a runtime
 * state to recover from.
 */
export function getLatestRelease(channel: ReleaseChannel): ReleaseEntry {
  const list = releases[channel];
  if (list.length === 0) {
    throw new Error(
      `[releases] getLatestRelease: channel '${channel}' has no entries. ` +
        `This is a data error — check public/updates/${channel}.json's releases array.`,
    );
  }
  return list[0];
}

/**
 * Returns all `featured: true` entries from both channels, sorted
 * newest first (by date, descending). Drives the home page
 * "what's new" spotlight and the cross-channel rollup widget.
 */
export function getFeaturedReleases(): readonly ReleaseEntry[] {
  return [...releases.desktop, ...releases.android]
    .filter((r) => r.featured)
    .slice() // copy before sort — don't mutate the source arrays
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
