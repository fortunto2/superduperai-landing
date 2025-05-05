"use client"

import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { LucideIcon } from "lucide-react";
import { TransitionCard } from "@/components/ui/view-transition";

// Animation for container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.15
    }
  }
};

// Animation for individual items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

interface FeaturesProps {
  items?: FeatureItem[];
}

export function Features({ items }: FeaturesProps) {
  // Fallback default features if no items are provided
  const features = items || [
    {
      icon: "users",
      title: "Custom Characters with AI Memory",
      description: "Your AI actor database using LoRA technology. Create and save unique characters for your videos."
    },
    {
      icon: "image",
      title: "Cinematic Camera Controls",
      description: "Pans, zooms, bullet-time — without physical cameras. Add professional camera movements with one click."
    },
    {
      icon: "settings",
      title: "Multi-Agent AI Workflow",
      description: "A model where each agent does its job. Specialized AI for scripting, filming, editing, and sound."
    },
    {
      icon: "speed",
      title: "Fast & Efficient",
      description: "Idea → video in minutes, not hours or days. Speed up your workflow and create more content."
    },
    {
      icon: "chart",
      title: "Cost Saving",
      description: "Cinematography on a budget. Get professional video without spending on crew and equipment."
    },
    {
      icon: "edit",
      title: "Easy Editing & Integration",
      description: "Storyboard, drag-drop, export to TikTok / YouTube. Intuitive interface for quick finalization of your video."
    },
  ];

  return (
    <section className="py-24 bg-muted/30 gradient-section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            What Makes SuperDuperAI <span className="neon-text">Super</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced features and technologies for creating stunning videos
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
            const IconComponent = feature.icon ? (Icons as Record<string, LucideIcon>)[feature.icon] : UserCircle;
            
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
              >
                <TransitionCard className="flex flex-col card-enhanced p-6 hover:translate-y-[-5px]">
                  <div className="p-3 rounded-full bg-accent/10 text-accent w-fit mb-4 glassmorphism">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </TransitionCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
} 