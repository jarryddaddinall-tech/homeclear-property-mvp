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

// Sample properties data
const properties = [
  {
    id: 'prop-1',
    address: "123 Maple Street, London, SW1A 1AA",
    type: "primary-residence",
    status: "owned",
    tenantStatus: "occupied",
    purchasePrice: 350000,
    currentValue: 420000,
    initialMortgage: 280000,
    currentMortgage: 250000,
    notes: "Family home with garden",
    ownerId: "user-1", // Sarah Johnson
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop",
    city: "London",
    postcode: "SW1A 1AA",
    bedrooms: 3,
    bathrooms: 2,
    size: "1200 sq ft",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prop-2',
    address: "45 Modern Terrace, Manchester, M1 2AB",
    type: "investment",
    status: "for-sale",
    tenantStatus: "vacant",
    purchasePrice: 425000,
    currentValue: 450000,
    initialMortgage: 340000,
    currentMortgage: 320000,
    notes: "Modern apartment in city center",
    ownerId: "user-2", // Michael Chen
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    city: "Manchester",
    postcode: "M1 2AB",
    bedrooms: 2,
    bathrooms: 1,
    size: "800 sq ft",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Sample projects data
const projects = [
  {
    id: 'proj-1',
    title: "Lay Floor in TV Room",
    type: "home-improvement",
    status: "in-progress",
    progress: 75,
    propertyId: "prop-1",
    ownerId: "user-1",
    notes: "Installing hardwood flooring in the TV room. Materials purchased, starting installation this weekend.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'proj-2',
    title: "Paint Riley's Room",
    type: "home-improvement",
    status: "planning",
    progress: 10,
    propertyId: "prop-1",
    ownerId: "user-1",
    notes: "Planning to paint Riley's room with a light blue theme. Need to choose colors and buy supplies.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'proj-3',
    title: "Fix Kitchen Cabinet Door",
    type: "maintenance",
    status: "completed",
    progress: 100,
    propertyId: "prop-1",
    ownerId: "user-1",
    notes: "Fixed loose cabinet door hinge. Quick 30-minute fix.",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Sample transactions data
const transactions = [
  {
    id: 'trans-1',
    propertyId: 'prop-1',
    buyerId: 'user-1', // Sarah Johnson
    sellerId: 'user-4', // David Thompson
    agentId: 'user-2', // Michael Chen
    buyerSolicitorId: 'user-5', // Lisa Patel
    sellerSolicitorId: 'user-6', // James Wilson
    status: 'Offer Accepted',
    currentStage: 1,
    offerPrice: 350000,
    agreedPrice: 350000,
    deposit: 17500,
    completionDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    timeline: [
      {
        id: 'timeline-1',
        stage: 'Offer Accepted',
        description: 'Initial offer made and accepted',
        timestamp: new Date(),
        userId: 'user-1',
        userName: 'Sarah Johnson'
      }
    ]
  }
]

// Function to migrate data to Firestore
async function migrateToFirestore() {
  try {
    console.log('Starting migration to Firestore...')
    
    // Migrate Properties
    console.log('Migrating properties...')
    for (const property of properties) {
      await setDoc(doc(db, 'properties', property.id), property)
      console.log(`Added property: ${property.address}`)
    }
    
    // Migrate Projects
    console.log('Migrating projects...')
    for (const project of projects) {
      await setDoc(doc(db, 'projects', project.id), project)
      console.log(`Added project: ${project.title}`)
    }
    
    // Migrate Transactions
    console.log('Migrating transactions...')
    for (const transaction of transactions) {
      await setDoc(doc(db, 'transactions', transaction.id), transaction)
      console.log(`Added transaction: ${transaction.id}`)
    }
    
    console.log('Successfully migrated all data to Firestore!')
    console.log('Collections created: properties, projects, transactions')
    
  } catch (error) {
    console.error('Error migrating to Firestore:', error)
  }
}

// Run the migration
migrateToFirestore()
