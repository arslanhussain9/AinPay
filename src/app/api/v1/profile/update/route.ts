import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { freelancerId, name, vpa, mobile, title, bio, twitter, github, linkedin } = body;

    if (!freelancerId || !name?.trim() || !vpa?.trim()) {
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
      where: { id: freelancerId },
      data: {
        name: name.trim(),
        vpa: vpa.trim().toLowerCase(),
        mobile: mobile?.trim() || null,
        title: title?.trim() || null,
        bio: bio?.trim() || null,
        twitter: twitter?.trim() || null,
        github: github?.trim() || null,
        linkedin: linkedin?.trim() || null,
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
