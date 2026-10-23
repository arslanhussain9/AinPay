import React from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Lock,
  QrCode,
  Smartphone,
  TrendingUp,
  Sliders,
  ArrowRight,
  HelpCircle,
  Briefcase,
  Layers,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#0d253d] flex flex-col font-normal selection:bg-[#b9b9f9] selection:text-[#533afd]">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section with Signature Atmospheric Gradient Mesh */}
        <section className="relative w-full stripe-gradient-mesh border-b border-[#e3e8ee] overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
            {/* Direct UPI Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#e3e8ee] text-[#4434d4] text-[12px] font-medium mb-6 stripe-shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#533afd]" />
              <span>Direct UPI payment collection for independent work</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#64748d]" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[62px] font-light tracking-[-1.4px] leading-[1.08] text-[#0d253d] max-w-4xl">
              Get paid directly to your bank. <br className="hidden sm:inline" />
              <span className="font-normal text-[#533afd]">
                Zero gateway cuts. Your own brand.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-5 text-base sm:text-xl font-light text-[#64748d] max-w-2xl leading-[1.4] tracking-[-0.2px]">
              AINPAY helps freelancers, creators, and businesses collect client payments over UPI with personal payment pages, locked invoice links, and instant bank credit.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/signup"
                className="btn-stripe-primary !py-2.5 !px-5 text-[15px]"
              >
                <span>Create Free Account</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>

              <Link
                href="/login"
                className="btn-stripe-secondary !py-2.5 !px-5 text-[15px]"
              >
                <span>Sign In to Dashboard</span>
              </Link>
            </div>

            {/* Genuine Composited Interface Preview */}
            <div className="mt-14 w-full max-w-4xl rounded-2xl bg-white border border-[#e3e8ee] stripe-shadow-lg p-4 sm:p-6 text-left grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left: Mini-Website Preview */}
              <div className="md:col-span-7 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#533afd] text-white flex items-center justify-center font-bold text-lg">
                      AH
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-[#0d253d]">Arslan Hussain</span>
                        <CheckCircle2 className="w-4 h-4 text-[#533afd]" />
                      </div>
                      <p className="text-xs font-mono text-[#64748d]">ainpay.in/pay/arslan</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-white border border-[#e3e8ee] stripe-shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#0d253d] font-medium block">Website Redesign 50% Advance</span>
                      <span className="text-[11px] text-[#64748d]">Single-use locked link for Vikram</span>
                    </div>
                    <span className="text-lg font-normal text-[#0d253d] tabular-money">₹25,000.00</span>
                  </div>

                  <div className="mt-2 p-3 rounded-lg bg-white border border-[#e3e8ee] stripe-shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#0d253d] font-medium block">1-Hour Tech Consultation</span>
                      <span className="text-[11px] text-[#64748d]">Architecture & stack review</span>
                    </div>
                    <span className="text-lg font-normal text-[#0d253d] tabular-money">₹1,999.00</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e3e8ee] flex items-center justify-between text-xs">
                  <span className="text-[#533afd] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    UPI: 6206825799@paytm
                  </span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                    0% Platform Fees
                  </span>
                </div>
              </div>

              {/* Right: Dashboard Approval Simulation */}
              <div className="md:col-span-5 rounded-xl bg-[#1c1e54] text-white p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-semibold text-white/80">Pending Merchant Review</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                      1-Tap Approve
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <p className="text-white/60">Customer: <strong className="text-white">Vikram Malhotra</strong></p>
                    <p className="text-white/60">Item: <strong className="text-white">Website Advance</strong></p>
                    <p className="text-white/60">Amount: <strong className="text-emerald-400 text-sm tabular-money font-semibold">₹25,000.00</strong></p>
                    <p className="text-white/60 font-mono text-[11px]">UTR: <span className="text-[#b9b9f9]">429182736451</span></p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-white/60">Direct Bank Credit</span>
                  <span className="px-3 py-1 rounded-full bg-[#533afd] text-white text-xs font-semibold shadow-sm">
                    Approved ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: About AINPAY */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#533afd]">
              About The Platform
            </span>
            <h2 className="text-2xl sm:text-4xl font-light tracking-[-0.64px] text-[#0d253d] mt-2">
              What is AINPAY and how does it work?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#64748d] leading-relaxed">
              AINPAY is a direct UPI payment collection software for independent professionals in India. It replaces clunky manual bank transfers and expensive 2–3% gateway fees with clean, professional payment links that transfer directly to your bank account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white border border-[#e3e8ee] p-7 stripe-shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center font-bold text-sm mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-[#0d253d]">
                  Who Can Use It
                </h3>
                <p className="text-xs sm:text-sm text-[#64748d] mt-2 leading-relaxed">
                  Freelance developers, UI/UX designers, consultants, tutors, and small agencies who want a professional checkout experience without paying 2–3% intermediary gateway commissions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f1f5f9] text-xs text-[#533afd] font-medium">
                No corporate gateway onboarding
              </div>
            </div>

            <div className="rounded-2xl bg-[#f6f9fc] border border-[#e3e8ee] p-7 stripe-shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center font-bold text-sm mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-[#0d253d]">
                  How Customers Pay
                </h3>
                <p className="text-xs sm:text-sm text-[#273951] mt-2 leading-relaxed">
                  Customers scan the generated vector QR code or click Pay Now on mobile to open Google Pay, PhonePe, Paytm, or BHIM. The recipient and amount are pre-filled to prevent errors.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e3e8ee] text-xs text-[#533afd] font-medium">
                Universal NPCI UPI compatibility
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#e3e8ee] p-7 stripe-shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center font-bold text-sm mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-[#0d253d]">
                  How You Review & Approve
                </h3>
                <p className="text-xs sm:text-sm text-[#64748d] mt-2 leading-relaxed">
                  The client submits the 12-digit UTR reference. You cross-check the incoming notification on your bank app and approve it in 1 tap, automatically closing single-use links.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f1f5f9] text-xs text-emerald-700 font-medium">
                Zero escrow holding delays
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Real Platform Features */}
        <section id="features" className="py-20 bg-[#f6f9fc] border-t border-[#e3e8ee]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#533afd]">
                Platform Capabilities
              </span>
              <h2 className="text-2xl sm:text-4xl font-light tracking-[-0.64px] text-[#0d253d] mt-2">
                Built for clean, reliable collections.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#64748d]">
                Only genuine, working features implemented right inside the platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center mb-4">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0d253d]">
                    Branded Personal Page
                  </h3>
                  <p className="text-xs text-[#64748d] mt-1.5 leading-relaxed">
                    Your public link (<code className="text-[#533afd]">ainpay.in/pay/username</code>) with bio, verified UPI VPA, and preset amounts for quick client transfers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#f1f5f9] text-xs font-medium text-[#533afd]">
                  Instant Setup
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center mb-4">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0d253d]">
                    Single-Use Payment Links
                  </h3>
                  <p className="text-xs text-[#64748d] mt-1.5 leading-relaxed">
                    Custom links (<code className="text-[#533afd]">ainpay.in/p/slug</code>) with locked amounts, customer details, and automatic closure after one approved payment.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#f1f5f9] text-xs font-medium text-[#533afd]">
                  Tamper-Proof Amounts
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center mb-4">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0d253d]">
                    Vector QR & PNG Download
                  </h3>
                  <p className="text-xs text-[#64748d] mt-1.5 leading-relaxed">
                    Dynamic vector QR code for every payment request. Download clear PNG images to share via WhatsApp, email, or invoices.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#f1f5f9] text-xs font-medium text-[#533afd]">
                  High-Resolution Sharing
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center mb-4">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0d253d]">
                    Pay Now Deep-Link
                  </h3>
                  <p className="text-xs text-[#64748d] mt-1.5 leading-relaxed">
                    One-tap mobile launch into installed UPI apps (GPay, PhonePe, Paytm) with locked amount and payee details pre-filled.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#f1f5f9] text-xs font-medium text-[#533afd]">
                  Native Mobile Flow
                </div>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-2xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center mb-4">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0d253d]">
                    Payment Link Management
                  </h3>
                  <p className="text-xs text-[#64748d] mt-1.5 leading-relaxed">
                    Close unpaid links manually at any time. Monitor link statuses (Active, Closed, Paid) with full backend enforcement.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#f1f5f9] text-xs font-medium text-[#533afd]">
                  Full Merchant Control
                </div>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-2xl p-6 border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center mb-4">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0d253d]">
                    Real Transaction Analytics
                  </h3>
                  <p className="text-xs text-[#64748d] mt-1.5 leading-relaxed">
                    Clean revenue and transaction graphs generated directly from your stored payment database records. No fabricated data.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#f1f5f9] text-xs font-medium text-[#533afd]">
                  7d / 30d / All Time Views
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/features"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#533afd] hover:underline"
              >
                <span>Read detailed technical specifications on our Features page</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 3: 4-Step Process */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#533afd]">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-4xl font-light tracking-[-0.64px] text-[#0d253d] mt-2">
              Four simple steps from setup to payment.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-[#533afd]/10 text-[#533afd] flex items-center justify-center font-bold text-xs mb-4">
                  01
                </span>
                <h3 className="text-base font-semibold text-[#0d253d]">
                  Set Up Profile
                </h3>
                <p className="text-xs text-[#64748d] mt-2 leading-relaxed">
                  Create an account and configure your verified UPI ID where all payments will be directly credited.
                </p>
              </div>
              <div className="mt-4 text-[11px] text-[#64748d]">Takes under 1 minute</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-[#533afd]/10 text-[#533afd] flex items-center justify-center font-bold text-xs mb-4">
                  02
                </span>
                <h3 className="text-base font-semibold text-[#0d253d]">
                  Generate Link
                </h3>
                <p className="text-xs text-[#64748d] mt-2 leading-relaxed">
                  Create a locked payment link for a customer or share your personal profile URL (<code className="text-[#533afd]">ainpay.in/pay/you</code>).
                </p>
              </div>
              <div className="mt-4 text-[11px] text-[#64748d]">Single-use or reusable</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-[#533afd]/10 text-[#533afd] flex items-center justify-center font-bold text-xs mb-4">
                  03
                </span>
                <h3 className="text-base font-semibold text-[#0d253d]">
                  Customer Pays
                </h3>
                <p className="text-xs text-[#64748d] mt-2 leading-relaxed">
                  Customer scans the vector QR code or taps Pay Now to complete the transfer in their favourite UPI app.
                </p>
              </div>
              <div className="mt-4 text-[11px] text-[#64748d]">Universal UPI support</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e3e8ee] stripe-shadow-sm flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-[#533afd]/10 text-[#533afd] flex items-center justify-center font-bold text-xs mb-4">
                  04
                </span>
                <h3 className="text-base font-semibold text-[#0d253d]">
                  1-Tap Approve
                </h3>
                <p className="text-xs text-[#64748d] mt-2 leading-relaxed">
                  Customer enters the 12-digit UTR. You verify the bank credit and click Approve to lock the payment and link.
                </p>
              </div>
              <div className="mt-4 text-[11px] text-[#64748d]">100% direct settlement</div>
            </div>
          </div>
        </section>

        {/* Section 4: Comparison Table */}
        <section className="py-20 bg-[#f6f9fc] border-t border-[#e3e8ee]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#533afd]">
                Transparent Comparison
              </span>
              <h2 className="text-2xl sm:text-4xl font-light tracking-[-0.64px] text-[#0d253d] mt-2">
                Why professionals choose AINPAY.
              </h2>
            </div>

            <div className="rounded-2xl border border-[#e3e8ee] overflow-hidden stripe-shadow-md bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#f6f9fc] border-b border-[#e3e8ee] text-[#64748d] text-xs">
                      <th className="py-4 px-6 font-medium">Feature</th>
                      <th className="py-4 px-6 font-medium">Traditional Gateways</th>
                      <th className="py-4 px-6 font-medium">Raw Phone Numbers</th>
                      <th className="py-4 px-6 font-medium text-[#533afd]">AINPAY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e8ee] text-[#273951]">
                    <tr>
                      <td className="py-4 px-6 font-medium text-[#0d253d]">Platform Fee</td>
                      <td className="py-4 px-6 text-rose-600">2.0% – 3.0% + GST</td>
                      <td className="py-4 px-6">0%</td>
                      <td className="py-4 px-6 font-semibold text-emerald-600">0.0% Forever</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium text-[#0d253d]">Settlement Speed</td>
                      <td className="py-4 px-6">T+2 to T+3 Days</td>
                      <td className="py-4 px-6">Instant</td>
                      <td className="py-4 px-6 font-semibold text-emerald-600">Instant Direct to Bank</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium text-[#0d253d]">Branded Client Experience</td>
                      <td className="py-4 px-6">Generic checkout</td>
                      <td className="py-4 px-6 text-slate-400">Casual text message</td>
                      <td className="py-4 px-6 font-semibold text-[#533afd]">Personalized Links & QR</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium text-[#0d253d]">Amount Locking</td>
                      <td className="py-4 px-6">Yes</td>
                      <td className="py-4 px-6 text-rose-600">Manual error risk</td>
                      <td className="py-4 px-6 font-semibold text-[#533afd]">Locked in Deep Link & QR</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium text-[#0d253d]">Single-Use Invoicing</td>
                      <td className="py-4 px-6">Complex setup</td>
                      <td className="py-4 px-6 text-slate-400">Not possible</td>
                      <td className="py-4 px-6 font-semibold text-emerald-600">Built-in 1-Tap Links</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium text-[#0d253d]">Setup Time</td>
                      <td className="py-4 px-6 text-rose-600">Business KYC review</td>
                      <td className="py-4 px-6">None</td>
                      <td className="py-4 px-6 font-semibold text-emerald-600">60 Seconds</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Common Questions Preview */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#533afd]">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-light tracking-[-0.64px] text-[#0d253d] mt-2">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white border border-[#e3e8ee] stripe-shadow-sm">
              <h3 className="text-sm font-semibold text-[#0d253d] mb-1.5">
                How does AINPAY ensure 0% platform fees?
              </h3>
              <p className="text-xs text-[#64748d] leading-relaxed">
                UPI transfers between individuals and small merchant bank accounts are free under NPCI regulations. Because AINPAY does not sit in the flow of funds as an escrow intermediary, we do not deduct a percentage cut.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#e3e8ee] stripe-shadow-sm">
              <h3 className="text-sm font-semibold text-[#0d253d] mb-1.5">
                How do I verify that a customer has actually paid?
              </h3>
              <p className="text-xs text-[#64748d] leading-relaxed">
                When the customer submits their 12-digit UTR, you receive a pending approval item in your dashboard. You cross-check your bank SMS or UPI app notification, and approve the payment with 1 tap.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#e3e8ee] stripe-shadow-sm">
              <h3 className="text-sm font-semibold text-[#0d253d] mb-1.5">
                Can I close a payment link before receiving payment?
              </h3>
              <p className="text-xs text-[#64748d] leading-relaxed">
                Yes. If a client cancels a project or terms change, you can close any active link from your dashboard with one click. Once closed, payment submissions are strictly blocked on the backend.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#533afd] hover:underline"
            >
              <span>View all frequently asked questions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] border-t border-[#e3e8ee]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl font-light text-[#0d253d] tracking-tight">
              Start collecting direct UPI payments today.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#64748d] max-w-xl">
              Create your account in 60 seconds with your existing UPI ID. No setup fees, no subscription requirements, and zero transaction cuts.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="btn-stripe-primary !py-2.5 !px-6 text-sm"
              >
                <span>Create Free Account</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/login"
                className="btn-stripe-secondary !py-2.5 !px-5 text-sm"
              >
                <span>Sign In to Dashboard</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
