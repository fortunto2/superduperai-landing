"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { APP_URLS } from "@/lib/constants";
import { useTranslation } from "@/hooks/use-translation";
import { useParams } from "next/navigation";
import { getValidLocale } from "@/lib/get-valid-locale";
import { default as Link } from "@/components/ui/optimized-link";
import { Calendar } from "lucide-react";

export function CTAGeneric() {
  const params = useParams();
  const locale = getValidLocale(params.locale);
  const { t } = useTranslation(locale);
  return (
    <section className="py-20 animated-bg">
      <div className="container">
        <motion.div
          className="max-w-5xl mx-auto glassmorphism p-10 md:p-16 rounded-3xl text-center relative overflow-hidden border border-accent/20 gradient-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-6">
              {t("ctaGeneric.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t("ctaGeneric.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 btn-accent"
                asChild
              >
                <Link href="/product">
                  {t("ctaGeneric.button")}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-accent/50 hover:border-accent/80"
                asChild
              >
                <a
                  href={APP_URLS.CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  {t("ctaGeneric.note")}
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
