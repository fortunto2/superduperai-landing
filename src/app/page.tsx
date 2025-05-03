import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { UseCases } from "@/components/landing/use-cases";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { ApprovedBy } from "@/components/landing/approved-by";
import { FAQ } from "@/components/landing/faq-simple";
import { VideoShowcase } from "@/components/landing/video-showcase";
import { JsonLd } from "@/components/ui/json-ld";

// Указываем статический режим рендеринга
export const dynamic = 'force-static';
export const revalidate = false;

export default function Home() {
  // Структурированные данные JSON-LD для главной страницы
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SuperDuperAI",
    "url": "https://superduperai.co",
    "logo": "https://superduperai.co/images/logo.png",
    "description": "AI filmmaking for creators, businesses, musicians, and teams. Turn your ideas into videos instantly.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1 818 619 0966",
      "contactType": "customer service",
      "email": "info@superduperai.co"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "57 Saulsbury Rd, Unit E #1333",
      "addressLocality": "Dover",
      "addressRegion": "DE",
      "postalCode": "19904",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://twitter.com/superduperai",
      "https://www.linkedin.com/company/superduperai",
      "https://www.instagram.com/superduperai"
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <UseCases />
        <ApprovedBy />
        <VideoShowcase />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
