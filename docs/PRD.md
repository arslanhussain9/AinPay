# PayMe — Product Requirements Document (PRD)

**Product Vision:** The 0% Fee Razorpay.me for Indian Freelancers & Independent Creators  
**Status:** Active MVP  
**Last Updated:** October 2026  

---

## 1. Executive Summary & Core Hook

> **"Get paid directly to your bank account. Zero gateway fees. Your own personal brand."**

**PayMe** is a sovereign UPI payment orchestration platform built specifically for Indian freelancers (designers, developers, writers, editors, consultants, coaches).

Instead of forcing freelancers to:
1. Pay **2% to 3% + 18% GST** on project invoices to traditional payment gateways (Razorpay, Cashfree) and wait T+2/T+3 days for payouts.
2. Send an unprofessional raw phone number on WhatsApp with no amount lock and manual screenshot verification.

PayMe provides every freelancer with their own **branded mini-website (`payme.in/username`)**:
* Direct quick payments (custom amounts + presets: ₹500, ₹1,500, ₹5,000, ₹10,000).
* Fixed project invoice links (e.g. ₹25,000 milestone advance with amount locked in UPI URI).
* Client submits 12-digit UTR upon paying via GPay, PhonePe, Paytm, or CRED.
* Freelancer gets bank SMS on their phone, checks portal, and taps **[Approve ✅]**.
* 100% direct-to-bank T+0 settlement with 0% gateway cuts.

---

## 2. Target Personas

| Freelancer Role | Common Pain Point | How PayMe Solves It |
| :--- | :--- | :--- |
| **Fullstack & UI Developers** | Losing ₹1,200–₹2,500 in gateway fees on milestone invoices of ₹50k–₹1L. | Sends locked milestone link (`payme.in/p/web-advance`). Client pays full amount with 0% gateway deductions. |
| **Independent Designers** | Sending a raw phone number on WhatsApp feels amateurish and untrustworthy. | Shares custom branded URL `payme.in/pay/arslan` featuring portfolio bio, social handles, and verified UPI badge. |
| **Consultants & Coaches** | Overbooking 1:1 strategy calls beyond calendar capacity. | Creates a 5-slot consultation link; link auto-closes the moment 5 payments are approved. |

---

## 3. Core Feature Specifications

### 3.1 The Freelancer Mini-Website (`payme.in/pay/[username]`)
* **Header Profile:**
  * Avatar badge with initials / photo.
  * Full Name + Verified UPI badge.
  * Title/Role (e.g., *"Product Designer & Fullstack Engineer"*).
  * Bio & Social Links (Twitter, GitHub, LinkedIn).
* **Quick Custom Payment Tab:**
  * Amount presets: ₹500, ₹1,500, ₹5,000, ₹10,000, or custom amount input.
  * Client enters note / project name.
  * Generates Vector SVG QR code (desktop) and 1-tap mobile bottom sheet (mobile).
* **Listed Project Invoices & Services:**
  * Cards showing fixed milestones (e.g. "Website Redesign 50% Advance — ₹25,000").
  * Real-time slot availability for limited offerings (e.g. "Only 2 of 5 slots remaining").

### 3.2 Client Payment Experience (`/p/[slug]`)
* **Desktop:** Clean white canvas card with ISO/IEC 18004 Vector SVG QR code, electric indigo center badge, and copy intent button.
* **Mobile:** 1-Tap bottom drawer triggering direct deep-link intents:
  * Google Pay (`gpay://upi/pay?...`)
  * PhonePe (`phonepe://pay?...`)
  * Paytm (`paytmmp://pay?...`)
  * CRED (`cred://upi/pay?...`)
  * Any UPI App (`upi://pay?...`)
* **Mode A 12-Digit UTR Submission:**
  * Client enters their name and the 12-digit transaction reference number from their banking app.
  * System validates 12 digits (`/^\d{12}$/`) and checks for duplicate submission.

### 3.3 Freelancer Command Center (`/dashboard`)
* **Live KPI Counters:**
  * Total Volume Earned (e.g. `₹26,999.00`).
  * **PG Fees Saved** (Calculated as 2.36% of total earnings avoided!).
  * Active payment links count.
  * Pending verifications count.
* **Pending Payments Table (1-Tap Approve):**
  * Displays Client Name, Project/Note, Amount, and 12-digit UTR.
  * Actions: **[Approve ✅]** and **[Decline ❌]**.
  * Approving immediately increments earnings and decrements slots if the link has a limit.
* **Payment Link Generator Modal:**
  * Create a new project payment link in 30 seconds (Title, Slug, Amount in INR, Description, Max slots).
* **Approved Payment Ledger:**
  * Historical log of all received client payments with dates and UTRs.
