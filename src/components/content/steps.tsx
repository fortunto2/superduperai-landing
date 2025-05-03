import React from 'react';

interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

export function Steps({ children, className }: StepsProps) {
  return (
    <div className={`space-y-8 my-8 ${className ?? ''}`}>
      {children}
    </div>
  );
} 