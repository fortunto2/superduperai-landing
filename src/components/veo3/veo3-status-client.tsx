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
  sessionId?: string;
  locale: string;
}

interface GenerationData {
  generationId: string;
  sessionId?: string;
  prompt: string;
  videoCount: number;
  createdAt: string;
  fileIds: string[]; // Array of file IDs from SuperDuperAI
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  videos: Array<{
    fileId: string;
    url?: string;
    thumbnailUrl?: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
  }>;
}

interface FileStatus {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  url?: string;
  thumbnailUrl?: string;
  error?: string;
}

export default function Veo3StatusClient({ generationId, sessionId, locale }: Veo3StatusClientProps) {
  const [generationData, setGenerationData] = useState<GenerationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load generation data from localStorage
  const loadGenerationData = useCallback(() => {
    try {
      console.log('🔍 Loading generation data for:', generationId);
      console.log('🔍 SessionId:', sessionId);
      console.log('🔍 LocalStorage key:', `veo3_generation_${generationId}`);
      
      const stored = localStorage.getItem(`veo3_generation_${generationId}`);
      console.log('🔍 Stored data:', stored);
      
      if (stored) {
        const data = JSON.parse(stored) as GenerationData;
        console.log('✅ Loaded data from localStorage:', data);
        setGenerationData(data);
        return data;
      }
      
      // If no data in localStorage but we have sessionId, create initial data
      if (sessionId) {
        console.log('🆕 Creating initial data for sessionId:', sessionId);
        const initialData: GenerationData = {
          generationId,
          sessionId,
          prompt: 'Loading...',
          videoCount: 1,
          createdAt: new Date().toISOString(),
          fileIds: [],
          status: 'pending',
          progress: 0,
          videos: []
        };
        
        localStorage.setItem(`veo3_generation_${generationId}`, JSON.stringify(initialData));
        setGenerationData(initialData);
        return initialData;
      }
      
      console.log('❌ No data found and no sessionId');
      return null;
    } catch (err) {
      console.error('Error loading generation data:', err);
      return null;
    }
  }, [generationId, sessionId]);

  // Save generation data to localStorage
  const saveGenerationData = useCallback((data: GenerationData) => {
    try {
      localStorage.setItem(`veo3_generation_${generationId}`, JSON.stringify(data));
      setGenerationData(data);
    } catch (err) {
      console.error('Error saving generation data:', err);
    }
  }, [generationId]);

  // Check file status via API
  const checkFileStatus = useCallback(async (fileId: string): Promise<FileStatus | null> => {
    try {
      const response = await fetch(`/api/file/${fileId}`);
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return {
        id: fileId,
        status: data.status as 'pending' | 'in_progress' | 'completed' | 'error',
        url: data.url,
        thumbnailUrl: data.thumbnailUrl,
        error: data.error
      };
    } catch (err) {
      console.error(`Error checking file status for ${fileId}:`, err);
      return null;
    }
  }, []);

  // Update video statuses
  const updateVideoStatuses = useCallback(async (data: GenerationData) => {
    if (!data.fileIds.length) return data;

    const updatedVideos = await Promise.all(
      data.fileIds.map(async (fileId) => {
        const fileStatus = await checkFileStatus(fileId);
        if (!fileStatus) {
          return {
            fileId,
            status: 'error' as const,
          };
        }

        return {
          fileId,
          status: fileStatus.status === 'in_progress' ? 'processing' as const : 
                 fileStatus.status === 'completed' ? 'completed' as const :
                 fileStatus.status === 'error' ? 'error' as const : 'pending' as const,
          url: fileStatus.url,
          thumbnailUrl: fileStatus.thumbnailUrl,
        };
      })
    );

    // Calculate overall progress
    const completedCount = updatedVideos.filter(v => v.status === 'completed').length;
    const processingCount = updatedVideos.filter(v => v.status === 'processing').length;
    const errorCount = updatedVideos.filter(v => v.status === 'error').length;
    
    const progress = (completedCount / data.videoCount) * 100;
    
    let overallStatus: GenerationData['status'] = 'pending';
    if (errorCount > 0) {
      overallStatus = 'error';
    } else if (completedCount === data.videoCount) {
      overallStatus = 'completed';
    } else if (processingCount > 0 || completedCount > 0) {
      overallStatus = 'processing';
    }

    const updatedData = {
      ...data,
      videos: updatedVideos,
      progress,
      status: overallStatus,
    };

    saveGenerationData(updatedData);
    return updatedData;
  }, [checkFileStatus, saveGenerationData]);

  // Refresh status
  const refreshStatus = useCallback(async () => {
    if (!generationData) return;

    setRefreshing(true);
    try {
      await updateVideoStatuses(generationData);
    } catch (err) {
      console.error('Error refreshing status:', err);
      setError('Failed to refresh status');
    } finally {
      setRefreshing(false);
    }
  }, [generationData, updateVideoStatuses]);

  // Initialize and load data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);

      try {
        let data = loadGenerationData();
        
        if (!data) {
          console.log('❌ No generation data found, checking all localStorage keys...');
          // Debug: show all localStorage keys
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('veo3_')) {
              console.log('📦 Found key:', key, localStorage.getItem(key));
            }
          }
          setError('Generation data not found. Please check your link or create a new generation.');
          return;
        }

        console.log('✅ Successfully loaded generation data:', data);

        // If we have fileIds, update their statuses
        if (data.fileIds.length > 0) {
          console.log('🔄 Updating video statuses for', data.fileIds.length, 'files');
          data = await updateVideoStatuses(data);
        } else {
          console.log('⏳ No fileIds yet, waiting for webhook or manual update');
        }

      } catch (err) {
        console.error('Error initializing data:', err);
        setError('Failed to load generation data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [loadGenerationData, updateVideoStatuses]);

  // Auto-refresh for processing videos
  useEffect(() => {
    if (!generationData || generationData.status === 'completed' || generationData.status === 'error') {
      return;
    }

    const interval = setInterval(() => {
      refreshStatus();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [generationData, refreshStatus]);

  // Helper function to parse file IDs from generationId
  const parseFileIds = (genId: string): string[] => {
    // Check if generationId contains comma-separated file IDs
    if (genId.includes(',')) {
      return genId.split(',').map(id => id.trim()).filter(Boolean);
    }
    
    // Check if it's a Stripe session ID (starts with cs_)
    if (genId.startsWith('cs_')) {
      return []; // Stripe session IDs should not be treated as file IDs
    }
    
    // Check if it's a single SuperDuperAI file ID (not starting with veo3_ and not Stripe session)
    if (genId.length > 10 && !genId.startsWith('veo3_') && !genId.startsWith('cs_')) {
      return [genId];
    }
    
    return [];
  };

  // Update file IDs if generationId contains them
  useEffect(() => {
    if (generationData && generationData.fileIds.length === 0) {
      const fileIds = parseFileIds(generationId);
      if (fileIds.length > 0) {
        const updatedData = {
          ...generationData,
          fileIds,
          videoCount: fileIds.length,
        };
        saveGenerationData(updatedData);
      }
    }
  }, [generationData, generationId, saveGenerationData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Debug function to create test data
  const createTestData = () => {
    const testData: GenerationData = {
      generationId,
      sessionId: sessionId || generationId,
      prompt: 'Test prompt: A beautiful sunset over mountains',
      videoCount: 1,
      createdAt: new Date().toISOString(),
      fileIds: [],
      status: 'pending',
      progress: 0,
      videos: []
    };
    
    localStorage.setItem(`veo3_generation_${generationId}`, JSON.stringify(testData));
    setGenerationData(testData);
    toast.success('Test data created!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'default',
      error: 'destructive'
    } as const;

    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading generation status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!generationData) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generation Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            No generation data found for this ID. Please check your link or create a new generation.
          </p>
          <Button asChild>
            <a href={`/${locale}/tool/veo3-prompt-generator`}>
              Create New Generation
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generation Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Generation Status
            </span>
            <Button
              onClick={refreshStatus}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(generationData.status)}
                {getStatusBadge(generationData.status)}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Progress</label>
              <div className="mt-1">
                <Progress value={generationData.progress} className="mb-1" />
                <span className="text-sm text-muted-foreground">
                  {Math.round(generationData.progress)}% Complete
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Prompt</label>
            <p className="mt-1 text-sm bg-muted p-3 rounded-md">{generationData.prompt}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Videos: {generationData.videoCount}</span>
            <span>Created: {new Date(generationData.createdAt).toLocaleString()}</span>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Generation ID</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 break-all">
                {generationData.generationId}
              </code>
              <Button
                onClick={() => copyToClipboard(generationData.generationId)}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Videos */}
      {generationData.videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generationData.videos.map((video, index) => (
                <div key={video.fileId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Video {index + 1}</span>
                    {getStatusBadge(video.status)}
                  </div>
                  
                  {video.thumbnailUrl && (
                    <div className="mb-3">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={`Video ${index + 1} thumbnail`}
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-muted-foreground">File ID</label>
                      <div className="flex items-center gap-1">
                        <code className="text-xs bg-muted px-1 py-0.5 rounded flex-1 break-all">
                          {video.fileId}
                        </code>
                        <Button
                          onClick={() => copyToClipboard(video.fileId)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {video.url && (
                      <Button asChild className="w-full">
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download Video
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waiting for webhook message */}
      {generationData.videos.length === 0 && generationData.fileIds.length === 0 && generationData.generationId.startsWith('cs_') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Waiting for Payment Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your payment is being processed. Once confirmed, video generation will begin automatically.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Next steps:</strong>
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                  <li>• Payment confirmation (usually instant)</li>
                  <li>• Video generation starts automatically</li>
                  <li>• This page will update with progress</li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground">
                This page will automatically refresh every 5 seconds to check for updates.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • Video generation typically takes 2-5 minutes per video
            </p>
            <p className="text-sm text-muted-foreground">
              • This page will automatically refresh every 5 seconds while processing
            </p>
            <p className="text-sm text-muted-foreground">
              • You can bookmark this page to check status later
            </p>
            <p className="text-sm text-muted-foreground">
              • If you encounter issues, try refreshing the page or contact support
            </p>
          </div>
          
          {error && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-2">Debug options:</p>
              <Button 
                onClick={createTestData} 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                Create Test Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}