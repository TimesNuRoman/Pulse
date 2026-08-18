// SPDX-License-Identifier: Apache-2.0
/**
 * R234: tests for the versions SSOT module.
 *
 * Vitest-style suite. Run with:
 *
 *   npx vitest run
 *
 * (The self-contained runner pattern from platformDetect.test.ts is
 * preserved for the legacy file. This file uses vitest's `describe` /
 * `it` / `expect` because vitest 1.6+ rejects files with no test
 * suites. The verification command in the R234 brief is `npx vitest
 * run`, so vitest API is the right choice here.)
 */
import { describe, it, expect } from 'vitest';
import {
  DESKTOP_VERSION,
  ANDROID_VERSION,
  WINDOWS_VERSION,
  MACOS_VERSION,
  LINUX_VERSION,
  RELEASE_CHANNEL,
  WINDOWS_NSIS_URL,
  WINDOWS_MSI_URL,
  ANDROID_APK_URL,
  WINDOWS_NSIS_SIZE_BYTES,
  WINDOWS_MSI_SIZE_BYTES,
  ANDROID_APK_SIZE_BYTES,
  WINDOWS_NSIS_SIZE,
  WINDOWS_MSI_SIZE,
  ANDROID_APK_SIZE,
  WINDOWS_NSIS_SHA256,
  WINDOWS_MSI_SHA256,
  ANDROID_APK_SHA256,
  WINDOWS_NSIS_SHA,
  WINDOWS_MSI_SHA,
  ANDROID_APK_SHA,
  ANDROID_VERSION_CODE,
  SITE_BASE,
  desktopDownloadUrl,
  absoluteDesktopDownloadUrl,
  absoluteAndroidDownloadUrl,
  latestReleaseNotesUrl,
  absoluteReleaseNotesUrl,
  formatSizeMB,
  shortSha,
} from '../versions';

const SEMVER = /^\d+\.\d+\.\d+(-[a-z0-9.]+)?$/;
const HEX_64 = /^[0-9A-F]{64}$/;

const ALL_STRINGS: ReadonlyArray<string> = [
  DESKTOP_VERSION,
  ANDROID_VERSION,
  WINDOWS_VERSION,
  MACOS_VERSION,
  LINUX_VERSION,
  WINDOWS_NSIS_URL,
  WINDOWS_MSI_URL,
  ANDROID_APK_URL,
  WINDOWS_NSIS_SHA256,
  WINDOWS_MSI_SHA256,
  ANDROID_APK_SHA256,
  latestReleaseNotesUrl(),
];

describe('versions SSOT — semver format', () => {
  it.each([
    ['DESKTOP_VERSION', DESKTOP_VERSION],
    ['ANDROID_VERSION', ANDROID_VERSION],
    ['WINDOWS_VERSION', WINDOWS_VERSION],
    ['MACOS_VERSION', MACOS_VERSION],
    ['LINUX_VERSION', LINUX_VERSION],
  ])('%s matches semver', (_name, value) => {
    expect(value).toMatch(SEMVER);
  });

  it('all 5 version constants are non-empty strings', () => {
    for (const v of [DESKTOP_VERSION, ANDROID_VERSION, WINDOWS_VERSION, MACOS_VERSION, LINUX_VERSION]) {
      expect(v).toBeTypeOf('string');
      expect((v as string).length).toBeGreaterThan(0);
    }
  });

  it('desktop platform versions agree on the current release', () => {
    expect(DESKTOP_VERSION).toBe(WINDOWS_VERSION);
    expect(DESKTOP_VERSION).toBe(MACOS_VERSION);
    expect(DESKTOP_VERSION).toBe(LINUX_VERSION);
  });
});

describe('versions SSOT — installer URLs', () => {
  it('WINDOWS_NSIS_URL is a /downloads/ path matching the version', () => {
    expect(WINDOWS_NSIS_URL).toMatch(/^\/downloads\/Pulse_[\d.]+_x64-setup\.exe$/);
    expect(WINDOWS_NSIS_URL).toContain(WINDOWS_VERSION);
  });

  it('WINDOWS_MSI_URL is a /downloads/ path matching the version', () => {
    expect(WINDOWS_MSI_URL).toMatch(/^\/downloads\/Pulse_[\d.]+_x64_en-US\.msi$/);
    expect(WINDOWS_MSI_URL).toContain(WINDOWS_VERSION);
  });

  it('ANDROID_APK_URL is a /downloads/ path matching the version', () => {
    expect(ANDROID_APK_URL).toMatch(/^\/downloads\/pulse-notes-[\d.]+\.apk$/);
    expect(ANDROID_APK_URL).toContain(ANDROID_VERSION);
  });
});

describe('versions SSOT — sizes and SHA-256', () => {
  it('all 3 sizes are positive integers (bytes)', () => {
    for (const sz of [WINDOWS_NSIS_SIZE_BYTES, WINDOWS_MSI_SIZE_BYTES, ANDROID_APK_SIZE_BYTES]) {
      expect(Number.isInteger(sz)).toBe(true);
      expect(sz as number).toBeGreaterThan(0);
    }
  });

  it.each([
    ['WINDOWS_NSIS_SHA256', WINDOWS_NSIS_SHA256],
    ['WINDOWS_MSI_SHA256', WINDOWS_MSI_SHA256],
    ['ANDROID_APK_SHA256', ANDROID_APK_SHA256],
  ])('%s is 64-char uppercase hex', (_name, value) => {
    expect(value).toMatch(HEX_64);
  });

  it('ANDROID_VERSION_CODE is a positive integer', () => {
    expect(Number.isInteger(ANDROID_VERSION_CODE)).toBe(true);
    expect(ANDROID_VERSION_CODE).toBeGreaterThan(0);
  });
});

describe('versions SSOT — release channel', () => {
  it('RELEASE_CHANNEL is "stable"', () => {
    expect(RELEASE_CHANNEL).toBe('stable');
  });
});

describe('versions SSOT — desktopDownloadUrl helper', () => {
  it('returns the Windows NSIS URL', () => {
    expect(desktopDownloadUrl('windows')).toBe(WINDOWS_NSIS_URL);
  });

  it('returns null for macOS (no official build)', () => {
    expect(desktopDownloadUrl('macos')).toBeNull();
  });

  it('returns null for Linux (no official build)', () => {
    expect(desktopDownloadUrl('linux')).toBeNull();
  });
});

describe('versions SSOT — absolute URL helpers', () => {
  it('absoluteDesktopDownloadUrl("windows") = SITE_BASE + WINDOWS_NSIS_URL', () => {
    expect(absoluteDesktopDownloadUrl('windows')).toBe(`${SITE_BASE}${WINDOWS_NSIS_URL}`);
  });

  it('absoluteDesktopDownloadUrl returns null for macOS / Linux', () => {
    expect(absoluteDesktopDownloadUrl('macos')).toBeNull();
    expect(absoluteDesktopDownloadUrl('linux')).toBeNull();
  });

  it('absoluteAndroidDownloadUrl() = SITE_BASE + ANDROID_APK_URL', () => {
    expect(absoluteAndroidDownloadUrl()).toBe(`${SITE_BASE}${ANDROID_APK_URL}`);
  });
});

describe('versions SSOT — latestReleaseNotesUrl', () => {
  it('matches /changelog/#vX.Y.Z and contains the current version', () => {
    const url = latestReleaseNotesUrl();
    expect(url).toMatch(/^\/changelog\/#v\d+\.\d+\.\d+/);
    expect(url).toContain(WINDOWS_VERSION);
  });

  it('absoluteReleaseNotesUrl() = SITE_BASE + latestReleaseNotesUrl()', () => {
    expect(absoluteReleaseNotesUrl()).toBe(`${SITE_BASE}${latestReleaseNotesUrl()}`);
  });
});

describe('versions SSOT — formatting helpers', () => {
  it('formatSizeMB formats bytes as "X.XX MB"', () => {
    expect(formatSizeMB(0)).toBe('0.00 MB');
    expect(formatSizeMB(1024 * 1024)).toBe('1.00 MB');
    expect(formatSizeMB(12900582)).toBe('12.30 MB');
    expect(formatSizeMB(1324461)).toBe('1.26 MB');
  });

  it('shortSha returns "first8…last4" for 64-char hex', () => {
    const fake = 'A'.repeat(64);
    expect(shortSha(fake)).toBe('AAAAAAAA…AAAA');
  });

  it.each([
    ['WINDOWS_NSIS_SIZE', WINDOWS_NSIS_SIZE, WINDOWS_NSIS_SIZE_BYTES],
    ['WINDOWS_MSI_SIZE', WINDOWS_MSI_SIZE, WINDOWS_MSI_SIZE_BYTES],
    ['ANDROID_APK_SIZE', ANDROID_APK_SIZE, ANDROID_APK_SIZE_BYTES],
  ])('%s === formatSizeMB(<bytes>)', (_name, display, bytes) => {
    expect(display).toBe(formatSizeMB(bytes));
  });

  it.each([
    ['WINDOWS_NSIS_SHA', WINDOWS_NSIS_SHA, WINDOWS_NSIS_SHA256],
    ['WINDOWS_MSI_SHA', WINDOWS_MSI_SHA, WINDOWS_MSI_SHA256],
    ['ANDROID_APK_SHA', ANDROID_APK_SHA, ANDROID_APK_SHA256],
  ])('%s === shortSha(<full>)', (_name, short, full) => {
    expect(short).toBe(shortSha(full));
  });
});

describe('versions SSOT — anti-fluff', () => {
  it('no marketing words (roman/lesside/revolutionary/amazing/...) in any exported string', () => {
    // Note: "Pulse" appears legitimately in installer file names
    // (Pulse_0.6.9_x64-setup.exe) — that's the product brand, not
    // marketing fluff. The brand rule catches "Pulse team" / "by
    // author" / first-person copy, not the product name in a file path.
    const FLUFF = /(roman|lesside|revolutionary|amazing|powerful|incredible|best ever|next gen|coming soon|буде|скоро)/i;
    const hits = ALL_STRINGS.filter((s) => FLUFF.test(s));
    expect(hits).toEqual([]);
  });

  it('no brand-rule violations (Pulse team / by author / by Lesside)', () => {
    const BRAND_VIOLATIONS = /(pulse\s+team|pulse-team|by\s+roman|by\s+lesside|pulsesec)/i;
    const hits = ALL_STRINGS.filter((s) => BRAND_VIOLATIONS.test(s));
    expect(hits).toEqual([]);
  });

  it('no first-person ("we" / "I" / "мы" / "я") in any exported string', () => {
    const FIRST_PERSON = /\b(we|I'll|I'm|мы|я)\b/i;
    const hits = ALL_STRINGS.filter((s) => FIRST_PERSON.test(s));
    expect(hits).toEqual([]);
  });

  it('no emoji in any exported string', () => {
    const EMOJI = /\p{So}/u;
    const hits = ALL_STRINGS.filter((s) => EMOJI.test(s));
    expect(hits).toEqual([]);
  });

  it('no $ in any exported string (HR10 / no money in source)', () => {
    const hits = ALL_STRINGS.filter((s) => s.includes('$'));
    expect(hits).toEqual([]);
  });

  it('no localhost / 127.0.0.1 in any exported string', () => {
    const hits = ALL_STRINGS.filter((s) => /localhost|127\.0\.0\.1/.test(s));
    expect(hits).toEqual([]);
  });
});
