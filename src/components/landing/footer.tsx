import Link from "next/link";
import { APP_URLS } from "@/lib/constants";
import { 
  DiscordIcon,
  InstagramIcon,
  TelegramIcon,
  TiktokIcon,
  YoutubeIcon
} from "../ui/icons";

// Не импортируем contentlayer на стороне клиента, чтобы избежать ошибок
// Вместо этого будем использовать серверный компонент для списка инструментов
import { ToolList } from "@/components/content/tool-list";
import { CaseList } from "@/components/content/case-list";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-12 bg-card/50 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
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
              >
                info@superduperai.co
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href={APP_URLS.ABOUT_URL} className="hover:text-primary transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link href={APP_URLS.PRICING_URL} className="hover:text-primary transition-colors duration-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href={APP_URLS.TERMS_URL} className="hover:text-primary transition-colors duration-300">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href={APP_URLS.PRIVACY_URL} className="hover:text-primary transition-colors duration-300">
                  Privacy
                </Link>
              </li>
              <li>
                <a 
                  href={APP_URLS.CALENDLY_URL}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors duration-300"
                >
                  Book a Demo
                </a>
              </li>
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
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Community</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a 
                  href={APP_URLS.DISCORD_URL}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors duration-300"
                >
                  Discord
                </a>
              </li>
              <li>
                <a 
                  href={APP_URLS.TRUSTPILOT_URL}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors duration-300"
                >
                  Trustpilot
                </a>
              </li>
              <li>
                <a 
                  href={APP_URLS.LINKEDIN_URL}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors duration-300"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
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
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors duration-300"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a 
              href={APP_URLS.YOUTUBE_URL}
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors duration-300"
            >
              <YoutubeIcon className="h-5 w-5" />
            </a>
            <a 
              href={APP_URLS.TELEGRAM_URL}
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors duration-300"
            >
              <TelegramIcon className="h-5 w-5" />
            </a>
            <a 
              href={APP_URLS.TIKTOK_URL}
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors duration-300"
            >
              <TiktokIcon className="h-5 w-5" />
            </a>
            <a 
              href={APP_URLS.DISCORD_URL}
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors duration-300"
            >
              <DiscordIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 