"use client";

import React, { useState } from "react";
import { formatINR, rupeesToPaise } from "@/lib/utils";
import {
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Layers,
  Lock,
  Plus,
  Shield,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  freelancer: any;
  paymentLinks: any[];
  payments: any[];
  totalEarningsPaise: number;
  feesSavedPaise: number;
}

export function DashboardClient({
  freelancer,
  paymentLinks: initialLinks,
  payments: initialPayments,
  totalEarningsPaise: initialEarnings,
  feesSavedPaise: initialFeesSaved,
}: DashboardClientProps) {
  const [payments, setPayments] = useState(initialPayments);
  const [paymentLinks, setPaymentLinks] = useState(initialLinks);
  const [totalEarningsPaise, setTotalEarningsPaise] = useState(initialEarnings);
  const [feesSavedPaise, setFeesSavedPaise] = useState(initialFeesSaved);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // New Link Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newAmountRupees, setNewAmountRupees] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newMaxSlots, setNewMaxSlots] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  // 1-Tap Approve Payment
  const handleApprove = async (paymentId: string) => {
    setActionInProgress(paymentId);
    try {
      const res = await fetch(`/api/v1/payments/${paymentId}/approve`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setPayments((prev) =>
          prev.map((p) =>
            p.id === paymentId ? { ...p, status: "APPROVED", approvedAt: new Date() } : p
          )
        );
        const approved = payments.find((p) => p.id === paymentId);
        if (approved) {
          setTotalEarningsPaise((prev) => prev + approved.amountPaise);
          setFeesSavedPaise((prev) => prev + Math.round(approved.amountPaise * 0.0236));
        }
      } else {
        alert(data.error || "Failed to approve payment");
      }
    } catch {
      alert("Network error approving payment");
    } finally {
      setActionInProgress(null);
    }
  };

  // 1-Tap Decline Payment
  const handleDecline = async (paymentId: string) => {
    if (!confirm("Are you sure you want to decline this payment claim?")) return;
    setActionInProgress(paymentId);
    try {
      const res = await fetch(`/api/v1/payments/${paymentId}/decline`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setPayments((prev) =>
          prev.map((p) => (p.id === paymentId ? { ...p, status: "DECLINED" } : p))
        );
      } else {
        alert(data.error || "Failed to decline payment");
      }
    } catch {
      alert("Network error declining payment");
    } finally {
      setActionInProgress(null);
    }
  };

  // Create New Payment Link
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) return;

    setIsCreatingLink(true);
    try {
      const amountPaise = newAmountRupees ? rupeesToPaise(parseFloat(newAmountRupees)) : null;
      const res = await fetch("/api/v1/links/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId: freelancer.id,
          title: newTitle.trim(),
          slug: newSlug.trim(),
          description: newDescription.trim() || undefined,
          amountPaise,
          maxSlots: newMaxSlots ? parseInt(newMaxSlots, 10) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPaymentLinks([data.data.paymentLink, ...paymentLinks]);
        setIsModalOpen(false);
        setNewTitle("");
        setNewSlug("");
        setNewAmountRupees("");
        setNewDescription("");
        setNewMaxSlots("");
      } else {
        alert(data.error || "Failed to create payment link");
      }
    } catch {
      alert("Network error creating payment link");
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const pendingPayments = payments.filter((p) => p.status === "PENDING");
  const approvedPayments = payments.filter((p) => p.status === "APPROVED");

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#0d253d] flex flex-col font-normal">
      {/* Top Header */}
      <header className="bg-white border-b border-[#e3e8ee] px-6 py-4 sticky top-0 z-30 stripe-shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#533afd] text-white flex items-center justify-center font-bold text-base shadow-sm">
                P
              </div>
              <span className="font-bold text-lg tracking-tight text-[#0d253d]">PayMe</span>
            </Link>
            <span className="text-[#e3e8ee] text-sm">/</span>
            <div className="flex items-center gap-1.5 text-xs text-[#64748d]">
              <span>Portal</span>
              <span>•</span>
              <strong className="text-[#0d253d]">{freelancer.name}</strong>
            </div>
          </div>

          <Link
            href={`/pay/${freelancer.username}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] text-xs text-[#273951] font-medium transition-colors"
          >
            <span>payme.in/pay/{freelancer.username}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#64748d]" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium">
              <span>Total Earnings (0% Fees)</span>
              <Wallet className="w-4 h-4 text-[#533afd]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-normal text-[#0d253d] tabular-money tracking-tight">
                {formatINR(totalEarningsPaise)}
              </div>
              <div className="text-xs text-emerald-700 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>100% Direct into {freelancer.vpa}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#b9b9f9] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#4434d4] text-xs font-medium">
              <span>PG Fees Saved (vs 2.36%)</span>
              <Shield className="w-4 h-4" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-normal text-[#533afd] tabular-money tracking-tight">
                {formatINR(feesSavedPaise)}
              </div>
              <div className="text-xs text-[#64748d] mt-1 font-light">
                Kept 100% in your pocket
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium">
              <span>Active Payment Links</span>
              <Layers className="w-4 h-4 text-[#533afd]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-normal text-[#0d253d] tabular-money tracking-tight">
                {paymentLinks.length}
              </div>
              <div className="text-xs text-[#64748d] mt-1 font-light">
                Project milestone invoices & QRs
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium">
              <span>Pending Verifications</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-normal text-[#0d253d] tabular-money tracking-tight">
                {pendingPayments.length}
              </div>
              <div className="text-xs text-amber-700 mt-1 font-medium">
                {pendingPayments.length > 0 ? "Requires your 1-tap review" : "All payments verified"}
              </div>
            </div>
          </div>
        </div>

        {/* Pending Client Payments Requiring 1-Tap Approval */}
        {pendingPayments.length > 0 && (
          <div className="bg-amber-50/60 rounded-xl p-6 border border-amber-200 stripe-shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <h2 className="text-sm font-semibold text-amber-950">
                  Client Payments Awaiting Your 1-Tap Approval ({pendingPayments.length})
                </h2>
              </div>
              <span className="text-xs text-amber-800">
                Check bank SMS on your phone, then tap approve
              </span>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-amber-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e3e8ee] bg-[#f6f9fc] text-[#64748d]">
                    <th className="py-3 px-4 font-medium">Client Name</th>
                    <th className="py-3 px-4 font-medium">Project / Note</th>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">12-Digit UTR</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8ee]">
                  {pendingPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f6f9fc]">
                      <td className="py-3 px-4 font-medium text-[#0d253d]">
                        {p.payerName}
                        {p.payerPhone && (
                          <span className="block text-[11px] text-[#64748d] font-normal">{p.payerPhone}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#273951]">
                        {p.note || p.paymentLink?.title || "Direct payment"}
                      </td>
                      <td className="py-3 px-4 font-normal text-[#0d253d] tabular-money font-mono">
                        {formatINR(p.amountPaise)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#533afd] tracking-wider font-medium">
                        {p.utrNumber}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleApprove(p.id)}
                          disabled={actionInProgress === p.id}
                          className="btn-stripe-primary !py-1.5 !px-3 text-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{actionInProgress === p.id ? "Approving..." : "Approve"}</span>
                        </button>
                        <button
                          onClick={() => handleDecline(p.id)}
                          disabled={actionInProgress === p.id}
                          className="px-2.5 py-1.5 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium"
                        >
                          Decline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Links & Invoices */}
        <div className="bg-white rounded-xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-light tracking-[-0.26px] text-[#0d253d]">
                Your Payment Links & Project Invoices
              </h2>
              <p className="text-xs text-[#64748d] font-light">
                Share these links with clients to collect deposits, milestones, or service fees.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-stripe-primary !py-2 !px-4 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Payment Link</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentLinks.map((link) => {
              const isClosed =
                link.status === "CLOSED" ||
                (link.maxSlots && link.usedSlots >= link.maxSlots);
              const remaining = link.maxSlots ? Math.max(0, link.maxSlots - link.usedSlots) : null;
              const publicUrl = `http://localhost:3000/p/${link.slug}`;

              return (
                <div
                  key={link.id}
                  className="p-5 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-[#0d253d] line-clamp-1">{link.title}</h3>
                      {isClosed ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Closed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#b9b9f9]/40 text-[#4434d4]">
                          Active
                        </span>
                      )}
                    </div>

                    {link.amountPaise ? (
                      <div className="text-lg font-normal text-[#0d253d] tabular-money mt-1">
                        {formatINR(link.amountPaise)}
                      </div>
                    ) : (
                      <div className="text-sm text-[#64748d] font-light mt-1">Custom Client Amount</div>
                    )}

                    {link.description && (
                      <p className="text-xs text-[#64748d] font-light line-clamp-2 mt-1">
                        {link.description}
                      </p>
                    )}

                    {link.maxSlots && (
                      <div className="text-[11px] text-amber-700 font-medium mt-1">
                        Slots: {link.usedSlots} / {link.maxSlots} booked ({remaining} left)
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#e3e8ee]">
                    <button
                      onClick={() => handleCopy(publicUrl, link.id)}
                      className="flex items-center gap-1 text-xs text-[#64748d] hover:text-[#0d253d] transition-colors"
                    >
                      {copiedLink === link.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedLink === link.id ? "Copied!" : "Copy Link"}</span>
                    </button>

                    <Link
                      href={`/p/${link.slug}`}
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

        {/* Live Verified Payment Ledger */}
        <div className="bg-white rounded-xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-light tracking-[-0.26px] text-[#0d253d]">
              Approved Payments Ledger
            </h2>
            <span className="text-xs text-[#64748d] tabular-money">
              {approvedPayments.length} payments received
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e3e8ee] text-[#64748d]">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Invoice / Note</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">12-Digit UTR</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8ee]">
                {approvedPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#f6f9fc]">
                    <td className="py-3 text-[#64748d] font-mono text-[11px]">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="py-3 text-[#0d253d] font-medium">{p.payerName}</td>
                    <td className="py-3 text-[#273951]">{p.note || p.paymentLink?.title || "Direct payment"}</td>
                    <td className="py-3 font-normal text-[#0d253d] tabular-money font-mono">
                      {formatINR(p.amountPaise)}
                    </td>
                    <td className="py-3 font-mono text-[#533afd] tracking-wider">
                      {p.utrNumber}
                    </td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Credited T+0
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal: Create New Payment Link */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0d253d]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e3e8ee] w-full max-w-md p-6 stripe-shadow-lg animate-fade-in relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8ee]">
              <h3 className="text-sm font-semibold text-[#0d253d]">
                Create New Project Payment Link
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748d] hover:text-[#0d253d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLink} className="flex flex-col gap-3.5 mt-4">
              <div>
                <label className="text-xs text-[#64748d] mb-1 block">Title / Project Milestone</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                    }
                  }}
                  placeholder="e.g. Website Design 50% Advance"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                />
              </div>

              <div>
                <label className="text-xs text-[#64748d] mb-1 block">URL Slug (`payme.in/p/...`)</label>
                <input
                  type="text"
                  required
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="e.g. website-advance"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                />
              </div>

              <div>
                <label className="text-xs text-[#64748d] mb-1 block">Amount in INR (leave blank for open custom amount)</label>
                <input
                  type="number"
                  value={newAmountRupees}
                  onChange={(e) => setNewAmountRupees(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                />
              </div>

              <div>
                <label className="text-xs text-[#64748d] mb-1 block">Max Bookings / Slots (Optional)</label>
                <input
                  type="number"
                  value={newMaxSlots}
                  onChange={(e) => setNewMaxSlots(e.target.value)}
                  placeholder="e.g. 5 (leave blank for unlimited)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                />
              </div>

              <div>
                <label className="text-xs text-[#64748d] mb-1 block">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Deliverables or terms for this milestone..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-[#64748d] hover:text-[#0d253d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingLink}
                  className="btn-stripe-primary !py-2 !px-4 text-xs"
                >
                  <span>{isCreatingLink ? "Creating..." : "Create Link"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
