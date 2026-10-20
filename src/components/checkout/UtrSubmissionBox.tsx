"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Send, AlertCircle } from "lucide-react";
import { validateUTR } from "@/lib/utils";

interface UtrSubmissionBoxProps {
  paymentLinkId?: string;
  freelancerId: string;
  amountPaise: number;
  note?: string;
  onSuccess?: (utr: string) => void;
}

export function UtrSubmissionBox({
  paymentLinkId,
  freelancerId,
  amountPaise,
  note,
  onSuccess,
}: UtrSubmissionBoxProps) {
  const [utr, setUtr] = useState("");
  const [payerName, setPayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const isValid = validateUTR(utr);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !payerName.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId,
          paymentLinkId,
          utr: utr.trim(),
          amountPaise,
          payerName: payerName.trim(),
          note: note?.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        onSuccess?.(utr.trim());
      } else {
        setError(data.error || "Submission failed. Please check the 12-digit UTR.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center text-center gap-1.5 animate-fade-in">
        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        <h4 className="text-sm font-semibold text-[#0d253d]">Payment Logged Successfully</h4>
        <p className="text-xs text-[#273951]">
          Reference: <span className="font-mono font-medium text-[#533afd]">{utr}</span>
        </p>
        <p className="text-[11px] text-[#64748d] mt-1">
          The freelancer will 1-tap verify this payment upon checking their bank SMS.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2.5 p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#0d253d]">
          Confirm Payment (Enter 12-Digit UTR)
        </span>
        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-[#e3e8ee] text-[#64748d] font-mono">
          Direct Bank
        </span>
      </div>

      <p className="text-xs text-[#64748d]">
        Paid via UPI? Enter your name and the 12-digit Reference Number (UTR) from your receipt:
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 mt-1">
        <input
          type="text"
          required
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
          placeholder="Your Full Name (Client Name)"
          className="w-full px-3 py-2 text-xs rounded-md bg-white border border-[#a8c3de] text-[#0d253d] placeholder-[#64748d] focus:outline-none focus:border-[#533afd] transition-colors"
        />

        <div className="relative">
          <input
            type="text"
            required
            maxLength={12}
            value={utr}
            onChange={(e) => {
              setUtr(e.target.value.replace(/\D/g, ""));
              if (error) setError("");
            }}
            placeholder="12-digit UTR (e.g. 429182736451)"
            className={`w-full px-3 py-2 text-xs font-mono rounded-md bg-white border ${
              isValid ? "border-[#533afd]" : "border-[#a8c3de]"
            } text-[#0d253d] placeholder-[#64748d] focus:outline-none focus:border-[#533afd] tracking-widest`}
          />
          <span className="absolute right-3 top-2.5 text-[11px] font-mono text-[#64748d]">
            {utr.length}/12
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || !payerName.trim() || loading}
          className="w-full btn-stripe-primary !py-2 text-xs disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>{loading ? "Submitting..." : "Submit 12-Digit UTR"}</span>
        </button>
      </form>
    </div>
  );
}
