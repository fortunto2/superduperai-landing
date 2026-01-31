import { allProducts } from ".contentlayer/generated";
import { MDXContent } from "@/components/content/mdx-components";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PageWrapper } from "@/components/content/page-wrapper";
import { generatePageMetadata, GRADIENTS } from "@/lib/metadata";
import { Product } from ".contentlayer/generated";
import { useTranslation } from "@/hooks/use-translation";
import { Locale } from "@/config/i18n-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = allProducts.find(
    (p) => p.slug === slug && p.locale === locale
  );

  if (!product) {
    return {};
  }

  const title = product.seo?.title || product.title;
  const description = product.seo?.description || product.description;

  return generatePageMetadata({
    title,
    description,
    keywords: product.seo?.keywords || [],
    url: `/product/${slug}`,
    ogImage: product.seo?.ogImage,
    type: "article",
    meta: {
      pageType: "product",
      category: "Product",
      gradient: GRADIENTS.product,
    },
  });
}

function checkForH1InMDX(code: string): boolean {
  return /^#\s+/m.test(code);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  const product = allProducts.find(
    (p) => p.slug === slug && p.locale === locale
  );

  if (!product) {
    const fallbackProduct = allProducts.find((p) => p.slug === slug);

    if (!fallbackProduct) {
      notFound();
    }

    return ProductPageContent({ product: fallbackProduct, slug, locale });
  }

  return ProductPageContent({ product, slug, locale });
}

function ProductPageContent({
  product,
  slug,
  locale,
}: {
  product: Product;
  slug: string;
  locale: string;
}) {
  const hasH1Heading = checkForH1InMDX(product.body.raw);
  const { t } = useTranslation(locale as Locale);

  return (
    <PageWrapper
      title={product.title}
      locale={locale}
      breadcrumbItems={[
        { label: t("navbar.home"), href: `/${locale}` },
        { label: "Products", href: `/${locale}/product` },
        { label: product.title, href: `/${locale}/product/${slug}` },
      ]}
      hasH1Heading={hasH1Heading}
    >
      <MDXContent code={product.body.code} locale={locale} />
    </PageWrapper>
  );
}
