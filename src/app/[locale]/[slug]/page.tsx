import { allPages, type Page as PageType } from ".contentlayer/generated";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/content/mdx-components";
import { PageWrapper } from "@/components/content/page-wrapper";
import { generatePageMetadata, GRADIENTS } from "@/lib/metadata";
import { useTranslation } from "@/hooks/use-translation";
import { Locale } from "@/config/i18n-config";

// Функция для получения метаданных страницы
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  const page = allPages.find(
    (page) => page.slug === slug && page.locale === locale
  );

  if (!page) {
    return {
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} - Not Found`,
      description: "The requested page was not found.",
    };
  }

  const title = page.seo?.title || page.title;
  const description = page.seo?.description || page.description;

  // Форматируем слаг для отображения в OpenGraph изображении
  const formattedSlug = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // В метаданных передаем информацию для OG-изображения
  return generatePageMetadata({
    title,
    description,
    keywords: page.seo?.keywords || [],
    url: `/${slug}`,
    ogImage: page.seo?.ogImage,
    type: "website",
    meta: {
      pageType: "page",
      category: formattedSlug,
      gradient: GRADIENTS.page,
    },
  });
}

// Функция для проверки наличия H1 в MDX контенте
function checkForH1InMDX(code: string): boolean {
  // Проверяем наличие строки, начинающейся с # в начале строки
  return /^#\s+/m.test(code);
}

// Основной компонент страницы
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  // Ищем страницу с учетом локали для правильной локализации
  const page = allPages.find(
    (page) => page.slug === slug && page.locale === locale
  );

  if (!page) {
    // Пробуем найти с любой локалью, если не найден с текущей
    const fallbackPage = allPages.find((page) => page.slug === slug);

    if (!fallbackPage) {
      notFound();
    }

    // Используем доступную страницу, когда нет перевода для текущей локали
    return PageContent({ page: fallbackPage, slug, locale });
  }

  return PageContent({ page, slug, locale });
}

// Выделяем рендеринг контента в отдельную функцию для повторного использования
function PageContent({
  page,
  slug,
  locale,
}: {
  page: PageType;
  slug: string;
  locale: string;
}) {
  // Проверяем наличие заголовка H1 в MDX
  const hasH1Heading = checkForH1InMDX(page.body.raw);
  const { t } = useTranslation(locale as Locale);
  // Подготавливаем метку для хлебных крошек
  const breadcrumbLabel = page.title.split(" - ")[0];

  return (
    <PageWrapper
      title={page.title}
      breadcrumbItems={[
        { label: t("navbar.home"), href: `/${locale}` },
        { label: breadcrumbLabel, href: `/${locale}/${slug}` },
      ]}
      hasH1Heading={hasH1Heading}
      locale={locale}
    >
      <MDXContent code={page.body.code} />
    </PageWrapper>
  );
}
