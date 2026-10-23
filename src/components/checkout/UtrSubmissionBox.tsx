"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Send, AlertCircle } from "lucide-react";
import { validateUTR } from "@/lib/utils";

interface UtrSubmissionBoxProps {
  paymentLinkId?: string;
  freelancerId: string;
  amountPaise: number;
  note?: string;
  defaultPayerName?: string;
  onSuccess?: (utr: string, paymentId?: string) => void;
}

export function UtrSubmissionBox({
  paymentLinkId,
  freelancerId,
  amountPaise,
  note,
  defaultPayerName = "",
  onSuccess,
}: UtrSubmissionBoxProps) {
  const [utr, setUtr] = useState("");
  const [payerName, setPayerName] = useState(defaultPayerName);
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
        onSuccess?.(utr.trim(), data.data?.paymentId);
      } else {
        setError(data.error || "Verification failed. Check the 12-digit UTR.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col items-center text-center gap-1.5 animate-fade-in">
        <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Payment Logged</span>
        </div>
        <p className="text-xs text-[#273951] font-mono">
          Ref: <span className="font-semibold text-[#533afd]">{utr}</span>
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-[#64748d] mt-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Listening for settlement confirmation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#0d253d]">Confirm Transaction</span>
        <span className="text-[10px] text-[#64748d] font-mono">12-Digit UTR</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          required
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
          placeholder="Your Name"
          className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#a8c3de] text-[#0d253d] placeholder-[#64748d] focus:outline-none focus:border-[#533afd]"
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
            placeholder="Enter 12-digit UTR"
            className={`w-full px-3 py-2 text-xs font-mono rounded-lg bg-white border ${
              isValid ? "border-[#533afd]" : "border-[#a8c3de]"
            } text-[#0d253d] placeholder-[#64748d] focus:outline-none focus:border-[#533afd] tracking-wider`}
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
          className="w-full btn-stripe-primary !py-2 text-xs disabled:opacity-50 mt-0.5"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>{loading ? "Verifying..." : "Confirm Payment"}</span>
        </button>
      </form>
    </div>
  );
}
