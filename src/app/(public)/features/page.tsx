import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  UserCheck,
  Lock,
  QrCode,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sliders,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Platform Features — AINPAY",
  description: "Explore the core features of AINPAY: personal payment pages, single-use locked payment links, QR code downloads, and 1-tap UTR verification with 0% platform fees.",
};

export default function FeaturesPage() {
  const features = [
    {
      icon: UserCheck,
      title: "Personal Payment Pages",
      route: "ainpay.in/pay/username",
      description:
        "Your dedicated public payment page showcasing your professional profile, verified UPI ID, and customizable amount presets. Perfect for sharing in social bios, email signatures, or direct messages.",
      highlights: [
        "Unique public username handle",
        "Configurable preset amounts (e.g. ₹500, ₹1,500, ₹5,000)",
        "Direct UPI intent and QR generation",
      ],
      badge: "Public Profile",
    },
    {
      icon: Lock,
      title: "Fixed-Amount Single-Use Payment Links",
      route: "ainpay.in/p/slug",
      description:
        "Generate locked payment links for specific clients, milestone deliverables, retainers, or invoices. The payment amount is strictly locked on both frontend and backend to eliminate manual customer entry errors.",
      highlights: [
        "Strict single-use: automatically closes upon payment",
        "Locked amounts prevent underpayment manipulation",
        "Optional customer contact & project scope notes",
      ],
      badge: "Invoice Links",
    },
    {
      icon: QrCode,
      title: "Dynamic Vector QR & PNG Download",
      route: "Standard NPCI UPI Format",
      description:
        "Every payment request generates a crisp vector QR code pre-encoded with the exact merchant payee details and amount. Download high-resolution PNG images directly to share over WhatsApp, email, or invoices.",
      highlights: [
        "Real, high-resolution PNG download",
        "Instant scanning across Google Pay, PhonePe, Paytm & BHIM",
        "Crisp contrast and clear scanning margins",
      ],
      badge: "QR Generation",
    },
    {
      icon: Smartphone,
      title: "Pay Now Mobile Deep-Linking",
      route: "Native App Chooser",
      description:
        "On mobile devices, tapping 'Pay Now' triggers standard UPI deep links (`upi://pay`), opening the customer's preferred UPI application with payee name and amount pre-filled.",
      highlights: [
        "No hardcoded apps: works across all standard UPI clients",
        "Desktop fallback guidance to scan QR code",
        "Zero payment gateway redirection delays",
      ],
      badge: "Mobile Checkout",
    },
    {
      icon: CheckCircle2,
      title: "1-Tap UTR Verification & Approval",
      route: "Merchant Review Workflow",
      description:
        "Customers submit the standard 12-digit UPI Transaction Reference (UTR) upon paying. Merchants review incoming transactions in their dashboard and verify payments with a single tap, preventing duplicate claims.",
      highlights: [
        "Duplicate UTR rejection to prevent replay fraud",
        "1-tap approve or decline from the merchant dashboard",
        "Automatic link closure upon payment approval",
      ],
      badge: "Security & Control",
    },
    {
      icon: Sliders,
      title: "Payment Link Lifecycle Management",
      route: "Merchant Portal Control",
      description:
        "Merchants maintain complete control over their payment links. Close any open link at any time before payment is submitted, view full customer details, copy shareable URLs, and track payment status in real time.",
      highlights: [
        "Manual 'Close Link' action for unpaid links",
        "Distinct status states: Active, Paid, and Closed",
        "Backend enforcement: closed links cannot receive payments",
      ],
      badge: "Link Control",
    },
    {
      icon: TrendingUp,
      title: "Real Transaction Analytics",
      route: "Real Stored Database Records",
      description:
        "Track your revenue over time with a clean, responsive transaction graph powered by your actual approved payment records. Filter trends across the last 7 days, 30 days, or all time without fabricated metrics.",
      highlights: [
        "Daily revenue aggregation and volume tracking",
        "Responsive trend charts on desktop and mobile",
        "Complete transaction history and ledger view",
      ],
      badge: "Analytics",
    },
    {
      icon: ShieldCheck,
      title: "0% Fees & Sovereign Settlement",
      route: "Direct to Your Bank Account",
      description:
        "Unlike third-party payment gateways that hold your funds in intermediary escrow wallets and charge 2–3% plus GST, AINPAY payments settle directly into your verified bank account via UPI.",
      highlights: [
        "0.0% platform fee deduction",
        "Instant settlement directly to your bank UPI ID",
        "No multi-day settlement waiting periods",
      ],
      badge: "0% Commission",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0d253d] flex flex-col font-normal selection:bg-[#b9b9f9] selection:text-[#533afd]">
      <PublicNavbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="stripe-gradient-subtle border-b border-[#e3e8ee] py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e3e8ee] text-[#533afd] text-xs font-semibold mb-4 stripe-shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#533afd]" />
              <span>Platform Capabilities</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-light tracking-[-1px] text-[#0d253d]">
              Everything you need to collect <br className="hidden sm:inline" />
              <span className="font-normal text-[#533afd]">direct UPI payments.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#64748d] max-w-2xl mx-auto leading-relaxed">
              Explore the built-in tools that make AINPAY the simplest, most transparent direct-to-bank payment platform for independent work.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[#e3e8ee] p-7 stripe-shadow-sm hover:border-[#a8c3de] transition-all flex flex-col justify-between gap-6"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#533afd] bg-[#533afd]/10 px-2.5 py-1 rounded-full">
                        {feature.badge}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-[#0d253d] tracking-tight">
                      {feature.title}
                    </h2>
                    <p className="text-xs font-mono text-[#64748d] mt-1 mb-3">
                      {feature.route}
                    </p>
                    <p className="text-sm text-[#64748d] leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="mt-5 pt-4 border-t border-[#f1f5f9] space-y-2">
                      {feature.highlights.map((item, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs text-[#273951]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Box */}
          <div className="mt-16 rounded-2xl bg-[#f6f9fc] border border-[#e3e8ee] p-8 sm:p-12 text-center flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
              Ready to start collecting direct payments?
            </h2>
            <p className="mt-2 text-sm text-[#64748d] max-w-md">
              Create your account in under 60 seconds with your existing UPI ID. No lengthy gateway paperwork required.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="btn-stripe-primary !py-2.5 !px-6 text-sm"
              >
                <span>Create Free Account</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/pay/arslan"
                className="btn-stripe-secondary !py-2.5 !px-5 text-sm"
              >
                <span>View Demo Profile</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
