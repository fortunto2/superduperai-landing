"use client";

import { products } from "@/data/products";
import { default as Link } from "@/components/ui/optimized-link";
import { Video, Bot, Music, ArrowRight, AlarmClock } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  video: <Video className="h-6 w-6" />,
  bot: <Bot className="h-6 w-6" />,
  music: <Music className="h-6 w-6" />,
  alarm: <AlarmClock className="h-6 w-6" />,
};

const statusColors: Record<string, string> = {
  flagship: "bg-accent/20 text-accent border-accent/30",
  new: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  beta: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "coming-soon": "bg-muted text-muted-foreground border-border",
};

export function ProductCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
      {products.map((product) => {
        const href = `/product/${product.slug}`;

        return (
          <Link
            key={product.slug}
            href={href}
            className="group relative flex flex-col h-full p-5 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/30 hover:bg-card/80 transition-all duration-300 no-underline"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                {iconMap[product.icon] || <Video className="h-6 w-6" />}
              </div>
              <div className="flex items-center gap-2">
                {product.platform && product.platform.length > 0 && (
                  <div className="flex gap-1">
                    {product.platform.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
                {product.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[product.status]}`}
                  >
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors text-foreground">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              {product.tagline}
            </p>
            <p className="text-xs text-muted-foreground/70 flex-1">
              {product.description}
            </p>

            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/30 text-sm text-accent">
              <span>Learn more</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
