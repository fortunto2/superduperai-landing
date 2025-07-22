"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Eye,
  RefreshCw,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

interface DevFilesClientProps {
  locale: string;
}

interface FileData {
  sessionId: string;
  webhookData: {
    status: string;
    fileId?: string;
    toolSlug?: string;
    toolTitle?: string;
    timestamp?: string;
  } | null;
  prompt: {
    length: number;
    preview: string;
  } | null;
}

export default function DevFilesClient({ locale }: DevFilesClientProps) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchSessionId, setSearchSessionId] = useState('');
  const [isDevMode, setIsDevMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === 'development' || 
                  (typeof window !== 'undefined' && window.location.hostname.includes('git-stripe')) ||
                  (typeof window !== 'undefined' && window.location.hostname.includes('localhost'));
    setIsDevMode(isDev);
  }, []);

  const searchSession = async () => {
    if (!searchSessionId.trim()) {
      toast.error('Please enter a session ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/dev/files?sessionId=${searchSessionId.trim()}`);
      
      if (response.ok) {
        const data = await response.json();
        setFiles([data]);
        toast.success('Session found!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Session not found');
        setFiles([]);
      }
    } catch (error) {
      console.error('Error searching session:', error);
      toast.error('Failed to search session');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isDevMode) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Development Mode Only</h1>
              <p className="text-muted-foreground">
                This page is only available in development mode or test environments.
              </p>
            </div>
          </div>
        </main>
        <Footer locale={locale} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">🧪 Dev Files Browser</h1>
              <p className="text-muted-foreground">
                Development tool for browsing files and sessions from Redis
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter session ID (cs_test_xxx or cs_live_xxx)"
                    value={searchSessionId}
                    onChange={(e) => setSearchSessionId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchSession()}
                    className="flex-1 font-mono"
                  />
                  <Button 
                    onClick={searchSession}
                    disabled={loading || !searchSessionId.trim()}
                    className="gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {files.length > 0 && (
              <div className="mt-6 space-y-4">
                {files.map((file) => (
                  <Card key={file.sessionId}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          <span className="font-mono text-sm">{file.sessionId}</span>
                        </div>
                        {file.webhookData && getStatusIcon(file.webhookData.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Webhook Status */}
                      {file.webhookData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Status</label>
                            <div className={`flex items-center gap-2 mt-1 ${getStatusColor(file.webhookData.status)}`}>
                              {getStatusIcon(file.webhookData.status)}
                              <span className="font-medium capitalize">{file.webhookData.status}</span>
                            </div>
                          </div>
                          
                          {file.webhookData.fileId && (
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">File ID</label>
                              <div className="font-mono text-sm mt-1 break-all">
                                {file.webhookData.fileId}
                              </div>
                            </div>
                          )}
                          
                          {file.webhookData.toolTitle && (
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Tool</label>
                              <div className="text-sm mt-1">
                                {file.webhookData.toolTitle}
                                {file.webhookData.toolSlug && (
                                  <span className="text-muted-foreground ml-2">
                                    ({file.webhookData.toolSlug})
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {file.webhookData.timestamp && (
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Created</label>
                              <div className="text-sm mt-1">
                                {formatDate(file.webhookData.timestamp)}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Prompt */}
                      {file.prompt && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">
                            Prompt ({file.prompt.length} characters)
                          </label>
                          <div className="text-sm mt-1 p-2 bg-muted rounded border">
                            {file.prompt.preview}
                            {file.prompt.length > 100 && '...'}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/${locale}/session/${file.sessionId}`)}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Session
                        </Button>
                        
                        {file.webhookData?.fileId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/${locale}/file/${file.webhookData!.fileId}`)}
                            className="gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            View File
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Help */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-3">How to use:</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Enter a session ID to search for specific files</p>
                <p>• Session IDs start with &quot;cs_test_&quot; or &quot;cs_live_&quot;</p>
                <p>• You can find session IDs in your browser history or payment success URLs</p>
                <p>• This tool only works in development mode</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
} 