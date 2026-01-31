"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { getValidLocale } from "@/lib/get-valid-locale";
import { useTranslation } from "@/hooks/use-translation";
import { APP_URLS } from "@/lib/constants";
import { Bot, Database, Rocket, GraduationCap, Calendar } from "lucide-react";

const serviceIcons = [
  <Bot className="h-6 w-6" key="bot" />,
  <Database className="h-6 w-6" key="database" />,
  <Rocket className="h-6 w-6" key="rocket" />,
  <GraduationCap className="h-6 w-6" key="graduation" />,
];

export function Services() {
  const params = useParams();
  const locale = getValidLocale(params.locale);
  const { t } = useTranslation(locale);

  const services = [
    {
      title: t("services.ai_agents_title"),
      description: t("services.ai_agents_desc"),
    },
    {
      title: t("services.rag_title"),
      description: t("services.rag_desc"),
    },
    {
      title: t("services.mvp_title"),
      description: t("services.mvp_desc"),
    },
    {
      title: t("services.training_title"),
      description: t("services.training_desc"),
    },
  ];

  return (
    <section className="py-20" id="services">
      <div className="container">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-4">
            {t("services.section_title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("services.section_description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-3 rounded-xl bg-accent/10 text-accent w-fit mb-4">
                {serviceIcons[index]}
              </div>
              <h3 className="text-lg font-bold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            className="text-lg px-8 btn-accent"
            asChild
          >
            <a
              href={APP_URLS.CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Calendar className="h-5 w-5 mr-2" />
              {t("services.cta")}
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
