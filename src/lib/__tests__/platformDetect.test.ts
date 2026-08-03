// SPDX-License-Identifier: Apache-2.0
/**
 * R184: tests for the pure `detectPlatform` helper.
 *
 * The landing project does not bundle vitest (R180 brief: "no test
 * suite"), so this file is a self-contained runner. No imports beyond
 * the helper under test. Run with:
 *
 *   npx tsx src/lib/__tests__/platformDetect.test.ts
 *
 * or, on Node 22+:
 *
 *   node --experimental-strip-types src/lib/__tests__/platformDetect.test.ts
 *
 * The exit code is 0 on full pass, 1 on any failure. Each case names
 * the UA it exercises so a failure points at the right hypothesis.
 */
import { detectPlatform } from '../platformDetect';

let pass = 0;
let fail = 0;

function ok(name: string, cond: boolean, detail?: unknown): void {
  if (cond) {
    console.log(`  ok  ${name}`);
    pass++;
  } else {
    console.log(`FAIL  ${name}${detail !== undefined ? ' — ' + JSON.stringify(detail) : ''}`);
    fail++;
  }
}

function eq<T>(name: string, actual: T, expected: T): void {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  ok(name, a === e, a === e ? undefined : { actual: a, expected: e });
}

// ─── 1. Windows ──────────────────────────────────────────────────────
eq(
  'Win10/11 Chrome UA -> windows (high, navigatorUA)',
  detectPlatform({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' }),
  { platform: 'windows', confidence: 'high', source: 'navigatorUA' }
);
eq(
  'Win11 Edge UA -> windows (high)',
  detectPlatform({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0' }),
  { platform: 'windows', confidence: 'high', source: 'navigatorUA' }
);

// ─── 2. macOS ────────────────────────────────────────────────────────
eq(
  'macOS Safari 17 UA -> macos (high)',
  detectPlatform({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15' }),
  { platform: 'macos', confidence: 'high', source: 'navigatorUA' }
);

// ─── 3. Linux ────────────────────────────────────────────────────────
eq(
  'Linux desktop UA -> linux (medium)',
  detectPlatform({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' }),
  { platform: 'linux', confidence: 'medium', source: 'navigatorUA' }
);

// ─── 4. Android ──────────────────────────────────────────────────────
eq(
  'Android 14 Chrome UA -> android (high)',
  detectPlatform({ userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36' }),
  { platform: 'android', confidence: 'high', source: 'navigatorUA' }
);

// ─── 5. iOS ──────────────────────────────────────────────────────────
eq(
  'iPhone iOS 17 UA -> ios (high)',
  detectPlatform({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' }),
  { platform: 'ios', confidence: 'high', source: 'navigatorUA' }
);
eq(
  'iPad iPadOS 17 UA -> ios (high)',
  detectPlatform({ userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' }),
  { platform: 'ios', confidence: 'high', source: 'navigatorUA' }
);

// ─── 6. ChromeOS ─────────────────────────────────────────────────────
eq(
  'ChromeOS CrOS UA -> linux (medium) — closest match, no dedicated build',
  detectPlatform({ userAgent: 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' }),
  { platform: 'linux', confidence: 'medium', source: 'navigatorUA' }
);

// ─── 7. Order: Android before Linux ──────────────────────────────────
eq(
  'Linux+Android UA clash -> android wins (Android regex is more specific)',
  detectPlatform({ userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36' }),
  { platform: 'android', confidence: 'high', source: 'navigatorUA' }
);

// ─── 8. Order: iOS before macOS ──────────────────────────────────────
eq(
  'iPhone UA contains "Mac OS X" but should resolve to ios, not macos',
  detectPlatform({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15' }),
  { platform: 'ios', confidence: 'high', source: 'navigatorUA' }
);

// ─── 9. User-Agent Client Hints (UA-CH) ─────────────────────────────
eq(
  'Empty UA + UA-CH macOS -> macos (high, userAgentData)',
  detectPlatform({ userAgent: '', userAgentData: { platform: 'macOS' } }),
  { platform: 'macos', confidence: 'high', source: 'userAgentData' }
);
eq(
  'Modern Win Chrome UA-CH + legacy UA -> userAgentData wins (high)',
  detectPlatform({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    userAgentData: { platform: 'Windows' },
  }),
  { platform: 'windows', confidence: 'high', source: 'userAgentData' }
);
eq(
  'UA-CH Chrome OS -> linux (medium, userAgentData)',
  detectPlatform({ userAgentData: { platform: 'Chrome OS' } }),
  { platform: 'linux', confidence: 'medium', source: 'userAgentData' }
);
eq(
  'UA-CH iOS on iPad -> ios (high)',
  detectPlatform({ userAgentData: { platform: 'iOS' } }),
  { platform: 'ios', confidence: 'high', source: 'userAgentData' }
);

// ─── 10. Viewport fallback ───────────────────────────────────────────
eq(
  'Phone viewport (375px + touch) -> unknown (low, viewport)',
  detectPlatform({ viewportWidth: 375, isTouch: true }),
  { platform: 'unknown', confidence: 'low', source: 'viewport' }
);
// Tablet at 768px is NOT "narrow" per the spec (narrow = < 600px), so the
// viewport fallback does not fire. Result: unknown (low, navigatorUA).
// iPad users on iPadOS 13+ desktop mode land in macOS via the UA path —
// that is a known iPadOS-detection gap, not a viewport fallback case.
eq(
  'Tablet viewport (768px + touch) -> unknown (low, navigatorUA) — 768 is not narrow',
  detectPlatform({ viewportWidth: 768, isTouch: true }),
  { platform: 'unknown', confidence: 'low', source: 'navigatorUA' }
);
eq(
  'Narrow tablet viewport (599px + touch) -> unknown (low, viewport)',
  detectPlatform({ viewportWidth: 599, isTouch: true }),
  { platform: 'unknown', confidence: 'low', source: 'viewport' }
);
eq(
  'Wide viewport (1280px) without UA -> unknown (low, navigatorUA)',
  detectPlatform({ viewportWidth: 1280, isTouch: false }),
  { platform: 'unknown', confidence: 'low', source: 'navigatorUA' }
);

// ─── 11. Empty / edge cases ──────────────────────────────────────────
eq(
  'Empty input -> unknown (low, navigatorUA)',
  detectPlatform({}),
  { platform: 'unknown', confidence: 'low', source: 'navigatorUA' }
);
eq(
  'Empty UA string + UA-CH Windows -> windows (high, userAgentData)',
  detectPlatform({ userAgent: '', userAgentData: { platform: 'Windows' } }),
  { platform: 'windows', confidence: 'high', source: 'userAgentData' }
);

// ─── 12. Source precedence: UA-CH beats UA ───────────────────────────
eq(
  'UA says Windows, UA-CH says macOS -> UA-CH wins (modern API is more reliable)',
  detectPlatform({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    userAgentData: { platform: 'macOS' },
  }),
  { platform: 'macos', confidence: 'high', source: 'userAgentData' }
);

// ─── Result ──────────────────────────────────────────────────────────
const total = pass + fail;
console.log(`\n${pass}/${total} platformDetect tests passed.`);
if (fail > 0) {
  process.exit(1);
}
