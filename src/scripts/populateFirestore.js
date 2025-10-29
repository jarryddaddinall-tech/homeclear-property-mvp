import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore'

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

// Sample users data
const sampleUsers = [
  {
    id: 'user-1',
    name: 'Sarah Johnson',
    role: 'Property Buyer',
    email: 'sarah.j@email.com',
    phone: '+44 7700 900123',
    avatar: 'SJ',
    photoURL: '',
    bankingDetails: {
      accountName: 'Sarah Johnson',
      sortCode: '12-34-56',
      accountNumber: '12345678',
      bankName: 'HSBC'
    },
    address: {
      street: '123 Maple Street',
      city: 'London',
      postcode: 'SW1A 1AA',
      country: 'UK'
    },
    createdAt: new Date()
  },
  {
    id: 'user-2',
    name: 'Michael Chen',
    role: 'Agent',
    email: 'm.chen@estateagents.com',
    phone: '+44 7700 900456',
    avatar: 'MC',
    photoURL: '',
    bankingDetails: {
      accountName: 'Michael Chen',
      sortCode: '23-45-67',
      accountNumber: '23456789',
      bankName: 'Barclays'
    },
    address: {
      street: '456 High Street',
      city: 'Manchester',
      postcode: 'M1 2AB',
      country: 'UK'
    },
    createdAt: new Date()
  },
  {
    id: 'user-3',
    name: 'Emma Williams',
    role: 'Solicitor',
    email: 'e.williams@lawfirm.co.uk',
    phone: '+44 7700 900789',
    avatar: 'EW',
    photoURL: '',
    bankingDetails: {
      accountName: 'Emma Williams',
      sortCode: '34-56-78',
      accountNumber: '34567890',
      bankName: 'Lloyds'
    },
    address: {
      street: '789 Legal Lane',
      city: 'Birmingham',
      postcode: 'B1 3CD',
      country: 'UK'
    },
    createdAt: new Date()
  },
  {
    id: 'user-4',
    name: 'David Thompson',
    role: 'Seller',
    email: 'd.thompson@email.com',
    phone: '+44 7700 900012',
    avatar: 'DT',
    photoURL: '',
    bankingDetails: {
      accountName: 'David Thompson',
      sortCode: '45-67-89',
      accountNumber: '45678901',
      bankName: 'NatWest'
    },
    address: {
      street: '321 Oak Avenue',
      city: 'Leeds',
      postcode: 'LS1 4EF',
      country: 'UK'
    },
    createdAt: new Date()
  },
  {
    id: 'user-5',
    name: 'Lisa Patel',
    role: 'Buyer\'s Solicitor',
    email: 'l.patel@buyerslaw.co.uk',
    phone: '+44 7700 900345',
    avatar: 'LP',
    photoURL: '',
    bankingDetails: {
      accountName: 'Lisa Patel',
      sortCode: '56-78-90',
      accountNumber: '56789012',
      bankName: 'Santander'
    },
    address: {
      street: '654 Solicitor Street',
      city: 'Bristol',
      postcode: 'BS1 5GH',
      country: 'UK'
    },
    createdAt: new Date()
  },
  {
    id: 'user-6',
    name: 'James Wilson',
    role: 'Seller\'s Solicitor',
    email: 'j.wilson@sellerslaw.co.uk',
    phone: '+44 7700 900678',
    avatar: 'JW',
    photoURL: '',
    bankingDetails: {
      accountName: 'James Wilson',
      sortCode: '67-89-01',
      accountNumber: '67890123',
      bankName: 'Halifax'
    },
    address: {
      street: '987 Legal Court',
      city: 'Newcastle',
      postcode: 'NE1 6IJ',
      country: 'UK'
    },
    createdAt: new Date()
  }
]

// Function to populate Firestore
async function populateFirestore() {
  try {
    console.log('Starting to populate Firestore with sample users...')
    
    for (const user of sampleUsers) {
      // Use the user's ID as the document ID
      await setDoc(doc(db, 'users', user.id), user)
      console.log(`Added user: ${user.name} (${user.role})`)
    }
    
    console.log('Successfully populated Firestore with sample users!')
    console.log('You can now see these users in your Firebase Console → Firestore Database')
    
  } catch (error) {
    console.error('Error populating Firestore:', error)
  }
}

// Run the population
populateFirestore()
