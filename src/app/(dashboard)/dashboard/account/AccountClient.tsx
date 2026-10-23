"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  QrCode,
  Lock,
  Phone,
  Briefcase,
  FileText,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  LogOut,
  Sparkles,
} from "lucide-react";

interface AccountClientProps {
  freelancer: any;
}

export function AccountClient({ freelancer: initialFreelancer }: AccountClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialFreelancer);

  // Profile Form State
  const [name, setName] = useState(initialFreelancer.name || "");
  const [vpa, setVpa] = useState(initialFreelancer.vpa || "");
  const [mobile, setMobile] = useState(initialFreelancer.mobile || "");
  const [title, setTitle] = useState(initialFreelancer.title || "");
  const [bio, setBio] = useState(initialFreelancer.bio || "");

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Copy Handle State
  const [copiedLink, setCopiedLink] = useState(false);

  const fullPayUrl = typeof window !== "undefined"
    ? `${window.location.origin}/pay/${profile.username}`
    : `https://ainpay.in/pay/${profile.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullPayUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!name.trim()) {
      setProfileMessage({ type: "error", text: "Name cannot be empty." });
      return;
    }
    if (!vpa.trim() || !vpa.includes("@")) {
      setProfileMessage({ type: "error", text: "Please enter a valid UPI ID (e.g. yourname@okhdfcbank)." });
      return;
    }

    try {
      setIsSavingProfile(true);
      const res = await fetch("/api/v1/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId: profile.id,
          name: name.trim(),
          vpa: vpa.trim().toLowerCase(),
          mobile: mobile.trim() || null,
          title: title.trim() || null,
          bio: bio.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setProfile(data.data.freelancer);
      setProfileMessage({ type: "success", text: "Account details updated successfully!" });
      setTimeout(() => setProfileMessage(null), 4000);
    } catch (err: any) {
      setProfileMessage({ type: "error", text: err.message || "An error occurred." });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword) {
      setPasswordMessage({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      setIsSavingPassword(true);
      const res = await fetch("/api/v1/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to change password.");
      }

      setPasswordMessage({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMessage(null), 4000);
    } catch (err: any) {
      setPasswordMessage({ type: "error", text: err.message || "An error occurred." });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0d253d] flex flex-col font-normal selection:bg-[#b9b9f9] selection:text-[#533afd]">
      {/* Top Header */}
      <header className="bg-white border-b border-[#e3e8ee] px-4 sm:px-6 py-4 sticky top-0 z-30 stripe-shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img src="/full-logo.png" alt="AINPAY" className="h-6 w-auto object-contain" />
            </Link>
            <span className="text-[#e3e8ee] text-sm">/</span>
            <Link href="/dashboard" className="text-xs text-[#64748d] hover:text-[#0d253d] transition-colors font-medium">
              Dashboard
            </Link>
            <span className="text-[#e3e8ee] text-sm">/</span>
            <span className="text-xs font-semibold text-[#0d253d]">Account Settings</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] text-xs text-[#273951] font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#64748d]" />
              <span>Back to Dashboard</span>
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
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Page Title & Profile Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0d253d]">
              Account Settings
            </h1>
            <p className="text-sm text-[#64748d] mt-1">
              Manage your merchant profile, UPI settlement details, and account security.
            </p>
          </div>

          {/* Quick Public Link Card */}
          <div className="flex items-center gap-2 p-2 px-3.5 rounded-xl bg-white border border-[#e2e8f0] shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-[#64748d]">Personal Page:</span>
            <span className="text-xs font-mono font-medium text-[#0d253d]">/pay/{profile.username}</span>
            <button
              onClick={handleCopyLink}
              className="ml-1 p-1 hover:bg-[#f1f5f9] rounded text-[#64748d] hover:text-[#0d253d] transition-colors"
              title="Copy public payment link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <Link
              href={`/pay/${profile.username}`}
              target="_blank"
              className="p-1 hover:bg-[#f1f5f9] rounded text-[#64748d] hover:text-[#533afd] transition-colors"
              title="View public payment page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Navigation / Overview */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#533afd] text-white flex items-center justify-center font-bold text-xl shadow-md mb-3">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-base font-bold text-[#0d253d]">{profile.name}</h2>
              <p className="text-xs text-[#533afd] font-mono mt-0.5">@{profile.username}</p>
              <p className="text-xs text-[#64748d] mt-2 leading-relaxed">
                {profile.title || "Independent Merchant / Creator"}
              </p>

              <div className="mt-4 pt-4 border-t border-[#f1f5f9] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#64748d]">
                  <span>Member Since</span>
                  <span className="text-[#0d253d] font-medium">
                    {new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#64748d]">
                  <span>Platform Fee</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                    0% Forever
                  </span>
                </div>
              </div>
            </div>

            {/* UPI Direct Settlement Info Banner */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-[#eef2ff] to-[#f8fafc] border border-[#e0e7ff] text-xs">
              <div className="flex items-center gap-2 text-[#4338ca] font-semibold mb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#533afd]" />
                <span>Direct Bank Settlement</span>
              </div>
              <p className="text-[#64748d] leading-relaxed text-[11px]">
                Payments made by clients transfer directly to your verified UPI ID instantly without third-party wallet holding or merchant settlement delays.
              </p>
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="md:col-span-2 space-y-6">
            {/* 1. Merchant Profile Details */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e2e8f0] shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9] mb-5">
                <div>
                  <h3 className="text-base font-bold text-[#0d253d]">Merchant Profile</h3>
                  <p className="text-xs text-[#64748d] mt-0.5">
                    Your business identity shown to clients on personal pay pages and invoices.
                  </p>
                </div>
              </div>

              {profileMessage && (
                <div
                  className={`mb-5 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    profileMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${profileMessage.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
                  <span>{profileMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      Full Name / Business Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all font-medium"
                      />
                      <User className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-3.5" />
                    </div>
                  </div>

                  {/* Username (Fixed) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      Username / Handle
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={`@${profile.username}`}
                        disabled
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-xs text-[#64748d] font-mono cursor-not-allowed"
                      />
                      <span className="text-[#94a3b8] font-bold text-xs absolute left-3 top-3">@</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* UPI ID / VPA */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      Primary UPI ID (Where money is credited) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={vpa}
                        onChange={(e) => setVpa(e.target.value)}
                        required
                        placeholder="yourname@bank"
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all font-mono font-medium"
                      />
                      <QrCode className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-3.5" />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      Mobile Number (Shown on invoice receipts)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all"
                      />
                      <Phone className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-3.5" />
                    </div>
                  </div>
                </div>

                {/* Email Address (View Only) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-xs text-[#64748d] cursor-not-allowed"
                    />
                    <Mail className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-3.5" />
                  </div>
                </div>

                {/* Title / Profession */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Title / Profession
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Fullstack Engineer, Design Consultant, Video Editor"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all"
                    />
                    <Briefcase className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-3.5" />
                  </div>
                </div>

                {/* Bio / Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    About / Bio Summary
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell clients about what you do, your services, or your company..."
                      className="w-full p-3 pl-9 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all leading-relaxed"
                    />
                    <FileText className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-5 py-2.5 rounded-xl bg-[#533afd] hover:bg-[#4338ca] text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Profile Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Security & Password */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e2e8f0] shadow-sm">
              <div className="pb-4 border-b border-[#f1f5f9] mb-5">
                <h3 className="text-base font-bold text-[#0d253d]">Security & Password</h3>
                <p className="text-xs text-[#64748d] mt-0.5">
                  Update your account password to keep your dashboard secure.
                </p>
              </div>

              {passwordMessage && (
                <div
                  className={`mb-5 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    passwordMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${passwordMessage.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all"
                    />
                    <Lock className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all"
                      />
                      <Lock className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        required
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all"
                      />
                      <Lock className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-3.5" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="px-5 py-2.5 rounded-xl bg-[#0d253d] hover:bg-[#1a365d] text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    {isSavingPassword ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
