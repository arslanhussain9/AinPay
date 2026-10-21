export type PaymentStatus = "PENDING" | "APPROVED" | "DECLINED";

export type LinkStatus = "ACTIVE" | "PAUSED" | "CLOSED";

export interface UPIIntentParams {
  vpa: string;
  name: string;
  amountPaise: number;
  transactionRef?: string;
  note?: string;
}

export interface FreelancerProfileDTO {
  id: string;
  username: string;
  name: string;
  email: string;
  mobile?: string | null;
  vpa: string;
  title?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}
