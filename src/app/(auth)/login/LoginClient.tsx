"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, Eye, EyeOff, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

export function LoginClient() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError("Please enter your email or username.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      // Successful login
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#b9b9f9] selection:text-[#533afd]">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#eef2ff] to-transparent pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Top Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748d] hover:text-[#0d253d] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to AINPAY</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <img
              src="/full-logo.png"
              alt="AINPAY"
              className="h-8 w-auto mx-auto object-contain"
            />
          </Link>
          <h2 className="text-[22px] font-bold tracking-tight text-[#0d253d] mt-3">
            Sign in to your merchant dashboard
          </h2>
          <p className="mt-1.5 text-sm text-[#64748d]">
            Direct UPI payment links, zero transaction fees
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[440px] px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#e2e8f0] rounded-2xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="arslan or arslan@example.com"
                  autoComplete="username"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#cbd5e1] text-sm text-[#0d253d] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#533afd] focus:ring-4 focus:ring-[#533afd]/10 transition-all"
                  required
                />
                <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
              className="w-full h-11 rounded-xl bg-[#533afd] hover:bg-[#4338ca] text-white font-semibold text-sm shadow-[0_2px_8px_rgba(83,58,253,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Social Auth Coming Soon Notice */}
          <div className="mt-6 pt-5 border-t border-[#f1f5f9]">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-center justify-center text-[11px] text-[#64748d]">
              <Sparkles className="w-3.5 h-3.5 text-[#533afd] shrink-0" />
              <span>Upcoming: Google One-Tap & WhatsApp OTP Login</span>
            </div>
          </div>

          {/* Switch to Signup */}
          <div className="mt-6 text-center text-xs text-[#64748d]">
            Don't have an AINPAY account?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#533afd] hover:underline"
            >
              Create free account
            </Link>
          </div>
        </div>

        {/* Quick Demo Credentials Reminder */}
        <div className="mt-4 p-3 rounded-xl bg-white/70 border border-[#e2e8f0] text-[11px] text-[#64748d] text-center backdrop-blur-sm">
          💡 Demo merchant credentials: username <span className="font-mono font-semibold text-[#0d253d]">arslan</span> / password <span className="font-mono font-semibold text-[#0d253d]">Arslan1234</span>
        </div>
      </div>
    </div>
  );
}
