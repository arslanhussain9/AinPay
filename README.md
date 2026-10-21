# AINPAY

<div align="center">

```
 █████╗ ██╗███╗   ██╗██████╗  █████╗ ██╗   ██╗
██╔══██╗██║████╗  ██║██╔══██╗██╔══██╗╚██╗ ██╔╝
███████║██║██╔██╗ ██║██████╔╝███████║ ╚████╔╝ 
██╔══██║██║██║╚██╗██║██╔═══╝ ██╔══██║  ╚██╔╝  
██║  ██║██║██║ ╚████║██║     ██║  ██║   ██║   
╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝  ╚═╝   ╚═╝   
```

### **Direct UPI Payment Pages & Invoices for Everyone**

**0% Platform Fees • Instant Bank Credit • Branded Personal Pages & Custom Invoices**

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.21-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Zero Platform Fees](https://img.shields.io/badge/Fees-0%25%20Forever-10b981?style=for-the-badge&logo=cashapp&logoColor=white)](#)

</div>

---

## ⚡ What is AINPAY?

AINPAY gives anyone (creators, consultants, freelancers, small businesses, and individuals) a simple way to collect payments directly into their bank accounts over UPI:

1. **Branded Profile Link (`ainpay.in/pay/username`):** A personal page displaying your profile, verified UPI ID, social handles, and an instant payment box with preset and custom amounts.
2. **Fixed Invoices & Payment Links (`ainpay.in/p/slug`):** Create locked-amount payment links for services, consulting, projects, or products.
3. **1-Tap Mobile Drawer:** Clients on mobile can open Google Pay, PhonePe, Paytm, or CRED with the exact amount pre-filled.
4. **Desktop Vector QR:** Desktop payers can scan a crisp, direct bank transfer QR code.
5. **Zero-Overhead 1-Tap Verification:** Payer enters their 12-digit UTR receipt number. When you receive the credit SMS, confirm it with 1-tap on your dashboard.
6. **Command Center (`/dashboard`):** Track total received revenue, estimated fees saved vs payment gateways, pending approvals, and create new payment links in seconds.

---

## 🚀 Live Routes (`http://localhost:3000`)

| Route | Purpose |
| :--- | :--- |
| **`/`** | Product overview and direct UPI features. |
| **`/pay/arslan`** | Personal direct UPI payment page with custom amounts & QR. |
| **`/p/[slug]`** | Single-use invoice checkout with locked amount, Vector QR, and UTR verification. |
| **`/dashboard`** | Merchant dashboard for metrics, 1-tap approvals, profile editing, and link generation. |

---

## 🛠️ Tech Stack & Setup

* **Framework:** Next.js 14 App Router, TypeScript
* **Styling:** Tailwind CSS, modern clean typography
* **Database:** Prisma ORM (SQLite for local dev, PostgreSQL / Neon for production)
* **QR Engine:** ISO/IEC 18004 Scalable Vector SVG
* **Currency Math:** Integer minor units (paise) to prevent decimal drift

### Quickstart (Local Development):

```bash
# 1. Install dependencies
npm install

# 2. Push schema to database
npm run prisma:push

# 3. Seed demo data
npx tsx prisma/seed.ts

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

1. Import this repository into [Vercel](https://vercel.com).
2. Connect a free cloud PostgreSQL database (e.g. [Neon](https://neon.tech) or Vercel Postgres).
3. Set your environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `NEXT_PUBLIC_APP_URL`: Your deployed Vercel domain (e.g. `https://your-project.vercel.app`).
4. Click **Deploy**. Vercel will automatically run `prisma generate` and build the application.
