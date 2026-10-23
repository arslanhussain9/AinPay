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

  const approvedPayment = paymentLink.payments[0]
    ? {
        id: paymentLink.payments[0].id,
        amountPaise: paymentLink.payments[0].amountPaise,
        utrNumber: paymentLink.payments[0].utrNumber,
        payerName: paymentLink.payments[0].payerName,
        payerEmail: paymentLink.payments[0].payerEmail,
        payerPhone: paymentLink.payments[0].payerPhone,
        approvedAt: paymentLink.payments[0].approvedAt?.toISOString() || null,
        createdAt: paymentLink.payments[0].createdAt.toISOString(),
        merchantName: freelancer.name,
        merchantUsername: freelancer.username,
        merchantVpa: freelancer.vpa,
        invoiceTitle: paymentLink.title,
      }
    : null;

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
      isClosed={isClosed && !approvedPayment}
      initialApprovedPayment={approvedPayment}
      upiUri={upiUri}
    />
  );
}
