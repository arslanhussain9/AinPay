"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/utils";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Flame,
  Layers,
  Lock,
  Shield,
  Smartphone,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  merchant: any;
  campaigns: any[];
  transactions: any[];
  observerDevice: any;
  totalVolumePaise: number;
  feesSavedPaise: number;
}

export function DashboardClient({
  merchant,
  campaigns: initialCampaigns,
  transactions: initialTransactions,
  observerDevice,
  totalVolumePaise,
  feesSavedPaise,
}: DashboardClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleApprove = async (txnId: string) => {
    setApprovingId(txnId);
    try {
      const res = await fetch(`/api/v1/transactions/${txnId}/approve`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === txnId ? { ...t, status: "VERIFIED" } : t))
        );
        window.location.reload();
      } else {
        alert(data.error?.message || "Failed to approve transaction");
      }
    } catch (err) {
      alert("Network error approving transaction");
    } finally {
      setApprovingId(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const pendingTxns = transactions.filter((t) => t.status === "PENDING");
  const verifiedTxns = transactions.filter((t) => t.status === "VERIFIED");

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#0d253d] flex flex-col">
      {/* Top Stripe Chrome Navigation Bar */}
      <header className="bg-white border-b border-[#e3e8ee] px-6 py-4 sticky top-0 z-30 stripe-shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#533afd] text-white flex items-center justify-center font-bold text-sm">
                Q
              </div>
              <span className="font-bold text-base text-[#0d253d] tracking-tight">
                QuickUPI
              </span>
            </Link>

            <span className="text-[#e3e8ee] text-sm">/</span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#0d253d]">
                {merchant.businessName || merchant.name}
              </span>
              <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-[#b9b9f9]/40 text-[#4434d4]">
                {merchant.tier} Plan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/pay/${merchant.handle}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] text-xs text-[#273951] font-medium transition-colors"
            >
              <span>quickupi.in/pay/{merchant.handle}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#64748d]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-6">
        {/* Metric Cards Row (Stripe Clean Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Volume */}
          <div className="bg-white rounded-xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium">
              <span>Total Volume Settled</span>
              <Wallet className="w-4 h-4 text-[#533afd]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-normal text-[#0d253d] tabular-money tracking-tight">
                {formatINR(totalVolumePaise)}
              </div>
              <div className="text-xs text-emerald-700 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>100% Direct to {merchant.vpa}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Fees Saved (Stripe Primary Highlight) */}
          <div className="bg-white rounded-xl p-5 border border-[#b9b9f9] stripe-shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-[#4434d4] text-xs font-medium">
              <span>PG Fees Saved (vs 2.36%)</span>
              <Shield className="w-4 h-4" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-normal text-[#533afd] tabular-money tracking-tight">
                {formatINR(feesSavedPaise)}
              </div>
              <div className="text-xs text-[#64748d] mt-1 font-light">
                Zero 2% gateway commission deducted
              </div>
            </div>
          </div>

          {/* Card 3: Active Limit Campaigns */}
          <div className="bg-white rounded-xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium">
              <span>Active Limit QRs</span>
              <Layers className="w-4 h-4 text-[#533afd]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-normal text-[#0d253d] tabular-money tracking-tight">
                {campaigns.length}
              </div>
              <div className="text-xs text-[#64748d] mt-1 font-light">
                Automated cap & seat locks
              </div>
            </div>
          </div>

          {/* Card 4: Observer Device Status */}
          <div className="bg-white rounded-xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium">
              <span>Android Observer Node</span>
              <Smartphone className="w-4 h-4 text-[#533afd]" />
            </div>
            <div className="mt-3">
              {observerDevice ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-semibold text-[#0d253d]">Listening & Active</span>
                  </div>
                  <div className="text-xs text-[#64748d] mt-1 flex items-center gap-2 font-light">
                    <span>{observerDevice.deviceName.split("(")[0]}</span>
                    <span>• {observerDevice.batteryPct}% batt</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm font-semibold text-amber-700">Not Paired</div>
                  <div className="text-xs text-[#64748d] mt-1">Mode A Active (Manual UTR)</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section: Pending Verifications (Mode A) */}
        {pendingTxns.length > 0 && (
          <div className="bg-amber-50/50 rounded-xl p-6 border border-amber-200 stripe-shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-semibold text-amber-950">
                  Pending Mode A Verifications ({pendingTxns.length})
                </h2>
              </div>
              <span className="text-xs text-amber-800">
                Customer submitted UTR • Tap to approve & decrement slot
              </span>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-amber-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e3e8ee] bg-[#f6f9fc] text-[#64748d]">
                    <th className="py-3 px-4 font-medium">Payer</th>
                    <th className="py-3 px-4 font-medium">Campaign</th>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">12-Digit UTR</th>
                    <th className="py-3 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8ee]">
                  {pendingTxns.map((txn) => (
                    <tr key={txn.id} className="hover:bg-[#f6f9fc]">
                      <td className="py-3 px-4 font-medium text-[#0d253d]">
                        {txn.payerName || "Direct Payer"}
                        {txn.payerPhone && (
                          <span className="block text-[11px] text-[#64748d] font-normal">{txn.payerPhone}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#273951]">{txn.campaign?.title}</td>
                      <td className="py-3 px-4 font-normal text-[#0d253d] tabular-money">
                        {formatINR(txn.amountPaise)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#533afd] tracking-wider">
                        {txn.utrNumber}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleApprove(txn.id)}
                          disabled={approvingId === txn.id}
                          className="btn-stripe-primary !py-1.5 !px-3 text-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{approvingId === txn.id ? "Approving..." : "1-Tap Approve"}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section: Smart Limit Campaigns */}
        <div className="bg-white rounded-xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-light tracking-[-0.26px] text-[#0d253d]">
                Smart Limit Campaigns
              </h2>
              <p className="text-xs text-[#64748d] font-light">
                Reusable QRs with dynamic collection caps and automatic seat locking
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((camp) => {
              const isLocked =
                camp.status === "SLOTS_EXHAUSTED" ||
                camp.status === "CAP_REACHED" ||
                (camp.maxSlots !== null && camp.usedSlots >= camp.maxSlots);
              const remaining = camp.maxSlots ? Math.max(0, camp.maxSlots - camp.usedSlots) : null;
              const publicUrl = `http://localhost:3000/r/${camp.slug}`;

              return (
                <div
                  key={camp.id}
                  className="p-5 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-[#0d253d]">{camp.title}</h3>
                      {isLocked ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Locked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#b9b9f9]/40 text-[#4434d4]">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg font-normal text-[#0d253d] tabular-money">
                        {formatINR(camp.amountPaise)}
                      </span>
                      <span className="text-xs text-[#64748d] font-light">per transaction lock</span>
                    </div>

                    {/* Limit progress */}
                    <div className="mt-2 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs text-[#64748d]">
                        <span>
                          Slots: <strong className="text-[#0d253d] tabular-money">{camp.usedSlots}</strong> / {camp.maxSlots}
                        </span>
                        <span className={remaining === 0 ? "text-rose-700 font-semibold" : "text-amber-700 font-medium"}>
                          {remaining !== null ? `${remaining} remaining` : "Unlimited"}
                        </span>
                      </div>
                      {camp.maxSlots && (
                        <div className="w-full h-1.5 rounded-full bg-[#e3e8ee] overflow-hidden">
                          <div
                            className={`h-full ${isLocked ? "bg-rose-500" : "bg-[#533afd]"}`}
                            style={{
                              width: `${Math.min(100, (camp.usedSlots / camp.maxSlots) * 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#e3e8ee]">
                    <button
                      onClick={() => handleCopy(publicUrl, camp.id)}
                      className="flex items-center gap-1.5 text-xs text-[#64748d] hover:text-[#0d253d] transition-colors"
                    >
                      {copiedLink === camp.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedLink === camp.id ? "Link Copied!" : "Copy Checkout Link"}</span>
                    </button>

                    <Link
                      href={`/r/${camp.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 text-xs text-[#533afd] hover:underline font-medium"
                    >
                      <span>Open Checkout</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Live Transaction Ledger (High-Density Stripe Table) */}
        <div className="bg-white rounded-xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-light tracking-[-0.26px] text-[#0d253d]">
              Live Transaction Ledger
            </h2>
            <span className="text-xs text-[#64748d] tabular-money">
              {verifiedTxns.length} verified transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e3e8ee] text-[#64748d]">
                  <th className="pb-3 font-medium">Timestamp</th>
                  <th className="pb-3 font-medium">Payer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Mode</th>
                  <th className="pb-3 font-medium">12-Digit UTR</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8ee]">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#f6f9fc]">
                    <td className="py-3 text-[#64748d] font-mono text-[11px]">
                      {new Date(txn.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 text-[#0d253d] font-medium">
                      {txn.payerName || "Direct UPI Payer"}
                    </td>
                    <td className="py-3 font-normal text-[#0d253d] tabular-money">
                      {formatINR(txn.amountPaise)}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#f6f9fc] border border-[#e3e8ee] text-[#273951]">
                        {txn.verificationMode}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-[#533afd] tracking-wider">
                      {txn.utrNumber || "—"}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          txn.status === "VERIFIED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
