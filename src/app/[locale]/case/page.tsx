import { allCases, type Case } from ".contentlayer/generated";
import { default as Link } from "@/components/ui/optimized-link";
import Image from "next/image";
import { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { generatePageMetadata, GRADIENTS } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Use Cases | SuperDuperAI",
  description: "Discover how different industries use SuperDuperAI",
  url: "/case",
  meta: {
    pageType: "case",
    category: "Case Studies",
    gradient: GRADIENTS.case,
  },
});

export default async function CasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const sortedCases = allCases
    .filter((c) => c.locale === locale)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-6">Use Cases</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedCases.map((caseItem: Case) => (
              <Link
                href={`/case/${caseItem.slug}`}
                key={`${caseItem.locale}-${caseItem.slug}`}
                className="group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
                title={`${caseItem.title} - Case Study by SuperDuperAI`}
              >
                {caseItem.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={caseItem.image}
                      alt={caseItem.title}
                      title={`${caseItem.title} - Case Study Image`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="text-sm text-primary mb-2 uppercase font-medium">
                    {caseItem.category}
                  </div>
                  <h2 className="text-xl font-bold mb-2">{caseItem.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {caseItem.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
