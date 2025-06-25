import { notFound } from "next/navigation";
import { allDocs } from ".contentlayer/generated";
import { getValidLocale } from "@/lib/get-valid-locale";
import { PageWrapper } from "@/components/content/page-wrapper";
import { FeatureGrid } from "@/components/content/feature-grid";
import { Feature } from "@/components/content/feature";
import Link from "next/link";

interface DocsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { locale } = await params;
  const validLocale = getValidLocale(locale);

  // Get docs for current locale
  const docs = allDocs
    .filter((doc) => doc.locale === validLocale)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (!docs.length) {
    notFound();
  }

  return (
    <PageWrapper
      title="Documentation"
      locale={validLocale}
      breadcrumbItems={[{ label: "Documentation", href: "/docs" }]}
    >
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">SuperDuperAI Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete guides and API references to help you integrate SuperDuperAI into your applications.
          </p>
        </div>

        <FeatureGrid>
          {docs.map((doc) => (
            <Link key={doc.slug} href={doc.url}>
              <Feature
                title={doc.title}
                description={doc.description}
                icon={doc.category === 'api' ? 'code' : 'book'}
              />
            </Link>
          ))}
        </FeatureGrid>
      </div>
    </PageWrapper>
  );
}

export async function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "ru" },
    { locale: "es" },
    { locale: "hi" },
    { locale: "tr" },
  ];
}

export async function generateMetadata() {
  
  return {
    title: "Documentation | SuperDuperAI",
    description: "Complete guides and API references for SuperDuperAI's video and image generation platform.",
    alternates: {
      canonical: `/docs`,
      languages: {
        en: "/en/docs",
        ru: "/ru/docs",
        es: "/es/docs",
        hi: "/hi/docs",
        tr: "/tr/docs",
      },
    },
  };
} 