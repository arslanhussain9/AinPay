import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UPIIntentParams } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats integer paise into standard Indian Rupee currency representation.
 * Example: 200000 paise -> "₹2,000.00"
 */
export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Builds strict NPCI compliant UPI Deep-Link Intent URI
 */
export function buildUPIUri(params: UPIIntentParams): string {
  const { vpa, name, amountPaise, transactionRef, note } = params;
  const amountStr = (amountPaise / 100).toFixed(2);
  
  const query = new URLSearchParams({
    pa: vpa.trim(),
    pn: name.trim(),
    am: amountStr,
    cu: "INR",
    tr: transactionRef.trim(),
  });

  if (note && note.trim().length > 0) {
    query.set("tn", note.trim());
  }

  return `upi://pay?${query.toString()}`;
}

/**
 * Validates standard 12-digit UPI Transaction Reference (UTR)
 */
export function validateUTR(utr: string): boolean {
  if (!utr) return false;
  const cleaned = utr.trim();
  return /^\d{12}$/.test(cleaned);
}
