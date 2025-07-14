import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { existsSync } from 'fs';
import { join } from 'path';
import Veo3StatusClient from '@/components/veo3/veo3-status-client';

interface Veo3StatusPageProps {
  params: Promise<{
    locale: string;
    generationId: string;
  }>;
}

export async function generateMetadata({ params }: Veo3StatusPageProps): Promise<Metadata> {
  const { generationId } = await params;
  return {
    title: `VEO3 Video Generation Status - ${generationId}`,
    description: 'Track your VEO3 AI video generation progress and download completed videos.',
    robots: 'noindex, nofollow', // Don't index status pages
  };
}

export default async function Veo3StatusPage({ params }: Veo3StatusPageProps) {
  const { locale, generationId } = await params;

  // Validate generation ID format
  if (!generationId || !generationId.startsWith('veo3_')) {
    notFound();
  }

  // Check if generation file exists
  const generationFilePath = join(process.cwd(), '.veo3-generations', `${generationId}.json`);
  
  // For new generations, file should exist immediately
  // For old generations, show a helpful message instead of 404
  const fileExists = existsSync(generationFilePath);
  
  if (!fileExists) {
    // Check if this is an old generation ID (before the fix)
    const isOldGeneration = generationId.includes('_') && generationId.length > 10;
    
    if (isOldGeneration) {
      // Show a helpful message for old generation IDs
      return (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Generation Not Found</h1>
              <p className="text-muted-foreground mb-6">
                This generation link is from before our recent system update. 
                The video generation data is no longer available.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Generation ID: <code className="bg-muted px-2 py-1 rounded">{generationId}</code>
              </p>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Please create a new video generation:
                </p>
                <a 
                  href="/en/tool/veo3-prompt-generator"
                  className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Create New VEO3 Video
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">VEO3 Video Generation</h1>
            <p className="text-muted-foreground">
              Generation ID: <code className="bg-muted px-2 py-1 rounded text-sm">{generationId}</code>
            </p>
          </div>

          <Veo3StatusClient 
            generationId={generationId} 
            locale={locale} 
          />
        </div>
      </div>
    </div>
  );
} 