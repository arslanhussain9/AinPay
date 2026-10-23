"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatINR, rupeesToPaise } from "@/lib/utils";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Layers,
  Lock,
  Mail,
  Phone,
  Plus,
  TrendingUp,
  User,
  Wallet,
  X,
  AlertCircle,
  Share2,
  LogOut,
  Calendar,
  BarChart3,
  ShieldCheck,
  Slash,
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
  freelancer: initialFreelancer,
  paymentLinks: initialLinks,
  payments: initialPayments,
  totalEarningsPaise: initialEarnings,
  feesSavedPaise: initialFeesSaved,
}: DashboardClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialFreelancer);
  const [payments, setPayments] = useState(initialPayments);
  const [paymentLinks, setPaymentLinks] = useState(initialLinks);
  const [totalEarningsPaise, setTotalEarningsPaise] = useState(initialEarnings);
  const [feesSavedPaise, setFeesSavedPaise] = useState(initialFeesSaved);

  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Link Filter tab: "ALL" | "ACTIVE" | "CLOSED"
  const [linkFilter, setLinkFilter] = useState<"ALL" | "ACTIVE" | "CLOSED">("ALL");

  // Analytics Date Filter: "7D" | "30D" | "ALL"
  const [analyticsPeriod, setAnalyticsPeriod] = useState<"7D" | "30D" | "ALL">("30D");
  const [hoveredBar, setHoveredBar] = useState<{ label: string; amount: number; count: number } | null>(null);

  // Close Link Confirmation Modal State
  const [linkToClose, setLinkToClose] = useState<any | null>(null);
  const [isClosingLink, setIsClosingLink] = useState(false);

  // New Link Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [amountRupees, setAmountRupees] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<any | null>(null);
  const [copiedGenerated, setCopiedGenerated] = useState(false);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      window.location.href = "/login";
    }
  };

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
          // If payment was for a link, update that link's status to CLOSED
          if (approved.paymentLinkId) {
            setPaymentLinks((prev) =>
              prev.map((l) =>
                l.id === approved.paymentLinkId
                  ? { ...l, status: "CLOSED", usedSlots: (l.usedSlots || 0) + 1 }
                  : l
              )
            );
          }
        }
        setStatusFeedback({ type: "success", text: "Payment verified and credited to your account!" });
        setTimeout(() => setStatusFeedback(null), 4000);
      } else {
        setStatusFeedback({ type: "error", text: data.error || "Failed to approve payment" });
      }
    } catch {
      setStatusFeedback({ type: "error", text: "Network error approving payment." });
    } finally {
      setActionInProgress(null);
    }
  };

  // 1-Tap Decline Payment
  const handleDecline = async (paymentId: string) => {
    if (!confirm("Decline this payment reference?")) return;
    setActionInProgress(paymentId);
    try {
      const res = await fetch(`/api/v1/payments/${paymentId}/decline`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setPayments((prev) =>
          prev.map((p) => (p.id === paymentId ? { ...p, status: "DECLINED" } : p))
        );
        setStatusFeedback({ type: "success", text: "Payment submission declined." });
        setTimeout(() => setStatusFeedback(null), 4000);
      } else {
        setStatusFeedback({ type: "error", text: data.error || "Failed to decline payment" });
      }
    } catch {
      setStatusFeedback({ type: "error", text: "Network error declining payment." });
    } finally {
      setActionInProgress(null);
    }
  };

  // Close Payment Link action
  const handleConfirmCloseLink = async () => {
    if (!linkToClose) return;
    setIsClosingLink(true);

    try {
      const res = await fetch(`/api/v1/links/${linkToClose.id}/close`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to close payment link.");
      }

      setPaymentLinks((prev) =>
        prev.map((l) =>
          l.id === linkToClose.id ? { ...l, status: "CLOSED" } : l
        )
      );

      setStatusFeedback({
        type: "success",
        text: `Payment link for "${linkToClose.customerName || linkToClose.title}" has been closed.`,
      });
      setTimeout(() => setStatusFeedback(null), 4000);
      setLinkToClose(null);
    } catch (err: any) {
      setStatusFeedback({
        type: "error",
        text: err.message || "Failed to close link. Please try again.",
      });
    } finally {
      setIsClosingLink(false);
    }
  };

  // Reset link modal fields
  const resetLinkModal = () => {
    setCustomerName("");
    setAmountRupees("");
    setCustomerPhone("");
    setCustomerEmail("");
    setDescription("");
    setFormError("");
    setGeneratedLink(null);
    setCopiedGenerated(false);
  };

  // Create New Payment Link
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!customerName.trim()) {
      setFormError("Customer Name is required.");
      return;
    }

    const amt = parseFloat(amountRupees);
    if (isNaN(amt) || amt <= 0) {
      setFormError("Please enter a valid positive payment amount.");
      return;
    }

    if (!customerPhone.trim() && !customerEmail.trim()) {
      setFormError("Please provide at least one contact method: Mobile Number or Email Address.");
      return;
    }

    setIsCreatingLink(true);
    try {
      const amountPaise = rupeesToPaise(amt);
      const res = await fetch("/api/v1/links/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId: profile.id,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim() || undefined,
          customerEmail: customerEmail.trim() || undefined,
          amountPaise,
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPaymentLinks([data.data.paymentLink, ...paymentLinks]);
        setGeneratedLink(data.data.paymentLink);
      } else {
        setFormError(data.error || "Failed to create payment link");
      }
    } catch {
      setFormError("Network error creating payment link");
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCopyGeneratedUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedGenerated(true);
    setTimeout(() => setCopiedGenerated(false), 2000);
  };

  // Filtered lists
  const pendingPayments = payments.filter((p) => p.status === "PENDING");
  const approvedPayments = payments.filter((p) => p.status === "APPROVED");
  const activeLinks = paymentLinks.filter((l) => l.status === "ACTIVE");

  const displayedLinks = useMemo(() => {
    if (linkFilter === "ACTIVE") return paymentLinks.filter((l) => l.status === "ACTIVE");
    if (linkFilter === "CLOSED") return paymentLinks.filter((l) => l.status === "CLOSED");
    return paymentLinks;
  }, [paymentLinks, linkFilter]);

  // Transaction Analytics Calculation (Real DB Data)
  const analyticsData = useMemo(() => {
    const now = new Date();
    let numDays = 30;
    if (analyticsPeriod === "7D") numDays = 7;
    else if (analyticsPeriod === "ALL") numDays = 90;

    // Generate day buckets
    const buckets: { [dateStr: string]: { date: Date; label: string; amountPaise: number; count: number } } = {};

    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      buckets[key] = { date: d, label, amountPaise: 0, count: 0 };
    }

    let periodVolumePaise = 0;
    let periodCount = 0;

    approvedPayments.forEach((p) => {
      const pDate = new Date(p.approvedAt || p.createdAt);
      const key = pDate.toISOString().slice(0, 10);
      if (buckets[key]) {
        buckets[key].amountPaise += p.amountPaise;
        buckets[key].count += 1;
        periodVolumePaise += p.amountPaise;
        periodCount += 1;
      } else if (analyticsPeriod === "ALL") {
        // If older than 90 days in ALL mode, we can still count towards total
        periodVolumePaise += p.amountPaise;
        periodCount += 1;
      }
    });

    const chartPoints = Object.values(buckets);
    const maxAmountPaise = Math.max(...chartPoints.map((b) => b.amountPaise), 100000); // minimum scale ₹1,000

    return {
      chartPoints,
      periodVolumePaise,
      periodCount,
      maxAmountPaise,
    };
  }, [approvedPayments, analyticsPeriod]);

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#0d253d] flex flex-col font-normal selection:bg-[#b9b9f9] selection:text-[#533afd]">
      {/* Top Header */}
      <header className="bg-white border-b border-[#e3e8ee] px-4 sm:px-6 py-4 sticky top-0 z-30 stripe-shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img
                src="/full-logo.png"
                alt="AINPAY"
                className="h-6 w-auto object-contain"
              />
            </Link>
            <span className="text-[#e3e8ee] text-sm hidden sm:inline">/</span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#64748d]">
              <strong className="text-[#0d253d] font-semibold">{profile.name}</strong>
              <span className="text-[#64748d]">({profile.vpa})</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/account"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e3e8ee] hover:border-[#a8c3de] text-xs text-[#273951] font-medium transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#533afd]" />
              <span className="hidden sm:inline">Account Settings</span>
              <span className="sm:hidden">Settings</span>
            </Link>

            <Link
              href={`/pay/${profile.username}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] text-xs text-[#273951] font-medium transition-colors"
            >
              <span className="hidden sm:inline">/pay/{profile.username}</span>
              <span className="sm:hidden">Public Page</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#64748d]" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-xs text-rose-600 font-medium transition-colors"
              title="Sign out of account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Status Toast Banner */}
        {statusFeedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between gap-2 animate-fade-in ${
              statusFeedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusFeedback.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
              <span>{statusFeedback.text}</span>
            </div>
            <button
              onClick={() => setStatusFeedback(null)}
              className="text-[#64748d] hover:text-[#0d253d] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Header / Primary Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e3e8ee]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0d253d]">
              Merchant Dashboard
            </h1>
            <p className="text-xs text-[#64748d] mt-1">
              Direct UPI payment collections and real-time transaction tracking for <strong className="text-[#0d253d]">{profile.name}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                resetLinkModal();
                setIsModalOpen(true);
              }}
              className="btn-stripe-primary text-xs !py-2.5 !px-4 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Payment Link</span>
            </button>
          </div>
        </div>

        {/* 1. Summary Cards (Priority 3: Exactly 3 metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Amount Received */}
          <div className="bg-white rounded-2xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#64748d] text-xs font-semibold uppercase tracking-wider">
              <span>Amount Received</span>
              <div className="w-8 h-8 rounded-lg bg-[#533afd]/10 text-[#533afd] flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-light text-[#0d253d] tabular-money tracking-tight">
                {formatINR(totalEarningsPaise)}
              </div>
              <div className="text-xs text-emerald-700 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Settled to {profile.vpa}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Active Links */}
          <div className="bg-white rounded-2xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#64748d] text-xs font-semibold uppercase tracking-wider">
              <span>Active Links</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-light text-[#0d253d] tabular-money tracking-tight">
                {activeLinks.length}
              </div>
              <div className="text-xs text-[#64748d] mt-1">
                Currently open to accept payments
              </div>
            </div>
          </div>

          {/* Card 3: Pending Approvals */}
          <div className="bg-white rounded-2xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#64748d] text-xs font-semibold uppercase tracking-wider">
              <span>Pending Approvals</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-light text-[#0d253d] tabular-money tracking-tight">
                {pendingPayments.length}
              </div>
              <div className="text-xs mt-1 font-medium">
                {pendingPayments.length > 0 ? (
                  <span className="text-amber-700">Awaiting merchant review</span>
                ) : (
                  <span className="text-emerald-700">All submissions verified</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Transaction Analytics Section (Priority 3 Requirement 8) */}
        <div className="bg-white rounded-2xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f1f5f9]">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#533afd]" />
                <h2 className="text-base font-semibold text-[#0d253d]">
                  Transaction Analytics
                </h2>
              </div>
              <p className="text-xs text-[#64748d] mt-0.5">
                Real revenue volume and transaction activity over time
              </p>
            </div>

            {/* Period Filters */}
            <div className="flex items-center gap-1 bg-[#f6f9fc] p-1 rounded-xl border border-[#e3e8ee] self-start sm:self-auto text-xs">
              <button
                type="button"
                onClick={() => setAnalyticsPeriod("7D")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  analyticsPeriod === "7D"
                    ? "bg-white text-[#533afd] shadow-sm font-semibold"
                    : "text-[#64748d] hover:text-[#0d253d]"
                }`}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsPeriod("30D")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  analyticsPeriod === "30D"
                    ? "bg-white text-[#533afd] shadow-sm font-semibold"
                    : "text-[#64748d] hover:text-[#0d253d]"
                }`}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsPeriod("ALL")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  analyticsPeriod === "ALL"
                    ? "bg-white text-[#533afd] shadow-sm font-semibold"
                    : "text-[#64748d] hover:text-[#0d253d]"
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Metric Summary Strip for Period */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] text-xs">
            <div>
              <span className="text-[#64748d] block text-[11px]">Period Revenue</span>
              <span className="text-lg font-semibold text-[#0d253d] tabular-money">
                {formatINR(analyticsData.periodVolumePaise)}
              </span>
            </div>

            <div>
              <span className="text-[#64748d] block text-[11px]">Approved Payments</span>
              <span className="text-lg font-semibold text-[#0d253d] tabular-money">
                {analyticsData.periodCount}
              </span>
            </div>

            <div>
              <span className="text-[#64748d] block text-[11px]">Platform Fee</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ₹0.00 (100% Retained)
              </span>
            </div>

            <div>
              <span className="text-[#64748d] block text-[11px]">Benchmark Gateway Fees Saved</span>
              <span className="text-xs font-semibold text-[#533afd] bg-[#533afd]/10 px-2.5 py-1 rounded-full">
                {formatINR(Math.round(analyticsData.periodVolumePaise * 0.0236))}
              </span>
            </div>
          </div>

          {/* Responsive SVG Bar Chart or Empty State */}
          {analyticsData.periodVolumePaise > 0 ? (
            <div className="relative pt-2">
              {hoveredBar && (
                <div className="absolute top-0 right-4 bg-[#0d253d] text-white text-[11px] px-3 py-1.5 rounded-lg shadow-md pointer-events-none flex items-center gap-2">
                  <span className="font-medium">{hoveredBar.label}:</span>
                  <span className="font-semibold text-emerald-400 tabular-money">
                    {formatINR(hoveredBar.amount)}
                  </span>
                  <span className="text-white/60">({hoveredBar.count} payment{hoveredBar.count !== 1 ? "s" : ""})</span>
                </div>
              )}

              <div className="h-44 sm:h-52 w-full flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-1 border-b border-[#e3e8ee]">
                {analyticsData.chartPoints.map((point, pIdx) => {
                  const heightPercent = point.amountPaise > 0
                    ? Math.max(12, Math.round((point.amountPaise / analyticsData.maxAmountPaise) * 100))
                    : 4;

                  return (
                    <div
                      key={pIdx}
                      className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredBar({
                          label: point.label,
                          amount: point.amountPaise,
                          count: point.count,
                        })
                      }
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[28px] rounded-t transition-all ${
                          point.amountPaise > 0
                            ? "bg-[#533afd] hover:bg-[#4434d4] group-hover:scale-y-105"
                            : "bg-[#e2e8f0]/60 hover:bg-[#cbd5e1]"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between text-[10px] text-[#64748d] font-mono pt-2 px-1">
                <span>{analyticsData.chartPoints[0]?.label}</span>
                <span>{analyticsData.chartPoints[Math.floor(analyticsData.chartPoints.length / 2)]?.label}</span>
                <span>{analyticsData.chartPoints[analyticsData.chartPoints.length - 1]?.label}</span>
              </div>
            </div>
          ) : (
            /* Genuine Empty State */
            <div className="py-12 px-4 rounded-xl bg-[#f8fafc] border border-dashed border-[#cbd5e1] text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748d] mb-3">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#0d253d]">
                No approved transactions in this period
              </h3>
              <p className="text-xs text-[#64748d] max-w-sm mt-1">
                Transactions approved by you during this timeframe will automatically appear here with exact revenue trends.
              </p>
              <button
                onClick={() => {
                  resetLinkModal();
                  setIsModalOpen(true);
                }}
                className="mt-4 text-xs font-semibold text-[#533afd] hover:underline flex items-center gap-1"
              >
                <span>+ Create a Payment Link</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Pending Approvals Section (Highlighted when items exist) */}
        {pendingPayments.length > 0 && (
          <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200 stripe-shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                <h2 className="text-sm font-bold text-amber-950">
                  Pending Approvals ({pendingPayments.length})
                </h2>
              </div>
              <span className="text-xs text-amber-800">
                Verify bank SMS before approving
              </span>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border border-amber-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e3e8ee] bg-[#f8fafc] text-[#64748d]">
                    <th className="py-3 px-4 font-semibold">Customer / Client</th>
                    <th className="py-3 px-4 font-semibold">Note / Item</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">UTR Reference</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8ee]">
                  {pendingPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f6f9fc] transition-colors">
                      <td className="py-3 px-4 font-medium text-[#0d253d]">
                        <div>{p.payerName}</div>
                        {(p.payerPhone || p.payerEmail) && (
                          <div className="text-[11px] text-[#64748d] font-normal">
                            {p.payerPhone || p.payerEmail}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#273951]">
                        {p.note || p.paymentLink?.title || "Direct payment"}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#0d253d] tabular-money font-mono">
                        {formatINR(p.amountPaise)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#533afd] tracking-wider font-semibold">
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
                          className="px-2.5 py-1.5 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium transition-colors"
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

        {/* 4. Payment Links Management (Priority 4 Requirements 10 & 11) */}
        <div className="bg-white rounded-2xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#533afd]" />
                <h2 className="text-base font-semibold text-[#0d253d]">
                  Payment Links
                </h2>
              </div>
              <p className="text-xs text-[#64748d] mt-0.5">
                Single-use invoice links created for customers ({paymentLinks.length} total)
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#f6f9fc] p-1 rounded-xl border border-[#e3e8ee] text-xs">
              <button
                type="button"
                onClick={() => setLinkFilter("ALL")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  linkFilter === "ALL"
                    ? "bg-white text-[#533afd] shadow-sm font-semibold"
                    : "text-[#64748d] hover:text-[#0d253d]"
                }`}
              >
                All ({paymentLinks.length})
              </button>
              <button
                type="button"
                onClick={() => setLinkFilter("ACTIVE")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  linkFilter === "ACTIVE"
                    ? "bg-white text-[#533afd] shadow-sm font-semibold"
                    : "text-[#64748d] hover:text-[#0d253d]"
                }`}
              >
                Active ({activeLinks.length})
              </button>
              <button
                type="button"
                onClick={() => setLinkFilter("CLOSED")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  linkFilter === "CLOSED"
                    ? "bg-white text-[#533afd] shadow-sm font-semibold"
                    : "text-[#64748d] hover:text-[#0d253d]"
                }`}
              >
                Closed ({paymentLinks.length - activeLinks.length})
              </button>
            </div>
          </div>

          {/* Grid of Links */}
          {displayedLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedLinks.map((link) => {
                const isClosed = link.status === "CLOSED";
                const isPaid = (link.usedSlots || 0) >= 1;
                const publicUrl =
                  typeof window !== "undefined"
                    ? `${window.location.origin}/p/${link.slug}`
                    : `https://ainpay.in/p/${link.slug}`;

                const displayCustomer = link.customerName || link.title;

                return (
                  <div
                    key={link.id}
                    className="p-5 rounded-2xl bg-[#f8fafc] border border-[#e3e8ee] hover:border-[#a8c3de] transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      {/* Top Row: Customer Name & Status Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#0d253d] line-clamp-1">
                          {displayCustomer}
                        </h3>
                        {isClosed ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 shrink-0">
                            <Lock className="w-2.5 h-2.5" />
                            <span>{isPaid ? "Paid & Closed" : "Closed"}</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>

                      {/* Contact Info (if provided) */}
                      {(link.customerPhone || link.customerEmail) && (
                        <div className="flex items-center gap-2 text-[11px] text-[#64748d]">
                          {link.customerPhone && (
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-[#64748d]" />
                              {link.customerPhone}
                            </span>
                          )}
                          {link.customerEmail && (
                            <span className="flex items-center gap-1 truncate max-w-[130px]">
                              <Mail className="w-3 h-3 text-[#64748d]" />
                              {link.customerEmail}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Amount */}
                      <div className="text-xl font-semibold text-[#0d253d] tabular-money mt-1">
                        {formatINR(link.amountPaise || 0)}
                      </div>

                      {/* Description */}
                      {link.description && (
                        <p className="text-xs text-[#64748d] line-clamp-2 leading-relaxed">
                          {link.description}
                        </p>
                      )}

                      <div className="text-[10px] text-[#64748d] font-mono mt-1">
                        Created: {new Date(link.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#e3e8ee] text-xs">
                      {/* Copy Link */}
                      <button
                        type="button"
                        onClick={() => handleCopy(publicUrl, link.id)}
                        className="flex items-center gap-1 text-[#64748d] hover:text-[#0d253d] transition-colors font-medium"
                        title="Copy payment link URL"
                      >
                        {copiedLink === link.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedLink === link.id ? "Copied" : "Copy"}</span>
                      </button>

                      <div className="flex items-center gap-3">
                        {/* Close Link Action (if active) */}
                        {!isClosed && (
                          <button
                            type="button"
                            onClick={() => setLinkToClose(link)}
                            className="text-rose-600 hover:text-rose-800 text-xs font-medium hover:underline flex items-center gap-1"
                            title="Close link to prevent payment submissions"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Close Link</span>
                          </button>
                        )}

                        {/* View Link */}
                        <Link
                          href={`/p/${link.slug}`}
                          target="_blank"
                          className="flex items-center gap-1 text-[#533afd] hover:underline font-semibold"
                        >
                          <span>Open</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[#64748d]">
              No {linkFilter.toLowerCase()} payment links found.
            </div>
          )}
        </div>

        {/* 5. Recent Transactions Activity Ledger */}
        <div className="bg-white rounded-2xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#0d253d]">
                Recent Transactions
              </h2>
              <p className="text-xs text-[#64748d] mt-0.5">
                Approved and credited direct UPI payments ({approvedPayments.length} total)
              </p>
            </div>
          </div>

          {approvedPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e3e8ee] text-[#64748d] bg-[#f8fafc]">
                    <th className="py-3 px-3 font-semibold">Date</th>
                    <th className="py-3 px-3 font-semibold">Customer / Client</th>
                    <th className="py-3 px-3 font-semibold">Note / Item</th>
                    <th className="py-3 px-3 font-semibold">Amount</th>
                    <th className="py-3 px-3 font-semibold">UTR Reference</th>
                    <th className="py-3 px-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8ee]">
                  {approvedPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f6f9fc] transition-colors">
                      <td className="py-3 px-3 text-[#64748d] font-mono text-[11px]">
                        {new Date(p.approvedAt || p.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-3 text-[#0d253d] font-semibold">{p.payerName}</td>
                      <td className="py-3 px-3 text-[#273951]">
                        {p.note || p.paymentLink?.title || "Direct payment"}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#0d253d] tabular-money font-mono">
                        {formatINR(p.amountPaise)}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#533afd] tracking-wider font-semibold">
                        {p.utrNumber}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Credited
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[#64748d]">
              No approved payments yet. Completed payments will be listed here.
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal: Close Payment Link */}
      {linkToClose && (
        <div className="fixed inset-0 z-50 bg-[#0d253d]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e3e8ee] w-full max-w-md p-6 stripe-shadow-lg animate-fade-in relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#0d253d]">
                  Close Payment Link?
                </h3>
                <p className="text-xs text-[#64748d]">
                  {linkToClose.customerName || linkToClose.title}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#273951] leading-relaxed mb-6">
              Are you sure you want to close this link? Once closed, customers will no longer be able to submit payments through it. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e3e8ee]">
              <button
                type="button"
                onClick={() => setLinkToClose(null)}
                className="px-4 py-2 rounded-xl border border-[#e3e8ee] text-xs font-semibold text-[#273951] hover:bg-[#f6f9fc] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isClosingLink}
                onClick={handleConfirmCloseLink}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-60"
              >
                {isClosingLink ? "Closing..." : "Yes, Close Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Payment Link */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0d253d]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e3e8ee] w-full max-w-md p-6 stripe-shadow-lg animate-fade-in relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8ee]">
              <div>
                <h3 className="text-sm font-semibold text-[#0d253d]">
                  {generatedLink ? "Payment Link Created!" : "New Payment Link"}
                </h3>
                <p className="text-[11px] text-[#64748d]">
                  {generatedLink
                    ? "Share this single-use link with your customer"
                    : "Generate a personalized single-use payment link"}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetLinkModal();
                }}
                className="text-[#64748d] hover:text-[#0d253d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Generated Link Share View */}
            {generatedLink ? (
              <div className="flex flex-col gap-4 mt-4 animate-fade-in">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center text-center gap-1.5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <h4 className="text-sm font-semibold text-[#0d253d]">
                    Link Ready for {generatedLink.customerName}
                  </h4>
                  <div className="text-xl font-semibold text-[#0d253d] tabular-money mt-0.5">
                    {formatINR(generatedLink.amountPaise)}
                  </div>
                </div>

                {/* Shareable Link Box */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#0d253d] flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-[#533afd]" />
                    <span>Shareable Payment URL:</span>
                  </label>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#f6f9fc] border border-[#a8c3de]">
                    <span className="text-xs font-mono text-[#0d253d] truncate flex-1 select-all px-1">
                      {typeof window !== "undefined"
                        ? `${window.location.origin}/p/${generatedLink.slug}`
                        : `https://ainpay.in/p/${generatedLink.slug}`}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyGeneratedUrl(
                          typeof window !== "undefined"
                            ? `${window.location.origin}/p/${generatedLink.slug}`
                            : `https://ainpay.in/p/${generatedLink.slug}`
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#533afd] text-white hover:bg-[#4434d4] text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                    >
                      {copiedGenerated ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] text-[11px] text-[#64748d] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#533afd] shrink-0" />
                  <span>Single-use link: automatically closes after one approved payment.</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e3e8ee]">
                  <button
                    type="button"
                    onClick={resetLinkModal}
                    className="px-3 py-1.5 rounded-xl border border-[#e3e8ee] hover:bg-[#f6f9fc] text-xs font-medium text-[#273951]"
                  >
                    + Create Another
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/p/${generatedLink.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-xl border border-[#533afd] text-[#533afd] hover:bg-[#533afd]/5 text-xs font-medium flex items-center gap-1"
                    >
                      <span>Open Link</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        resetLinkModal();
                      }}
                      className="btn-stripe-primary !py-1.5 !px-4 text-xs font-semibold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Creation Form */
              <form onSubmit={handleCreateLink} className="flex flex-col gap-3.5 mt-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-1 block">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full h-10 px-3 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-1 block">
                    Fixed Amount (INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#64748d]">₹</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={amountRupees}
                      onChange={(e) => setAmountRupees(e.target.value)}
                      placeholder="1500"
                      className="w-full h-10 pl-8 pr-3 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 font-semibold tabular-money"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#0d253d]">
                    Customer Contact Details *
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Mobile (+91...)"
                        className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-1 block">
                    Payment Description <span className="text-[#64748d] font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Website advance payment, logo design deliverable..."
                    className="w-full p-2.5 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd] leading-relaxed"
                  />
                </div>

                {formError && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetLinkModal();
                    }}
                    className="px-3.5 py-2 text-xs text-[#64748d] hover:text-[#0d253d] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingLink}
                    className="btn-stripe-primary !py-2 !px-4 text-xs font-semibold"
                  >
                    <span>{isCreatingLink ? "Generating..." : "Generate Link"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
