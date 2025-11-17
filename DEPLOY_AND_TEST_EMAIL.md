# Deploy Functions and Test Email - Step by Step

## Step 1: Install Firebase CLI (Run in Your Terminal)

Open your terminal and run:
```bash
sudo npm install -g firebase-tools
```

Enter your password when prompted.

## Step 2: Login to Firebase

```bash
firebase login
```

This will open your browser. Click "Allow" to authenticate.

## Step 3: Initialize Firebase (if not done)

```bash
cd "/Users/uk45043288/Library/Mobile Documents/com~apple~CloudDocs/Startup Apps/Property Apps"
firebase init functions
```

When prompted:
- Use existing project: **Yes**
- Select project: **homeclear-d9b78**
- Language: **JavaScript**
- ESLint: **No** (or Yes if you want)
- Install dependencies: **Yes**

## Step 4: Deploy Functions

```bash
cd functions
npm run deploy
```

This will take a few minutes. You'll see output like:
```
✔  functions[api]: Successful create operation.
Function URL: https://us-central1-homeclear-d9b78.cloudfunctions.net/api
```

**Copy this URL!** You'll need it for email setup.

## Step 5: Set Up Email Service (SendGrid - Easiest)

### Option A: SendGrid (Recommended - Free Tier Available)

1. **Sign up**: Go to https://sendgrid.com and create a free account

2. **Verify your email** (check your inbox)

3. **Go to**: Settings → Inbound Parse (or search "Inbound Parse")

4. **Add Hostname**:
   - Click "Add Host & URL"
   - **Hostname**: `deals.yourdomain.com` (or use a subdomain you own)
   - **POST URL**: `https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/email`
   - **Check**: "POST the raw, full MIME message"
   - Click "Add"

5. **Configure DNS**:
   - SendGrid will show you DNS records to add
   - You need to add an **MX record** to your domain
   - Example:
     ```
     Type: MX
     Host: deals (or @)
     Value: mx.sendgrid.net
     Priority: 10
     ```
   - Add this in your domain's DNS settings (wherever you manage DNS)

6. **Wait for DNS propagation** (can take a few minutes to 24 hours)

### Option B: Use a Test Email Service (Faster for Testing)

For quick testing without DNS setup, you can use:

1. **Mailtrap** (for testing): https://mailtrap.io
2. **Mailgun Sandbox** (free): https://www.mailgun.com

Or test directly with the webhook using curl (see below).

## Step 6: Send a Test Email

Once DNS is configured, send an email to:
```
deals@yourdomain.com
```

**Example test email:**
```
To: deals@yourdomain.com
From: solicitor@lawfirm.co.uk
Subject: Draft Contract Pack - 123 Maple Street, London, SW1A 1AA

Dear Buyer,

Please find attached the draft contract pack for 123 Maple Street, London, SW1A 1AA.

The pack includes title documents and protocol forms.

Reference: PROP-12345

Best regards,
John Smith
Solicitor
```

## Step 7: Where to See the Results

### Option 1: Firebase Console

1. Go to: https://console.firebase.google.com
2. Select project: **homeclear-d9b78**
3. Go to: **Firestore Database**

Check these collections:

- **`transactions`** - Your transactions (check if timeline was updated)
- **`transaction_emails`** - All emails that were processed
- **`unmatched_emails`** - Emails that couldn't be matched to a transaction

### Option 2: Your App

1. Open your HomeClear app
2. Go to a transaction that matches the email (same property address/postcode)
3. Check the timeline - you should see a new entry with `source: 'email'`
4. The stage should update automatically if detected

### Option 3: Firebase Functions Logs

```bash
firebase functions:log
```

This shows all webhook activity and any errors.

## Quick Test Without Email Service

You can test the webhook directly without setting up email:

```bash
cd functions
node test-email-webhook.js --url https://us-central1-homeclear-d9b78.cloudfunctions.net/api/webhook/email
```

Replace the URL with your actual deployed function URL.

## Troubleshooting

### "Function not found" error
- Make sure you deployed: `cd functions && npm run deploy`
- Check the function URL is correct

### "Permission denied" error
- Make sure you're logged in: `firebase login`
- Check you have the right project: `firebase use homeclear-d9b78`

### Email not being received
- Check DNS is configured correctly
- Wait for DNS propagation (can take up to 24 hours)
- Check SendGrid logs: Settings → Inbound Parse → View Logs

### Email received but not processed
- Check Firebase Functions logs: `firebase functions:log`
- Check `unmatched_emails` collection in Firestore
- Verify property address/postcode in email matches a transaction

## Summary

1. ✅ Install Firebase CLI: `sudo npm install -g firebase-tools`
2. ✅ Login: `firebase login`
3. ✅ Deploy: `cd functions && npm run deploy`
4. ✅ Set up SendGrid (or other email service)
5. ✅ Configure DNS
6. ✅ Send test email to `deals@yourdomain.com`
7. ✅ Check Firestore Console or your app for results

Need help with any step? Let me know!

