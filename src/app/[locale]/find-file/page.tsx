import { Metadata } from 'next';
import FindFileClient from '@/components/find-file/find-file-client';

interface FindFilePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Find Your File | SuperDuperAI`,
    description: 'Find your AI-generated files using your session ID or payment information.',
    robots: 'noindex, nofollow',
  };
}

export default async function FindFilePage({ params }: FindFilePageProps) {
  const { locale } = await params;

  return <FindFileClient locale={locale} />;
} 