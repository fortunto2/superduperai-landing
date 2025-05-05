"use client";

import { APP_URLS } from "@/lib/constants";
import { DiscordIcon, TelegramIcon, TiktokIcon, YoutubeIcon, InstagramIcon } from "@/components/ui/icons";
import { SlideTransition, RotateTransition } from "@/components/ui/slide-transition";

export function VideoShowcase() {
  const socialLinks = [
    {
      name: "Instagram",
      url: APP_URLS.INSTAGRAM_URL,
      icon: <InstagramIcon size={48} className="h-12 w-12" />,
      title: "Follow SuperDuperAI on Instagram"
    },
    {
      name: "YouTube",
      url: APP_URLS.YOUTUBE_URL,
      icon: <YoutubeIcon size={48} className="h-12 w-12" />,
      title: "Subscribe to SuperDuperAI on YouTube"
    },
    {
      name: "Telegram",
      url: APP_URLS.TELEGRAM_URL,
      icon: <TelegramIcon size={48} className="h-12 w-12" />,
      title: "Join SuperDuperAI on Telegram"
    },
    {
      name: "Discord",
      url: APP_URLS.DISCORD_URL,
      icon: <DiscordIcon size={48} className="h-12 w-12" />,
      title: "Join SuperDuperAI Discord server"
    },
    {
      name: "TikTok",
      url: APP_URLS.TIKTOK_URL,
      icon: <TiktokIcon size={48} className="h-12 w-12" />,
      title: "Follow SuperDuperAI on TikTok"
    }
  ];

  return (
    <section className="py-16 w-full">
      <div className="container mx-auto px-4">
        <RotateTransition name="showcase-title" startAngle={3} endAngle={-3} duration={300}>
          <h2 className="text-5xl font-bold text-center mb-8">Look!</h2>
        </RotateTransition>
        <div className="flex justify-center gap-8 mt-16">
          {socialLinks.map((social, index) => (
            <SlideTransition 
              key={social.name}
              name={`social-icon-${index}`}
              direction="vertical"
              distance={20}
              duration={300 + index * 100}
            >
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-accent hover:text-accent/80 transition-colors"
                aria-label={social.name}
                title={social.title}
              >
                {social.icon}
              </a>
            </SlideTransition>
          ))}
        </div>
      </div>
    </section>
  );
} 