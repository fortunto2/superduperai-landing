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

interface ProductCTAProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  appStoreComingSoon?: boolean;
}

export function ProductCTA({
  title,
  description,
  ctaLabel,
  ctaHref,
  ctaExternal = false,
  googlePlayUrl,
  appStoreUrl,
  appStoreComingSoon = false,
}: ProductCTAProps) {
  const hasStoreBadges = googlePlayUrl || appStoreUrl || appStoreComingSoon;

  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          className="max-w-4xl mx-auto glassmorphism p-10 md:p-14 rounded-3xl text-center relative overflow-hidden border border-accent/20 gradient-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              {description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
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
                        <div className="leading-tight font-semibold">
                          App Store
                        </div>
                      </div>
                    </a>
                  ) : appStoreComingSoon ? (
                    <div className="inline-flex items-center gap-2 bg-white/20 text-white/50 rounded-xl px-5 py-3 text-sm font-medium cursor-not-allowed">
                      <AppleIcon className="w-5 h-5" />
                      <div className="text-left">
                        <div className="text-[10px] opacity-60 leading-none">
                          Coming Soon
                        </div>
                        <div className="leading-tight font-semibold">
                          App Store
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <Button
                  size="lg"
                  className="text-lg px-8 btn-accent"
                  asChild
                >
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
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
