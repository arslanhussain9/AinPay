"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, X, ArrowUpRight } from "lucide-react";

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#e3e8ee] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          aria-label="AINPAY Home"
        >
          <img
            src="/full-logo.png"
            alt="AINPAY"
            className="h-7 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[14px]">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium ${
                  active
                    ? "text-[#533afd] font-semibold"
                    : "text-[#273951] hover:text-[#533afd]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/pay/arslan"
            className="text-[#64748d] hover:text-[#0d253d] font-medium flex items-center gap-1 transition-colors"
          >
            <span>Demo Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </Link>
        </nav>

        {/* Desktop Auth CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[14px] text-[#273951] hover:text-[#533afd] font-medium px-3 py-1.5 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="btn-stripe-primary text-[13px] !py-2 !px-4"
          >
            <span>Get Started</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#273951] hover:bg-[#f6f9fc] hover:text-[#0d253d] transition-colors"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e3e8ee] bg-white px-4 pt-3 pb-6 space-y-3 stripe-shadow-md animate-fade-in">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#533afd]/10 text-[#533afd]"
                      : "text-[#273951] hover:bg-[#f6f9fc]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/pay/arslan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-[#64748d] hover:bg-[#f6f9fc] flex items-center justify-between font-medium"
            >
              <span>Demo Profile</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-3 border-t border-[#e3e8ee] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-[#e3e8ee] text-sm font-medium text-[#273951] hover:bg-[#f6f9fc]"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full btn-stripe-primary text-center py-2.5 text-sm"
            >
              <span>Create Free Account</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
