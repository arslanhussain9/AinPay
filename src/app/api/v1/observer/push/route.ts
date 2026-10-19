import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyObserverRequest } from "@/lib/hmac";
import { parseBankAlert } from "@/lib/parsers";
import { atomicConfirmPayment } from "@/lib/arbiter";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const deviceId = req.headers.get("x-observer-device-id");
    const timestampHeader = req.headers.get("x-observer-timestamp");
    const signatureHeader = req.headers.get("x-observer-signature");

    if (!deviceId) {
      return NextResponse.json(
        { success: false, error: { message: "Missing X-Observer-Device-Id header" } },
        { status: 400 }
      );
    }

    // 1. Fetch observer device
    const device = await prisma.observerDevice.findUnique({
      where: { deviceId },
      include: { merchant: true },
    });

    if (!device) {
      return NextResponse.json(
        { success: false, error: { message: "Unrecognized observer device ID" } },
        { status: 401 }
      );
    }

    // 2. Cryptographic HMAC-SHA256 signature check
    const authCheck = verifyObserverRequest({
      secretKey: device.deviceSecret,
      rawBody,
      timestampHeader,
      signatureHeader,
    });

    if (!authCheck.valid) {
      return NextResponse.json(
        { success: false, error: { message: authCheck.reason || "Unauthorized signature" } },
        { status: 401 }
      );
    }

    // Update last ping
    await prisma.observerDevice.update({
      where: { id: device.id },
      data: { lastPingAt: new Date(), status: "ONLINE" },
    });

    // 3. Parse JSON body
    let payload: { rawText: string; sender?: string };
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, error: { message: "Invalid JSON payload" } },
        { status: 400 }
      );
    }

    // 4. Regex Parse incoming bank text
    const parsed = parseBankAlert(payload.rawText);
    if (!parsed) {
      return NextResponse.json({
        success: true,
        matched: false,
        message: "Alert received but did not match credit transaction patterns (ignoring non-credit/promotional SMS).",
      });
    }

    // 5. Check if UTR already consumed
    const existingTxn = await prisma.transaction.findFirst({
      where: { utrNumber: parsed.utr },
    });

    if (existingTxn && existingTxn.status === "VERIFIED") {
      return NextResponse.json({
        success: true,
        matched: false,
        message: `UTR ${parsed.utr} already consumed. Duplicate ignored.`,
      });
    }

    // 6. Mode C: Check if exact amount matches an active micro-paise session
    const matchedSession = await prisma.paymentSession.findFirst({
      where: {
        campaign: { merchantId: device.merchantId },
        finalAmountPaise: parsed.amountPaise,
        status: { in: ["AWAITING_PAYMENT", "UTR_SUBMITTED"] },
      },
      include: { campaign: true },
    });

    if (matchedSession) {
      const confirmResult = await atomicConfirmPayment({
        campaignId: matchedSession.campaignId,
        sessionId: matchedSession.id,
        utrNumber: parsed.utr,
        amountPaise: parsed.amountPaise,
        verificationMode: "MICRO_PAISE_MATCH",
        rawBankAlertText: payload.rawText,
        payerName: matchedSession.payerName || undefined,
        payerPhone: matchedSession.payerPhone || undefined,
      });

      return NextResponse.json({
        success: true,
        matched: true,
        mode: "MODE_C_PAISE_MATCH",
        confirmResult,
      });
    }

    // 7. Check if matches a pending Mode A transaction with same UTR
    const pendingTxn = await prisma.transaction.findFirst({
      where: {
        merchantId: device.merchantId,
        utrNumber: parsed.utr,
        status: "PENDING",
      },
    });

    if (pendingTxn) {
      const confirmResult = await atomicConfirmPayment({
        campaignId: pendingTxn.campaignId,
        sessionId: pendingTxn.sessionId || undefined,
        utrNumber: parsed.utr,
        amountPaise: parsed.amountPaise,
        verificationMode: "OBSERVER_SMS",
        rawBankAlertText: payload.rawText,
        payerName: pendingTxn.payerName || undefined,
        payerPhone: pendingTxn.payerPhone || undefined,
      });

      return NextResponse.json({
        success: true,
        matched: true,
        mode: "MODE_B_OBSERVER_UTR",
        confirmResult,
      });
    }

    // 8. General Unmatched Credit (Logged for merchant inspection)
    return NextResponse.json({
      success: true,
      matched: false,
      parsedData: parsed,
      message: "Bank alert parsed successfully. No active session or pending UTR matched.",
    });
  } catch (error: any) {
    console.error("Observer Push error:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Internal error" } },
      { status: 500 }
    );
  }
}
