"use client"

import { motion } from "framer-motion";
import { LightbulbIcon, Bot, SlidersHorizontal } from "lucide-react";

// Анимация для контейнера
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.3
    }
  }
};

// Анимация для отдельных шагов
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export function HowItWorks() {
  const steps = [
    {
      icon: <LightbulbIcon className="h-10 w-10" />,
      title: "Define Your Vision",
      description: "Опиши идею, вайб, сюжет — достаточно нескольких фраз",
    },
    {
      icon: <Bot className="h-10 w-10" />,
      title: "AI Generates the Scene",
      description: "Мультиагентная система создает сценарий, кадр, персонажей",
    },
    {
      icon: <SlidersHorizontal className="h-10 w-10" />,
      title: "Refine and Finalize",
      description: "Настрой стиль, экспортируй видео и делись с миром",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Direct your video in 3 easy steps – AI agents handle the rest.
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
              className="relative bg-background rounded-lg p-8 shadow-md flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="bg-primary/10 p-4 rounded-full mb-6 text-primary">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              <div className="absolute top-8 right-8 font-bold text-5xl text-primary/10">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 