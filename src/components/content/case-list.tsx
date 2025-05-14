import { default as Link } from "@/components/ui/optimized-link";
import { allCases } from ".contentlayer/generated";

export async function CaseList() {
  // Получаем только избранные или первые 5 кейсов
  const featuredCases = [...allCases]
    .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
    .slice(0, 5);

  return (
    <ul className="space-y-2 text-muted-foreground">
      {featuredCases.map((caseItem) => {
        const href = `/case/${caseItem.slug}`;

        return (
          <li key={`${caseItem.locale}-${caseItem.slug}`}>
            <Link
              href={href}
              className="hover:text-primary transition-colors duration-300"
              title={`${caseItem.title} - Case Study by SuperDuperAI`}
            >
              {caseItem.title}
            </Link>
          </li>
        );
      })}
      <li>
        <Link
          href="/case"
          className="text-primary font-medium hover:text-primary/80 transition-colors duration-300"
          title="View all SuperDuperAI use cases and case studies"
        >
          View All Use Cases →
        </Link>
      </li>
    </ul>
  );
}
