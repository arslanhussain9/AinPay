"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, ShieldCheck } from "lucide-react";

interface VectorQRProps {
  upiUri: string;
  payeeName?: string;
  amountFormatted?: string;
  size?: number;
}

export function VectorQR({
  upiUri,
  payeeName,
  amountFormatted,
  size = 240,
}: VectorQRProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!upiUri) return;

    QRCode.toString(upiUri, {
      type: "svg",
      margin: 1,
      color: {
        dark: "#0d253d", // Stripe Ink Navy
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((svg) => {
        setSvgContent(svg);
      })
      .catch((err) => {
        console.error("Failed to generate SVG QR:", err);
      });
  }, [upiUri]);

  const handleCopyUri = () => {
    navigator.clipboard.writeText(upiUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PayMe-${payeeName ? payeeName.replace(/\s+/g, "_") : "QR"}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center">
      {/* High-Contrast Vector QR Card with Stripe Elevation */}
      <div className="relative p-4 rounded-2xl bg-white border border-[#e3e8ee] stripe-shadow-md">
        {svgContent ? (
          <div
            className="w-full flex items-center justify-center relative"
            style={{ width: size, height: size }}
          >
            <div
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:rounded-lg"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            {/* Center Electric Indigo Brand Badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-11 h-11 rounded-xl bg-[#533afd] text-white flex items-center justify-center shadow-md">
                <span className="font-bold text-lg">₹</span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center bg-[#f6f9fc] rounded-lg animate-pulse"
            style={{ width: size, height: size }}
          >
            <span className="text-[#64748d] text-xs font-mono">Generating Vector QR...</span>
          </div>
        )}
      </div>

      {/* Payer Trust Pill */}
      <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#273951] text-xs font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-[#533afd]" />
        <span>Direct NPCI Sovereign Bank Transfer</span>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleCopyUri}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f6f9fc] border border-[#e3e8ee] text-xs text-[#273951] transition-colors stripe-shadow-sm font-medium"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#533afd]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied UPI Link!" : "Copy Intent URI"}</span>
        </button>

        <button
          onClick={handleDownloadQR}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f6f9fc] border border-[#e3e8ee] text-xs text-[#273951] transition-colors stripe-shadow-sm font-medium"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download SVG</span>
        </button>
      </div>
    </div>
  );
}
