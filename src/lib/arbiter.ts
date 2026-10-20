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

    // 2. If attached to a link with slot limit, increment usage and check if full
    if (payment.paymentLinkId && payment.paymentLink) {
      const link = payment.paymentLink;
      const newUsedSlots = link.usedSlots + 1;
      const shouldClose = link.maxSlots !== null && newUsedSlots >= link.maxSlots;

      await tx.paymentLink.update({
        where: { id: link.id },
        data: {
          usedSlots: newUsedSlots,
          status: shouldClose ? "CLOSED" : link.status,
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
