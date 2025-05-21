"use client";

import { motion } from "framer-motion";
import { LightbulbIcon, Bot, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useParams } from "next/navigation";
import { getValidLocale } from "@/lib/get-valid-locale";

// Animation for container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

// Animation for individual steps
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

interface Step {
  title: string;
  description: string;
}

export function HowItWorks() {
  const params = useParams();
  const locale = getValidLocale(params.locale);
  const { t } = useTranslation(locale);
  const steps = t("howItWorks.steps") as Step[];

  // Default icons to use for each step
  const icons = [
    <LightbulbIcon
      key="lightbulb"
      className="h-10 w-10"
    />,
    <Bot
      key="bot"
      className="h-10 w-10"
    />,
    <SlidersHorizontal
      key="sliders"
      className="h-10 w-10"
    />,
  ];

  return (
    <section className="py-24 bg-muted/30 gradient-section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            {t("howItWorks.section_title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("howItWorks.section_description")}
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative card-enhanced p-8 flex flex-col items-center text-center hover:translate-y-[-5px]"
              variants={itemVariants}
            >
              <div className="bg-accent/10 p-4 rounded-full mb-6 text-accent glassmorphism">
                {icons[index % icons.length]}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              <div className="absolute top-8 right-8 font-bold text-5xl text-accent/10 neon-text opacity-20">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
