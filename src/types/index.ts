export type MerchantTier = "FREE" | "PRO" | "BUSINESS";

export type CampaignStatus = 
  | "ACTIVE" 
  | "PAUSED" 
  | "SLOTS_EXHAUSTED" 
  | "CAP_REACHED" 
  | "EXPIRED";

export type SessionStatus = 
  | "AWAITING_PAYMENT" 
  | "UTR_SUBMITTED" 
  | "VERIFIED" 
  | "EXPIRED" 
  | "OVERSUBSCRIBED";

export type TransactionStatus = 
  | "PENDING" 
  | "VERIFIED" 
  | "REJECTED" 
  | "EXPIRED" 
  | "AMOUNT_MISMATCH" 
  | "OVERSUBSCRIBED_REFUND_DUE";

export type VerificationMode = 
  | "MANUAL_UTR" 
  | "OBSERVER_SMS" 
  | "OBSERVER_NOTIFICATION" 
  | "MICRO_PAISE_MATCH";

export type DeviceStatus = "ONLINE" | "OFFLINE";

export interface UPIIntentParams {
  vpa: string;
  name: string;
  amountPaise: number;
  transactionRef: string;
  note?: string;
}

export interface LimitCheckResult {
  allowed: boolean;
  reason?: "SLOTS_EXHAUSTED" | "CAP_REACHED" | "CAMPAIGN_EXPIRED" | "CAMPAIGN_PAUSED";
  remainingSlots?: number | null;
  remainingCapPaise?: number | null;
}

export interface BankSMSParsedData {
  bank: string;
  amountPaise: number;
  utr: string;
  accountEnding?: string;
  rawText: string;
}
