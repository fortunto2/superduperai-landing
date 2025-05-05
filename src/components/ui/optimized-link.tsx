"use client";

import { Link } from "next-view-transitions";
import React from "react";
import { LinkProps as NextLinkProps } from "next/link";

interface OptimizedLinkProps extends Omit<NextLinkProps, 'prefetch'> {
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  title?: string;
  prefetch?: boolean;
}

/**
 * OptimizedLink - обертка над Link компонентом из next-view-transitions
 * с поддержкой View Transitions API
 */
const OptimizedLink = ({
  prefetch = false,
  className,
  children,
  target,
  rel,
  title,
  ...props
}: OptimizedLinkProps) => {
  return (
    <Link {...props} prefetch={prefetch} className={className} target={target} rel={rel} title={title}>
      {children}
    </Link>
  );
};

export default OptimizedLink; 