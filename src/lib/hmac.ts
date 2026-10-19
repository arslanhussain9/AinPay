import crypto from "crypto";

const MAX_TIMESTAMP_DRIFT_MS = 60 * 1000; // 60 seconds

export function generateHMAC(secretKey: string, payload: string): string {
  return crypto
    .createHmac("sha256", secretKey)
    .update(payload)
    .digest("hex");
}

export function verifyObserverRequest(params: {
  secretKey: string;
  rawBody: string;
  timestampHeader: string | null;
  signatureHeader: string | null;
}): { valid: boolean; reason?: string } {
  const { secretKey, rawBody, timestampHeader, signatureHeader } = params;

  if (!timestampHeader || !signatureHeader) {
    return { valid: false, reason: "Missing required observer authentication headers" };
  }

  const timestamp = parseInt(timestampHeader, 10);
  if (isNaN(timestamp)) {
    return { valid: false, reason: "Invalid timestamp header format" };
  }

  // Guard against replay attacks
  const now = Date.now();
  if (Math.abs(now - timestamp) > MAX_TIMESTAMP_DRIFT_MS) {
    return { valid: false, reason: "Timestamp drift exceeded (potential replay attack)" };
  }

  const messageToSign = `${rawBody}.${timestamp}`;
  const expectedSignature = generateHMAC(secretKey, messageToSign);

  // Timing safe comparison to protect against side-channel analysis
  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const providedBuffer = Buffer.from(signatureHeader, "hex");

  if (expectedBuffer.length !== providedBuffer.length) {
    return { valid: false, reason: "Invalid signature length" };
  }

  const matches = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
  if (!matches) {
    return { valid: false, reason: "Signature mismatch" };
  }

  return { valid: true };
}
