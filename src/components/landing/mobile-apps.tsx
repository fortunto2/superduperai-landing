"use client";

import { motion } from "framer-motion";
import { default as Link } from "@/components/ui/optimized-link";
import { useParams } from "next/navigation";
import { getValidLocale } from "@/lib/get-valid-locale";
import { useTranslation } from "@/hooks/use-translation";
import { Music, AlarmClock, ArrowRight, Smartphone } from "lucide-react";

const apps = [
  {
    slug: "face-alarm",
    name: "FaceAlarm",
    icon: <AlarmClock className="h-10 w-10 text-accent" />,
    taglineKey: "mobileApps.facealarm_tagline",
    descriptionKey: "mobileApps.facealarm_description",
    badge: "iOS App",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    gradient: "from-accent/20 to-rose-500/20",
  },
  {
    slug: "kubizbeat",
    name: "KubizBeat",
    icon: <Music className="h-10 w-10 text-accent" />,
    taglineKey: "mobileApps.kubizbeat_tagline",
    descriptionKey: "mobileApps.kubizbeat_description",
    badge: "iOS App",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    gradient: "from-accent/20 to-purple-500/20",
  },
];

export function MobileApps() {
  const params = useParams();
  const locale = getValidLocale(params.locale);
  const { t } = useTranslation(locale);

  return (
    <section className="py-20" id="mobile-apps">
      <div className="container">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-4">
            {t("mobileApps.section_title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("mobileApps.section_description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {apps.map((app, index) => (
            <motion.div
              key={app.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/product/${app.slug}`}
                className="group flex flex-col gap-4 p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/30 hover:bg-card/80 transition-all duration-300 h-full"
              >
                <div className={`shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${app.gradient} border border-accent/20`}>
                  {app.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold group-hover:text-accent transition-colors">
                      {app.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${app.badgeColor}`}
                    >
                      {app.badge}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t(app.taglineKey)}
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    {t(app.descriptionKey)}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-border/30">
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <span>{t("products.learn_more")}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Smartphone className="h-3 w-3" />
                    <span>{t("products.available_ios")}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
