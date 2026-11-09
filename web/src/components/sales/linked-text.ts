type TextPart = { text: string; href?: string };

/** Link only Amélia URLs, leaving sentence punctuation outside the anchor. */
export function splitLinkedText(text: string): TextPart[] {
  const parts: TextPart[] = [];
  const pattern = /https:\/\/www\.ameliasaude\.com\.br\/[^\s]*/g;
  let end = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    if (start > end) parts.push({ text: text.slice(end, start) });
    let href = match[0];
    let suffix = '';
    while (href) {
      const last = href.at(-1)!;
      const unbalancedClosing = last === ')' && (href.match(/\)/g)?.length ?? 0) > (href.match(/\(/g)?.length ?? 0);
      if (!/[.,!?;:]/.test(last) && !unbalancedClosing) break;
      suffix = last + suffix;
      href = href.slice(0, -1);
    }
    parts.push({ text: href, href });
    if (suffix) parts.push({ text: suffix });
    end = start + match[0].length;
  }
  if (end < text.length) parts.push({ text: text.slice(end) });
  return parts;
}
