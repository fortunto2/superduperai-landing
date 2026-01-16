// Use client-side hook to derive the current pathname at runtime
'use client';

import { usePathname, useParams } from 'next/navigation';

const DEFAULT_LOCALE = 'en';
const LOCALES = ['en', 'ru', 'es', 'de', 'hi', 'tr'];

/**
 * CanonicalLink
 * --------------
 * Renders a canonical <link> element for SEO.
 * The href is built from the current pathname.
 *
 * For English (default locale): URLs without prefix (e.g., /about)
 * For other locales: URLs with prefix (e.g., /ru/about)
 *
 * NOTE:
 * • Base URL is hard-coded because it must be absolute.
 * • Component is tiny (≈0 B in bundle after tree-shake) and only
 *   runs on the client where usePathname is valid.
 */
export default function CanonicalLink() {
  const pathname = usePathname() || '/';
  const { locale } = useParams() as { locale?: string };

  // Strip existing locale prefix from pathname (if any)
  let pathWithoutLocale = pathname;
  for (const loc of LOCALES) {
    if (pathname === `/${loc}`) {
      pathWithoutLocale = '/';
      break;
    }
    if (pathname.startsWith(`/${loc}/`)) {
      pathWithoutLocale = pathname.slice(loc.length + 1);
      break;
    }
  }

  // For default locale (en): no prefix
  // For other locales: add prefix
  let canonicalPath: string;
  if (!locale || locale === DEFAULT_LOCALE) {
    canonicalPath = pathWithoutLocale;
  } else if (pathWithoutLocale === '/') {
    canonicalPath = `/${locale}`;
  } else {
    canonicalPath = `/${locale}${pathWithoutLocale}`;
  }

  return (
    <link
      rel="canonical"
      href={`https://superduperai.co${canonicalPath}`}
      // Prevent duplicate tags if React re-renders <head>
      key="canonical"
    />
  );
}