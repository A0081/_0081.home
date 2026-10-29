import type { CollectionEntry } from "astro:content";

type BlogPost = CollectionEntry<"blog">;

export interface TagSummary {
  name: string;
  slug: string;
  count: number;
}

/**
 * Tags are free text in frontmatter, so the URL segment is derived from the
 * name: case and accents are folded away and runs of separators collapse into a
 * single dash. `\p{L}` keeps letters from any script, so a Chinese tag keeps
 * its characters rather than slugging down to nothing.
 */
export function getTagSlug(tag: string): string {
  return tag
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function getTagHref(slug: string): string {
  // Trailing slash matches the built file (/blog/tag/<slug>/index.html); without
  // it Netlify answers with a 301 first.
  return `/blog/tag/${encodeURIComponent(slug)}/`;
}

/**
 * One summary per distinct tag, counted once per post. Both halves matter: a
 * post that lists the same tag twice must not be counted twice, and paginating
 * the same tag more than once would emit duplicate static paths.
 */
export function getTagSummaries(posts: BlogPost[]): TagSummary[] {
  const summaries = new Map<string, TagSummary>();

  for (const post of posts) {
    for (const name of new Set(post.data.tags ?? [])) {
      const slug = getTagSlug(name);
      if (!slug) {
        throw new Error(`Tag "${name}" does not produce a valid URL slug.`);
      }

      const existing = summaries.get(slug);
      if (existing && existing.name !== name) {
        throw new Error(
          `Tags "${existing.name}" and "${name}" resolve to the same URL slug "${slug}".`,
        );
      }

      if (existing) {
        existing.count += 1;
      } else {
        summaries.set(slug, { name, slug, count: 1 });
      }
    }
  }

  return [...summaries.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getPostsForTag(posts: BlogPost[], slug: string): BlogPost[] {
  return posts
    .filter((post) =>
      (post.data.tags ?? []).some((tag) => getTagSlug(tag) === slug),
    )
    .sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
}
