import { default as Link } from "@/components/ui/optimized-link";
import { allCases } from ".contentlayer/generated";
import { useTranslation } from "@/hooks/use-translation";
import { Locale } from "@/config/i18n-config";

export function CaseList({ locale }: { locale: string }) {
  // Получаем только избранные или первые 5 кейсов для текущей локали
  const featuredCases = [...allCases]
    .filter((caseItem) => caseItem.locale === locale)
    .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
    .slice(0, 5);

  const { t } = useTranslation(locale as Locale);
  const viewAll = t("marketing.view_all_cases");
  const caseTitle = t("marketing.ai_case_title");

  return (
    <ul className="space-y-2 text-muted-foreground">
      {featuredCases.map((caseItem) => {
        const href = `/case/${caseItem.slug}`;

        return (
          <li key={`${caseItem.locale}-${caseItem.slug}`}>
            <Link
              href={href}
              className="hover:text-primary transition-colors duration-300"
              title={`${caseItem.title} - ${caseTitle}`}
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
          {viewAll}
        </Link>
      </li>
    </ul>
  );
}
