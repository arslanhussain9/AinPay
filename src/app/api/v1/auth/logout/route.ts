import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}

export async function GET() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}
