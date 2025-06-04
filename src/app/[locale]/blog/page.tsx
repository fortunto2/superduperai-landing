import { allBlogs, type Blog } from ".contentlayer/generated";
import { default as Link } from "@/components/ui/optimized-link";
import { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { generatePageMetadata, GRADIENTS } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog | SuperDuperAI",
  description: "Learn about the latest AI models and updates",
  url: "/blog",
  meta: {
    pageType: "blog",
    category: "Blog",
    gradient: GRADIENTS.tool,
  },
});

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const sortedBlogs = allBlogs
    .filter((p) => p.locale === locale)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-6">Blog</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBlogs.map((post: Blog) => (
              <Link
                href={post.url}
                key={`${post.locale}-${post.slug}`}
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
