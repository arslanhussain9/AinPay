# Architecture Decision Records (ADR) — PayMe

**Product:** PayMe — 0% Fee Razorpay.me for Indian Freelancers  
**Status:** Active  
**Stack:** Next.js 14 App Router, TypeScript, Prisma, SQLite/PostgreSQL, Tailwind CSS

---

## ADR-001: Sovereign Direct-to-Bank Settlement (0% Fees)
- **Context:** Aggregators (Razorpay, Cashfree) deduct 2% + 18% GST and hold payouts for T+2 days, requiring an RBI Payment Aggregator (PA) license.
- **Decision:** PayMe never touches client funds. Payments generate NPCI standard UPI URIs directly to the freelancer's Virtual Payment Address (VPA / UPI ID).
- **Consequence:** 0% platform commissions, zero PA licensing constraints, and instant real-time T+0 bank settlement.

## ADR-002: Integer Minor Units (Paise)
- **Context:** Floating point arithmetic in JavaScript introduces precision drift.
- **Decision:** All currency amounts are stored and calculated as 64-bit integers in paise (e.g. ₹1,500.00 = `150000`).
- **Consequence:** Eliminates rounding bugs; conversions happen only at UI display time via `formatINR()`.

## ADR-003: Human-in-the-Loop 1-Tap Verification
- **Context:** Automated SMS scraping on Android requires background daemon APKs that are fragile and battery-drained.
- **Decision:** 
  1. Client sends UPI payment and submits the 12-digit UTR receipt number.
  2. Freelancer receives normal bank SMS on their phone and clicks `[Approve]` in their PayMe dashboard.
  3. Status updates atomically.
- **Consequence:** Zero background APKs or mobile permissions needed. Clean, reliable, and privacy-first.

## ADR-004: Atomic Milestone Slot Enforcement
- **Context:** Service milestone links with limited availability (e.g. "Only 5 slots") risk overbooking during simultaneous checkouts.
- **Decision:** Slot increments are handled via Prisma transactions. When `usedSlots >= maxSlots`, the link is automatically marked `CLOSED`.
- **Consequence:** Zero race conditions or oversubscription.
