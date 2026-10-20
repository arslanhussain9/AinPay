# PayMe

<div align="center">

```
██████╗  █████╗ ██╗   ██╗███╗   ███╗███████╗
██╔══██╗██╔══██╗╚██╗ ██╔╝████╗ ████║██╔════╝
██████╔╝███████║ ╚████╔╝ ██╔████╔██║█████╗  
██╔═══╝ ██╔══██║  ╚██╔╝  ██║╚██╔╝██║██╔══╝  
██║     ██║  ██║   ██║   ██║ ╚═╝ ██║███████╗
╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝╚══════╝
```

### **The 0% Fee Razorpay.me for Indian Freelancers & Creators**

**0% Gateway Fees • Direct-to-Bank T+0 Instant Settlement • Branded Mini-Websites**

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.21-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Zero Aggregator Fees](https://img.shields.io/badge/Fees-0%25%20Forever-10b981?style=for-the-badge&logo=cashapp&logoColor=white)](#)
[![Direct Settlement](https://img.shields.io/badge/Settlement-Instant%20T%2B0-3b82f6?style=for-the-badge&logo=buffer&logoColor=white)](#)

</div>

---

## ⚡ The Problem vs PayMe

Freelancers in India (designers, developers, consultants, writers) face two bad choices when collecting payments:

1. **Traditional Payment Gateways (Razorpay, Cashfree):**
   * Cut **2.0% – 3.0% + 18% GST** from your hard-earned project invoices (losing ₹1,200 on a ₹50,000 milestone!).
   * Hold your money for T+2 to T+3 business days.
   * Require tedious business KYC.
2. **Sending a Raw Phone Number on WhatsApp:**
   * Looks amateurish and untrustworthy.
   * Client has to manually type amounts and send screenshots.
   * No project milestone records.

### The PayMe Solution:
Every freelancer gets their own professional **`payme.in/username`** link with a Stripe-level aesthetic:
* **Custom Amount Quick Pay:** Client can type any amount or pick presets (₹500, ₹1,500, ₹5,000, ₹10,000).
* **Project Milestone Invoices:** Send locked amount links (e.g. ₹25,000 for SaaS Advance).
* **1-Tap Mobile Drawer:** Opens Google Pay, PhonePe, Paytm, or CRED pre-filled with the exact amount.
* **1-Tap Portal Approval:** Client logs their 12-digit UTR. When your bank sends you the SMS, tap **[Approve ✅]** on your dashboard.
* **100% Direct-to-Bank:** Money lands straight in your bank account over NPCI UPI rails at 0% fees.

---

## 🎨 Stripe Design Aesthetic

Built strictly following modern financial infrastructure design principles:
* **Atmospheric Gradient Mesh:** Pastel cream, lavender, electric indigo (`#533afd`), and ruby accents.
* **Editorial Typography:** Inter / Sohne weight 300 display headlines with negative letter-spacing (`-1.4px`).
* **Tabular Numeric Figures (`tnum`):** All currency amounts rendered with monospace tabular figures for financial accuracy.
* **Single-Indigo CTA Hierarchy:** Pill-shaped buttons (`btn-stripe-primary`) with hairline borders and subtle elevation shadows.

---

## 🚀 Live Demo Routes (`http://localhost:3000`)

| Page | URL | Description |
| :--- | :--- | :--- |
| **🏠 Homepage** | [`/`](http://localhost:3000) | Marketing landing page explaining the 0% fee freelancer model. |
| **👤 Freelancer Profile** | [`/pay/arslan`](http://localhost:3000/pay/arslan) | Arslan's personal page with bio, Quick Pay box, and listed project links. |
| **📄 Project Invoice** | [`/p/website-advance`](http://localhost:3000/p/website-advance) | Dedicated ₹25,000 milestone invoice checkout with Vector QR and UTR input. |
| **📊 Freelancer Dashboard** | [`/dashboard`](http://localhost:3000/dashboard) | Live earnings tally, fees saved counter, 1-tap payment approvals, and link creator. |

---

## 🛠️ Tech Stack & Setup

* **Framework:** Next.js 14 (App Router, Server Actions, API routes)
* **Styling:** Tailwind CSS + Stripe design tokens
* **Database:** Prisma ORM with SQLite (`dev.db`)
* **QR Engine:** ISO/IEC 18004 Scalable Vector SVG
* **Currency Math:** Strict 64-bit integer paise (no floating-point rounding bugs)

### Quickstart:
```bash
# 1. Install dependencies
npm.cmd install

# 2. Push schema to database
npm.cmd run prisma:push

# 3. Seed demo data
npx.cmd ts-node prisma/seed.ts

# 4. Start dev server
npm.cmd run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
