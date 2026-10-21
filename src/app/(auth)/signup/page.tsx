import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { SignupClient } from "./SignupClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create Account — AINPAY",
  description: "Sign up for AINPAY to create direct UPI payment links with 0% platform commission.",
};

export default async function SignupPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return <SignupClient />;
}
