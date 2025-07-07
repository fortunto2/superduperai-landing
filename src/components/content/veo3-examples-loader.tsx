import { VideoPromptExamples } from './video-prompt-examples';
import veo3ExamplesData from '@/data/veo3-examples.json';

interface Veo3ExamplesLoaderProps {
  locale: string;
  onCopyPrompt?: (prompt: string) => void;
  onSendToTool?: (prompt: string) => void;
  gridCols?: number;
  className?: string;
}

export function Veo3ExamplesLoader({ 
  locale, 
  onCopyPrompt, 
  onSendToTool, 
  gridCols = 3, 
  className 
}: Veo3ExamplesLoaderProps) {
  const examples = veo3ExamplesData.examples.map(example => ({
    videoUrl: example.videoUrl,
    prompt: example.prompt,
    title: example.title[locale as keyof typeof example.title] || example.title.en
  }));

  return (
    <VideoPromptExamples 
      examples={examples}
      onCopyPrompt={onCopyPrompt}
      onSendToTool={onSendToTool}
      gridCols={gridCols}
      className={className}
    />
  );
} 