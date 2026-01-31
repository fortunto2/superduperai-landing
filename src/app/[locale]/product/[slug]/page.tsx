import { allProducts } from ".contentlayer/generated";
import { MDXContent } from "@/components/content/mdx-components";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ProductHero } from "@/components/landing/product-hero";
import { ProductCTA } from "@/components/landing/product-cta";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { generatePageMetadata, GRADIENTS } from "@/lib/metadata";
import { Product } from ".contentlayer/generated";
import { getProductBySlug } from "@/data/products";

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

// Privacy/legal pages don't get Hero + CTA
const SIMPLE_PAGE_PATTERNS = ["-privacy", "-terms", "-legal"];

function isSimplePage(slug: string): boolean {
  return SIMPLE_PAGE_PATTERNS.some((pattern) => slug.endsWith(pattern));
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
  const productData = getProductBySlug(slug);
  const simple = isSimplePage(slug);

  // Determine CTA href and label
  const ctaHref = productData?.externalUrl || productData?.appStoreUrl;
  const ctaExternal = !!ctaHref;
  const ctaLabel = productData?.externalUrl
    ? `Visit ${productData.name}`
    : productData?.appStoreUrl
      ? "Download on App Store"
      : "Get Started";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/90">
      <Navbar />
      <main className="flex-1">
        {!simple && productData && (
          <ProductHero
            name={productData.name}
            tagline={productData.tagline}
            description={productData.description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            ctaExternal={ctaExternal}
            badge={productData.badge}
          />
        )}

        <div className="container py-12">
          <Breadcrumbs
            items={[
              { label: "Home", href: `/${locale}` },
              { label: "Products", href: `/${locale}/product` },
              { label: product.title, href: `/${locale}/product/${slug}` },
            ]}
            className="mb-8"
          />

          {!hasH1Heading && (
            <h1 className="text-4xl font-bold mb-8">{product.title}</h1>
          )}

          <div
            className={`prose prose-invert max-w-none w-full ${hasH1Heading ? "mt-0" : "mt-6"}`}
          >
            <MDXContent code={product.body.code} locale={locale} />
          </div>
        </div>

        {!simple && ctaHref && (
          <ProductCTA
            title={`Ready to try ${productData?.name || product.title}?`}
            description={productData?.tagline || product.description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            ctaExternal={ctaExternal}
          />
        )}
      </main>
      <Footer locale={locale} />
    </div>
  );
}
