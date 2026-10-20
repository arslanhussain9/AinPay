"use client";

import React, { useState } from "react";
import { formatINR, buildUPIUri } from "@/lib/utils";
import { VectorQR } from "@/components/qr/VectorQR";
import { MobileDrawer } from "@/components/checkout/MobileDrawer";
import { UtrSubmissionBox } from "@/components/checkout/UtrSubmissionBox";
import {
  CheckCircle2,
  ChevronRight,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

interface FreelancerPageClientProps {
  freelancer: any;
  paymentLinks: any[];
}

export function FreelancerPageClient({
  freelancer,
  paymentLinks,
}: FreelancerPageClientProps) {
  const presets = [500, 1500, 5000, 10000];
  const [selectedPreset, setSelectedPreset] = useState<number>(1500);
  const [customAmountRupees, setCustomAmountRupees] = useState<string>("1500");
  const [clientNote, setClientNote] = useState<string>("");
  const [clientUtr, setClientUtr] = useState<string>("");
  const [payStep, setPayStep] = useState<"SELECT" | "PAY_QR" | "SUCCESS">("SELECT");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const currentAmountRupees = parseInt(customAmountRupees, 10) || 0;
  const currentAmountPaise = currentAmountRupees * 100;

  const upiUri = buildUPIUri({
    vpa: freelancer.vpa,
    name: freelancer.name,
    amountPaise: currentAmountPaise > 0 ? currentAmountPaise : 10000,
    transactionRef: `PM_${Date.now().toString().slice(-6)}`,
    note: clientNote || `Payment to ${freelancer.name}`,
  });

  const handleStartPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmountRupees < 1) {
      setErrorMsg("Please enter an amount of at least ₹1");
      return;
    }
    setErrorMsg("");
    setPayStep("PAY_QR");
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#0d253d] flex flex-col items-center p-4 sm:p-6 lg:p-12 font-normal">
      <div className="w-full max-w-xl z-10 flex flex-col gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e3e8ee] stripe-shadow-md flex flex-col items-center text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-2xl bg-[#533afd] text-white flex items-center justify-center font-bold text-2xl shadow-sm mb-4">
            {freelancer.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div className="flex items-center gap-1.5 justify-center">
            <h1 className="text-2xl font-light tracking-[-0.64px] text-[#0d253d]">
              {freelancer.name}
            </h1>
            <CheckCircle2 className="w-5 h-5 text-[#533afd]" />
          </div>

          {freelancer.title && (
            <p className="text-xs sm:text-sm font-medium text-[#533afd] mt-0.5">
              {freelancer.title}
            </p>
          )}

          {freelancer.bio && (
            <p className="text-xs text-[#64748d] font-light max-w-md mt-2.5 leading-relaxed">
              {freelancer.bio}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#273951] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#533afd]" />
              <span className="font-mono text-[#0d253d]">{freelancer.vpa}</span>
            </span>
          </div>

          {/* Social Links */}
          {(freelancer.twitter || freelancer.github || freelancer.linkedin) && (
            <div className="mt-4 flex items-center gap-4 text-xs text-[#64748d]">
              {freelancer.twitter && (
                <a href={freelancer.twitter} target="_blank" rel="noreferrer" className="hover:text-[#533afd]">
                  Twitter
                </a>
              )}
              {freelancer.github && (
                <a href={freelancer.github} target="_blank" rel="noreferrer" className="hover:text-[#533afd]">
                  GitHub
                </a>
              )}
              {freelancer.linkedin && (
                <a href={freelancer.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#533afd]">
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>

        {/* Quick Pay Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e3e8ee] stripe-shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e3e8ee]">
            <h2 className="text-sm font-medium text-[#0d253d]">
              Pay {freelancer.name.split(" ")[0]}
            </h2>
            <span className="text-[11px] text-[#64748d]">Direct UPI</span>
          </div>

          {payStep === "SELECT" && (
            <form onSubmit={handleStartPay} className="flex flex-col gap-3.5">
              <div>
                <div className="grid grid-cols-4 gap-2">
                  {presets.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(amt);
                        setCustomAmountRupees(amt.toString());
                      }}
                      className={`py-2 rounded-lg text-xs font-medium tabular-money transition-all ${
                        selectedPreset === amt
                          ? "bg-[#533afd] text-white shadow-sm"
                          : "bg-[#f6f9fc] hover:bg-[#e3e8ee] text-[#273951] border border-[#e3e8ee]"
                      }`}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-3 text-lg font-semibold text-[#64748d]">₹</span>
                <input
                  type="number"
                  min="1"
                  value={customAmountRupees}
                  onChange={(e) => {
                    setCustomAmountRupees(e.target.value);
                    setSelectedPreset(0);
                  }}
                  placeholder="Custom amount"
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-[#a8c3de] text-lg font-normal tabular-money text-[#0d253d] focus:outline-none focus:border-[#533afd]"
                />
              </div>

              <input
                type="text"
                value={clientNote}
                onChange={(e) => setClientNote(e.target.value)}
                placeholder="Note (optional)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#a8c3de] text-[#0d253d] focus:outline-none focus:border-[#533afd]"
              />

              {errorMsg && <p className="text-xs text-rose-600">{errorMsg}</p>}

              <button type="submit" className="w-full btn-stripe-primary !py-2.5 text-xs">
                <span>Pay {formatINR(currentAmountPaise)}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {payStep === "PAY_QR" && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748d]">
                  Amount: <strong className="text-[#0d253d] font-semibold">{formatINR(currentAmountPaise)}</strong>
                </span>
                <button
                  onClick={() => setPayStep("SELECT")}
                  className="text-xs text-[#533afd] hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="hidden sm:flex flex-col items-center">
                <VectorQR
                  upiUri={upiUri}
                  payeeName={freelancer.name}
                  amountFormatted={formatINR(currentAmountPaise)}
                  size={200}
                />
              </div>

              <div className="sm:hidden w-full">
                <MobileDrawer
                  upiUri={upiUri}
                  amountFormatted={formatINR(currentAmountPaise)}
                  payeeName={freelancer.name}
                />
              </div>

              <UtrSubmissionBox
                freelancerId={freelancer.id}
                amountPaise={currentAmountPaise}
                note={clientNote || `Payment to ${freelancer.name}`}
                onSuccess={(utr) => {
                  setClientUtr(utr);
                  setPayStep("SUCCESS");
                }}
              />
            </div>
          )}

          {payStep === "SUCCESS" && (
            <div className="p-6 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col items-center text-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <h3 className="text-sm font-semibold text-[#0d253d]">Payment Logged</h3>
              <p className="text-xs text-[#273951]">
                Amount: <strong className="tabular-money">{formatINR(currentAmountPaise)}</strong> • Ref:{" "}
                <span className="font-mono text-[#533afd] font-semibold">{clientUtr}</span>
              </p>
              <button
                onClick={() => {
                  setPayStep("SELECT");
                  setClientUtr("");
                }}
                className="mt-2 text-xs text-[#533afd] hover:underline font-medium"
              >
                Send Another Payment →
              </button>
            </div>
          )}
        </div>

        {/* Listed Services & Invoices */}
        {paymentLinks.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-medium text-[#0d253d]">Services & Invoices</h2>
              <span className="text-xs text-[#64748d]">{paymentLinks.length} active</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {paymentLinks.map((link) => {
                const isClosed = link.status === "CLOSED" || (link.maxSlots && link.usedSlots >= link.maxSlots);
                const remaining = link.maxSlots ? Math.max(0, link.maxSlots - link.usedSlots) : null;

                return (
                  <div
                    key={link.id}
                    className="bg-white rounded-xl p-5 border border-[#e3e8ee] stripe-shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-[#0d253d]">{link.title}</h3>
                        {isClosed && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            Closed
                          </span>
                        )}
                      </div>

                      {link.description && (
                        <p className="text-xs text-[#64748d] font-light line-clamp-2">
                          {link.description}
                        </p>
                      )}

                      {remaining !== null && (
                        <div className="flex items-center gap-1 text-xs text-amber-700 font-medium mt-0.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>{isClosed ? "Capacity reached" : `${remaining} spots remaining`}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#e3e8ee]">
                      {link.amountPaise && (
                        <div className="text-base font-normal text-[#0d253d] tabular-money">
                          {formatINR(link.amountPaise)}
                        </div>
                      )}

                      <Link
                        href={`/p/${link.slug}`}
                        className={`!py-1.5 !px-3.5 text-xs ${
                          isClosed ? "btn-stripe-secondary" : "btn-stripe-primary"
                        }`}
                      >
                        <span>{isClosed ? "View" : "Pay"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-[#64748d] pt-4 border-t border-[#e3e8ee]">
          Powered by{" "}
          <Link href="/" className="text-[#533afd] font-medium hover:underline">
            PayMe
          </Link>
        </footer>
      </div>
    </div>
  );
}
