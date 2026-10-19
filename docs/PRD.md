# QuickUPI / PayMe — Product Requirements Document (PRD)

**Document Version:** 1.0.0  
**Status:** Approved / In Progress  
**Author:** Product & Architecture Team  
**Last Updated:** October 2026  

---

## 1. Executive Summary & Product Vision

### 1.1 One-Liner Hook
> **"Don't build a payment gateway. Make existing UPI 10x smarter."**

### 1.2 Core Value Proposition
Traditional payment gateways (Razorpay, Cashfree, PayU, Stripe) levy a **2.0% – 3.0% fee (+18% GST)** on every transaction, delay settlements by **T+2 to T+3 business days**, require an **RBI Payment Aggregator (PA/PG) License** (holding customer funds in pooled escrow accounts), and impose stringent KYC and account freeze risks.

**QuickUPI** is a sovereign payment orchestration layer built directly atop NPCI's UPI rails:
* **Zero Transaction Fees (0% Forever):** Direct peer-to-peer (P2P) or merchant (P2M) settlement into the merchant's existing bank account.
* **Instant Settlement (T+0):** Funds never transit through an intermediary escrow account; settlement happens instantaneously bank-to-bank.
* **Zero RBI Escrow Liability:** Because QuickUPI never takes custody of funds, it operates purely as software orchestration, eliminating the ₹15–25 Cr RBI capital adequacy requirement.
* **Smart Dynamic Limits & Reusable QRs:** Eliminates static dumb QR stickers by introducing campaign caps, per-transaction amount locks, seat/slot limits, and automated expiry.
* **Hybrid Verification Mesh:** Solves the traditional unverified UPI screenshot problem through a 3-tier verification architecture (Zero-Infra UTR logging, Automated Android SMS/Notification Observer Node, and Micro-Paise Disambiguation).
* **Universal 2-Line Embed (`quickupi.js`):** A drop-in checkout modal script that works on any website, landing page, or React/Next.js application.

---

## 2. Target Personas & Use Cases

| Persona | Core Pain Point | QuickUPI Solution |
| :--- | :--- | :--- |
| **Freelancers & Consultants** | Losing 2.36% on ₹25,000–₹1,00,000 invoices and waiting 3 days for payouts. | Dynamic invoice QR with fixed amount lock and instant T+0 bank settlement. |
| **Educators, Tutors & Coaches** | "First 30 students at ₹999 early bird discount" — impossible to automate with a static QR sticker. | Reusable QR with **30-Slot Limit**; page auto-locks with *"All slots booked"* upon the 30th payment. |
| **Event Organizers & Meetups** | Managing seat limits and manually tallying WhatsApp payment screenshots. | Fixed-seat limit QR with automated UTR logging or Observer confirmation. |
| **Charities & Crowdfunding** | "Target: ₹1,00,000 for medical relief" — gateways take 2–3% cut and require organizational registrations. | Total Collection Cap of ₹1,00,000 with real-time public progress bar and 0% platform fee. |
| **Indie D2C Creators** | High gateway drop-offs and complex gateway KYC onboarding. | Universal 2-line embed (`quickupi.js`) for digital downloads and merchandise. |

---

## 3. Product Features & Detailed Requirements

### 3.1 Hero Feature: Reusable QR with Automated Limits

Traditional UPI QR codes are static image files that accept any amount from any number of payers indefinitely. QuickUPI introduces dynamic, server-governed sessions:

1. **Total Collection Cap (Aggregate Limit):**
   * *Example:* Collect maximum ₹50,000 for a campaign.
   * *System Behavior:* Every verified payment increments `collected_amount`. Once `collected_amount >= total_cap`, the payment page and QR code instantly transition to `CAP_REACHED` and decline further payment intents.
2. **Per-Payment Lock:**
   * Fixed amount (e.g., exactly ₹1,999) or bounded range (`min_amount`, `max_amount`).
   * When fixed, the UPI URI embeds `&am=1999.00` to prevent the user from altering the amount in their UPI app.
3. **Transaction Slot Limit:**
   * *Example:* Only 25 early-bird registrations.
   * *System Behavior:* Track `used_slots` vs `max_slots`. The moment `used_slots == max_slots`, the link deactivates and displays an *"All slots booked"* banner with an optional waitlist input.
4. **Dynamic Expiry Countdown:**
   * Time-to-Live (TTL) clock (e.g., 15 minutes for flash sale, or specific calendar date-time).
   * Server-authoritative timer prevents expired QR scans from being processed.

### 3.2 Omnichannel Payer Experience

1. **Desktop Users:**
   * High-contrast vector SVG QR code (crisp at any DPI).
   * Brand avatar/logo centered within QR code.
   * Live countdown timer displaying remaining session time.
   * Visual progress bar showing remaining slots (e.g., *"Only 4 slots left!"*).
   * Step-by-step guidance on how to scan and find the 12-digit UPI Reference Number / UTR.
2. **Mobile Users:**
   * Responsive bottom drawer modal.
   * 1-Tap UPI Deep-Link Intent buttons:
     * **Google Pay** (`gpay://upi/pay?...` or `upi://pay?...`)
     * **PhonePe** (`phonepe://pay?...`)
     * **Paytm** (`paytmmp://pay?...`)
     * **CRED** (`cred://...`)
     * **Default UPI Intent** (`upi://pay?pa={vpa}&pn={name}&am={amount}&cu=INR&tr={ref}`)
   * Seamless transition back to verification modal upon app switch.
3. **Branded Vanity Handles:**
   * Personalized merchant payment page: `quickupi.in/pay/:username` (e.g., `quickupi.in/pay/arslan`).
   * Campaign-specific payment page: `quickupi.in/r/:requestId` or `quickupi.in/pay/:username/:campaignSlug`.

### 3.3 The Hybrid Verification Mesh

To solve the "Bank Webhook Problem" without an RBI gateway license, QuickUPI implements a 3-tier verification mesh:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Hybrid Verification Mesh                        │
├────────────────────┬─────────────────────────────┬─────────────────────┤
│ Mode A: Zero-Infra │ Mode B: Automated Observer  │ Mode C: Micro-Paise │
│ 12-Digit UTR Log   │ Android SMS/Push Node       │ Dynamic Variation   │
├────────────────────┼─────────────────────────────┼─────────────────────┤
│ • Zero setup       │ • Companion Android APK     │ • Sub-rupee offset  │
│ • Payer submits UTR│ • Parses bank SMS in real-  │   (₹2000.12, .27)   │
│ • Merchant 1-tap   │   time (HDFC, ICICI, SBI)   │ • Auto-matches      │
│   reconciliation   │ • HMAC-SHA256 push webhook  │   concurrent buyers │
│ • 100% Free Tier   │ • Instant Auto-Confirmation │ • Zero queue waiting│
└────────────────────┴─────────────────────────────┴─────────────────────┘
```

#### Mode A: Zero-Infra UTR Logging (Default / Free)
* Customer completes payment in their UPI app and receives a 12-digit UTR (e.g., `429182736451`).
* Customer enters the UTR in the QuickUPI interface.
* System validates UTR format (12 numeric digits, Luhn/pattern sanity check, duplicate prevention across database).
* Merchant receives real-time desktop/mobile notification with 1-tap `[Approve]` or `[Dispute]`.

#### Mode B: Automated Observer Node (Pro / Automated)
* Merchant installs a lightweight, open-source Android APK on their business phone containing the receiving SIM card.
* The APK uses Android's `NotificationListenerService` and `SMS_RECEIVED` broadcast receiver to intercept credit alerts from Indian banks (SBI, HDFC, ICICI, Axis, Kotak, Paytm Payments Bank, PNB).
* The alert text is parsed via deterministic regular expressions to extract `amount`, `utr`, and `timestamp`.
* The APK signs the extracted payload using an HMAC-SHA256 secret key and POSTs to `/api/v1/observer/push`.
* The server validates the signature, finds the pending transaction, verifies amount equality, marks the transaction as `VERIFIED`, decrements the campaign limit slot, and fires client-side SSE/Websocket updates.

#### Mode C: Dynamic Micro-Paise Disambiguation
* Designed for concurrent high-volume checkouts where multiple users pay the exact same base price (e.g., ₹500) simultaneously.
* The system leases a unique micro-paise offset for 5 minutes (e.g., Payer 1 pays ₹500.12, Payer 2 pays ₹500.27).
* When a bank credit of ₹500.27 arrives via SMS/Observer, the system unambiguously attributes it to Payer 2 without requiring manual UTR entry.

### 3.4 Universal Embed SDK (`quickupi.js`)

Merchants can embed QuickUPI checkout on any external web page with two lines of HTML:

```html
<script src="https://quickupi.in/quickupi.js" data-merchant-key="Q_PUB_LIVE_98234"></script>
<button data-quickupi-pay 
        data-amount="2499" 
        data-campaign="cohort-batch-5" 
        data-name="Fullstack Masterclass">
  Register Now (0% Fee UPI)
</button>
```

* **Zero external dependencies:** Pure vanilla JavaScript (< 5 KB gzipped).
* **Cross-Origin Safe:** Communicates via postMessage / sandboxed iframe modal.
* **JavaScript Callback API:**
  ```javascript
  QuickUPI.open({
    key: 'Q_PUB_LIVE_98234',
    amount: 2499,
    campaignId: 'cmp_123',
    onSuccess: function(response) {
      console.log('Payment Verified:', response.utr, response.transactionId);
    },
    onDismiss: function() {
      console.log('Checkout closed by user');
    }
  });
  ```

### 3.5 Merchant Command Center (Dashboard)

1. **Live Analytics & KPI Overview:**
   * Total Volume Collected (Today, Week, All Time).
   * Active Campaigns vs Exhausted/Expired Campaigns.
   * Average Verification Latency (Mode A vs Mode B).
2. **Campaign / Limit QR Builder:**
   * Step-by-step modal: Set Name, VPA, Fixed vs Open Amount, Total Collection Cap, Slot Limit, Expiry Timer.
   * Instant SVG QR Preview and one-click copy of Payment Link.
3. **Real-Time Transaction Ledger:**
   * Paginated & searchable table showing Timestamp, Payer Name, Amount (INR), Mode (`MODE_A`, `MODE_B`, `MODE_C`), UTR Number, and Status Badge (`PENDING`, `VERIFIED`, `REJECTED`, `EXPIRED`).
   * 1-Tap Manual Approval button for Mode A pending entries.
4. **Observer Device Manager:**
   * Pairing QR code to bind Android Observer APK with merchant account.
   * Live heartbeat monitor (Online / Offline indicator, battery level, last alert received).
5. **Developer & Integration Settings:**
   * Publishable API Key (`pk_live_...`) and Secret API Key (`sk_live_...`).
   * Outbound Webhook URL config with HMAC signature verification test runner.

---

## 4. Monetization & Business Model

Because QuickUPI does not touch money flow or charge a 2% cut, monetization relies on software subscriptions and value-added capabilities:

| Plan | Price | Target Audience | Features Included |
| :--- | :--- | :--- | :--- |
| **Free Tier** | ₹0 / mo | Beginners & Freelancers | Unlimited basic static QRs, Mode A UTR logging, up to 2 active Limit QRs, standard analytics. |
| **Pro Tier** | ₹499 / mo | Coaches, Creators & Meetups | Unlimited Limit QRs, Android Observer Mode B auto-sync, custom logo on QR code, automated WhatsApp payment receipts, CSV/Excel ledger exports. |
| **Business / Self-Hosted** | ₹1,499 / mo | D2C Brands & Retailers | Custom domain (`pay.mybrand.com`), Universal `quickupi.js` checkout embed, Multi-staff cashier till mode, priority webhook delivery, SLA uptime guarantee. |

---

## 5. Non-Functional Requirements (NFRs)

1. **Security & Financial Integrity:**
   * Strict minor-unit arithmetic (all amounts stored in Paise as 64-bit integers; no floating point).
   * Idempotent UTR uniqueness constraints (preventing replay attacks or duplicate submissions).
   * HMAC-SHA256 signature verification for all Observer Node payloads and outbound merchant webhooks.
   * Rate limiting on UTR submission endpoints (max 5 attempts per session to mitigate brute-forcing).
2. **Performance & Concurrency:**
   * Atomic database updates for slot reservation to prevent race conditions during high-concurrency ticket drops.
   * Vector SVG QR generation in under 20ms using server-side / lightweight client-side generators.
   * Real-time payment status polling / Server-Sent Events (SSE) with sub-second status reflection.
3. **Compliance & Legal Standing:**
   * Strictly non-custodial: funds flow directly from customer's bank account to merchant's bank account.
   * No escrow accounts, no nodal accounts, no wallet balances maintained.
   * Fully compliant with NPCI UPI procedural guidelines and RBI Payment Aggregator definitions (Master Direction – DPSS.CO.PD.No.1810/02.14.008/2019-20).

---

## 6. Success Metrics & KPIs

* **Zero-Fee Savings Realized:** Total INR saved by merchants vs a 2% + 18% GST traditional gateway fee.
* **Verification Rate:** > 98% successful verification on active campaigns.
* **Observer Latency:** Sub-3-second auto-confirmation from bank SMS arrival to client screen confirmation.
* **Drop-Off Rate:** < 10% abandonment rate on mobile 1-tap drawer intent flows.
