import { NextResponse } from "next/server";

/**
 * API маршрут, который перенаправляет на статический файл llms.txt
 * GET /api/llms
 */
export async function GET() {
  // Перенаправляем на статический файл
  return NextResponse.redirect(
    new URL(
      "/llms.txt",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    )
  );
}
