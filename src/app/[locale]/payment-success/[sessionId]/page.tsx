import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import PaymentSuccessClient from '@/components/payment/payment-success-client';

interface PaymentSuccessPageProps {
  params: Promise<{
    locale: string;
    sessionId: string;
  }>;
}

export async function generateMetadata({ params }: PaymentSuccessPageProps): Promise<Metadata> {
  const { sessionId } = await params;
  
  return {
    title: 'Payment Successful - Processing Your Video',
    description: 'Your payment was successful! We are now generating your AI video.',
    robots: 'noindex, nofollow',
  };
}

export default async function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
  const { locale, sessionId } = await params;

  // Validate sessionId format (Stripe session ID starts with cs_)
  if (!sessionId || !sessionId.startsWith('cs_')) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }>
            <PaymentSuccessClient 
              sessionId={sessionId}
              locale={locale}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 