import { default as Link } from "@/components/ui/optimized-link";
import { MicrosoftIcon } from "../ui/icons";
import { useTranslation } from "@/hooks/use-translation";
import { Locale } from "@/config/i18n-config";

export function ApprovedBy({ locale }: { locale: string }) {
  const partners = [
    {
      name: "Microsoft",
      url: "https://www.microsoft.com/en-us/startups/ai",
    },
    // {
    //   name: "OpenAI",
    //   logo: "/images/partners/openai.png",
    //   alt: "OpenAI logo",
    //   url: "https://openai.com",
    // },
    // {
    //   name: "Auth0",
    //   logo: "/images/partners/auth0.png",
    //   alt: "Auth0 logo",
    //   url: "https://auth0.com/startups",
    // },
    // {
    //   name: "ElevenLabs",
    //   logo: "/images/partners/elevenlabs.svg",
    //   alt: "ElevenLabs logo",
    //   url: "https://elevenlabs.io/startup-grants",
    // },
  ];

  const { t } = useTranslation(locale as Locale);

  return (
    <section className="py-8 w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-8">
          {t("ui.approved_by")}
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 lg:gap-24">
          {partners.map((partner) => (
            <Link
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="opacity-80 hover:opacity-100 transition-opacity duration-300"
              title={`${partner.name} for Startups - SuperDuperAI Partner`}
            >
              {partner.name === "Microsoft" && (
                <MicrosoftIcon
                  size={360}
                  className="h-64 w-auto"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
