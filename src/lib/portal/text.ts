// Plain-text helpers shared by every editorial source (WordPress, Hygraph).

const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
const MONTHS_SHORT = [
  "Janv.",
  "Févr.",
  "Mars",
  "Avr.",
  "Mai",
  "Juin",
  "Juil.",
  "Août",
  "Sept.",
  "Oct.",
  "Nov.",
  "Déc.",
];

export function decode(value: string): string {
  if (!value) return "";
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&middot;/g, "·")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

export function toText(html: string): string {
  const safe = (html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ");
  return decode(safe.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

// A rich-text editor stores its content as a nested document tree; plain editors store HTML or text.
function astToParagraphs(node: Record<string, unknown>, depth: number): string[] {
  const parts: string[] = [];
  let buffer = "";
  const flush = () => {
    const value = buffer.replace(/\s+/g, " ").trim();
    if (value) parts.push(value);
    buffer = "";
  };
  const walk = (current: Record<string, unknown>, level: number) => {
    const type = String(current["type"] ?? "");
    if (type === "text" || type === "leaf") {
      buffer += String(current["text"] ?? "");
      return;
    }
    if (type === "hardBreak" || type === "linebreak") {
      buffer += " ";
      return;
    }
    if (level > 0 && type) flush();
    const children = current["content"];
    if (Array.isArray(children)) {
      for (const child of children) {
        if (child && typeof child === "object") walk(child as Record<string, unknown>, level + 1);
      }
    }
    if (level > 0 && type) flush();
  };
  walk(node, depth);
  flush();
  return parts;
}

export function toParagraphs(value: unknown): string[] {
  if (value == null || value === "") return [];
  if (typeof value === "string") {
    const parts = value
      .split(/<\/(?:p|div|h2|h3|h4|li|blockquote|figcaption|figure)>|<br\s*\/?>/i)
      .map(toText)
      .filter(Boolean);
    return parts.length ? parts : [toText(value)].filter(Boolean);
  }
  if (typeof value === "object") {
    const node = value as Record<string, unknown>;
    if (Array.isArray(node["content"])) return astToParagraphs(node, 0);
    if (typeof node["text"] === "string") return [toText(String(node["text"]))];
  }
  return [];
}

export function formatFrenchDate(value: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ]|$)/.exec(value || "");
  if (!m) return (value || "").slice(0, 10);
  const month = MONTHS[Number(m[2]) - 1] ?? "";
  return `${Number(m[3])} ${month} ${m[1]}`;
}

export function frenchDateParts(value: string): { day: string; month: string } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || "");
  if (!m) return null;
  return { day: m[3] ?? "", month: MONTHS_SHORT[Number(m[2]) - 1] ?? "" };
}
