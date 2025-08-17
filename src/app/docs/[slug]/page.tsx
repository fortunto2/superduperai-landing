import DocPage from "@/app/[locale]/docs/[slug]/page";

interface WrapperProps {
  params: { slug: string };
}

// English wrapper so `/docs/[slug]` exports without locale param
export const dynamic = "force-static";
export const revalidate = false;

export default function Page({ params }: WrapperProps) {
  return (
    <DocPage params={Promise.resolve({ locale: "en", slug: params.slug })} />
  );
}