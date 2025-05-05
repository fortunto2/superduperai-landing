import { allTools } from '.contentlayer/generated';
import { MDXContent } from '@/components/content/mdx-components';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/content/page-wrapper';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = allTools.find((tool) => tool.slug === slug);
  
  if (!tool) {
    return {};
  }
  
  return {
    title: tool.seo?.title || tool.title,
    description: tool.seo?.description || tool.description,
    keywords: tool.seo?.keywords || [],
  };
}

export async function generateStaticParams() {
  return allTools.map((tool) => ({
    slug: tool.slug,
  }));
}

// Функция для проверки наличия H1 в MDX контенте
function checkForH1InMDX(code: string): boolean {
  // Проверяем наличие строки, начинающейся с # в начале строки
  return /^#\s+/m.test(code);
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = allTools.find((tool) => tool.slug === slug);
  
  if (!tool) {
    notFound();
  }
  
  // Проверяем наличие заголовка H1 в MDX
  const hasH1Heading = checkForH1InMDX(tool.body.raw);
  
  // Подготавливаем метку для хлебных крошек
  const breadcrumbLabel = tool.title;
  
  return (
    <PageWrapper
      title={tool.title}
      breadcrumbItems={[
        { label: 'Tools', href: '/tools' },
        { label: breadcrumbLabel, href: `/tool/${slug}` }
      ]}
      hasH1Heading={hasH1Heading}
    >
      <MDXContent code={tool.body.code} />
    </PageWrapper>
  );
} 