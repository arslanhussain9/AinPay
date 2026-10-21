import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginClient } from "./LoginClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In — AINPAY",
  description: "Sign in to your AINPAY merchant dashboard to manage payment links and approvals.",
};

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return <LoginClient />;
}
