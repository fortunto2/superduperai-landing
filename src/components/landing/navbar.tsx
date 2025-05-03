"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { APP_URLS } from "@/lib/constants";


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
          ? "bg-background/80 shadow-sm backdrop-blur-md py-2 border-b border-accent/10"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="font-bold text-xl md:text-2xl flex items-center">
          <Logo className="" />
          <span className="text-accent">Super</span>DuperAI
        </Link>

        {/* Основная навигация - скрыта на мобильных */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            About
          </Link>
          <Link
            href="/pricing"
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Кнопки действий - скрыты на мобильных */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm" className="border-accent/50 hover:border-accent/80 hover:text-accent" asChild>
            <a href={APP_URLS.DISCORD_URL} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </Button>
          <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <a href={APP_URLS.EDITOR_URL} target="_blank" rel="noopener noreferrer">
              Start For Free
            </a>
          </Button>
        </div>

        {/* Мобильное меню */}
        <button
          className="block md:hidden text-foreground hover:text-accent transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
        <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-b border-accent/10 shadow-md md:hidden">
          <div className="container py-4 flex flex-col gap-4">
            <div className="flex items-center mb-4">
              <Logo className="h-0 w-11 mr-2" />
              <span className="font-semibold"><span className="text-accent">Super</span>DuperAI</span>
            </div>
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Privacy
              </Link>
            </nav>
            <div className="flex flex-col gap-3 mt-2">
              <Button variant="outline" size="sm" className="w-full border-accent/50 hover:border-accent/80 hover:text-accent" asChild>
                <a href="https://discord.gg/superduperai" target="_blank" rel="noopener noreferrer">
                  Discord
                </a>
              </Button>
              <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <a href={APP_URLS.EDITOR_URL} target="_blank" rel="noopener noreferrer">
                  Start For Free
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 