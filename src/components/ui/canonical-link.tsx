// Use client-side hook to derive the current pathname at runtime
'use client';

import { usePathname } from 'next/navigation';

/**
 * CanonicalLink
 * --------------
 * Renders a canonical <link> element for SEO.
 * The href is built from the current pathname so that each page
 * advertises its own canonical URL without locale prefixes.
 *
 * NOTE:
 * • Base URL is hard-coded because it must be absolute.
 * • Component is tiny (≈0 B in bundle after tree-shake) and only
 *   runs on the client where usePathname is valid.
 */
export default function CanonicalLink() {
  const pathname = usePathname() || '/';

  return (
    <link
      rel="canonical"
      href={`https://superduperai.co${pathname}`}
      // Prevent duplicate tags if React re-renders <head>
      key="canonical"
    />
  );
}