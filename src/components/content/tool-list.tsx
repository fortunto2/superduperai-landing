import { default as Link } from '@/components/ui/optimized-link';
import { allTools } from '.contentlayer/generated';

export async function ToolList() {
  // Получаем только избранные или первые 5 инструментов
  const featuredTools = [...allTools]
    .sort((a, b) => a.featured === b.featured ? 0 : a.featured ? -1 : 1)
    .slice(0, 5);

  return (
    <ul className="space-y-2 text-muted-foreground">
      {featuredTools.map((tool) => {
        const href = `/tool/${tool.slug}`;
        
        return (
          <li key={tool.slug}>
            <Link 
              href={href}
              className="hover:text-primary transition-colors duration-300"
            >
              {tool.title}
            </Link>
          </li>
        );
      })}
      <li>
        <Link 
          href="/tool"
          className="text-primary font-medium hover:text-primary/80 transition-colors duration-300"
        >
          View All Tools →
        </Link>
      </li>
    </ul>
  );
} 