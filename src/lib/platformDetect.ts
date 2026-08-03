// SPDX-License-Identifier: Apache-2.0
/**
 * R184: pure platform-detection helper for the smart-download CTA on
 * `/download/`. No DOM access — the caller injects the UA, UA-CH, viewport
 * width, and a touch hint. Kept pure so it can be unit-tested with
 * hand-rolled inputs (no happy-dom, no jsdom).
 *
 * The browser-side `<script is:inline>` on `/download/` mirrors this
 * logic. **Must stay in sync with that mirror** — see the comment block
 * at the top of `src/pages/download.astro` for the duplication contract.
 */

export type Platform = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'unknown';

export type Confidence = 'high' | 'medium' | 'low';

export type Source = 'userAgentData' | 'navigatorUA' | 'viewport';

export interface DetectInput {
  userAgent?: string;
  userAgentData?: { platform?: string; mobile?: boolean };
  viewportWidth?: number;
  isTouch?: boolean;
}

export interface DetectResult {
  platform: Platform;
  confidence: Confidence;
  source: Source;
}

/** Internal constant aliases — keep the code dense without losing clarity. */
const HIGH: Confidence = 'high';
const MED: Confidence = 'medium';
const LOW: Confidence = 'low';

/**
 * Returns the most likely platform for the visitor. Sources are tried in
 * priority order: User-Agent Client Hints → legacy UA string → viewport
 * hint. When nothing matches, returns `unknown` with `low` confidence.
 *
 * The order inside step 2 matters: iOS must be checked before macOS
 * (iPadOS 13+ desktop UA contains `Mac OS X`), and Android before Linux
 * (Android UAs also contain `Linux`).
 */
export function detectPlatform(input: DetectInput): DetectResult {
  // 1) User-Agent Client Hints (Chromium / Edge / Opera desktop + mobile).
  const uadPlatform = input.userAgentData?.platform;
  if (uadPlatform) {
    if (uadPlatform === 'Windows') return { platform: 'windows', confidence: HIGH, source: 'userAgentData' };
    if (uadPlatform === 'macOS')  return { platform: 'macos',  confidence: HIGH, source: 'userAgentData' };
    if (uadPlatform === 'Linux')  return { platform: 'linux',  confidence: HIGH, source: 'userAgentData' };
    if (uadPlatform === 'Android') return { platform: 'android', confidence: HIGH, source: 'userAgentData' };
    if (uadPlatform === 'iOS')    return { platform: 'ios',    confidence: HIGH, source: 'userAgentData' };
    // Chrome OS: no dedicated build; the AppImage route is the closest
    // match and is already a Linux binary at runtime.
    if (uadPlatform === 'Chrome OS') return { platform: 'linux', confidence: MED, source: 'userAgentData' };
  }

  // 2) Legacy UA string. iOS before macOS, Android before Linux.
  const ua = input.userAgent ?? '';
  if (/\bWindows NT\b/i.test(ua)) {
    return { platform: 'windows', confidence: HIGH, source: 'navigatorUA' };
  }
  if (/\b(iPhone|iPad|iPod)\b/i.test(ua)) {
    return { platform: 'ios', confidence: HIGH, source: 'navigatorUA' };
  }
  if (/\bAndroid\b/i.test(ua)) {
    return { platform: 'android', confidence: HIGH, source: 'navigatorUA' };
  }
  if (/\b(Mac OS X|Macintosh)\b/i.test(ua)) {
    return { platform: 'macos', confidence: HIGH, source: 'navigatorUA' };
  }
  if (/\bLinux|X11\b/i.test(ua)) {
    // Desktop Linux is uncommon as a Pulse target but the AppImage is
    // Linux-native, so this confidence is "medium" rather than "high".
    return { platform: 'linux', confidence: MED, source: 'navigatorUA' };
  }

  // 3) Viewport fallback — only credible as a mobile hint. A narrow
  // viewport with coarse pointer is a phone or small tablet.
  const narrow = typeof input.viewportWidth === 'number' && input.viewportWidth < 600;
  if (narrow && input.isTouch) {
    return { platform: 'unknown', confidence: LOW, source: 'viewport' };
  }

  return { platform: 'unknown', confidence: LOW, source: 'navigatorUA' };
}
