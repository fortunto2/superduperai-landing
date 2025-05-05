import { default as Link } from '@/components/ui/optimized-link';
import { allCases } from '.contentlayer/generated';

export async function CaseList() {
  // Получаем только избранные или первые 5 кейсов
  const featuredCases = [...allCases]
    .sort((a, b) => a.featured === b.featured ? 0 : a.featured ? -1 : 1)
    .slice(0, 5);

  return (
    <ul className="space-y-2 text-muted-foreground">
      {featuredCases.map((caseItem) => (
        <li key={caseItem.slug}>
          <Link 
            href={`/case/${caseItem.slug}`}
            className="hover:text-primary transition-colors duration-300"
          >
            {caseItem.title}
          </Link>
        </li>
      ))}
      <li>
        <Link 
          href="/case"
          className="text-primary font-medium hover:text-primary/80 transition-colors duration-300"
        >
          View All Use Cases →
        </Link>
      </li>
    </ul>
  );
} 