import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    const body = await req.json();
    const { freelancerId, name, vpa, mobile, title, bio } = body;

    const targetId = sessionUser?.id || freelancerId;
    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "Authentication required to update account." },
        { status: 401 }
      );
    }

    if (!name?.trim() || !vpa?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name and UPI ID (VPA) are required." },
        { status: 400 }
      );
    }

    if (!vpa.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid UPI ID (e.g. yourname@bank)." },
        { status: 400 }
      );
    }

    const updated = await prisma.freelancer.update({
      where: { id: targetId },
      data: {
        name: name.trim(),
        vpa: vpa.trim().toLowerCase(),
        mobile: mobile?.trim() || null,
        title: title?.trim() || null,
        bio: bio?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, data: { freelancer: updated } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
