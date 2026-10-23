"use client";

import React, { useEffect, useRef } from "react";
import {
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
  ExternalLink,
  Building2,
  Calendar,
  Hash,
  User,
  ArrowRight,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export interface ConfirmedPaymentData {
  id: string;
  receiptNumber?: string;
  amountPaise: number;
  utrNumber: string;
  payerName: string;
  payerEmail?: string | null;
  payerPhone?: string | null;
  merchantName: string;
  merchantUsername?: string;
  merchantVpa: string;
  invoiceTitle?: string | null;
  approvedAt?: string | Date | null;
  createdAt?: string | Date | null;
}

interface PaymentConfirmedCardProps {
  payment: ConfirmedPaymentData;
  showBackToProfile?: boolean;
}

export function PaymentConfirmedCard({
  payment,
  showBackToProfile = true,
}: PaymentConfirmedCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger celebration confetti on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = 280;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = ["#10b981", "#3b82f6", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"];

    for (let i = 0; i < 65; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 60,
        y: canvas.height * 0.35,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 6 - 2,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }

    let animationId: number;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // gravity
        p.vx *= 0.98; // drag
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (frameCount < 160) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const receiptNum = payment.receiptNumber || `REC-${payment.id.slice(-8).toUpperCase()}`;
  const displayDate = payment.approvedAt
    ? new Date(payment.approvedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  return (
    <div className="w-full flex flex-col items-center gap-5 animate-fade-in relative print:p-0">
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-x-0 top-0 h-64 w-full z-20"
      />

      {/* Radiant Success Badge */}
      <div className="flex flex-col items-center text-center gap-2 pt-2">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm ring-8 ring-emerald-50 animate-bounce-short">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>
          <span className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#533afd]" />
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#0d253d] tracking-tight">
            Payment Confirmed!
          </h2>
          <p className="text-xs text-[#64748d] max-w-sm">
            Direct UPI settlement received and verified by {payment.merchantName}.
          </p>
        </div>
      </div>

      {/* Amount Display */}
      <div className="w-full py-4 px-6 rounded-2xl bg-gradient-to-b from-emerald-50/70 to-emerald-50/30 border border-emerald-200/80 flex flex-col items-center justify-center text-center shadow-xs">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
          Amount Paid & Settled
        </span>
        <div className="text-3xl sm:text-4xl font-light text-[#0d253d] tabular-money tracking-tight my-1">
          {formatINR(payment.amountPaise)}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Settled to {payment.merchantVpa}</span>
        </div>
      </div>

      {/* Official Transaction Receipt Breakdown */}
      <div className="w-full bg-white rounded-2xl border border-[#e3e8ee] p-5 sm:p-6 stripe-shadow-sm flex flex-col gap-3.5 print:border-none print:shadow-none text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#e3e8ee]">
          <span className="font-semibold text-[#0d253d] tracking-wide uppercase text-[11px] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#533afd]" />
            Transaction Receipt
          </span>
          <span className="font-mono text-[11px] font-medium text-[#64748d]">
            {receiptNum}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between py-1">
            <span className="text-[#64748d]">Paid To</span>
            <span className="font-semibold text-[#0d253d]">{payment.merchantName}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#f1f5f9]">
            <span className="text-[#64748d]">Paid By</span>
            <span className="font-medium text-[#0d253d] flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#64748d]" />
              {payment.payerName}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#f1f5f9]">
            <span className="text-[#64748d]">UPI Ref / UTR</span>
            <span className="font-mono font-semibold text-[#533afd] tracking-wider">
              {payment.utrNumber}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#f1f5f9]">
            <span className="text-[#64748d]">Date & Time</span>
            <span className="text-[#273951] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#64748d]" />
              {displayDate}
            </span>
          </div>

          {payment.invoiceTitle && (
            <div className="flex items-center justify-between py-1 border-t border-[#f1f5f9]">
              <span className="text-[#64748d]">Purpose</span>
              <span className="text-[#273951] font-medium text-right max-w-[200px] truncate">
                {payment.invoiceTitle}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-1 border-t border-[#f1f5f9]">
            <span className="text-[#64748d]">Settlement Status</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              VERIFIED & SETTLED
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons (Hidden when printing) */}
      <div className="w-full flex flex-col sm:flex-row gap-2.5 print:hidden">
        <button
          onClick={handlePrint}
          type="button"
          className="flex-1 py-2.5 px-4 rounded-xl border border-[#a8c3de] bg-white hover:bg-[#f6f9fc] text-[#0d253d] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Printer className="w-3.5 h-3.5 text-[#64748d]" />
          <span>Print / Save Receipt</span>
        </button>

        {showBackToProfile && payment.merchantUsername && (
          <Link
            href={`/pay/${payment.merchantUsername}`}
            className="flex-1 btn-stripe-primary !py-2.5 !px-4 text-xs flex items-center justify-center gap-1.5 text-center shadow-xs"
          >
            <span>Back to Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Security Guarantee Note */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#64748d] pt-1 print:hidden">
        <ShieldCheck className="w-3.5 h-3.5 text-[#533afd]" />
        <span>Instant peer-to-peer verification backed by AINPAY Arbiter</span>
      </div>
    </div>
  );
}
