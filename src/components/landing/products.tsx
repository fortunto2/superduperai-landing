"use client";

import { motion } from "framer-motion";
import { default as Link } from "@/components/ui/optimized-link";
import { products } from "@/data/products";
import { Video, Bot, Music, ArrowRight, Smartphone, AlarmClock } from "lucide-react";
import { useParams } from "next/navigation";
import { getValidLocale } from "@/lib/get-valid-locale";
import { useTranslation } from "@/hooks/use-translation";

const iconMap: Record<string, React.ReactNode> = {
  video: <Video className="h-7 w-7" />,
  bot: <Bot className="h-7 w-7" />,
  music: <Music className="h-7 w-7" />,
  alarm: <AlarmClock className="h-7 w-7" />,
};

const statusColors: Record<string, string> = {
  flagship: "bg-accent/20 text-accent border-accent/30",
  new: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  beta: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "coming-soon": "bg-muted text-muted-foreground border-border",
};

export function Products() {
  const params = useParams();
  const locale = getValidLocale(params.locale);
  const { t } = useTranslation(locale);

  return (
    <section className="py-20" id="products">
      <div className="container">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-4">
            {t("products.section_title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("products.section_description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {products.map((product, index) => {
            const href =
              product.slug === "video-editor"
                ? `/product/video-editor`
                : `/product/${product.slug}`;

            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={href}
                  className="group relative flex flex-col h-full p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/30 hover:bg-card/80 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-accent/10 text-accent">
                      {iconMap[product.icon] || <Video className="h-7 w-7" />}
                    </div>
                    {product.badge && (
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border ${statusColors[product.status]}`}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {product.tagline}
                  </p>
                  <p className="text-sm text-muted-foreground/70 flex-1">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30 text-sm text-accent">
                    <span>{t("products.learn_more")}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {product.appStoreUrl && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Smartphone className="h-3 w-3" />
                      <span>{t("products.available_ios")}</span>
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
