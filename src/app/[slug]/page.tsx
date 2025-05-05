import { Metadata } from "next";
import { allPages } from ".contentlayer/generated";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/content/mdx-components";
import { PageWrapper } from "@/components/content/page-wrapper";

interface PageParams {
  slug: string;
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const staticPages = ['about', 'creators', 'privacy', 'terms', 'pricing'];
  return staticPages.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  // Важно: преобразуем params в простую переменную
  const slug = String(params?.slug || '');
  
  const page = allPages.find((page) => page.slug === slug);
  
  if (!page) {
    return {
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} - Not Found`,
      description: "The requested page was not found."
    };
  }
  
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.description,
    keywords: page.seo?.keywords || [],
  };
}

export default async function DynamicPage({
  params,
}: {
  params: PageParams;
}) {
  // Важно: преобразуем params в простую переменную
  const slug = String(params?.slug || '');
  
  const page = allPages.find((page) => page.slug === slug);
  
  if (!page) {
    notFound();
  }
  
  // Преобразуем slug в удобочитаемую метку для хлебных крошек
  const breadcrumbLabel = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return (
    <PageWrapper 
      title={page.title} 
      breadcrumbItems={[{ label: breadcrumbLabel, href: `/${slug}` }]}
    >
      <MDXContent code={page.body.code} />
    </PageWrapper>
  );
} 