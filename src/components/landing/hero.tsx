"use client"

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { APP_URLS } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-20 animated-bg">
      {/* Фоновая анимация/градиент */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-background to-background/80 z-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-accent/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl"></div>
        </div>
      </div>
      
      <div className="container relative z-10 flex flex-col items-center text-center gap-8">
        {/* Основной заголовок с анимацией */}
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Turn Vibes into Videos <span className="neon-text">Instantly</span>
        </motion.h1>
        
        {/* Подзаголовок */}
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Revolutionary AI platform for creating professional videos without skills, equipment, or budget. <span className="font-semibold text-foreground">10x faster and cheaper.</span>
        </motion.p>
        
        {/* CTA кнопки */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Button size="lg" className="text-lg px-8 btn-accent" asChild>
            <a href={APP_URLS.EDITOR_URL} target="_blank" rel="noopener noreferrer">
              Start Creating for Free
            </a>
          </Button>
        </motion.div>
        
        {/* Опциональный видео-блок или скриншот */}
        <motion.div 
          className="relative w-full max-w-5xl mt-12 aspect-video rounded-lg overflow-hidden shadow-2xl border border-accent/20 gradient-border"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            {/* Здесь может быть видео или изображение */}
            <div className="w-full h-full bg-gradient-to-tr from-accent/20 via-secondary/40 to-accent/30 opacity-80"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-medium">AI Video Preview</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 