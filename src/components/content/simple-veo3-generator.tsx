"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Video, Loader2, Play, Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Veo3PaymentButtons } from '@/components/ui/veo3-payment-buttons';

interface GeneratedVideo {
  fileId: string;
  url: string;
  thumbnailUrl?: string;
}

interface GenerationStatus {
  generationId: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  videos?: GeneratedVideo[];
  error?: string;
}

export function SimpleVEO3Generator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus(null);

    try {
      // Create generation request
      const generationId = `veo3_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch('/api/generate-veo3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generationId,
          prompt,
          videoCount: 1,
          status: 'processing',
          progress: 0,
          createdAt: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to start generation');
      }

      toast.success('Video generation started!');
      
      // Start polling for status
      pollGenerationStatus(generationId);

    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate video');
      setIsGenerating(false);
    }
  };

  const pollGenerationStatus = async (generationId: string) => {
    const maxAttempts = 120; // 10 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/generate-veo3?generationId=${generationId}`);
        const status = await response.json();

        if (status.success) {
          setGenerationStatus(status);

          if (status.status === 'completed') {
            setIsGenerating(false);
            toast.success('Video generation completed!');
            return;
          }

          if (status.status === 'error') {
            setIsGenerating(false);
            toast.error(status.error || 'Generation failed');
            return;
          }

          // Continue polling if still processing
          if (status.status === 'processing' && attempts < maxAttempts) {
            attempts++;
            setTimeout(poll, 5000); // Poll every 5 seconds
          } else if (attempts >= maxAttempts) {
            setIsGenerating(false);
            toast.error('Generation timed out');
          }
        } else {
          setIsGenerating(false);
          toast.error(status.error || 'Failed to check status');
        }
      } catch (error) {
        console.error('Status check error:', error);
        setIsGenerating(false);
        toast.error('Failed to check generation status');
      }
    };

    poll();
  };

  const handleDownload = (video: GeneratedVideo) => {
    if (video.url) {
      const link = document.createElement('a');
      link.href = video.url;
      link.download = `veo3-video-${video.fileId}.mp4`;
      link.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Payment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            VEO3 Video Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt">Video Description</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the video you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          <Veo3PaymentButtons 
            prompt={prompt}
            onPaymentClick={(type) => {
              toast.success(`Payment for ${type} video(s) initiated!`);
            }}
          />

          {/* Test Generation Button (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Development Mode - Test without payment:
              </p>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
                variant="outline"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test Generate Video
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generation Status */}
      {generationStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Generation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  generationStatus.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : generationStatus.status === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {generationStatus.status}
                </span>
              </div>

              {generationStatus.status === 'processing' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress:</span>
                    <span className="text-sm">{generationStatus.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${generationStatus.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {generationStatus.status === 'error' && generationStatus.error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-800">{generationStatus.error}</span>
                </div>
              )}

              {generationStatus.status === 'completed' && generationStatus.videos && (
                <div className="space-y-4">
                  <h4 className="font-medium">Generated Videos:</h4>
                  <div className="grid gap-4">
                    {generationStatus.videos.map((video, index) => (
                      <div key={video.fileId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Video {index + 1}</span>
                          <Button
                            onClick={() => handleDownload(video)}
                            size="sm"
                            variant="outline"
                            disabled={!video.url}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        {video.url && (
                          <video 
                            src={video.url}
                            controls
                            className="w-full rounded-lg"
                            poster={video.thumbnailUrl}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 