import React from "react";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AccountClient } from "./AccountClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account Settings — AINPAY",
  description: "Manage your AINPAY merchant profile, verified UPI settlement ID, and account security.",
};

export default async function AccountPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login");
  }

  const freelancer = await prisma.freelancer.findUnique({
    where: { id: sessionUser.id },
  });

  if (!freelancer) {
    redirect("/login");
  }

  return <AccountClient freelancer={freelancer} />;
}
