# Firebase Setup Instructions

## 1. Get Your Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon → Project Settings
4. Scroll down to "Your apps" section
5. Click the web icon `</>` to add a web app
6. Copy the config object

## 2. Update Firebase Config

Replace the placeholder config in `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
}
```

## 3. Enable Google Authentication

1. In Firebase Console → Authentication → Sign-in method
2. Click "Google" provider
3. Toggle "Enable"
4. Add your domain to "Authorized domains"
5. Save

## 4. Test the App

1. Run `npm start`
2. You should see a "Sign in with Google" button
3. Click it to authenticate
4. You'll be redirected to the main app

## Features Added

✅ **Google SSO**: One-click sign in with Google
✅ **Auto-login**: Remembers user between sessions  
✅ **Sign out**: Clean logout functionality
✅ **User profiles**: Firebase user data integrated with your role system
✅ **Secure**: All authentication handled by Google/Firebase

## Notes

- Users get a default "Buyer" role (you can customize this)
- Banking details are empty by default (users can fill in profile)
- The app falls back to sample users if not authenticated
