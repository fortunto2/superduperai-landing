export default function RootPage() {
  // Эта страница никогда не будет рендериться напрямую
  // Middleware перехватит запрос и сделает rewrite на /[locale]/
  return null;
}

export const dynamic = "force-dynamic";
