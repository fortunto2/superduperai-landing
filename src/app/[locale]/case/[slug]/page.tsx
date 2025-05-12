import { allCases } from '.contentlayer/generated';
import { MDXContent } from '@/components/content/mdx-components';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/content/page-wrapper';
import { generatePageMetadata, GRADIENTS } from '@/lib/metadata';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = allCases.find((caseItem) => caseItem.slug === slug);
  
  if (!caseItem) {
    return {};
  }
  
  const title = caseItem.seo?.title || caseItem.title;
  const description = caseItem.seo?.description || caseItem.description;
  
  return generatePageMetadata({
    title,
    description,
    keywords: caseItem.seo?.keywords || [],
    url: `/case/${slug}`,
    ogImage: caseItem.seo?.ogImage || caseItem.image,
    type: 'article',
    meta: {
      pageType: 'case',
      category: caseItem.category,
      gradient: GRADIENTS.case
    }
  });
}

export async function generateStaticParams() {
  return allCases.map((caseItem) => ({
    slug: caseItem.slug,
  }));
}

// Функция для проверки наличия H1 в MDX контенте
function checkForH1InMDX(code: string): boolean {
  // Проверяем наличие строки, начинающейся с # в начале строки
  return /^#\s+/m.test(code);
}

export default async function CasePage({ params }: PageProps) {
  const { slug } = await params;
  const caseItem = allCases.find((caseItem) => caseItem.slug === slug);
  
  if (!caseItem) {
    notFound();
  }
  
  // Проверяем наличие заголовка H1 в MDX
  const hasH1Heading = checkForH1InMDX(caseItem.body.raw);
  
  // Подготавливаем метку для хлебных крошек
  const breadcrumbLabel = caseItem.title;
  
  return (
    <PageWrapper
      title={caseItem.title}
      breadcrumbItems={[
        { label: 'Case Studies', href: '/cases' },
        { label: breadcrumbLabel, href: `/case/${slug}` }
      ]}
      hasH1Heading={hasH1Heading}
    >
      <MDXContent code={caseItem.body.code} />
    </PageWrapper>
  );
} 