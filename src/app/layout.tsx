import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AINPAY — Direct UPI Payment Links & Invoices for Everyone",
  description: "Collect payments directly into your bank account over UPI. Custom payment pages, invoice links, and instant 0% fee bank settlements.",
  icons: {
    icon: "/semi-logo.png",
    shortcut: "/semi-logo.png",
    apple: "/semi-logo.png",
  },
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
