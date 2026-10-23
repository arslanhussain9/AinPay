import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { HelpCircle, ChevronRight, MessageSquare, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — AINPAY",
  description: "Find clear answers to common questions about AINPAY, direct UPI settlements, 0% platform fees, payment links, and merchant approvals.",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What is AINPAY and how does it differ from traditional payment gateways?",
      answer:
        "Traditional payment gateways (like Razorpay, Stripe, or Cashfree) act as financial intermediaries: they collect client funds into their own escrow accounts, charge a 2% to 3% fee plus GST per transaction, and settle the remaining balance to your bank account after 2 to 3 business days. AINPAY is a direct UPI payment platform. Funds transfer directly from your customer's bank account to your verified UPI ID via NPCI's UPI rails with 0% platform fees and instant bank credit.",
    },
    {
      question: "How is AINPAY able to offer 0% platform fees?",
      answer:
        "The Unified Payments Interface (UPI) operated by the National Payments Corporation of India (NPCI) has zero interchange fees for peer-to-peer and small merchant bank transfers. Because AINPAY does not sit in the flow of funds as an escrow holder or banking intermediary, we do not deduct a percentage cut from your payments.",
    },
    {
      question: "What is a single-use payment link and why is it important?",
      answer:
        "A single-use payment link is generated for a specific customer with a strictly locked amount. Once the customer completes the payment and you approve it from your dashboard, the link is automatically marked as CLOSED. This guarantees that a client cannot underpay, reuse an old link, or claim multiple payments against a single invoice.",
    },
    {
      question: "Can I manually close a payment link if the customer cancels or changes terms?",
      answer:
        "Yes. In your merchant dashboard, every active payment link has a 'Close Link' action. If a deal is cancelled or terms change before payment is submitted, you can close the link immediately. Once closed, customers are prevented from viewing payment options or submitting payment claims on that URL.",
    },
    {
      question: "How does payment verification and approval work?",
      answer:
        "When a customer pays via UPI (either by scanning the QR code or tapping Pay Now in a mobile UPI app), their banking app generates a 12-digit UPI Transaction Reference (UTR) number. The customer enters this UTR on the payment page. You will see this pending submission in your dashboard with the payer's name, amount, and UTR. You can cross-check with your bank SMS or UPI app and click 'Approve' to credit the payment and lock the link.",
    },
    {
      question: "Which UPI applications are supported?",
      answer:
        "All applications compatible with the standard NPCI UPI specification are supported, including Google Pay, PhonePe, Paytm, BHIM, Cred, Amazon Pay, and individual bank UPI apps (HDFC, ICICI, SBI, Axis, etc.).",
    },
    {
      question: "Can customers alter or change the payment amount?",
      answer:
        "No. On invoice-specific payment links (`ainpay.in/p/slug`), the amount is strictly fixed by the merchant. The customer cannot edit the amount in the interface, and the deep-link passes the locked amount directly to the UPI application. Furthermore, the backend rejects any payment submission where the amount does not match the merchant's configured figure.",
    },
    {
      question: "What is the difference between my personal payment page and an invoice payment link?",
      answer:
        "Your personal payment page (`ainpay.in/pay/yourname`) is a permanent public mini-website showcasing your profile, verified UPI ID, and preset amounts (e.g. ₹500, ₹1,500, ₹5,000). Customers can pick a preset or enter a custom amount. An invoice payment link (`ainpay.in/p/slug`) is created for a specific client with a fixed, unalterable amount and single-use security.",
    },
    {
      question: "Is there any limit on how much I can receive?",
      answer:
        "Standard NPCI guidelines limit person-to-person UPI transactions to ₹1,00,000 per day (or higher for certain verified merchant categories and institutional banks). Limits are determined by your personal bank and UPI application policies.",
    },
    {
      question: "How do I download and share payment QR codes?",
      answer:
        "On any payment page or link, click 'Download PNG'. AINPAY generates a real, high-resolution PNG image encoding the standard UPI URI for that transaction. You can share this PNG image through WhatsApp, Telegram, email, or embed it in client PDF proposals.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0d253d] flex flex-col font-normal selection:bg-[#b9b9f9] selection:text-[#533afd]">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header */}
        <section className="stripe-gradient-subtle border-b border-[#e3e8ee] py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e3e8ee] text-[#533afd] text-xs font-semibold mb-4 stripe-shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#533afd]" />
              <span>Common Questions</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-light tracking-[-1px] text-[#0d253d]">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#64748d] max-w-2xl mx-auto leading-relaxed">
              Clear, straightforward answers about how AINPAY works, UPI settlements, and payment security.
            </p>
          </div>
        </section>

        {/* FAQ List */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-[#e3e8ee] p-6 sm:p-7 stripe-shadow-sm"
              >
                <h2 className="text-base sm:text-lg font-semibold text-[#0d253d] tracking-tight mb-2.5 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#533afd]/10 text-[#533afd] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    Q
                  </span>
                  <span>{faq.question}</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#64748d] leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Need more help? */}
          <div className="mt-16 rounded-2xl bg-[#f6f9fc] border border-[#e3e8ee] p-8 sm:p-10 text-center flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl font-light text-[#0d253d] tracking-tight">
              Still have a question?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#64748d] max-w-md">
              We are here to help. Reach out directly to our support team and we will get back to you promptly.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/contact"
                className="btn-stripe-primary !py-2.5 !px-5 text-xs sm:text-sm"
              >
                <span>Contact Support</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
