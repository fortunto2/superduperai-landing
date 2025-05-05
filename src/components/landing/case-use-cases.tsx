"use client"

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { default as Link } from "@/components/ui/optimized-link";
import { Icons } from "@/components/ui/icons";
import { LucideIcon } from "lucide-react";
import { allCases } from '.contentlayer/generated';

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

// Тип для автоматически определяемых категорий
interface CategoryInfo {
  title: string;
  icon: string;
  count: number;
  latestDate: Date;
  hasFeatured: boolean;
}

export function CaseUseCases() {
  // Автоматическое определение категорий на основе данных кейсов
  const categoriesMap = new Map<string, CategoryInfo>();
  
  // Собираем информацию о категориях
  allCases.forEach((caseItem) => {
    if (!categoriesMap.has(caseItem.category)) {
      categoriesMap.set(caseItem.category, {
        title: getCategoryTitle(caseItem.category),
        icon: getCategoryIcon(caseItem.category),
        count: 1,
        latestDate: new Date(caseItem.date),
        hasFeatured: caseItem.featured || false
      });
    } else {
      const info = categoriesMap.get(caseItem.category)!;
      info.count += 1;
      const caseDate = new Date(caseItem.date);
      if (caseDate > info.latestDate) {
        info.latestDate = caseDate;
      }
      if (caseItem.featured) {
        info.hasFeatured = true;
      }
    }
  });
  
  // Сортируем категории по приоритету: featured > count > latestDate
  const sortedCategories = Array.from(categoriesMap.entries())
    .sort(([, a], [, b]) => {
      if (a.hasFeatured !== b.hasFeatured) return a.hasFeatured ? -1 : 1;
      if (a.count !== b.count) return b.count - a.count;
      return b.latestDate.getTime() - a.latestDate.getTime();
    })
    .slice(0, 4); // Берем топ-4 категории
  
  // Находим лучший кейс для каждой категории (featured или самый новый)
  const useCases = sortedCategories.map(([category, info]) => {
    const casesInCategory = allCases
      .filter(c => c.category === category)
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    
    const bestCase = casesInCategory[0];
    
    return {
      title: info.title,
      description: bestCase.description,
      icon: info.icon,
      url: `/case/${bestCase.slug}`
    };
  });

  return (
    <section className="py-24 animated-bg view-transition-fade">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 view-transition-hero">
            Made for <span className="neon-text">Creators</span>, Businesses, Musicians & Teams
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto view-transition-fade">
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
            const IconComponent = (Icons as Record<string, LucideIcon>)[item.icon] || 
              (Icons as Record<string, LucideIcon>)["sparkles"];
            
            return (
              <motion.div key={index} variants={cardVariants}>
                <Link href={item.url}>
                  <Card className={`h-full transition-all hover:shadow-lg card-enhanced hover:translate-y-[-5px] view-transition-card-${index + 1}`}>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-md bg-accent/10 text-accent glassmorphism view-transition-logo">
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

// Функция для получения читаемого заголовка из категории
function getCategoryTitle(category: string): string {
  const categoryMap: Record<string, string> = {
    'ai-video': 'Content Creators',
    'business': 'Small Businesses',
    'creative': 'Musicians & Artists',
    'teams': 'Agencies & Teams',
    'education': 'Educators',
    'marketing': 'Marketing Teams',
    'entertainment': 'Entertainment',
    'social-media': 'Social Media',
    'e-commerce': 'E-Commerce'
  };
  
  // Ищем наиболее подходящий ключ
  for (const key of Object.keys(categoryMap)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return categoryMap[key];
    }
  }
  
  // Если не нашли, возвращаем отформатированную категорию
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Функция для получения подходящей иконки из категории
function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    'ai-video': 'video',
    'business': 'store',
    'creative': 'palette',
    'teams': 'users',
    'education': 'book',
    'marketing': 'chartBar',
    'entertainment': 'tv',
    'social-media': 'share',
    'e-commerce': 'shoppingCart'
  };
  
  // Ищем наиболее подходящий ключ
  for (const key of Object.keys(iconMap)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return iconMap[key];
    }
  }
  
  // Если не нашли, используем стандартную иконку
  return 'sparkles';
} 