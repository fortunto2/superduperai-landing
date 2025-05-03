import { allTools } from '.contentlayer/generated';
import Link from 'next/link';
import { Metadata } from 'next';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

export const metadata: Metadata = {
  title: 'AI Tools | SuperDuperAI',
  description: 'Explore our advanced AI tools for content creation',
};

export default function ToolsPage() {
  // @ts-expect-error - contentlayer2 типы будут сгенерированы после первой сборки
  const sortedTools = allTools.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-6">AI Tools</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTools.map((tool: any) => (
              <Link 
                href={tool.url} 
                key={tool.slug}
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <h2 className="text-xl font-bold mb-2">{tool.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 