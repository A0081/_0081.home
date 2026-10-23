import type { CollectionEntry } from "astro:content";

type JournalEntry = CollectionEntry<"journal">;

export interface JournalContentPreview {
  /** First paragraph, shown on the timeline. */
  preview: string;
  /** Remaining markup, kept collapsed on the timeline. */
  rest: string;
}

// A leading level-one heading repeats the entry title, so it is dropped.
const LEADING_TITLE = /^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/;
const FIRST_PARAGRAPH = /<p\b[^>]*>[\s\S]*?<\/p>/;

/**
 * Minimum hidden-text length (characters, HTML stripped) before the timeline
 * offers an expand control. Shorter notes simply show their first paragraph and
 * stay readable from their own page, which avoids toggles for one-liners.
 */
export const MIN_COLLAPSED_LENGTH = 100;

const plainText = (html: string): string =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export function getJournalHref(entry: JournalEntry): string {
  return `/journal/${encodeURIComponent(entry.id)}`;
}

/** Drops a leading level-one heading, which only repeats the entry title. */
export function stripJournalTitle(html: string): string {
  return html.replace(LEADING_TITLE, "").trim();
}

export function splitJournalContent(html: string): JournalContentPreview {
  const content = stripJournalTitle(html);
  const match = FIRST_PARAGRAPH.exec(content);

  if (!match || match.index === undefined) {
    return { preview: content, rest: "" };
  }

  const before = content.slice(0, match.index).trim();
  const after = content.slice(match.index + match[0].length).trim();
  const rest = [before, after].filter(Boolean).join("\n");

  return {
    preview: match[0].trim(),
    rest: plainText(rest).length >= MIN_COLLAPSED_LENGTH ? rest : "",
  };
}
