import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const linkId = params.id;
    if (!linkId) {
      return NextResponse.json(
        { success: false, error: "Payment Link ID is required." },
        { status: 400 }
      );
    }

    const link = await prisma.paymentLink.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      return NextResponse.json(
        { success: false, error: "Payment Link not found." },
        { status: 404 }
      );
    }

    // Verify ownership
    if (link.freelancerId !== sessionUser.id) {
      return NextResponse.json(
        { success: false, error: "You are not authorized to modify this payment link." },
        { status: 403 }
      );
    }

    if (link.status === "CLOSED") {
      return NextResponse.json({
        success: true,
        data: { paymentLink: link },
        message: "Payment link is already closed.",
      });
    }

    // Close the payment link
    const updatedLink = await prisma.paymentLink.update({
      where: { id: linkId },
      data: {
        status: "CLOSED",
      },
    });

    return NextResponse.json({
      success: true,
      data: { paymentLink: updatedLink },
      message: "Payment link successfully closed. Customers can no longer submit payments.",
    });
  } catch (error: any) {
    console.error("Close payment link error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to close payment link." },
      { status: 500 }
    );
  }
}
