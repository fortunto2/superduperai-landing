'use client';

import React from 'react';
// В React 19 мы можем использовать нативные браузерные переходы
// с помощью CSS свойства viewTransitionName

// Компонент для карточек с красивым переходом при наведении
export function TransitionCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg border p-5 transition-colors hover:border-primary ${className}`}
      style={{
        viewTransitionName: 'card-transition'
      }}
    >
      {children}
    </div>
  );
}

// Компонент для плавающих элементов с переходом
export function FloatingElement({
  children,
  className = '',
  transitionName = 'floating-element',
}: {
  children: React.ReactNode;
  className?: string;
  transitionName?: string;
}) {
  return (
    <div
      className={`transition-transform duration-300 hover:-translate-y-1 ${className}`}
      style={{
        viewTransitionName: transitionName
      }}
    >
      {children}
    </div>
  );
}

// Компонент для элементов с переходом при нажатии
export function ClickableTransition({
  children,
  className = '',
  transitionName,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  transitionName: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`cursor-pointer ${className}`}
      style={{
        viewTransitionName: transitionName
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
} 