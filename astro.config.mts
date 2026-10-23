// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { satteri } from "@astrojs/markdown-satteri";

// https://astro.build/config
export default defineConfig({
  site: "https://i0081.asia",
  markdown: {
    // Two Shiki themes so code follows the page theme: `--shiki-light` /
    // `--shiki-dark` are emitted as custom properties and global.css picks one.
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
    },
    // Sätteri is Astro's Markdown processor; this plugin turns GitHub-style
    // `> [!NOTE]` blockquotes into styled alert boxes.
    processor: satteri({
      hastPlugins: [
        {
          name: "github-alerts",
          element: {
            filter: ["blockquote"],
            visit(node, context) {
              const firstParagraph = node.children.find(
                (child) => child.type === "element" && child.tagName === "p",
              );
              if (
                firstParagraph?.type !== "element" ||
                firstParagraph.tagName !== "p"
              ) {
                return;
              }

              const firstText = firstParagraph.children[0];
              if (firstText?.type !== "text") return;

              const match = firstText.value.match(
                /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?=$|[\t\r\n ])/,
              );
              if (!match) return;

              const alertType = match[1].toLowerCase();
              const remainingText = firstText.value
                .slice(match[0].length)
                .replace(/^[\t\r\n ]+/, "");
              const remainingChildren = [...firstParagraph.children];

              if (remainingText) {
                remainingChildren[0] = { ...firstText, value: remainingText };
              } else {
                remainingChildren.shift();
              }
              context.setProperty(
                firstParagraph,
                "children",
                remainingChildren,
              );

              const rawClasses = node.properties.className as unknown;
              const classNames = Array.isArray(rawClasses)
                ? rawClasses
                : typeof rawClasses === "string"
                  ? rawClasses.split(/\s+/)
                  : [];
              context.setProperty(node, "className", [
                ...classNames,
                "markdown-alert",
                `markdown-alert-${alertType}`,
              ]);
              context.insertBefore(firstParagraph, {
                type: "element",
                tagName: "p",
                properties: { className: ["markdown-alert-title"] },
                children: [{ type: "text", value: match[1] }],
              });

              if (remainingChildren.length === 0) {
                context.removeNode(firstParagraph);
              }
            },
          },
        },
      ],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    sitemap({
      // /store/ is still template scaffolding and is hidden from the nav, so it
      // stays out of the sitemap until it holds real content.
      filter: (page) => !page.includes("/store/"),
    }),
  ],
});
