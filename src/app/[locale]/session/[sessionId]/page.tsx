import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import SessionLookupClient from '@/components/session/session-lookup-client';
import { Loader2 } from 'lucide-react';

interface SessionPageProps {
  params: Promise<{
    locale: string;
    sessionId: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Finding Your File | SuperDuperAI`,
    description: 'Locating your AI-generated file using session information.',
    robots: 'noindex, nofollow', // Don't index lookup pages
  };
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { locale, sessionId } = await params;

  // Validate session ID format (should be Stripe checkout session)
  if (!sessionId || (!sessionId.startsWith('cs_') && !sessionId.startsWith('cs_live_'))) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <SessionLookupClient sessionId={sessionId} locale={locale} />
    </Suspense>
  );
} 