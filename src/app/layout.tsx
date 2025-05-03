import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "SuperDuperAI — Turn Vibes into Videos",
  description: "AI filmmaking for creators, businesses, musicians, and teams. Turn your ideas into videos instantly.",
  keywords: ["AI video generation", "AI filmmaking", "video creation", "content creation"],
  authors: [{ name: "SuperDuperAI Team" }],
  creator: "SuperDuperAI",
  publisher: "SuperDuperAI",
  metadataBase: new URL("https://superduperai.co"),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "SuperDuperAI — Turn Vibes into Videos",
    description: "AI filmmaking for creators, businesses, musicians, and teams. Turn your ideas into videos instantly.",
    url: "https://superduperai.co",
    siteName: "SuperDuperAI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SuperDuperAI - AI Video Generation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SuperDuperAI — Turn Vibes into Videos",
    description: "AI filmmaking for creators, businesses, musicians, and teams. Turn your ideas into videos instantly.",
    images: ["/images/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://superduperai.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/images/og-image.jpg" as="image" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
