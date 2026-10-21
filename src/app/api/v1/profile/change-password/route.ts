import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser, verifyPassword, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: "Please log in to change your password." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Both current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Verify current password if user has one set
    if (sessionUser.passwordHash) {
      const isMatch = await verifyPassword(currentPassword, sessionUser.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect." },
          { status: 400 }
        );
      }
    }

    const newHash = await hashPassword(newPassword);
    await prisma.freelancer.update({
      where: { id: sessionUser.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update password." },
      { status: 500 }
    );
  }
}
