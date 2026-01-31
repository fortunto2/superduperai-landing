"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ProductHeroProps {
  name: string;
  tagline: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  badge?: string;
}

export function ProductHero({
  name,
  tagline,
  description,
  ctaLabel,
  ctaHref,
  ctaExternal = false,
  badge,
}: ProductHeroProps) {
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

        {ctaHref && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
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
          </motion.div>
        )}
      </div>
    </section>
  );
}
