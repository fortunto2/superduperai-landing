import { Metadata } from "next";
import { allPages } from ".contentlayer/generated";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/content/mdx-components";
import { PageWrapper } from "@/components/content/page-wrapper";

export async function generateMetadata(): Promise<Metadata> {
  const page = allPages.find((page) => page.slug === "creators");
  
  if (!page) {
    return {
      title: "Creative Partnership Program - Not Found",
      description: "The requested page was not found."
    };
  }
  
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.description,
    keywords: page.seo?.keywords || [],
  };
}

export default function CreatorsPage() {
  const page = allPages.find((page) => page.slug === "creators");
  
  if (!page) {
    notFound();
  }
  
  return (
    <PageWrapper 
      title={page.title} 
      breadcrumbItems={[{ label: "Creative Partnership", href: "/creators" }]}
    >
      <MDXContent code={page.body.code} />
    </PageWrapper>
  );
} 