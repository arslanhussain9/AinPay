import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Demo uses merchant 'arslan'
  const merchant = await prisma.merchant.findUnique({
    where: { handle: "arslan" },
    include: {
      campaigns: {
        orderBy: { createdAt: "desc" },
      },
      transactions: {
        orderBy: { createdAt: "desc" },
        include: { campaign: true },
      },
      observerDevices: {
        take: 1,
      },
    },
  });

  if (!merchant) {
    notFound();
  }

  // Calculate volume & fees saved (2.36% MDR)
  const verifiedTxns = merchant.transactions.filter((t) => t.status === "VERIFIED");
  const totalVolumePaise = verifiedTxns.reduce((acc, t) => acc + t.amountPaise, 0);
  const feesSavedPaise = Math.round(totalVolumePaise * 0.0236);

  return (
    <DashboardClient
      merchant={merchant}
      campaigns={merchant.campaigns}
      transactions={merchant.transactions}
      observerDevice={merchant.observerDevices[0] || null}
      totalVolumePaise={totalVolumePaise}
      feesSavedPaise={feesSavedPaise}
    />
  );
}
