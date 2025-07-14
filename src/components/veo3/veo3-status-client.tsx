"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Simple Progress component since it's not available in UI library
function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Download, 
  Copy, 
  RefreshCw,
  Video,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Veo3StatusClientProps {
  generationId: string;
  locale: string;
}

interface GenerationStatus {
  success: boolean;
  generationId: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  prompt: string;
  videoCount: number;
  createdAt: string;
  paymentIntentId?: string;
  sessionId?: string;
  customerEmail?: string;
  videos?: Array<{
    fileId: string;
    url?: string;
    thumbnailUrl?: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
  }>;
  error?: string;
}

export default function Veo3StatusClient({ generationId, locale }: Veo3StatusClientProps) {
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/generate-veo3?generationId=${generationId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }
      
      setStatus(data);
      
      // Auto-refresh if still processing
      if (data.status === 'processing') {
        setTimeout(() => {
          fetchStatus();
        }, 5000); // Check every 5 seconds
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Failed to fetch generation status:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [generationId]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchStatus();
    setIsRefreshing(false);
  }, [fetchStatus]);

  const handleDownload = useCallback(async (url: string, fileId: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `veo3-video-${fileId}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(downloadUrl);
      toast.success('Video download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download video');
    }
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy');
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
    if (error) return <XCircle className="w-5 h-5 text-red-500" />;
    if (!status) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    
    switch (status.status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    if (isLoading) return <Badge variant="secondary">Loading...</Badge>;
    if (error) return <Badge variant="destructive">Error</Badge>;
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
    switch (status.status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'processing':
        return <Badge variant="default">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-200">Completed</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString(locale === 'en' ? 'en-US' : locale);
    } catch {
      return dateString;
    }
  };

  if (isLoading && !status) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading generation status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Generation not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon()}
                VEO3 Video Generation
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Generation ID</p>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                    {status.generationId}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(status.generationId)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prompt</p>
                <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">{status.prompt}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Video Count</p>
                  <p className="text-sm">{status.videoCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Created</p>
                  <p className="text-sm">{formatTime(status.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Progress</p>
                <Progress value={status.progress} className="mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{status.progress}%</p>
              </div>

              {status.error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded">
                  <p className="text-sm text-red-600 dark:text-red-400">{status.error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {status.videos && status.videos.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {status.videos.map((video, index) => (
              <Card key={video.fileId}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Video {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">File ID</p>
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block">
                        {video.fileId}
                      </code>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                      <Badge variant={video.status === 'completed' ? 'outline' : 'secondary'}>
                        {video.status}
                      </Badge>
                    </div>

                    {video.thumbnailUrl && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Thumbnail</p>
                        <img 
                          src={video.thumbnailUrl} 
                          alt={`Video ${index + 1} thumbnail`}
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                    )}

                    {video.url && (
                      <div className="space-y-2">
                        <video 
                          src={video.url} 
                          controls 
                          className="w-full rounded"
                          poster={video.thumbnailUrl}
                        />
                        <Button 
                          onClick={() => handleDownload(video.url!, video.fileId)}
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Video
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}