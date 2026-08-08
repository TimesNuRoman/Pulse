// R257: parse the body of a changelog MD file into a list of change
// groups. Lines between `### <Label>` headings (Label in {New,
// Improved, Fixed, Security}) are the group's bullets. Other
// headings (##, #) are ignored — those belong to the post itself.
export type ChangeLabel = 'New' | 'Improved' | 'Fixed' | 'Security';
export type ChangeGroup = { label: ChangeLabel; items: string[] };

const KNOWN: ReadonlySet<string> = new Set(['New', 'Improved', 'Fixed', 'Security']);

export function parseChanges(rawBody: string): ChangeGroup[] {
  const lines = rawBody.split(/\r?\n/);
  const groups: ChangeGroup[] = [];
  let current: ChangeGroup | null = null;
  for (const ln of lines) {
    const h = ln.match(/^###\s+(.+?)\s*$/);
    if (h) {
      const lbl = h[1];
      if (KNOWN.has(lbl)) {
        if (current) groups.push(current);
        current = { label: lbl as ChangeLabel, items: [] };
      }
      continue;
    }
    const b = ln.match(/^-\s+(.+)$/);
    if (b && current) current.items.push(b[1].trim());
  }
  if (current) groups.push(current);
  return groups;
}
