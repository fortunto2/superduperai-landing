'use client';

import { useEffect, useRef, useState } from 'react';
import { SimpleVeo3Generator } from './simple-veo3-generator';

interface Veo3GeneratorWrapperProps {
  initialPrompt?: string;
}

// Global state for sending prompts to the generator
let globalPromptSetter: ((prompt: string) => void) | null = null;

// Function to send prompt to generator from anywhere
export const sendPromptToVeo3Generator = (prompt: string) => {
  if (globalPromptSetter) {
    globalPromptSetter(prompt);
  }
};

export function Veo3GeneratorWrapper({ initialPrompt }: Veo3GeneratorWrapperProps) {
  const [externalPrompt, setExternalPrompt] = useState<string>('');
  const generatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register global prompt setter
    globalPromptSetter = (prompt: string) => {
      setExternalPrompt(prompt);
      // Scroll to generator and switch to enhance tab
      if (generatorRef.current) {
        generatorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Small delay to ensure scroll completes before focusing
        setTimeout(() => {
          // Try to find and click the enhance tab
          const enhanceTab = document.querySelector('[data-value="enhance"]') as HTMLElement;
          if (enhanceTab) {
            enhanceTab.click();
          }
        }, 500);
      }
    };

    // Set initial prompt if provided
    if (initialPrompt) {
      setExternalPrompt(initialPrompt);
    }

    return () => {
      globalPromptSetter = null;
    };
  }, [initialPrompt]);

  return (
    <div ref={generatorRef}>
      <SimpleVeo3GeneratorWithPrompt externalPrompt={externalPrompt} />
    </div>
  );
}

// Enhanced version of SimpleVeo3Generator that accepts external prompts
function SimpleVeo3GeneratorWithPrompt({ externalPrompt }: { externalPrompt: string }) {
  const [promptInjected, setPromptInjected] = useState(false);

  useEffect(() => {
    if (externalPrompt && !promptInjected) {
      // Inject the prompt into the enhance tab textarea
      setTimeout(() => {
        const enhanceTextarea = document.querySelector('[placeholder*="Click \'Enhance with AI\'"]') as HTMLTextAreaElement;
        if (enhanceTextarea) {
          // Create and dispatch input event to update React state
          const inputEvent = new Event('input', { bubbles: true });
          enhanceTextarea.value = externalPrompt;
          enhanceTextarea.dispatchEvent(inputEvent);
          
          // Also try to trigger onChange if it exists
          const changeEvent = new Event('change', { bubbles: true });
          enhanceTextarea.dispatchEvent(changeEvent);
        }
        setPromptInjected(true);
      }, 100);
    }
  }, [externalPrompt, promptInjected]);

  // Reset injection flag when external prompt changes
  useEffect(() => {
    setPromptInjected(false);
  }, [externalPrompt]);

  return <SimpleVeo3Generator />;
} 