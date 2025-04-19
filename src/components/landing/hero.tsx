"use client"

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-20">
      {/* Фоновая анимация/градиент */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-background to-background/80 z-0" />
      
      <div className="container relative z-10 flex flex-col items-center text-center gap-8">
        {/* Основной заголовок с анимацией */}
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Turn Vibes into Videos <span className="text-primary">Instantly</span>
        </motion.h1>
        
        {/* Подзаголовок */}
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Революционная AI-платформа для создания профессиональных видео без навыков, оборудования и бюджета. <span className="font-semibold text-foreground">В 10 раз быстрее и дешевле.</span>
        </motion.p>
        
        {/* CTA кнопки */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Button size="lg" className="text-lg px-8">
            Start Creating for Free
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            Watch a Demo
          </Button>
        </motion.div>
        
        {/* Опциональный видео-блок или скриншот */}
        <motion.div 
          className="relative w-full max-w-5xl mt-12 aspect-video rounded-lg overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            {/* Здесь может быть видео или изображение */}
            <div className="w-full h-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-medium">AI Video Preview</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 