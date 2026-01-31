"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

interface ProductHeroProps {
  name: string;
  tagline: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  badge?: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  appStoreComingSoon?: boolean;
}

export function ProductHero({
  name,
  tagline,
  description,
  ctaLabel,
  ctaHref,
  ctaExternal = false,
  badge,
  googlePlayUrl,
  appStoreUrl,
  appStoreComingSoon = false,
}: ProductHeroProps) {
  const hasStoreBadges = googlePlayUrl || appStoreUrl || appStoreComingSoon;

  return (
    <section className="relative w-full flex flex-col items-center justify-center overflow-hidden py-20 animated-bg">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-background to-background/80 z-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-accent/20 rounded-full filter blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl" />
        </div>
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center gap-6">
        {badge && (
          <motion.span
            className="text-xs px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {badge}
          </motion.span>
        )}

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {name}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-accent max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          {tagline}
        </motion.p>

        <motion.p
          className="text-muted-foreground max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {description}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          {hasStoreBadges ? (
            <>
              {googlePlayUrl && (
                <a
                  href={googlePlayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-black rounded-xl px-5 py-3 text-sm font-medium transition-all hover:bg-gray-100 hover:scale-105 active:scale-95"
                >
                  <PlayStoreIcon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-60 leading-none">
                      Download on
                    </div>
                    <div className="leading-tight font-semibold">
                      Google Play
                    </div>
                  </div>
                </a>
              )}
              {appStoreUrl ? (
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-black rounded-xl px-5 py-3 text-sm font-medium transition-all hover:bg-gray-100 hover:scale-105 active:scale-95"
                >
                  <AppleIcon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-60 leading-none">
                      Download on
                    </div>
                    <div className="leading-tight font-semibold">App Store</div>
                  </div>
                </a>
              ) : appStoreComingSoon ? (
                <div className="inline-flex items-center gap-2 bg-white/20 text-white/50 rounded-xl px-5 py-3 text-sm font-medium cursor-not-allowed">
                  <AppleIcon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-60 leading-none">
                      Coming Soon
                    </div>
                    <div className="leading-tight font-semibold">App Store</div>
                  </div>
                </div>
              ) : null}
            </>
          ) : ctaHref ? (
            <Button size="lg" className="text-lg px-8 btn-accent" asChild>
              {ctaExternal ? (
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={ctaLabel}
                >
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              ) : (
                <a href={ctaHref} title={ctaLabel}>
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              )}
            </Button>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
