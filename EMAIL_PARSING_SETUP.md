# Email Parsing Setup & Testing Guide

## Overview

The email parsing system automatically extracts transaction information from emails and updates your Firestore transactions. It supports multiple email service providers and can be tested locally or in production.

## Quick Start Testing

### Option 1: Test Locally with Firebase Emulators

1. **Install Firebase CLI** (if not already installed):
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:
```bash
firebase login
```

3. **Initialize Firebase in your project** (if not done):
```bash
firebase init functions
```

4. **Install dependencies**:
```bash
cd functions
npm install
cd ..
```

5. **Start Firebase Emulators**:
```bash
cd functions
npm run serve
```

This will start the functions emulator at `http://localhost:5001`

6. **Test the webhook** using the test script:
```bash
node functions/test-email-webhook.js
```

Or use curl:
```bash
curl -X POST http://localhost:5001/homeclear-d9b78/us-central1/api/webhook/email \
  -H "Content-Type: application/json" \
  -d @functions/test-email-payload.json
```

### Option 2: Deploy and Test in Production

1. **Deploy Functions**:
```bash
cd functions
npm run deploy
```

2. **Get your webhook URL**:
After deployment, you'll get a URL like:
```
https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/email
```

3. **Test with the deployed endpoint**:
```bash
node functions/test-email-webhook.js --url https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/email
```

## Setting Up Email Services

### Option A: SendGrid Inbound Parse (Recommended)

1. **Sign up for SendGrid** (free tier available)
2. **Go to Settings → Inbound Parse**
3. **Add a new hostname** (e.g., `deals.yourdomain.com`)
4. **Set the POST URL** to your webhook URL:
   ```
   https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/email
   ```
5. **Configure DNS** (MX records) for your domain
6. **Test**: Send an email to `deals@yourdomain.com`

### Option B: Mailgun Routes

1. **Sign up for Mailgun**
2. **Go to Receiving → Routes**
3. **Create a new route**:
   - Match: `deals@yourdomain.com`
   - Action: Forward to `https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/email`
4. **Configure DNS** for your domain
5. **Test**: Send an email to `deals@yourdomain.com`

### Option C: Postmark Inbound

1. **Sign up for Postmark**
2. **Go to Servers → Inbound**
3. **Add inbound address**: `deals@yourdomain.com`
4. **Set webhook URL** to your function URL
5. **Configure DNS**
6. **Test**: Send an email to `deals@yourdomain.com`

## Testing with Sample Emails

### Test Email 1: Contract Pack Issued
```
To: deals@homeclear.app
From: solicitor@lawfirm.co.uk
Subject: Draft Contract Pack - 123 Maple Street, London, SW1A 1AA

Dear Buyer,

Please find attached the draft contract pack for the above property.

The pack includes:
- Title documents
- Protocol forms
- Energy Performance Certificate

Please review and let us know if you have any questions.

Best regards,
Solicitor
```

### Test Email 2: Searches Ordered
```
To: deals@homeclear.app
From: buyer.solicitor@conveyancing.co.uk
Subject: Searches Ordered - Ref: PROP-12345

We have today ordered the following searches for 45 Oak Avenue, Manchester, M1 1AB:

- Local Authority Search
- Drainage and Water Search
- Environmental Search

Results expected within 10-14 working days.

Regards,
Buyer's Solicitor
```

### Test Email 3: Mortgage Offer
```
To: deals@homeclear.app
From: lender@bank.co.uk
Subject: Mortgage Offer Issued - 123 Maple Street

Dear Buyer,

We are pleased to confirm that your mortgage application has been approved.

Property: 123 Maple Street, London, SW1A 1AA
Loan Amount: £350,000
Interest Rate: 4.5%

The offer is valid for 6 months.

Yours sincerely,
Mortgage Department
```

## What Gets Extracted

The parser extracts:
- ✅ **Property Address** (from subject/body)
- ✅ **Postcode** (UK format)
- ✅ **Transaction Stage** (e.g., "Contract Pack Issued", "Searches Ordered")
- ✅ **Sender Role** (Solicitor, Agent, Lender, etc.)
- ✅ **Dates** (completion dates, deadlines)
- ✅ **Reference Numbers** (case refs, transaction IDs)
- ✅ **Email Content** (summary/notes)

## Viewing Results

1. **Check Firestore Console**:
   - Go to Firebase Console → Firestore Database
   - Check `transactions` collection for updated timeline
   - Check `transaction_emails` collection for stored emails
   - Check `unmatched_emails` collection for emails that couldn't be matched

2. **Check Your App**:
   - Open the transaction in your app
   - Look for new timeline entries with `source: 'email'`
   - The stage should update automatically if detected

## Troubleshooting

### Emails not being processed
- Check Firebase Functions logs: `firebase functions:log`
- Verify webhook URL is correct in email service settings
- Check that DNS is properly configured
- Ensure Firestore security rules allow writes

### Emails not matching transactions
- Verify property address/postcode in email matches transaction
- Check `unmatched_emails` collection in Firestore
- Manually link emails by updating transaction with email reference

### Functions not deploying
- Ensure you're logged in: `firebase login`
- Check you have the correct project: `firebase use homeclear-d9b78`
- Verify Node.js version matches (18+)

## Next Steps

1. Set up your email service (SendGrid/Mailgun/Postmark)
2. Configure DNS for your domain
3. Deploy functions: `cd functions && npm run deploy`
4. Test with sample emails
5. Monitor Firestore for updates

