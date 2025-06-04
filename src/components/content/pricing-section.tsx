"use client";

import { default as Link } from "@/components/ui/optimized-link";
import { APP_URLS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, X, Check, Users, ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { getValidLocale } from "@/lib/get-valid-locale";
import { useTranslation } from "@/hooks/use-translation";
import { Locale } from "@/config/i18n-config";

// Определение типов для данных о тарифах
interface PricePlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  projectsEstimate: string;
  features: string[];
  popular?: boolean;
  discount?: string;
  cta: string;
  ctaUrl: string;
}

// Данные о тарифных планах (только id, price, credits, popular, ctaUrl — остальное из словаря)
function getPricingData(
  t: <T = string>(key: string, fallback?: T) => T
): PricePlan[] {
  return [
    {
      id: "free",
      name: t("pricing.without_package"),
      credits: 100,
      price: 0,
      projectsEstimate: "",
      features: t("pricing.free_features"),
      cta: t("pricing.start"),
      ctaUrl: APP_URLS.EDITOR_URL,
    },
    {
      id: "base",
      name: t("pricing.base_name"),
      credits: 100,
      price: 20,
      projectsEstimate: t("pricing.base_projects"),
      features: t("pricing.base_features"),
      cta: t("pricing.buy"),
      ctaUrl: APP_URLS.PAYMENT_URL,
    },
    {
      id: "pro",
      name: t("pricing.pro_name"),
      credits: 1000,
      price: 100,
      discount: t("pricing.save_50"),
      projectsEstimate: t("pricing.pro_projects"),
      features: t("pricing.pro_features"),
      cta: t("pricing.buy"),
      ctaUrl: APP_URLS.PAYMENT_URL,
      popular: true,
    },
  ];
}

export function PricingSection() {
  const params = useParams();
  const locale = getValidLocale(params.locale);
  const { t } = useTranslation(locale as Locale);
  const pricingData = getPricingData(t);
  return (
    <div className="my-12 max-w-5xl mx-auto">
      {/* Hero Free Credits Banner */}
      <div className="mb-12 text-center">
        <div className="p-6 rounded-xl bg-gradient-to-r from-amber-950/40 to-amber-900/20 border border-amber-800/30">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-3">
            {t("pricing.banner_title")}
          </h2>
          <p className="text-amber-200/80 mb-4 max-w-3xl mx-auto">
            {t("pricing.banner_desc")}
          </p>
          <Link
            href={APP_URLS.EDITOR_URL}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            title={t("pricing.banner_cta")}
          >
            {t("pricing.banner_cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {/* Comparison cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Без пакета */}
          <Card className="border-gray-800 bg-gray-900/50 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-3 border-b border-gray-800">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="p-1 rounded-full bg-gray-800">
                  <X className="h-4 w-4 text-gray-400" />
                </span>
                {t("pricing.without_package")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 px-4">
              <ul className="space-y-2 text-sm text-gray-300">
                {pricingData[0].features.map((feature: string) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* С Power Package */}
          <Card className="border-green-600/30 bg-gray-900/50 overflow-hidden shadow-md hover:shadow-lg transition-all">
            <CardHeader className="pb-3 border-b border-gray-800">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="p-1 rounded-full bg-green-600/30">
                  <Zap className="h-4 w-4 text-green-400" />
                </span>
                {t("pricing.with_power_package")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 px-4">
              <ul className="space-y-2 text-sm text-gray-300">
                {pricingData[2].features.map((feature: string) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Пакеты для покупки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          {pricingData.slice(1).map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "border-gray-800 bg-gray-900/50 overflow-hidden transition-all",
                plan.popular
                  ? "border-green-600/30 shadow-md hover:shadow-green-600/10"
                  : "shadow-sm hover:shadow-md"
              )}
            >
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl">{plan.name}</h3>
                    <div className="flex items-center gap-x-2 mt-1">
                      <span className="text-3xl font-extrabold">
                        ${plan.price}
                      </span>
                      {plan.discount && (
                        <span className="text-xs font-medium py-0.5 px-2 bg-green-600/20 text-green-400 rounded-full">
                          {plan.discount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {plan.projectsEstimate}
                  </div>
                </div>

                <Link
                  href={plan.ctaUrl}
                  className={cn(
                    "block w-full py-2.5 text-center font-medium rounded-lg transition-colors",
                    plan.popular
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                      : "bg-gray-800 text-gray-100 hover:bg-gray-700"
                  )}
                  title={plan.cta}
                >
                  {plan.cta}
                </Link>
              </div>
              <div className="px-4 pb-4">
                <ul className="space-y-2 text-sm text-gray-300">
                  {plan.features.map((feature: string) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Creative Partnership Program */}
      <div className="mt-14 p-6 rounded-xl bg-gradient-to-r from-indigo-950/40 to-purple-900/20 border border-indigo-800/30">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="p-3 bg-indigo-600/30 rounded-full">
              <Users className="h-8 w-8 text-indigo-300" />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-xl md:text-2xl font-bold text-indigo-300 mb-2">
              {t("creative.title")}
            </h3>
            <p className="text-indigo-200/80 mb-3">{t("creative.desc")}</p>
            <Link
              href="/creators"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              title={t("creative.learn_more")}
            >
              {t("creative.learn_more")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <span className="mx-2 text-indigo-400">{t("creative.or")}</span>
            <Link
              href={`mailto:${APP_URLS.EMAIL}?subject=Creative Partnership Application`}
              className="inline-flex items-center gap-2 bg-transparent border border-indigo-600/50 hover:bg-indigo-800/20 text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              title={t("creative.apply_email")}
            >
              {t("creative.apply_email")}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-800 text-center">
        <Link
          href="/privacy"
          className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          title={t("privacy_policy")}
        >
          {t("privacy_policy")}
        </Link>
      </div>
    </div>
  );
}
