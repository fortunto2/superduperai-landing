import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FileStatusClient } from '@/components/file/file-status-client';

interface FileStatusPageProps {
  params: {
    locale: string;
    fileId: string;
  };
}

export async function generateMetadata({ params }: FileStatusPageProps): Promise<Metadata> {
  const { fileId } = await params;
  return {
    title: `File Status - ${fileId}`,
    description: 'Track your AI file generation progress and download completed files.',
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <FileStatusClient fileId={fileId} locale={locale} />
      </div>
    </div>
  );
} 