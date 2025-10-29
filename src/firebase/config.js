import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBHUTxg3QQRNGU2l7g4JcUrRNwWkxGr8Jw",
  authDomain: "homeclear-d9b78.firebaseapp.com",
  projectId: "homeclear-d9b78",
  storageBucket: "homeclear-d9b78.firebasestorage.app",
  messagingSenderId: "379198477463",
  appId: "1:379198477463:web:cf66a371c5bd84381485d2",
  measurementId: "G-GF898ND0XR"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export default app
