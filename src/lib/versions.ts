// SPDX-License-Identifier: Apache-2.0
/**
 * R234: single source of truth for Pulse version strings.
 *
 * Before this round, the site had hardcoded version strings in 10+
 * .astro files: download URLs, footer version pills, hero trust blocks,
 * JSON-LD `softwareVersion`, etc. Every version bump became a
 * search-replace marathon (R213, R216, R219, R222, R225, R228, R231 —
 * seven rounds of stale-URL drift, all caused by the same structural
 * defect: no SSOT).
 *
 * This module is the fix. It reads `latest_version` and the installer
 * URLs from `public/updates/{desktop,android}.json` at build time
 * (Astro / Vite's static JSON import — no fetch, no runtime, no env
 * var) and re-exports them as typed constants and helpers.
 *
 * The "version bump" workflow is now: edit the JSON, run
 * `npm run build`. That's it. No search-replace across the site.
 *
 * Hard rules: no emoji, no first-person, no marketing fluff, dark-only,
 * Apache-2.0 SPDX, no future promises, no prices.
 */

import desktopManifest from '../../public/updates/desktop.json';
import androidManifest from '../../public/updates/android.json';

export type ReleaseChannel = 'stable' | 'beta' | 'nightly';
export type DesktopPlatform = 'windows' | 'macos' | 'linux';

// ─── Version constants ─────────────────────────────────────────────
/** Current desktop build version. */
export const DESKTOP_VERSION: string = desktopManifest.latest_version;
/** Current Android APK version. */
export const ANDROID_VERSION: string = androidManifest.latest_version;
/** Windows desktop version. Same as DESKTOP_VERSION today; separate
 *  constant in case Windows ever ships a different cadence. */
export const WINDOWS_VERSION: string = DESKTOP_VERSION;
/** macOS source-build version. Same as DESKTOP_VERSION — the build is
 *  from-source for the current release, no separate version number. */
export const MACOS_VERSION: string = DESKTOP_VERSION;
/** Linux source-build version. Same logic as macOS. */
export const LINUX_VERSION: string = DESKTOP_VERSION;

/** Current release channel. Hardcoded to "stable" — the JSON doesn't
 *  track pre-release channels today, but the type leaves room. */
export const RELEASE_CHANNEL: ReleaseChannel = 'stable';

// ─── Installer URLs (relative paths; the JSON stores them so) ──────
/** Windows NSIS installer (per-user, default). Relative path. */
export const WINDOWS_NSIS_URL: string = desktopManifest.latest_nsis_url;
/** Windows MSI installer (per-machine, for IT admins). Relative path. */
export const WINDOWS_MSI_URL: string = desktopManifest.latest_msi_url;
/** Windows portable binary (no installer wrapper). Relative path. */
export const WINDOWS_PORTABLE_URL: string = desktopManifest.latest_binary_url;
/** Android APK. The JSON stores a full https URL; we strip the host
 *  so every URL constant in this module has the same shape (relative). */
export const ANDROID_APK_URL: string = androidManifest.latest_apk_url.replace(
  /^https?:\/\/[^/]+/,
  '',
);

// ─── File sizes (bytes) ────────────────────────────────────────────
export const WINDOWS_NSIS_SIZE_BYTES: number = desktopManifest.latest_nsis_size_bytes;
export const WINDOWS_MSI_SIZE_BYTES: number = desktopManifest.latest_msi_size_bytes;
export const WINDOWS_PORTABLE_SIZE_BYTES: number = desktopManifest.latest_binary_size_bytes;
export const ANDROID_APK_SIZE_BYTES: number = androidManifest.latest_apk_size_bytes;

// ─── SHA-256 fingerprints (full 64-char hex) ───────────────────────
export const WINDOWS_NSIS_SHA256: string = desktopManifest.latest_nsis_sha256;
export const WINDOWS_MSI_SHA256: string = desktopManifest.latest_msi_sha256;
export const WINDOWS_PORTABLE_SHA256: string = desktopManifest.latest_binary_sha256;
export const ANDROID_APK_SHA256: string = androidManifest.latest_apk_sha256;

// ─── Android specifics ─────────────────────────────────────────────
export const ANDROID_VERSION_CODE: number = androidManifest.latest_version_code;
export const ANDROID_APP_ID: string = 'app.pulse.notes';
export const ANDROID_MIN_SDK: number = 24;
export const ANDROID_TARGET_SDK: number = 36;

// ─── Windows specifics ─────────────────────────────────────────────
export const WINDOWS_MIN_OS: string = 'Windows 10 (build 17763)';
export const WINDOWS_BUILD_TARGET: string = 'x86_64-pc-windows-msvc';

/** Site base for absolute URL construction. Read once at module load;
 *  the SSOT for "where Pulse is hosted" lives in astro.config.mjs's
 *  `site` field, but the JSON URLs are the SSOT for installer paths. */
export const SITE_BASE: string = 'https://ownlocalml.com';

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Returns the primary download URL for a desktop platform. All returned
 * URLs are RELATIVE (start with `/downloads/`).
 *
 * - `windows` → NSIS installer (the default installer).
 * - `macos` / `linux` → `null` (no official build today; consumers
 *   should render the "build from source" message + GitHub link).
 *
 * For the Windows MSI variant, use `WINDOWS_MSI_URL` directly.
 * For Android, use `ANDROID_APK_URL` directly.
 *
 * @example
 *   desktopDownloadUrl('windows') // '/downloads/Pulse_0.6.9_x64-setup.exe'
 *   desktopDownloadUrl('macos')   // null
 */
export function desktopDownloadUrl(platform: DesktopPlatform): string | null {
  if (platform === 'windows') {
    return WINDOWS_NSIS_URL;
  }
  return null;
}

/**
 * Returns the absolute download URL (with the site base prepended).
 * Returns `null` for platforms without an official build.
 */
export function absoluteDesktopDownloadUrl(platform: DesktopPlatform): string | null {
  const rel = desktopDownloadUrl(platform);
  return rel === null ? null : `${SITE_BASE}${rel}`;
}

/** Returns the absolute Android APK download URL. */
export function absoluteAndroidDownloadUrl(): string {
  return `${SITE_BASE}${ANDROID_APK_URL}`;
}

/** Returns the changelog URL for the current release (relative). */
export function latestReleaseNotesUrl(): string {
  return desktopManifest.release_notes_url;
}

/** Returns the absolute changelog URL. */
export function absoluteReleaseNotesUrl(): string {
  return `${SITE_BASE}${latestReleaseNotesUrl()}`;
}

// ─── Formatting helpers ───────────────────────────────────────────

/** Formats a byte count as "X.XX MB" with 2 decimal places. */
export function formatSizeMB(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** Formats a 64-char SHA-256 as "first8…last4" for compact UI display. */
export function shortSha(sha: string): string {
  return `${sha.slice(0, 8)}…${sha.slice(-4)}`;
}

/** Pre-formatted display strings (re-evaluated on module load, so
 *  they always match the latest JSON bytes). */
export const WINDOWS_NSIS_SIZE: string = formatSizeMB(WINDOWS_NSIS_SIZE_BYTES);
export const WINDOWS_MSI_SIZE: string = formatSizeMB(WINDOWS_MSI_SIZE_BYTES);
export const WINDOWS_PORTABLE_SIZE: string = formatSizeMB(WINDOWS_PORTABLE_SIZE_BYTES);
export const ANDROID_APK_SIZE: string = formatSizeMB(ANDROID_APK_SIZE_BYTES);
export const WINDOWS_NSIS_SHA: string = shortSha(WINDOWS_NSIS_SHA256);
export const WINDOWS_MSI_SHA: string = shortSha(WINDOWS_MSI_SHA256);
export const WINDOWS_PORTABLE_SHA: string = shortSha(WINDOWS_PORTABLE_SHA256);
export const ANDROID_APK_SHA: string = shortSha(ANDROID_APK_SHA256);
