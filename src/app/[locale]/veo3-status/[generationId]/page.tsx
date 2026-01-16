import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Veo3StatusClient from '@/components/veo3/veo3-status-client';

interface Veo3StatusPageProps {
  params: Promise<{
    locale: string;
    generationId: string;
  }>;
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export async function generateMetadata({ params }: Veo3StatusPageProps): Promise<Metadata> {
  const { generationId } = await params;
  
  return {
    title: `VEO3 Video Generation Status - ${generationId}`,
    description: 'Check the status of your VEO3 video generation',
    robots: 'noindex, nofollow',
  };
}

export default async function Veo3StatusPage({ params, searchParams }: Veo3StatusPageProps) {
  const { locale, generationId } = await params;
  const { session_id } = await searchParams;

  // Validate generationId format
  if (!generationId || typeof generationId !== 'string') {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          VEO3 Video Generation Status
        </h1>
        
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <Veo3StatusClient 
            generationId={generationId}
            sessionId={session_id}
            locale={locale}
          />
        </Suspense>
      </div>
    </div>
  );
} 