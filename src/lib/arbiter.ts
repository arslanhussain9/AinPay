import prisma from "./prisma";

export async function approvePayment(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { paymentLink: true },
  });

  if (!payment) {
    throw new Error("Payment record not found");
  }

  if (payment.status === "APPROVED") {
    return payment;
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Mark payment as APPROVED
    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });

    // 2. Single-use payment links: close link upon payment approval
    if (payment.paymentLinkId) {
      await tx.paymentLink.update({
        where: { id: payment.paymentLinkId },
        data: {
          usedSlots: { increment: 1 },
          status: "CLOSED",
        },
      });
    }

    return updatedPayment;
  });
}

export async function declinePayment(paymentId: string) {
  return await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "DECLINED" },
  });
}
