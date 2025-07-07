"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { APP_URLS } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import { useParams } from "next/navigation";
import { getValidLocale } from "@/lib/get-valid-locale";

export function Hero() {
  const params = useParams();
  const locale = getValidLocale(params.locale);
  const { t } = useTranslation(locale);

  // Состояние для слайдера
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/images/screens/screen1.webp",
    "/images/screens/screen2.webp",
    "/images/screens/screen3.webp",
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
          {t("hero.title")}
        </motion.h1>

        {/* Подзаголовок */}
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {t("hero.description")}
        </motion.p>

        {/* CTA кнопки */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Button
            size="lg"
            className="text-lg px-8 btn-accent"
            asChild
          >
            <a
              href={APP_URLS.EDITOR_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              title={t("hero.cta")}
            >
              {t("hero.cta")}
            </a>
          </Button>
        </motion.div>

        {/* Слайдер со скриншотами */}
        <motion.div
          className="relative w-full max-w-5xl mt-12 aspect-video rounded-lg overflow-hidden shadow-2xl border border-accent/20 gradient-border"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          <div
            className="relative w-full h-full"
            style={{ backgroundColor: "#121113" }}
          >
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
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
              aria-label="Previous slide"
              title="View previous screenshot"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
              aria-label="Next slide"
              title="View next screenshot"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Индикаторы слайдов */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentSlide ? "bg-white" : "bg-white/30"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
