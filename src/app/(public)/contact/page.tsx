import React from "react";
import { Metadata } from "next";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ContactClient } from "./ContactClient";
import { Mail, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — AINPAY",
  description: "Get in touch with the AINPAY support team. Send us a message or email support@ainpay.in for help with your merchant account or payment links.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-[#0d253d] flex flex-col font-normal selection:bg-[#b9b9f9] selection:text-[#533afd]">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header */}
        <section className="stripe-gradient-subtle border-b border-[#e3e8ee] py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e3e8ee] text-[#533afd] text-xs font-semibold mb-4 stripe-shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#533afd]" />
              <span>Support & Inquiries</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-light tracking-[-1px] text-[#0d253d]">
              Contact the AINPAY Team
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#64748d] max-w-2xl mx-auto leading-relaxed">
              Have questions or feedback? Send us a message below or email our support desk directly.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left column: Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#f6f9fc] rounded-2xl p-6 sm:p-7 border border-[#e3e8ee]">
                <h2 className="text-lg font-semibold text-[#0d253d] mb-4">
                  Direct Support
                </h2>
                
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#533afd]/10 text-[#533afd] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[#64748d] block text-xs">Official Support Email</span>
                      <a
                        href="mailto:support@ainpay.in"
                        className="text-[#0d253d] font-semibold hover:text-[#533afd] transition-colors font-mono"
                      >
                        support@ainpay.in
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[#64748d] block text-xs">Support Hours</span>
                      <span className="text-[#0d253d] font-medium">
                        Monday – Saturday, 9:00 AM – 7:00 PM IST
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Platform Guarantee */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-[#eef2ff] to-[#f8fafc] border border-[#e0e7ff] text-xs">
                <div className="flex items-center gap-2 text-[#4338ca] font-semibold mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#533afd]" />
                  <span>Transparent UPI Infrastructure</span>
                </div>
                <p className="text-[#64748d] leading-relaxed">
                  AINPAY operates transparently on top of India's official NPCI UPI network. We do not hold client deposits or charge transaction fees. If you need assistance with an invoice or transaction verification, include the 12-digit UTR in your inquiry.
                </p>
              </div>
            </div>

            {/* Right column: Form */}
            <div className="lg:col-span-7">
              <ContactClient />
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
