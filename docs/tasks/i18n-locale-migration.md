# Internationalisation & Canonical URLs — Migration Guide

Last updated: 2025-08-17

---

## 1. Overview
This refactor converts the project to **prefix-less English (`/`)** plus language-prefixed routes (`/ru/*`, `/es/*`, `/de/*` …) with:

* Next 15 **App Router** configuration (`next.config.mjs → i18n`)
* Permanent 301 redirect from legacy `/en/*`
* Canonical `<link>` delivered per page
* next-sitemap ready for multi-locale XML
* No client-side locale detection – SEO friendly

---

## 2. Code changes recap
| File | Key additions |
|------|---------------|
| `next.config.mjs` | `i18n` block, 301 redirect rule |
| `src/middleware.ts` | Removed root `/ → /en`; keeps locale prefix logic |
| `src/app/layout.tsx` | Injects `<CanonicalLink />` |
| `src/components/ui/canonical-link.tsx` | Tiny client RSC wrapper |
| `next-sitemap.config.js` | *(create if missing – see section 5)* |

---

## 3. Add / update locale content
For every declared locale add MDX:

```
src/content/pages/{locale}/about.mdx
src/content/pages/{locale}/privacy.mdx
...
```

If a page is missing Next will fall back to **307 → /about** as observed; add the file to serve **200 OK**.

---

## 4. Verification

### 4.1 Build (static)
```bash
pnpm build
```
Ensure no `export-path-mismatch` errors.  
Tip: remove/complete folders that lack docs (e.g. `/es/docs`).

### 4.2 Dev‐mode smoke test
```bash
pnpm dev
# In another shell:
curl -I http://localhost:3000/sitemap.xml          # 200
curl -I http://localhost:3000/en/about             # 301 / 307 → /about
curl -I http://localhost:3000/ru/about             # 200 (after RU page exists)
```

### 4.3 Production preview (Cloudflare Worker)
```bash
pnpm preview               # uses @opennextjs/cloudflare
curl -I http://127.0.0.1:8788/sitemap.xml
```

---

## 5. next-sitemap

```
pnpm add -D next-sitemap
```

`next-sitemap.config.js`
```js
module.exports = {
  siteUrl: 'https://superduperai.co',
  generateRobotsTxt: true,
  i18n: {
    locales: ['en', 'ru', 'es', 'de'],
    defaultLocale: 'en',
  },
};
```

Run once:
```bash
npx next-sitemap
```
Output `/public/sitemap.xml` plus `robots.txt`.

---

## 6. FAQ

**Q: “i18n configuration is unsupported in App Router” warning?**  
A: Next warns because App Router relies on **route groups** instead of the old Pages-router i18n. We purposely use i18n **only for locale detection in `headers/redirects`**, which is safe. All routing remains manual via `[locale]/…` folders.

**Q: Why `/ru/about` 307s to `/about`?**  
A: The Russian version is missing (`src/content/pages/ru/about.mdx`). Add file and rebuild.

---

Happy multilingual shipping 🚀