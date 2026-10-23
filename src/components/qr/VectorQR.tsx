"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, ShieldCheck, Image, FileCode } from "lucide-react";

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
  size = 220,
}: VectorQRProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const [pngDataUrl, setPngDataUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Generate SVG for in-page display and high-resolution PNG for download
  useEffect(() => {
    if (!upiUri) return;

    // 1. Vector SVG for scalable responsive rendering
    QRCode.toString(upiUri, {
      type: "svg",
      margin: 1,
      color: {
        dark: "#0d253d", // AINPAY Navy Ink
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

    // 2. High-Resolution Authentic PNG Data URL (800x800) for real image sharing
    QRCode.toDataURL(upiUri, {
      width: 800,
      margin: 2,
      color: {
        dark: "#0d253d",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((dataUrl) => {
        setPngDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error("Failed to generate PNG QR:", err);
      });
  }, [upiUri]);

  // Extract numeric digits from amountFormatted for clear filename (e.g. ₹1,500.00 -> "1500")
  const numericAmount = amountFormatted
    ? amountFormatted.replace(/[^\d.]/g, "").split(".")[0]
    : "";

  const handleCopyUri = () => {
    navigator.clipboard.writeText(upiUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    if (!pngDataUrl) return;
    const a = document.createElement("a");
    a.href = pngDataUrl;
    const filename = numericAmount
      ? `ainpay-payment-${numericAmount}.png`
      : `ainpay-payment-qr.png`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadSuccess("PNG downloaded! Ready to share on WhatsApp or print.");
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = numericAmount
      ? `ainpay-payment-${numericAmount}.svg`
      : `ainpay-payment-qr.svg`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess("Vector SVG downloaded!");
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* High-Contrast Vector QR Card with Elevation */}
      <div className="relative p-4 rounded-2xl bg-white border border-[#e3e8ee] stripe-shadow-md">
        {svgContent ? (
          <div
            className="w-full flex items-center justify-center relative select-none"
            style={{ width: size, height: size }}
          >
            <div
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:rounded-lg"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            {/* Center Electric Indigo Brand Badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-xl bg-[#533afd] text-white flex items-center justify-center shadow-md">
                <span className="font-bold text-base">₹</span>
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
        <span>Direct Bank-to-Bank UPI Transfer</span>
      </div>

      {downloadSuccess && (
        <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full animate-fade-in font-medium">
          {downloadSuccess}
        </div>
      )}

      {/* Primary Actions: Download PNG & Copy Intent */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleDownloadPNG}
          disabled={!pngDataUrl}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#533afd] hover:bg-[#4434d4] text-white text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
          title="Download genuine high-res PNG for sharing"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PNG</span>
        </button>

        <button
          type="button"
          onClick={handleCopyUri}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f6f9fc] border border-[#e3e8ee] text-xs text-[#273951] transition-colors stripe-shadow-sm font-medium"
          title="Copy standard UPI Intent URI"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied UPI Link!" : "Copy Link"}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadSVG}
          disabled={!svgContent}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white hover:bg-[#f6f9fc] border border-[#e3e8ee] text-[11px] text-[#64748d] transition-colors"
          title="Download vector SVG format"
        >
          <FileCode className="w-3 h-3" />
          <span>SVG</span>
        </button>
      </div>
    </div>
  );
}
