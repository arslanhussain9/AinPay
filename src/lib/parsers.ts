import { BankSMSParsedData } from "@/types";
import { rupeesToPaise } from "./utils";

interface RegexRule {
  bank: string;
  regex: RegExp;
  extract: (match: RegExpExecArray, text: string) => { amountPaise: number; utr: string; accountEnding?: string } | null;
}

const PARSER_RULES: RegexRule[] = [
  // HDFC Bank
  // Dear Customer, Rs 2,000.00 credited to a/c **1234 on 19-10-26 by UPI-ARSLAN-429182736451-payment.
  {
    bank: "HDFC Bank",
    regex: /(?:Rs\.?|INR)\s*([\d,]+\.?\d*)\s*credited to a\/c\s*(?:\*{0,4}(\d{4}))?.*?(?:UPI[-/]|UTR[:\s]+|Ref[:\s]+).*?(\d{12})/i,
    extract: (m) => {
      const amountStr = m[1].replace(/,/g, "");
      const amountRupees = parseFloat(amountStr);
      if (isNaN(amountRupees)) return null;
      return {
        amountPaise: rupeesToPaise(amountRupees),
        accountEnding: m[2],
        utr: m[3],
      };
    },
  },

  // State Bank of India (SBI)
  // Your a/c no. XX1234 is credited by Rs.2,000.00 on 19Oct26 by UPI/CR/429182736451/Arslan. (Ref no 429182736451)
  {
    bank: "State Bank of India",
    regex: /(?:a\/c\s*no\.?\s*(?:X{1,4}|X\*)(\d{4}))?.*?credited\s*(?:by|with)?\s*(?:Rs\.?|INR)\s*([\d,]+\.?\d*).*?(?:UPI\/CR\/|Ref\s*no\s*)(\d{12})/i,
    extract: (m) => {
      const amountStr = m[2].replace(/,/g, "");
      const amountRupees = parseFloat(amountStr);
      if (isNaN(amountRupees)) return null;
      return {
        accountEnding: m[1],
        amountPaise: rupeesToPaise(amountRupees),
        utr: m[3],
      };
    },
  },

  // ICICI Bank
  // Dear Customer, your Acct XX123 is credited with INR 2,000.00 on 19-Oct-26 by UPI Ref no 429182736451.
  {
    bank: "ICICI Bank",
    regex: /(?:Acct\s*(?:X{1,4}|X\*)(\d{3,4}))?.*?credited with\s*(?:INR|Rs\.?)\s*([\d,]+\.?\d*).*?UPI(?:\s*Ref\s*(?:no)?)?[:\s]*(\d{12})/i,
    extract: (m) => {
      const amountStr = m[2].replace(/,/g, "");
      const amountRupees = parseFloat(amountStr);
      if (isNaN(amountRupees)) return null;
      return {
        accountEnding: m[1],
        amountPaise: rupeesToPaise(amountRupees),
        utr: m[3],
      };
    },
  },

  // Axis Bank
  // Dear Customer, INR 2000.00 credited to Axis Bank A/c ...123 on 19-10-2026 18:30:12 by UPI/429182736451/Arslan.
  {
    bank: "Axis Bank",
    regex: /(?:INR|Rs\.?)\s*([\d,]+\.?\d*)\s*credited to Axis Bank A\/c\s*(?:\.{0,4}(\d{3,4}))?.*?UPI\/(\d{12})/i,
    extract: (m) => {
      const amountStr = m[1].replace(/,/g, "");
      const amountRupees = parseFloat(amountStr);
      if (isNaN(amountRupees)) return null;
      return {
        amountPaise: rupeesToPaise(amountRupees),
        accountEnding: m[2],
        utr: m[3],
      };
    },
  },

  // Kotak Mahindra Bank
  // Rs. 2000.00 credited to Kotak Bank A/c ...123 on 19-Oct-26. UPI Ref no 429182736451.
  {
    bank: "Kotak Mahindra Bank",
    regex: /(?:Rs\.?|INR)\s*([\d,]+\.?\d*)\s*credited.*?Kotak.*?(?:UPI\s*Ref(?:\s*no)?[:\s]*|Ref[:\s]+)(\d{12})/i,
    extract: (m) => {
      const amountStr = m[1].replace(/,/g, "");
      const amountRupees = parseFloat(amountStr);
      if (isNaN(amountRupees)) return null;
      return {
        amountPaise: rupeesToPaise(amountRupees),
        utr: m[2],
      };
    },
  },

  // Generic Fallback Regex
  // e.g., "Credited Rs. 2000.00 via UPI Ref 429182736451"
  {
    bank: "Standard UPI",
    regex: /(?:credited|received|deposited)\s*(?:by|with|of)?\s*(?:Rs\.?|INR)\s*([\d,]+\.?\d*).*?(\d{12})/i,
    extract: (m) => {
      const amountStr = m[1].replace(/,/g, "");
      const amountRupees = parseFloat(amountStr);
      if (isNaN(amountRupees)) return null;
      return {
        amountPaise: rupeesToPaise(amountRupees),
        utr: m[2],
      };
    },
  },
];

/**
 * Parses raw bank alert SMS or Push notification text into structured financial data.
 */
export function parseBankAlert(text: string): BankSMSParsedData | null {
  if (!text || typeof text !== "string") return null;

  for (const rule of PARSER_RULES) {
    const match = rule.regex.exec(text);
    if (match) {
      const extracted = rule.extract(match, text);
      if (extracted && extracted.utr && extracted.amountPaise > 0) {
        return {
          bank: rule.bank,
          amountPaise: extracted.amountPaise,
          utr: extracted.utr,
          accountEnding: extracted.accountEnding,
          rawText: text,
        };
      }
    }
  }

  return null;
}
