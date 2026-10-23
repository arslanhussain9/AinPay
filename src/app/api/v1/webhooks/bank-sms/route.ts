import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { approvePayment } from "@/lib/arbiter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, amountPaise, utr, freelancerVpa, freelancerId, senderName, rawSms } = body;

    // Normalize amount to paise
    let targetAmountPaise: number | null = null;
    if (typeof amountPaise === "number" && amountPaise > 0) {
      targetAmountPaise = Math.round(amountPaise);
    } else if (typeof amount === "number" && amount > 0) {
      targetAmountPaise = Math.round(amount * 100);
    } else if (typeof amount === "string" && !isNaN(parseFloat(amount))) {
      targetAmountPaise = Math.round(parseFloat(amount) * 100);
    }

    const cleanUtr = typeof utr === "string" ? utr.trim().replace(/\D/g, "") : null;

    if (!targetAmountPaise || targetAmountPaise <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid amount is required" },
        { status: 400 }
      );
    }

    // 1. Try to match an existing PENDING payment by UTR
    if (cleanUtr && cleanUtr.length === 12) {
      const existingPayment = await prisma.payment.findFirst({
        where: {
          utrNumber: cleanUtr,
          status: "PENDING",
        },
      });

      if (existingPayment) {
        const approved = await approvePayment(existingPayment.id);
        return NextResponse.json({
          success: true,
          matchedBy: "UTR_MATCH",
          paymentId: approved.id,
          message: "Payment successfully auto-verified via UTR match",
        });
      }
    }

    // 2. Try to match recent PENDING payment by amount (within last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const pendingPayment = await prisma.payment.findFirst({
      where: {
        amountPaise: targetAmountPaise,
        status: "PENDING",
        createdAt: { gte: thirtyMinutesAgo },
        ...(freelancerId ? { freelancerId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    if (pendingPayment) {
      // If UTR was supplied in SMS, update the record
      if (cleanUtr && cleanUtr.length === 12) {
        await prisma.payment.update({
          where: { id: pendingPayment.id },
          data: { utrNumber: cleanUtr },
        });
      }

      const approved = await approvePayment(pendingPayment.id);
      return NextResponse.json({
        success: true,
        matchedBy: "AMOUNT_AND_TIMESTAMP_MATCH",
        paymentId: approved.id,
        message: "Payment successfully auto-verified via Amount + Time window",
      });
    }

    // 3. Try to match an open single-use PaymentLink with matching amount
    let matchedLink = null;
    if (freelancerVpa || freelancerId) {
      matchedLink = await prisma.paymentLink.findFirst({
        where: {
          amountPaise: targetAmountPaise,
          status: "ACTIVE",
          usedSlots: 0,
          freelancer: freelancerVpa
            ? { vpa: freelancerVpa.trim().toLowerCase() }
            : { id: freelancerId },
        },
        orderBy: { updatedAt: "desc" },
      });
    }

    if (matchedLink) {
      // Create and auto-approve payment record
      const generatedUtr = cleanUtr && cleanUtr.length === 12 ? cleanUtr : `AUTO_${Date.now().toString().slice(-8)}`;
      const newPayment = await prisma.payment.create({
        data: {
          freelancerId: matchedLink.freelancerId,
          paymentLinkId: matchedLink.id,
          payerName: senderName?.trim() || matchedLink.customerName || "UPI Customer",
          payerEmail: matchedLink.customerEmail || null,
          payerPhone: matchedLink.customerPhone || null,
          amountPaise: targetAmountPaise,
          utrNumber: generatedUtr,
          note: matchedLink.title,
          status: "PENDING",
        },
      });

      const approved = await approvePayment(newPayment.id);
      return NextResponse.json({
        success: true,
        matchedBy: "ACTIVE_INVOICE_AUTO_SETTLE",
        paymentId: approved.id,
        message: "Payment successfully created and auto-verified for active invoice",
      });
    }

    return NextResponse.json({
      success: false,
      error: "No pending payment or active invoice found matching the amount and timeframe",
    }, { status: 404 });
  } catch (error: any) {
    console.error("Bank SMS webhook error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process bank webhook" },
      { status: 500 }
    );
  }
}
