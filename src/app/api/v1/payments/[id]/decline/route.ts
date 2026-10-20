import { NextRequest, NextResponse } from "next/server";
import { declinePayment } from "@/lib/arbiter";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id;
    const payment = await declinePayment(paymentId);

    return NextResponse.json({
      success: true,
      data: {
        payment,
        message: "Payment declined.",
      },
    });
  } catch (error: any) {
    console.error("Decline payment error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to decline payment" },
      { status: 500 }
    );
  }
}
