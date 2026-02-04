# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SuperLanding is a multi-language landing page website for superduperai.co built with Next.js 15 (App Router) and Strapi as the headless CMS backend. The project generates thousands of SEO-optimized, automatically translated landing pages.

## Repository Structure

- `app/` - Next.js frontend application (main development area)
- `strapi-backend/` - Strapi headless CMS backend
- `docs/` - Project documentation and task management (kanban system)

## Commands

All frontend commands run from the `app/` directory:

```bash
# Development
pnpm dev              # Start development server (http://localhost:3000)

# Quality checks (run before committing)
pnpm lint             # ESLint check
pnpm type-check       # TypeScript type checking

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:smoke       # Run smoke tests only

# Build
pnpm build            # Production build
```

Strapi backend (from `strapi-backend/`):
```bash
npm run develop       # Start with auto-reload (http://localhost:1337/admin)
```

## Architecture

### Frontend (Next.js 15 + React 19)

**Tech Stack:** TypeScript, Tailwind CSS 4.x, shadcn/ui, next-intl for i18n

**Directory Structure (`app/src/`):**
- `app/` - App Router pages and layouts
- `components/blocks/` - Page sections (Hero, HowItWorks, etc.)
- `components/ui/` - shadcn/ui components
- `components/layout/` - Header, Footer, LanguageSelector
- `lib/` - Utilities (utils.ts, strapi.ts, seo.ts, i18n.ts)
- `messages/` - Translation files (en.json, es.json)

**Rendering:** Static Site Generation (SSG) with static export for Cloudflare R2/Pages hosting.

### Backend (Strapi)

Content types: LandingPage, BlogPost with localized fields and Dynamic Zones for flexible content blocks (Hero, FeatureItem, Testimonial, CTA).

## Development Conventions

### Tailwind CSS 4.x

Uses `@tailwindcss/postcss` plugin. For CSS variables:
```css
/* Correct - use direct CSS properties */
* { border-color: var(--border); }

/* Wrong - don't use @apply with custom color classes */
* { @apply border-border; }
```

### Components

- Use `'use client'` directive for client components
- Localize all text via `useTranslations` from next-intl
- Follow existing component structure in `components/blocks/`
- Add shadcn/ui components: `npx shadcn@latest add <component-name> --overwrite`

### Task Management

Project uses a kanban system in `docs/tasks/`:
- `backlog/` - Pending tasks
- `in-progress/` - Active tasks
- `done/` - Completed tasks

Update task files and `docs/project_status.md` when completing work.

### Code Quality

Before committing:
1. Run `pnpm lint` and `pnpm type-check`
2. Ensure all text is localized (no hardcoded strings)
3. Test responsive design across screen sizes
