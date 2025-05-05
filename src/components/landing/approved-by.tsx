import { default as Link } from "@/components/ui/optimized-link";
import { MicrosoftIcon } from "../ui/icons";

export function ApprovedBy() {
  const partners = [
    {
      name: "Microsoft",
      url: "https://www.microsoft.com/en-us/startups/ai",
    }
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

  return (
    <section className="py-8 w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-8">
          Approved by
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 lg:gap-24">
          {partners.map((partner) => (
            <Link 
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 transition-opacity duration-300"
            >
              {partner.name === "Microsoft" && (
                <MicrosoftIcon size={360} className="h-64 w-auto" />
              )}
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/case"
            className="inline-flex items-center text-accent text-lg font-medium hover:underline"
          >
            See Case Studies
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 