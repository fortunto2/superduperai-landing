import { Metadata } from "next";
import { allPages } from ".contentlayer/generated";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/content/mdx-components";
import { PageWrapper } from "@/components/content/page-wrapper";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Генерируем все возможные значения для статических страниц
export async function generateStaticParams() {
  const staticPages = ['about', 'creators', 'privacy', 'terms', 'pricing'];
  return staticPages.map((slug) => ({ slug }));
}

// Функция для получения метаданных страницы
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
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

// Функция для проверки наличия H1 в MDX контенте
function checkForH1InMDX(code: string): boolean {
  // Проверяем наличие строки, начинающейся с # в начале строки
  return /^#\s+/m.test(code);
}

// Основной компонент страницы
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = allPages.find((page) => page.slug === slug);
  
  if (!page) {
    notFound();
  }
  
  // Проверяем наличие заголовка H1 в MDX
  const hasH1Heading = checkForH1InMDX(page.body.raw);
  
  // Преобразуем slug в удобочитаемую метку для хлебных крошек
  const breadcrumbLabel = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return (
    <PageWrapper 
      title={page.title} 
      breadcrumbItems={[{ label: breadcrumbLabel, href: `/${slug}` }]}
      hasH1Heading={hasH1Heading}
    >
      <MDXContent code={page.body.code} />
    </PageWrapper>
  );
} 