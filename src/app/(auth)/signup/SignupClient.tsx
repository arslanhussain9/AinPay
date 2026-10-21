"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, QrCode, Lock, Eye, EyeOff, Loader2, Sparkles, Phone } from "lucide-react";

export function SignupClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [vpa, setVpa] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanHandle = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!cleanHandle || cleanHandle.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!vpa.trim() || !vpa.includes("@")) {
      setError("Please enter a valid UPI ID (e.g. name@okaxis, name@upi).");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          username: cleanHandle,
          email: email.trim().toLowerCase(),
          vpa: vpa.trim().toLowerCase(),
          mobile: mobile.trim() || null,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Signup failed. Please try again.");
      }

      // Successful signup & session created
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#b9b9f9] selection:text-[#533afd]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#eef2ff] to-transparent pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748d] hover:text-[#0d253d] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to AINPAY</span>
        </Link>

        <div className="text-center mb-6">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <img
              src="/full-logo.png"
              alt="AinPay"
              className="h-9 w-auto mx-auto object-contain"
            />
          </Link>
          <h2 className="text-[22px] font-bold tracking-tight text-[#0d253d] mt-3">
            Create your merchant account
          </h2>
          <p className="mt-1.5 text-sm text-[#64748d]">
            Start accepting direct UPI payments into your bank account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px] px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#e2e8f0] rounded-2xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Arslan Hussain"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#cbd5e1] text-sm text-[#0d253d] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#533afd] focus:ring-4 focus:ring-[#533afd]/10 transition-all"
                  required
                />
                <User className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Username / Handle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Username (Your Profile Link) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-semibold text-[#94a3b8]">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="arslan"
                  className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-[#cbd5e1] text-sm text-[#0d253d] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#533afd] focus:ring-4 focus:ring-[#533afd]/10 transition-all font-mono"
                  required
                />
              </div>
              {cleanHandle && (
                <p className="mt-1 text-[11px] text-[#64748d]">
                  Your public link: <span className="font-mono text-[#533afd] font-semibold">ainpay.in/pay/{cleanHandle}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arslan@example.com"
                  autoComplete="email"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#cbd5e1] text-sm text-[#0d253d] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#533afd] focus:ring-4 focus:ring-[#533afd]/10 transition-all"
                  required
                />
                <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* UPI ID */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Your UPI ID (Where money is credited) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={vpa}
                  onChange={(e) => setVpa(e.target.value)}
                  placeholder="arslan@okhdfcbank"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#cbd5e1] text-sm text-[#0d253d] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#533afd] focus:ring-4 focus:ring-[#533afd]/10 transition-all font-mono"
                  required
                />
                <QrCode className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-3.5" />
              </div>
              <p className="mt-1 text-[11px] text-[#64748d]">
                Funds are credited directly to this UPI ID instantly.
              </p>
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Mobile Number <span className="text-[#94a3b8] font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#cbd5e1] text-sm text-[#0d253d] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#533afd] focus:ring-4 focus:ring-[#533afd]/10 transition-all"
                />
                <Phone className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Create Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-[#cbd5e1] text-sm text-[#0d253d] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#533afd] focus:ring-4 focus:ring-[#533afd]/10 transition-all"
                  required
                />
                <Lock className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#94a3b8] hover:text-[#0d253d] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#533afd] hover:bg-[#4338ca] text-white font-semibold text-sm shadow-[0_2px_8px_rgba(83,58,253,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed !mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Complete Free Registration</span>
              )}
            </button>
          </form>

          {/* Social Auth Coming Soon Notice */}
          <div className="mt-6 pt-5 border-t border-[#f1f5f9]">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-center justify-center text-[11px] text-[#64748d]">
              <Sparkles className="w-3.5 h-3.5 text-[#533afd] shrink-0" />
              <span>Upcoming: Google & Mobile OTP Authentication</span>
            </div>
          </div>

          {/* Switch to Login */}
          <div className="mt-6 text-center text-xs text-[#64748d]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#533afd] hover:underline"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
