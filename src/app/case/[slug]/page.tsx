import { allCases } from '.contentlayer/generated';
import { MDXContent } from '@/components/content/mdx-components';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

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
  
  return {
    title: caseItem.seo?.title || caseItem.title,
    description: caseItem.seo?.description || caseItem.description,
    keywords: caseItem.seo?.keywords || [],
  };
}

export async function generateStaticParams() {
  return allCases.map((caseItem) => ({
    slug: caseItem.slug,
  }));
}

export default async function CasePage({ params }: PageProps) {
  const { slug } = await params;
  const caseItem = allCases.find((caseItem) => caseItem.slug === slug);
  
  if (!caseItem) {
    notFound();
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-10">
          <article className="prose dark:prose-invert max-w-none">
            <MDXContent code={caseItem.body.code} />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
} 