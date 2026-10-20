import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  ExternalLink,
  Flame,
  Globe,
  Layers,
  Lock,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#0d253d] flex flex-col font-normal selection:bg-[#b9b9f9] selection:text-[#533afd]">
      {/* Upper Third: Stripe Atmospheric Gradient Mesh */}
      <div className="relative w-full stripe-gradient-mesh border-b border-[#e3e8ee] overflow-hidden">
        {/* Navigation Bar */}
        <header className="max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#533afd] flex items-center justify-center font-bold text-white text-base shadow-sm">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0d253d]">
              PayMe
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[15px] font-normal text-[#273951]">
            <Link href="#how-it-works" className="hover:text-[#533afd] transition-colors">
              How It Works
            </Link>
            <Link href="#freelancers" className="hover:text-[#533afd] transition-colors">
              For Freelancers
            </Link>
            <Link href="#comparison" className="hover:text-[#533afd] transition-colors">
              Why PayMe
            </Link>
            <Link href="/pay/arslan" className="hover:text-[#533afd] transition-colors">
              Live Demo Profile
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-[14px] text-[#273951] hover:text-[#533afd] font-medium hidden sm:inline"
            >
              Sign in
            </Link>
            <Link
              href="/pay/arslan"
              className="btn-stripe-primary text-[14px] !py-2 !px-4"
            >
              <span>Explore Demo Profile</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 relative z-10 flex flex-col items-center text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#e3e8ee] text-[#4434d4] text-[12px] font-medium mb-8 stripe-shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#533afd]" />
            <span>Direct UPI payment links built for Indian Freelancers</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748d]" />
          </div>

          {/* Thin Weight 300 Display Headline with Negative Tracking */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-light tracking-[-1.4px] leading-[1.08] text-[#0d253d] max-w-4xl">
            Get paid directly to bank. <br className="hidden sm:inline" />
            <span className="font-normal text-[#533afd]">
              Zero gateway cuts. Your own brand.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-[20px] font-light text-[#64748d] max-w-2xl leading-[1.4] tracking-[-0.2px]">
            Stop losing 2% + 18% GST on your project invoices. Get your own professional <strong className="font-medium text-[#0d253d]">payme.in/username</strong> page to accept advances, milestones, and client payments instantly over UPI.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/pay/arslan"
              className="btn-stripe-primary !py-2.5 !px-5 text-[15px]"
            >
              <span>Visit Demo Freelancer Page</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="btn-stripe-secondary !py-2.5 !px-5 text-[15px]"
            >
              <span>Open Freelancer Dashboard</span>
            </Link>
          </div>

          {/* Composited Showcase Mockup */}
          <div className="mt-14 w-full max-w-4xl rounded-2xl bg-white border border-[#e3e8ee] stripe-shadow-lg p-4 sm:p-6 text-left grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Mini-Website Preview (7 cols) */}
            <div className="md:col-span-7 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#533afd] text-white flex items-center justify-center font-bold text-lg">
                    AA
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm text-[#0d253d]">Arslan Ahmad</span>
                      <CheckCircle2 className="w-4 h-4 text-[#533afd]" />
                    </div>
                    <p className="text-xs text-[#64748d]">payme.in/pay/arslan</p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-white border border-[#e3e8ee] stripe-shadow-sm flex items-center justify-between">
                  <span className="text-xs text-[#64748d]">Website Redesign 50% Advance:</span>
                  <span className="text-lg font-normal text-[#0d253d] tabular-money">₹25,000.00</span>
                </div>

                <div className="mt-2 p-3 rounded-lg bg-white border border-[#e3e8ee] stripe-shadow-sm flex items-center justify-between">
                  <span className="text-xs text-[#64748d]">1-Hour Tech Consultation:</span>
                  <span className="text-lg font-normal text-[#0d253d] tabular-money">₹1,999.00</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#e3e8ee] flex items-center justify-between text-xs">
                <span className="text-[#533afd] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  VPA: arslan@okhdfcbank
                </span>
                <span className="text-emerald-700 font-semibold">T+0 Instant Bank Credit</span>
              </div>
            </div>

            {/* Right: 1-Tap Dashboard Approval Simulation (5 cols) */}
            <div className="md:col-span-5 rounded-xl bg-[#1c1e54] text-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-semibold text-white/80">Pending Client Payment</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                    Awaiting Approval
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  <p className="text-white/60">Client: <strong className="text-white">Vikram Malhotra</strong></p>
                  <p className="text-white/60">Project: <strong className="text-white">Website Advance</strong></p>
                  <p className="text-white/60">Amount: <strong className="text-emerald-400 text-sm tabular-money">₹25,000.00</strong></p>
                  <p className="text-white/60 font-mono text-[11px]">UTR: <span className="text-[#b9b9f9]">429182736451</span></p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-white/50">Checked phone SMS?</span>
                <span className="px-3 py-1.5 rounded-full bg-[#533afd] text-white text-xs font-semibold shadow-sm">
                  1-Tap Approved ✓
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: How it Works (3 Steps) */}
      <section id="how-it-works" className="py-24 max-w-6xl mx-auto px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#533afd]">
            Frictionless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-[-0.64px] text-[#0d253d] mt-2">
            Collect freelance payments in 3 dead-simple steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white border border-[#e3e8ee] p-8 stripe-shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center font-bold text-sm mb-5">
                1
              </div>
              <h3 className="text-xl font-light text-[#0d253d] tracking-[-0.26px]">
                Create Your Profile
              </h3>
              <p className="text-sm font-light text-[#64748d] mt-2 leading-relaxed">
                Add your Name, Title, and UPI ID (`username@bank`). In 60 seconds, your personal branded link (`payme.in/pay/username`) is live.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#e3e8ee] text-xs text-[#533afd] font-medium">
              Zero Business KYC Required
            </div>
          </div>

          <div className="rounded-2xl bg-[#f5e9d4] border border-[#e2d5bd] p-8 stripe-shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#9b6829]/15 text-[#9b6829] flex items-center justify-center font-bold text-sm mb-5">
                2
              </div>
              <h3 className="text-xl font-light text-[#0d253d] tracking-[-0.26px]">
                Send Project Invoice Link
              </h3>
              <p className="text-sm font-light text-[#273951] mt-2 leading-relaxed">
                Share your link with your client. They open on mobile, 1-tap open GPay/PhonePe, and pay with the amount pre-locked. No manual typing errors.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#e2d5bd] text-xs text-[#9b6829] font-medium">
              1-Tap Deep-Links (GPay, PhonePe, Paytm)
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[#e3e8ee] p-8 stripe-shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center font-bold text-sm mb-5">
                3
              </div>
              <h3 className="text-xl font-light text-[#0d253d] tracking-[-0.26px]">
                1-Tap Approve on Portal
              </h3>
              <p className="text-sm font-light text-[#64748d] mt-2 leading-relaxed">
                Client enters their 12-digit UTR. You get your standard bank SMS on your phone, open PayMe, and tap **[Approve ✅]**. Money is in your bank!
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#e3e8ee] text-xs text-[#533afd] font-medium">
              0% Gateway Fees (Keep 100%)
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Comparison vs Traditional Gateways */}
      <section id="comparison" className="py-24 bg-[#f6f9fc] border-t border-[#e3e8ee]">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#533afd]">
              Why Freelancers Love PayMe
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-[-0.64px] text-[#0d253d] mt-2">
              Save thousands on every client project.
            </h2>
          </div>

          <div className="rounded-2xl border border-[#e3e8ee] overflow-hidden stripe-shadow-md bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#f6f9fc] border-b border-[#e3e8ee] text-[#64748d] text-xs">
                  <th className="py-4 px-6 font-medium">Metric</th>
                  <th className="py-4 px-6 font-medium">Traditional Payment Gateways</th>
                  <th className="py-4 px-6 font-medium">Sending Raw Phone Number</th>
                  <th className="py-4 px-6 font-medium text-[#533afd]">PayMe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8ee] text-[#273951]">
                <tr>
                  <td className="py-4 px-6 font-medium text-[#0d253d]">Platform Cut</td>
                  <td className="py-4 px-6 text-rose-600">2.0% – 3.0% + 18% GST</td>
                  <td className="py-4 px-6">0%</td>
                  <td className="py-4 px-6 font-semibold text-emerald-600">0.0% (Zero Fees Forever)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#0d253d]">Settlement Time</td>
                  <td className="py-4 px-6">T+2 to T+3 Days (Holdbacks)</td>
                  <td className="py-4 px-6">Instant</td>
                  <td className="py-4 px-6 font-semibold text-emerald-600">Instant T+0 Direct-to-Bank</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#0d253d]">Professional Look</td>
                  <td className="py-4 px-6">Generic gateway checkout</td>
                  <td className="py-4 px-6 text-slate-400">❌ Unprofessional WhatsApp text</td>
                  <td className="py-4 px-6 font-semibold text-[#533afd]">Custom `payme.in/username` Profile</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#0d253d]">Amount Locking</td>
                  <td className="py-4 px-6">Yes</td>
                  <td className="py-4 px-6 text-slate-400">❌ Client can enter wrong amount</td>
                  <td className="py-4 px-6 font-semibold text-[#533afd]">Locked in UPI Deep-Link</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#0d253d]">Onboarding Friction</td>
                  <td className="py-4 px-6 text-rose-600">Days of business verification</td>
                  <td className="py-4 px-6">Instant</td>
                  <td className="py-4 px-6 font-semibold text-emerald-600">60 Seconds (Name + UPI ID)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#e3e8ee] bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748d]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#533afd] text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
            <span className="font-semibold text-[#0d253d]">PayMe</span>
            <span>— Direct UPI payment links & milestone invoices for freelancers.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/pay/arslan" className="hover:text-[#533afd]">
              Demo Profile
            </Link>
            <Link href="/p/website-advance" className="hover:text-[#533afd]">
              Project Invoice Demo
            </Link>
            <Link href="/dashboard" className="hover:text-[#533afd]">
              Freelancer Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
