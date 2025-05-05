'use client';

import React from 'react';

// Вспомогательная функция для объединения классов (аналог cx)
const combineClasses = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export function SlideTransition({
  name,
  children,
  direction = 'horizontal',
  distance = 100,
  duration = 200,
}: {
  name: string;
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  distance?: number;
  duration?: number;
}) {
  const isHorizontal = direction === 'horizontal';
  const startName = isHorizontal ? 'left' : 'up';
  const endName = isHorizontal ? 'right' : 'down';
  const startPosition = isHorizontal ? `-${distance}px 0` : `0 ${distance}px`;
  const endPosition = isHorizontal ? `${distance}px 0` : `0 -${distance}px`;

  // Используем обычный style тег для вставки стилей
  const styleContent = `
    @keyframes ${name}-enter-slide-${startName} {
      0% {
        opacity: 0;
        translate: ${startPosition};
      }
      100% {
        opacity: 1;
        translate: 0 0;
      }
    }

    @keyframes ${name}-exit-slide-${endName} {
      0% {
        opacity: 1;
        translate: 0 0;
      }
      100% {
        opacity: 0;
        translate: ${endPosition};
      }
    }

    ::view-transition-new(.${name}-enter-slide-${startName}) {
      animation: ${name}-enter-slide-${startName} ease-in ${duration}ms;
    }
    ::view-transition-old(.${name}-exit-slide-${endName}) {
      animation: ${name}-exit-slide-${endName} ease-out ${duration}ms;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styleContent }} />
      <div 
        className={combineClasses(`${name}-enter-slide-${startName}`, `${name}-exit-slide-${endName}`)}
        style={{
          viewTransitionName: name
        }}
      >
        {children}
      </div>
    </>
  );
}

// Компонент для перехода с масштабированием
export function ScaleTransition({
  name,
  children,
  startScale = 0.95,
  endScale = 0.95,
  duration = 200,
}: {
  name: string;
  children: React.ReactNode;
  startScale?: number;
  endScale?: number;
  duration?: number;
}) {
  // Используем обычный style тег для вставки стилей
  const styleContent = `
    @keyframes ${name}-enter-scale {
      0% {
        opacity: 0;
        transform: scale(${startScale});
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes ${name}-exit-scale {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(${endScale});
      }
    }

    ::view-transition-new(.${name}-enter-scale) {
      animation: ${name}-enter-scale ease-out ${duration}ms;
    }
    ::view-transition-old(.${name}-exit-scale) {
      animation: ${name}-exit-scale ease-in ${duration}ms;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styleContent }} />
      <div 
        className={combineClasses(`${name}-enter-scale`, `${name}-exit-scale`)}
        style={{
          viewTransitionName: name
        }}
      >
        {children}
      </div>
    </>
  );
}

// Компонент для перехода с вращением
export function RotateTransition({
  name,
  children,
  startAngle = 5,
  endAngle = -5,
  duration = 300,
}: {
  name: string;
  children: React.ReactNode;
  startAngle?: number;
  endAngle?: number;
  duration?: number;
}) {
  // Используем обычный style тег для вставки стилей
  const styleContent = `
    @keyframes ${name}-enter-rotate {
      0% {
        opacity: 0;
        transform: rotate(${startAngle}deg);
      }
      100% {
        opacity: 1;
        transform: rotate(0deg);
      }
    }

    @keyframes ${name}-exit-rotate {
      0% {
        opacity: 1;
        transform: rotate(0deg);
      }
      100% {
        opacity: 0;
        transform: rotate(${endAngle}deg);
      }
    }

    ::view-transition-new(.${name}-enter-rotate) {
      animation: ${name}-enter-rotate ease-out ${duration}ms;
    }
    ::view-transition-old(.${name}-exit-rotate) {
      animation: ${name}-exit-rotate ease-in ${duration}ms;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styleContent }} />
      <div 
        className={combineClasses(`${name}-enter-rotate`, `${name}-exit-rotate`)}
        style={{
          viewTransitionName: name
        }}
      >
        {children}
      </div>
    </>
  );
} 