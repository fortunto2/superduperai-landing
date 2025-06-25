import { notFound } from "next/navigation";
import { allDocs } from ".contentlayer/generated";
import { getValidLocale } from "@/lib/get-valid-locale";
import { PageWrapper } from "@/components/content/page-wrapper";
import { MDXContent } from "@/components/content/mdx-components";

interface DocPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { locale, slug } = await params;
  const validLocale = getValidLocale(locale);

  const doc = allDocs.find(
    (doc) => doc.slug === slug && doc.locale === validLocale
  );

  if (!doc) {
    notFound();
  }

  return (
    <PageWrapper
      title={doc.title}
      locale={validLocale}
      breadcrumbItems={[
        { label: "Documentation", href: "/docs" },
        { label: doc.title, href: doc.url },
      ]}
    >
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXContent code={doc.body.code} />
      </div>
    </PageWrapper>
  );
}

export async function generateStaticParams() {
  const paths: { locale: string; slug: string }[] = [];
  
  const locales = ["en", "ru", "es", "hi", "tr"];
  
  for (const locale of locales) {
    const docs = allDocs.filter((doc) => doc.locale === locale);
    for (const doc of docs) {
      paths.push({
        locale,
        slug: doc.slug,
      });
    }
  }
  
  return paths;
}

export async function generateMetadata({ params }: DocPageProps) {
  const { locale, slug } = await params;
  const validLocale = getValidLocale(locale);

  const doc = allDocs.find(
    (doc) => doc.slug === slug && doc.locale === validLocale
  );

  if (!doc) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: doc.seo?.title || `${doc.title} | SuperDuperAI Documentation`,
    description: doc.seo?.description || doc.description,
    keywords: doc.seo?.keywords,
    alternates: {
      canonical: doc.url,
    },
    openGraph: {
      title: doc.seo?.title || doc.title,
      description: doc.seo?.description || doc.description,
      type: "article",
    },
  };
} 