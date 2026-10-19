import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { atomicConfirmPayment } from "@/lib/arbiter";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transactionId = params.id;

    const txn = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!txn) {
      return NextResponse.json(
        { success: false, error: { message: "Transaction not found" } },
        { status: 404 }
      );
    }

    if (txn.status === "VERIFIED") {
      return NextResponse.json(
        { success: false, error: { message: "Transaction is already verified" } },
        { status: 400 }
      );
    }

    // Atomically confirm payment and decrement slot
    const result = await atomicConfirmPayment({
      campaignId: txn.campaignId,
      sessionId: txn.sessionId || undefined,
      utrNumber: txn.utrNumber || `MANUAL_${Date.now()}`,
      amountPaise: txn.amountPaise,
      verificationMode: "MANUAL_UTR",
      payerName: txn.payerName || undefined,
      payerPhone: txn.payerPhone || undefined,
    });

    // Remove the old pending record if atomicConfirmPayment created a new one
    if (result.success && result.transaction?.id !== txn.id) {
      await prisma.transaction.delete({ where: { id: txn.id } });
    }

    return NextResponse.json({
      success: result.success,
      code: result.code,
      message: result.message,
      transaction: result.transaction,
    });
  } catch (error: any) {
    console.error("Error approving transaction:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Internal server error" } },
      { status: 500 }
    );
  }
}
