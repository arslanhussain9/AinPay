# QuickUPI REST API & Embed SDK Specification

**Document Version:** 1.0.0  
**Base URL:** `https://quickupi.in/api/v1`  
**Last Updated:** October 2026  

---

## 1. Authentication & Security Headers

QuickUPI employs three authentication modalities depending on caller context:

| Context | Header | Description |
| :--- | :--- | :--- |
| **Merchant Dashboard & Server API** | `Authorization: Bearer <secret_key>` | Used for campaign creation, metrics, and merchant administrative actions. |
| **Observer Android Node** | `X-Observer-Device-Id`, `X-Observer-Timestamp`, `X-Observer-Signature` | Cryptographic HMAC-SHA256 signature for bank SMS ingestion. |
| **Payer Checkout & SDK Client** | `X-Publishable-Key: pk_live_...` | Read-only public key for opening checkout sessions. |

---

## 2. Public Checkout & Payer Endpoints

### 2.1 Initialize Checkout Session
Creates a dynamic checkout session, checks campaign limits, leases micro-paise offset (if enabled), and generates the UPI URI.

* **Endpoint:** `POST /api/v1/checkout/session`
* **Request Body:**
```json
{
  "campaignId": "cmp_89f23a1",
  "payerName": "Rohit Verma",
  "payerEmail": "rohit@example.com",
  "payerPhone": "+919876543210",
  "customNote": "Batch 5 Early Bird Pass"
}
```
* **Success Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "sessionId": "ses_01928471a",
    "campaignId": "cmp_89f23a1",
    "payeeVpa": "arslan@okhdfcbank",
    "payeeName": "Arslan Ahmad",
    "baseAmountPaise": 200000,
    "assignedOffsetPaise": 14,
    "totalAmountPaise": 200014,
    "amountFormatted": "₹2,000.14",
    "upiIntentUri": "upi://pay?pa=arslan@okhdfcbank&pn=Arslan%20Ahmad&am=2000.14&cu=INR&tr=ses_01928471a&tn=Batch%205%20Early%20Bird%20Pass",
    "expiresAt": "2026-10-19T14:45:00.000Z",
    "remainingSlots": 7,
    "totalSlots": 25,
    "status": "AWAITING_PAYMENT"
  }
}
```
* **Error Response (`409 Conflict - Limits Exhausted`):**
```json
{
  "success": false,
  "error": {
    "code": "CAMPAIGN_LIMIT_REACHED",
    "message": "All 25 slots for this campaign have been booked.",
    "waitlistOpen": true
  }
}
```

### 2.2 Poll Checkout Session Status
Client polling or Server-Sent Events (SSE) endpoint to detect when an incoming Observer alert or UTR verification has confirmed the order.

* **Endpoint:** `GET /api/v1/checkout/session/:sessionId`
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "sessionId": "ses_01928471a",
    "status": "VERIFIED",
    "utr": "429182736451",
    "amountPaise": 200014,
    "verifiedAt": "2026-10-19T14:42:15.000Z",
    "verificationMode": "OBSERVER_SMS",
    "receiptUrl": "https://quickupi.in/receipt/ses_01928471a"
  }
}
```

### 2.3 Submit 12-Digit UTR (Mode A)
Allows payer to submit their UPI Reference Number manually.

* **Endpoint:** `POST /api/v1/verify/utr`
* **Request Body:**
```json
{
  "sessionId": "ses_01928471a",
  "utr": "429182736451"
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "sessionId": "ses_01928471a",
    "status": "PENDING_MERCHANT_APPROVAL",
    "message": "UTR logged successfully. Waiting for merchant verification or observer sync."
  }
}
```

---

## 3. Observer Android Node Endpoints

### 3.1 Push Intercepted Bank SMS / Alert (Mode B)
Called by the Android Observer APK immediately upon intercepting a bank SMS or notification.

* **Endpoint:** `POST /api/v1/observer/push`
* **Required Headers:**
  * `X-Observer-Device-Id`: Device UUID registered in dashboard.
  * `X-Observer-Timestamp`: Milliseconds epoch.
  * `X-Observer-Signature`: `HMAC_SHA256(secretKey, rawBody + "." + timestamp)`
* **Request Body:**
```json
{
  "rawText": "Dear Customer, INR 2,000.14 credited to Axis Bank A/c ...123 on 19-10-2026 18:30:12 by UPI/429182736451/ROHIT VERMA.",
  "sender": "AXISBK",
  "channel": "CELLULAR_SMS",
  "receivedAt": 1729348200000
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "matched": true,
    "transactionId": "txn_87123fa",
    "sessionId": "ses_01928471a",
    "parsedAmountPaise": 200014,
    "parsedUtr": "429182736451",
    "status": "VERIFIED"
  }
}
```

### 3.2 Observer Device Heartbeat
Pings server every 5 minutes to maintain online status and report battery telemetry.

* **Endpoint:** `POST /api/v1/observer/heartbeat`
* **Request Body:**
```json
{
  "batteryPercentage": 87,
  "isCharging": true,
  "smsPermissionGranted": true,
  "notificationPermissionGranted": true,
  "appVersion": "1.0.4"
}
```

---

## 4. Merchant Dashboard Endpoints

### 4.1 Create Reusable Limit QR Campaign
* **Endpoint:** `POST /api/v1/campaigns`
* **Authorization:** `Bearer sk_live_...`
* **Request Body:**
```json
{
  "title": "Design Systems Bootcamp Cohort 4",
  "slug": "design-cohort-4",
  "description": "Live 4-week cohort for product designers.",
  "amountPaise": 249900,
  "isFixedAmount": true,
  "totalCapPaise": 10000000,
  "maxSlots": 40,
  "expiresAt": "2026-11-01T23:59:59.000Z",
  "enableMicroPaise": true
}
```

### 4.2 1-Tap Manual Transaction Approval (Mode A)
* **Endpoint:** `POST /api/v1/transactions/:transactionId/approve`
* **Authorization:** `Bearer sk_live_...`
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_87123fa",
    "status": "VERIFIED",
    "approvedAt": "2026-10-19T14:48:00.000Z",
    "campaignSlotsRemaining": 6
  }
}
```

---

## 5. Universal Embed SDK (`quickupi.js`)

Merchants embed the checkout modal on any HTML or React webpage by including a single script:

### 5.1 Declarative HTML Integration
```html
<!-- Include QuickUPI script -->
<script src="https://quickupi.in/quickupi.js" data-merchant-key="pk_live_8912384"></script>

<!-- Add Pay Button -->
<button 
  data-quickupi-pay 
  data-campaign="design-cohort-4" 
  data-amount="2499" 
  data-name="Design Systems Bootcamp"
  class="btn-enroll">
  Pay ₹2,499 (0% Fee UPI)
</button>
```

### 5.2 Programmatic JavaScript Integration
```javascript
import { QuickUPI } from '@quickupi/sdk'; // Or window.QuickUPI

const checkout = new QuickUPI({
  publishableKey: 'pk_live_8912384'
});

checkout.open({
  campaign: 'design-cohort-4',
  amount: 2499,
  payer: {
    name: 'Rohit Verma',
    phone: '+919876543210',
    email: 'rohit@example.com'
  },
  onSuccess: (receipt) => {
    console.log('Payment Successful!', receipt.utr, receipt.transactionId);
    window.location.href = `/thank-you?txn=${receipt.transactionId}`;
  },
  onDismiss: () => {
    console.log('Customer closed checkout modal without paying');
  },
  onError: (error) => {
    alert(`Payment failed: ${error.message}`);
  }
});
```

### 5.3 SDK Architecture & postMessage Protocol
The SDK opens a responsive, zero-margin sandbox modal:
```
[Host Page (Merchant Store)]
       │
       ▼ (Creates sandboxed iframe)
[Iframe: https://quickupi.in/checkout/modal?ses=...]
       │
       ├── window.parent.postMessage({ type: 'QUICKUPI_INIT_SUCCESS' }, '*')
       ├── window.parent.postMessage({ type: 'QUICKUPI_PAYMENT_VERIFIED', data: { utr, amount } }, '*')
       └── window.parent.postMessage({ type: 'QUICKUPI_MODAL_CLOSED' }, '*')
```
