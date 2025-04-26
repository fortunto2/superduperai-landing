"use client"

import { motion } from "framer-motion";
import { LightbulbIcon, Bot, SlidersHorizontal } from "lucide-react";

// Animation for container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.3
    }
  }
};

// Animation for individual steps
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
      description: "Describe your idea, vibe, or plot — just a few phrases are enough",
    },
    {
      icon: <Bot className="h-10 w-10" />,
      title: "AI Generates the Scene",
      description: "Multi-agent system creates script, frames, and characters",
    },
    {
      icon: <SlidersHorizontal className="h-10 w-10" />,
      title: "Refine and Finalize",
      description: "Adjust the style, export your video, and share it with the world",
    },
  ];

  return (
    <section className="py-24 bg-muted/30 gradient-section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            How It <span className="neon-text">Works</span>
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
              className="relative card-enhanced p-8 flex flex-col items-center text-center hover:translate-y-[-5px]"
              variants={itemVariants}
            >
              <div className="bg-accent/10 p-4 rounded-full mb-6 text-accent glassmorphism">
                {step.icon}
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