import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

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
const db = getFirestore(app)

// Admin user data
const adminUser = {
  id: 'admin-1',
  name: 'Jarryd Addinall',
  role: 'Admin',
  email: 'jarryddaddinall@gmail.com',
  phone: '+44 7700 900000',
  avatar: 'JA',
  photoURL: '',
  isAdmin: true,
  bankingDetails: {
    accountName: 'Jarryd Addinall',
    sortCode: '00-00-00',
    accountNumber: '00000000',
    bankName: 'Admin Bank'
  },
  address: {
    street: 'Admin Street',
    city: 'London',
    postcode: 'SW1A 1AA',
    country: 'UK'
  },
  createdAt: new Date(),
  updatedAt: new Date()
}

// Function to add admin user
async function addAdminUser() {
  try {
    console.log('Adding admin user...')
    
    await setDoc(doc(db, 'users', adminUser.id), adminUser)
    console.log('Admin user added successfully!')
    console.log('Admin user details:', adminUser)
    
  } catch (error) {
    console.error('Error adding admin user:', error)
  }
}

// Run the function
addAdminUser()
