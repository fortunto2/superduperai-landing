'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './button';

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  className?: string;
}

export const CodeBlock = ({ children, language, className = '' }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const extractTextContent = (element: React.ReactNode): string => {
    if (typeof element === 'string') {
      return element;
    }
    
    if (React.isValidElement(element)) {
      if (element.props.children) {
        return extractTextContent(element.props.children);
      }
    }
    
    if (Array.isArray(element)) {
      return element.map(extractTextContent).join('');
    }
    
    return '';
  };

  const codeText = extractTextContent(children);

  return (
    <div className="relative group">
      <pre className={`overflow-x-auto p-4 bg-gray-900 text-gray-100 rounded-lg border ${className}`}>
        <code className={language ? `language-${language}` : ''}>
          {children}
        </code>
      </pre>
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600"
        onClick={() => copyToClipboard(codeText)}
        title={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}; 