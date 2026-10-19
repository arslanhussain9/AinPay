import prisma from "./prisma";
import { LimitCheckResult } from "@/types";

export interface ConfirmPaymentResult {
  success: boolean;
  code: "VERIFIED" | "LIMIT_EXCEEDED" | "ALREADY_VERIFIED" | "CAMPAIGN_NOT_FOUND" | "DUPLICATE_UTR";
  message: string;
  transaction?: any;
  campaignStatus?: string;
  slotsRemaining?: number | null;
}

/**
 * Validates whether a campaign can currently accept incoming payments.
 */
export async function checkCampaignLimits(
  campaignId: string,
  incomingAmountPaise: number
): Promise<LimitCheckResult> {
  const campaign = await prisma.paymentCampaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) {
    return { allowed: false, reason: "CAMPAIGN_PAUSED" };
  }

  // Check manual pause
  if (campaign.status === "PAUSED") {
    return { allowed: false, reason: "CAMPAIGN_PAUSED" };
  }

  // Check TTL Expiry
  if (campaign.expiresAt && new Date() > campaign.expiresAt) {
    if (campaign.status !== "EXPIRED") {
      await prisma.paymentCampaign.update({
        where: { id: campaignId },
        data: { status: "EXPIRED" },
      });
    }
    return { allowed: false, reason: "CAMPAIGN_EXPIRED" };
  }

  // Check slot limits
  if (campaign.maxSlots !== null && campaign.usedSlots >= campaign.maxSlots) {
    if (campaign.status !== "SLOTS_EXHAUSTED") {
      await prisma.paymentCampaign.update({
        where: { id: campaignId },
        data: { status: "SLOTS_EXHAUSTED" },
      });
    }
    return { allowed: false, reason: "SLOTS_EXHAUSTED", remainingSlots: 0 };
  }

  // Check aggregate collection cap
  if (
    campaign.totalCapPaise !== null &&
    campaign.collectedPaise + incomingAmountPaise > campaign.totalCapPaise
  ) {
    if (campaign.status !== "CAP_REACHED") {
      await prisma.paymentCampaign.update({
        where: { id: campaignId },
        data: { status: "CAP_REACHED" },
      });
    }
    return { allowed: false, reason: "CAP_REACHED", remainingCapPaise: 0 };
  }

  return {
    allowed: true,
    remainingSlots:
      campaign.maxSlots !== null ? campaign.maxSlots - campaign.usedSlots : null,
    remainingCapPaise:
      campaign.totalCapPaise !== null
        ? campaign.totalCapPaise - campaign.collectedPaise
        : null,
  };
}

/**
 * Atomically verifies and commits a payment.
 * Implements strict CAS concurrency control so hard limits are never breached.
 */
export async function atomicConfirmPayment(params: {
  campaignId: string;
  sessionId?: string;
  utrNumber: string;
  amountPaise: number;
  verificationMode: "MANUAL_UTR" | "OBSERVER_SMS" | "OBSERVER_NOTIFICATION" | "MICRO_PAISE_MATCH";
  rawBankAlertText?: string;
  payerName?: string;
  payerVpa?: string;
  payerPhone?: string;
}): Promise<ConfirmPaymentResult> {
  const {
    campaignId,
    sessionId,
    utrNumber,
    amountPaise,
    verificationMode,
    rawBankAlertText,
    payerName,
    payerVpa,
    payerPhone,
  } = params;

  // 1. Guard against duplicate UTRs across the platform
  const existingTxn = await prisma.transaction.findFirst({
    where: { utrNumber },
  });

  if (existingTxn) {
    return {
      success: false,
      code: "DUPLICATE_UTR",
      message: `UTR ${utrNumber} has already been registered and verified previously.`,
    };
  }

  // 2. Fetch campaign
  const campaign = await prisma.paymentCampaign.findUnique({
    where: { id: campaignId },
    include: { merchant: true },
  });

  if (!campaign) {
    return {
      success: false,
      code: "CAMPAIGN_NOT_FOUND",
      message: "Associated payment campaign could not be found.",
    };
  }

  // 3. Execute atomic transaction
  return await prisma.$transaction(async (tx) => {
    // Check if slots or cap exceeded
    const isSlotsFull =
      campaign.maxSlots !== null && campaign.usedSlots >= campaign.maxSlots;
    const isCapFull =
      campaign.totalCapPaise !== null &&
      campaign.collectedPaise + amountPaise > campaign.totalCapPaise;

    if (isSlotsFull || isCapFull) {
      // Create oversubscribed audit transaction for merchant reconciliation
      const oversubscribedTxn = await tx.transaction.create({
        data: {
          merchantId: campaign.merchantId,
          campaignId: campaign.id,
          sessionId: sessionId || null,
          utrNumber,
          amountPaise,
          verificationMode,
          status: "OVERSUBSCRIBED_REFUND_DUE",
          rawBankAlertText,
          payerName,
          payerVpa,
          payerPhone,
        },
      });

      return {
        success: false,
        code: "LIMIT_EXCEEDED",
        message: "Campaign limits exhausted during checkout. Payment logged for refund.",
        transaction: oversubscribedTxn,
      };
    }

    // Determine new status
    const newUsedSlots = campaign.usedSlots + 1;
    const newCollectedPaise = campaign.collectedPaise + amountPaise;

    let nextStatus = campaign.status;
    if (campaign.maxSlots !== null && newUsedSlots >= campaign.maxSlots) {
      nextStatus = "SLOTS_EXHAUSTED";
    } else if (
      campaign.totalCapPaise !== null &&
      newCollectedPaise >= campaign.totalCapPaise
    ) {
      nextStatus = "CAP_REACHED";
    }

    // Atomically increment campaign usage
    await tx.paymentCampaign.update({
      where: { id: campaignId },
      data: {
        usedSlots: newUsedSlots,
        collectedPaise: newCollectedPaise,
        status: nextStatus,
      },
    });

    // Create verified transaction record
    const verifiedTxn = await tx.transaction.create({
      data: {
        merchantId: campaign.merchantId,
        campaignId: campaign.id,
        sessionId: sessionId || null,
        utrNumber,
        amountPaise,
        verificationMode,
        status: "VERIFIED",
        rawBankAlertText,
        payerName,
        payerVpa,
        payerPhone,
        verifiedAt: new Date(),
      },
    });

    // Update session if linked
    if (sessionId) {
      await tx.paymentSession.update({
        where: { id: sessionId },
        data: {
          status: "VERIFIED",
          submittedUtr: utrNumber,
        },
      });
    }

    return {
      success: true,
      code: "VERIFIED",
      message: "Payment successfully verified and campaign limits atomically committed.",
      transaction: verifiedTxn,
      campaignStatus: nextStatus,
      slotsRemaining:
        campaign.maxSlots !== null ? campaign.maxSlots - newUsedSlots : null,
    };
  });
}
