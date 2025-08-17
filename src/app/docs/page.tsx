import DocsPage from "@/app/[locale]/docs/page";

// English wrapper so `/docs` exports without locale param
export const dynamic = "force-static";
export const revalidate = false;

export default function Page() {
  // Delegate to existing component with locale='en'
  return <DocsPage params={Promise.resolve({ locale: "en" })} />;
}