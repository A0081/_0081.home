import { getCollection } from "astro:content";
import { getTagSummaries } from "./tags";

export interface SiteStats {
  posts: number;
  journal: number;
  tags: number;
  words: number;
  /** Newest `updatedDate` among posts, falling back to `pubDate`. */
  lastUpdated: Date | null;
}

/**
 * Roughly how much has been written: CJK characters count one each, and a run
 * of Latin letters or digits counts as one word. Markdown scaffolding is
 * stripped first so fences, link targets and punctuation are not counted as
 * prose.
 */
export function countWords(markdown: string | undefined | null): number {
  // An entry is allowed to be frontmatter-only (a stub waiting to be written).
  // That should count as zero words rather than taking the whole build down —
  // this runs in the sidebar, so it executes on every page.
  const text = (markdown ?? "")
    .replace(/^---[\s\S]*?\n---\n?/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[#>*_~|`-]/g, " ");

  const cjk = text.match(
    /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\u3040-\u30FF]/g,
  )?.length;
  const latin = text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length;

  return (cjk ?? 0) + (latin ?? 0);
}

/** Compact enough for a 19rem sidebar: 26157 -> "2.6 万". */
export function formatWords(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)} 万`;
  return String(count);
}

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? null : parsed;
}

export async function getSiteStats(): Promise<SiteStats> {
  const [posts, journal] = await Promise.all([
    getCollection("blog"),
    getCollection("journal"),
  ]);

  const words =
    posts.reduce((sum, entry) => sum + countWords(entry.body), 0) +
    journal.reduce((sum, entry) => sum + countWords(entry.body), 0);

  // `updatedDate` is free text in the schema, so an absent or unparseable value
  // falls back to when the post was published.
  let lastUpdated: Date | null = null;
  for (const post of posts) {
    const candidate = parseDate(post.data.updatedDate) ?? post.data.pubDate;
    if (!lastUpdated || candidate > lastUpdated) lastUpdated = candidate;
  }

  return {
    posts: posts.length,
    journal: journal.length,
    tags: getTagSummaries(posts).length,
    words,
    lastUpdated,
  };
}
