import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CaseUseCases } from "@/components/landing/case-use-cases";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { ApprovedBy } from "@/components/landing/approved-by";
import { FAQ } from "@/components/landing/faq";
import { allHomes } from ".contentlayer/generated";
import { generatePageMetadata, GRADIENTS } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { VideoShowcase } from "@/components/landing/video-showcase";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "AI Video Editor — Create Stunning Videos in Minutes | SuperDuperAI",
    description:
      "Turn vibes into videos instantly. Multi-agent AI system for professional video creation without skills, equipment, or budget. Trusted by 2000+ creators.",
    keywords: [
      "AI video editor",
      "AI video creation",
      "video story maker",
      "AI filmmaking",
      "vibe filmmaking",
    ],
    url: "/product/video-editor",
    meta: {
      pageType: "product",
      gradient: GRADIENTS.product,
    },
  });
}

export default async function VideoEditorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const homeData = allHomes.find((home) => home.locale === locale);

  if (!homeData) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/90">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <CaseUseCases />
        <VideoShowcase />
        <ApprovedBy locale={locale} />
        <FAQ items={homeData.faq} locale={locale} />
        <CTA />
      </main>
      <Footer locale={locale} />
    </div>
  );
}
