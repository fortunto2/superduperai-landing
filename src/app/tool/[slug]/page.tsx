import { allTools } from '.contentlayer/generated';
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

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = allTools.find((tool) => tool.slug === slug);
  
  if (!tool) {
    notFound();
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-10">
          <article className="prose dark:prose-invert max-w-none">
            <MDXContent code={tool.body.code} />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
} 