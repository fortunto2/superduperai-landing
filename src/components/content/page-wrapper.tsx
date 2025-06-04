import { ReactNode } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

interface PageWrapperProps {
  children: ReactNode;
  title: string;
  breadcrumbItems: {
    label: string;
    href: string;
  }[];
  hasH1Heading?: boolean;
  locale: string;
}

export function PageWrapper({
  children,
  title,
  breadcrumbItems,
  hasH1Heading = false,
  locale,
}: PageWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container py-12">
        <Breadcrumbs
          items={breadcrumbItems}
          className="mb-8"
        />

        {!hasH1Heading && <h1 className="text-4xl font-bold mb-8">{title}</h1>}

        <div
          className={`prose prose-invert max-w-none w-full ${hasH1Heading ? "mt-0" : "mt-6"}`}
        >
          {children}
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
