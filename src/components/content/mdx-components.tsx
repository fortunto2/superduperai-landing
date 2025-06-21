"use client";

import React from 'react';
import { FeatureGrid } from './feature-grid';
import { Feature } from './feature';
import { Steps } from './steps';
import { Step } from './step';
import { CTABox } from './cta-box';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { PricingSection } from './pricing-section';
import { VideoShowcase } from '@/components/landing/video-showcase';

// Простые компоненты для MDX без useMDXComponent
const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={`text-4xl font-bold mt-8 mb-4 ${className ?? ''}`} {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={`text-3xl font-bold mt-8 mb-4 ${className ?? ''}`} {...props} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={`text-2xl font-bold mt-8 mb-4 ${className ?? ''}`} {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`my-4 leading-7 ${className ?? ''}`} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={`list-disc pl-6 my-4 ${className ?? ''}`} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={`list-decimal pl-6 my-4 ${className ?? ''}`} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={`my-1 ${className ?? ''}`} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className={`border-l-4 border-primary pl-4 italic my-6 ${className ?? ''}`} {...props} />
  ),
  // Кастомные компоненты
  FeatureGrid,
  Feature,
  Steps,
  Step,
  CTABox,
  Button,
  Check,
  PricingSection,
  VideoShowcase
};

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType<Record<string, unknown>>>;
}

// Простая функция для рендеринга MDX без useMDXComponent
export function MDXContent({ code, components: customComponents }: MDXProps) {
  try {
    // Создаем функцию из кода MDX
    const mdxFunction = new Function('React', ...Object.keys(components), `return ${code}`);
    const MDXComponent = mdxFunction(React, ...Object.values(components));
    
    return <MDXComponent components={{ ...components, ...customComponents }} />;
  } catch (error) {
    console.error('Error rendering MDX:', error);
    // Fallback: показываем сырой контент
    return (
      <div className="prose prose-lg max-w-none">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">MDX Rendering Error</h3>
          <p className="text-red-600 text-sm mt-2">
            Failed to render MDX content. Please check the console for details.
          </p>
        </div>
      </div>
    );
  }
} 