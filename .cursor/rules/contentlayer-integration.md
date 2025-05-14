# ContentLayer2 Integration Guide

This document outlines how ContentLayer2 is integrated into the SuperDuperAI landing page project.

## Content Structure

ContentLayer2 manages four primary content types:

1. **Tools** (`src/content/tool/`): Feature pages for SuperDuperAI tools
2. **Case Studies** (`src/content/case/`): Customer success stories and use cases
3. **Pages** (`src/content/pages/`): Static pages like About, Pricing, Privacy, Terms
4. **Home** (`src/content/home.mdx`): Main landing page content and sections

## Configuration

ContentLayer2 is configured in [contentlayer.config.ts](mdc:contentlayer.config.ts) with document type definitions:

```ts
// Document type examples
export const Tool = defineDocumentType(() => ({
  name: "Tool",
  filePathPattern: "tool/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    icon: { type: "string" },
    featured: { type: "boolean", default: false },
    // Additional fields...
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/tool/${doc.slug}`,
    },
  },
}));

export const Case = defineDocumentType(() => ({
  name: "Case",
  filePathPattern: "case/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    category: { type: "string", required: true },
    featured: { type: "boolean", default: false },
    // Additional fields...
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/case/${doc.slug}`,
    },
  },
}));

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
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc.slug}`,
    },
  },
}));

export const Home = defineDocumentType(() => ({
  name: "Home",
  filePathPattern: "home.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    features: { type: "list", of: { type: "json" }, required: false },
    howItWorks: { type: "list", of: { type: "json" }, required: false },
    useCases: { type: "list", of: { type: "json" }, required: false },
    faq: { type: "list", of: { type: "json" }, required: false },
    seo: { type: "nested", of: SEO, required: false },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: () => "/",
    },
  },
}));
```

## Content Components

For rendering MDX content, we use custom components in [src/components/content/](mdc:src/components/content):

- `MDXContent.tsx`: Main wrapper for MDX content
- `Feature.tsx`: Feature card component for tools
- `Steps.tsx`: Numbered steps for processes
- `FeatureGrid.tsx`: Grid layout for features
- `PageWrapper.tsx`: Layout wrapper for static pages

## Lists and Navigation

Content lists are implemented in:

- `ToolList.tsx`: List of tool landing pages
- `CaseList.tsx`: List of case studies

These components use `.contentlayer/generated` imports:

```tsx
import {
  allTools,
  allCases,
  allPages,
  allHomes,
} from ".contentlayer/generated";
```

## Page Components

Static pages use the Page document type:

```tsx
// Example for about page
export default function AboutPage() {
  const page = allPages.find((page) => page.slug === "about");

  if (!page) {
    notFound();
  }

  return (
    <PageWrapper
      title={page.title}
      breadcrumbItems={[{ label: "About", href: "/about" }]}
    >
      <MDXContent code={page.body.code} />
    </PageWrapper>
  );
}
```

The Home page uses structured content for sections:

```tsx
export default function Home() {
  const homeData = allHomes[0];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features items={homeData.features} />
        <HowItWorks steps={homeData.howItWorks} />
        <UseCases items={homeData.useCases} />
        <FAQ items={homeData.faq} />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
```

## Dynamic Routes

Dynamic routes in Next.js 15 access content via:

```tsx
// Example for tool page
const { slug } = await params;
const tool = allTools.find((tool) => tool.slug === slug);
```

## Content Authoring Guidelines

When creating MDX content:

1. Place files in appropriate directories:
   - `src/content/tool/` for tool pages
   - `src/content/case/` for case studies
   - `src/content/pages/` for static pages
   - `src/content/home.mdx` for homepage content
2. Include required frontmatter fields (title, description, etc.)
3. Use custom MDX components for consistent layout
4. Set `featured: true` for items that should appear in homepage highlights
