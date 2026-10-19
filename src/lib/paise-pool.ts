import prisma from "./prisma";

const LEASE_DURATION_MS = 5 * 60 * 1000; // 5 minutes TTL

/**
 * Leases an available micro-paise offset (1 to 99 paise) for concurrent disambiguation.
 */
export async function leaseMicroPaise(
  campaignId: string,
  sessionId: string
): Promise<number> {
  const now = new Date();

  // 1. Release any expired leases first
  await prisma.microPaiseLease.updateMany({
    where: {
      campaignId,
      expiresAt: { lt: now },
      isReleased: false,
    },
    data: { isReleased: true },
  });

  // 2. Fetch active offsets
  const activeLeases = await prisma.microPaiseLease.findMany({
    where: {
      campaignId,
      expiresAt: { gte: now },
      isReleased: false,
    },
    select: { offsetPaise: true },
  });

  const occupiedSet = new Set(activeLeases.map((l) => l.offsetPaise));

  // 3. Find first available offset between 11 and 99 (avoid single digits for clarity)
  let chosenOffset = 0;
  for (let candidate = 11; candidate <= 99; candidate++) {
    if (!occupiedSet.has(candidate)) {
      chosenOffset = candidate;
      break;
    }
  }

  // Fallback to random if pool full
  if (chosenOffset === 0) {
    chosenOffset = Math.floor(Math.random() * 89) + 11;
  }

  // 4. Record the lease
  const expiresAt = new Date(Date.now() + LEASE_DURATION_MS);
  await prisma.microPaiseLease.create({
    data: {
      campaignId,
      sessionId,
      offsetPaise: chosenOffset,
      expiresAt,
    },
  });

  return chosenOffset;
}

/**
 * Releases a leased offset back into the pool.
 */
export async function releaseMicroPaise(sessionId: string): Promise<void> {
  await prisma.microPaiseLease.updateMany({
    where: { sessionId },
    data: { isReleased: true },
  });
}
