import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("paymentId");
    const paymentLinkId = searchParams.get("paymentLinkId");

    if (!paymentId && !paymentLinkId) {
      return NextResponse.json(
        { success: false, error: "Either paymentId or paymentLinkId is required" },
        { status: 400 }
      );
    }

    let payment = null;

    if (paymentId) {
      payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          freelancer: {
            select: {
              name: true,
              username: true,
              vpa: true,
            },
          },
          paymentLink: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      });
    } else if (paymentLinkId) {
      // Look for the latest payment for this link, prioritizing APPROVED first
      payment = await prisma.payment.findFirst({
        where: {
          paymentLinkId,
          status: "APPROVED",
        },
        include: {
          freelancer: {
            select: {
              name: true,
              username: true,
              vpa: true,
            },
          },
          paymentLink: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      // If no approved payment yet, check for pending payment
      if (!payment) {
        payment = await prisma.payment.findFirst({
          where: { paymentLinkId },
          include: {
            freelancer: {
              select: {
                name: true,
                username: true,
                vpa: true,
              },
            },
            paymentLink: {
              select: {
                title: true,
                slug: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      }
    }

    if (!payment) {
      return NextResponse.json({
        success: true,
        status: "NONE",
        message: "No payment record found yet",
      });
    }

    return NextResponse.json({
      success: true,
      status: payment.status,
      payment: {
        id: payment.id,
        receiptNumber: `REC-${payment.id.slice(-8).toUpperCase()}`,
        amountPaise: payment.amountPaise,
        utrNumber: payment.utrNumber,
        payerName: payment.payerName,
        payerEmail: payment.payerEmail,
        payerPhone: payment.payerPhone,
        note: payment.note,
        status: payment.status,
        approvedAt: payment.approvedAt,
        createdAt: payment.createdAt,
        merchantName: payment.freelancer.name,
        merchantUsername: payment.freelancer.username,
        merchantVpa: payment.freelancer.vpa,
        invoiceTitle: payment.paymentLink?.title || null,
      },
    });
  } catch (error: any) {
    console.error("Payment status check error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to check status" },
      { status: 500 }
    );
  }
}
