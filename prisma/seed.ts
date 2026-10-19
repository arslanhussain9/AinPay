import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding QuickUPI database...");

  // Clean existing records
  await prisma.transaction.deleteMany();
  await prisma.microPaiseLease.deleteMany();
  await prisma.paymentSession.deleteMany();
  await prisma.paymentCampaign.deleteMany();
  await prisma.observerDevice.deleteMany();
  await prisma.merchant.deleteMany();

  // Create demo merchant
  const merchant = await prisma.merchant.create({
    data: {
      email: "arslan@example.com",
      passwordHash: "demo_hash_quickupi",
      name: "Arslan Ahmad",
      businessName: "Arslan Tech & Design Labs",
      handle: "arslan",
      vpa: "arslan@okhdfcbank",
      tier: "PRO",
      publishableKey: "pk_live_quickupi_arslan",
      secretKey: "sk_live_quickupi_arslan_secret",
      observerSecret: "obs_sec_quickupi_982348",
    },
  });

  console.log(`Created merchant: ${merchant.name} (${merchant.handle})`);

  // Create Hero 25-Slot Campaign
  const cohortCampaign = await prisma.paymentCampaign.create({
    data: {
      merchantId: merchant.id,
      title: "Fullstack Next.js & AI Cohort 2026",
      slug: "nextjs-ai-cohort",
      description: "Interactive 6-week cohort on agentic engineering and modern fintech software. Limited to 25 early seats.",
      amountPaise: 199900, // ₹1,999.00
      isFixedAmount: true,
      totalCapPaise: 5000000, // ₹50,000.00
      collectedPaise: 199900 * 18, // ₹35,982.00 (18 seats booked!)
      maxSlots: 25,
      usedSlots: 18,
      status: "ACTIVE",
      enableMicroPaise: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  // Create Sold Out Campaign
  const soldOutCampaign = await prisma.paymentCampaign.create({
    data: {
      merchantId: merchant.id,
      title: "Exclusive 1-on-1 Architecture Review",
      slug: "architecture-review",
      description: "Private 90-minute architecture review session.",
      amountPaise: 499900, // ₹4,999.00
      isFixedAmount: true,
      totalCapPaise: 2500000,
      collectedPaise: 2499500,
      maxSlots: 5,
      usedSlots: 5,
      status: "SLOTS_EXHAUSTED",
      enableMicroPaise: false,
    },
  });

  // Create Paired Android Observer Device
  const observer = await prisma.observerDevice.create({
    data: {
      merchantId: merchant.id,
      deviceName: "Pixel 8 Pro (Primary Banking SIM)",
      deviceId: "DEV_PIXEL_8_PRO_9841",
      deviceSecret: merchant.observerSecret,
      appVersion: "1.0.4",
      batteryPct: 92,
      isCharging: false,
      status: "ONLINE",
    },
  });

  // Seed sample transactions
  const sampleTransactions = [
    {
      merchantId: merchant.id,
      campaignId: cohortCampaign.id,
      utrNumber: "429182736451",
      amountPaise: 199900,
      verificationMode: "OBSERVER_SMS",
      status: "VERIFIED",
      payerName: "Rohit Verma",
      payerVpa: "rohit@okhdfcbank",
      payerPhone: "+919876543210",
      rawBankAlertText: "Dear Customer, INR 1,999.00 credited to a/c **1234 by UPI-ROHIT-429182736451.",
      verifiedAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      merchantId: merchant.id,
      campaignId: cohortCampaign.id,
      utrNumber: "429182736452",
      amountPaise: 199914,
      verificationMode: "MICRO_PAISE_MATCH",
      status: "VERIFIED",
      payerName: "Pooja Sharma",
      payerVpa: "pooja@paytm",
      payerPhone: "+919876543211",
      rawBankAlertText: "Your a/c no. XX1234 is credited by Rs.1,999.14 on 19Oct26 by UPI/CR/429182736452/Pooja.",
      verifiedAt: new Date(Date.now() - 3600000 * 2),
    },
    {
      merchantId: merchant.id,
      campaignId: cohortCampaign.id,
      utrNumber: "429182736453",
      amountPaise: 199900,
      verificationMode: "MANUAL_UTR",
      status: "PENDING",
      payerName: "Aman Gupta",
      payerVpa: "aman@axisbank",
      payerPhone: "+919876543212",
      verifiedAt: null,
    },
  ];

  for (const txn of sampleTransactions) {
    await prisma.transaction.create({ data: txn });
  }

  console.log("Seeding complete! 2 campaigns and 3 sample transactions created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
