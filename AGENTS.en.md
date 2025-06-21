# SuperDuperAI Coding Rules

## Tech Stack and Constraints
- Next.js 15.3 with Turbopack and App Router
- TypeScript is mandatory for all files
- Tailwind CSS 4.x for styling
- React Server Components by default (use "use client" only when necessary)
- Cloudflare Workers with @opennextjs/cloudflare (NOT Cloudflare Pages)

## Main Coding Rules

### General Principles
- Follow the project structure, place new files in the appropriate directories
- Adhere to the DRY principle (Don't Repeat Yourself)
- Avoid adding new dependencies unless absolutely necessary
- Optimize for performance (minimize JS bundle, use Server Components)

### Components and Styling
- Use dark theme (#0F172A background, #ADFF2F accent)
- ALWAYS use the following for links:
  ```tsx
  import { default as Link } from '@/components/ui/optimized-link';
  ```
- Use shadcn/ui and custom components from `/components/ui`
- All components must be accessible (WCAG 2.1 AA)
- Landing components must be in `/components/landing/`
- MDX components must be in `/components/content/`

### Optimization and SEO
- Every page must have meta tags via the Next.js metadata API
- Use structured data Schema.org
- Optimize images via next/image
- All static pages must have the following settings:
  ```ts
  export const dynamic = 'force-static';
  export const revalidate = false;
  ```

### ContentLayer and MDX
- Do not use client components directly in MDX
- Create wrappers for client components
- Follow the ContentLayer data schema for Tool, Case, Page
- Do not nest components in MDX
- Place MDX content in `/src/content/`

### Cloudflare Deployment
- Optimize bundle size (limit 3 MB per Worker)
- Use API routes for dynamic content
- Do not use Next.js features incompatible with Cloudflare (Edge, ISR)

### Performance
- Optimize for Core Web Vitals (LCP < 2.5s, CLS < 0.1)
- Use SSR only where necessary
- Lazy load heavy components below the fold
- Prefetch critical resources

## Documentation Links
- Full PRD: [[docs/product_requirements_updated.md]]
- ContentLayer Guide: [[docs/tasks/contentlayer-integration.md]]
- SEO Strategy: [[docs/seo/keywords.md]]
- Testing Checklist: [[docs/tasks/testing-checklist.md]] 

## Project Structure

```
SuperDuperAI/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Main page
│   │   ├── layout.tsx         # Root layout
│   │   ├── [slug]/            # Dynamic route for static pages
│   │   ├── case/              # Case study pages
│   │   │   └── [slug]/        # Dynamic route for cases
│   │   ├── tool/              # Tool pages
│   │   │   └── [slug]/        # Dynamic route for tools
│   │   ├── api/               # API endpoints
│   │   │   ├── og/            # OpenGraph image generation
│   │   │   ├── markdown/      # API for MDX content
│   │   │   └── llms-txt/      # Support for llms.txt for LLM
│   │   └── robots.txt/        # robots.txt generation
│   ├── components/            # React components
│   │   ├── landing/           # Landing page components
│   │   │   ├── hero.tsx       # Hero section
│   │   │   ├── features.tsx   # Features section
│   │   │   ├── how-it-works.tsx # How it works
│   │   │   ├── use-cases.tsx  # Use cases
│   │   │   ├── testimonials.tsx # Testimonials
│   │   │   ├── cta.tsx        # Call to action
│   │   │   ├── navbar.tsx     # Navigation bar
│   │   │   └── footer.tsx     # Footer
│   │   ├── content/           # MDX components
│   │   │   ├── mdx-components.tsx # Main MDX components
│   │   │   ├── feature.tsx    # Feature component
│   │   │   ├── feature-grid.tsx # Feature grid
│   │   │   ├── steps.tsx      # Steps component
│   │   │   └── cta-box.tsx    # Call to action box
│   │   └── ui/                # UI components
│   │       ├── button.tsx     # Button
│   │       ├── card.tsx       # Card
│   │       └── icons/         # SVG icons
│   ├── content/               # MDX content
│   │   ├── tool/              # Tools
│   │   ├── case/              # Cases
│   │   └── pages/             # Info pages
│   └── lib/                   # Utilities and helpers
│       ├── metadata.ts        # Metadata generation
│       └── generate-og.tsx    # OG image generation
├── public/                    # Static files
│   └── images/                # Images
├── docs/                      # Documentation
│   ├── seo/                   # SEO documentation
│   └── tasks/                 # Project tasks
├── .contentlayer/             # Generated ContentLayer data
├── .next/                     # Next.js build
└── ... (config files)
```

## SuperDuperAI Documentation Tree

### 1. Main Requirements and Concept
- [[docs/product_requirements_updated.md|Full PRD]] - main project document
  - **Key Concepts**: Vibe Filmmaking, Agent-Director Paradigm
  - **Target Audience**: Content creators, Marketers, Musicians, Small business
  - **Landing Structure**: Hero, Features, How it Works, Use Cases, Testimonials, CTA

- [[docs/project_quick_reference.md|Quick Reference]] - condensed version for fast access
  - **Tech Stack**: Next.js 15.3, TypeScript, Tailwind CSS, ContentLayer
  - **Current Status**: what's done, in progress, planned
  - **Dev Commands**: pnpm install, pnpm dev, pnpm lint, pnpm build, pnpm preview

### 2. Technical Guides and Rules

#### 2.1 Codebase
- [[.cursor/rules/superduperai.md|Cursor Development Rules]] - rules for AI coding
  - **Tech Stack and Constraints**: Next.js, TypeScript, Tailwind, Server Components
  - **Components and Styling**: dark theme, optimized links
  - **Performance**: Core Web Vitals, Lazy loading, SSR

#### 2.2 Infrastructure and Deployment
- [[docs/tasks/cloudflare-deployment.md|Cloudflare Deployment]] - Cloudflare Worker setup
  - **Important**: use OpenNext + Workers, not Pages!
  - **Limits**: 3 MB per Worker
  - **Static Pages**: force-static and revalidate: false settings

#### 2.3 Content Management
- [[docs/tasks/contentlayer-integration.md|ContentLayer Integration]] - MDX setup and usage
  - **Document Schemas**: Tool, Case, Page, Home
  - **MDX Rules**: avoid client components, no nested components
  - **Content Structure**: /src/content/tool/, /case/, /pages/

### 3. SEO and Marketing

#### 3.1 SEO Strategy
- [[docs/seo/keywords.md|Keyword Strategy]] - search engine optimization
  - **Meta tags**: unique for each page
  - **Schema.org**: markup for different content types
  - **OpenGraph**: social media image generation

- [[docs/seo/metadata-guide.md|Metadata Guide]] - page metadata setup
  - **Optimal Length**: title (50-60 chars), description (120-155 chars)
  - **Heading Hierarchy**: H1 → H2 → H3

- [[docs/seo/schema-org-guide.md|Schema.org Guide]] - structured data
  - **Markup Types**: Organization, WebSite, Product, Article

#### 3.2 Marketing Materials
- [[docs/marketing.md|Marketing Strategy]] - promotional materials
  - **Main Message**: "Turn Vibes into Videos – Instantly"
  - **Pain Points**: limited resources, complexity of traditional tools
  - **Testimonials**: "We saved weeks", "My music video, no budget, huge vibe"

#### 3.3 Analytics
- [[docs/analytics.md|Analytics and Metrics]] - tracking effectiveness
  - **Business Metrics**: conversion > 3%, time on site > 2 minutes
  - **Technical Metrics**: PageSpeed > 90, Core Web Vitals in green
  - **Setup**: Google Analytics 4, Search Console

### 4. Testing and Optimization
- [[docs/tasks/testing-checklist.md|Testing Checklist]] - pre-launch checks
  - **Devices**: mobile (320-480px), tablet (481-768px), desktop (769px+)
  - **Accessibility**: WCAG 2.1 AA, contrast, keyboard navigation
  - **Performance**: LCP < 2.5s, CLS < 0.1, FID < 100ms

### 5. Reference Materials
- [[docs/saas.md|SaaS Business Model]] - subscription model info
  - **Plans**: Free, Pro, Team, Enterprise
  - **Pricing**: savings vs. traditional video production
  - **Retention**: user retention strategies

### Documentation Usage Order
1. Start with the [[docs/project_quick_reference.md|Quick Reference]] for general understanding
2. Study the [[docs/product_requirements_updated.md|Full PRD]] for in-depth details
3. Use the [[.cursor/rules/superduperai.md|Development Rules]] when writing code
4. Refer to specific documents as needed (SEO, deployment, etc.) 