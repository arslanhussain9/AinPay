import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FreelancerPageClient } from "./FreelancerPageClient";

interface PageProps {
  params: {
    handle: string;
  };
}

export const dynamic = "force-dynamic";

export default async function FreelancerProfilePage({ params }: PageProps) {
  const freelancer = await prisma.freelancer.findUnique({
    where: { username: params.handle },
  });

  if (!freelancer) {
    notFound();
  }

  return <FreelancerPageClient freelancer={freelancer} />;
}
