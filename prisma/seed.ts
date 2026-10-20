import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PayMe Freelancer Database...");

  // Clean existing tables
  await prisma.payment.deleteMany();
  await prisma.paymentLink.deleteMany();
  await prisma.freelancer.deleteMany();

  // Create primary freelancer profile
  const freelancer = await prisma.freelancer.create({
    data: {
      username: "arslan",
      name: "Arslan Hussain",
      email: "arslan@example.com",
      mobile: "+91 98765 43210",
      vpa: "arslan@okhdfcbank",
      title: "Product Designer & Fullstack Engineer",
      bio: "Helping ambitious startups craft world-class software. Available for UI design, Next.js web applications, and technical consulting.",
      twitter: "https://twitter.com/arslan",
      github: "https://github.com/arslanhussain9",
      linkedin: "https://linkedin.com/in/arslan",
    },
  });

  console.log(`Created freelancer: ${freelancer.name} (@${freelancer.username})`);

  // Create sample project payment links
  const link1 = await prisma.paymentLink.create({
    data: {
      freelancerId: freelancer.id,
      title: "Website Redesign — 50% Milestone Advance",
      slug: "website-advance",
      amountPaise: 2500000, // ₹25,000.00
      isFixedAmount: true,
      description: "Initial 50% advance for SaaS landing page design and Next.js frontend implementation.",
      status: "ACTIVE",
    },
  });

  const link2 = await prisma.paymentLink.create({
    data: {
      freelancerId: freelancer.id,
      title: "1-Hour Technical Consultation",
      slug: "consultation",
      amountPaise: 199900, // ₹1,999.00
      isFixedAmount: true,
      description: "Deep-dive 1:1 strategy session covering architecture, tech stack selection, and database design.",
      maxSlots: 5,
      usedSlots: 3,
      status: "ACTIVE",
    },
  });

  const link3 = await prisma.paymentLink.create({
    data: {
      freelancerId: freelancer.id,
      title: "Logo & Brand Identity Sprint",
      slug: "branding-sprint",
      amountPaise: 1200000, // ₹12,000.00
      isFixedAmount: true,
      description: "Complete visual identity package: logo marks, color tokens, and vector brand assets.",
      maxSlots: 3,
      usedSlots: 3,
      status: "CLOSED",
    },
  });

  // Create sample payments
  await prisma.payment.create({
    data: {
      freelancerId: freelancer.id,
      paymentLinkId: link1.id,
      payerName: "Vikram Malhotra",
      payerEmail: "vikram@fintech.io",
      amountPaise: 2500000,
      utrNumber: "429182736451",
      note: "Advance for SaaS website redesign project",
      status: "APPROVED",
      approvedAt: new Date(Date.now() - 3600000 * 24),
    },
  });

  await prisma.payment.create({
    data: {
      freelancerId: freelancer.id,
      paymentLinkId: link2.id,
      payerName: "Priya Nair",
      payerEmail: "priya@startup.co",
      amountPaise: 199900,
      utrNumber: "429182736452",
      note: "Architecture consultation call slot",
      status: "APPROVED",
      approvedAt: new Date(Date.now() - 3600000 * 4),
    },
  });

  await prisma.payment.create({
    data: {
      freelancerId: freelancer.id,
      paymentLinkId: link2.id,
      payerName: "Karan Johar",
      payerEmail: "karan@designworks.in",
      payerPhone: "+91 98111 22334",
      amountPaise: 199900,
      utrNumber: "429182736453",
      note: "1-hr session on Next.js 14 performance",
      status: "PENDING", // Pending 1-tap approval
    },
  });

  console.log("Seeding complete! Freelancer profile, 3 links, and 3 payments created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
