"use client"

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Store, Music, Users } from "lucide-react";

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

export function UseCases() {
  const cases = [
    {
      icon: <Play className="h-8 w-8" />,
      title: "Creators & Influencers",
      description: "Create more content, grow, and earn. Make unique videos faster and more frequently.",
    },
    {
      icon: <Store className="h-8 w-8" />,
      title: "Small Businesses",
      description: "Video advertising without agencies. Presentations, promos, and training videos without extra costs.",
    },
    {
      icon: <Music className="h-8 w-8" />,
      title: "Musicians & Artists",
      description: "Music videos and visuals that match your track's vibe. Turn your music into visual art.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Agencies & Teams",
      description: "Rapid prototyping, collaborative work. Speed up the video creation process for clients.",
    },
  ];

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
          {cases.map((item, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="h-full transition-all hover:shadow-lg card-enhanced hover:translate-y-[-5px]">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-md bg-accent/10 text-accent glassmorphism">
                      {item.icon}
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
          ))}
        </motion.div>
      </div>
    </section>
  );
} 