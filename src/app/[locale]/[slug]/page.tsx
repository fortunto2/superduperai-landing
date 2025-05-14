import { Metadata } from "next";
import { allPages } from ".contentlayer/generated";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/content/mdx-components";
import { PageWrapper } from "@/components/content/page-wrapper";
import { generatePageMetadata, GRADIENTS } from "@/lib/metadata";
import { Locale } from "@/config/i18n-config";

interface PageProps {
  params: Promise<{
    slug: string;
    locale: Locale;
  }>;
}

// Функция для получения метаданных страницы
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
export default async function DynamicPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const page = allPages.find(
    (page) => page.slug === slug && page.locale === locale
  );

  if (!page) {
    notFound();
  }

  // Проверяем наличие заголовка H1 в MDX
  const hasH1Heading = checkForH1InMDX(page.body.raw);

  // Преобразуем slug в удобочитаемую метку для хлебных крошек
  const breadcrumbLabel = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <PageWrapper
      title={page.title}
      breadcrumbItems={[{ label: breadcrumbLabel, href: `/${slug}` }]}
      hasH1Heading={hasH1Heading}
    >
      <MDXContent code={page.body.code} />
    </PageWrapper>
  );
}
