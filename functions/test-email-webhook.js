/**
 * Test script for email webhook
 * 
 * Usage:
 *   node test-email-webhook.js
 *   node test-email-webhook.js --url https://your-function-url/webhook/email
 */

const https = require('https')
const http = require('http')

// Get URL from command line or use default
const args = process.argv.slice(2)
const urlArg = args.find(arg => arg.startsWith('--url='))
const customUrl = urlArg ? urlArg.split('=')[1] : null

// Default to local emulator if no URL provided
const webhookUrl = customUrl || 'http://localhost:5001/homeclear-d9b78/us-central1/api/webhook/email'

// Sample email payload (SendGrid format)
const testEmailPayload = {
  from: 'solicitor@lawfirm.co.uk',
  fromname: 'John Smith',
  to: 'deals@homeclear.app',
  subject: 'Draft Contract Pack Issued - 123 Maple Street, London, SW1A 1AA',
  text: `Dear Buyer,

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
  html: `<p>Dear Buyer,</p>
<p>Please find attached the draft contract pack for the above property.</p>
<p>Property Address: 123 Maple Street, London, SW1A 1AA</p>
<p>The pack includes:</p>
<ul>
<li>Title documents</li>
<li>Protocol forms</li>
<li>Energy Performance Certificate</li>
</ul>
<p>Please review and let us know if you have any questions.</p>
<p>Reference: PROP-12345</p>
<p>Best regards,<br>John Smith<br>Solicitor</p>`,
  date: new Date().toISOString()
}

// Alternative: Mailgun format
const testEmailPayloadMailgun = {
  'sender': 'solicitor@lawfirm.co.uk',
  'from': 'John Smith <solicitor@lawfirm.co.uk>',
  'recipient': 'deals@homeclear.app',
  'subject': 'Searches Ordered - 45 Oak Avenue, Manchester, M1 1AB',
  'body-plain': `We have today ordered the following searches:

- Local Authority Search
- Drainage and Water Search
- Environmental Search

Property: 45 Oak Avenue, Manchester, M1 1AB
Reference: CASE-789

Results expected within 10-14 working days.

Regards,
Buyer's Solicitor`,
  'body-html': `<p>We have today ordered the following searches:</p>
<ul>
<li>Local Authority Search</li>
<li>Drainage and Water Search</li>
<li>Environmental Search</li>
</ul>
<p>Property: 45 Oak Avenue, Manchester, M1 1AB<br>
Reference: CASE-789</p>
<p>Results expected within 10-14 working days.</p>
<p>Regards,<br>Buyer's Solicitor</p>`,
  'Date': new Date().toISOString()
}

function sendTestRequest(payload, format = 'sendgrid') {
  return new Promise((resolve, reject) => {
    const url = new URL(webhookUrl)
    const isHttps = url.protocol === 'https:'
    const client = isHttps ? https : http
    
    const postData = JSON.stringify(payload)
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-Email-Format': format
      }
    }
    
    console.log(`\n📧 Sending test email (${format} format)...`)
    console.log(`📍 URL: ${webhookUrl}`)
    console.log(`📝 Subject: ${payload.subject || payload['subject']}`)
    
    const req = client.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        console.log(`\n✅ Response Status: ${res.statusCode}`)
        console.log(`📦 Response Body:`)
        try {
          const json = JSON.parse(data)
          console.log(JSON.stringify(json, null, 2))
        } catch {
          console.log(data)
        }
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, body: data })
        } else {
          reject(new Error(`Request failed with status ${res.statusCode}`))
        }
      })
    })
    
    req.on('error', (error) => {
      console.error(`\n❌ Error: ${error.message}`)
      reject(error)
    })
    
    req.write(postData)
    req.end()
  })
}

// Run tests
async function runTests() {
  console.log('🧪 Email Webhook Test Suite')
  console.log('=' .repeat(50))
  
  try {
    // Test 1: SendGrid format
    await sendTestRequest(testEmailPayload, 'sendgrid')
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Test 2: Mailgun format
    await sendTestRequest(testEmailPayloadMailgun, 'mailgun')
    
    console.log('\n✅ All tests completed!')
    console.log('\n💡 Next steps:')
    console.log('   1. Check Firestore Console for updated transactions')
    console.log('   2. Check transaction_emails collection for stored emails')
    console.log('   3. Check unmatched_emails if email didn\'t match a transaction')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('   - Make sure Firebase emulators are running (npm run serve)')
    console.log('   - Or deploy functions first (npm run deploy)')
    console.log('   - Check the webhook URL is correct')
    process.exit(1)
  }
}

runTests()

