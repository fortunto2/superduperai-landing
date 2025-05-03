import React from 'react';

interface StepProps {
  number: string | number;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Step({ number, title, children, className }: StepProps) {
  return (
    <div className={`flex items-start gap-4 ${className ?? ''}`}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="text-gray-600 dark:text-gray-400">{children}</div>
      </div>
    </div>
  );
} 