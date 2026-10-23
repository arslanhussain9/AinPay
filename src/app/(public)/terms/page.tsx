import React from "react";
import { Metadata } from "next";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";

export const metadata: Metadata = {
  title: "Terms of Service — AINPAY",
  description: "Terms of Service governing the use of AINPAY direct UPI payment links and merchant dashboard tools.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-[#0d253d] flex flex-col font-normal selection:bg-[#b9b9f9] selection:text-[#533afd]">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-light tracking-[-0.8px] text-[#0d253d] mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-[#64748d] mb-10">Last updated: October 2026</p>

        <div className="space-y-8 text-xs sm:text-sm text-[#273951] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0d253d]">1. Acceptance of Terms</h2>
            <p className="text-[#64748d]">
              By creating an account or using AINPAY, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0d253d]">2. Description of Service</h2>
            <p className="text-[#64748d]">
              AINPAY provides software tools enabling individuals, creators, freelancers, and businesses to generate direct UPI payment links, personal payment pages, and manage transaction approvals. AINPAY is a technology software provider and does not hold or escrow client funds.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0d253d]">3. Merchant Responsibilities</h2>
            <p className="text-[#64748d]">
              Merchants are solely responsible for ensuring the accuracy of their provided UPI ID (VPA), fulfilling goods or services promised to clients, and independently verifying incoming bank credits via SMS or bank applications before approving payment submissions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0d253d]">4. Prohibited Uses</h2>
            <p className="text-[#64748d]">
              You may not use AINPAY for fraudulent schemes, unauthorized lottery or gambling collections, sale of prohibited goods, or any activity violating applicable laws and NPCI UPI regulations in India.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0d253d]">5. Limitation of Liability</h2>
            <p className="text-[#64748d]">
              To the maximum extent permitted by applicable law, AINPAY is not liable for indirect, incidental, or consequential damages resulting from banking network downtime, incorrect UPI ID entry by the user, or disputes between buyers and sellers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0d253d]">6. Contact Information</h2>
            <p className="text-[#64748d]">
              For inquiries regarding these Terms, contact our legal team at{" "}
              <a href="mailto:support@ainpay.in" className="text-[#533afd] font-mono hover:underline">
                support@ainpay.in
              </a>.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
