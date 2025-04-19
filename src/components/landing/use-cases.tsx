"use client"

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Store, Music, Users } from "lucide-react";

// Анимация для контейнера
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2
    }
  }
};

// Анимация для отдельных карточек
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
      description: "Делай больше контента, расти, зарабатывай. Создавай уникальные видео быстрее и чаще.",
    },
    {
      icon: <Store className="h-8 w-8" />,
      title: "Small Businesses",
      description: "Видео-реклама без агентств. Презентации, промо и обучающие видео без лишних затрат.",
    },
    {
      icon: <Music className="h-8 w-8" />,
      title: "Musicians & Artists",
      description: "Клипы и визуал по вайбу трека. Преврати свою музыку в визуальное искусство.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Agencies & Teams",
      description: "Быстрый прототипинг, совместная работа. Ускорь процесс создания видео для клиентов.",
    },
  ];

  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            Made for Creators, Businesses, Musicians & Teams
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Найдите идеальный вариант использования SuperDuperAI для ваших задач.
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
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
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