"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  CheckCircle, 
  XCircle,
  Video,
  Clock,
  ArrowRight,
  Copy,
  Search,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentSuccessClientProps {
  sessionId: string;
  locale: string;
}

interface WebhookStatus {
  status: 'pending' | 'processing' | 'completed' | 'error';
  fileId?: string;
  error?: string;
}

export default function PaymentSuccessClient({ sessionId, locale }: PaymentSuccessClientProps) {
  const [status, setStatus] = useState<WebhookStatus>({ status: 'pending' });
  const [countdown, setCountdown] = useState(60); // 60 seconds timeout
  const [isDev, setIsDev] = useState(false);
  const router = useRouter();

  // Check if we're in development
  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development' || 
             (typeof window !== 'undefined' && window.location.hostname === 'localhost'));
  }, []);

  // Check webhook status
  const checkWebhookStatus = async () => {
    try {
      console.log('🔍 Checking webhook status for session:', sessionId);
      const response = await fetch(`/api/webhook-status/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Webhook status received:', data);
        setStatus(data);
        
        if (data.fileId && data.status !== 'error') {
          console.log('🎬 FileId found, preparing to redirect:', data.fileId);
          if (!status.fileId) { // Only redirect once when fileId appears
            toast.success('Video generation started! Redirecting...');
            setTimeout(() => {
              console.log('🔄 Redirecting to file page:', data.fileId);
              router.push(`/${locale}/file/${data.fileId}`);
            }, 2000);
          }
        } else if (data.status === 'error') {
          console.error('❌ Webhook error:', data);
          toast.error('Error processing payment');
        } else {
          console.log('⏳ Still waiting for fileId...');
        }
      } else {
        console.error('❌ Failed to fetch webhook status:', response.status);
      }
    } catch (error) {
      console.error('Error checking webhook status:', error);
    }
  };

  // Poll webhook status every 2 seconds
  useEffect(() => {
    const interval = setInterval(checkWebhookStatus, 2000);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Timeout - redirect to support or home
          toast.error('Processing is taking longer than expected. Please contact support.');
          setTimeout(() => {
            router.push(`/${locale}/tool/veo3-prompt-generator`);
          }, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Initial check
    checkWebhookStatus();

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [sessionId, locale, router]);

  const getStatusIcon = () => {
    switch (status.status) {
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-500 animate-pulse" />;
      case 'processing':
        return <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (status.status) {
      case 'pending':
        return 'Confirming your payment...';
      case 'processing':
        return 'Starting video generation...';
      case 'completed':
        return 'Video generation started! Redirecting to status page...';
      case 'error':
        return status.error || 'An error occurred processing your payment';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
                 <h1 className="text-3xl font-bold mb-2">Payment Successful! 🎉</h1>
         <p className="text-muted-foreground">
           Thank you for your purchase. We&apos;re processing your video generation request.
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {getStatusIcon()}
            Processing Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">{getStatusMessage()}</p>
            
            {status.status === 'pending' && (
              <p className="text-sm text-muted-foreground">
                Waiting for webhook confirmation... ({countdown}s remaining)
              </p>
            )}
            
            {status.status === 'processing' && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Video className="h-4 w-4" />
                <span className="text-sm">Initializing AI video generation</span>
              </div>
            )}
            
            {status.status === 'completed' && status.fileId && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Redirecting to status page</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Manual redirect button when fileId is available */}
          {status.fileId && status.status !== 'error' && (
            <div className="text-center">
              <Button 
                onClick={() => router.push(`/${locale}/file/${status.fileId}`)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Video className="h-4 w-4 mr-2" />
                View Video Status
              </Button>
            </div>
          )}

          {/* Fallback: Always show session lookup button after some time */}
          {countdown < 45 && (
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Having trouble? You can always find your file using this session ID:
              </p>
              <div className="flex items-center justify-center gap-2 mb-3">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  {sessionId}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(sessionId)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <Button 
                onClick={() => router.push(`/${locale}/session/${sessionId}`)}
                variant="outline"
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Find My File
              </Button>
            </div>
          )}

          {/* Development Mode: Manual file lookup */}
          {(process.env.NODE_ENV === 'development' || 
            (typeof window !== 'undefined' && window.location.hostname.includes('git-stripe'))) && (
            <div className="text-center mt-6 p-4 border-t border-dashed">
              <p className="text-xs text-muted-foreground mb-3">
                🧪 Development Mode - Manual File Lookup
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => router.push(`/${locale}/dev/files`)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Search className="h-4 w-4" />
                  Browse All Files
                </Button>
                <Button 
                  onClick={() => router.push(`/${locale}/session/${sessionId}`)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Check This Session
                </Button>
              </div>
            </div>
          )}

          {/* Error state */}
          {status.status === 'error' && (
            <div className="text-center">
              <Button 
                onClick={() => router.push(`/${locale}/tool/veo3-prompt-generator`)}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Development mode manual controls */}
          {isDev && status.status === 'pending' && (
            <div className="text-center pt-4 border-t border-dashed">
              <p className="text-sm text-muted-foreground mb-3">
                🚧 Development Mode - Manual Controls
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => setStatus({ status: 'processing' })}
                  variant="outline"
                  size="sm"
                >
                  Simulate Processing
                </Button>
                <Button 
                  onClick={() => setStatus({ status: 'completed', fileId: 'demo-file-id-12345' })}
                  variant="outline"
                  size="sm"
                >
                  Simulate Completed
                </Button>
                <Button 
                  onClick={() => router.push(`/${locale}/file/demo-file-id-12345`)}
                  variant="default"
                  size="sm"
                >
                  Go to Demo File
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-200">What happens next?</p>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300">
              <li>• Payment confirmation (usually instant)</li>
              <li>• Video generation starts automatically</li>
                             <li>• You&apos;ll be redirected to the status page</li>
              <li>• Generation takes 2-5 minutes</li>
              <li>• Download your video when ready</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Session Info */}
      <Card>
        <CardContent className="pt-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Session ID</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 break-all">
                {sessionId}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 