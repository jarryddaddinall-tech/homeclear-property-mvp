# Quick Deploy Guide

## 🚀 Deploy in 3 Steps

### Step 1: Install & Login (Run in Terminal)

```bash
# Install Firebase CLI
sudo npm install -g firebase-tools

# Login (will open browser)
firebase login
```

### Step 2: Deploy Functions

```bash
cd "/Users/uk45043288/Library/Mobile Documents/com~apple~CloudDocs/Startup Apps/Property Apps/functions"
npm run deploy
```

**Copy the URL you get!** It will look like:
```
https://us-central1-homeclear-d9b78.cloudfunctions.net/api
```

### Step 3: Test the Webhook

After deployment, test it:

```bash
node test-email-webhook.js --url https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/email
```

---

## 📧 Setting Up Email (After Deployment)

### Option 1: SendGrid (Recommended)

1. Sign up: https://sendgrid.com (free)
2. Go to: Settings → Inbound Parse
3. Add Hostname:
   - Hostname: `deals.yourdomain.com`
   - POST URL: `https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/email`
4. Add DNS MX record (SendGrid will show you how)
5. Send test email to: `deals@yourdomain.com`

### Option 2: Test Without Email Service

You can test directly with the webhook script (no email service needed):

```bash
cd functions
node test-email-webhook.js --url YOUR_DEPLOYED_URL/webhook/email
```

---

## 👀 Where to See Results

### 1. Firebase Console
- Go to: https://console.firebase.google.com
- Project: **homeclear-d9b78**
- Firestore Database → Check:
  - `transactions` - Updated timeline
  - `transaction_emails` - All processed emails
  - `unmatched_emails` - Emails that didn't match

### 2. Your App
- Open a transaction
- Check timeline for entries with `source: 'email'`
- Stage should update automatically

### 3. Functions Logs
```bash
firebase functions:log
```

---

## 🧪 Quick Test Email Format

Send an email like this:

```
To: deals@yourdomain.com
From: solicitor@lawfirm.co.uk
Subject: Draft Contract Pack - 123 Maple Street, London, SW1A 1AA

Dear Buyer,

Please find attached the draft contract pack for 123 Maple Street, London, SW1A 1AA.

Reference: PROP-12345

Best regards,
Solicitor
```

The parser will extract:
- ✅ Property address: 123 Maple Street, London, SW1A 1AA
- ✅ Stage: Draft Contract Pack Issued
- ✅ Sender role: Solicitor
- ✅ Reference: PROP-12345

---

## ❓ Troubleshooting

**Can't deploy?**
- Make sure you're logged in: `firebase login`
- Check you're in the functions directory

**Email not working?**
- Check DNS is configured (can take 24 hours)
- Check SendGrid logs
- Check Firebase Functions logs: `firebase functions:log`

**Need help?** Check `DEPLOY_AND_TEST_EMAIL.md` for detailed instructions.

