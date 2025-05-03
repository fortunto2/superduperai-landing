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
import { Metadata } from "next";
import { allHomes } from ".contentlayer/generated";

export async function generateMetadata(): Promise<Metadata> {
  const home = allHomes[0];
  
  return {
    title: home.seo?.title || home.title,
    description: home.seo?.description || home.description,
    keywords: home.seo?.keywords || [],
  };
}

export default function Home() {
  const homeData = allHomes[0];
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features items={homeData.features} />
        <HowItWorks steps={homeData.howItWorks} />
        <UseCases items={homeData.useCases} />
        <ApprovedBy />
        <VideoShowcase />
        <FAQ items={homeData.faq} />
        <CTA />
      </main>
      <Footer />
    </div>
  );
} 