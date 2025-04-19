"use client"

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div 
          className="max-w-5xl mx-auto bg-primary/5 p-10 md:p-16 rounded-3xl text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Фоновые элементы декора */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-6">
              Ready to create your next video sensation?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Присоединяйтесь к SuperDuperAI и начните создавать впечатляющие видео прямо сейчас.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Start Creating for Free
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 