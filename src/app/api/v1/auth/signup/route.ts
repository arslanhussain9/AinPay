import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { hashPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, username, email, vpa, password, mobile } = body;

    // Basic validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!username || typeof username !== "string" || !/^[a-zA-Z0-9_-]{3,30}$/.test(username.trim())) {
      return NextResponse.json(
        { error: "Username must be 3-30 characters (letters, numbers, underscores, hyphens only)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!vpa || typeof vpa !== "string" || !vpa.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid UPI ID (e.g. yourname@okhdfcbank)." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanVpa = vpa.trim().toLowerCase();

    // Check unique email and username
    const existingUser = await prisma.freelancer.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { username: cleanUsername },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.username === cleanUsername) {
        return NextResponse.json(
          { error: "This username is already taken. Please choose another." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password & create user
    const passwordHash = await hashPassword(password);
    const newUser = await prisma.freelancer.create({
      data: {
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        vpa: cleanVpa,
        mobile: mobile ? String(mobile).trim() : null,
        passwordHash,
      },
    });

    // Create session token
    const token = await createSessionToken({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        vpa: newUser.vpa,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
