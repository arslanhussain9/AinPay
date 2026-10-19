# Architecture Decision Records (ADR) & Design Rationale

**Project:** QuickUPI / PayMe  
**Status:** Living Document  
**Date:** October 2026  

This document logs all critical architectural decisions, evaluated alternatives, context, trade-offs, and final decisions guiding the implementation of QuickUPI.

---

## Index of Decisions

- [ADR-001: Sovereign Direct-to-Bank Settlement vs Escrow Intermediary](#adr-001-sovereign-direct-to-bank-settlement-vs-escrow-intermediary)
- [ADR-002: Integer Minor Units (Paise) for Financial Arithmetic](#adr-002-integer-minor-units-paise-for-financial-arithmetic)
- [ADR-003: Tri-Channel Hybrid Verification Mesh (Modes A, B, C)](#adr-003-tri-channel-hybrid-verification-mesh-modes-a-b-c)
- [ADR-004: Atomic Concurrency Control for Slot & Cap Limits](#adr-004-atomic-concurrency-control-for-slot--cap-limits)
- [ADR-005: Next.js App Router & Server Actions Architecture](#adr-005-nextjs-app-router--server-actions-architecture)
- [ADR-006: Database Layer via Prisma (SQLite Local, PostgreSQL Cloud)](#adr-006-database-layer-via-prisma-sqlite-local-postgresql-cloud)
- [ADR-007: Zero-Dependency Vanilla SDK (`quickupi.js`)](#adr-007-zero-dependency-vanilla-sdk-quickupijs)
- [ADR-008: HMAC-SHA256 Signature Auth for Observer Android Nodes](#adr-008-hmac-sha256-signature-auth-for-observer-android-nodes)

---

## ADR-001: Sovereign Direct-to-Bank Settlement vs Escrow Intermediary

### Context
Traditional payment gateways (Razorpay, Cashfree, Stripe) require customers to pay into a nodal/escrow account managed by the gateway. The gateway settles funds to the merchant on a T+2 or T+3 schedule while extracting a 2.0%–3.0% commission + 18% GST. Under RBI guidelines (Master Direction – Guidelines on Regulation of Payment Aggregators and Payment Gateways), operating such an escrow requires an RBI Payment Aggregator (PA) license with a net worth requirement of ₹15–25 Crore and heavy compliance overhead.

### Decision
QuickUPI will **never take custody of funds**.
All payment requests generate UPI URIs pointing directly to the merchant's own Virtual Payment Address (VPA / UPI ID) (e.g. `merchant@okhdfcbank` or `business@icici`). The settlement is purely bank-to-bank (P2P / P2M) in real-time (T+0).

### Consequences
* **Positive:**
  * 0% Transaction fees forever (neither QuickUPI nor the merchant pays an aggregator cut).
  * Instant T+0 liquidity for the merchant (funds arrive in seconds, not days).
  * Complete exemption from RBI PA/PG escrow and capital licensing mandates.
  * Zero liability for merchant balance lockups or account freezes by intermediary aggregators.
* **Negative:**
  * QuickUPI cannot natively issue automated bank-reversal refunds via an API; refund workflows must be handled directly by the merchant via their banking app or standard UPI rails.
  * Requires an alternative mechanism to confirm payments since the bank does not send direct server webhooks to QuickUPI (addressed in ADR-003).

---

## ADR-002: Integer Minor Units (Paise) for Financial Arithmetic

### Context
Using IEEE 754 floating-point numbers (`float` or `double` in JavaScript/TypeScript) introduces precision bugs (e.g., `0.1 + 0.2 = 0.30000000000000004`). In financial systems, minor rounding errors compound over high transaction volumes and create reconciliation mismatches.

### Decision
All monetary values in the database, API payloads, and internal business logic must strictly be represented as **64-bit integers in minor currency units (Paise)**:
* ₹1.00 = `100` paise
* ₹2,000.00 = `200000` paise
* ₹499.50 = `49950` paise

Conversion to major units (Rupees) is performed exclusively at the final presentation/display layer in UI components using a deterministic formatting helper:
```typescript
export function formatINR(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(paise / 100);
}
```

### Consequences
* **Positive:** Eliminates floating-point inaccuracies, guarantees deterministic math, and matches banking core specifications.
* **Negative:** Requires disciplined conversion when ingesting external inputs (e.g. converting user input ₹2000 to `200000` paise).

---

## ADR-003: Tri-Channel Hybrid Verification Mesh (Modes A, B, C)

### Context
Because QuickUPI does not operate a licensed aggregator escrow, banks do not send B2B merchant webhooks directly to our cloud servers. Traditional UPI QR stickers solve this by forcing customers to send payment screenshots via WhatsApp, which is manual, friction-heavy, and unscalable.

### Decision
Implement a 3-tier hybrid verification mesh:
1. **Mode A (Zero-Infra UTR Log - Default / Free):** Payer inputs their 12-digit UPI Reference Number / UTR on the screen. The merchant verifies with 1-tap in their dashboard. Zero hardware or mobile app setup required.
2. **Mode B (Automated Observer Node - Pro / Automated):** The merchant pairs their Android phone running an open-source APK listener. When bank credit SMS or notification arrives, the APK extracts amount and UTR, signs the payload with HMAC-SHA256, and posts it to QuickUPI's webhook endpoint for instantaneous sub-second confirmation.
3. **Mode C (Dynamic Micro-Paise Variation):** For high-concurrency campaigns where multiple payers checkout simultaneously, the system assigns temporary sub-rupee variations (e.g. ₹2000.12, ₹2000.27) with a 5-minute lease. When the bank SMS confirms credit of ₹2000.27, the payment is automatically attributed to the specific customer without waiting for UTR entry.

### Consequences
* **Positive:** Complete flexibility. Zero setup barrier for newcomers (Mode A), hands-free automated verification for power users (Mode B), and conflict-free concurrent checkouts (Mode C).
* **Negative:** Mode B requires an Android phone with the receiving SIM card to be active and connected to the internet.

---

## ADR-004: Atomic Concurrency Control for Slot & Cap Limits

### Context
In campaigns with hard limits (e.g., "Only 25 early bird passes at ₹1,999" or "Campaign Cap: ₹50,000"), multiple payers can initiate checkout simultaneously. If limit checks are performed purely in application memory without transactional locks, a burst of 10 concurrent payers could result in 35 payments being accepted for a 25-slot campaign (oversubscription race condition).

### Decision
Use database-level **atomic compare-and-swap / conditional updates**:
1. When a payment attempt is verified:
   ```sql
   UPDATE "PaymentCampaign"
   SET "usedSlots" = "usedSlots" + 1,
       "collectedPaise" = "collectedPaise" + $amountPaise,
       "status" = CASE 
                    WHEN "usedSlots" + 1 >= "maxSlots" THEN 'SLOTS_EXHAUSTED'
                    WHEN "collectedPaise" + $amountPaise >= "totalCapPaise" THEN 'CAP_REACHED'
                    ELSE "status"
                  END
   WHERE "id" = $campaignId
     AND ("maxSlots" IS NULL OR "usedSlots" < "maxSlots")
     AND ("totalCapPaise" IS NULL OR "collectedPaise" + $amountPaise <= "totalCapPaise");
   ```
2. If the row count affected is 0, the transaction is rejected as `LIMIT_EXCEEDED`, and the payer is notified immediately.

### Consequences
* **Positive:** Absolute mathematical guarantee against overselling slots or exceeding financial collection caps.
* **Negative:** Requires careful handling of rejected concurrent payments with clear UI feedback (e.g., auto-prompting for refund / merchant contact).

---

## ADR-005: Next.js App Router & Server Actions Architecture

### Context
The application requires:
* High-performance SSR for public branded payment handles (`/pay/:username`) with instant TTFB and SEO metadata.
* Secure server-authoritative API routes for payment intents, UTR verification, and observer webhooks.
* Real-time reactive merchant dashboard with dynamic limit progress meters.

### Decision
Adopt **Next.js 14+ with App Router**:
* `app/(public)/pay/[handle]/page.tsx` for fast public checkout.
* `app/(dashboard)/...` for merchant command center.
* `app/api/v1/...` for external APIs, Observer webhooks, and `quickupi.js` communication.
* Tailwind CSS for modern, high-contrast, responsive UI.

### Consequences
* **Positive:** Unified codebase for frontend, API, and server-side business logic; fast server rendering; zero runtime microservice overhead.
* **Negative:** Must maintain clean separation between client components (`'use client'`) and server routines to protect secrets.

---

## ADR-006: Database Layer via Prisma (SQLite Local, PostgreSQL Cloud)

### Context
Development needs to be rapid and zero-friction locally, while production requires robust relational consistency, foreign key cascades, and high throughput.

### Decision
Use **Prisma ORM**:
* Local development defaults to SQLite (`file:./dev.db`) for immediate out-of-the-box operation with zero external database dependencies.
* Production configuration seamlessly switches to PostgreSQL (Neon / Supabase / AWS RDS) by changing the provider URL in `schema.prisma`.

### Consequences
* **Positive:** Type-safe database queries, automated schema migrations, zero setup friction for new developers.
* **Negative:** SQLite does not support certain advanced enum types natively, which Prisma abstracts gracefully into strings with check constraints.

---

## ADR-007: Zero-Dependency Vanilla SDK (`quickupi.js`)

### Context
Merchants want to embed QuickUPI checkout buttons on their landing pages, Shopify stores, WordPress sites, and custom React applications. Heavy SDK bundles (> 50KB) degrade page load speeds and SEO scores.

### Decision
Build `quickupi.js` as a **pure vanilla JavaScript bundle (< 5 KB gzipped)** with zero external dependencies:
* Injected via a standard `<script>` tag.
* Dynamically creates a responsive, high-z-index iframe overlay pointing to the secure QuickUPI checkout session.
* Communicates bidirectionally via `window.postMessage` with origin validation.
* Exposes both declarative data attributes (`data-quickupi-pay`) and programmatic API (`QuickUPI.open({...})`).

### Consequences
* **Positive:** Sub-millisecond load time, framework-agnostic, zero styling conflicts with merchant's website CSS.
* **Negative:** Requires cross-frame postMessage message protocol for passing payment events (`PAYMENT_SUCCESS`, `DISMISSED`).

---

## ADR-008: HMAC-SHA256 Signature Auth for Observer Android Nodes

### Context
Mode B receives bank SMS notifications pushed over the internet from the merchant's Android phone. If this endpoint were unprotected or authenticated only by a static bearer token, malicious actors could forge fake payment credits and fraudulently confirm orders.

### Decision
All payloads sent by the Observer APK must include:
* `X-Observer-Device-Id`: Unique device UUID registered in merchant dashboard.
* `X-Observer-Timestamp`: Unix epoch milliseconds (rejected if drift > 60 seconds to prevent replay attacks).
* `X-Observer-Signature`: `HEX(HMAC_SHA256(secretKey, rawBody + timestamp))`

The server verifies the signature before parsing the SMS content.

### Consequences
* **Positive:** Cryptographically secure; immune to tampering and replay attacks.
* **Negative:** Device pairing requires securely provisioning a shared secret during setup (via QR code scan).
