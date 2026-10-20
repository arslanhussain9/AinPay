import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Demo uses freelancer 'arslan'
  const freelancer = await prisma.freelancer.findUnique({
    where: { username: "arslan" },
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
    notFound();
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
