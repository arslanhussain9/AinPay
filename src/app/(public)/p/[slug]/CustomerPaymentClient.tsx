"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/utils";
import { VectorQR } from "@/components/qr/VectorQR";
import { UtrSubmissionBox } from "@/components/checkout/UtrSubmissionBox";
import {
  Check,
  Copy,
  Lock,
  Phone,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
  ExternalLink,
  Info,
} from "lucide-react";
import Link from "next/link";

interface CustomerPaymentClientProps {
  paymentLink: {
    id: string;
    title: string;
    slug: string;
    customerName?: string | null;
    customerEmail?: string | null;
    customerPhone?: string | null;
    amountPaise: number;
    description?: string | null;
    status: string;
  };
  merchant: {
    id: string;
    name: string;
    vpa: string;
    mobile?: string | null;
    username: string;
  };
  isClosed: boolean;
  upiUri: string;
}

export function CustomerPaymentClient({
  paymentLink,
  merchant,
  isClosed,
  upiUri,
}: CustomerPaymentClientProps) {
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [desktopHint, setDesktopHint] = useState<string | null>(null);

  const displayName = paymentLink.customerName?.trim() || "Customer";
  const formattedAmount = formatINR(paymentLink.amountPaise);

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(merchant.vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handlePayNow = () => {
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      window.location.href = upiUri;
    } else {
      // On desktop, prompt user to scan QR or launch handler if available
      setDesktopHint(
        "UPI payment apps open directly on mobile devices. Please scan the QR code above using Google Pay, PhonePe, Paytm, or any UPI app on your phone."
      );
      // Still attempt standard intent link
      window.location.href = upiUri;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#0d253d] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-normal">
      <div className="w-full max-w-lg z-10 flex flex-col gap-4">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between px-1">
          <Link
            href={`/pay/${merchant.username}`}
            className="text-xs text-[#64748d] hover:text-[#0d253d] flex items-center gap-1.5 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AINPAY Direct UPI</span>
          </Link>
          <span className="text-xs text-[#533afd] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Request
          </span>
        </div>

        {/* Main Payment Card */}
        <div className="bg-white rounded-2xl border border-[#e3e8ee] p-6 sm:p-8 flex flex-col gap-6 stripe-shadow-md relative overflow-hidden">
          {/* 1. Customer Name Header */}
          <div className="flex flex-col gap-1 pb-4 border-b border-[#e3e8ee]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#533afd] tracking-wide uppercase">
              <User className="w-3.5 h-3.5" />
              <span>Payment Request</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
              Payment Request for{" "}
              <strong className="font-semibold text-[#0d253d]">{displayName}</strong>
            </h1>
          </div>

          {/* 2, 3, 4. Merchant Information & Contact Details */}
          <div className="p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748d]">Merchant</span>
              <strong className="text-[#0d253d] font-semibold">{merchant.name}</strong>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748d]">Paying To (UPI ID)</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-medium text-[#533afd]">{merchant.vpa}</span>
                <button
                  onClick={handleCopyVpa}
                  type="button"
                  title="Copy UPI ID"
                  className="p-1 rounded text-[#64748d] hover:text-[#0d253d] hover:bg-[#e3e8ee] transition-colors"
                >
                  {copiedVpa ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Merchant Mobile Number (Displayed gracefully only if configured) */}
            {merchant.mobile && merchant.mobile.trim().length > 0 && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#e3e8ee]/60">
                <span className="text-[#64748d] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#64748d]" />
                  <span>Merchant Mobile</span>
                </span>
                <span className="font-mono text-[#273951] font-medium">{merchant.mobile}</span>
              </div>
            )}
          </div>

          {/* 5. Fixed Payment Amount (Non-editable) */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] border border-[#e3e8ee] text-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#64748d] mb-1">
              Fixed Amount Due
            </span>
            <div className="text-3xl sm:text-4xl font-normal text-[#0d253d] tabular-money tracking-tight">
              {formattedAmount}
            </div>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mt-2 font-medium">
              Zero transaction fees applied
            </span>
          </div>

          {!isClosed ? (
            <>
              {/* 6. Payment QR Code */}
              <div className="flex flex-col items-center justify-center gap-2 pt-1">
                <VectorQR
                  upiUri={upiUri}
                  payeeName={merchant.name}
                  amountFormatted={formattedAmount}
                  size={220}
                />
                <p className="text-[11px] text-[#64748d] text-center max-w-xs mt-1">
                  Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI app.
                </p>
              </div>

              {/* 7. Payment Description (Hidden if no description was entered) */}
              {paymentLink.description && paymentLink.description.trim().length > 0 && (
                <div className="p-4 rounded-xl bg-white border border-[#e3e8ee] stripe-shadow-sm flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748d]">
                    Payment Details & Scope
                  </span>
                  <p className="text-xs text-[#273951] leading-relaxed">
                    {paymentLink.description}
                  </p>
                </div>
              )}

              {/* 8. Pay Now Button */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handlePayNow}
                  className="w-full btn-stripe-primary !py-3 text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Pay {formattedAmount} via UPI App</span>
                  <Sparkles className="w-4 h-4 ml-0.5" />
                </button>

                {desktopHint && (
                  <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 animate-fade-in">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{desktopHint}</span>
                  </div>
                )}
              </div>

              {/* Confirm Payment UTR Submission */}
              <UtrSubmissionBox
                paymentLinkId={paymentLink.id}
                freelancerId={merchant.id}
                amountPaise={paymentLink.amountPaise}
                note={paymentLink.title}
                defaultPayerName={paymentLink.customerName || ""}
              />
            </>
          ) : (
            /* 5. Closed State */
            <div className="p-8 rounded-2xl bg-[#f6f9fc] border border-[#e3e8ee] flex flex-col items-center text-center gap-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#0d253d]">Invoice Closed</h3>
              <p className="text-xs text-[#64748d] max-w-sm">
                This invoice is no longer accepting payments. Single-use links close automatically
                after payment.
              </p>
              <Link
                href={`/pay/${merchant.username}`}
                className="mt-2 text-xs text-[#533afd] hover:underline font-medium flex items-center gap-1"
              >
                <span>Visit {merchant.name}&apos;s profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Footer Security Badge */}
          <div className="pt-3 border-t border-[#e3e8ee] flex items-center justify-between text-[11px] text-[#64748d]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#533afd]" />
              Direct Bank Settlement
            </span>
            <span className="flex items-center gap-1">
              <span>Secured via</span>
              <img src="/full-logo.png" alt="AinPay" className="h-3.5 w-auto object-contain inline-block" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
