# HomeClear iOS Shell

This folder contains the SwiftUI starter app that mirrors the React transaction dashboard. It currently ships with sample data and no backend bindings—wire it up to Firebase to authenticate as `mike@test.com`.

## Configure Firebase

1. Open [Firebase Console](https://console.firebase.google.com/) → **Project Settings**.
2. Under **Your apps**, add a new **iOS** app if one does not already exist.
   - Bundle ID: `com.homeclear.app` (or the bundle identifier used in Xcode).
3. Download the generated `GoogleService-Info.plist`.
4. Drag the file into `HomeClearApp/HomeClearApp/` in Xcode and ensure it’s added to the app target.
5. In Xcode, open `HomeClearApp/HomeClearApp/HomeClearAppApp.swift` and initialize Firebase:

   ```swift
   import SwiftUI
   import FirebaseCore

   @main
   struct HomeClearAppApp: App {
       init() {
           FirebaseApp.configure()
       }

       var body: some Scene {
           WindowGroup {
               ContentView()
           }
       }
   }
   ```

6. Add Firebase dependencies via Swift Package Manager:
   - `https://github.com/firebase/firebase-ios-sdk`
   - Select Authentication and Firestore packages if you plan to mirror the web experience.

## Run the app

```bash
cd ios/HomeClearApp
xed .
```

Select an iOS Simulator in Xcode and press **Run**. The default screen shows a list of placeholder transactions. Replace the mock data in `ContentView.swift` with Firestore fetches once Firebase is configured.


