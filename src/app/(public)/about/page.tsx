import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  CreditCard,
  QrCode,
  Check,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — AINPAY",
  description: "Learn about AINPAY: our mission to enable sovereign, 0% fee direct UPI payment collections for Indian freelancers, creators, consultants, and independent businesses.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#0d253d] flex flex-col font-normal selection:bg-[#b9b9f9] selection:text-[#533afd]">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header */}
        <section className="stripe-gradient-subtle border-b border-[#e3e8ee] py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e3e8ee] text-[#533afd] text-xs font-semibold mb-4 stripe-shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#533afd]" />
              <span>Our Purpose</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-light tracking-[-1px] text-[#0d253d]">
              Sovereign, direct UPI payments <br className="hidden sm:inline" />
              <span className="font-normal text-[#533afd]">for independent work.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#64748d] max-w-2xl mx-auto leading-relaxed">
              AINPAY was built to eliminate unnecessary intermediary gateway fees and give freelancers, creators, and independent businesses full ownership of their payment collections.
            </p>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-16">
          {/* What is AINPAY? */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
              What is AINPAY?
            </h2>
            <p className="text-sm sm:text-base text-[#64748d] leading-relaxed">
              AINPAY is a direct UPI payment collection platform. Instead of routing your earnings through third-party escrow accounts that deduct 2% to 3% plus GST and hold your money for multiple days, AINPAY provides you with professional, branded payment links and a personal payment page that settle funds directly into your verified bank account via UPI.
            </p>
          </div>

          {/* Who is it for? */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
              Who is AINPAY for?
            </h2>
            <p className="text-sm sm:text-base text-[#64748d] leading-relaxed">
              AINPAY is designed for individuals and businesses operating in India who collect payments from clients and customers:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
                <h3 className="text-sm font-semibold text-[#0d253d] mb-1">
                  Freelancers & Developers
                </h3>
                <p className="text-xs text-[#64748d] leading-relaxed">
                  Send single-use locked payment links for project milestones, advance deposits, and completed deliverables.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
                <h3 className="text-sm font-semibold text-[#0d253d] mb-1">
                  Designers & Creative Studios
                </h3>
                <p className="text-xs text-[#64748d] leading-relaxed">
                  Share a branded payment page that reflects your professionalism and builds client confidence.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
                <h3 className="text-sm font-semibold text-[#0d253d] mb-1">
                  Consultants & Coaches
                </h3>
                <p className="text-xs text-[#64748d] leading-relaxed">
                  Collect consultation fees with locked amounts so clients cannot accidentally pay the wrong figure.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
                <h3 className="text-sm font-semibold text-[#0d253d] mb-1">
                  Small Agencies & Independent Businesses
                </h3>
                <p className="text-xs text-[#64748d] leading-relaxed">
                  Manage payment requests, maintain a clear transaction ledger, and approve incoming payments with a single tap.
                </p>
              </div>
            </div>
          </div>

          {/* How Merchants & Customers Use AINPAY */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
              How It Works in Practice
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#533afd] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#0d253d]">
                    Configure Your Merchant Profile
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748d] mt-1 leading-relaxed">
                    Sign up and provide your name, title, and existing UPI ID (VPA). This is where customer payments will directly land. No complex merchant documentation or waiting for gateway approval.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#533afd] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#0d253d]">
                    Create a Payment Link or Share Your Profile
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748d] mt-1 leading-relaxed">
                    Generate a personalized single-use payment link specifying the customer name, amount, and project note, or simply share your permanent personal page (<code className="text-[#533afd] font-mono text-xs">ainpay.in/pay/username</code>).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#533afd] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#0d253d]">
                    Customer Pays via Any UPI App
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748d] mt-1 leading-relaxed">
                    The customer scans the dynamic QR code or taps "Pay Now" on their mobile device to open Google Pay, PhonePe, Paytm, BHIM, or any compatible UPI application. The amount and payee details are pre-filled.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#533afd] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#0d253d]">
                    UTR Verification & 1-Tap Merchant Approval
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748d] mt-1 leading-relaxed">
                    The customer submits the 12-digit UPI reference number (UTR) generated by their bank. You receive the notification in your dashboard, verify the bank SMS or app notification, and approve the payment with 1 tap. Once approved, single-use links automatically close to prevent duplicate claims.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Principles */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#1c1e54] text-white space-y-4">
            <div className="flex items-center gap-2 text-[#b9b9f9] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#533afd]" />
              <span>Our Principles</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">
              Transparent, Direct, and Sovereign
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              We believe independent creators and professionals should never have their hard-earned money locked in intermediate gateway accounts or depleted by 2–3% transaction cuts. By building on top of India's robust, zero-fee NPCI UPI infrastructure, AINPAY gives you enterprise-grade payment tools without the platform tax.
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
