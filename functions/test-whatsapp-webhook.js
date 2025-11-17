/**
 * Test script for WhatsApp webhook
 * 
 * Usage:
 *   node test-whatsapp-webhook.js
 *   node test-whatsapp-webhook.js --url https://your-function-url/webhook/whatsapp
 */

const https = require('https')
const http = require('http')

// Get URL from command line or use default
const args = process.argv.slice(2)
const urlArg = args.find(arg => arg.startsWith('--url='))
const customUrl = urlArg ? urlArg.split('=')[1] : null

// Default to local emulator if no URL provided
const webhookUrl = customUrl || 'http://localhost:5001/homeclear-d9b78/us-central1/api/webhook/whatsapp'

// Sample WhatsApp payload (Twilio format)
const testWhatsAppPayload = {
  From: 'whatsapp:+447700900123',
  To: 'whatsapp:+447700900456',
  Body: 'Hi! Draft contract pack sent for 123 Maple Street, London, SW1A 1AA. Please review. Ref: PROP-12345',
  ProfileName: 'John Smith',
  MessageSid: 'test-msg-123',
  DateSent: new Date().toISOString()
}

// Alternative: MessageBird format
const testWhatsAppPayloadMessageBird = {
  message: {
    id: 'test-msg-456',
    from: '+447700900123',
    to: '+447700900456',
    content: {
      text: 'Searches ordered today for 45 Oak Avenue, Manchester, M1 1AB. Expected back in 10-14 days. Ref: CASE-789'
    },
    contact: {
      displayName: 'Sarah Johnson'
    },
    timestamp: new Date().toISOString()
  }
}

// Generic format
const testWhatsAppPayloadGeneric = {
  from: '+447700900123',
  to: '+447700900456',
  body: 'Great news! Mortgage approved for 123 Maple Street, SW1A 1AA. Offer valid for 6 months. 🎉',
  name: 'Emma Williams',
  timestamp: new Date().toISOString(),
  messageId: 'test-msg-789'
}

function sendTestRequest(payload, format = 'twilio') {
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
        'X-WhatsApp-Format': format
      }
    }
    
    console.log(`\n📱 Sending test WhatsApp message (${format} format)...`)
    console.log(`📍 URL: ${webhookUrl}`)
    console.log(`📝 Message: ${payload.Body || payload.body || payload.message?.content?.text}`)
    
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
  console.log('🧪 WhatsApp Webhook Test Suite')
  console.log('=' .repeat(50))
  
  try {
    // Test 1: Twilio format
    await sendTestRequest(testWhatsAppPayload, 'twilio')
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Test 2: MessageBird format
    await sendTestRequest(testWhatsAppPayloadMessageBird, 'messagebird')
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Test 3: Generic format
    await sendTestRequest(testWhatsAppPayloadGeneric, 'generic')
    
    console.log('\n✅ All tests completed!')
    console.log('\n💡 Next steps:')
    console.log('   1. Check Firestore Console for updated transactions')
    console.log('   2. Check transaction_whatsapp collection for stored messages')
    console.log('   3. Check unmatched_whatsapp if message didn\'t match a transaction')
    
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

