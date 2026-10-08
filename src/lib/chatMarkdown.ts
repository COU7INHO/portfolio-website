// Tiny markdown subset for chatbot answers: **bold**, [text](url), bare URLs
// and emails. Produces a plain node tree (no HTML strings), so the renderer
// never has to inject raw markup. Incomplete syntax (e.g. mid-stream) is kept
// as literal text until it is closed.

export type ChatNode =
  | { type: 'text'; value: string }
  | { type: 'bold'; children: ChatNode[] }
  | { type: 'link'; href: string; text: string };

const LINK_RE = /^\[([^[\]\n]+)\]\(\s*([^\s()]+)\s*\)/;
const AUTOLINK_RE =
  /(https?:\/\/[^\s<>[\]]+|www\.[^\s<>[\]]+|[\w.%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})/g;
const TRAILING_PUNCTUATION_RE = /[.,;:!?'"*]+$/;

/** Returns the URL if it is safe to link to (http, https or mailto), else null. */
export function safeHref(url: string): string | null {
  const trimmed = url.trim();
  if (/^https?:\/\/[^\s]+$/i.test(trimmed)) return trimmed;
  if (/^mailto:[^\s]+$/i.test(trimmed)) return trimmed;
  return null;
}

/** Drops trailing punctuation and unbalanced closing parentheses from a bare URL. */
function trimBareUrl(url: string): string {
  let result = url;
  for (;;) {
    const before = result;
    result = result.replace(TRAILING_PUNCTUATION_RE, '');
    if (result.endsWith(')')) {
      const open = (result.match(/\(/g) ?? []).length;
      const close = (result.match(/\)/g) ?? []).length;
      if (close > open) result = result.slice(0, -1);
    }
    if (result === before) return result;
  }
}

function pushText(nodes: ChatNode[], value: string) {
  if (!value) return;
  const last = nodes[nodes.length - 1];
  if (last?.type === 'text') last.value += value;
  else nodes.push({ type: 'text', value });
}

/** Turns bare URLs and emails inside plain text into link nodes. */
function autolink(text: string, nodes: ChatNode[]) {
  let lastIndex = 0;
  for (const match of text.matchAll(AUTOLINK_RE)) {
    const start = match.index ?? 0;
    const prev = text[start - 1];
    // Only start a link on a word boundary (avoid "foo.www.x" or "a_b@c.com" halves)
    if (prev && /[A-Za-z0-9._%+@/-]/.test(prev)) continue;

    const isEmail = !/^(https?:\/\/|www\.)/i.test(match[0]);
    const raw = isEmail ? match[0].replace(/\.+$/, '') : trimBareUrl(match[0]);
    if (!raw || (!isEmail && /^www\.$/i.test(raw))) continue;

    const href = isEmail ? `mailto:${raw}` : /^www\./i.test(raw) ? `https://${raw}` : raw;
    pushText(nodes, text.slice(lastIndex, start));
    nodes.push({ type: 'link', href, text: raw });
    lastIndex = start + raw.length;
  }
  pushText(nodes, text.slice(lastIndex));
}

function parseInline(text: string, allowBold: boolean): ChatNode[] {
  const nodes: ChatNode[] = [];
  let plain = '';
  let i = 0;

  const flush = () => {
    autolink(plain, nodes);
    plain = '';
  };

  while (i < text.length) {
    if (allowBold && text.startsWith('**', i)) {
      const end = text.indexOf('**', i + 2);
      const inner = end === -1 ? '' : text.slice(i + 2, end);
      if (inner.trim() && !/^\s/.test(inner) && !/\s$/.test(inner)) {
        flush();
        nodes.push({ type: 'bold', children: parseInline(inner, false) });
        i = end + 2;
        continue;
      }
    }

    if (text[i] === '[') {
      const match = LINK_RE.exec(text.slice(i));
      if (match) {
        const [whole, label, url] = match;
        const href = safeHref(url);
        flush();
        // Unsafe schemes (javascript:, data:, ...) render as their label only
        if (href) nodes.push({ type: 'link', href, text: label });
        else pushText(nodes, label);
        i += whole.length;
        continue;
      }
    }

    plain += text[i];
    i += 1;
  }

  flush();
  return nodes;
}

export function parseChatMarkdown(text: string): ChatNode[] {
  return parseInline(text, true);
}
