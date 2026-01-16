import DocPage from "@/app/[locale]/docs/[slug]/page";

interface WrapperProps {
  params: Promise<{ slug: string }>;
}

// English wrapper so `/docs/[slug]` exports without locale param
export const dynamic = "force-static";
export const revalidate = false;

export default async function Page({ params }: WrapperProps) {
  const { slug } = await params;
  return (
    <DocPage params={Promise.resolve({ locale: "en", slug })} />
  );
}