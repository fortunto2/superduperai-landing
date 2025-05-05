"use client"

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { APP_URLS } from "@/lib/constants";

export function CTA() {
  return (
    <section className="py-20 animated-bg view-transition-fade">
      <div className="container">
        <motion.div 
          className="max-w-5xl mx-auto glassmorphism p-10 md:p-16 rounded-3xl text-center relative overflow-hidden border border-accent/20 gradient-border view-transition-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Фоновые элементы декора */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-6 view-transition-hero">
              Ready to create your next <span className="neon-text">video sensation?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 view-transition-fade">
              Join SuperDuperAI and start creating amazing videos right now.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 btn-accent view-transition-card-1" asChild>
                <a href={APP_URLS.EDITOR_URL} target="_blank" rel="noopener noreferrer">
                  Start Creating for Free
                </a>
              </Button>
              <p className="text-sm text-muted-foreground mt-4 view-transition-fade">
                No credit card required
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 