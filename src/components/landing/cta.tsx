"use client"

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { APP_URLS } from "@/lib/constants";
import { ScaleTransition, SlideTransition, RotateTransition } from "@/components/ui/slide-transition";

export function CTA() {
  return (
    <section className="py-20 animated-bg">
      <div className="container">
        <motion.div 
          className="max-w-5xl mx-auto glassmorphism p-10 md:p-16 rounded-3xl text-center relative overflow-hidden border border-accent/20 gradient-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Фоновые элементы декора */}
          <div className="absolute top-0 left-0 w-full h-full">
            <ScaleTransition name="cta-bubble-1" duration={800}>
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
            </ScaleTransition>
            <ScaleTransition name="cta-bubble-2" duration={800}>
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
            </ScaleTransition>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-6">
              Ready to create your next <RotateTransition name="cta-highlight" duration={400}><span className="neon-text">video sensation?</span></RotateTransition>
            </h2>
            <SlideTransition name="cta-description" direction="vertical" distance={20} duration={300}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Join SuperDuperAI and start creating amazing videos right now.
              </p>
            </SlideTransition>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SlideTransition name="cta-button" direction="horizontal" distance={30} duration={400}>
                <Button size="lg" className="text-lg px-8 btn-accent" asChild>
                  <a href={APP_URLS.EDITOR_URL} target="_blank" rel="noopener noreferrer" title="Start creating videos with SuperDuperAI">
                    Start Creating for Free
                  </a>
                </Button>
              </SlideTransition>
              <ScaleTransition name="cta-note" duration={300}>
                <p className="text-sm text-muted-foreground mt-4">
                  No credit card required
                </p>
              </ScaleTransition>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 