"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { default as Link } from "@/components/ui/optimized-link";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { APP_URLS } from "@/lib/constants";
import { Dropdown } from "../ui/dropdown-menu";
import { i18n } from "@/config/i18n-config";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { getValidLocale } from "@/lib/get-valid-locale";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const params = useParams();
  const locale = getValidLocale(params.locale);
  const { t } = useTranslation(locale);

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
        <Link
          href="/"
          className="font-bold text-xl md:text-2xl flex items-center"
          title={t("navbar.home") + " - SuperDuperAI"}
        >
          <Logo className="" />
          <span className="text-accent">Super</span>DuperAI
        </Link>

        {/* Основная навигация - скрыта на мобильных */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-accent transition-colors"
            title={t("navbar.home") + " - SuperDuperAI"}
          >
            {t("navbar.home")}
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-accent transition-colors"
            title={t("navbar.about") + " - SuperDuperAI"}
          >
            {t("navbar.about")}
          </Link>
          <Link
            href="/pricing"
            className="text-muted-foreground hover:text-accent transition-colors"
            title={t("navbar.pricing") + " - SuperDuperAI"}
          >
            {t("navbar.pricing")}
          </Link>
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-accent transition-colors"
            title={t("navbar.blog") + " - SuperDuperAI"}
          >
            {t("navbar.blog")}
          </Link>
        </nav>

        {/* Кнопки действий - скрыты на мобильных */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <Button
            variant="outline"
            size="sm"
            className="border-accent/50 hover:border-accent/80 hover:text-accent"
            asChild
          >
            <a
              href={APP_URLS.DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              title={t("navbar.discord")}
            >
              {t("navbar.discord")}
            </a>
          </Button>
          <Button
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            asChild
          >
            <a
              href={APP_URLS.EDITOR_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              title={t("navbar.start")}
            >
              {t("navbar.start")}
            </a>
          </Button>
        </div>

        {/* Мобильное меню */}
        <button
          className="block md:hidden text-foreground hover:text-accent transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={
            isMobileMenuOpen ? t("navbar.close_menu") : t("navbar.open_menu")
          }
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
              <span className="font-semibold">
                <span className="text-accent">Super</span>DuperAI
              </span>
            </div>
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                title={t("navbar.home") + " - SuperDuperAI"}
              >
                {t("navbar.home")}
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                title={t("navbar.about") + " - SuperDuperAI"}
              >
                {t("navbar.about")}
              </Link>
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                title={t("navbar.pricing") + " - SuperDuperAI"}
              >
                {t("navbar.pricing")}
              </Link>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                title={t("navbar.blog") + " - SuperDuperAI"}
              >
                {t("navbar.blog")}
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                title={t("navbar.terms") + " - SuperDuperAI"}
              >
                {t("navbar.terms")}
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                title={t("navbar.privacy") + " - SuperDuperAI"}
              >
                {t("navbar.privacy")}
              </Link>
            </nav>
            <div className="flex flex-col gap-3 mt-2">
              <LanguageSwitcher />
              <Button
                variant="outline"
                size="sm"
                className="w-full border-accent/50 hover:border-accent/80 hover:text-accent"
                asChild
              >
                <a
                  href="https://discord.gg/superduperai"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  title={t("navbar.discord")}
                >
                  {t("navbar.discord")}
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-accent/50 hover:border-accent/80 hover:text-accent"
                asChild
              >
                <a
                  href="https://discord.gg/superduperai"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  title={t("navbar.discord")}
                >
                  {t("navbar.discord")}
                </a>
              </Button>
              <Button
                size="sm"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                asChild
              >
                <a
                  href={APP_URLS.EDITOR_URL}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  title={t("navbar.start")}
                >
                  {t("navbar.start")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
];

export const LanguageSwitcher = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentLocale, setCurrentLocale] = useState<string>("");
  const [selected, setSelected] = useState<string>("");

  // Используем useCallback для получения локали
  const getLocale = useCallback(async () => {
    try {
      // Проверяем наличие params.locale
      if (params && "locale" in params) {
        const localeParam = params.locale;

        // Проверяем, является ли это Promise
        if (
          localeParam &&
          typeof localeParam === "object" &&
          "then" in localeParam
        ) {
          // Если это Promise
          const localeValue = await localeParam;
          if (typeof localeValue === "string") {
            setCurrentLocale(localeValue);
            setSelected(localeValue);
          }
        } else if (typeof localeParam === "string") {
          // Если это строка
          setCurrentLocale(localeParam);
          setSelected(localeParam);
        } else {
          // Если это массив, берем первый элемент
          const localeValue = Array.isArray(localeParam)
            ? localeParam[0]
            : i18n.defaultLocale;
          setCurrentLocale(localeValue);
          setSelected(localeValue);
        }
      } else {
        // Если params.locale отсутствует, используем значение по умолчанию
        setCurrentLocale(i18n.defaultLocale);
        setSelected(i18n.defaultLocale);
      }
    } catch (error) {
      console.error("Error getting locale:", error);
      setCurrentLocale(i18n.defaultLocale);
      setSelected(i18n.defaultLocale);
    }
  }, [params]);

  useEffect(() => {
    getLocale();
  }, [getLocale]);

  const handleChange = (language: string) => {
    if (language === currentLocale) return;

    setSelected(language);

    // Устанавливаем cookie для сохранения выбранного языка
    document.cookie = `${i18n.cookieName}=${language}; path=/; max-age=${i18n.cookieMaxAge}`;

    // Для главной страницы, если мы используем чистые URL
    if (
      i18n.preserveRouteOnHome &&
      (pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`)
    ) {
      // Используем простое перенаправление на корневой URL для сохранения чистого URL
      window.location.href = "/";
      return;
    }

    // Для остальных страниц обновляем локаль в пути
    if (pathname) {
      const segments = pathname.split("/");
      segments[1] = language;
      const newPath = segments.join("/");
      router.push(newPath);
    }
  };

  // Отображаем дропдаун только когда параметры получены
  if (!currentLocale) return null;

  const label = LANGUAGES.find((o) => o.value === selected)?.label;

  return (
    <Dropdown
      value={selected}
      options={LANGUAGES}
      onChange={handleChange}
      trigger={
        <button
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1 text-sm border rounded-md bg-background hover:bg-muted transition"
          )}
        >
          {label}
          <ChevronDown className="w-4 h-4" />
        </button>
      }
    />
  );
};
