import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import AnalyticsProviders from "@/components/ui/analytics-providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { siteConfig } from "@/config/site";
import { i18n } from "@/config/i18n-config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    type: "website",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: "/images/banner.webp",
        width: 1200,
        height: 630,
        alt: "SuperDuperAI Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/images/banner.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="x-default"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="canonical"
          href="https://superduperai.co"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {i18n.locales.map((locale) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={`https://superduperai.co/${locale}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://superduperai.co/"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        {children}
        <AnalyticsProviders />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
