// SPDX-License-Identifier: Apache-2.0
/**
 * R239: tests for the releases data SSOT module.
 *
 * Vitest-style suite. Run with:
 *
 *   npx vitest run src/data/__tests__/releases.test.ts
 *
 * or:
 *
 *   npx vitest run
 *
 * The legacy `src/lib/__tests__/platformDetect.test.ts` is a
 * pre-existing main-branch self-contained runner (R184) that does
 * not use vitest's `describe` / `it` / `expect` API; vitest 4
 * silently skips it during auto-discovery. This file follows the
 * R234 pattern (proper vitest API) so it is always picked up.
 *
 * Coverage (15 cases):
 *   1.  LATEST_DESKTOP_VERSION is "0.6.9"
 *   2.  LATEST_ANDROID_VERSION is "0.6.9"
 *   3.  getReleasesByChannel('desktop') returns a non-empty array
 *   4.  getReleasesByChannel('android') returns a non-empty array
 *   5.  both arrays are sorted newest-first by date
 *   6.  getReleaseByVersion('desktop', '0.6.9') returns the 0.6.9 entry
 *   7.  getReleaseByVersion('desktop', '99.99.99') returns undefined
 *   8.  getLatestRelease('desktop') matches LATEST_DESKTOP_VERSION
 *   9.  getFeaturedReleases() returns at least 1 entry
 *   10. RELEASES_TOTAL equals releases.desktop.length + releases.android.length
 *   11. all entries have a valid ISO 8601 date
 *   12. all entries match a strict semver pattern
 *   13. all summary strings are free of emoji
 *   14. all bullets are free of emoji + marketing fluff
 *   15. featured is set on at least 1 entry per channel
 */
import { describe, it, expect } from 'vitest';
import {
  LATEST_DESKTOP_VERSION,
  LATEST_ANDROID_VERSION,
  RELEASES_TOTAL,
  releases,
  getReleasesByChannel,
  getReleaseByVersion,
  getLatestRelease,
  getFeaturedReleases,
  type ReleaseEntry,
  type ReleaseChannel,
} from '../releases';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SEMVER = /^\d+\.\d+\.\d+$/;
const EMOJI = /\p{Extended_Pictographic}|\p{So}/u;
const MARKETING = /(roman|lesside|revolutionary|amazing|powerful|incredible|best ever|next gen|coming soon|буде|скоро|free forever|open source|apache 2\.0)/i;
const FIRST_PERSON = /\b(we|I'll|I'm|мы|я)\b/i;
const BRAND_VIOLATION = /(pulse\s+team|pulse-team|by\s+roman|by\s+lesside|pulsesec)/i;

const ALL_ENTRIES: readonly ReleaseEntry[] = [...releases.desktop, ...releases.android];
const CHANNELS: readonly ReleaseChannel[] = ['desktop', 'android'];

describe('releases SSOT — latest version constants', () => {
  it('LATEST_DESKTOP_VERSION is "0.6.9"', () => {
    expect(LATEST_DESKTOP_VERSION).toBe('0.6.9');
  });

  it('LATEST_ANDROID_VERSION is "0.6.9"', () => {
    expect(LATEST_ANDROID_VERSION).toBe('0.6.9');
  });
});

describe('releases SSOT — getReleasesByChannel', () => {
  it('returns a non-empty array for desktop', () => {
    const list = getReleasesByChannel('desktop');
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it('returns a non-empty array for android', () => {
    const list = getReleasesByChannel('android');
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it('both channels are sorted newest-first by date', () => {
    for (const channel of CHANNELS) {
      const list = getReleasesByChannel(channel);
      for (let i = 1; i < list.length; i++) {
        const prev = list[i - 1].date;
        const cur = list[i].date;
        expect(prev >= cur).toBe(true);
      }
    }
  });
});

describe('releases SSOT — getReleaseByVersion', () => {
  it('returns the 0.6.9 desktop entry', () => {
    const entry = getReleaseByVersion('desktop', '0.6.9');
    expect(entry).toBeDefined();
    expect(entry?.version).toBe('0.6.9');
    expect(entry?.channel).toBe('desktop');
  });

  it('returns undefined for a non-existent version', () => {
    expect(getReleaseByVersion('desktop', '99.99.99')).toBeUndefined();
  });
});

describe('releases SSOT — getLatestRelease', () => {
  it('matches LATEST_DESKTOP_VERSION', () => {
    const latest = getLatestRelease('desktop');
    expect(latest.version).toBe(LATEST_DESKTOP_VERSION);
  });

  it('matches LATEST_ANDROID_VERSION', () => {
    const latest = getLatestRelease('android');
    expect(latest.version).toBe(LATEST_ANDROID_VERSION);
  });
});

describe('releases SSOT — getFeaturedReleases', () => {
  it('returns at least 1 entry', () => {
    const featured = getFeaturedReleases();
    expect(featured.length).toBeGreaterThan(0);
  });

  it('all returned entries have featured=true', () => {
    const featured = getFeaturedReleases();
    for (const entry of featured) {
      expect(entry.featured).toBe(true);
    }
  });

  it('returns entries sorted newest-first by date', () => {
    const featured = getFeaturedReleases();
    for (let i = 1; i < featured.length; i++) {
      const prev = featured[i - 1].date;
      const cur = featured[i].date;
      expect(prev >= cur).toBe(true);
    }
  });
});

describe('releases SSOT — RELEASES_TOTAL', () => {
  it('equals the sum of per-channel lengths', () => {
    expect(RELEASES_TOTAL).toBe(releases.desktop.length + releases.android.length);
  });
});

describe('releases SSOT — per-entry invariants', () => {
  it('all entries have a valid ISO 8601 date', () => {
    for (const entry of ALL_ENTRIES) {
      expect(entry.date).toMatch(ISO_DATE);
      // Spot-check that the date parses to a real Date (catches 2026-13-40 etc).
      const d = new Date(entry.date);
      expect(Number.isNaN(d.getTime())).toBe(false);
    }
  });

  it('all entries match strict semver', () => {
    for (const entry of ALL_ENTRIES) {
      expect(entry.version).toMatch(SEMVER);
    }
  });

  it('all summary strings are free of emoji', () => {
    const hits = ALL_ENTRIES.filter((e) => EMOJI.test(e.summary));
    expect(hits).toEqual([]);
  });

  it('all bullet arrays are free of emoji + marketing + first-person + brand violations', () => {
    for (const entry of ALL_ENTRIES) {
      expect(entry.bullets.length).toBeGreaterThanOrEqual(2);
      for (const bullet of entry.bullets) {
        expect(EMOJI.test(bullet)).toBe(false);
        expect(MARKETING.test(bullet)).toBe(false);
        expect(FIRST_PERSON.test(bullet)).toBe(false);
        expect(BRAND_VIOLATION.test(bullet)).toBe(false);
      }
    }
  });

  it('featured is set on at least 1 entry per channel', () => {
    for (const channel of CHANNELS) {
      const featuredCount = releases[channel].filter((e) => e.featured).length;
      expect(featuredCount).toBeGreaterThanOrEqual(1);
    }
  });
});
