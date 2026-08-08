// R257: tiny inline-MD renderer for changelog bullet lines.
// Supports: **bold**, `code`. Everything else is escaped.
// Avoids a full remark pipeline for the 5-10 bullets per group.
export function inlineMd(src: string): string {
  // Escape HTML first (we control the input but be safe).
  const esc = src
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Then re-apply our two inline marks on the escaped string.
  // Code first (so we don't bold inside code).
  let out = esc.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  return out;
}
