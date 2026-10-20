import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateUTR } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { freelancerId, paymentLinkId, payerName, payerEmail, payerPhone, amountPaise, utr, note } = body;

    if (!freelancerId) {
      return NextResponse.json(
        { success: false, error: "Freelancer ID is required" },
        { status: 400 }
      );
    }

    if (!payerName || payerName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Payer name is required" },
        { status: 400 }
      );
    }

    if (!utr || !validateUTR(utr)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 12-digit numeric UPI Reference / UTR number." },
        { status: 400 }
      );
    }

    if (!amountPaise || amountPaise <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid payment amount is required" },
        { status: 400 }
      );
    }

    // Check duplicate UTR
    const existing = await prisma.payment.findFirst({
      where: { utrNumber: utr.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `UTR ${utr} has already been submitted previously.` },
        { status: 409 }
      );
    }

    // Create Payment Record (Pending freelancer approval)
    const payment = await prisma.payment.create({
      data: {
        freelancerId,
        paymentLinkId: paymentLinkId || null,
        payerName: payerName.trim(),
        payerEmail: payerEmail?.trim() || null,
        payerPhone: payerPhone?.trim() || null,
        amountPaise,
        utrNumber: utr.trim(),
        note: note?.trim() || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.id,
        status: payment.status,
        message: "Payment submitted! The freelancer has been notified to 1-tap verify your payment.",
      },
    });
  } catch (error: any) {
    console.error("Payment submit error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit payment" },
      { status: 500 }
    );
  }
}
