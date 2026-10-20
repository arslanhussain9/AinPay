# Graph Report - PayMe  (2026-10-20)

## Corpus Check
- 36 files · ~17,555 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .prisma 1)

## Summary
- 275 nodes · 345 edges · 20 communities (16 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c8acf0f4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Package Manifest & Core References
- Architecture Decision Records (ADR) & Design Rationale
- dependencies
- Build Tooling & Development Dependencies
- next
- index.ts
- NPM Lifecycle & Database Scripts
- 3. Core Feature Specifications
- QuickUPI REST API & Embed SDK Specification
- PayMe
- QuickUPI System Architecture & Technical Specifications
- Architecture & Product Alignment
- 2. Model Specifications
- stripe-DESIGN.md
- [campaignId]/page.tsx
- compilerOptions
- payme.js
- next.config.mjs
- quickupi.js

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `next` - 12 edges
3. `react` - 12 edges
4. `lucide-react` - 10 edges
5. `Architecture Decision Records (ADR) & Design Rationale` - 10 edges
6. `formatINR()` - 9 edges
7. `scripts` - 8 edges
8. `FreelancerPageClient()` - 8 edges
9. `prisma` - 7 edges
10. `validateUTR()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `FreelancerProfilePage()` --calls--> `FreelancerPageClient()`  [EXTRACTED]
  src/app/(public)/pay/[handle]/page.tsx → src/app/(public)/pay/[handle]/FreelancerPageClient.tsx
- `POST()` --calls--> `validateUTR()`  [EXTRACTED]
  src/app/api/v1/payments/submit/route.ts → src/lib/utils.ts
- `DashboardClient()` --calls--> `formatINR()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/DashboardClient.tsx → src/lib/utils.ts
- `DashboardPage()` --calls--> `DashboardClient()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/page.tsx → src/app/(dashboard)/dashboard/DashboardClient.tsx
- `LimitsMeter()` --calls--> `formatINR()`  [EXTRACTED]
  src/components/checkout/LimitsMeter.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (20 total, 4 thin omitted)

### Community 0 - "Package Manifest & Core References"
Cohesion: 0.09
Nodes (18): description, name, private, version, prisma, autoprefixer, postcss, prisma (+10 more)

### Community 1 - "Architecture Decision Records (ADR) & Design Rationale"
Cohesion: 0.06
Nodes (34): ADR-001: Sovereign Direct-to-Bank Settlement vs Escrow Intermediary, ADR-002: Integer Minor Units (Paise) for Financial Arithmetic, ADR-003: Tri-Channel Hybrid Verification Mesh (Modes A, B, C), ADR-004: Atomic Concurrency Control for Slot & Cap Limits, ADR-005: Next.js App Router & Server Actions Architecture, ADR-006: Database Layer via Prisma (SQLite Local, PostgreSQL Cloud), ADR-007: Zero-Dependency Vanilla SDK (`quickupi.js`), ADR-008: HMAC-SHA256 Signature Auth for Observer Android Nodes (+26 more)

### Community 2 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, clsx, lucide-react, next, @prisma/client, qrcode, react, react-dom (+1 more)

### Community 3 - "Build Tooling & Development Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, prisma, tailwindcss, @types/node, @types/qrcode, @types/react (+2 more)

### Community 4 - "next"
Cohesion: 0.11
Nodes (17): next, POST(), POST(), POST(), DashboardClient(), DashboardClientProps, DashboardPage(), dynamic (+9 more)

### Community 5 - "index.ts"
Cohesion: 0.40
Nodes (4): FreelancerProfileDTO, LinkStatus, PaymentStatus, UPIIntentParams

### Community 6 - "NPM Lifecycle & Database Scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:studio, start

### Community 7 - "3. Core Feature Specifications"
Cohesion: 0.25
Nodes (7): 1. Executive Summary & Core Hook, 2. Target Personas, 3.1 The Freelancer Mini-Website (`payme.in/pay/[username]`), 3.2 Client Payment Experience (`/p/[slug]`), 3.3 Freelancer Command Center (`/dashboard`), 3. Core Feature Specifications, PayMe — Product Requirements Document (PRD)

### Community 8 - "QuickUPI REST API & Embed SDK Specification"
Cohesion: 0.12
Nodes (16): 1. Authentication & Security Headers, 2.1 Initialize Checkout Session, 2.2 Poll Checkout Session Status, 2.3 Submit 12-Digit UTR (Mode A), 2. Public Checkout & Payer Endpoints, 3.1 Push Intercepted Bank SMS / Alert (Mode B), 3.2 Observer Device Heartbeat, 3. Observer Android Node Endpoints (+8 more)

### Community 9 - "PayMe"
Cohesion: 0.22
Nodes (8): 🚀 Live Demo Routes (`http://localhost:3000`), PayMe, Quickstart:, 🎨 Stripe Design Aesthetic, 🛠️ Tech Stack & Setup, **The 0% Fee Razorpay.me for Indian Freelancers & Creators**, The PayMe Solution:, ⚡ The Problem vs PayMe

### Community 10 - "QuickUPI System Architecture & Technical Specifications"
Cohesion: 0.17
Nodes (11): 1. High-Level System Architecture, 2.1 The Race Condition Challenge, 2.2 The QuickUPI Arbitration Protocol, 2. Dynamic Limits Engine & Atomic Arbiter, 3.1 QR Specification, 3.2 UPI Intent URI Construction, 3. Dynamic Vector QR Generator, 4. Mobile Deep-Link Intent Architecture (+3 more)

### Community 11 - "Architecture & Product Alignment"
Cohesion: 0.50
Nodes (3): Architecture & Product Alignment, Core Milestone Checklist, PayMe Implementation Roadmap & Milestone Checklist

### Community 12 - "2. Model Specifications"
Cohesion: 0.29
Nodes (6): 1. Entity Relationship Overview, 2. Model Specifications, `Freelancer`, PayMe Database Schema & Data Models, `Payment`, `PaymentLink`

### Community 13 - "stripe-DESIGN.md"
Cohesion: 0.05
Nodes (36): Border Radius Scale, Brand & Accent, Breakpoints, Buttons, Cards & Containers, Collapsing Strategy, Colors, Components (+28 more)

### Community 14 - "[campaignId]/page.tsx"
Cohesion: 0.13
Nodes (21): clsx, lucide-react, react, tailwind-merge, dynamic, PageProps, PaymentLinkCheckoutPage(), FreelancerPageClient() (+13 more)

### Community 15 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@types/node`, `@types/qrcode`, `@types/react`, `@types/react-dom` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 177 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Package Manifest & Core References`, `[campaignId]/page.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `react-dom`, `@types/node`, `@types/qrcode` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Manifest & Core References` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `Build Tooling & Development Dependencies` to `Package Manifest & Core References`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `Architecture Decision Records (ADR) & Design Rationale` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Why does `react` connect `[campaignId]/page.tsx` to `Package Manifest & Core References`, `next`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.10804597701149425 - nodes in this community are weakly interconnected._