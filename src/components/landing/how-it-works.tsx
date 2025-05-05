"use client"

import { motion } from "framer-motion";
import { LightbulbIcon, Bot, SlidersHorizontal } from "lucide-react";
import { ScaleTransition, SlideTransition, RotateTransition } from "@/components/ui/slide-transition";

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

interface Step {
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps?: Step[];
}

export function HowItWorks({ steps: propSteps }: HowItWorksProps) {
  // Default steps if none are provided
  const steps = propSteps || [
    {
      title: "Define Your Vision",
      description: "Describe your idea, vibe, or plot — just a few phrases are enough",
    },
    {
      title: "AI Generates the Scene",
      description: "Multi-agent system creates script, frames, and characters",
    },
    {
      title: "Refine and Finalize",
      description: "Adjust the style, export your video, and share it with the world",
    },
  ];

  // Default icons to use for each step
  const icons = [
    <LightbulbIcon key="lightbulb" className="h-10 w-10" />,
    <Bot key="bot" className="h-10 w-10" />,
    <SlidersHorizontal key="sliders" className="h-10 w-10" />
  ];

  return (
    <section className="py-24 bg-muted/30 gradient-section">
      <div className="container">
        <div className="text-center mb-16">
          <SlideTransition name="how-title" direction="vertical" distance={15} duration={400}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              How It <RotateTransition name="how-title-accent" duration={600}><span className="neon-text">Works</span></RotateTransition>
            </h2>
          </SlideTransition>
          <SlideTransition name="how-description" direction="vertical" distance={15} duration={500}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Direct your video in 3 easy steps – AI agents handle the rest.
            </p>
          </SlideTransition>
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
              variants={itemVariants}
            >
              <ScaleTransition 
                name={`how-step-${index}`} 
                startScale={0.92}
                endScale={0.92}
                duration={400}
              >
                <div className="relative card-enhanced p-8 flex flex-col items-center text-center hover:translate-y-[-5px]">
                  <div className="bg-accent/10 p-4 rounded-full mb-6 text-accent glassmorphism">
                    {icons[index % icons.length]}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  <RotateTransition 
                    name={`how-number-${index}`}
                    startAngle={5}
                    endAngle={-5}
                    duration={400}
                  >
                    <div className="absolute top-8 right-8 font-bold text-5xl text-accent/10 neon-text opacity-20">
                      {index + 1}
                    </div>
                  </RotateTransition>
                </div>
              </ScaleTransition>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 