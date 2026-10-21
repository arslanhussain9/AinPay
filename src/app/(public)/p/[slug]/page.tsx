import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { buildUPIUri } from "@/lib/utils";
import { CustomerPaymentClient } from "./CustomerPaymentClient";

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";

export default async function PaymentLinkCheckoutPage({ params }: PageProps) {
  const paymentLink = await prisma.paymentLink.findFirst({
    where: { slug: params.slug },
    include: {
      freelancer: true,
      payments: {
        where: { status: "APPROVED" },
      },
    },
  });

  if (!paymentLink) {
    notFound();
  }

  const { freelancer } = paymentLink;
  const isClosed =
    paymentLink.status === "CLOSED" ||
    paymentLink.payments.length > 0 ||
    paymentLink.usedSlots >= 1 ||
    (paymentLink.maxSlots !== null && paymentLink.usedSlots >= paymentLink.maxSlots);

  const amountPaise = paymentLink.amountPaise || 100000;

  const note = paymentLink.customerName
    ? `Payment Request for ${paymentLink.customerName}`
    : paymentLink.title;

  const upiUri = buildUPIUri({
    vpa: freelancer.vpa,
    name: freelancer.name,
    amountPaise,
    note,
  });

  return (
    <CustomerPaymentClient
      paymentLink={{
        id: paymentLink.id,
        title: paymentLink.title,
        slug: paymentLink.slug,
        customerName: paymentLink.customerName,
        customerEmail: paymentLink.customerEmail,
        customerPhone: paymentLink.customerPhone,
        amountPaise,
        description: paymentLink.description,
        status: paymentLink.status,
      }}
      merchant={{
        id: freelancer.id,
        name: freelancer.name,
        vpa: freelancer.vpa,
        mobile: freelancer.mobile,
        username: freelancer.username,
      }}
      isClosed={isClosed}
      upiUri={upiUri}
    />
  );
}
