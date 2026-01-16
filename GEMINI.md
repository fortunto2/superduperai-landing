# SuperDuperAI Gemini Agent Coding Rules

## Tech Stack and Constraints
- **Framework**: Next.js 15.3 with Turbopack and App Router
- **Language**: TypeScript is mandatory for all new files.
- **Styling**: Tailwind CSS 4.x.
- **Components**: Default to React Server Components. Use `"use client"` only when absolutely necessary.
- **Deployment**: Cloudflare Workers via @opennextjs/cloudflare (specifically **not** Cloudflare Pages).

## Core Coding Principles

### General
- Adhere strictly to the existing project structure.
- Follow the DRY (Don't Repeat Yourself) principle.
- Avoid introducing new dependencies unless critical.
- Prioritize performance: minimize JS bundle size, leverage Server Components.

### Components and Styling
- **Theme**: Use the dark theme (Background: `#0F172A`, Accent: `#ADFF2F`).
- **Links**: ALWAYS use the custom optimized link component:
  ```tsx
  import { default as Link } from '@/components/ui/optimized-link';
  ```
- **UI Library**: Utilize `shadcn/ui` and existing custom components from `/components/ui`.
- **Accessibility**: All components must comply with WCAG 2.1 AA standards.
- **Component Locations**:
  - Landing page components: `/components/landing/`
  - MDX components: `/components/content/`

### Optimization and SEO
- **Metadata**: Every page must have metadata generated via the Next.js metadata API.
- **Structured Data**: Implement Schema.org for relevant content types.
- **Images**: Use `next/image` for all images.
- **Static Pages**: All static pages must include these settings:
  ```ts
  export const dynamic = 'force-static';
  export const revalidate = false;
  ```

### ContentLayer and MDX
- **Client Components**: Do not use client components directly in MDX. Create specific wrappers for them if needed.
- **Schema**: Adhere to the defined ContentLayer schemas for `Tool`, `Case`, and `Page`.
- **Nesting**: Do not nest components within MDX files.
- **Content Location**: All MDX source files must be placed in `/src/content/`.

### Cloudflare Deployment
- **Bundle Size**: Keep worker bundles under the 3 MB limit.
- **Dynamic Content**: Use API routes for any dynamic server-side logic.
- **Compatibility**: Do not use Next.js features incompatible with the Cloudflare Workers environment (e.g., certain Edge runtime features, ISR).

### Performance
- **Core Web Vitals**: Target LCP < 2.5s and CLS < 0.1.
- **SSR**: Use Server-Side Rendering only when essential.
- **Lazy Loading**: Lazy load large components that are below the fold.
- **Prefetching**: Prefetch critical resources.

## Project Structure Overview
```
SuperDuperAI/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── [locale]/            # Locale-based routing
│   │   │   ├── (landing)/       # Route group for landing pages
│   │   │   │   ├── layout.tsx   # Layout for landing pages
│   │   │   │   └── page.tsx     # Main landing page component
│   │   │   ├── layout.tsx       # Layout for localized routes
│   │   │   ├── not-found.tsx    # Custom 404 page
│   │   │   ├── sitemap.ts       # Sitemap generation
│   │   │   └── template.tsx     # Template for localized routes
│   │   ├── api/                 # API endpoints
│   │   ├── favicon.ico          # Favicon
│   │   ├── globals.css          # Global CSS styles
│   │   ├── layout.tsx           # Root layout
│   │   ├── opengraph-image.tsx  # OpenGraph image generation
│   │   └── page.tsx             # Root page
│   ├── components/              # React components
│   │   ├── content/             # Components for MDX content
│   │   ├── landing/             # Components for the landing page
│   │   └── ui/                  # General UI components
│   ├── config/                  # Configuration files
│   │   ├── dictionaries/        # i18n dictionaries
│   │   ├── i18n-config.ts       # i18n configuration
│   │   └── site.ts              # Site-wide configuration
│   ├── content/                 # Content collections for Contentlayer
│   │   ├── blog/                # Blog posts
│   │   ├── case/                # Case studies
│   │   ├── docs/                # Documentation pages
│   │   ├── homes/               # Home page content
│   │   ├── pages/               # Static pages
│   │   └── tool/                # Tool pages
│   ├── hooks/                   # Custom React hooks
│   │   └── use-translation.ts   # Hook for translations
│   ├── lib/                     # Library functions and utilities
│   │   ├── constants.ts         # Project constants
│   │   ├── generate-og-image.tsx # OG image generation utility
│   │   ├── get-dictionary.ts    # Function to get i18n dictionaries
│   │   ├── get-valid-locale.ts  # Function to validate locales
│   │   ├── metadata.ts          # Metadata generation utilities
│   │   ├── user-identifier.ts   # User identification logic
│   │   └── utils.ts             # General utility functions
│   ├── middleware.ts            # Next.js middleware
│   ├── tests/                   # Test files
│   └── types/                   # TypeScript type definitions
│       └── translation.d.ts   # Types for translations
├── public/                      # Static assets
│   ├── images/                  # Images
│   ├── markdown/                # Raw markdown files (if any)
│   ├── llms.txt                 # LLM instructions file
│   └── robots.txt               # Robots.txt file
├── docs/                        # Project documentation
│   ├── api/                     # API documentation
│   ├── seo/                     # SEO documentation
│   └── tasks/                   # Task descriptions
├── scripts/                     # Node.js scripts
├── .contentlayer/               # Generated files from Contentlayer
├── .next/                       # Next.js build output
└── ... (config files)           # Configuration files
```
