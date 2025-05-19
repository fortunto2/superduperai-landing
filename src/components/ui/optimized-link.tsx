"use client";

import React from "react";
import Link from "next/link";
import { LinkProps } from "next/link";

// Расширенные свойства для ссылки, добавляем поддержку просмотра исходного markdown
interface OptimizedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  title?: string; // SEO: Добавляем title для всех ссылок
  showMarkdownSource?: boolean; // Флаг для показа markdown источника
  target?: string;
  rel?: string;
}

/**
 * Оптимизированный компонент для ссылок с дополнительными возможностями
 * Поддерживает просмотр исходного markdown файла (.md в конце URL)
 *
 * При нажатии Ctrl/Cmd + клик открывает исходный markdown в новой вкладке,
 * если ссылка ведет на страницу с контентом
 */
const OptimizedLink: React.FC<OptimizedLinkProps> = ({
  href,
  children,
  className = "",
  title,
  showMarkdownSource = true, // Включено по умолчанию для всех внутренних ссылок
  target,
  rel,
  ...props
}) => {
  // Строковое представление href (может быть объектом для сложных ссылок)
  const hrefString = typeof href === "string" ? href : href.pathname || "";

  // Определяем, является ли ссылка внутренней ссылкой на контент
  const isContentLink =
    typeof href === "string" &&
    !href.startsWith("http") &&
    !href.startsWith("#") &&
    (href.startsWith("/tool/") ||
      href.startsWith("/case/") ||
      href.startsWith("/about") ||
      href.startsWith("/pricing") ||
      href.startsWith("/privacy") ||
      href.startsWith("/terms"));

  // Обработка клика с учетом модификаторов (Ctrl/Cmd + клик)
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Если нажат Ctrl/Cmd + клик и включен showMarkdownSource для контентных ссылок
    if ((e.ctrlKey || e.metaKey) && showMarkdownSource && isContentLink) {
      e.preventDefault();

      // Формируем URL с .md на конце
      const mdUrl = `${hrefString}.md`;

      // Открываем в новой вкладке
      window.open(mdUrl, "_blank");
    }
  };

  return (
    <Link
      href={href}
      className={className}
      title={title}
      target={target}
      rel={rel}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default OptimizedLink;
