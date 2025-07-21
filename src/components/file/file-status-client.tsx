"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Download, 
  Copy, 
  RefreshCw,
  Video,
  Image,
  Music,
  File,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Simple Progress component (currently unused but kept for future use)
function _Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

interface FileStatusClientProps {
  fileId: string;
  locale: string;
  showToolInfo?: boolean;
}

interface FileData {
  id: string;
  url?: string;
  thumbnail_url?: string;
  type: 'video' | 'image' | 'audio' | 'other';
  duration?: number;
  video_generation?: {
    prompt: string;
    width: number;
    height: number;
    duration: number;
    generation_config: {
      label: string;
    };
  };
  image_generation?: {
    prompt: string;
    width: number;
    height: number;
    generation_config: {
      label: string;
    };
  };
  audio_generation?: {
    prompt: string;
    duration: number;
    generation_config: {
      label: string;
    };
  };
  tasks: Array<{
    type: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    id: string;
    file_id: string;
  }>;
}

export default function FileStatusClient({ fileId, locale: _locale, showToolInfo = false }: FileStatusClientProps) {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toolInfo, setToolInfo] = useState<{ toolSlug?: string; toolTitle?: string } | null>(null);

  // Fetch tool info from sessionId if available
  const fetchToolInfo = useCallback(async () => {
    if (!showToolInfo) return;
    
    try {
      // Try to get sessionId from URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      
      if (sessionId) {
        const response = await fetch(`/api/webhook-status/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.toolSlug || data.toolTitle) {
            setToolInfo({
              toolSlug: data.toolSlug,
              toolTitle: data.toolTitle
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch tool info:', error);
    }
  }, [showToolInfo]);

  const fetchFileStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/file/${fileId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setFileData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching file status:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch file status');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fileId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFileStatus();
  };

  const copyFileId = () => {
    navigator.clipboard.writeText(fileId);
    toast.success('File ID copied to clipboard');
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  useEffect(() => {
    fetchFileStatus();
    fetchToolInfo();
  }, [fetchFileStatus, fetchToolInfo]);

  // Auto-refresh for in-progress files
  useEffect(() => {
    if (!fileData || !fileData.tasks.some(task => task.status === 'in_progress')) {
      return;
    }

    const interval = setInterval(fetchFileStatus, 5000);
    return () => clearInterval(interval);
  }, [fileData, fetchFileStatus]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getGenerationData = () => {
    if (fileData?.video_generation) return fileData.video_generation;
    if (fileData?.image_generation) return fileData.image_generation;
    if (fileData?.audio_generation) return fileData.audio_generation;
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading file status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading File</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh} disabled={isRefreshing}>
                {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">File Not Found</h3>
              <p className="text-muted-foreground">The requested file could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const generationData = getGenerationData();
  const mainTask = fileData.tasks[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tool Info & Back Button */}
      {showToolInfo && toolInfo && (toolInfo.toolSlug || toolInfo.toolTitle) && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{toolInfo.toolTitle || 'AI Tool'}</h3>
                  <p className="text-sm text-muted-foreground">Generated from {toolInfo.toolSlug?.replace(/-/g, ' ')}</p>
                </div>
              </div>
              {toolInfo.toolSlug && (
                <Button
                  variant="outline"
                  asChild
                  className="gap-2"
                >
                  <a href={`/${_locale}/tool/${toolInfo.toolSlug}`}>
                    ← Back to Tool
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getFileIcon(fileData.type)}
          <div>
            <h1 className="text-2xl font-bold">File Status</h1>
            <p className="text-muted-foreground">Track your AI file generation progress</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </Button>
      </div>

      {/* File Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getFileIcon(fileData.type)}
            {fileData.type.charAt(0).toUpperCase() + fileData.type.slice(1)} File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">File ID</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                  {fileId}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyFileId}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge className={`${getStatusColor(mainTask?.status || 'pending')} gap-1`}>
                  {getStatusIcon(mainTask?.status || 'pending')}
                  {mainTask?.status || 'pending'}
                </Badge>
              </div>
            </div>

            {generationData && (
              <>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Generator</label>
                  <p className="text-sm mt-1">{generationData.generation_config.label}</p>
                </div>

                {fileData.type === 'video' && 'width' in generationData && generationData.width && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Resolution</label>
                    <p className="text-sm mt-1">{generationData.width}x{generationData.height}</p>
                  </div>
                )}

                {'duration' in generationData && generationData.duration && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Duration</label>
                    <p className="text-sm mt-1">{generationData.duration}s</p>
                  </div>
                )}
              </>
            )}
          </div>

          {generationData?.prompt && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Prompt</label>
              <p className="text-sm mt-1 bg-muted p-3 rounded-md">
                {generationData.prompt}
              </p>
            </div>
          )}

          {/* Preview section */}
          {fileData.url && (
            <div className="pt-4 border-t">
              <div className="mb-4">
                <h3 className="font-medium mb-3">Preview</h3>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  {fileData.type === 'video' ? (
                    <video
                      src={fileData.url}
                      poster={fileData.thumbnail_url}
                      controls
                      className="w-full h-full object-cover"
                      title={`Generated ${fileData.type} preview`}
                    />
                  ) : fileData.type === 'image' ? (
                    <img
                      src={fileData.url}
                      alt={`Generated ${fileData.type} preview`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <File className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Preview not available for this file type</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Download section */}
          {fileData.url && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Ready for Download</h3>
                  <p className="text-sm text-muted-foreground">
                    Your {fileData.type} has been generated successfully
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => copyUrl(fileData.url!)}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy URL
                  </Button>
                  <Button
                    asChild
                    className="gap-2"
                  >
                    <a href={fileData.url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fileData.tasks.map((task, index) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <p className="font-medium">{task.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p className="text-sm text-muted-foreground">Task {index + 1}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 