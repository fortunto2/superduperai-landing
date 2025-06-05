"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { getValidLocale } from "@/lib/get-valid-locale";
import { i18n, type Locale } from "@/config/i18n-config";

export default function LocaleLayout({
  children,
  params: routeParams, // Next.js passes route params directly to layouts
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Use the locale from routeParams passed by Next.js
  // This is available server-side and for initial client render
  const currentLocale = getValidLocale(routeParams.locale);

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
