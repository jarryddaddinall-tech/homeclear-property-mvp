/**
 * Simple Email Parser Test (No Firebase Required)
 * 
 * This tests the email parsing logic directly without needing Firebase emulators
 * 
 * Usage:
 *   node test-email-parser-simple.js
 */

// Import the email parser (using require for Node.js)
const { parseEmail } = require('./emailParser')

console.log('🧪 Testing Email Parser')
console.log('=' .repeat(50))

// Test Case 1: Contract Pack Email
console.log('\n📧 Test 1: Contract Pack Email')
const email1 = {
  from: {
    email: 'solicitor@lawfirm.co.uk',
    name: 'John Smith'
  },
  to: 'deals@homeclear.app',
  subject: 'Draft Contract Pack Issued - 123 Maple Street, London, SW1A 1AA',
  body: `Dear Buyer,

Please find attached the draft contract pack for the above property.

Property Address: 123 Maple Street, London, SW1A 1AA

The pack includes:
- Title documents
- Protocol forms
- Energy Performance Certificate

Please review and let us know if you have any questions.

Reference: PROP-12345

Best regards,
John Smith
Solicitor`,
  htmlBody: '',
  date: new Date().toISOString(),
  attachments: []
}

const parsed1 = parseEmail(email1)
console.log('✅ Parsed Result:')
console.log(JSON.stringify(parsed1, null, 2))

// Test Case 2: Searches Ordered
console.log('\n📧 Test 2: Searches Ordered Email')
const email2 = {
  from: {
    email: 'buyer.solicitor@conveyancing.co.uk',
    name: 'Sarah Johnson'
  },
  to: 'deals@homeclear.app',
  subject: 'Searches Ordered - Ref: CASE-789',
  body: `We have today ordered the following searches for 45 Oak Avenue, Manchester, M1 1AB:

- Local Authority Search
- Drainage and Water Search
- Environmental Search

Results expected within 10-14 working days.

Regards,
Buyer's Solicitor`,
  htmlBody: '',
  date: new Date().toISOString(),
  attachments: []
}

const parsed2 = parseEmail(email2)
console.log('✅ Parsed Result:')
console.log(JSON.stringify(parsed2, null, 2))

// Test Case 3: Mortgage Offer
console.log('\n📧 Test 3: Mortgage Offer Email')
const email3 = {
  from: {
    email: 'lender@bank.co.uk',
    name: 'Emma Williams'
  },
  to: 'deals@homeclear.app',
  subject: 'Mortgage Offer Issued - 123 Maple Street',
  body: `Dear Buyer,

We are pleased to confirm that your mortgage application has been approved.

Property: 123 Maple Street, London, SW1A 1AA
Loan Amount: £350,000
Interest Rate: 4.5%

The offer is valid for 6 months.

Yours sincerely,
Mortgage Department`,
  htmlBody: '',
  date: new Date().toISOString(),
  attachments: []
}

const parsed3 = parseEmail(email3)
console.log('✅ Parsed Result:')
console.log(JSON.stringify(parsed3, null, 2))

// Summary
console.log('\n📊 Test Summary')
console.log('=' .repeat(50))
console.log(`✅ Test 1 - Stage detected: ${parsed1.stage || 'None'}`)
console.log(`   Address: ${parsed1.propertyAddress || 'None'}`)
console.log(`   Role: ${parsed1.sender.role}`)

console.log(`\n✅ Test 2 - Stage detected: ${parsed2.stage || 'None'}`)
console.log(`   Address: ${parsed2.propertyAddress || 'None'}`)
console.log(`   Role: ${parsed2.sender.role}`)

console.log(`\n✅ Test 3 - Stage detected: ${parsed3.stage || 'None'}`)
console.log(`   Address: ${parsed3.propertyAddress || 'None'}`)
console.log(`   Role: ${parsed3.sender.role}`)

console.log('\n✨ All parsing tests completed!')
console.log('\n💡 Next: To test the full webhook (with Firebase), you need to:')
console.log('   1. Install dependencies: cd functions && npm install')
console.log('   2. Install Firebase CLI: npm install -g firebase-tools')
console.log('   3. Login: firebase login')
console.log('   4. Start emulators: npm run serve')
console.log('   5. Run webhook test: node test-email-webhook.js')

