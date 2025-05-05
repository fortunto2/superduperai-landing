import { default as Link } from "@/components/ui/optimized-link";
import { APP_URLS } from "@/lib/constants";
import { 
  DiscordIcon,
  InstagramIcon,
  TelegramIcon,
  TiktokIcon,
  YoutubeIcon,
  LinkedInIcon
} from "../ui/icons";

// Не импортируем contentlayer на стороне клиента, чтобы избежать ошибок
// Вместо этого будем использовать серверный компонент для списка инструментов
import { ToolList } from "@/components/content/tool-list";
import { CaseList } from "@/components/content/case-list";
import { PageList } from "@/components/content/page-list";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-12 bg-card/50 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">SuperDuperAI</h3>
            <div className="text-muted-foreground space-y-2">
              <p>SuperDuperAi, Corp.</p>
              <p>57 Saulsbury Rd, Unit E #1333</p>
              <p>Dover, DE 19904</p>
              <p>+1 818 619 0966</p>
              <a 
                href="mailto:info@superduperai.co" 
                className="hover:text-primary transition-colors duration-300"
                title="Email SuperDuperAI"
              >
                info@superduperai.co
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Pages</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link 
                  href={APP_URLS.ABOUT_URL} 
                  className="hover:text-primary transition-colors duration-300"
                  title="About SuperDuperAI"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href={APP_URLS.PRICING_URL} 
                  className="hover:text-primary transition-colors duration-300"
                  title="SuperDuperAI Pricing Plans"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href={APP_URLS.TERMS_URL} 
                  className="hover:text-primary transition-colors duration-300"
                  title="Terms and Conditions - SuperDuperAI"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link 
                  href={APP_URLS.PRIVACY_URL} 
                  className="hover:text-primary transition-colors duration-300"
                  title="Privacy Policy - SuperDuperAI"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <a 
                  href={APP_URLS.CALENDLY_URL}
                  target="_blank" 
                  rel="noopener noreferrer nofollow" 
                  className="hover:text-primary transition-colors duration-300"
                  title="Book a demo of SuperDuperAI"
                >
                  Book a Demo
                </a>
              </li>
              
              {/* Добавляем остальные страницы из PageList компонента прямо здесь */}
              <PageList />
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">AI Tools</h3>
            <ToolList />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Use Cases</h3>
            <CaseList />
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
          <p className="mb-4 md:mb-0">
            © {currentYear} SuperDuperAi Corp. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a 
              href={APP_URLS.INSTAGRAM_URL}
              target="_blank" 
              rel="noopener noreferrer nofollow" 
              className="hover:text-primary transition-colors duration-300"
              aria-label="Instagram"
              title="Follow SuperDuperAI on Instagram"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a 
              href={APP_URLS.YOUTUBE_URL}
              target="_blank" 
              rel="noopener noreferrer nofollow" 
              className="hover:text-primary transition-colors duration-300"
              aria-label="YouTube"
              title="Subscribe to SuperDuperAI on YouTube"
            >
              <YoutubeIcon className="h-5 w-5" />
            </a>
            <a 
              href={APP_URLS.TELEGRAM_URL}
              target="_blank" 
              rel="noopener noreferrer nofollow" 
              className="hover:text-primary transition-colors duration-300"
              aria-label="Telegram"
              title="Join SuperDuperAI on Telegram"
            >
              <TelegramIcon className="h-5 w-5" />
            </a>
            <a 
              href={APP_URLS.TIKTOK_URL}
              target="_blank" 
              rel="noopener noreferrer nofollow" 
              className="hover:text-primary transition-colors duration-300"
              aria-label="TikTok"
              title="Follow SuperDuperAI on TikTok"
            >
              <TiktokIcon className="h-5 w-5" />
            </a>
            <a 
              href={APP_URLS.DISCORD_URL}
              target="_blank" 
              rel="noopener noreferrer nofollow" 
              className="hover:text-primary transition-colors duration-300"
              aria-label="Discord"
              title="Join SuperDuperAI Discord server"
            >
              <DiscordIcon className="h-5 w-5" />
            </a>
            <a 
              href={APP_URLS.LINKEDIN_URL}
              target="_blank" 
              rel="noopener noreferrer nofollow" 
              className="hover:text-primary transition-colors duration-300"
              aria-label="LinkedIn"
              title="Connect with SuperDuperAI on LinkedIn"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 