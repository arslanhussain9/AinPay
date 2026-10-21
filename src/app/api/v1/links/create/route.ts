import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      freelancerId,
      customerName,
      customerPhone,
      customerEmail,
      amountPaise,
      description,
      title,
    } = body;

    // 1. Validate Freelancer
    if (!freelancerId) {
      return NextResponse.json(
        { success: false, error: "Merchant / Freelancer ID is required" },
        { status: 400 }
      );
    }

    // 2. Validate Customer Name
    const cleanCustomerName = customerName?.trim();
    if (!cleanCustomerName) {
      return NextResponse.json(
        { success: false, error: "Customer Name is required." },
        { status: 400 }
      );
    }

    // 3. Validate Mandatory Fixed Amount
    const parsedAmountPaise = parseInt(amountPaise, 10);
    if (isNaN(parsedAmountPaise) || parsedAmountPaise <= 0) {
      return NextResponse.json(
        { success: false, error: "A valid positive fixed amount is required." },
        { status: 400 }
      );
    }

    // 4. Validate Customer Contact (At least mobile or email must be provided)
    const cleanPhone = customerPhone?.trim() || null;
    const cleanEmail = customerEmail?.trim() || null;

    if (!cleanPhone && !cleanEmail) {
      return NextResponse.json(
        { success: false, error: "Please provide at least one contact method: Mobile Number or Email Address." },
        { status: 400 }
      );
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (cleanPhone) {
      const digitsOnly = cleanPhone.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid 10-digit mobile number." },
          { status: 400 }
        );
      }
    }

    // 5. Generate Safe, Unique URL-friendly Slug
    const baseSlug = cleanCustomerName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 25) || "pay";

    let cleanSlug = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      cleanSlug = `${baseSlug}-${randomSuffix}`;
      const existing = await prisma.paymentLink.findFirst({ where: { slug: cleanSlug } });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      cleanSlug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const linkTitle = title?.trim() || `Payment Request for ${cleanCustomerName}`;

    // 6. Create Payment Link (Single-use fixed amount)
    const paymentLink = await prisma.paymentLink.create({
      data: {
        freelancerId,
        title: linkTitle,
        slug: cleanSlug,
        customerName: cleanCustomerName,
        customerPhone: cleanPhone,
        customerEmail: cleanEmail,
        amountPaise: parsedAmountPaise,
        isFixedAmount: true,
        description: description?.trim() || null,
        maxSlots: 1, // Strictly single-use
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
