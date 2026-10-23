"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatINR } from "@/lib/utils";
import { VectorQR } from "@/components/qr/VectorQR";
import { UtrSubmissionBox } from "@/components/checkout/UtrSubmissionBox";
import {
  PaymentConfirmedCard,
  ConfirmedPaymentData,
} from "@/components/checkout/PaymentConfirmedCard";
import {
  Check,
  Copy,
  Lock,
  Phone,
  ShieldCheck,
  Smartphone,
  User,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
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
  initialApprovedPayment?: ConfirmedPaymentData | null;
  upiUri: string;
}

export function CustomerPaymentClient({
  paymentLink,
  merchant,
  isClosed,
  initialApprovedPayment = null,
  upiUri,
}: CustomerPaymentClientProps) {
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [deviceHint, setDeviceHint] = useState<string | null>(null);
  const [confirmedPayment, setConfirmedPayment] = useState<ConfirmedPaymentData | null>(
    initialApprovedPayment
  );
  const [hasInitiatedPayment, setHasInitiatedPayment] = useState(false);
  const [showUtrSection, setShowUtrSection] = useState(true);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const displayName = paymentLink.customerName?.trim() || paymentLink.title;
  const formattedAmount = formatINR(paymentLink.amountPaise);

  // Poll for merchant payment approval status
  useEffect(() => {
    if (confirmedPayment || isClosed) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/v1/payments/status?paymentLinkId=${paymentLink.id}`);
        const data = await res.json();
        if (data.success && data.status === "APPROVED" && data.payment) {
          setConfirmedPayment(data.payment);
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        }
      } catch {
        // Silently continue polling on network blips
      }
    };

    pollTimerRef.current = setInterval(checkStatus, 2500);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [paymentLink.id, confirmedPayment, isClosed]);

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(merchant.vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handlePayNow = () => {
    setHasInitiatedPayment(true);
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      window.location.href = upiUri;
    } else {
      setDeviceHint(
        "On desktop, please scan the QR code using Google Pay, PhonePe, Paytm, or your preferred UPI app on your mobile phone."
      );
      // Attempt UPI URI launch regardless (in case desktop has handling software)
      window.location.href = upiUri;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#0d253d] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-normal selection:bg-[#b9b9f9] selection:text-[#533afd]">
      <div className="w-full max-w-lg z-10 flex flex-col gap-4">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between px-1 print:hidden">
          <Link
            href={`/pay/${merchant.username}`}
            className="text-xs text-[#64748d] hover:text-[#0d253d] flex items-center gap-1.5 transition-colors font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AINPAY Verified Checkout</span>
          </Link>
          <span className="text-xs text-[#533afd] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {confirmedPayment ? "Payment Verified" : "Direct Bank Transfer"}
          </span>
        </div>

        {/* Main Payment Card */}
        <div className="bg-white rounded-2xl border border-[#e3e8ee] p-6 sm:p-8 flex flex-col gap-6 stripe-shadow-md relative overflow-hidden print:border-none print:shadow-none print:p-0">
          {/* STATE A: PAYMENT CONFIRMED RECEIPT */}
          {confirmedPayment ? (
            <PaymentConfirmedCard
              payment={confirmedPayment}
              showBackToProfile={true}
            />
          ) : !isClosed ? (
            /* STATE B: ACTIVE INVOICE CHECKOUT */
            <>
              {/* Payment Request Heading */}
              <div className="flex flex-col gap-1 pb-4 border-b border-[#e3e8ee]">
                <span className="text-xs font-semibold text-[#533afd] uppercase tracking-wider">
                  Payment Request
                </span>
                <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
                  {displayName}
                </h1>
              </div>

              {/* Merchant Details */}
              <div className="p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748d]">Payee / Merchant</span>
                  <strong className="text-[#0d253d] font-semibold">{merchant.name}</strong>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748d]">Merchant UPI ID</span>
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

                {merchant.mobile && merchant.mobile.trim().length > 0 && (
                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#e3e8ee]/70">
                    <span className="text-[#64748d] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#64748d]" />
                      <span>Contact Mobile</span>
                    </span>
                    <span className="font-mono text-[#273951] font-medium">{merchant.mobile}</span>
                  </div>
                )}
              </div>

              {/* Fixed Amount Due */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] border border-[#e3e8ee] text-center">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#64748d] mb-1">
                  Fixed Amount Due
                </span>
                <div className="text-3xl sm:text-4xl font-normal text-[#0d253d] tabular-money tracking-tight">
                  {formattedAmount}
                </div>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full mt-2 font-medium">
                  Direct bank settlement • 0% platform fee
                </span>
              </div>

              {/* Optional Description / Scope */}
              {paymentLink.description && paymentLink.description.trim().length > 0 && (
                <div className="p-4 rounded-xl bg-white border border-[#e3e8ee] stripe-shadow-sm flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748d]">
                    Payment Description
                  </span>
                  <p className="text-xs text-[#273951] leading-relaxed">
                    {paymentLink.description}
                  </p>
                </div>
              )}

              {/* QR Code Presentation */}
              <div className="flex flex-col items-center justify-center pt-1">
                <VectorQR
                  upiUri={upiUri}
                  payeeName={merchant.name}
                  amountFormatted={formattedAmount}
                  size={210}
                />
                <p className="text-[11px] text-[#64748d] text-center max-w-xs mt-2 leading-relaxed">
                  Scan using Google Pay, PhonePe, Paytm, BHIM, or any UPI app.
                </p>
              </div>

              {/* Primary Mobile Action: Pay Now Button */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handlePayNow}
                  className="w-full btn-stripe-primary !py-3 text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Pay {formattedAmount} via UPI App</span>
                </button>

                {deviceHint && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 animate-fade-in">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{deviceHint}</span>
                  </div>
                )}
              </div>

              {/* Payment Verification / UTR Submission */}
              <div className="border-t border-[#e3e8ee] pt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0d253d]">
                    Payment Verification
                  </span>
                  <span className="text-[11px] text-[#64748d]">
                    Step 2: Enter UTR
                  </span>
                </div>

                <p className="text-xs text-[#64748d] leading-relaxed">
                  After paying, enter the 12-digit UPI reference number (UTR) from your banking receipt below so the merchant can verify and credit your invoice.
                </p>

                <UtrSubmissionBox
                  paymentLinkId={paymentLink.id}
                  freelancerId={merchant.id}
                  amountPaise={paymentLink.amountPaise}
                  note={paymentLink.title}
                  defaultPayerName={paymentLink.customerName || ""}
                  onSuccess={() => {
                    setHasInitiatedPayment(true);
                  }}
                />
              </div>
            </>
          ) : (
            /* STATE C: CLOSED PAYMENT LINK */
            <div className="p-8 rounded-2xl bg-[#f6f9fc] border border-[#e3e8ee] flex flex-col items-center text-center gap-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#64748d]">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-[#0d253d]">This Payment Link is Closed</h2>
              <p className="text-xs text-[#64748d] max-w-sm leading-relaxed">
                This single-use link has been closed or has already received payment and is no longer accepting new submissions.
              </p>
              <Link
                href={`/pay/${merchant.username}`}
                className="mt-3 text-xs text-[#533afd] hover:underline font-medium flex items-center gap-1"
              >
                <span>Visit {merchant.name}&apos;s personal profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Footer Security Badge */}
          <div className="pt-4 border-t border-[#e3e8ee] flex items-center justify-between text-[11px] text-[#64748d] print:hidden">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#533afd]" />
              Direct NPCI UPI Transfer
            </span>
            <span className="flex items-center gap-1">
              <span>Secured by</span>
              <img src="/full-logo.png" alt="AINPAY" className="h-3.5 w-auto object-contain inline-block" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
