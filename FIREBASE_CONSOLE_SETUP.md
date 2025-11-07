# Firebase Console Setup for Mobile Authentication

## Critical: Configure OAuth for Mobile

The most common reason Google Sign-In fails on mobile is missing OAuth redirect URI configuration. Follow these steps exactly:

### Step 1: Enable Authentication Providers in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `homeclear-d9b78`
3. Click **Authentication** in the left sidebar
4. Click **Sign-in method** tab
5. Verify these providers are enabled:
   - ✅ **Google** - Should already be enabled
   - ✅ **Email/Password** - Click to enable if not enabled

### Step 2: Check Authorized Domains in Firebase

1. Still in **Authentication** → Click **Settings** tab
2. Scroll to **Authorized domains**
3. Make sure these domains are listed:
   - `localhost` (for development)
   - `homeclear-d9b78.firebaseapp.com` (your Firebase domain)
   - `homeclear-d9b78.web.app` (if using Firebase Hosting)
   - Any custom domain you're using

4. To add a new domain:
   - Click **Add domain**
   - Enter the domain (e.g., `yourdomain.com`)
   - Click **Add**

### Step 3: Configure OAuth in Google Cloud Console (CRITICAL FOR MOBILE)

This is the most important step for fixing mobile authentication:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select the project associated with your Firebase app
3. Click **Navigation menu** (☰) → **APIs & Services** → **Credentials**
4. Find the **OAuth 2.0 Client ID** for web application
   - It should be named something like "Web client (auto created by Google Service)"
5. Click on it to edit
6. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:3000
   https://homeclear-d9b78.firebaseapp.com
   https://homeclear-d9b78.web.app
   ```
   (Add any other domains you're using)

7. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/__/auth/handler
   https://homeclear-d9b78.firebaseapp.com/__/auth/handler
   https://homeclear-d9b78.web.app/__/auth/handler
   ```
   
   **IMPORTANT:** The path `/__/auth/handler` is Firebase's OAuth redirect handler. Without this, mobile authentication will fail!

8. Click **Save**

### Step 4: Verify Configuration

After making changes:
1. Wait 5-10 minutes for changes to propagate
2. Clear your browser cache/cookies
3. Test on mobile device or mobile simulator

## Testing the Setup

### Test on Desktop (localhost)
```bash
npm start
# Navigate to http://localhost:3000
# Try both email and Google sign-in
```

### Test on Mobile (deployed)
```bash
npm run build
firebase deploy --only hosting
# Open the deployed URL on mobile
# Try both email and Google sign-in
```

## Troubleshooting Mobile Issues

### Issue: "redirect_uri_mismatch" error

**Cause:** The redirect URI is not in the authorized list

**Solution:**
1. Check the error message for the actual redirect URI being used
2. Add that exact URI to Google Cloud Console → Credentials → Authorized redirect URIs
3. Common format: `https://your-domain.com/__/auth/handler`

### Issue: "This app isn't verified" warning

**Cause:** App is in development/testing mode

**Solution:**
- This is normal for apps in development
- Click "Advanced" → "Go to [App Name] (unsafe)" to continue
- For production, you'll need to verify your app with Google

### Issue: Redirect happens but user isn't logged in

**Cause:** Local storage or session storage issues

**Solution:**
1. Check if third-party cookies are blocked in browser settings
2. Try in a different mobile browser
3. Clear cache and cookies
4. Check browser console for errors

### Issue: Works on some mobile browsers but not others

**Cause:** Different browsers have different privacy settings

**Solution:**
- Safari: Check Settings → Safari → Prevent Cross-Site Tracking (try disabling)
- Chrome: Check Settings → Privacy → Block third-party cookies (try disabling)
- Firefox: Check Settings → Privacy & Security → Enhanced Tracking Protection

## Firebase Hosting Deployment

To deploy your app with the new authentication fixes:

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Or deploy everything (hosting + functions + firestore rules)
firebase deploy
```

Your app will be available at:
- `https://homeclear-d9b78.web.app`
- `https://homeclear-d9b78.firebaseapp.com`

## Security Checklist

Before going to production:

- [ ] All authorized domains are added in Firebase Console
- [ ] All OAuth redirect URIs are added in Google Cloud Console
- [ ] Email/Password provider is enabled
- [ ] Google provider is enabled
- [ ] Firestore security rules are configured
- [ ] Test authentication on multiple devices
- [ ] Test authentication in different browsers
- [ ] Test both email and Google sign-in methods

## Email/Password User Management

### Creating Admin Users

If you need to create admin users programmatically:

```bash
cd src/scripts
node addAdminUser.js
```

### Resetting Passwords

Users can reset their password through Firebase:
1. You can add a "Forgot Password" link on the login page
2. Implement using Firebase's `sendPasswordResetEmail` function

Example implementation:
```javascript
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from './firebase/config'

const handlePasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    alert('Password reset email sent!')
  } catch (error) {
    alert('Error: ' + error.message)
  }
}
```

## Development vs Production

### Development (localhost)
- Google Sign-In uses popup (faster)
- Email/Password works immediately
- No SSL required

### Production (deployed)
- Google Sign-In uses redirect on mobile (more reliable)
- Google Sign-In uses popup on desktop (better UX)
- SSL/HTTPS required (Firebase Hosting provides this automatically)
- Must have correct OAuth redirect URIs configured

## Quick Reference: OAuth Redirect URIs

For your Firebase project `homeclear-d9b78`, these are the standard redirect URIs:

```
Development:
http://localhost:3000/__/auth/handler

Production:
https://homeclear-d9b78.firebaseapp.com/__/auth/handler
https://homeclear-d9b78.web.app/__/auth/handler

Custom domain (if you have one):
https://yourdomain.com/__/auth/handler
```

**Remember:** Add ALL of these to Google Cloud Console → Credentials → OAuth 2.0 Client ID → Authorized redirect URIs

## Need Help?

If you're still having issues:

1. Check the browser console for error messages
2. Look for Firebase errors in the Network tab
3. Verify your Firebase project ID is correct
4. Make sure you've waited 5-10 minutes after making OAuth changes
5. Try in an incognito/private browsing window (rules out cache issues)

## Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Console](https://console.firebase.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

