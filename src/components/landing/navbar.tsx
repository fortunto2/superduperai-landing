"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 shadow-sm backdrop-blur-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="font-bold text-xl md:text-2xl">
          SuperDuperAI
        </Link>

        {/* Основная навигация - скрыта на мобильных */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Функции
          </Link>
          <Link
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Как это работает
          </Link>
          <Link
            href="#pricing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Цены
          </Link>
        </nav>

        {/* Кнопки действий - скрыты на мобильных */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm">
            Войти
          </Button>
          <Button size="sm">Начать бесплатно</Button>
        </div>

        {/* Мобильное меню */}
        <button
          className="block md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Мобильная навигация */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b border-border shadow-md md:hidden">
          <div className="container py-4 flex flex-col gap-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Функции
              </Link>
              <Link
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Как это работает
              </Link>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Цены
              </Link>
            </nav>
            <div className="flex flex-col gap-3 mt-2">
              <Button variant="outline" size="sm" className="w-full">
                Войти
              </Button>
              <Button size="sm" className="w-full">
                Начать бесплатно
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 