"use client";

import Link, { LinkProps } from "next/link";
import React from "react";

interface OptimizedLinkProps extends LinkProps {
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  title?: string;
}

/**
 * OptimizedLink - обертка над стандартным Next.js Link с отключенным prefetch по умолчанию
 * для снижения количества запросов и оптимизации расходов на хостинг
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