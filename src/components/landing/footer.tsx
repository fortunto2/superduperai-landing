"use client";

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
import { SlideTransition, ScaleTransition } from "@/components/ui/slide-transition";

// Не импортируем contentlayer на стороне клиента, чтобы избежать ошибок
// Вместо этого будем использовать серверный компонент для списка инструментов
import { ToolList } from "@/components/content/tool-list";
import { CaseList } from "@/components/content/case-list";
import { PageList } from "@/components/content/page-list";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: "Instagram",
      url: APP_URLS.INSTAGRAM_URL,
      icon: <InstagramIcon className="h-5 w-5" />,
      title: "Follow SuperDuperAI on Instagram"
    },
    {
      name: "YouTube",
      url: APP_URLS.YOUTUBE_URL,
      icon: <YoutubeIcon className="h-5 w-5" />,
      title: "Subscribe to SuperDuperAI on YouTube"
    },
    {
      name: "Telegram",
      url: APP_URLS.TELEGRAM_URL,
      icon: <TelegramIcon className="h-5 w-5" />,
      title: "Join SuperDuperAI on Telegram"
    },
    {
      name: "TikTok",
      url: APP_URLS.TIKTOK_URL,
      icon: <TiktokIcon className="h-5 w-5" />,
      title: "Follow SuperDuperAI on TikTok"
    },
    {
      name: "Discord",
      url: APP_URLS.DISCORD_URL,
      icon: <DiscordIcon className="h-5 w-5" />,
      title: "Join SuperDuperAI Discord server"
    },
    {
      name: "LinkedIn",
      url: APP_URLS.LINKEDIN_URL,
      icon: <LinkedInIcon className="h-5 w-5" />,
      title: "Connect with SuperDuperAI on LinkedIn"
    }
  ];

  return (
    <footer className="w-full py-12 bg-card/50 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ScaleTransition name="footer-company" duration={400}>
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
          </ScaleTransition>
          
          <ScaleTransition name="footer-pages" duration={500}>
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
          </ScaleTransition>
          
          <ScaleTransition name="footer-tools" duration={600}>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">AI Tools</h3>
              <ToolList />
            </div>
          </ScaleTransition>

          <ScaleTransition name="footer-cases" duration={700}>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Use Cases</h3>
              <CaseList />
            </div>
          </ScaleTransition>
        </div>
        
        <SlideTransition name="footer-bottom" direction="vertical" distance={10} duration={400}>
          <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
            <p className="mb-4 md:mb-0">
              © {currentYear} SuperDuperAi Corp. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((social, index) => (
                <ScaleTransition
                  key={social.name}
                  name={`footer-social-${index}`}
                  startScale={0.8}
                  endScale={0.8}
                  duration={300}
                >
                  <a 
                    href={social.url}
                    target="_blank" 
                    rel="noopener noreferrer nofollow" 
                    className="hover:text-primary transition-colors duration-300"
                    aria-label={social.name}
                    title={social.title}
                  >
                    {social.icon}
                  </a>
                </ScaleTransition>
              ))}
            </div>
          </div>
        </SlideTransition>
      </div>
    </footer>
  );
} 