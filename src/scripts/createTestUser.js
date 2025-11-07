import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBHUTxg3QQRNGU2l7g4JcUrRNwWkxGr8Jw',
  authDomain: 'homeclear-d9b78.firebaseapp.com',
  projectId: 'homeclear-d9b78',
  storageBucket: 'homeclear-d9b78.firebasestorage.app',
  messagingSenderId: '379198477463',
  appId: '1:379198477463:web:cf66a371c5bd84381485d2',
  measurementId: 'G-GF898ND0XR'
}

const TEST_EMAIL = 'mike@test.com'
const TEST_PASSWORD = 'test123' // Firebase requires at least 6 characters

const IDENTITY_ENDPOINT = 'https://identitytoolkit.googleapis.com/v1'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function ensureAuthAccount() {
  const payload = {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    returnSecureToken: true
  }

  const signUpResponse = await fetch(`${IDENTITY_ENDPOINT}/accounts:signUp?key=${firebaseConfig.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const signUpData = await signUpResponse.json()

  if (signUpData.error) {
    if (signUpData.error.message === 'EMAIL_EXISTS') {
      const signInResponse = await fetch(`${IDENTITY_ENDPOINT}/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const signInData = await signInResponse.json()
      if (signInData.error) {
        throw new Error(signInData.error.message)
      }
      return signInData.localId
    }
    throw new Error(signUpData.error.message)
  }

  return signUpData.localId
}

async function ensureFirestoreProfile(uid) {
  const userDocRef = doc(db, 'users', uid)
  await setDoc(userDocRef, {
    displayName: 'Mike Tester',
    email: TEST_EMAIL,
    role: 'Seller',
    onboardingComplete: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true })
}

async function main() {
  try {
    console.log('Ensuring test user exists…')
    const uid = await ensureAuthAccount()
    await ensureFirestoreProfile(uid)
    console.log(`Test user ready → ${TEST_EMAIL} / ${TEST_PASSWORD} (uid: ${uid})`)
  } catch (error) {
    console.error('Failed to create test user:', error.message || error)
    process.exitCode = 1
  }
}

main()

