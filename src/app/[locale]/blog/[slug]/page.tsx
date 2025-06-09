import { allBlogs } from ".contentlayer/generated";
import { MDXContent } from "@/components/content/mdx-components";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PageWrapper } from "@/components/content/page-wrapper";
import { generatePageMetadata, GRADIENTS } from "@/lib/metadata";
import { Blog } from ".contentlayer/generated";
import { useTranslation } from "@/hooks/use-translation";
import { Locale } from "@/config/i18n-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  // Ищем пост по слагу и локали
  const post = allBlogs.find(
    (post) => post.slug === slug && post.locale === locale
  );

  if (!post) {
    return {};
  }

  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.description;

  return generatePageMetadata({
    title,
    description,
    keywords: post.seo?.keywords || [],
    url: `/blog/${slug}`,
    ogImage: post.seo?.ogImage,
    type: "article",
    meta: {
      pageType: "blog",
      category: "Blog",
      gradient: GRADIENTS.tool,
    },
  });
}

// Функция для проверки наличия H1 в MDX контенте
function checkForH1InMDX(code: string): boolean {
  // Проверяем наличие строки, начинающейся с # в начале строки
  return /^#\s+/m.test(code);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  // Ищем пост с учетом локали для правильной локализации
  const post = allBlogs.find(
    (post) => post.slug === slug && post.locale === locale
  );

  if (!post) {
    // Пробуем найти с любой локалью, если не найден с текущей
    const fallbackPost = allBlogs.find((post) => post.slug === slug);

    if (!fallbackPost) {
      notFound();
    }

    // Используем доступный пост, когда нет перевода для текущей локали
    return BlogPageContent({ post: fallbackPost, slug, locale });
  }

  return BlogPageContent({ post, slug, locale });
}

// Выделяем рендеринг контента в отдельную функцию для повторного использования
function BlogPageContent({
  post,
  slug,
  locale,
}: {
  post: Blog;
  slug: string;
  locale: string;
}) {
  // Проверяем наличие заголовка H1 в MDX
  const hasH1Heading = checkForH1InMDX(post.body.raw);
  const { t } = useTranslation(locale as Locale);
  // Подготавливаем метку для хлебных крошек
  const breadcrumbLabel = post.title;

  return (
    <PageWrapper
      title={post.title}
      locale={locale}
      breadcrumbItems={[
        { label: t("navbar.home"), href: `/${locale}` },
        { label: t("navbar.blog"), href: `/${locale}/blog` },
        { label: breadcrumbLabel, href: `/${locale}/blog/${slug}` },
      ]}
      hasH1Heading={hasH1Heading}
    >
      <MDXContent code={post.body.code} />
    </PageWrapper>
  );
}
