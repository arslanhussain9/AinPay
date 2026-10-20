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

### **Direct UPI Payment Links & Invoices for Indian Freelancers**

**0% Platform Fees • Instant Bank Credit • Branded Personal Pages & Project Invoices**

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.21-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Zero Platform Fees](https://img.shields.io/badge/Fees-0%25%20Forever-10b981?style=for-the-badge&logo=cashapp&logoColor=white)](#)

</div>

---

## ⚡ What is PayMe?

PayMe gives freelancers in India (designers, developers, consultants, creators) a professional way to collect client payments directly into their bank accounts over UPI:

1. **Branded Profile Link (`payme.in/pay/username`):** A clean personal page displaying your bio, verified UPI ID, social handles, and an instant payment box with preset and custom amounts.
2. **Fixed Milestone Invoices (`payme.in/p/slug`):** Create locked-amount payment links for project advances, consultation calls, or deliverables.
3. **1-Tap Mobile Drawer:** Clients on mobile can open Google Pay, PhonePe, Paytm, or CRED with the exact amount pre-filled.
4. **Desktop High-Contrast Vector QR:** Desktop clients can scan a crisp, direct bank transfer QR code.
5. **Zero-Overhead 1-Tap Verification:** Client enters their 12-digit UTR receipt number. When you receive the credit SMS on your phone, confirm it with 1-tap on your dashboard.
6. **Freelancer Command Center (`/dashboard`):** Track total earnings, fees saved compared to 2-3% aggregator cuts, pending approvals, and create new payment links in seconds.

---

## 🚀 Live Routes (`http://localhost:3000`)

| Route | Purpose |
| :--- | :--- |
| **`/`** | Homepage highlighting direct bank payments and milestone billing. |
| **`/pay/arslan`** | Demo freelancer profile with Quick Pay box and listed services. |
| **`/p/website-advance`** | Project invoice checkout with locked ₹25,000 amount, Vector QR, and UTR form. |
| **`/dashboard`** | Freelancer dashboard to view ledger, approve payments, and generate links. |

---

## 🛠️ Tech Stack & Setup

* **Framework:** Next.js 14 App Router, TypeScript
* **Styling:** Tailwind CSS, modern clean typography
* **Database:** Prisma ORM with local SQLite (`dev.db`)
* **QR Engine:** ISO/IEC 18004 Scalable Vector SVG
* **Currency Math:** Integer minor units (paise) to prevent decimal drift

### Quickstart:

```bash
# 1. Install dependencies
npm.cmd install

# 2. Push schema to local database
npm.cmd run prisma:push

# 3. Seed demo data
npx.cmd ts-node prisma/seed.ts

# 4. Start development server
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
