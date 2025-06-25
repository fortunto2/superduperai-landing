import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from "contentlayer2/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

// SEO тип
const SEO = defineNestedType(() => ({
  name: "SEO",
  fields: {
    title: { type: "string", required: false },
    description: { type: "string", required: false },
    keywords: { type: "list", of: { type: "string" }, required: false },
    ogImage: { type: "string", required: false },
  },
}));

// Определение типа документа для Tool
export const Tool = defineDocumentType(() => ({
  name: "Tool",
  filePathPattern: "tool/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    slug: { type: "string", required: true },
    icon: { type: "string", required: false },
    featured: { type: "boolean", required: false, default: false },
    seo: { type: "nested", of: SEO, required: false },
    locale: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/tool/${doc.slug}`,
    },
  },
}));

// Определение типа документа для Case
export const Case = defineDocumentType(() => ({
  name: "Case",
  filePathPattern: "case/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    slug: { type: "string", required: true },
    category: { type: "string", required: true },
    image: { type: "string", required: false },
    featured: { type: "boolean", required: false, default: false },
    seo: { type: "nested", of: SEO, required: false },
    locale: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/case/${doc.slug}`,
    },
  },
}));

// Определение типа документа для документации
export const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: "docs/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    slug: { type: "string", required: true },
    order: { type: "number", required: false },
    category: { type: "string", required: false },
    featured: { type: "boolean", required: false, default: false },
    seo: { type: "nested", of: SEO, required: false },
    locale: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/docs/${doc.slug}`,
    },
  },
}));

// Определение типа документа для статических страниц
export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: "pages/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    slug: { type: "string", required: true },
    seo: { type: "nested", of: SEO, required: false },
    locale: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc.slug}`,
    },
  },
}));

// Определение типа документа для главной страницы
export const Home = defineDocumentType(() => ({
  name: "Home",
  filePathPattern: "homes/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    features: { type: "list", of: { type: "json" }, required: false },
    howItWorks: { type: "list", of: { type: "json" }, required: false },
    useCases: { type: "list", of: { type: "json" }, required: false },
    faq: { type: "list", of: { type: "json" }, required: false },
    keywords: { type: "list", of: { type: "string" }, required: false },
    seo: { type: "nested", of: SEO, required: false },
    locale: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: () => "/",
    },
  },
}));

// Определение типа документа для блога
export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "blog/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    slug: { type: "string", required: true },
    seo: { type: "nested", of: SEO, required: false },
    locale: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/blog/${doc.slug}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "src/content",
  documentTypes: [Tool, Case, Doc, Page, Home, Blog],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "one-dark-pro",
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
          },
        },
      ],
    ],
  },
});
