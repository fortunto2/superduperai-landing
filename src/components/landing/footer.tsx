import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted/30 py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="mb-8 md:mb-0">
            <div className="font-bold text-2xl mb-4">SuperDuperAI</div>
            <p className="text-muted-foreground max-w-md">
              Платформа для генерации видео с использованием искусственного интеллекта. 
              Превращайте идеи в кинематографичные ролики.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Продукт</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Функции</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Цены</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Ресурсы</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Блог</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Документация</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Сообщество</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Компания</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">О нас</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Карьера</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Контакты</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            &copy; {currentYear} SuperDuperAI. Все права защищены.
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Условия использования</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Конфиденциальность</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 