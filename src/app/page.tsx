import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { HowItWorks } from '@/components/landing/how-it-works';
import { CaseUseCases } from '@/components/landing/case-use-cases';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';
import { ApprovedBy } from '@/components/landing/approved-by';
import { VideoShowcase } from '@/components/landing/video-showcase';
import { FAQ } from '@/components/landing/faq';
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
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/90">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ApprovedBy />
        <Features />
        <HowItWorks />
        <VideoShowcase />
        <CaseUseCases />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
} 