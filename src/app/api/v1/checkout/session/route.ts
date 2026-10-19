import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkCampaignLimits } from "@/lib/arbiter";
import { leaseMicroPaise } from "@/lib/paise-pool";
import { buildUPIUri, formatINR } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { campaignId, payerName, payerEmail, payerPhone, customNote } = body;

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: { message: "Campaign ID is required" } },
        { status: 400 }
      );
    }

    // 1. Fetch Campaign & Merchant
    const campaign = await prisma.paymentCampaign.findUnique({
      where: { id: campaignId },
      include: { merchant: true },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: { message: "Campaign not found" } },
        { status: 404 }
      );
    }

    // 2. Validate Limits & Expiry
    const limitCheck = await checkCampaignLimits(campaign.id, campaign.amountPaise);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: limitCheck.reason,
            message:
              limitCheck.reason === "SLOTS_EXHAUSTED"
                ? "All slots for this campaign are fully booked."
                : limitCheck.reason === "CAP_REACHED"
                ? "Campaign total collection target has been reached."
                : "This campaign is currently inactive or expired.",
          },
        },
        { status: 409 }
      );
    }

    // 3. Create Session with 15-minute TTL
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const session = await prisma.paymentSession.create({
      data: {
        campaignId: campaign.id,
        payerName: payerName || null,
        payerEmail: payerEmail || null,
        payerPhone: payerPhone || null,
        customNote: customNote || null,
        baseAmountPaise: campaign.amountPaise,
        offsetPaise: 0,
        finalAmountPaise: campaign.amountPaise,
        expiresAt,
        status: "AWAITING_PAYMENT",
      },
    });

    // 4. Mode C: Lease micro-paise variation if enabled
    let assignedOffset = 0;
    let finalPaise = campaign.amountPaise;

    if (campaign.enableMicroPaise) {
      assignedOffset = await leaseMicroPaise(campaign.id, session.id);
      finalPaise = campaign.amountPaise + assignedOffset;

      await prisma.paymentSession.update({
        where: { id: session.id },
        data: {
          offsetPaise: assignedOffset,
          finalAmountPaise: finalPaise,
        },
      });
    }

    // 5. Build strict UPI intent URI
    const upiUri = buildUPIUri({
      vpa: campaign.merchant.vpa,
      name: campaign.merchant.businessName || campaign.merchant.name,
      amountPaise: finalPaise,
      transactionRef: session.id,
      note: customNote || campaign.title,
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        payeeVpa: campaign.merchant.vpa,
        payeeName: campaign.merchant.businessName || campaign.merchant.name,
        baseAmountPaise: campaign.amountPaise,
        offsetPaise: assignedOffset,
        finalAmountPaise: finalPaise,
        amountFormatted: formatINR(finalPaise),
        upiIntentUri: upiUri,
        expiresAt: expiresAt.toISOString(),
        remainingSlots: limitCheck.remainingSlots,
        status: "AWAITING_PAYMENT",
      },
    });
  } catch (error: any) {
    console.error("Error in checkout session creation:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Internal server error" } },
      { status: 500 }
    );
  }
}
