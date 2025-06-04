"use client";

import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { LucideIcon } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useParams } from "next/navigation";
import { getValidLocale } from "@/lib/get-valid-locale";

// Animation for container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Animation for individual items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

export function Features() {
  const params = useParams();
  const locale = getValidLocale(params.locale);
  const { t } = useTranslation(locale);
  const features = t("features.list") as FeatureItem[];

  return (
    <section className="py-24 bg-muted/30 gradient-section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            {t("features.section_title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("features.section_description")}
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon
              ? (Icons as Record<string, LucideIcon>)[feature.icon]
              : UserCircle;
            return (
              <motion.div
                key={index}
                className="flex flex-col card-enhanced p-6 hover:translate-y-[-5px]"
                variants={itemVariants}
              >
                <div className="p-3 rounded-full bg-accent/10 text-accent w-fit mb-4 glassmorphism">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
