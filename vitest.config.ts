// SPDX-License-Identifier: Apache-2.0
/**
 * R234: vitest config for the pulse-landing site.
 *
 * The site ships two kinds of test files in src/lib/__tests__/:
 *   1. Self-contained runners (e.g. platformDetect.test.ts) — run with
 *      `npx tsx` or `node --experimental-strip-types`. No vitest API.
 *   2. Vitest-style files (e.g. versions.test.ts) — use describe/it.
 *
 * Vitest 1.6+ rejects (1) as "No test suite found" because the file
 * has no `describe`/`it`/`test` calls. We scope `include` to the
 * vitest-style files only, so the self-contained runners don't
 * collide with vitest's loader.
 *
 * Run the legacy self-contained runner directly with:
 *   npx tsx src/lib/__tests__/platformDetect.test.ts
 *
 * Run the vitest-style file with:
 *   npx vitest run
 *
 * Plain object export — no `import { defineConfig } from 'vitest/config'`
 * so this file resolves without vitest being a project dep (vitest is
 * fetched on demand by `npx vitest@1.6.0`).
 */
export default {
  test: {
    include: [
      'src/lib/__tests__/versions.test.ts',
      'src/data/__tests__/releases.test.ts',
    ],
  },
};
