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

// Указываем статический режим рендеринга
export const dynamic = 'force-static';
export const revalidate = false;

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
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
