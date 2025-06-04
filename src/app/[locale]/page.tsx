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
import {
  generatePageMetadata,
  GRADIENTS,
  HOME_BANNER_PATH,
} from "@/lib/metadata";
import { notFound } from "next/navigation";
import { VideoShowcase } from "@/components/landing/video-showcase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  try {
    const { locale } = await params;

    const home = allHomes.find((home) => home.locale === locale);

    if (!home) {
      return {
        title: `Not Found`,
        description: "The requested page was not found.",
      };
    }

    const title = home.seo?.title || home.title;
    const description = home.seo?.description || home.description;

    return generatePageMetadata({
      title,
      description,
      keywords: home.seo?.keywords || [],
      url: "/",
      ogImage: HOME_BANNER_PATH,
      meta: {
        pageType: "home",
        gradient: GRADIENTS.home,
      },
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "SuperDuperAI",
      description: "AI platform for content creation.",
    };
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  try {
    const { locale } = await params;

    // Получение данных из ContentLayer для главной страницы
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
          <FAQ
            items={homeData.faq}
            locale={locale}
          />
          <CTA />
        </main>
        <Footer locale={locale} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering home page:", error);
    notFound();
  }
}
