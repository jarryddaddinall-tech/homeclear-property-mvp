# How to Test Email Parsing - Step by Step

## ✅ Method 1: Simple Test (No Setup Required) - JUST WORKED!

This tests the parsing logic without needing Firebase:

```bash
cd functions
node test-email-parser-simple.js
```

**What this does:**
- Tests if the parser can extract property addresses, stages, and roles from emails
- Shows you what data gets extracted
- No Firebase setup needed

**Result:** ✅ All 3 test emails parsed successfully!

---

## Method 2: Test Full Webhook (Requires Firebase Setup)

This tests the complete webhook that updates Firestore transactions.

### Step 1: Install Dependencies

```bash
cd functions
npm install
```

### Step 2: Install Firebase CLI (if not installed)

```bash
npm install -g firebase-tools
```

### Step 3: Login to Firebase

```bash
firebase login
```

This will open your browser to authenticate.

### Step 4: Start Firebase Emulators

```bash
npm run serve
```

This starts a local Firebase emulator. You'll see:
```
✔  functions[api]: http function initialized (http://localhost:5001/homeclear-d9b78/us-central1/api).
```

### Step 5: Test the Webhook (in a new terminal)

Keep the emulator running, open a new terminal:

```bash
cd functions
node test-email-webhook.js
```

This sends test emails to your local webhook and shows if transactions get updated.

---

## Method 3: Test with Deployed Functions (Production)

### Step 1: Deploy Functions to Firebase

```bash
cd functions
npm install
npm run deploy
```

You'll get a URL like:
```
https://us-central1-homeclear-d9b78.cloudfunctions.net/api
```

### Step 2: Test with Deployed URL

```bash
node test-email-webhook.js --url https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/email
```

---

## Method 4: Test with Real Email Service

### Option A: SendGrid (Recommended)

1. **Sign up**: https://sendgrid.com (free tier available)

2. **Go to**: Settings → Inbound Parse

3. **Add Hostname**: 
   - Hostname: `deals.yourdomain.com` (or use a subdomain)
   - POST URL: `https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/email`

4. **Configure DNS** (MX records) - SendGrid will give you instructions

5. **Test**: Send an email to `deals@yourdomain.com`

### Option B: Mailgun

1. **Sign up**: https://www.mailgun.com (free tier available)

2. **Go to**: Receiving → Routes

3. **Create Route**:
   - Match: `deals@yourdomain.com`
   - Action: Forward to `https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/email`

4. **Configure DNS** - Mailgun will give you instructions

5. **Test**: Send an email to `deals@yourdomain.com`

---

## What to Check After Testing

### 1. Check Console Output
The test script shows:
- ✅ Response status
- ✅ Parsed email data
- ✅ Transaction ID (if matched)

### 2. Check Firestore (if using webhook)

Go to Firebase Console → Firestore Database:

- **`transactions`** collection - Check if timeline was updated
- **`transaction_emails`** collection - See stored emails
- **`unmatched_emails`** collection - Emails that couldn't be matched

### 3. Check Your App

- Open a transaction in your app
- Look for new timeline entries with `source: 'email'`
- Check if the stage updated automatically

---

## Troubleshooting

### "Cannot find module" error
```bash
cd functions
npm install
```

### "Firebase CLI not found"
```bash
npm install -g firebase-tools
```

### "Permission denied" when deploying
```bash
firebase login
```

### Emulator won't start
Make sure you're in the `functions` directory:
```bash
cd functions
npm run serve
```

### Webhook returns 400 error
- Check that the email payload format matches (SendGrid/Mailgun/Generic)
- Check Firebase Functions logs: `firebase functions:log`

---

## Quick Reference

| Test Type | Command | Setup Required |
|-----------|---------|----------------|
| **Simple Parser Test** | `node test-email-parser-simple.js` | None ✅ |
| **Local Webhook Test** | `node test-email-webhook.js` | Firebase emulators |
| **Deployed Webhook Test** | `node test-email-webhook.js --url YOUR_URL` | Deployed functions |
| **Real Email Test** | Send email to your domain | Email service setup |

---

## Next Steps

1. ✅ **You've already done**: Simple parser test (works!)
2. **Try next**: Set up Firebase emulators and test full webhook
3. **Then**: Deploy functions and test with real email service

Need help with any step? Let me know!

