"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { getValidLocale } from "@/lib/get-valid-locale";
import { useTranslation } from "@/hooks/use-translation";
import { ArrowUpRight, FileText } from "lucide-react";
import { APP_URLS } from "@/lib/constants";
import { default as Link } from "@/components/ui/optimized-link";

export function Founder() {
  const params = useParams();
  const locale = getValidLocale(params.locale);
  const { t } = useTranslation(locale);

  return (
    <section className="py-20" id="founder">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="glassmorphism rounded-3xl p-8 md:p-12 border border-accent/10 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-accent/8 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              <div className="shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center text-5xl md:text-6xl">
                  R
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-1">
                  {t("founder.name")}
                </h2>
                <p className="text-accent text-sm mb-4">
                  {t("founder.role")}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t("founder.bio")}
                </p>
                <p className="text-muted-foreground/80 text-sm leading-relaxed mb-6">
                  {t("founder.philosophy")}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    {t("founder.manifesto")}
                  </Link>
                  <a
                    href={APP_URLS.FOUNDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    {t("founder.cta")}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
