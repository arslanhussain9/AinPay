import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateUTR } from "@/lib/utils";
import { atomicConfirmPayment } from "@/lib/arbiter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, campaignId, utr, amountPaise, payerName, payerPhone } = body;

    if (!utr || !validateUTR(utr)) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Invalid UTR. Please provide a valid 12-digit numeric reference number." },
        },
        { status: 400 }
      );
    }

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: { message: "Campaign ID is required" } },
        { status: 400 }
      );
    }

    // 1. Check for duplicate UTR
    const existing = await prisma.transaction.findFirst({
      where: { utrNumber: utr },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: { message: `UTR ${utr} has already been registered or verified previously.` },
        },
        { status: 409 }
      );
    }

    // 2. Fetch campaign to obtain merchant ID & required amount
    const campaign = await prisma.paymentCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: { message: "Campaign not found" } },
        { status: 404 }
      );
    }

    const targetAmount = amountPaise || campaign.amountPaise;

    // 3. In Mode A: Log transaction as PENDING for merchant review & reserve session
    const transaction = await prisma.transaction.create({
      data: {
        merchantId: campaign.merchantId,
        campaignId: campaign.id,
        sessionId: sessionId || null,
        utrNumber: utr,
        amountPaise: targetAmount,
        verificationMode: "MANUAL_UTR",
        status: "PENDING",
        payerName: payerName || null,
        payerPhone: payerPhone || null,
      },
    });

    if (sessionId) {
      await prisma.paymentSession.update({
        where: { id: sessionId },
        data: {
          submittedUtr: utr,
          status: "UTR_SUBMITTED",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        transactionId: transaction.id,
        utr: transaction.utrNumber,
        status: "PENDING",
        message: "12-digit UTR logged successfully. Waiting for merchant 1-tap approval or observer sync.",
      },
    });
  } catch (error: any) {
    console.error("Error in UTR verification:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Internal server error" } },
      { status: 500 }
    );
  }
}
