import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.string().optional(),
  heroImage: z.string().optional(),
  badge: z.string().optional(),
  music: z.string().trim().min(1).optional(),
  musicTitle: z.string().trim().min(1).optional(),
  tags: z
    .array(z.string())
    .refine((items) => new Set(items).size === items.length, {
      message: "tags must be unique",
    })
    .optional(),
});

const storeSchema = z.object({
  title: z.string(),
  description: z.string(),
  custom_link_label: z.string(),
  custom_link: z.string().optional(),
  updatedDate: z.coerce.date(),
  pricing: z.string().optional(),
  oldPricing: z.string().optional(),
  badge: z.string().optional(),
  checkoutUrl: z.string().optional(),
  heroImage: z.string().optional(),
});

const journalSchema = z.object({
  title: z.string(),
  pubDate: z.coerce.date(),
  music: z.string().trim().min(1).optional(),
  musicTitle: z.string().trim().min(1).optional(),
});

const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date().optional(),
  order: z.number().default(0),
  heroImage: z.string().optional(),
  badge: z.string().optional(),
});

export type BlogSchema = z.infer<typeof blogSchema>;
export type StoreSchema = z.infer<typeof storeSchema>;
/** About entries use the same shape as blog posts. */
export type AboutSchema = BlogSchema;
export type JournalSchema = z.infer<typeof journalSchema>;
export type ProjectSchema = z.infer<typeof projectSchema>;

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
    schema: blogSchema,
  }),
  store: defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/store" }),
    schema: storeSchema,
  }),
  about: defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/about" }),
    schema: blogSchema,
  }),
  journal: defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/journal" }),
    schema: journalSchema,
  }),
  projects: defineCollection({
    loader: glob({
      pattern: "**/[^_]*.{md,mdx}",
      base: "./src/content/projects",
    }),
    schema: projectSchema,
  }),
};
