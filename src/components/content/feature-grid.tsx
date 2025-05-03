import React from 'react';

interface FeatureGridProps {
  children: React.ReactNode;
  className?: string;
}

export function FeatureGrid({ children, className }: FeatureGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8 ${className ?? ''}`}>
      {children}
    </div>
  );
} 