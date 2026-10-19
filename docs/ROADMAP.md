# QuickUPI Implementation Roadmap & Milestone Checklist

**Document Version:** 1.0.0  
**Status:** Core Platform Live & Verified  
**Last Updated:** October 2026  

---

## Milestone Breakdown & Progress

```
[Phase 1: Architecture & Specs] ──▶ [Phase 2: Database & Core Models] ──▶ [Phase 3: Limits & QR Engine]
             ✓ Complete                         ✓ Complete                          ✓ Complete
                                                                                       │
[Phase 6: Universal Embed SDK]  ◀── [Phase 5: Merchant Dashboard]   ◀── [Phase 4: Omnichannel Payer UI]
             ✓ Complete                         ✓ Complete                          ✓ Complete
```

---

### Phase 1: Product Definition & Architectural Foundation
- [x] Executive Summary & One-Liner Hook definition
- [x] Detailed Product Requirements Document ([`PRD.md`](file:///d:/PayMe/docs/PRD.md))
- [x] Architectural Decision Records ([`DECISIONS.md`](file:///d:/PayMe/docs/DECISIONS.md))
- [x] End-to-End System Architecture ([`ARCHITECTURE.md`](file:///d:/PayMe/docs/ARCHITECTURE.md))
- [x] Hybrid Verification Mesh Protocol & Bank Regex ([`VERIFICATION_MESH.md`](file:///d:/PayMe/docs/VERIFICATION_MESH.md))
- [x] REST API & SDK Protocol Specifications ([`API_SPEC.md`](file:///d:/PayMe/docs/API_SPEC.md))
- [x] Relational Database Schema & Data Models ([`DATABASE_SCHEMA.md`](file:///d:/PayMe/docs/DATABASE_SCHEMA.md))

---

### Phase 2: Database Setup & Core Models
- [x] Initialized [`prisma/schema.prisma`](file:///d:/PayMe/prisma/schema.prisma) with SQLite & production Postgres compatibility
- [x] Ran Prisma client generation (`npm run prisma:generate`) and database push (`npm run prisma:push`)
- [x] Created comprehensive seed script ([`prisma/seed.ts`](file:///d:/PayMe/prisma/seed.ts)) with demo merchant (`arslan`, `arslan@okhdfcbank`), active 25-seat campaign, sold-out campaign, observer device, and sample transactions
- [x] Built global Prisma client singleton with connection pooling ([`src/lib/prisma.ts`](file:///d:/PayMe/src/lib/prisma.ts))

---

### Phase 3: Smart Limits & Dynamic Vector QR Engine
- [x] Vector SVG QR Code generator component ([`src/components/qr/VectorQR.tsx`](file:///d:/PayMe/src/components/qr/VectorQR.tsx)) with scalable SVG, center Rupee badge, and intent copying
- [x] Strict NPCI UPI Deep-Link Intent builder ([`src/lib/utils.ts`](file:///d:/PayMe/src/lib/utils.ts)) (`upi://pay?pa=...`)
- [x] Atomic Limits & Slot Arbiter ([`src/lib/arbiter.ts`](file:///d:/PayMe/src/lib/arbiter.ts)) implementing CAS concurrency control to prevent oversubscription
- [x] Dynamic Micro-Paise Offset Allocator ([`src/lib/paise-pool.ts`](file:///d:/PayMe/src/lib/paise-pool.ts)) with 5-minute sliding TTL lease manager

---

### Phase 4: Omnichannel Payer Experience
- [x] Desktop Checkout View ([`src/app/(public)/r/[campaignId]/page.tsx`](file:///d:/PayMe/src/app/(public)/r/[campaignId]/page.tsx)):
  - Vector SVG QR Code display with high-contrast slate borders
  - Live session countdown timer ([`src/components/checkout/CountdownTimer.tsx`](file:///d:/PayMe/src/components/checkout/CountdownTimer.tsx))
  - Real-time remaining slots & collection progress bar ([`src/components/checkout/LimitsMeter.tsx`](file:///d:/PayMe/src/components/checkout/LimitsMeter.tsx))
  - Mode A 12-digit UTR input form ([`src/components/checkout/UtrSubmissionBox.tsx`](file:///d:/PayMe/src/components/checkout/UtrSubmissionBox.tsx)) with regex validation
- [x] Mobile Payer View ([`src/components/checkout/MobileDrawer.tsx`](file:///d:/PayMe/src/components/checkout/MobileDrawer.tsx)):
  - Responsive bottom sheet drawer
  - 1-Tap UPI Intent buttons: **Google Pay**, **PhonePe**, **Paytm**, **CRED**, **Any UPI App**
- [x] Branded Merchant Public Page ([`src/app/(public)/pay/[handle]/page.tsx`](file:///d:/PayMe/src/app/(public)/pay/[handle]/page.tsx))

---

### Phase 5: Hybrid Verification Mesh & Observer Webhook Engine
- [x] Mode A: UTR submission endpoint ([`src/app/api/v1/verify/utr/route.ts`](file:///d:/PayMe/src/app/api/v1/verify/utr/route.ts)) + merchant 1-tap approval route
- [x] Mode B: Android Observer webhook endpoint ([`src/app/api/v1/observer/push/route.ts`](file:///d:/PayMe/src/app/api/v1/observer/push/route.ts)):
  - Cryptographic HMAC-SHA256 signature verification ([`src/lib/hmac.ts`](file:///d:/PayMe/src/lib/hmac.ts))
  - Multi-Bank SMS Regex parser ([`src/lib/parsers.ts`](file:///d:/PayMe/src/lib/parsers.ts)) (HDFC, SBI, ICICI, Axis, Kotak, PPBL)
- [x] Mode C: Dynamic micro-paise reconciliation engine

---

### Phase 6: Merchant Command Center (Dashboard)
- [x] KPI Analytics: Total Volume Settled, Fees Saved counter (₹0 vs 2.36%), Active Limit QRs, Observer status ([`src/app/(dashboard)/dashboard/DashboardClient.tsx`](file:///d:/PayMe/src/app/(dashboard)/dashboard/DashboardClient.tsx))
- [x] Pending Mode A table with **1-Tap Approve** button calling [`src/app/api/v1/transactions/[id]/approve/route.ts`](file:///d:/PayMe/src/app/api/v1/transactions/[id]/approve/route.ts)
- [x] Active Limit Campaigns card manager with link copy and QR inspector
- [x] Full transaction ledger with status badges (`VERIFIED`, `PENDING`)

---

### Phase 7: Universal Checkout SDK (`quickupi.js`)
- [x] Lightweight vanilla JS bundle ([`public/quickupi.js`](file:///d:/PayMe/public/quickupi.js)) (< 5 KB gzipped) with iframe modal sandbox
- [x] Declarative `[data-quickupi-pay]` button attribute auto-binding
- [x] Programmatic JavaScript API: `window.QuickUPI.open({...})`
- [x] Standalone external site simulation demo ([`public/embed-demo.html`](file:///d:/PayMe/public/embed-demo.html))
