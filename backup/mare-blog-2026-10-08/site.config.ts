export interface NavItem {
  /** Navigation item display label */
  name: string;
  /** Navigation target path or URL */
  href: string;
  /** Icon identifier */
  icon?: string;
}

export interface AuthorLink {
  /** Link display label */
  name: string;
  /** Link target URL */
  href: string;
  /** Icon identifier */
  icon?: string;
}

export interface SiteConfig {
  /** Site language */
  lang: string;
  /** Site title */
  title: string;
  /** Site description */
  description: string;
  /** Author name */
  author: string;
  /** Author URL */
  authorUrl: string;
  /** Author biography */
  authorBio: string;
  /** Author location */
  authorLocation: string;
  /** Author avatar image URL */
  avatar: string;
  /** Optional array of author links */
  authorLinks?: AuthorLink[];
  /** Base URL of the site */
  url: string;
  /** Number of posts to show on each blog archive page */
  postsPerPage: number;
  /** Header navigation items */
  nav: NavItem[];
  /** Giscus comment system configuration */
  giscus: {
    /** Enable or disable Giscus comments */
    enabled: boolean;
    /** Target GitHub repository in 'owner/repo' format */
    repo: string;
    /** Repository GraphQL Node ID */
    repoId: string;
    /** Discussion category name */
    category: string;
    /** Discussion category GraphQL Node ID */
    categoryId: string;
    /** Theme for light mode */
    theme: string;
    /** Theme for dark mode */
    darkTheme: string;
    /** UI language */
    lang: string;
  };
}

export function defineConfig(config: SiteConfig): SiteConfig {
  return config;
}

export default defineConfig({
  lang: "zh",
  title: "_0081",
  description: "A minimal, lightning-fast personal blog built with Astro.",
  author: "_0081",
  authorUrl: "https://www.github.com/A0081",
  authorBio: "马鸣者，菩萨是也.",
  authorLocation: "HuBei, China",
  avatar: "https://www.github.com/A0081.png",
  authorLinks: [
    {
      name: "GitHub",
      href: "https://www.github.com/A0081",
      icon: "lucide:github",
    },
  ],
  url: "https://i0081.asia",
  postsPerPage: 6,
  nav: [
    { name: "主页", href: "/", icon: "lucide:home" },
    { name: "文章", href: "/blog", icon: "lucide:book-open" },
    { name: "闪念", href: "/journal", icon: "lucide:calendar-days" },
    { name: "标签", href: "/blog/tags", icon: "lucide:tags" },
    { name: "关于", href: "/about", icon: "lucide:user" },
  ],
  giscus: {
    enabled: false,
    repo: "Niceeepoiu/mare-blog",
    repoId: "R_kgDOUH3Ucg",
    category: "Announcements",
    categoryId: "DIC_kwDOUH3Ucs4DEfws",
    theme: "light",
    darkTheme: "dark",
    lang: "en",
  },
});
