"use client";

import { use, useEffect } from "react";
import { getValidLocale } from "@/lib/get-valid-locale";

export default function LocaleLayout({
  children,
  params: routeParams, // Next.js passes route params directly to layouts
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Use React.use() to unwrap the params Promise as required in Next.js 15
  const params = use(routeParams);
  const currentLocale = getValidLocale(params.locale);

  useEffect(() => {
    // This effect will run on the client after hydration
    // It ensures the lang attribute is set correctly even if it was x-default initially
    // or if locale changes during client-side navigation (though less common for lang attribute itself)
    if (currentLocale) {
      const htmlTag = document.documentElement;
      if (htmlTag.lang !== currentLocale) {
        htmlTag.lang = currentLocale;
      }
    }
    // The dependency array ensures this runs if currentLocale changes,
    // although for a layout param, it's set on route change.
  }, [currentLocale]);

  return <>{children}</>;
}
