import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  ExternalLink,
  Flame,
  Layers,
  Lock,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
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
              Q
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0d253d]">
              QuickUPI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[15px] font-normal text-[#273951]">
            <Link href="#product" className="hover:text-[#533afd] transition-colors">
              Product
            </Link>
            <Link href="#limits" className="hover:text-[#533afd] transition-colors">
              Limit QRs
            </Link>
            <Link href="#verification" className="hover:text-[#533afd] transition-colors">
              Verification Mesh
            </Link>
            <Link href="#developers" className="hover:text-[#533afd] transition-colors">
              Developers
            </Link>
            <Link href="/pay/arslan" className="hover:text-[#533afd] transition-colors">
              Demo Merchant
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
              href="/r/nextjs-ai-cohort"
              className="btn-stripe-primary text-[14px] !py-2 !px-4"
            >
              <span>Try Live Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 relative z-10 flex flex-col items-center text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#e3e8ee] text-[#4434d4] text-[12px] font-medium mb-8 stripe-shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#533afd]" />
            <span>Direct-to-bank UPI routing • Zero aggregator fees • T+0 settlement</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748d]" />
          </div>

          {/* Sohne/Inter Weight 300 Editorial Headline with Negative Tracking */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-light tracking-[-1.4px] leading-[1.08] text-[#0d253d] max-w-4xl">
            Don't build a payment gateway. <br className="hidden sm:inline" />
            <span className="font-normal text-[#533afd]">
              Make existing UPI 10x smarter.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-[20px] font-light text-[#64748d] max-w-2xl leading-[1.4] tracking-[-0.2px]">
            Accept direct-to-bank payments at <strong className="font-medium text-[#0d253d]">0% fees</strong> with instant T+0 settlement. Upgrade dumb static QR stickers with <strong className="font-medium text-[#0d253d]">automated collection caps</strong>, seat limits, and a multi-channel verification mesh.
          </p>

          {/* Primary CTA Row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/r/nextjs-ai-cohort"
              className="btn-stripe-primary !py-2.5 !px-5 text-[15px]"
            >
              <span>Test 25-Seat Limit QR</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="btn-stripe-secondary !py-2.5 !px-5 text-[15px]"
            >
              <span>Merchant Command Center</span>
            </Link>
          </div>

          {/* Signature Stripe Composited Product UI Mockup */}
          <div className="mt-14 w-full max-w-5xl rounded-2xl bg-white border border-[#e3e8ee] stripe-shadow-lg p-3 sm:p-5 text-left grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Panel: Faux Code & Universal Embed (4 cols) */}
            <div className="lg:col-span-4 rounded-xl bg-[#1c1e54] text-white p-5 flex flex-col justify-between font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-white/50 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span>checkout-embed.html</span>
              </div>

              <div className="my-4 space-y-2 text-[11px] leading-relaxed">
                <p className="text-white/40">// 2-line universal drop-in</p>
                <p>
                  <span className="text-[#b9b9f9]">&lt;script</span>{" "}
                  <span className="text-[#a7f3d0]">src</span>=
                  <span className="text-amber-200">"quickupi.js"</span>
                  <span className="text-[#b9b9f9]">&gt;&lt;/script&gt;</span>
                </p>
                <p>
                  <span className="text-[#b9b9f9]">&lt;button</span>{" "}
                  <span className="text-[#a7f3d0]">data-quickupi-pay</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-[#a7f3d0]">data-campaign</span>=
                  <span className="text-amber-200">"nextjs-cohort"</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-[#a7f3d0]">data-amount</span>=
                  <span className="text-amber-200">"1999"</span>
                  <span className="text-[#b9b9f9]">&gt;</span>
                </p>
                <p className="text-white/90">&nbsp;&nbsp;Pay ₹1,999 (0% Fee)</p>
                <p><span className="text-[#b9b9f9]">&lt;/button&gt;</span></p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                <span className="flex items-center gap-1 text-[#34d399]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                  Vanilla JS &lt; 5KB
                </span>
                <span>T+0 Direct Bank</span>
              </div>
            </div>

            {/* Center Panel: Live Limit QR Checkout Simulation (5 cols) */}
            <div className="lg:col-span-5 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#533afd] bg-[#b9b9f9]/40 px-2 py-0.5 rounded-full">
                    Hero Feature
                  </span>
                  <span className="text-[11px] text-[#64748d] font-mono tabular-money">
                    Session: 14:42
                  </span>
                </div>
                <h3 className="text-base font-medium text-[#0d253d]">
                  Fullstack Next.js & AI Cohort
                </h3>
                <p className="text-xs text-[#64748d] mt-0.5">
                  Payee: <strong className="text-[#0d253d]">arslan@okhdfcbank</strong>
                </p>
              </div>

              {/* Price Banner */}
              <div className="my-3 p-3 rounded-lg bg-white border border-[#e3e8ee] flex items-baseline justify-between stripe-shadow-sm">
                <span className="text-xs text-[#64748d]">Amount Locked:</span>
                <span className="text-2xl font-normal text-[#0d253d] tabular-money">
                  ₹1,999.00
                </span>
              </div>

              {/* Limit Progress Bar */}
              <div className="p-3 rounded-lg bg-white border border-[#e3e8ee] stripe-shadow-sm flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <Flame className="w-3.5 h-3.5" />
                    Only 7 seats remaining!
                  </span>
                  <span className="text-[#64748d] tabular-money">18 of 25 booked</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e3e8ee] overflow-hidden">
                  <div className="w-[72%] h-full bg-[#533afd] rounded-full" />
                </div>
              </div>

              <Link
                href="/r/nextjs-ai-cohort"
                className="mt-3 w-full btn-stripe-primary !py-2 text-xs"
              >
                <span>Launch Interactive Checkout</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Right Panel: Observer Node Telemetry (3 cols) */}
            <div className="lg:col-span-3 rounded-xl bg-white border border-[#e3e8ee] p-5 flex flex-col justify-between stripe-shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0d253d]">
                  Observer Mesh
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>

              <div className="my-3 p-3 rounded-lg bg-[#f6f9fc] border border-[#e3e8ee] text-xs space-y-1.5">
                <div className="text-[11px] text-[#64748d]">Bank Alert Intercepted:</div>
                <div className="font-mono text-[11px] text-[#273951] leading-tight">
                  "Cr Rs 1,999.00 by UPI/429182736451"
                </div>
                <div className="text-[10px] text-emerald-600 font-medium pt-1 border-t border-[#e3e8ee]">
                  ✓ HMAC-SHA256 Signed
                </div>
              </div>

              <div className="text-[11px] text-[#64748d]">
                Automated sub-second credit verification without gateway webhooks.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Comparison Matrix (White Canvas) */}
      <section id="product" className="py-24 max-w-6xl mx-auto px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#533afd]">
            The Sovereign Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-[-0.64px] text-[#0d253d] mt-2">
            Why traditional gateways cost you too much.
          </h2>
          <p className="text-base text-[#64748d] font-light mt-3">
            Traditional aggregators insert themselves between your customers and your bank, charging hefty commissions while holding your money.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e3e8ee] overflow-hidden stripe-shadow-md bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#f6f9fc] border-b border-[#e3e8ee] text-[#64748d] text-xs">
                <th className="py-4 px-6 font-medium">Feature</th>
                <th className="py-4 px-6 font-medium">Traditional PGs (Razorpay/Cashfree)</th>
                <th className="py-4 px-6 font-medium">Static QR Stickers</th>
                <th className="py-4 px-6 font-medium text-[#533afd]">QuickUPI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8ee] text-[#273951]">
              <tr>
                <td className="py-4 px-6 font-medium text-[#0d253d]">Transaction Fee</td>
                <td className="py-4 px-6 text-rose-600">2.0% – 3.0% + 18% GST</td>
                <td className="py-4 px-6">0%</td>
                <td className="py-4 px-6 font-semibold text-emerald-600">0.0% (Zero Fees Forever)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-[#0d253d]">Settlement Time</td>
                <td className="py-4 px-6">T+2 to T+3 Business Days</td>
                <td className="py-4 px-6">Instant T+0</td>
                <td className="py-4 px-6 font-semibold text-emerald-600">Instant T+0 Direct-to-Bank</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-[#0d253d]">RBI Escrow Liability</td>
                <td className="py-4 px-6 text-rose-600">Mandatory (₹15–25 Cr capital)</td>
                <td className="py-4 px-6">None</td>
                <td className="py-4 px-6 font-semibold text-emerald-600">Zero (Funds never held in escrow)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-[#0d253d]">Smart Collection Limits</td>
                <td className="py-4 px-6">Paid add-on</td>
                <td className="py-4 px-6 text-slate-400">❌ None (Dumb image)</td>
                <td className="py-4 px-6 font-semibold text-[#533afd]">Built-in Atomic Seat & Cap Locks</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-[#0d253d]">Verification Mesh</td>
                <td className="py-4 px-6">Proprietary Webhooks</td>
                <td className="py-4 px-6 text-slate-400">❌ WhatsApp screenshot chaos</td>
                <td className="py-4 px-6 font-semibold text-[#533afd]">Tri-Channel (UTR, Observer, Micro-Paise)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-[#0d253d]">Universal Embed</td>
                <td className="py-4 px-6">Complex SDK</td>
                <td className="py-4 px-6 text-slate-400">❌ None</td>
                <td className="py-4 px-6 font-semibold text-[#533afd]">2-Line Drop-in (`quickupi.js`)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Feature Bands on Canvas Soft (#f6f9fc) with Warm Cream Band Card (#f5e9d4) */}
      <section id="limits" className="py-24 bg-[#f6f9fc] border-t border-[#e3e8ee]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#533afd]">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-[-0.64px] text-[#0d253d] mt-2">
              Everything you need to accept smart payments.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Reusable QR with Automated Limits */}
            <div className="rounded-2xl bg-white border border-[#e3e8ee] p-8 stripe-shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center mb-5">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-light text-[#0d253d] tracking-[-0.26px]">
                  Reusable QRs with Auto-Limits
                </h3>
                <p className="text-sm font-light text-[#64748d] mt-2 leading-relaxed">
                  Set hard caps on your campaigns: Total collection cap (e.g., ₹50,000), fixed per-payment lock, and seat limits (e.g. 25 slots). Page automatically locks the instant the 25th payment arrives.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e3e8ee] flex items-center justify-between text-xs text-[#533afd] font-medium">
                <span>Atomic Concurrency Lock</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 2: Warm Cream Band Interlude (Stripe Signature) */}
            <div className="rounded-2xl bg-[#f5e9d4] border border-[#e2d5bd] p-8 stripe-shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#9b6829]/15 text-[#9b6829] flex items-center justify-center mb-5">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-light text-[#0d253d] tracking-[-0.26px]">
                  0% Transaction Fees Forever
                </h3>
                <p className="text-sm font-light text-[#273951] mt-2 leading-relaxed">
                  Keep 100% of your customer payments. Because money moves bank-to-bank over NPCI rails, neither you nor QuickUPI pays a 2.36% intermediary gateway tax.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e2d5bd] flex items-center justify-between text-xs text-[#9b6829] font-medium">
                <span>Save ~₹23,600 per ₹10L volume</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 3: Tri-Channel Verification Mesh */}
            <div className="rounded-2xl bg-white border border-[#e3e8ee] p-8 stripe-shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center mb-5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-light text-[#0d253d] tracking-[-0.26px]">
                  Hybrid Verification Mesh
                </h3>
                <p className="text-sm font-light text-[#64748d] mt-2 leading-relaxed">
                  Solves the bank webhook problem through a 3-tier mesh: Mode A (Zero-infra 12-digit UTR log), Mode B (Automated Android observer APK with HMAC), and Mode C (Micro-paise matching).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e3e8ee] flex items-center justify-between text-xs text-[#533afd] font-medium">
                <span>Sub-second Auto Confirmation</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Tiers Section (Featured Dark Navy Card) */}
      <section className="py-24 max-w-6xl mx-auto px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#533afd]">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-[-0.64px] text-[#0d253d] mt-2">
            No percentage cuts. Just software.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Tier 1: Free */}
          <div className="rounded-2xl bg-white border border-[#e3e8ee] p-8 stripe-shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-light text-[#0d253d]">Free Tier</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-normal text-[#0d253d] tabular-money">₹0</span>
                <span className="text-xs text-[#64748d]">/ forever</span>
              </div>
              <p className="text-xs text-[#64748d] mt-2">
                Ideal for individual freelancers and consultants getting started.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-[#273951]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Unlimited basic static QRs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mode A 12-digit UTR verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Up to 2 active Limit QRs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct T+0 bank settlement</span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="mt-8 btn-stripe-secondary w-full text-xs text-center"
            >
              Get Started Free
            </Link>
          </div>

          {/* Tier 2: Pro (Featured Inverted Dark Navy Card) */}
          <div className="rounded-2xl bg-[#1c1e54] text-white p-8 stripe-shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[10px] uppercase tracking-wider font-semibold bg-[#533afd] text-white px-2.5 py-0.5 rounded-full">
              Most Popular
            </div>

            <div>
              <h3 className="text-lg font-light text-white">Pro Tier</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-normal text-white tabular-money">₹499</span>
                <span className="text-xs text-white/60">/ month</span>
              </div>
              <p className="text-xs text-white/70 mt-2">
                For coaches, educators, and creators running cohorts and events.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-white/90">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Unlimited Reusable Limit QRs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Android Observer Node auto-sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Custom brand logo in QR center</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Mode C Micro-Paise disambiguation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Automated WhatsApp payment alerts</span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="mt-8 btn-stripe-primary w-full text-xs text-center !bg-[#533afd] hover:!bg-[#4434d4]"
            >
              Start 14-Day Pro Trial
            </Link>
          </div>

          {/* Tier 3: Business */}
          <div className="rounded-2xl bg-white border border-[#e3e8ee] p-8 stripe-shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-light text-[#0d253d]">Business</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-normal text-[#0d253d] tabular-money">₹1,499</span>
                <span className="text-xs text-[#64748d]">/ month</span>
              </div>
              <p className="text-xs text-[#64748d] mt-2">
                For high-volume brands, retailers, and software platforms.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-[#273951]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Custom domain (`pay.yourbrand.com`)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Universal `quickupi.js` checkout embed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Multi-staff cashier till / POS mode</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Dedicated webhooks & API keys</span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="mt-8 btn-stripe-secondary w-full text-xs text-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Stripe-style Clean Footer */}
      <footer className="mt-auto border-t border-[#e3e8ee] bg-[#f6f9fc] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748d]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#533afd] text-white flex items-center justify-center font-bold text-xs">
              Q
            </div>
            <span className="font-semibold text-[#0d253d]">QuickUPI</span>
            <span>— Sovereign UPI Payment Protocol. Zero PG fees.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/pay/arslan" className="hover:text-[#533afd]">
              Demo Profile
            </Link>
            <Link href="/r/nextjs-ai-cohort" className="hover:text-[#533afd]">
              25-Seat QR
            </Link>
            <Link href="/dashboard" className="hover:text-[#533afd]">
              Command Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
