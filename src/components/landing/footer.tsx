import { default as Link } from "@/components/ui/optimized-link";
import { APP_URLS } from "@/lib/constants";
import {
  DiscordIcon,
  InstagramIcon,
  TelegramIcon,
  TiktokIcon,
  YoutubeIcon,
  LinkedInIcon,
} from "../ui/icons";

// Не импортируем contentlayer на стороне клиента, чтобы избежать ошибок
// Вместо этого будем использовать серверный компонент для списка инструментов
import { ToolList } from "@/components/content/tool-list";
import { CaseList } from "@/components/content/case-list";
import { PageList } from "@/components/content/page-list";
import { useTranslation } from "@/hooks/use-translation";
import { getValidLocale } from "@/lib/get-valid-locale";

export function Footer({ locale }: { locale: string }) {
  const { t } = useTranslation(getValidLocale(locale));
  const currentYear = new Date().getFullYear();
  const pages = {
    about: t("footer.pages.about"),
    pricing: t("footer.pages.pricing"),
    terms: t("footer.pages.terms"),
    privacy: t("footer.pages.privacy"),
    demo: t("footer.pages.demo"),
  };

  return (
    <footer className="w-full py-12 bg-card/50 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t("footer.company")}</h3>
            <div className="text-muted-foreground space-y-2">
              <p>{t("footer.corp")}</p>
              <p>{t("footer.address1")}</p>
              <p>{t("footer.address2")}</p>
              <p>{t("footer.phone")}</p>
              <a
                href={`mailto:${t("footer.email")}`}
                className="hover:text-primary transition-colors duration-300"
                title={t("footer.email")}
              >
                {t("footer.email")}
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t("marketing.pages")}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href={APP_URLS.ABOUT_URL}
                  className="hover:text-primary transition-colors duration-300"
                  title={pages.about}
                >
                  {pages.about}
                </Link>
              </li>
              <li>
                <Link
                  href={APP_URLS.PRICING_URL}
                  className="hover:text-primary transition-colors duration-300"
                  title={pages.pricing}
                >
                  {pages.pricing}
                </Link>
              </li>
              <li>
                <Link
                  href={APP_URLS.TERMS_URL}
                  className="hover:text-primary transition-colors duration-300"
                  title={pages.terms}
                >
                  {pages.terms}
                </Link>
              </li>
              <li>
                <Link
                  href={APP_URLS.PRIVACY_URL}
                  className="hover:text-primary transition-colors duration-300"
                  title={pages.privacy}
                >
                  {pages.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primary transition-colors duration-300"
                  title={t("footer.pages.blog")}
                >
                  {t("footer.pages.blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="hover:text-primary transition-colors duration-300"
                  title="Documentation"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <a
                  href={APP_URLS.CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="hover:text-primary transition-colors duration-300"
                  title={pages.demo}
                >
                  {pages.demo}
                </a>
              </li>

              {/* Добавляем остальные страницы из PageList компонента прямо здесь */}
              <PageList locale={locale} />
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t("marketing.tools")}</h3>
            <ToolList locale={locale} />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t("marketing.cases")}</h3>
            <CaseList locale={locale} />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
          <p className="mb-4 md:mb-0">
            {t("footer.copyright").replace("{year}", String(currentYear))}
          </p>
          <div className="flex space-x-6">
            <a
              href={APP_URLS.INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:text-primary transition-colors duration-300"
              aria-label="Instagram"
              title={t("footer.social.instagram")}
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={APP_URLS.YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:text-primary transition-colors duration-300"
              aria-label="YouTube"
              title={t("footer.social.youtube")}
            >
              <YoutubeIcon className="h-5 w-5" />
            </a>
            <a
              href={APP_URLS.TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:text-primary transition-colors duration-300"
              aria-label="Telegram"
              title={t("footer.social.telegram")}
            >
              <TelegramIcon className="h-5 w-5" />
            </a>
            <a
              href={APP_URLS.TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:text-primary transition-colors duration-300"
              aria-label="TikTok"
              title={t("footer.social.tiktok")}
            >
              <TiktokIcon className="h-5 w-5" />
            </a>
            <a
              href={APP_URLS.DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:text-primary transition-colors duration-300"
              aria-label="Discord"
              title={t("footer.social.discord")}
            >
              <DiscordIcon className="h-5 w-5" />
            </a>
            <a
              href={APP_URLS.LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:text-primary transition-colors duration-300"
              aria-label="LinkedIn"
              title={t("footer.social.linkedin")}
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
