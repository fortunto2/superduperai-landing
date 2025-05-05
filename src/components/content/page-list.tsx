import { default as Link } from '@/components/ui/optimized-link';
import { allPages } from '.contentlayer/generated';

export async function PageList() {
  // Исключаем определенные страницы, которые уже отображаются отдельно в футере
  const excludedSlugs = ['pricing', 'terms', 'privacy', 'about'];
  
  // Получаем остальные страницы, такие как creators и возможные будущие страницы
  const otherPages = allPages.filter(page => !excludedSlugs.includes(page.slug));

  // Если нет страниц, которые надо отобразить - возвращаем null
  if (otherPages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">More</h3>
      <ul className="space-y-2 text-muted-foreground">
        {otherPages.map((page) => {
          const title = page.title.split(' - ')[0];
          const href = `/${page.slug}`;
          
          return (
            <li key={page.slug}>
              <Link 
                href={href}
                className="hover:text-primary transition-colors duration-300"
              >
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 