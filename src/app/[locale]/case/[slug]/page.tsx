import { allCases } from ".contentlayer/generated";
import { MDXContent } from "@/components/content/mdx-components";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PageWrapper } from "@/components/content/page-wrapper";
import { generatePageMetadata, GRADIENTS } from "@/lib/metadata";
import { Case } from ".contentlayer/generated";
import { useTranslation } from "@/hooks/use-translation";
import { Locale } from "@/config/i18n-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;

  // Ищем кейс по слагу и локали
  const caseItem = allCases.find(
    (caseItem) => caseItem.slug === slug && caseItem.locale === locale
  );

  if (!caseItem) {
    return {};
  }

  const title = caseItem.seo?.title || caseItem.title;
  const description = caseItem.seo?.description || caseItem.description;

  return generatePageMetadata({
    title,
    description,
    keywords: caseItem.seo?.keywords || [],
    url: `/case/${slug}`,
    ogImage: caseItem.seo?.ogImage || caseItem.image,
    type: "article",
    meta: {
      pageType: "case",
      category: caseItem.category,
      gradient: GRADIENTS.case,
    },
  });
}

// Функция для проверки наличия H1 в MDX контенте
function checkForH1InMDX(code: string): boolean {
  // Проверяем наличие строки, начинающейся с # в начале строки
  return /^#\s+/m.test(code);
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  // Ищем кейс с учетом локали для правильной локализации
  const caseItem = allCases.find(
    (caseItem) => caseItem.slug === slug && caseItem.locale === locale
  );

  if (!caseItem) {
    // Пробуем найти с любой локалью, если не найден с текущей
    const fallbackCase = allCases.find((caseItem) => caseItem.slug === slug);

    if (!fallbackCase) {
      notFound();
    }

    // Используем доступный кейс, когда нет перевода для текущей локали
    return CasePageContent({ caseItem: fallbackCase, slug, locale });
  }

  return CasePageContent({ caseItem, slug, locale });
}

// Выделяем рендеринг контента в отдельную функцию для повторного использования
function CasePageContent({
  caseItem,
  slug,
  locale,
}: {
  caseItem: Case;
  slug: string;
  locale: string;
}) {
  // Проверяем наличие заголовка H1 в MDX
  const hasH1Heading = checkForH1InMDX(caseItem.body.raw);
  const { t } = useTranslation(locale as Locale);
  // Подготавливаем метку для хлебных крошек
  const breadcrumbLabel = caseItem.title;

  return (
    <PageWrapper
      locale={locale}
      title={caseItem.title}
      breadcrumbItems={[
        { label: t("navbar.home"), href: `/${locale}` },
        { label: t("marketing.cases"), href: `/${locale}/case` },
        { label: breadcrumbLabel, href: `/${locale}/case/${slug}` },
      ]}
      hasH1Heading={hasH1Heading}
    >
      <MDXContent code={caseItem.body.code} />
    </PageWrapper>
  );
}
