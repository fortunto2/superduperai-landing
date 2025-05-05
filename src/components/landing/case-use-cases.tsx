"use client"

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Store, Music, Users } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { LucideIcon } from "lucide-react";
import { allCases, type Case } from '.contentlayer/generated';
import { default as Link } from "@/components/ui/optimized-link";

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

// Маппинг категорий на более понятные заголовки и иконки
const categoryMappings: Record<string, { title: string, icon: string }> = {
  'ai-video': { title: 'Content Creators', icon: 'video' },
  'business': { title: 'Small Businesses', icon: 'store' },
  'creative': { title: 'Musicians & Artists', icon: 'music' },
  'teams': { title: 'Agencies & Teams', icon: 'users' },
  'education': { title: 'Educators', icon: 'book' },
  'marketing': { title: 'Marketing Teams', icon: 'chart' }
};

// Получение маппинга для категории
function getCategoryMapping(category: string) {
  const key = Object.keys(categoryMappings).find(k => category.includes(k));
  return key ? categoryMappings[key] : { title: category, icon: 'star' };
}

export function CaseUseCases() {
  // Сортируем и фильтруем кейсы
  const sortedCases = [...allCases]
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Получаем уникальные категории, предпочитая featured кейсы
  const categories = new Set<string>();
  const priorityCases: Case[] = [];
  
  // Сначала добавляем featured кейсы
  for (const caseItem of sortedCases) {
    if (caseItem.featured && !categories.has(caseItem.category)) {
      categories.add(caseItem.category);
      priorityCases.push(caseItem);
      if (priorityCases.length >= 4) break;
    }
  }
  
  // Если не хватает, добавляем обычные кейсы с новыми категориями
  if (priorityCases.length < 4) {
    for (const caseItem of sortedCases) {
      if (!categories.has(caseItem.category)) {
        categories.add(caseItem.category);
        priorityCases.push(caseItem);
        if (priorityCases.length >= 4) break;
      }
    }
  }
  
  // Если всё ещё не хватает, добавим оставшиеся кейсы
  const cases = priorityCases.length < 4 
    ? [...priorityCases, ...sortedCases.filter(c => !priorityCases.includes(c))].slice(0, 4)
    : priorityCases;

  // Преобразуем кейсы в формат для UI
  const useCases = cases.map(caseItem => {
    const mapping = getCategoryMapping(caseItem.category);
    
    return {
      title: mapping.title,
      description: caseItem.description,
      icon: mapping.icon,
      url: caseItem.url
    };
  });

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
          {useCases.map((item, index) => {
            // Use the icon from contentlayer if available, otherwise fall back to default icons
            let IconComponent;
            if (item.icon) {
              IconComponent = (Icons as Record<string, LucideIcon>)[item.icon] || defaultIcons[index % defaultIcons.length];
            } else {
              IconComponent = defaultIcons[index % defaultIcons.length];
            }
            
            return (
              <motion.div key={index} variants={cardVariants}>
                <Link href={item.url}>
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
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
} 