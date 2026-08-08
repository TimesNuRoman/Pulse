// R257: /changelog/rss.xml — RSS 2.0 feed of the changelog
// content collection. Replaces the old hardcoded /changelog.xml
// (the old endpoint is no longer published; the URL has moved).
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { parseChanges } from '../../lib/parse-changes';

const SITE = 'https://ownlocalml.com';

export async function GET(context: APIContext) {
  const all = (await getCollection('changelog'))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 20);

  return rss({
    title: 'Pulse Changelog',
    link: `${SITE}/changelog/`,
    description: 'Every Pulse release, big and small.',
    site: context.site?.toString().replace(/\/$/, '') ?? SITE,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData:
      '<language>en-us</language>' +
      `<atom:link href="${SITE}/changelog/rss.xml" rel="self" type="application/rss+xml" />`,
    items: all.map((e) => {
      const slug = e.data.version.replace(/\./g, '-');
      const itemLink = `${SITE}/changelog#v${slug}`;
      const groups = parseChanges(e.body ?? '');
      const html = renderItemHtml(e.data.title, e.data.summary, groups);
      return {
        title: `Pulse v${e.data.version} — ${e.data.title}`,
        pubDate: e.data.date,
        description: html,
        categories: e.data.platforms.map((p) =>
          p === 'pro' ? 'PRO' : p.charAt(0).toUpperCase() + p.slice(1)
        ),
        customData:
          `<link>${itemLink}</link>` +
          `<guid isPermaLink="false">pulse-v${e.data.version}</guid>`,
      };
    }),
    stylesheet: false,
    trailingSlash: false,
  });
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function inlineMdLite(s: string): string {
  let out = esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  return out;
}
function renderItemHtml(
  title: string,
  summary: string | undefined,
  groups: ReturnType<typeof parseChanges>,
): string {
  const parts: string[] = [];
  if (summary) parts.push(`<p>${esc(summary)}</p>`);
  for (const g of groups) {
    parts.push(`<h3>${esc(g.label)}</h3>`);
    parts.push('<ul>');
    for (const it of g.items) parts.push(`<li>${inlineMdLite(it)}</li>`);
    parts.push('</ul>');
  }
  return parts.join('');
}
