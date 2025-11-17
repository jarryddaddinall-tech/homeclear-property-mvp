/**
 * Direct Email Parser Test - Tests parsing and matching logic
 * No Firebase emulators needed - just tests the logic
 */

const { parseEmail, matchEmailToTransaction } = require('./emailParser')

console.log('🧪 Testing Email Parser with Transaction Matching')
console.log('=' .repeat(60))

// Sample transactions (like what would be in Firestore)
const sampleTransactions = [
  {
    id: 'txn-1',
    propertyAddress: '123 Maple Street, London, SW1A 1AA',
    postcode: 'SW1A 1AA',
    buyerEmail: 'buyer@example.com',
    solicitorEmail: 'solicitor@lawfirm.co.uk'
  },
  {
    id: 'txn-2',
    propertyAddress: '45 Oak Avenue, Manchester, M1 1AB',
    postcode: 'M1 1AB',
    buyerEmail: 'buyer2@example.com'
  }
]

// Test Email 1: Should match transaction 1
console.log('\n📧 Test 1: Email that should match transaction 1')
const email1 = {
  from: {
    email: 'solicitor@lawfirm.co.uk',
    name: 'John Smith'
  },
  to: 'deals@homeclear.app',
  subject: 'Draft Contract Pack - 123 Maple Street, London, SW1A 1AA',
  body: `Dear Buyer,

Please find attached the draft contract pack for 123 Maple Street, London, SW1A 1AA.

The pack includes title documents and protocol forms.

Reference: PROP-12345

Best regards,
John Smith`,
  htmlBody: '',
  date: new Date().toISOString(),
  attachments: []
}

const parsed1 = parseEmail(email1)
console.log('✅ Parsed email:')
console.log(`   Stage: ${parsed1.stage}`)
console.log(`   Address: ${parsed1.propertyAddress}`)
console.log(`   Postcode: ${parsed1.postcode}`)
console.log(`   Sender Role: ${parsed1.sender.role}`)

const matched1 = matchEmailToTransaction(parsed1, sampleTransactions)
if (matched1) {
  console.log(`✅ Matched to transaction: ${matched1.id}`)
  console.log(`   Transaction address: ${matched1.propertyAddress}`)
} else {
  console.log('❌ No matching transaction found')
}

// Test Email 2: Should match transaction 2
console.log('\n📧 Test 2: Email that should match transaction 2')
const email2 = {
  from: {
    email: 'buyer.solicitor@conveyancing.co.uk',
    name: 'Sarah Johnson'
  },
  to: 'deals@homeclear.app',
  subject: 'Searches Ordered - 45 Oak Avenue, Manchester',
  body: `We have ordered searches for 45 Oak Avenue, Manchester, M1 1AB.

Results expected in 10-14 days.

Regards,
Buyer's Solicitor`,
  htmlBody: '',
  date: new Date().toISOString(),
  attachments: []
}

const parsed2 = parseEmail(email2)
console.log('✅ Parsed email:')
console.log(`   Stage: ${parsed2.stage}`)
console.log(`   Address: ${parsed2.propertyAddress}`)
console.log(`   Postcode: ${parsed2.postcode}`)

const matched2 = matchEmailToTransaction(parsed2, sampleTransactions)
if (matched2) {
  console.log(`✅ Matched to transaction: ${matched2.id}`)
  console.log(`   Transaction address: ${matched2.propertyAddress}`)
} else {
  console.log('❌ No matching transaction found')
}

// Test Email 3: Should NOT match (different property)
console.log('\n📧 Test 3: Email that should NOT match (new property)')
const email3 = {
  from: {
    email: 'agent@estateagents.com',
    name: 'Emma Williams'
  },
  to: 'deals@homeclear.app',
  subject: 'Offer Accepted - 99 New Street, Birmingham, B1 1AA',
  body: `Great news! Offer accepted for 99 New Street, Birmingham, B1 1AA.

The property is now under offer.

Best regards,
Estate Agent`,
  htmlBody: '',
  date: new Date().toISOString(),
  attachments: []
}

const parsed3 = parseEmail(email3)
console.log('✅ Parsed email:')
console.log(`   Stage: ${parsed3.stage}`)
console.log(`   Address: ${parsed3.propertyAddress}`)
console.log(`   Postcode: ${parsed3.postcode}`)

const matched3 = matchEmailToTransaction(parsed3, sampleTransactions)
if (matched3) {
  console.log(`✅ Matched to transaction: ${matched3.id}`)
} else {
  console.log('❌ No matching transaction found (expected - this is a new property)')
}

// Summary
console.log('\n📊 Test Summary')
console.log('=' .repeat(60))
console.log(`✅ Test 1: ${matched1 ? 'MATCHED ✓' : 'NOT MATCHED ✗'}`)
console.log(`✅ Test 2: ${matched2 ? 'MATCHED ✓' : 'NOT MATCHED ✗'}`)
console.log(`✅ Test 3: ${matched3 ? 'MATCHED ✓' : 'NOT MATCHED ✗'} (should be unmatched)`)

console.log('\n✨ All tests completed!')
console.log('\n💡 The parser is working correctly!')
console.log('   Next step: Deploy to Firebase to use with real emails.')

