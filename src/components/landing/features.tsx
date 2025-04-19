"use client"

import { motion } from "framer-motion";
import { UserCircle, Camera, Cpu, Zap, DollarSign, FileVideo } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function Features() {
  const features = [
    {
      icon: <UserCircle className="h-8 w-8" />,
      title: "Custom Characters with AI Memory",
      description: "Твоя AI-актерская база с помощью технологии LoRA. Создавайте и сохраняйте уникальных персонажей для ваших видео."
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Cinematic Camera Controls",
      description: "Панорамы, зумы, буллет-тайм — без физической камеры. Добавляйте профессиональные движения камеры одним кликом."
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Multi-Agent AI Workflow",
      description: "Модель, где каждый агент делает своё дело. Специализированные AI для сценария, съемки, монтажа и звука."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Fast & Efficient",
      description: "Идея → видео за минуты, не часы или дни. Ускорьте рабочий процесс и создавайте больше контента."
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Cost Saving",
      description: "Кинематограф за копейки. Получите профессиональное видео без затрат на съемочную команду и оборудование."
    },
    {
      icon: <FileVideo className="h-8 w-8" />,
      title: "Easy Editing & Integration",
      description: "Сториборд, drag-drop, экспорт в TikTok / YouTube. Интуитивный интерфейс для быстрой финализации вашего видео."
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            What Makes SuperDuperAI Super
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Передовые возможности и технологии для создания впечатляющих видео
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="flex flex-col bg-background p-6 rounded-lg shadow-sm"
              variants={itemVariants}
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 