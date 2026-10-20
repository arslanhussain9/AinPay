import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { freelancerId, title, slug, description, amountPaise, isFixedAmount, maxSlots } = body;

    if (!freelancerId || !title || !slug) {
      return NextResponse.json(
        { success: false, error: "Freelancer ID, title, and URL slug are required" },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");

    const paymentLink = await prisma.paymentLink.create({
      data: {
        freelancerId,
        title: title.trim(),
        slug: cleanSlug,
        description: description?.trim() || null,
        amountPaise: amountPaise ? parseInt(amountPaise, 10) : null,
        isFixedAmount: isFixedAmount ?? true,
        maxSlots: maxSlots ? parseInt(maxSlots, 10) : null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      data: { paymentLink },
    });
  } catch (error: any) {
    console.error("Create payment link error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment link" },
      { status: 500 }
    );
  }
}
