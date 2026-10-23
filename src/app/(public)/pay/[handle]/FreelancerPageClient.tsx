"use client";

import React, { useState, useEffect } from "react";
import { formatINR, buildUPIUri } from "@/lib/utils";
import { VectorQR } from "@/components/qr/VectorQR";
import { UtrSubmissionBox } from "@/components/checkout/UtrSubmissionBox";
import {
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Copy,
  Check,
  Smartphone,
  Info,
  Phone,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import {
  PaymentConfirmedCard,
  ConfirmedPaymentData,
} from "@/components/checkout/PaymentConfirmedCard";

interface FreelancerPageClientProps {
  freelancer: any;
}

export function FreelancerPageClient({
  freelancer,
}: FreelancerPageClientProps) {
  const presets = [500, 1500, 5000, 10000];
  const [selectedPreset, setSelectedPreset] = useState<number>(1500);
  const [customAmountRupees, setCustomAmountRupees] = useState<string>("1500");
  const [clientNote, setClientNote] = useState<string>("");
  const [clientUtr, setClientUtr] = useState<string>("");
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);
  const [confirmedPayment, setConfirmedPayment] = useState<ConfirmedPaymentData | null>(null);
  const [payStep, setPayStep] = useState<"SELECT" | "PAY_QR">("SELECT");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);
  const [deviceHint, setDeviceHint] = useState<string | null>(null);

  const currentAmountRupees = parseInt(customAmountRupees, 10) || 0;
  const currentAmountPaise = currentAmountRupees * 100;

  const upiUri = buildUPIUri({
    vpa: freelancer.vpa,
    name: freelancer.name,
    amountPaise: currentAmountPaise > 0 ? currentAmountPaise : 10000,
    transactionRef: `PM_${Date.now().toString().slice(-6)}`,
    note: clientNote || `Payment to ${freelancer.name}`,
  });

  // Background polling for payment approval
  useEffect(() => {
    if (!activePaymentId || confirmedPayment) return;

    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/payments/status?paymentId=${activePaymentId}`);
        const data = await res.json();
        if (data.success && data.status === "APPROVED" && data.payment) {
          setConfirmedPayment(data.payment);
          clearInterval(timer);
        }
      } catch {
        // Silently continue polling
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [activePaymentId, confirmedPayment]);

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(freelancer.vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleStartPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmountRupees < 1) {
      setErrorMsg("Please enter an amount of at least ₹1");
      return;
    }
    setErrorMsg("");
    setPayStep("PAY_QR");
  };

  const handlePayNowMobile = () => {
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      window.location.href = upiUri;
    } else {
      setDeviceHint(
        "On desktop, please scan the QR code above with your mobile UPI app."
      );
      window.location.href = upiUri;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#0d253d] flex flex-col items-center justify-between p-4 sm:p-6 lg:p-10 font-normal selection:bg-[#b9b9f9] selection:text-[#533afd]">
      {/* Top Header Badge */}
      <div className="w-full max-w-lg flex items-center justify-between pb-3 print:hidden">
        <Link
          href="/"
          className="flex items-center gap-1.5 hover:opacity-90 transition-opacity"
        >
          <img
            src="/full-logo.png"
            alt="AINPAY"
            className="h-6 w-auto object-contain"
          />
        </Link>
        <span className="text-xs text-[#533afd] font-medium flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#e3e8ee] stripe-shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Merchant</span>
        </span>
      </div>

      <div className="w-full max-w-lg z-10 flex flex-col gap-5 my-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e3e8ee] stripe-shadow-md flex flex-col items-center text-center relative overflow-hidden">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#533afd] text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-md mb-3">
            {freelancer.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div className="flex items-center gap-1.5 justify-center">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0d253d]">
              {freelancer.name}
            </h1>
            <CheckCircle2 className="w-4 h-4 text-[#533afd]" />
          </div>

          {freelancer.title && (
            <p className="text-xs sm:text-sm font-medium text-[#533afd] mt-0.5">
              {freelancer.title}
            </p>
          )}

          {freelancer.bio && (
            <p className="text-xs text-[#64748d] mt-2 leading-relaxed max-w-md">
              {freelancer.bio}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            {/* UPI ID Pill */}
            <div className="px-3 py-1.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#273951] font-medium flex items-center gap-2">
              <span className="text-[#64748d]">UPI:</span>
              <span className="font-mono text-[#0d253d] font-semibold">{freelancer.vpa}</span>
              <button
                type="button"
                onClick={handleCopyVpa}
                title="Copy UPI ID"
                className="p-1 hover:bg-[#e3e8ee] rounded transition-colors"
              >
                {copiedVpa ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#64748d]" />
                )}
              </button>
            </div>

            {freelancer.mobile && (
              <div className="px-3 py-1.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#64748d] text-xs flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-[#64748d]" />
                <span className="font-mono text-[#0d253d]">{freelancer.mobile}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Checkout Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e3e8ee] stripe-shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e3e8ee]">
            <h2 className="text-sm font-semibold text-[#0d253d]">
              {confirmedPayment ? "Payment Receipt" : `Pay ${freelancer.name}`}
            </h2>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              0% Platform Fee
            </span>
          </div>

          {confirmedPayment ? (
            <PaymentConfirmedCard
              payment={confirmedPayment}
              showBackToProfile={false}
            />
          ) : (
            <>
              {payStep === "SELECT" && (
                <form onSubmit={handleStartPay} className="flex flex-col gap-4">
                  {/* Preset Amount Chips */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {presets.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedPreset(amt);
                            setCustomAmountRupees(amt.toString());
                          }}
                          className={`py-2 rounded-xl text-xs font-semibold tabular-money transition-all ${
                            selectedPreset === amt
                              ? "bg-[#533afd] text-white shadow-sm"
                              : "bg-[#f6f9fc] hover:bg-[#e3e8ee] text-[#273951] border border-[#e3e8ee]"
                          }`}
                        >
                          ₹{amt.toLocaleString("en-IN")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      Or Enter Custom Amount (INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-base font-semibold text-[#64748d]">₹</span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={customAmountRupees}
                        onChange={(e) => {
                          setCustomAmountRupees(e.target.value);
                          setSelectedPreset(0);
                        }}
                        placeholder="e.g. 2500"
                        className="w-full h-11 pl-8 pr-4 rounded-xl border border-[#cbd5e1] text-base font-medium tabular-money text-[#0d253d] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Optional Note */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      Note or Project Reference (Optional)
                    </label>
                    <input
                      type="text"
                      value={clientNote}
                      onChange={(e) => setClientNote(e.target.value)}
                      placeholder="e.g. Logo design advance or consultation call"
                      className="w-full h-10 px-3.5 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all font-medium"
                    />
                  </div>

                  {errorMsg && <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>}

                  <button
                    type="submit"
                    className="w-full btn-stripe-primary !py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Proceed to Pay {formatINR(currentAmountPaise)}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {payStep === "PAY_QR" && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                    <div>
                      <span className="text-xs text-[#64748d]">Amount Due:</span>
                      <div className="text-xl font-semibold text-[#0d253d] tabular-money">
                        {formatINR(currentAmountPaise)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPayStep("SELECT")}
                      className="text-xs text-[#533afd] hover:underline font-medium flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Amount</span>
                    </button>
                  </div>

                  {/* Vector QR & PNG Download */}
                  <div className="flex flex-col items-center">
                    <VectorQR
                      upiUri={upiUri}
                      payeeName={freelancer.name}
                      amountFormatted={formatINR(currentAmountPaise)}
                      size={200}
                    />
                  </div>

                  {/* Pay Now Mobile Deep-Link */}
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handlePayNowMobile}
                      className="w-full btn-stripe-primary !py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Pay {formatINR(currentAmountPaise)} via UPI App</span>
                    </button>

                    {deviceHint && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{deviceHint}</span>
                      </div>
                    )}
                  </div>

                  {/* UTR Verification Submission */}
                  <div className="border-t border-[#e3e8ee] pt-3">
                    <span className="text-xs font-semibold text-[#0d253d] block mb-1">
                      Step 2: Enter 12-Digit UTR
                    </span>
                    <p className="text-[11px] text-[#64748d] mb-3">
                      After completing the payment in your UPI app, submit the 12-digit UTR reference so {freelancer.name} can verify your payment.
                    </p>

                    <UtrSubmissionBox
                      freelancerId={freelancer.id}
                      amountPaise={currentAmountPaise}
                      note={clientNote || `Payment to ${freelancer.name}`}
                      onSuccess={(utr, paymentId) => {
                        setClientUtr(utr);
                        if (paymentId) setActivePaymentId(paymentId);
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-lg text-center text-xs text-[#64748d] pt-6 flex items-center justify-center gap-1.5 print:hidden">
        <span>Powered by</span>
        <Link href="/" className="inline-flex items-center hover:opacity-85 transition-opacity">
          <img src="/full-logo.png" alt="AINPAY" className="h-4 w-auto object-contain" />
        </Link>
        <span>— Direct 0% Fee Payments</span>
      </footer>
    </div>
  );
}
