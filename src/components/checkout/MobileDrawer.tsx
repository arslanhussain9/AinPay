"use client";

import React from "react";
import { ArrowRight, Smartphone, Sparkles } from "lucide-react";

interface MobileDrawerProps {
  upiUri: string;
  amountFormatted: string;
  payeeName: string;
  onAppLaunched?: (appName: string) => void;
}

export function MobileDrawer({
  upiUri,
  amountFormatted,
  payeeName,
  onAppLaunched,
}: MobileDrawerProps) {
  const cleanUri = upiUri.replace(/^upi:\/\/pay\?/, "");
  
  const apps = [
    {
      id: "gpay",
      name: "Google Pay",
      iconText: "GPay",
      intentUri: `gpay://upi/pay?${cleanUri}`,
      color: "#4285F4",
    },
    {
      id: "phonepe",
      name: "PhonePe",
      iconText: "Pe",
      intentUri: `phonepe://pay?${cleanUri}`,
      color: "#5F259F",
    },
    {
      id: "paytm",
      name: "Paytm UPI",
      iconText: "Paytm",
      intentUri: `paytmmp://pay?${cleanUri}`,
      color: "#00BAF2",
    },
    {
      id: "cred",
      name: "CRED",
      iconText: "CRED",
      intentUri: `cred://upi/pay?${cleanUri}`,
      color: "#111827",
    },
  ];

  const handleLaunch = (app: typeof apps[0]) => {
    onAppLaunched?.(app.name);
    window.location.href = app.intentUri;
    setTimeout(() => {
      window.location.href = upiUri;
    }, 600);
  };

  return (
    <div className="w-full flex flex-col gap-3 p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#533afd]" />
          <span className="text-xs font-semibold text-[#0d253d]">1-Tap Fast Pay</span>
        </div>
        <span className="text-[11px] text-[#64748d]">Direct App Launch</span>
      </div>

      <p className="text-xs text-[#64748d]">
        Launch your preferred UPI app pre-filled with <span className="text-[#0d253d] font-semibold tabular-money">{amountFormatted}</span>:
      </p>

      {/* Grid of 1-Tap App Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => handleLaunch(app)}
            className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#e3e8ee] text-xs font-medium text-[#273951] stripe-shadow-sm hover:border-[#a8c3de] transition-all active:scale-95"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded flex items-center justify-center font-bold text-[9px] text-white"
                style={{ backgroundColor: app.color }}
              >
                {app.iconText.slice(0, 2)}
              </div>
              <span>{app.name}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#64748d]" />
          </button>
        ))}
      </div>

      {/* Primary Universal Intent Button */}
      <a
        href={upiUri}
        onClick={() => onAppLaunched?.("Default UPI")}
        className="mt-1 w-full btn-stripe-primary !py-2.5 text-xs"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Pay with Any UPI App</span>
      </a>
    </div>
  );
}
