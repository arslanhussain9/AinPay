# Graph Report - PayMe  (2026-10-19)

## Corpus Check
- 41 files · ~26,151 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .db 1, .prisma 1, .css 1)

## Summary
- 360 nodes · 455 edges · 21 communities (16 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Package Manifest & Core References
- Architecture Decision Records (ADR) & Design Rationale
- YOUPI PG V2 Gateway
- Build Tooling & Development Dependencies
- utils.ts
- 3.4 Multi-Bank Regular Expression Parser Engine
- NPM Lifecycle & Database Scripts
- QuickUPI / PayMe — Product Requirements Document (PRD)
- QuickUPI REST API & Embed SDK Specification
- QuickUPI (PayMe)
- QuickUPI System Architecture & Technical Specifications
- Milestone Breakdown & Progress
- QuickUPI Database Schema & Data Models
- stripe-DESIGN.md
- [campaignId]/page.tsx
- compilerOptions
- layout.tsx
- next.config.mjs
- quickupi.js

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `YOUPI PG V2 Gateway` - 14 edges
3. `next` - 12 edges
4. `react` - 11 edges
5. `formatINR()` - 11 edges
6. `lucide-react` - 10 edges
7. `prisma` - 10 edges
8. `Architecture Decision Records (ADR) & Design Rationale` - 10 edges
9. `QuickUPI Platform` - 10 edges
10. `scripts` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Next.js & Prisma Technology Stack` --references--> `@prisma/client`  [EXTRACTED]
  QUICKUPI_PRODUCT_DOCUMENT.md → package.json
- `Next.js & Prisma Technology Stack` --references--> `next`  [EXTRACTED]
  QUICKUPI_PRODUCT_DOCUMENT.md → package.json
- `Next.js & Prisma Technology Stack` --references--> `qrcode`  [EXTRACTED]
  QUICKUPI_PRODUCT_DOCUMENT.md → package.json
- `64-Bit Integer Minor Units (Paise)` --conceptually_related_to--> `YOUPI PG V2 Gateway`  [INFERRED]
  QUICKUPI_PRODUCT_DOCUMENT.md → YOUPI_REFERENCE.md
- `QuickUPI Platform` --semantically_similar_to--> `YOUPI PG V2 Gateway`  [INFERRED] [semantically similar]
  QUICKUPI_PRODUCT_DOCUMENT.md → YOUPI_REFERENCE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Automated Banking Observation Mesh** — quickupi_product_document_observer_mode, youpi_reference_android_observer_apk, youpi_reference_tri_channel_mesh, youpi_reference_server_webhook [EXTRACTED 1.00]
- **Sovereign Direct-to-Bank UPI Settlement Architecture** — quickupi_product_document_quickupi, youpi_reference_youpi_pg_v2, quickupi_product_document_zero_fee_model, quickupi_product_document_instant_settlement [EXTRACTED 1.00]
- **Concurrent Payment Attribution & Disambiguation Strategies** — quickupi_product_document_paise_matching_mode, youpi_reference_fifo_queue, quickupi_product_document_limit_arbiter [INFERRED 0.85]

## Communities (21 total, 5 thin omitted)

### Community 0 - "Package Manifest & Core References"
Cohesion: 0.06
Nodes (27): dependencies, clsx, lucide-react, next, @prisma/client, qrcode, react, react-dom (+19 more)

### Community 1 - "Architecture Decision Records (ADR) & Design Rationale"
Cohesion: 0.06
Nodes (34): ADR-001: Sovereign Direct-to-Bank Settlement vs Escrow Intermediary, ADR-002: Integer Minor Units (Paise) for Financial Arithmetic, ADR-003: Tri-Channel Hybrid Verification Mesh (Modes A, B, C), ADR-004: Atomic Concurrency Control for Slot & Cap Limits, ADR-005: Next.js App Router & Server Actions Architecture, ADR-006: Database Layer via Prisma (SQLite Local, PostgreSQL Cloud), ADR-007: Zero-Dependency Vanilla SDK (`quickupi.js`), ADR-008: HMAC-SHA256 Signature Auth for Observer Android Nodes (+26 more)

### Community 2 - "YOUPI PG V2 Gateway"
Cohesion: 0.07
Nodes (29): Branded Shareable Payment Handles, Instant T+0 Bank Settlement, Real-time Limit Arbiter, Merchant Command Center, UPI Mobile Intent Deep Links, Automated Banking Observer (Mode B), Omnichannel Payer Experience, Dynamic Paise Matching (Mode C) (+21 more)

### Community 3 - "Build Tooling & Development Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, prisma, tailwindcss, @types/node, @types/qrcode, @types/react (+2 more)

### Community 4 - "utils.ts"
Cohesion: 0.09
Nodes (28): tailwind-merge, POST(), POST(), POST(), POST(), atomicConfirmPayment(), checkCampaignLimits(), ConfirmPaymentResult (+20 more)

### Community 5 - "3.4 Multi-Bank Regular Expression Parser Engine"
Cohesion: 0.10
Nodes (20): 1. The Core Problem: Why the Verification Mesh is Necessary, 2.1 Workflow, 2. Mode A: Zero-Infra UTR Logging (100% Free / Default), 3.1 Overview, 3.2 Operating Channels, 3.3 Security Handshake & HMAC-SHA256 Signing, 3.4 Multi-Bank Regular Expression Parser Engine, 3. Mode B: Automated Observer Node (Android Companion APK) (+12 more)

### Community 6 - "NPM Lifecycle & Database Scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:studio, start

### Community 7 - "QuickUPI / PayMe — Product Requirements Document (PRD)"
Cohesion: 0.11
Nodes (17): 1.1 One-Liner Hook, 1.2 Core Value Proposition, 1. Executive Summary & Product Vision, 2. Target Personas & Use Cases, 3.1 Hero Feature: Reusable QR with Automated Limits, 3.2 Omnichannel Payer Experience, 3.3 The Hybrid Verification Mesh, 3.4 Universal Embed SDK (`quickupi.js`) (+9 more)

### Community 8 - "QuickUPI REST API & Embed SDK Specification"
Cohesion: 0.12
Nodes (16): 1. Authentication & Security Headers, 2.1 Initialize Checkout Session, 2.2 Poll Checkout Session Status, 2.3 Submit 12-Digit UTR (Mode A), 2. Public Checkout & Payer Endpoints, 3.1 Push Intercepted Bank SMS / Alert (Mode B), 3.2 Observer Device Heartbeat, 3. Observer Android Node Endpoints (+8 more)

### Community 9 - "QuickUPI (PayMe)"
Cohesion: 0.13
Nodes (14): 1. Install Dependencies, 1. Reusable QR with Automated Limits, 2. Setup Database & Prisma, 2. Tri-Channel Verification Mesh, 3. Omnichannel Payer Experience, 3. Start Development Server, 4. Universal Embed (`quickupi.js`), 📚 Complete Documentation Hub (+6 more)

### Community 10 - "QuickUPI System Architecture & Technical Specifications"
Cohesion: 0.17
Nodes (11): 1. High-Level System Architecture, 2.1 The Race Condition Challenge, 2.2 The QuickUPI Arbitration Protocol, 2. Dynamic Limits Engine & Atomic Arbiter, 3.1 QR Specification, 3.2 UPI Intent URI Construction, 3. Dynamic Vector QR Generator, 4. Mobile Deep-Link Intent Architecture (+3 more)

### Community 11 - "Milestone Breakdown & Progress"
Cohesion: 0.20
Nodes (9): Milestone Breakdown & Progress, Phase 1: Product Definition & Architectural Foundation, Phase 2: Database Setup & Core Models, Phase 3: Smart Limits & Dynamic Vector QR Engine, Phase 4: Omnichannel Payer Experience, Phase 5: Hybrid Verification Mesh & Observer Webhook Engine, Phase 6: Merchant Command Center (Dashboard), Phase 7: Universal Checkout SDK (`quickupi.js`) (+1 more)

### Community 12 - "QuickUPI Database Schema & Data Models"
Cohesion: 0.40
Nodes (4): 1. Relational Entity Diagram, 2. Complete Prisma Schema (`prisma/schema.prisma`), 3. Atomic Limit Concurrency Invariant, QuickUPI Database Schema & Data Models

### Community 13 - "stripe-DESIGN.md"
Cohesion: 0.05
Nodes (36): Border Radius Scale, Brand & Accent, Breakpoints, Buttons, Cards & Containers, Collapsing Strategy, Colors, Components (+28 more)

### Community 14 - "[campaignId]/page.tsx"
Cohesion: 0.13
Nodes (22): lucide-react, next, react, DashboardClient(), DashboardClientProps, DashboardPage(), dynamic, MerchantProfilePage() (+14 more)

### Community 15 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

## Knowledge Gaps
- **24 isolated node(s):** `react-dom`, `@types/node`, `@types/qrcode`, `@types/react`, `@types/react-dom` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 235 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `[campaignId]/page.tsx` to `Package Manifest & Core References`, `layout.tsx`, `YOUPI PG V2 Gateway`, `utils.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `YOUPI PG V2 Gateway` (e.g. with `64-Bit Integer Minor Units (Paise)` and `QuickUPI Platform`) actually correct?**
  _`YOUPI PG V2 Gateway` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `react-dom`, `@types/node`, `@types/qrcode` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Manifest & Core References` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Why does `Next.js & Prisma Technology Stack` connect `YOUPI PG V2 Gateway` to `Package Manifest & Core References`, `[campaignId]/page.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `Architecture Decision Records (ADR) & Design Rationale` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `YOUPI PG V2 Gateway` be split into smaller, more focused modules?**
  _Cohesion score 0.06951871657754011 - nodes in this community are weakly interconnected._