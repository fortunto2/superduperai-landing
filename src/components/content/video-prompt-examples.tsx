import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface VideoPromptExample {
  videoUrl: string;
  prompt: string;
  previewImage?: string;
  title?: string;
}

interface VideoPromptExamplesProps {
  examples: VideoPromptExample[];
  onCopyPrompt?: (prompt: string) => void;
  onSendToTool?: (prompt: string) => void;
  gridCols?: number; // default 3
  className?: string;
}

export const VideoPromptExamples: React.FC<VideoPromptExamplesProps> = ({
  examples,
  onCopyPrompt,
  onSendToTool,
  gridCols = 3,
  className = '',
}) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = async (prompt: string, idx: number) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedIdx(idx);
    if (onCopyPrompt) onCopyPrompt(prompt);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className={`w-full mt-8 mb-12 ${className}`}>
      <div className={`grid gap-6 grid-cols-1 md:grid-cols-${gridCols}`}>
        {examples.map((ex, idx) => (
          <div key={idx} className="bg-background border rounded-xl shadow-sm p-4 flex flex-col">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-3 group">
              <video
                src={ex.videoUrl}
                poster={ex.previewImage}
                controls
                className="w-full h-full object-cover"
                title={ex.title || 'Preview video'}
              />
              <a
                href={ex.videoUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
                title="Open video in new tab"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            {ex.title && (
              <div className="font-semibold text-base mb-2">{ex.title}</div>
            )}
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 mb-2"
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                aria-expanded={expanded === idx}
                title={expanded === idx ? 'Hide prompt' : 'Show prompt'}
              >
                {expanded === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {expanded === idx ? 'Hide prompt' : 'Show prompt'}
              </Button>
              {expanded === idx && (
                <div className="bg-muted rounded p-3 text-xs whitespace-pre-line mb-2 max-h-64 overflow-auto border">
                  {ex.prompt}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(ex.prompt, idx)}
                  title={copiedIdx === idx ? 'Copied!' : 'Copy prompt'}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copiedIdx === idx ? 'Copied!' : 'Copy'}
                </Button>
                {onSendToTool && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onSendToTool(ex.prompt)}
                    title="Send prompt to generator"
                  >
                    ➡️ To Generator
                  </Button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}; 