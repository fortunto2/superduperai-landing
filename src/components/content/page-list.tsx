import { default as Link } from '@/components/ui/optimized-link';
import { allPages } from '.contentlayer/generated';

export async function PageList() {
  // Исключаем определенные страницы, которые уже отображаются отдельно в футере
  const excludedSlugs = ['pricing', 'terms', 'privacy', 'about'];
  
  // Получаем остальные страницы, такие как creators и возможные будущие страницы
  const otherPages = allPages.filter(page => !excludedSlugs.includes(page.slug));

  // Если нет страниц, которые надо отобразить - возвращаем пустой фрагмент
  if (otherPages.length === 0) {
    return <></>;
  }

  return (
    <>
      {otherPages.map((page) => {
        const title = page.title.split(' - ')[0];
        const href = `/${page.slug}`;
        
        return (
          <li key={page.slug}>
            <Link 
              href={href}
              className="hover:text-primary transition-colors duration-300"
              title={`${title} - SuperDuperAI`}
            >
              {title}
            </Link>
          </li>
        );
      })}
    </>
  );
} 