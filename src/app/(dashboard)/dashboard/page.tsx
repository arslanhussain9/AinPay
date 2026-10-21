import React from "react";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login");
  }

  // Fetch authenticated freelancer's data
  const freelancer = await prisma.freelancer.findUnique({
    where: { id: sessionUser.id },
    include: {
      paymentLinks: {
        orderBy: { createdAt: "desc" },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        include: { paymentLink: true },
      },
    },
  });

  if (!freelancer) {
    redirect("/login");
  }

  // Calculate volume & fees saved (2.36% standard PG fee)
  const approvedPayments = freelancer.payments.filter((p) => p.status === "APPROVED");
  const totalEarningsPaise = approvedPayments.reduce((acc, p) => acc + p.amountPaise, 0);
  const feesSavedPaise = Math.round(totalEarningsPaise * 0.0236);

  return (
    <DashboardClient
      freelancer={freelancer}
      paymentLinks={freelancer.paymentLinks}
      payments={freelancer.payments}
      totalEarningsPaise={totalEarningsPaise}
      feesSavedPaise={feesSavedPaise}
    />
  );
}
