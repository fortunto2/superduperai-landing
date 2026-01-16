import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import FileStatusClient from '@/components/file/file-status-client';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

interface FileStatusPageProps {
  params: Promise<{
    locale: string;
    fileId: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `AI File Generation Status | SuperDuperAI`,
    description: 'Track your AI file generation progress and download completed videos, images, and audio files.',
    robots: 'noindex, nofollow', // Don't index status pages
  };
}

export default async function FileStatusPage({ params }: FileStatusPageProps) {
  const { locale, fileId } = await params;

  // Validate file ID format (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!fileId || !uuidRegex.test(fileId)) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">
              AI File Generation Status
            </h1>
            <FileStatusClient fileId={fileId} locale={locale} showToolInfo={true} />
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
} 