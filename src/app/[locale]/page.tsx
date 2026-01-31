import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Products } from "@/components/landing/products";
import { Founder } from "@/components/landing/founder";
import { Services } from "@/components/landing/services";
import { CTAGeneric } from "@/components/landing/cta-generic";
import { Footer } from "@/components/landing/footer";
import { allHomes } from ".contentlayer/generated";
import {
  generatePageMetadata,
  GRADIENTS,
  HOME_BANNER_PATH,
} from "@/lib/metadata";
import { notFound } from "next/navigation";

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

    const homeData = allHomes.find((home) => home.locale === locale);

    if (!homeData) {
      notFound();
    }

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/90">
        <Navbar />
        <main className="flex-1">
          <Hero ctaHref="/product/video-editor" ctaExternal={false} ctaLabelKey="hero.cta_learn_more" />
          <Products />
          <Founder />
          <Services />
          <CTAGeneric />
        </main>
        <Footer locale={locale} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering home page:", error);
    notFound();
  }
}
