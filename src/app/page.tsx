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
import { generatePageMetadata, GRADIENTS, HOME_BANNER_PATH } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const home = allHomes[0];
  
  const title = home.seo?.title || home.title;
  const description = home.seo?.description || home.description;
  
  return generatePageMetadata({
    title,
    description,
    keywords: home.seo?.keywords || [],
    url: '/',
    ogImage: HOME_BANNER_PATH,
    meta: {
      pageType: 'home',
      gradient: GRADIENTS.home
    }
  });
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/90">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <CaseUseCases />
        <VideoShowcase />
        <ApprovedBy />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
} 