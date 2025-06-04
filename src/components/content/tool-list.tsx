import { default as Link } from "@/components/ui/optimized-link";
import { allTools } from ".contentlayer/generated";
import { useTranslation } from "@/hooks/use-translation";
import type { Locale } from "@/config/i18n-config";

export function ToolList({ locale }: { locale: string }) {
  // Получаем только избранные или первые 5 инструментов для текущей локали
  const featuredTools = [...allTools]
    .filter((tool) => tool.locale === locale)
    .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
    .slice(0, 5);

  const { t } = useTranslation(locale as Locale);
  const viewAll = t("marketing.view_all_tools");

  return (
    <ul className="space-y-2 text-muted-foreground">
      {featuredTools.map((tool) => {
        const href = `/tool/${tool.slug}`;

        return (
          <li key={`${tool.locale}-${tool.slug}`}>
            <Link
              href={href}
              className="hover:text-primary transition-colors duration-300"
              title={`${tool.title} - ${t("marketing.ai_tool_title")}`}
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
          title={viewAll}
        >
          {viewAll}
        </Link>
      </li>
    </ul>
  );
}
