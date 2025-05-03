import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Icons } from '@/components/ui/icons';

interface FeatureProps {
  title: string;
  description: string;
  icon?: string;
  className?: string;
}

export function Feature({ title, description, icon, className }: FeatureProps) {
  const IconComponent = icon ? (Icons as Record<string, LucideIcon>)[icon] : null;

  return (
    <div className={`p-6 rounded-lg border border-gray-200 dark:border-gray-800 ${className ?? ''}`}>
      {IconComponent && (
        <div className="w-12 h-12 text-primary mb-4 flex items-center justify-center rounded-full bg-primary/10">
          <IconComponent className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
} 