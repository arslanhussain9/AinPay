import React from "react";
import { Metadata } from "next";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";

export const metadata: Metadata = {
  title: "Privacy Policy — AINPAY",
  description: "AINPAY Privacy Policy outlining how merchant and payment submission data is handled with transparency and respect.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-[#0d253d] flex flex-col font-normal selection:bg-[#b9b9f9] selection:text-[#533afd]">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-light tracking-[-0.8px] text-[#0d253d] mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#64748d] mb-10">Last updated: October 2026</p>

        <div className="space-y-8 text-xs sm:text-sm text-[#273951] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0d253d]">1. Overview</h2>
            <p className="text-[#64748d]">
              AINPAY (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides direct UPI payment links and personal payment pages for freelancers, creators, and independent businesses in India. We are committed to transparency and the security of your data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0d253d]">2. Information We Collect</h2>
            <p className="text-[#64748d]">
              When you register as a merchant, we collect your name, email address, password hash, title, bio, and verified Virtual Payment Address (UPI ID / VPA). When customers interact with your payment link, we collect customer payment reference details such as the payer name, amount, optional contact information, and 12-digit UPI Transaction Reference (UTR) submitted for verification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0d253d]">3. How Information Is Used</h2>
            <p className="text-[#64748d]">
              We use your information solely to provide, operate, and maintain the AINPAY platform, generate valid UPI payment deep links and QR codes, present payment requests to clients, and facilitate merchant approval and record-keeping in your private dashboard.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0d253d]">4. Financial Data & UPI Routing</h2>
            <p className="text-[#64748d]">
              AINPAY does not store bank account passwords, UPI PINs, credit/debit card numbers, or sensitive financial authentication tokens. Direct UPI transactions occur entirely through NPCI-authorized UPI applications (such as Google Pay, PhonePe, Paytm, or BHIM) directly to your bank account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0d253d]">5. Contact Us</h2>
            <p className="text-[#64748d]">
              For any questions regarding this Privacy Policy or your data, contact our data protection team at{" "}
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
