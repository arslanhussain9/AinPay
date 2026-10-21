import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import prisma from "@/lib/prisma";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "ainpay-super-secret-jwt-key-2026-production-ready";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = "ainpay_session";

export interface SessionPayload {
  id: string;
  email: string;
  username: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      username: payload.username as string,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.id) return null;

    const user = await prisma.freelancer.findUnique({
      where: { id: payload.id },
    });

    return user;
  } catch (err) {
    console.error("getSessionUser error:", err);
    return null;
  }
}

export { COOKIE_NAME };
