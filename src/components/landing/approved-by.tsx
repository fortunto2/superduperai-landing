import Image from "next/image";
import Link from "next/link";

export function ApprovedBy() {
  const partners = [
    {
      name: "Microsoft",
      logo: "/images/partners/microsoft.svg",
      alt: "Microsoft logo",
      url: "https://microsoft.com",
    },
    {
      name: "OpenAI",
      logo: "/images/partners/openai.svg",
      alt: "OpenAI logo",
      url: "https://openai.com",
    },
    {
      name: "Auth0",
      logo: "/images/partners/auth0.svg",
      alt: "Auth0 logo",
      url: "https://auth0.com",
    },
    {
      name: "ElevenLabs",
      logo: "/images/partners/elevenlabs.svg",
      alt: "ElevenLabs logo",
      url: "https://elevenlabs.io",
    },
  ];

  return (
    <section className="py-16 w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16">
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
              <Image
                src={partner.logo}
                alt={partner.alt}
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 