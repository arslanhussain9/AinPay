"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Send, AlertCircle } from "lucide-react";
import { validateUTR } from "@/lib/utils";

interface UtrSubmissionBoxProps {
  sessionId?: string;
  campaignId: string;
  amountPaise: number;
  onSuccess?: (utr: string) => void;
}

export function UtrSubmissionBox({
  sessionId,
  campaignId,
  amountPaise,
  onSuccess,
}: UtrSubmissionBoxProps) {
  const [utrInput, setUtrInput] = useState<string>("");
  const [payerName, setPayerName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "submitted" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isValid = validateUTR(utrInput);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/v1/verify/utr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          campaignId,
          utr: utrInput.trim(),
          amountPaise,
          payerName: payerName.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("submitted");
        onSuccess?.(utrInput.trim());
      } else {
        setStatus("error");
        setErrorMessage(data.error?.message || "Failed to submit UTR. Please verify the 12 digits.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "submitted") {
    return (
      <div className="w-full p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center text-center gap-1.5">
        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        <h4 className="text-sm font-semibold text-[#0d253d]">UTR Logged Successfully</h4>
        <p className="text-xs text-[#273951]">
          Reference: <span className="font-mono font-medium text-[#533afd]">{utrInput}</span>
        </p>
        <p className="text-[11px] text-[#64748d] mt-1">
          Your seat is reserved. Waiting for merchant verification or background observer sync.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2.5 p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#0d253d]">
          Step 2: Confirm Payment (Mode A)
        </span>
        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-[#e3e8ee] text-[#64748d] font-mono">
          Zero-Infra UTR
        </span>
      </div>

      <p className="text-xs text-[#64748d]">
        Paid via UPI? Enter the 12-digit UPI Reference Number / UTR shown on your receipt screen:
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 mt-1">
        <input
          type="text"
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
          placeholder="Your Full Name (optional)"
          className="w-full px-3 py-2 text-xs rounded-md bg-white border border-[#a8c3de] text-[#0d253d] placeholder-[#64748d] focus:outline-none focus:border-[#533afd] transition-colors"
        />

        <div className="relative">
          <input
            type="text"
            maxLength={12}
            value={utrInput}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, "");
              setUtrInput(cleaned);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="Enter 12-digit UTR (e.g. 429182736451)"
            className={`w-full px-3 py-2 text-xs font-mono rounded-md bg-white border ${
              isValid
                ? "border-[#533afd] text-[#0d253d]"
                : "border-[#a8c3de] text-[#0d253d]"
            } placeholder-[#64748d] focus:outline-none focus:border-[#533afd] transition-colors tracking-widest`}
          />
          <div className="absolute right-3 top-2.5 text-[11px] font-mono text-[#64748d]">
            {utrInput.length}/12
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full btn-stripe-primary !py-2 text-xs disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>{loading ? "Verifying..." : "Submit 12-Digit UTR"}</span>
        </button>
      </form>
    </div>
  );
}
