"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  CheckCircle,
  Search,
  ArrowRight,
  Copy,
  Video,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

interface SessionLookupClientProps {
  sessionId: string;
  locale: string;
}

interface LookupResult {
  found: boolean;
  fileId?: string;
  toolSlug?: string;
  toolTitle?: string;
  status?: string;
  error?: string;
}

export default function SessionLookupClient({ sessionId, locale }: SessionLookupClientProps) {
  const [result, setResult] = useState<LookupResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const router = useRouter();

  const lookupSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Looking up session:', sessionId);
      
      // Try webhook status first (now uses KV with fallback)
      const webhookResponse = await fetch(`/api/webhook-status/${sessionId}`);
      
      if (webhookResponse.ok) {
        const webhookData = await webhookResponse.json();
        console.log('📊 Webhook data found (KV):', webhookData);
        
        if (webhookData.fileId) {
          setResult({
            found: true,
            fileId: webhookData.fileId,
            toolSlug: webhookData.toolSlug,
            toolTitle: webhookData.toolTitle,
            status: webhookData.status
          });
          
          // Auto-redirect after a short delay
          setTimeout(() => {
            router.push(`/${locale}/file/${webhookData.fileId}`);
          }, 2000);
          
          return;
        }
      }
      
      // If webhook status doesn't have fileId, set not found
      setResult({
        found: false,
        error: 'No file found for this session. The payment may still be processing or there was an error.'
      });
      
    } catch (err) {
      console.error('Error looking up session:', err);
      setError('Failed to lookup session. Please try again.');
      setResult({
        found: false,
        error: 'Failed to lookup session. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    lookupSession();
  }, [sessionId]);

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    toast.success('Session ID copied to clipboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Finding Your File</h1>
              <p className="text-muted-foreground">
                Looking up your AI-generated content using session ID
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Session Lookup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Session ID Display */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Session ID</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 text-sm bg-muted px-3 py-2 rounded font-mono break-all">
                      {sessionId}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copySessionId}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Searching for your file...</p>
                  </div>
                )}

                {/* Success State */}
                {result?.found && result.fileId && (
                  <div className="text-center py-6">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">File Found!</h3>
                    
                    {result.toolTitle && (
                      <p className="text-muted-foreground mb-4">
                        Generated from: {result.toolTitle}
                      </p>
                    )}
                    
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <label className="text-xs text-muted-foreground">File ID</label>
                      <code className="block text-sm font-mono mt-1 break-all">
                        {result.fileId}
                      </code>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      Redirecting automatically in 2 seconds...
                    </p>
                    
                    <Button 
                      onClick={() => router.push(`/${locale}/file/${result.fileId}`)}
                      className="gap-2"
                    >
                      <Video className="w-4 h-4" />
                      View File Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Error State */}
                {result && !result.found && (
                  <div className="text-center py-6">
                    <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">File Not Found</h3>
                    <p className="text-muted-foreground mb-6">
                      {result.error || 'No file was found for this session ID.'}
                    </p>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={lookupSession}
                        variant="outline"
                        className="gap-2"
                      >
                        <Search className="w-4 h-4" />
                        Try Again
                      </Button>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>Possible reasons:</p>
                        <ul className="mt-2 space-y-1 text-left max-w-md mx-auto">
                          <li>• Payment is still being processed</li>
                          <li>• Video generation is in progress</li>
                          <li>• Session ID is invalid or expired</li>
                          <li>• There was an error during processing</li>
                        </ul>
                      </div>
                      
                      <Button 
                        onClick={() => router.push(`/${locale}/tool/veo3-prompt-generator`)}
                        variant="outline"
                      >
                        Generate New Video
                      </Button>
                    </div>
                  </div>
                )}

                {/* Manual Retry */}
                {!isLoading && (
                  <div className="text-center pt-4 border-t">
                    <Button 
                      onClick={lookupSession}
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Search Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help Text */}
            <div className="text-center mt-8 text-sm text-muted-foreground">
              <p>
                Keep this session ID safe - you can always use it to find your generated files.
              </p>
              <p className="mt-2">
                If you continue having issues, please contact support with your session ID.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
} 