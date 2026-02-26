import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import AnalyticsProviders from "@/components/ui/analytics-providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { siteConfig } from "@/config/site";
import CanonicalLink from "@/components/ui/canonical-link";
import { JsonLd } from "@/components/ui/json-ld";

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
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <CanonicalLink />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "SuperDuperAI",
            url: "https://superduperai.co",
            description: siteConfig.description,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://superduperai.co/en/find-file?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "SuperDuperAi, Corp.",
            url: "https://superduperai.co",
            logo: "https://superduperai.co/images/logo.png",
            description:
              "Revolutionary AI platform for creating professional videos without skills. Multi-agent AI video creation.",
            address: {
              "@type": "PostalAddress",
              streetAddress: siteConfig.company.address1,
              addressLocality: "Wilmington",
              addressRegion: "DE",
              postalCode: "19806",
              addressCountry: "US",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: siteConfig.company.phone,
              email: siteConfig.company.email,
              contactType: "customer service",
            },
            sameAs: [
              "https://x.com/superduperaico",
              "https://www.youtube.com/@SuperDuperAI",
            ],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "SuperDuperAI",
            url: "https://superduperai.co",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Web",
            description:
              "Create stunning video stories in minutes. Turn ideas into captivating video stories instantly. Revolutionary AI platform for creating professional videos without skills.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free tier available with premium plans starting at $29/month",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "2000",
              bestRating: "5",
              worstRating: "1",
            },
            featureList: [
              "AI Video Generation",
              "Multi-Agent Video Creation",
              "Character Consistency with LORA Training",
              "4K Resolution Output",
              "87+ Visual Styles",
              "Vibe-Based Filmmaking",
              "Agent-Director Paradigm",
            ],
          }}
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
