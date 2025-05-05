import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import AnalyticsProviders from "@/components/ui/analytics-providers";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "SuperDuperAI - AI Video Generation Platform",
  description: "AI filmmaking for creators, businesses, musicians, and teams. Turn your ideas into videos instantly.",
  openGraph: {
    type: 'website',
    title: 'SuperDuperAI - AI Video Generation Platform',
    description: 'AI filmmaking for creators, businesses, musicians, and teams. Turn your ideas into videos instantly.',
    images: [
      {
        url: '/images/banner.webp',
        width: 1200,
        height: 630,
        alt: 'SuperDuperAI Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SuperDuperAI - AI Video Generation Platform',
    description: 'AI filmmaking for creators, businesses, musicians, and teams. Turn your ideas into videos instantly.',
    images: ['/images/banner.webp'],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://superduperai.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      >
        {children}
        <AnalyticsProviders />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
