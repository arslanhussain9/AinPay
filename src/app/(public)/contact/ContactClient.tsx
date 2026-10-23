"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!name.trim()) {
      setStatus({ type: "error", text: "Please enter your name." });
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setStatus({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    if (!subject.trim()) {
      setStatus({ type: "error", text: "Please enter a subject." });
      return;
    }
    if (message.trim().length < 10) {
      setStatus({ type: "error", text: "Message must be at least 10 characters." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit message. Please try again.");
      }

      setStatus({
        type: "success",
        text: "Thank you for reaching out! We have received your message and will respond via email.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setStatus({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e3e8ee] stripe-shadow-md">
      <h2 className="text-xl font-semibold text-[#0d253d] mb-1">
        Send Us a Message
      </h2>
      <p className="text-xs text-[#64748d] mb-6">
        Have questions about payment links, setting up your merchant account, or platform security? We are here to assist.
      </p>

      {status && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs font-medium flex items-start gap-3 ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span>{status.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Your Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahul@example.com"
              className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
            Subject *
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Question about UPI single-use links or account setup"
            className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
            Message *
          </label>
          <textarea
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe what you need help with in detail..."
            className="w-full p-3.5 rounded-xl border border-[#cbd5e1] text-xs text-[#0d253d] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 transition-all leading-relaxed font-medium"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-stripe-primary w-full sm:w-auto !py-2.5 !px-6 text-xs font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
