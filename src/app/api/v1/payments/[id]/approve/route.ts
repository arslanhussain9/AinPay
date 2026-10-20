import { NextRequest, NextResponse } from "next/server";
import { approvePayment } from "@/lib/arbiter";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id;
    const payment = await approvePayment(paymentId);

    return NextResponse.json({
      success: true,
      data: {
        payment,
        message: "Payment successfully approved and credited!",
      },
    });
  } catch (error: any) {
    console.error("Approve payment error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to approve payment" },
      { status: 500 }
    );
  }
}
