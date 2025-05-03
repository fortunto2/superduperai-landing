"use client"

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Store, Music, Users } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { LucideIcon } from "lucide-react";

// Animation for container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2
    }
  }
};

// Animation for individual cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

interface UseCase {
  title: string;
  description: string;
  icon?: string;
}

interface UseCasesProps {
  items?: UseCase[];
}

export function UseCases({ items }: UseCasesProps) {
  // Default cases if none are provided
  const cases = items || [
    {
      icon: "star",
      title: "Creators & Influencers",
      description: "Create more content, grow, and earn. Make unique videos faster and more frequently.",
    },
    {
      icon: "chart",
      title: "Small Businesses",
      description: "Video advertising without agencies. Presentations, promos, and training videos without extra costs.",
    },
    {
      icon: "layers",
      title: "Musicians & Artists",
      description: "Music videos and visuals that match your track's vibe. Turn your music into visual art.",
    },
    {
      icon: "users",
      title: "Agencies & Teams",
      description: "Rapid prototyping, collaborative work. Speed up the video creation process for clients.",
    },
  ];

  // Default icons for fallback
  const defaultIcons = [Play, Store, Music, Users];

  return (
    <section className="py-24 animated-bg">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            Made for <span className="neon-text">Creators</span>, Businesses, Musicians & Teams
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect use case for SuperDuperAI to meet your needs.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cases.map((item, index) => {
            // Use the icon from contentlayer if available, otherwise fall back to default icons
            let IconComponent;
            if (item.icon) {
              IconComponent = (Icons as Record<string, LucideIcon>)[item.icon] || defaultIcons[index % defaultIcons.length];
            } else {
              IconComponent = defaultIcons[index % defaultIcons.length];
            }
            
            return (
              <motion.div key={index} variants={cardVariants}>
                <Card className="h-full transition-all hover:shadow-lg card-enhanced hover:translate-y-[-5px]">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-md bg-accent/10 text-accent glassmorphism">
                        <IconComponent className="h-8 w-8" />
                      </div>
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
} 