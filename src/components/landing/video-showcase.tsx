import { APP_URLS } from "@/lib/constants";
import { DiscordIcon, TelegramIcon, TiktokIcon, YoutubeIcon, InstagramIcon } from "@/components/ui/icons";

export function VideoShowcase() {
  return (
    <section className="py-16 w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-8">Look!</h2>
        <div className="flex justify-center gap-8 mt-16">
          <a
            href={APP_URLS.INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-accent hover:text-accent/80 transition-colors"
            aria-label="Instagram"
            title="Follow SuperDuperAI on Instagram"
          >
            <InstagramIcon size={48} className="h-12 w-12" />
          </a>
          <a
            href={APP_URLS.YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-accent hover:text-accent/80 transition-colors"
            aria-label="YouTube"
            title="Subscribe to SuperDuperAI on YouTube"
          >
            <YoutubeIcon size={48} className="h-12 w-12" />
          </a>
          <a
            href={APP_URLS.TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-accent hover:text-accent/80 transition-colors"
            aria-label="Telegram"
            title="Join SuperDuperAI on Telegram"
          >
            <TelegramIcon size={48} className="h-12 w-12" />
          </a>
          <a
            href={APP_URLS.DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-accent hover:text-accent/80 transition-colors"
            aria-label="Discord"
            title="Join SuperDuperAI Discord server"
          >
            <DiscordIcon size={48} className="h-12 w-12" />
          </a>
          <a
            href={APP_URLS.TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-accent hover:text-accent/80 transition-colors"
            aria-label="TikTok"
            title="Follow SuperDuperAI on TikTok"
          >
            <TiktokIcon size={48} className="h-12 w-12" />
          </a>
        </div>
      </div>
    </section>
  );
} 