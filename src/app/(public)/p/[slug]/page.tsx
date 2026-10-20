import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { buildUPIUri, formatINR } from "@/lib/utils";
import { VectorQR } from "@/components/qr/VectorQR";
import { MobileDrawer } from "@/components/checkout/MobileDrawer";
import { UtrSubmissionBox } from "@/components/checkout/UtrSubmissionBox";
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";

export default async function PaymentLinkCheckoutPage({ params }: PageProps) {
  const paymentLink = await prisma.paymentLink.findFirst({
    where: { slug: params.slug },
    include: { freelancer: true },
  });

  if (!paymentLink) {
    notFound();
  }

  const { freelancer } = paymentLink;
  const isClosed =
    paymentLink.status === "CLOSED" ||
    (paymentLink.maxSlots !== null && paymentLink.usedSlots >= paymentLink.maxSlots);

  const amountPaise = paymentLink.amountPaise || 100000; // fallback to ₹1,000 if open

  const upiUri = buildUPIUri({
    vpa: freelancer.vpa,
    name: freelancer.name,
    amountPaise,
    transactionRef: `INV_${paymentLink.slug.toUpperCase().slice(0, 8)}_${Date.now().toString().slice(-4)}`,
    note: paymentLink.title,
  });

  const remaining = paymentLink.maxSlots ? Math.max(0, paymentLink.maxSlots - paymentLink.usedSlots) : null;

  return (
    <div className="min-h-screen bg-[#f6f9fc] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Top subtle sheen */}
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-[#b9b9f9]/20 to-transparent pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col gap-4">
        {/* Navigation */}
        <div className="flex items-center justify-between px-1">
          <Link
            href={`/pay/${freelancer.username}`}
            className="flex items-center gap-1.5 text-xs text-[#64748d] hover:text-[#0d253d] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{freelancer.name}'s Profile</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-[#533afd] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#533afd]" />
            <span>0% Fee Direct Bank Settlement</span>
          </div>
        </div>

        {/* White Checkout Card */}
        <div className="bg-white rounded-2xl border border-[#e3e8ee] p-6 sm:p-7 flex flex-col gap-5 stripe-shadow-md relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#533afd] bg-[#b9b9f9]/30 px-2.5 py-0.5 rounded-full">
                Freelancer Invoice
              </span>
              <span className="text-xs text-[#64748d] flex items-center gap-1">
                <span>By</span>
                <strong className="text-[#0d253d]">{freelancer.name}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-light tracking-[-0.64px] text-[#0d253d] mt-1">
              {paymentLink.title}
            </h1>

            {paymentLink.description && (
              <p className="text-xs text-[#64748d] font-light leading-relaxed">
                {paymentLink.description}
              </p>
            )}

            {/* Price Box */}
            <div className="mt-2 flex items-baseline justify-between p-3 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
              <span className="text-xs text-[#64748d]">Amount to Pay:</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-normal text-[#0d253d] tracking-tight tabular-money">
                  {formatINR(amountPaise)}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">T+0 Direct</span>
              </div>
            </div>

            {/* Slots limit banner if applicable */}
            {remaining !== null && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {isClosed ? "All spots booked" : `Only ${remaining} of ${paymentLink.maxSlots} spots left!`}
                  </span>
                </span>
                <span className="tabular-money">{paymentLink.usedSlots} booked</span>
              </div>
            )}
          </div>

          {!isClosed ? (
            <>
              {/* Desktop Vector SVG QR */}
              <div className="hidden sm:flex flex-col items-center">
                <VectorQR
                  upiUri={upiUri}
                  payeeName={freelancer.name}
                  amountFormatted={formatINR(amountPaise)}
                  size={210}
                />
              </div>

              {/* Mobile 1-Tap Drawer */}
              <div className="sm:hidden w-full">
                <MobileDrawer
                  upiUri={upiUri}
                  amountFormatted={formatINR(amountPaise)}
                  payeeName={freelancer.name}
                />
              </div>

              {/* UTR Submission Box */}
              <UtrSubmissionBox
                paymentLinkId={paymentLink.id}
                freelancerId={freelancer.id}
                amountPaise={amountPaise}
              />
            </>
          ) : (
            <div className="p-6 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] flex flex-col items-center text-center gap-2">
              <Lock className="w-8 h-8 text-rose-500" />
              <h3 className="text-sm font-semibold text-[#0d253d]">Invoice / Service Closed</h3>
              <p className="text-xs text-[#64748d]">
                This payment link has reached its maximum slot capacity.
              </p>
              <Link
                href={`/pay/${freelancer.username}`}
                className="mt-2 text-xs text-[#533afd] hover:underline font-medium"
              >
                Return to {freelancer.name}'s profile →
              </Link>
            </div>
          )}

          {/* Trust Footer */}
          <div className="pt-3 border-t border-[#e3e8ee] flex items-center justify-between text-[11px] text-[#64748d]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#533afd]" />
              Payee: <strong className="text-[#0d253d]">{freelancer.vpa}</strong>
            </span>
            <span>Secured by PayMe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
