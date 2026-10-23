import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-[#e3e8ee] bg-white text-[#273951]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <img
                src="/full-logo.png"
                alt="AINPAY"
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="mt-3 text-xs sm:text-sm text-[#64748d] leading-relaxed max-w-sm">
              Direct UPI payment links and personal payment pages for freelancers, creators, consultants, and independent businesses. Zero platform fees, direct bank settlement.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full w-fit font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct Bank Settlement via NPCI UPI</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0d253d] mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/features" className="text-[#64748d] hover:text-[#533afd] transition-colors">
                  Platform Features
                </Link>
              </li>
              <li>
                <Link href="/pay/arslan" className="text-[#64748d] hover:text-[#533afd] transition-colors">
                  Personal Page Demo
                </Link>
              </li>
              <li>
                <Link href="/p/website-advance" className="text-[#64748d] hover:text-[#533afd] transition-colors">
                  Sample Invoice Link
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0d253d] mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-[#64748d] hover:text-[#533afd] transition-colors">
                  About AINPAY
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#64748d] hover:text-[#533afd] transition-colors">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#64748d] hover:text-[#533afd] transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Portal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0d253d] mb-3">
              Legal & Account
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="text-[#64748d] hover:text-[#533afd] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#64748d] hover:text-[#533afd] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#64748d] hover:text-[#533afd] transition-colors">
                  Merchant Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-[#533afd] font-medium hover:underline">
                  Create Account →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#e3e8ee] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748d]">
          <p>© {new Date().getFullYear()} AINPAY. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Direct payments settled to your own bank account.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
