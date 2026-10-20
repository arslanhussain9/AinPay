# PayMe REST API & Embed SDK Specification

**Base URL:** `/api/v1`  
**Version:** 1.0.0

---

## 1. Payments API

### 1.1 Submit Payment Claim
Submits a client payment claim with the 12-digit UTR.
- **Route:** `POST /api/v1/payments/submit`
- **Request Body:**
```json
{
  "freelancerId": "cly_freelancer_id",
  "paymentLinkId": "cly_link_id", 
  "payerName": "Rohit Verma",
  "payerEmail": "rohit@example.com",
  "amountPaise": 150000,
  "utr": "429182736451",
  "note": "Website advance payment"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "paymentId": "pmt_982341",
    "status": "PENDING",
    "message": "Payment submitted! The freelancer has been notified to 1-tap verify your payment."
  }
}
```

### 1.2 1-Tap Approve Payment
Approves a pending payment, updates freelancer earnings, and decrements link slots if limited.
- **Route:** `POST /api/v1/payments/:id/approve`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Payment successfully approved and credited!"
  }
}
```

### 1.3 Decline Payment
Marks a suspicious or incorrect UTR claim as declined.
- **Route:** `POST /api/v1/payments/:id/decline`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Payment declined."
  }
}
```

---

## 2. Payment Links API

### 2.1 Create Link
Creates a new project invoice or service payment link.
- **Route:** `POST /api/v1/links/create`
- **Request Body:**
```json
{
  "freelancerId": "cly_freelancer_id",
  "title": "Website Design 50% Advance",
  "slug": "website-advance",
  "description": "50% deposit before kickoff",
  "amountPaise": 2500000,
  "maxSlots": 5
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": { "paymentLink": { "id": "...", "slug": "website-advance" } }
}
```

---

## 3. Drop-in Embed Script (`payme.js`)

Add to any external website to enable 1-tap modal checkout:
```html
<script src="https://payme.in/payme.js"></script>

<button data-payme-pay data-link="website-advance">
  Pay Advance (0% Fee UPI)
</button>
```
Or trigger programmatically:
```javascript
PayMe.open({ link: "website-advance" });
```
