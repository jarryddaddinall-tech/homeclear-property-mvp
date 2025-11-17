# WhatsApp Parsing Setup & Testing Guide

## Overview

The WhatsApp parsing system extracts transaction information from WhatsApp messages and updates your Firestore transactions. It supports multiple WhatsApp Business API providers.

## Supported Providers

1. **Twilio WhatsApp API** (Recommended)
2. **MessageBird WhatsApp API**
3. **Generic webhook format** (custom integrations)

## Quick Start with Twilio

### 1. Set Up Twilio WhatsApp Sandbox

1. **Sign up for Twilio** (free trial available)
2. **Go to Messaging → Try it out → Send a WhatsApp message**
3. **Join the sandbox** by sending the join code to Twilio's WhatsApp number
4. **Get your webhook URL** after deploying functions:
   ```
   https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/whatsapp
   ```

### 2. Configure Webhook

1. **In Twilio Console → Messaging → Settings → WhatsApp Sandbox Settings**
2. **Set "When a message comes in"** to your webhook URL:
   ```
   https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/whatsapp
   ```
3. **Set HTTP method** to `POST`
4. **Save**

### 3. Deploy Functions

```bash
cd functions
npm install
npm run deploy
```

### 4. Test

Send a WhatsApp message to your Twilio sandbox number with transaction details:

```
Contract pack issued for 123 Maple Street, London, SW1A 1AA. 
Reference: PROP-12345
```

## Quick Start with MessageBird

1. **Sign up for MessageBird**
2. **Create a WhatsApp channel**
3. **Set webhook URL** to your function URL
4. **Configure webhook events** (message.received)
5. **Test** by sending messages

## Testing Locally

### Option 1: Use Test Script

```bash
node functions/test-whatsapp-webhook.js
```

### Option 2: Use curl

```bash
curl -X POST http://localhost:5001/homeclear-d9b78/us-central1/api/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "From": "whatsapp:+447700900123",
    "To": "whatsapp:+447700900456",
    "Body": "Searches ordered for 45 Oak Avenue, Manchester, M1 1AB. Ref: CASE-789",
    "ProfileName": "John Smith",
    "MessageSid": "test-123"
  }'
```

## Sample WhatsApp Messages

### Message 1: Contract Pack
```
Hi! Draft contract pack sent for 123 Maple Street, London, SW1A 1AA. 
Please review. Ref: PROP-12345
```

### Message 2: Searches Ordered
```
Searches ordered today for 45 Oak Avenue, Manchester, M1 1AB.
Expected back in 10-14 days. Ref: CASE-789
```

### Message 3: Mortgage Approved
```
Great news! Mortgage approved for 123 Maple Street, SW1A 1AA.
Offer valid for 6 months. 🎉
```

### Message 4: Exchange Date
```
Exchange confirmed for 15th December! 
123 Maple Street, SW1A 1AA
```

## What Gets Extracted

- ✅ **Property Address** (from message text)
- ✅ **Postcode** (UK format)
- ✅ **Transaction Stage** (detected from keywords)
- ✅ **Sender Role** (Solicitor, Agent, Lender, etc.)
- ✅ **Dates** (completion dates, deadlines)
- ✅ **Reference Numbers** (case refs, transaction IDs)
- ✅ **Media** (images, documents if attached)

## Viewing Results

1. **Check Firestore Console**:
   - `transactions` collection - updated timeline
   - `transaction_whatsapp` collection - stored messages
   - `unmatched_whatsapp` collection - unmatched messages

2. **Check Your App**:
   - Open transaction in app
   - Look for timeline entries with `source: 'whatsapp'`
   - Stage updates automatically if detected

## WhatsApp Business API Requirements

### Twilio Requirements:
- Twilio account (free trial available)
- WhatsApp Business Account (for production)
- Verified phone number
- Webhook URL (HTTPS required)

### MessageBird Requirements:
- MessageBird account
- WhatsApp Business Account
- Channel setup
- Webhook configuration

## Production Setup

### 1. Get WhatsApp Business Account
- Apply through Twilio or MessageBird
- Get approved (can take a few days)
- Verify your business

### 2. Configure Production Number
- Set up your WhatsApp Business number
- Configure webhook URL
- Test with real messages

### 3. Security
- Verify webhook signatures (recommended)
- Use HTTPS only
- Validate sender phone numbers
- Rate limiting

## Troubleshooting

### Messages not being processed
- Check Firebase Functions logs: `firebase functions:log`
- Verify webhook URL is correct
- Check Twilio/MessageBird webhook logs
- Ensure Firestore security rules allow writes

### Messages not matching transactions
- Verify property address/postcode in message
- Check `unmatched_whatsapp` collection
- Manually link messages by updating transaction

### Functions not deploying
- Ensure logged in: `firebase login`
- Check project: `firebase use homeclear-d9b78`
- Verify Node.js version (18+)

## Best Practices

1. **Phone Number Format**: Store phone numbers in consistent format (E.164)
2. **Message Parsing**: Keep messages clear and include property address/postcode
3. **Media Handling**: Download and store media files in Firebase Storage
4. **Error Handling**: Log all unmatched messages for review
5. **Rate Limiting**: Implement rate limiting to prevent abuse

## Next Steps

1. Choose WhatsApp provider (Twilio or MessageBird)
2. Set up sandbox/testing environment
3. Deploy functions: `cd functions && npm run deploy`
4. Configure webhook in provider dashboard
5. Test with sample messages
6. Apply for WhatsApp Business Account for production
7. Monitor Firestore for updates

