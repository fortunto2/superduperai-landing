import { default as Link } from "@/components/ui/optimized-link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "View Transitions API Test - SuperDuperAI",
  description: "Тестовая страница для демонстрации работы View Transitions API в Next.js с помощью next-view-transitions",
};

export default function TransitionTestPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex items-center justify-between mb-12 border-b pb-6">
        <div className="flex items-center gap-3 view-transition-logo">
          <Logo className="h-12 w-12" />
          <span className="text-2xl font-bold"><span className="text-accent">Super</span>DuperAI</span>
        </div>
        
        <Button asChild className="view-transition-card" variant="outline">
          <Link href="/" prefetch={true}>Вернуться на главную</Link>
        </Button>
      </div>
      
      <h1 className="text-5xl font-bold mb-8 view-transition-hero">
        Демонстрация <span className="neon-text">View Transitions</span>
      </h1>
      
      <p className="text-xl text-muted-foreground mb-12 view-transition-fade">
        Эта страница демонстрирует работу View Transitions API. Обрати внимание, как элементы 
        плавно &ldquo;перетекают&rdquo; при переходе между страницами. Элементы с одинаковыми классами 
        view-transition-* на разных страницах будут анимированно трансформироваться.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[1, 2, 3].map((item) => (
          <div 
            key={item} 
            className={`p-6 rounded-lg card-enhanced hover:scale-105 transition-transform duration-300 view-transition-card-${item}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
                {item}
              </div>
              <h2 className="text-2xl font-semibold">Карточка {item}</h2>
            </div>
            <p className="text-muted-foreground">
              Эта карточка имеет уникальное view-transition-name, которое сохраняется при переходах между страницами.
              Попробуй перейти на главную и обратно несколько раз.
            </p>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row gap-12 mb-12">
        <div className="flex-1">
          <div className="p-8 rounded-lg glassmorphism gradient-border view-transition-fade">
            <h2 className="text-2xl font-semibold mb-4">Как это работает?</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Элементы с одинаковым view-transition-name анимируются между страницами</li>
              <li>• Поддерживается трансформация размера, позиции и свойств</li>
              <li>• Работает только при навигации через Link из next-view-transitions</li>
              <li>• Для разных элементов можно задать разную длительность и тип анимации</li>
            </ul>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="p-8 rounded-lg bg-card border view-transition-hero">
            <h2 className="text-2xl font-semibold mb-4 neon-text">Заголовок с эффектом</h2>
            <p className="text-muted-foreground">
              Элемент с классом view-transition-hero будет анимированно преобразовываться 
              в другой элемент с этим же классом на других страницах.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <Button asChild className="view-transition-card">
          <Link href="/" prefetch={true}>Главная</Link>
        </Button>
        <Button asChild className="view-transition-card-1" variant="outline">
          <Link href="/about" prefetch={true}>О нас</Link>
        </Button>
        <Button asChild className="view-transition-card-2" variant="outline">
          <Link href="/pricing" prefetch={true}>Цены</Link>
        </Button>
      </div>
    </div>
  );
} 