import { default as Link } from "@/components/ui/optimized-link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { generatePageMetadata, GRADIENTS } from "@/lib/metadata";
import { products } from "@/data/products";
import { Metadata } from "next";
import {
  Video,
  Bot,
  Music,
  ArrowRight,
  Smartphone,
  AlarmClock,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Products | SuperDuperAI",
  description:
    "Explore SuperDuperAI products: AI Video Editor, Super Chatbot, KubizBeat, and more.",
  url: "/product",
  meta: {
    pageType: "product",
    gradient: GRADIENTS.product,
  },
});

const iconMap: Record<string, React.ReactNode> = {
  video: <Video className="h-8 w-8" />,
  bot: <Bot className="h-8 w-8" />,
  music: <Music className="h-8 w-8" />,
  alarm: <AlarmClock className="h-8 w-8" />,
};

const statusColors: Record<string, string> = {
  flagship:
    "bg-accent/20 text-accent border-accent/30",
  new: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  beta: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "coming-soon":
    "bg-muted text-muted-foreground border-border",
};

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-16">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Our Products
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-powered tools for creators, businesses, and musicians. From
              video production to intelligent chatbots and music creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const href =
                product.slug === "video-editor"
                  ? `/product/video-editor`
                  : `/product/${product.slug}`;

              return (
                <Link
                  href={href}
                  key={product.slug}
                  className="group relative flex flex-col p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/30 hover:bg-card/80 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-accent/10 text-accent">
                      {iconMap[product.icon] || (
                        <Video className="h-8 w-8" />
                      )}
                    </div>
                    {product.badge && (
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border ${statusColors[product.status]}`}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-1">
                    {product.tagline}
                  </p>
                  <p className="text-sm text-muted-foreground/70 flex-1">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30 text-sm text-accent">
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {product.appStoreUrl && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Smartphone className="h-3 w-3" />
                      <span>Available on iOS</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
