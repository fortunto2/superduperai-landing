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
import { AppStoreEmbed } from "@/components/ui/app-store-embed";

// App Store app IDs for products with iOS apps
const APP_STORE_IDS: Record<string, { appId: string; screenshots?: string[] }> = {
  "jaw-harp-synth": {
    appId: "6758465213",
    screenshots: [
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/92/87/97/928797e7-c6a8-95ac-c039-0d0e66299a9e/Simulator_Screenshot_-_iPhone_17_Pro_Max_-_2026-01-31_at_12.12.28.png/460x0w.webp",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/4c/02/c2/4c02c21e-9219-63d9-f00d-488095708362/Simulator_Screenshot_-_iPhone_17_Pro_Max_-_2026-01-31_at_12.12.33.png/460x0w.webp",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/3d/c9/57/3dc95759-b5d7-4cc2-7be6-8bf412f268a7/Simulator_Screenshot_-_iPhone_17_Pro_Max_-_2026-01-31_at_12.31.55.png/460x0w.webp",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/83/8c/ec/838cec29-07ad-946b-594b-1421dacfceb8/Simulator_Screenshot_-_iPhone_17_Pro_Max_-_2026-01-31_at_12.12.56.png/460x0w.webp",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/13/ae/b8/13aeb850-3498-0c75-4ff6-2c87578a3567/Simulator_Screenshot_-_iPhone_17_Pro_Max_-_2026-01-31_at_12.13.01.png/460x0w.webp",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/b1/f9/6f/b1f96fd7-183e-e0cd-fcdd-cacf91022a90/Simulator_Screenshot_-_iPhone_17_Pro_Max_-_2026-01-31_at_12.12.45.png/460x0w.webp",
    ],
  },
};

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
  const hasAppStore = productData?.platform?.includes("Android") || productData?.platform?.includes("iOS");
  const storeUrl = productData?.appStoreUrl;
  const googlePlayUrl = storeUrl?.includes("play.google.com") ? storeUrl : undefined;
  const appStoreUrl = storeUrl?.includes("apps.apple.com") ? storeUrl : undefined;
  const appStoreComingSoon = productData?.platform?.includes("iOS") && !appStoreUrl;
  const ctaHref = productData?.externalUrl;
  const ctaExternal = !!ctaHref;
  const ctaLabel = ctaHref
    ? `Visit ${productData?.name || product.title}`
    : "Get Started";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/90">
      <Navbar />
      <main className="flex-1">
        {!simple && productData && (
          <>
            <ProductHero
              name={productData.name}
              tagline={productData.tagline}
              description={productData.description}
              ctaLabel={ctaLabel}
              ctaHref={hasAppStore ? undefined : ctaHref}
              ctaExternal={ctaExternal}
              badge={productData.badge}
              googlePlayUrl={googlePlayUrl}
              appStoreUrl={appStoreUrl}
              appStoreComingSoon={appStoreComingSoon}
            />
            {APP_STORE_IDS[slug] && (
              <AppStoreEmbed
                appId={APP_STORE_IDS[slug].appId}
                screenshots={APP_STORE_IDS[slug].screenshots}
              />
            )}
          </>
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

        {!simple && (ctaHref || hasAppStore) && (
          <ProductCTA
            title={`Ready to try ${productData?.name || product.title}?`}
            description={productData?.tagline || product.description}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            ctaExternal={ctaExternal}
            googlePlayUrl={googlePlayUrl}
            appStoreUrl={appStoreUrl}
            appStoreComingSoon={appStoreComingSoon}
          />
        )}
      </main>
      <Footer locale={locale} />
    </div>
  );
}
