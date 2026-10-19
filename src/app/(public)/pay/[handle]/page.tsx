import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronRight, ShieldCheck, Sparkles, Users, Lock } from "lucide-react";

interface PageProps {
  params: {
    handle: string;
  };
}

export default async function MerchantProfilePage({ params }: PageProps) {
  const merchant = await prisma.merchant.findUnique({
    where: { handle: params.handle },
    include: {
      campaigns: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!merchant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f6f9fc] flex flex-col items-center p-4 sm:p-6 lg:p-12">
      {/* Top subtle sheen */}
      <div className="fixed top-0 left-0 w-full h-48 bg-gradient-to-b from-[#b9b9f9]/20 to-transparent pointer-events-none" />

      <div className="w-full max-w-2xl z-10 flex flex-col gap-6">
        {/* Merchant Header Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left border border-[#e3e8ee] stripe-shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#533afd] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            {merchant.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-light tracking-[-0.64px] text-[#0d253d]">
                {merchant.businessName || merchant.name}
              </h1>
              <CheckCircle className="w-4 h-4 text-[#533afd]" />
            </div>

            <p className="text-xs text-[#64748d] font-mono">
              quickupi.in/pay/{merchant.handle}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#273951] text-xs font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#533afd]" />
                VPA: <strong className="text-[#0d253d] font-mono">{merchant.vpa}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#64748d] text-xs">
                Direct T+0 Settlement
              </span>
            </div>
          </div>
        </div>

        {/* Section: Active Smart Limit Campaigns */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#533afd]" />
              <h2 className="text-sm font-semibold text-[#0d253d]">Active Offerings & Limit QRs</h2>
            </div>
            <span className="text-xs text-[#64748d]">
              {merchant.campaigns.length} available
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {merchant.campaigns.map((camp) => {
              const isLocked =
                camp.status === "SLOTS_EXHAUSTED" ||
                camp.status === "CAP_REACHED" ||
                (camp.maxSlots !== null && camp.usedSlots >= camp.maxSlots);

              const remainingSlots = camp.maxSlots ? Math.max(0, camp.maxSlots - camp.usedSlots) : null;

              return (
                <div
                  key={camp.id}
                  className="bg-white hover:border-[#a8c3de] transition-all rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#e3e8ee] stripe-shadow-sm"
                >
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#0d253d]">{camp.title}</h3>
                      {isLocked ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Sold Out
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#b9b9f9]/40 text-[#4434d4]">
                          Active
                        </span>
                      )}
                    </div>

                    {camp.description && (
                      <p className="text-xs text-[#64748d] font-light line-clamp-2">
                        {camp.description}
                      </p>
                    )}

                    {remainingSlots !== null && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 mt-1 font-medium">
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          {isLocked
                            ? `All ${camp.maxSlots} slots booked`
                            : `Only ${remainingSlots} of ${camp.maxSlots} seats remaining!`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#e3e8ee]">
                    <div className="text-left sm:text-right">
                      <div className="text-base font-normal text-[#0d253d] tabular-money">
                        {formatINR(camp.amountPaise)}
                      </div>
                      <div className="text-[10px] text-[#64748d]">0% Fee UPI</div>
                    </div>

                    <Link
                      href={`/r/${camp.slug}`}
                      className={`!py-2 !px-4 text-xs ${
                        isLocked
                          ? "btn-stripe-secondary"
                          : "btn-stripe-primary"
                      }`}
                    >
                      <span>{isLocked ? "View Details" : "Enroll / Pay"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[#64748d] pt-6 border-t border-[#e3e8ee]">
          Powered by{" "}
          <Link href="/" className="text-[#533afd] font-medium hover:underline">
            QuickUPI
          </Link>{" "}
          • Sovereign direct-to-bank payment orchestration
        </div>
      </div>
    </div>
  );
}
