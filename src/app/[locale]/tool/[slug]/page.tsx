import { allTools } from ".contentlayer/generated";
import { MDXContent } from "@/components/content/mdx-components";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PageWrapper } from "@/components/content/page-wrapper";
import { generatePageMetadata, GRADIENTS } from "@/lib/metadata";
import { Tool } from ".contentlayer/generated";
import { useTranslation } from "@/hooks/use-translation";
import { Locale } from "@/config/i18n-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  // Ищем инструмент по слагу и локали
  const tool = allTools.find(
    (tool) => tool.slug === slug && tool.locale === locale
  );

  if (!tool) {
    return {};
  }

  const title = tool.seo?.title || tool.title;
  const description = tool.seo?.description || tool.description;

  return generatePageMetadata({
    title,
    description,
    keywords: tool.seo?.keywords || [],
    url: `/tool/${slug}`,
    ogImage: tool.seo?.ogImage,
    type: "article",
    meta: {
      pageType: "tool",
      category: "Tool",
      gradient: GRADIENTS.tool,
    },
  });
}

// Функция для проверки наличия H1 в MDX контенте
function checkForH1InMDX(code: string): boolean {
  // Проверяем наличие строки, начинающейся с # в начале строки
  return /^#\s+/m.test(code);
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  // Ищем инструмент с учетом локали для правильной локализации
  const tool = allTools.find(
    (tool) => tool.slug === slug && tool.locale === locale
  );

  if (!tool) {
    // Пробуем найти с любой локалью, если не найден с текущей
    const fallbackTool = allTools.find((tool) => tool.slug === slug);

    if (!fallbackTool) {
      notFound();
    }

    // Используем доступный инструмент, когда нет перевода для текущей локали
    return ToolPageContent({ tool: fallbackTool, slug, locale });
  }

  return ToolPageContent({ tool, slug, locale });
}

// Выделяем рендеринг контента в отдельную функцию для повторного использования
function ToolPageContent({
  tool,
  slug,
  locale,
}: {
  tool: Tool;
  slug: string;
  locale: string;
}) {
  // Проверяем наличие заголовка H1 в MDX
  const hasH1Heading = checkForH1InMDX(tool.body.raw);
  const { t } = useTranslation(locale as Locale);
  // Подготавливаем метку для хлебных крошек
  const breadcrumbLabel = tool.title;

  return (
    <PageWrapper
      title={tool.title}
      locale={locale}
      breadcrumbItems={[
        { label: t("navbar.home"), href: `/${locale}` },
        { label: t("marketing.tools"), href: `/${locale}/tool` },
        { label: breadcrumbLabel, href: `/${locale}/tool/${slug}` },
      ]}
      hasH1Heading={hasH1Heading}
    >
      <MDXContent code={tool.body.code} />
    </PageWrapper>
  );
}
