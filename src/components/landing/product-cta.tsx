"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ProductCTAProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaExternal?: boolean;
}

export function ProductCTA({
  title,
  description,
  ctaLabel,
  ctaHref,
  ctaExternal = false,
}: ProductCTAProps) {
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
