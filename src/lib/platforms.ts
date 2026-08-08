// SPDX-License-Identifier: Apache-2.0
// R250: shared platform metadata for /download/ pages.
// All 5 platforms in one place so per-page subpages stay in sync with the
// hub at /download/ and the platform switcher in DownloadLayout.

export type PlatformId = 'windows' | 'android' | 'macos' | 'linux' | 'ios';

export type PlatformStatus = 'ready' | 'source' | 'no';

export interface PlatformInfo {
  id: PlatformId;
  label: string;
  href: string;
  status: PlatformStatus;
}

export const PLATFORMS: PlatformInfo[] = [
  { id: 'windows', label: 'Windows', href: '/download/windows/', status: 'ready' },
  { id: 'android', label: 'Android', href: '/download/android/', status: 'ready' },
  { id: 'macos',   label: 'macOS',   href: '/download/macos/',   status: 'source' },
  { id: 'linux',   label: 'Linux',   href: '/download/linux/',   status: 'source' },
  { id: 'ios',     label: 'iOS',     href: '/download/ios/',     status: 'no' },
];

export function getPlatform(id: PlatformId): PlatformInfo {
  const p = PLATFORMS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown platform: ${id}`);
  return p;
}

// Inline SVG icons (currentColor, 1.6 stroke, 18×18) — keep no emoji.
const ICON_WINDOWS = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M3 5.5L10.5 4.5v7.5H3v-6.5zM11.5 4.4L21 3v9h-9.5V4.4zM3 13.5h7.5V21L3 19.5v-6zM11.5 13.5H21V21l-9.5-1.5v-6z"/></svg>`;
const ICON_ANDROID = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M6 9c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2v2c0 .55.45 1 1 1s1-.45 1-1v-2h8v2c0 .55.45 1 1 1s1-.45 1-1v-2c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2H6zM8 11.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM16 11.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM7 8l-1.5-2.5C5.4 5.3 5.5 5 5.7 5c.2 0 .3.1.4.2L7.5 7.5C8.6 7.2 9.8 7 11 7h2c1.2 0 2.4.2 3.5.5l1.4-2.3c.1-.1.2-.2.4-.2.2 0 .3.3.2.5L17 8H7z"/></svg>`;
const ICON_MACOS = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17.5 12.5c0-2.4 2-3.5 2.1-3.6-1.1-1.6-2.9-1.8-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1.9-4 2.4-1.7 3-.4 7.4 1.3 9.8.8 1.2 1.7 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-4zM15 5.4c.7-.8 1.1-1.9 1-3-1 .1-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4z"/></svg>`;
const ICON_LINUX = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2c-2.2 0-3.5 2.2-3.5 4.5 0 1.4.4 2.6 1 3.5-1.3 1.2-2.5 3-3 5.4-.3 1.6-1.3 2.4-2.2 3.2-1 .9-2 1.7-1.5 3.2.4 1 1.5 1.4 2.6 1.5 1.5.1 3.5-.5 5.4-.5h2.4c1.9 0 3.9.6 5.4.5 1.1-.1 2.2-.5 2.6-1.5.5-1.5-.5-2.3-1.5-3.2-.9-.8-1.9-1.6-2.2-3.2-.5-2.4-1.7-4.2-3-5.4.6-.9 1-2.1 1-3.5C15.5 4.2 14.2 2 12 2zm-1.5 5.2c.4 0 .7.5.7 1.1 0 .6-.3 1.1-.7 1.1-.4 0-.7-.5-.7-1.1 0-.6.3-1.1.7-1.1zm3 0c.4 0 .7.5.7 1.1 0 .6-.3 1.1-.7 1.1-.4 0-.7-.5-.7-1.1 0-.6.3-1.1.7-1.1zM12 9.5c.9 0 1.7.5 1.7 1.2 0 .6-.8 1-1.7 1s-1.7-.4-1.7-1c0-.7.8-1.2 1.7-1.2z"/></svg>`;
const ICON_IOS = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17.5 2.5h-11c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2v-15c0-1.1-.9-2-2-2zM12 20.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm4.5-3.5h-9V5h9v12z"/></svg>`;

const ICON_SHIELD = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/></svg>`;
const ICON_LINK = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
const ICON_DOWN = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>`;
const ICON_CHEVRON = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;

export const ICONS = {
  platform: {
    windows: ICON_WINDOWS,
    android: ICON_ANDROID,
    macos: ICON_MACOS,
    linux: ICON_LINUX,
    ios: ICON_IOS,
  },
  shield: ICON_SHIELD,
  link: ICON_LINK,
  down: ICON_DOWN,
  chevron: ICON_CHEVRON,
};
