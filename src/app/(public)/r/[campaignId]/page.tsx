import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { buildUPIUri, formatINR } from "@/lib/utils";
import { VectorQR } from "@/components/qr/VectorQR";
import { LimitsMeter } from "@/components/checkout/LimitsMeter";
import { CountdownTimer } from "@/components/checkout/CountdownTimer";
import { MobileDrawer } from "@/components/checkout/MobileDrawer";
import { UtrSubmissionBox } from "@/components/checkout/UtrSubmissionBox";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: {
    campaignId: string;
  };
}

export default async function CampaignCheckoutPage({ params }: PageProps) {
  const campaign = await prisma.paymentCampaign.findFirst({
    where: {
      OR: [{ id: params.campaignId }, { slug: params.campaignId }],
    },
    include: {
      merchant: true,
    },
  });

  if (!campaign) {
    notFound();
  }

  const upiUri = buildUPIUri({
    vpa: campaign.merchant.vpa,
    name: campaign.merchant.businessName || campaign.merchant.name,
    amountPaise: campaign.amountPaise,
    transactionRef: `REQ_${campaign.slug.toUpperCase().slice(0, 8)}_${Date.now().toString().slice(-4)}`,
    note: campaign.title,
  });

  const isLocked =
    (campaign.maxSlots !== null && campaign.usedSlots >= campaign.maxSlots) ||
    (campaign.totalCapPaise !== null && campaign.collectedPaise >= campaign.totalCapPaise) ||
    campaign.status === "SLOTS_EXHAUSTED" ||
    campaign.status === "CAP_REACHED";

  return (
    <div className="min-h-screen bg-[#f6f9fc] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Top subtle atmospheric sheen */}
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-[#b9b9f9]/20 to-transparent pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 flex flex-col gap-4">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between px-1">
          <Link
            href={`/pay/${campaign.merchant.handle}`}
            className="flex items-center gap-1.5 text-xs text-[#64748d] hover:text-[#0d253d] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{campaign.merchant.name}'s Profile</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-[#533afd] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#533afd]" />
            <span>0% Fee Direct Bank Settlement</span>
          </div>
        </div>

        {/* Floating White Checkout Card with Stripe Shadow */}
        <div className="bg-white rounded-2xl border border-[#e3e8ee] p-6 sm:p-7 flex flex-col gap-5 stripe-shadow-md relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#533afd] bg-[#b9b9f9]/30 px-2.5 py-0.5 rounded-full">
                Sovereign Checkout
              </span>
              <CountdownTimer expiresAt={campaign.expiresAt || undefined} />
            </div>

            <h1 className="text-xl sm:text-2xl font-light tracking-[-0.64px] text-[#0d253d] mt-1">
              {campaign.title}
            </h1>

            {campaign.description && (
              <p className="text-xs text-[#64748d] font-light leading-relaxed">
                {campaign.description}
              </p>
            )}

            {/* Price Lock Banner */}
            <div className="mt-2 flex items-baseline justify-between p-3 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
              <span className="text-xs text-[#64748d]">Amount to Pay:</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-normal text-[#0d253d] tracking-tight tabular-money">
                  {formatINR(campaign.amountPaise)}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">T+0 Instant</span>
              </div>
            </div>
          </div>

          {/* Limits Progress Meter */}
          <LimitsMeter
            maxSlots={campaign.maxSlots}
            usedSlots={campaign.usedSlots}
            totalCapPaise={campaign.totalCapPaise}
            collectedPaise={campaign.collectedPaise}
            status={campaign.status}
          />

          {!isLocked ? (
            <>
              {/* Desktop Vector SVG QR */}
              <div className="hidden sm:flex flex-col items-center">
                <VectorQR
                  upiUri={upiUri}
                  payeeName={campaign.merchant.businessName || campaign.merchant.name}
                  amountFormatted={formatINR(campaign.amountPaise)}
                  size={220}
                />
              </div>

              {/* Mobile 1-Tap Drawer */}
              <div className="sm:hidden w-full">
                <MobileDrawer
                  upiUri={upiUri}
                  amountFormatted={formatINR(campaign.amountPaise)}
                  payeeName={campaign.merchant.businessName || campaign.merchant.name}
                />
              </div>

              {/* Mode A UTR Verification */}
              <UtrSubmissionBox
                campaignId={campaign.id}
                amountPaise={campaign.amountPaise}
              />
            </>
          ) : (
            <div className="p-6 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#0d253d]">Enrollment Closed</h3>
              <p className="text-xs text-[#64748d] max-w-xs font-light">
                This campaign has reached its automated collection limit. No further payments can be accepted for this session.
              </p>
              <Link
                href={`/pay/${campaign.merchant.handle}`}
                className="mt-1 text-xs text-[#533afd] hover:underline font-medium"
              >
                Browse other offerings from {campaign.merchant.name} →
              </Link>
            </div>
          )}

          {/* Trust Footer */}
          <div className="pt-3 border-t border-[#e3e8ee] flex items-center justify-between text-[11px] text-[#64748d]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#533afd]" />
              Payee: <strong className="text-[#0d253d]">{campaign.merchant.vpa}</strong>
            </span>
            <span>Secured by QuickUPI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
