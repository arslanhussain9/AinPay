# QuickUPI (PayMe)

<div align="center">

```
██████╗ ██╗   ██╗██╗ ██████╗██╗  ██╗██╗   ██╗██████╗ ██╗
██╔═══██╗██║   ██║██║██╔════╝██║ ██╔╝██║   ██║██╔══██╗██║
██║   ██║██║   ██║██║██║     █████╔╝ ██║   ██║██████╔╝██║
██║▄▄ ██║██║   ██║██║██║     ██╔═██╗ ██║   ██║██╔═══╝ ██║
╚██████╔╝╚██████╔╝██║╚██████╗██║  ██╗╚██████╔╝██║     ██║
 ╚══▀▀═╝  ╚═════╝ ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝
```

### **"Don't build a payment gateway. Make existing UPI 10x smarter."**

**0% Gateway Fees • Direct-to-Bank T+0 Instant Settlement • Zero RBI Escrow Liability**

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.21-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Zero Aggregator Fees](https://img.shields.io/badge/Fees-0%25%20Forever-10b981?style=for-the-badge&logo=cashapp&logoColor=white)](#)
[![Direct Settlement](https://img.shields.io/badge/Settlement-Instant%20T%2B0-3b82f6?style=for-the-badge&logo=buffer&logoColor=white)](#)

</div>

---

## ⚡ The QuickUPI Revolution

Traditional Payment Gateways (Razorpay, Cashfree, Stripe) lock your revenue into **2% to 3% transaction fees (+18% GST)**, hold funds for **T+2 to T+3 business days**, and require complex **RBI Payment Aggregator (PA/PG) licenses** with ₹15–25 Cr capital requirements.

**QuickUPI** is a sovereign payment orchestration layer built directly atop India's UPI rails:

| Feature | Traditional Gateways | Static UPI Stickers | QuickUPI |
| :--- | :---: | :---: | :---: |
| **Transaction Fees** | 2.0% – 3.0% + GST | 0% | **0.0% (Zero Fees Forever)** |
| **Settlement Time** | T+2 to T+3 Days | Instant | **Instant T+0 Direct-to-Bank** |
| **RBI Escrow Liability** | Mandatory (₹15–25 Cr) | None | **Zero (Funds Never Touched)** |
| **Automated Limits (Cap/Slots)** | Paid SaaS Add-on | ❌ None | **Built-in Atomic Limits** |
| **Verification Mesh** | Proprietary Webhooks | ❌ WhatsApp Screenshot | **3-Tier Mesh (UTR, Observer, Paise)** |
| **Universal Embed** | JS SDK | ❌ None | **2-Line Drop-in (`quickupi.js`)** |

---

## 📚 Complete Documentation Hub

Detailed architectural blueprints, design rationale, and specifications are maintained in the [`docs/`](file:///d:/PayMe/docs/) directory:

| Document | Description |
| :--- | :--- |
| **[`PRD.md`](file:///d:/PayMe/docs/PRD.md)** | **Product Requirements Document:** Executive vision, user personas, core features, acceptance criteria, and monetization model. |
| **[`DECISIONS.md`](file:///d:/PayMe/docs/DECISIONS.md)** | **Architecture Decision Records (ADRs):** Comprehensive decision logs (Sovereign settlement, minor units in paise, hybrid mesh, atomic limits, etc.). |
| **[`ARCHITECTURE.md`](file:///d:/PayMe/docs/ARCHITECTURE.md)** | **System Architecture & Technical Specs:** High-level flow, atomic limits arbiter, vector QR engine, mobile intent architecture, and threat model. |
| **[`VERIFICATION_MESH.md`](file:///d:/PayMe/docs/VERIFICATION_MESH.md)** | **Hybrid Verification Mesh:** Mode A (Zero-Infra UTR), Mode B (Android Observer Node & HMAC), Mode C (Micro-Paise Disambiguation), and Multi-Bank Regex. |
| **[`API_SPEC.md`](file:///d:/PayMe/docs/API_SPEC.md)** | **REST API & Universal Embed SDK (`quickupi.js`):** Public checkout APIs, observer endpoints, merchant API, and iframe postMessage spec. |
| **[`DATABASE_SCHEMA.md`](file:///d:/PayMe/docs/DATABASE_SCHEMA.md)** | **Database Models & Concurrency:** ER diagram, complete Prisma schema, field constraints, indexes, and atomic state transition queries. |
| **[`ROADMAP.md`](file:///d:/PayMe/docs/ROADMAP.md)** | **Milestones & Execution Checklist:** Phased development plan from database setup to the universal SDK embed. |

---

## 🌟 Hero Features

### 1. Reusable QR with Automated Limits
- **Total Collection Cap:** e.g., collect maximum ₹50,000 for a campaign. Once reached, page deactivates automatically.
- **Per-Payment Lock:** Fixed amount (e.g. ₹2,000) locked in the UPI intent.
- **Slot Limits:** e.g., only 25 seats. Automatically locks with *"All slots booked"* upon the 25th payment.
- **Dynamic Expiry:** Server-authoritative countdown timer.

### 2. Tri-Channel Verification Mesh
- **Mode A (Zero-Infra):** Customer pays ➔ Enters 12-digit UTR ➔ Merchant 1-tap approves on dashboard. (100% Free).
- **Mode B (Automated Observer Node):** Lightweight Android companion APK reads bank SMS / push notifications and posts an HMAC-SHA256 signed webhook for instant auto-confirmation.
- **Mode C (Dynamic Micro-Paise):** Assigns unique temporary sub-rupee variations (e.g., ₹2000.12, ₹2000.27) to disambiguate concurrent payers without a single-slot line.

### 3. Omnichannel Payer Experience
- **Desktop:** Crisp vector SVG QR code with live countdown timer and slot progress bar.
- **Mobile:** 1-Tap bottom drawer with direct deep-links for **Google Pay**, **PhonePe**, **Paytm**, **CRED**, and **BHIM**.
- **Branded Vanity Handles:** `quickupi.in/pay/arslan`.

### 4. Universal Embed (`quickupi.js`)
2-line drop-in script for any external website:
```html
<script src="https://quickupi.in/quickupi.js" data-merchant-key="pk_live_..."></script>
<button data-quickupi-pay data-campaign="cohort-5" data-amount="2499">
  Enroll Now (0% Fee UPI)
</button>
```

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org) (App Router, Server Actions, API routes)
* **Language:** TypeScript 5.6
* **Database & ORM:** [Prisma](https://prisma.io) with SQLite (Local) / PostgreSQL (Cloud)
* **Styling:** [Tailwind CSS](https://tailwindcss.com) + Lucide Icons (Dark slate fintech aesthetic)
* **QR Engine:** ISO/IEC 18004 Scalable Vector SVG
* **Security:** Strict 64-bit integer paise arithmetic, HMAC-SHA256 Observer authentication

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm.cmd install
```

### 2. Setup Database & Prisma
```bash
npm.cmd run prisma:generate
npm.cmd run prisma:push
```

### 3. Start Development Server
```bash
npm.cmd run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
