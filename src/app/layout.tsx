import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayMe — The 0% Fee Razorpay.me for Indian Freelancers",
  description: "Get paid directly to bank over UPI. Zero gateway commissions, instant T+0 settlement, and your own branded payme.in/username link.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className="min-h-screen bg-white text-[#0d253d] antialiased selection:bg-[#b9b9f9] selection:text-[#533afd]">
        {children}
      </body>
    </html>
  );
}
