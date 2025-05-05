"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { APP_URLS } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { FloatingElement } from "@/components/ui/view-transition";

export function Hero() {
  // Состояние для слайдера
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/images/screens/screen1.avif",
    "/images/screens/screen2.avif",
    "/images/screens/screen3.avif",
  ];

  // Автоматическое переключение слайдов
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  // Функции переключения слайдов
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-20 animated-bg">
      {/* Фоновая анимация/градиент */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-background to-background/80 z-0">
        <div className="absolute inset-0 opacity-20">
          <FloatingElement 
            className="absolute top-1/4 left-1/3 w-72 h-72 bg-accent/20 rounded-full filter blur-3xl" 
            transitionName="hero-blob-1"
          >
            <div />
          </FloatingElement>
          <FloatingElement 
            className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl" 
            transitionName="hero-blob-2"
          >
            <div />
          </FloatingElement>
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
          Turn Vibes into Videos <FloatingElement className="inline-block" transitionName="hero-accent"><span className="neon-text">Instantly</span></FloatingElement>
        </motion.h1>
        
        {/* Подзаголовок */}
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Revolutionary AI platform for creating professional videos without skills, equipment, or budget. <FloatingElement className="inline-block" transitionName="hero-highlight"><span className="font-semibold text-foreground">10x faster and cheaper.</span></FloatingElement>
        </motion.p>
        
        {/* CTA кнопки */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <FloatingElement transitionName="hero-cta-button">
            <Button size="lg" className="text-lg px-8 btn-accent" asChild>
              <a href={APP_URLS.EDITOR_URL} target="_blank" rel="noopener noreferrer nofollow" title="Start creating videos with SuperDuperAI">
                Start Creating for Free
              </a>
            </Button>
          </FloatingElement>
        </motion.div>
        
        {/* Слайдер со скриншотами */}
        <motion.div 
          className="relative w-full max-w-5xl mt-12 aspect-video rounded-lg overflow-hidden shadow-2xl border border-accent/20 gradient-border"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          style={{
            viewTransitionName: 'hero-showcase'
          }}
        >
          <div className="relative w-full h-full" style={{ backgroundColor: "#121113" }}>
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={slide}
                  alt={`SuperDuperAI screenshot ${index + 1}`}
                  title={`SuperDuperAI video creation platform - screenshot ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            ))}
            
            {/* Кнопки навигации */}
            <FloatingElement className="absolute left-4 top-1/2 -translate-y-1/2" transitionName="hero-nav-prev">
              <button 
                onClick={prevSlide}
                className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
                aria-label="Previous slide"
                title="View previous screenshot"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </FloatingElement>
            
            <FloatingElement className="absolute right-4 top-1/2 -translate-y-1/2" transitionName="hero-nav-next">
              <button 
                onClick={nextSlide}
                className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
                aria-label="Next slide"
                title="View next screenshot"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </FloatingElement>
            
            {/* Индикаторы слайдов */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentSlide ? "bg-white" : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  title={`View screenshot ${index + 1}`}
                  style={{
                    viewTransitionName: `hero-indicator-${index}`
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 