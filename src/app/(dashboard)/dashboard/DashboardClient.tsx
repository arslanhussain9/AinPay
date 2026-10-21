"use client";

import React, { useState } from "react";
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
  const [profile, setProfile] = useState(initialFreelancer);
  const [payments, setPayments] = useState(initialPayments);
  const [paymentLinks, setPaymentLinks] = useState(initialLinks);
  const [totalEarningsPaise, setTotalEarningsPaise] = useState(initialEarnings);
  // Retained calculation for separate analytics / earnings section
  const [feesSavedPaise, setFeesSavedPaise] = useState(initialFeesSaved);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      window.location.href = "/login";
    }
  };

  // Link Modal State
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

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editVpa, setEditVpa] = useState(profile.vpa);
  const [editMobile, setEditMobile] = useState(profile.mobile || "");
  const [editTitle, setEditTitle] = useState(profile.title || "");
  const [editBio, setEditBio] = useState(profile.bio || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

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
                  ? { ...l, status: "CLOSED", usedSlots: l.usedSlots + 1 }
                  : l
              )
            );
          }
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
    if (!confirm("Decline this payment reference?")) return;
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

  // Save Profile Changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editVpa.trim()) return;

    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/v1/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId: profile.id,
          name: editName.trim(),
          vpa: editVpa.trim(),
          mobile: editMobile.trim() || undefined,
          title: editTitle.trim() || undefined,
          bio: editBio.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProfile(data.data.freelancer);
        setIsProfileModalOpen(false);
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch {
      alert("Network error updating profile");
    } finally {
      setIsSavingProfile(false);
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

  const pendingPayments = payments.filter((p) => p.status === "PENDING");
  const approvedPayments = payments.filter((p) => p.status === "APPROVED");
  const activeLinks = paymentLinks.filter((l) => l.status === "ACTIVE");

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#0d253d] flex flex-col font-normal">
      {/* Top Header */}
      <header className="bg-white border-b border-[#e3e8ee] px-6 py-4 sticky top-0 z-30 stripe-shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img
                src="/full-logo.png"
                alt="AinPay"
                className="h-6 w-auto object-contain"
              />
            </Link>
            <span className="text-[#e3e8ee] text-sm">/</span>
            <div className="flex items-center gap-1.5 text-xs text-[#64748d]">
              <strong className="text-[#0d253d] font-medium">{profile.name}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/account"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e3e8ee] hover:border-[#a8c3de] text-xs text-[#273951] font-medium transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#533afd]" />
              <span>Account Settings</span>
            </Link>

            <Link
              href={`/pay/${profile.username}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] text-xs text-[#273951] font-medium transition-colors"
            >
              <span>ainpay.in/pay/{profile.username}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#64748d]" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-xs text-rose-600 font-medium transition-colors"
              title="Sign out of account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-6">
        {/* Metric Cards Row: Simplified to 3 core metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Amount Received */}
          <div className="bg-white rounded-xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium">
              <span>Amount Received</span>
              <Wallet className="w-4 h-4 text-[#533afd]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-normal text-[#0d253d] tabular-money tracking-tight">
                {formatINR(totalEarningsPaise)}
              </div>
              <div className="text-xs text-emerald-700 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Settled to {profile.vpa}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Active Links */}
          <div className="bg-white rounded-xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium">
              <span>Active Links</span>
              <Layers className="w-4 h-4 text-[#533afd]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-normal text-[#0d253d] tabular-money tracking-tight">
                {activeLinks.length}
              </div>
              <div className="text-xs text-[#64748d] mt-1 font-light">
                Currently open and accepting payment
              </div>
            </div>
          </div>

          {/* Card 3: Pending Approvals */}
          <div className="bg-white rounded-xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium">
              <span>Pending Approvals</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-normal text-[#0d253d] tabular-money tracking-tight">
                {pendingPayments.length}
              </div>
              <div className="text-xs text-amber-700 mt-1 font-medium">
                {pendingPayments.length > 0 ? "Awaiting merchant approval" : "All payments verified"}
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals Table */}
        {pendingPayments.length > 0 && (
          <div className="bg-amber-50/60 rounded-xl p-6 border border-amber-200 stripe-shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-semibold text-amber-950">
                  Pending Approvals ({pendingPayments.length})
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-amber-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e3e8ee] bg-[#f6f9fc] text-[#64748d]">
                    <th className="py-3 px-4 font-medium">Customer / Client</th>
                    <th className="py-3 px-4 font-medium">Item / Note</th>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">UTR</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8ee]">
                  {pendingPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f6f9fc]">
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

        {/* Payment Links Section */}
        <div className="bg-white rounded-xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium text-[#0d253d]">Payment Links</h2>
              <p className="text-xs text-[#64748d]">Single-use invoice links generated for customers</p>
            </div>

            <button
              onClick={() => {
                resetLinkModal();
                setIsModalOpen(true);
              }}
              className="btn-stripe-primary !py-2 !px-4 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Payment Link</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentLinks.map((link) => {
              const isClosed = link.status === "CLOSED";
              const publicUrl =
                typeof window !== "undefined"
                  ? `${window.location.origin}/p/${link.slug}`
                  : `http://localhost:3000/p/${link.slug}`;

              const displayCustomer = link.customerName || link.title;

              return (
                <div
                  key={link.id}
                  className="p-5 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-[#0d253d] line-clamp-1">
                        {displayCustomer}
                      </h3>
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

                    {/* Customer contact info */}
                    {(link.customerPhone || link.customerEmail) && (
                      <div className="flex items-center gap-2 text-[11px] text-[#64748d]">
                        {link.customerPhone && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3" />
                            {link.customerPhone}
                          </span>
                        )}
                        {link.customerEmail && (
                          <span className="flex items-center gap-1 truncate max-w-[140px]">
                            <Mail className="w-3 h-3" />
                            {link.customerEmail}
                          </span>
                        )}
                      </div>
                    )}

                    {link.amountPaise ? (
                      <div className="text-lg font-normal text-[#0d253d] tabular-money mt-1">
                        {formatINR(link.amountPaise)}
                      </div>
                    ) : (
                      <div className="text-sm text-[#64748d] font-light mt-1">Open Amount</div>
                    )}

                    {link.description && (
                      <p className="text-xs text-[#64748d] font-light line-clamp-2 mt-0.5">
                        {link.description}
                      </p>
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
                      <span>{copiedLink === link.id ? "Copied" : "Copy"}</span>
                    </button>

                    <Link
                      href={`/p/${link.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 text-xs text-[#533afd] hover:underline font-medium"
                    >
                      <span>Open</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions Ledger */}
        <div className="bg-white rounded-xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-[#0d253d]">Transactions</h2>
            <span className="text-xs text-[#64748d] tabular-money">
              {approvedPayments.length} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e3e8ee] text-[#64748d]">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Customer / Client</th>
                  <th className="pb-3 font-medium">Note</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">UTR</th>
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
                    <td className="py-3 text-[#273951]">{p.note || p.paymentLink?.title || "Direct"}</td>
                    <td className="py-3 font-normal text-[#0d253d] tabular-money font-mono">
                      {formatINR(p.amountPaise)}
                    </td>
                    <td className="py-3 font-mono text-[#533afd] tracking-wider">
                      {p.utrNumber}
                    </td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Credited
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal: Edit Profile */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0d253d]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e3e8ee] w-full max-w-md p-6 stripe-shadow-lg animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8ee]">
              <h3 className="text-sm font-semibold text-[#0d253d]">
                Customize Profile
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-[#64748d] hover:text-[#0d253d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3 mt-4">
              <div>
                <label className="text-xs text-[#64748d] mb-1 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                />
              </div>

              <div>
                <label className="text-xs text-[#64748d] mb-1 block">UPI ID / VPA (Payments settle directly here)</label>
                <input
                  type="text"
                  required
                  value={editVpa}
                  onChange={(e) => setEditVpa(e.target.value)}
                  placeholder="yourname@bank"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                />
              </div>

              <div>
                <label className="text-xs text-[#64748d] mb-1 block">Merchant Mobile Number (Shown on invoices)</label>
                <input
                  type="tel"
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                />
              </div>

              <div>
                <label className="text-xs text-[#64748d] mb-1 block">Title / Profession</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Product Designer & Developer"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                />
              </div>

              <div>
                <label className="text-xs text-[#64748d] mb-1 block">Bio / Summary</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell clients about what you do..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                />
              </div>



              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-[#64748d] hover:text-[#0d253d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn-stripe-primary !py-2 !px-4 text-xs"
                >
                  <span>{isSavingProfile ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Payment Link Form / Immediate Shareable URL */}
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

            {/* View A: Success / Shareable URL View */}
            {generatedLink ? (
              <div className="flex flex-col gap-4 mt-4 animate-fade-in">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center text-center gap-1.5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <h4 className="text-sm font-semibold text-[#0d253d]">
                    Link Ready for {generatedLink.customerName}
                  </h4>
                  <div className="text-xl font-medium text-[#0d253d] tabular-money mt-0.5">
                    {formatINR(generatedLink.amountPaise)}
                  </div>
                  {(generatedLink.customerPhone || generatedLink.customerEmail) && (
                    <span className="text-[11px] text-[#64748d]">
                      {[generatedLink.customerPhone, generatedLink.customerEmail]
                        .filter(Boolean)
                        .join(" • ")}
                    </span>
                  )}
                </div>

                {/* Shareable Link Box */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#0d253d] flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-[#533afd]" />
                    <span>Shareable Payment Link:</span>
                  </label>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#f6f9fc] border border-[#a8c3de]">
                    <span className="text-xs font-mono text-[#0d253d] truncate flex-1 select-all px-1">
                      {typeof window !== "undefined"
                        ? `${window.location.origin}/p/${generatedLink.slug}`
                        : `http://localhost:3000/p/${generatedLink.slug}`}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyGeneratedUrl(
                          typeof window !== "undefined"
                            ? `${window.location.origin}/p/${generatedLink.slug}`
                            : `http://localhost:3000/p/${generatedLink.slug}`
                        )
                      }
                      className="px-3 py-1.5 rounded-md bg-[#533afd] text-white hover:bg-[#4434d4] text-xs font-medium flex items-center gap-1 shrink-0 transition-colors"
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

                <div className="p-2.5 rounded-lg bg-[#f6f9fc] border border-[#e3e8ee] text-[11px] text-[#64748d] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#533afd] shrink-0" />
                  <span>Single-use link: automatically locks after one successful payment.</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e3e8ee]">
                  <button
                    type="button"
                    onClick={resetLinkModal}
                    className="px-3 py-1.5 rounded-lg border border-[#e3e8ee] hover:bg-[#f6f9fc] text-xs font-medium text-[#273951]"
                  >
                    + Create Another Link
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/p/${generatedLink.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg border border-[#533afd] text-[#533afd] hover:bg-[#533afd]/5 text-xs font-medium flex items-center gap-1"
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
                      className="btn-stripe-primary !py-1.5 !px-4 text-xs"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* View B: Link Creation Form */
              <form onSubmit={handleCreateLink} className="flex flex-col gap-3 mt-4">
                {/* 1. Customer Name (Required) */}
                <div>
                  <label className="text-xs text-[#64748d] mb-1 block">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                  />
                </div>

                {/* 2. Fixed Amount (Required, Mandatory) */}
                <div>
                  <label className="text-xs text-[#64748d] mb-1 block">
                    Fixed Amount (INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-semibold text-[#64748d]">₹</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={amountRupees}
                      onChange={(e) => setAmountRupees(e.target.value)}
                      placeholder="1500"
                      className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                    />
                  </div>
                  <span className="text-[10px] text-[#64748d] mt-0.5 block">
                    Exact amount requested. Customer cannot alter this.
                  </span>
                </div>

                {/* 3. Customer Contact: Mobile or Email (At least one required) */}
                <div className="p-3 rounded-lg bg-[#f6f9fc] border border-[#e3e8ee] flex flex-col gap-2.5">
                  <span className="text-xs font-medium text-[#0d253d]">
                    Customer Contact <span className="text-rose-500">*</span>
                    <span className="text-[11px] text-[#64748d] font-normal block">
                      Provide at least one contact method (Mobile or Email)
                    </span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#64748d] mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#533afd]" />
                        <span>Mobile Number</span>
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#64748d] mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#533afd]" />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="rahul@example.com"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Description (Optional) */}
                <div>
                  <label className="text-xs text-[#64748d] mb-1 block">
                    Description <span className="text-[#64748d] font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Website redesign advance, consultation slot, or invoice terms..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                  />
                </div>

                {formError && (
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="p-2.5 rounded-lg bg-[#f6f9fc] border border-[#e3e8ee] text-[11px] text-[#64748d] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#533afd] shrink-0" />
                  <span>Unique URL slug is automatically generated in the background.</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetLinkModal();
                    }}
                    className="px-3.5 py-2 text-xs text-[#64748d] hover:text-[#0d253d]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingLink}
                    className="btn-stripe-primary !py-2 !px-4 text-xs"
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
