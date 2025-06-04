"use client";

import React from "react";
import { default as Link } from "@/components/ui/optimized-link";
import { ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { getValidLocale } from "@/lib/get-valid-locale";
import { useTranslation } from "@/hooks/use-translation";
import { Locale } from "@/config/i18n-config";

interface CTABoxProps {
  children: React.ReactNode;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

export function CTABox({
  children,
  buttonText,
  buttonHref = "https://editor.superduperai.co",
  className,
}: CTABoxProps) {
  const params = useParams();
  const locale = getValidLocale(params.locale);
  const { t } = useTranslation(locale as Locale);
  const text = buttonText ?? t("ui.get_started");

  return (
    <div
      className={`bg-primary/10 border border-primary/20 rounded-lg p-8 my-12 text-center ${className ?? ""}`}
    >
      <div className="text-xl mb-6">{children}</div>
      <Link
        href={buttonHref}
        className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
      >
        {text} <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </div>
  );
}
