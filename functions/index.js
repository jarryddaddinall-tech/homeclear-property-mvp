/**
 * Firebase Cloud Functions for HomeClear Email Parsing
 * 
 * This handles incoming emails via webhook and updates Firestore transactions
 */

const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const { parseEmail, matchEmailToTransaction } = require('./emailParser')
const { parseWhatsAppMessage, matchWhatsAppToTransaction } = require('./whatsappParser')

// Initialize Firebase Admin
admin.initializeApp()

const app = express()

// Enable CORS
app.use(cors({ origin: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'homeclear-email-parser' })
})

/**
 * Main webhook endpoint for incoming emails
 * Supports multiple email service providers:
 * - SendGrid Inbound Parse
 * - Mailgun Routes
 * - Postmark Inbound
 * - Generic webhook format
 */
app.post('/webhook/email', async (req, res) => {
  try {
    console.log('Received email webhook:', JSON.stringify(req.body, null, 2))
    
    // Parse email data from different providers
    const emailData = parseWebhookData(req.body, req.headers)
    
    if (!emailData) {
      console.error('Invalid email data received')
      return res.status(400).json({ error: 'Invalid email data' })
    }
    
    // Parse email content
    const parsedEmail = parseEmail(emailData)
    console.log('Parsed email:', JSON.stringify(parsedEmail, null, 2))
    
    // Get all transactions from Firestore
    const db = admin.firestore()
    const transactionsSnapshot = await db.collection('transactions').get()
    const transactions = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Match email to transaction
    const matchedTransaction = await matchEmailToTransaction(parsedEmail, transactions)
    
    if (!matchedTransaction) {
      console.log('No matching transaction found. Creating log entry.')
      
      // Log unmatched email for manual review
      await db.collection('unmatched_emails').add({
        ...parsedEmail,
        receivedAt: admin.firestore.FieldValue.serverTimestamp(),
        processed: false
      })
      
      return res.json({
        success: true,
        message: 'Email received but no matching transaction found. Logged for review.',
        parsedEmail
      })
    }
    
    // Update transaction with email data
    const transactionRef = db.collection('transactions').doc(matchedTransaction.id)
    const transactionData = await transactionRef.get()
    const currentData = transactionData.data()
    
    // Create timeline entry
    const timelineEntry = {
      stage: parsedEmail.stage || currentData.currentStage || 'Unknown',
      note: parsedEmail.note || parsedEmail.raw.subject,
      by: parsedEmail.sender.name || parsedEmail.sender.email,
      role: parsedEmail.sender.role,
      ts: parsedEmail.raw.date || new Date().toISOString(),
      source: 'email',
      emailId: emailData.messageId || `email-${Date.now()}`,
      attachments: parsedEmail.attachments
    }
    
    // Update transaction
    const updates = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastEmailUpdate: admin.firestore.FieldValue.serverTimestamp()
    }
    
    // Update current stage if detected
    if (parsedEmail.stage) {
      updates.currentStage = parsedEmail.stage
      
      // Update stage index
      const UK_STAGES = [
        'Offer Accepted',
        'Sale Details Shared',
        'Solicitors Instructed & Compliance',
        'Draft Contract Pack Issued',
        'Mortgage Application & Valuation',
        'Searches Ordered',
        'Enquiries Raised & Responded',
        'Mortgage Offer Issued',
        'Report on Title & Signatures',
        'Exchange of Contracts',
        'Completion',
        'Post-Completion'
      ]
      const stageIndex = UK_STAGES.indexOf(parsedEmail.stage)
      if (stageIndex >= 0) {
        updates.currentStageIndex = stageIndex
      }
    }
    
    // Add timeline entry
    const currentTimeline = currentData.timeline || []
    updates.timeline = [...currentTimeline, timelineEntry]
    
    // Update transaction
    await transactionRef.update(updates)
    
    console.log(`Updated transaction ${matchedTransaction.id} with email data`)
    
    // Store email for reference
    await db.collection('transaction_emails').add({
      transactionId: matchedTransaction.id,
      ...parsedEmail,
      receivedAt: admin.firestore.FieldValue.serverTimestamp()
    })
    
    return res.json({
      success: true,
      message: 'Email processed and transaction updated',
      transactionId: matchedTransaction.id,
      stage: parsedEmail.stage,
      timelineEntry
    })
    
  } catch (error) {
    console.error('Error processing email webhook:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
})

/**
 * Parse webhook data from different email service providers
 */
function parseWebhookData(body, headers) {
  // SendGrid Inbound Parse format
  if (body.from && body.text) {
    return {
      from: {
        email: body.from,
        name: body.fromname || ''
      },
      to: body.to || '',
      subject: body.subject || '',
      body: body.text || '',
      htmlBody: body.html || '',
      date: body.date || new Date().toISOString(),
      attachments: parseAttachments(body.attachments || body.attachmentInfo || [])
    }
  }
  
  // Mailgun format
  if (body['sender'] || body['from']) {
    const from = body['sender'] || body['from']
    return {
      from: {
        email: typeof from === 'string' ? from : (from.email || from.address || ''),
        name: typeof from === 'string' ? '' : (from.name || '')
      },
      to: body['recipient'] || body['to'] || '',
      subject: body['subject'] || '',
      body: body['body-plain'] || body['body'] || '',
      htmlBody: body['body-html'] || '',
      date: body['Date'] || body['date'] || new Date().toISOString(),
      attachments: parseAttachments(body['attachment-count'] ? [] : []) // Mailgun sends attachments separately
    }
  }
  
  // Postmark format
  if (body['From'] || body['FromEmail']) {
    return {
      from: {
        email: body['FromEmail'] || body['From'] || '',
        name: body['FromName'] || ''
      },
      to: body['To'] || body['ToEmail'] || '',
      subject: body['Subject'] || '',
      body: body['TextBody'] || body['Text'] || '',
      htmlBody: body['HtmlBody'] || body['Html'] || '',
      date: body['Date'] || new Date().toISOString(),
      attachments: parseAttachments(body['Attachments'] || [])
    }
  }
  
  // Generic format (try common fields)
  if (body.from || body.sender || body.email) {
    return {
      from: {
        email: body.from || body.sender || body.email || '',
        name: body.fromName || body.senderName || ''
      },
      to: body.to || body.recipient || '',
      subject: body.subject || '',
      body: body.body || body.text || body.message || '',
      htmlBody: body.html || body.htmlBody || '',
      date: body.date || body.timestamp || new Date().toISOString(),
      attachments: parseAttachments(body.attachments || [])
    }
  }
  
  return null
}

/**
 * Parse attachments from various formats
 */
function parseAttachments(attachments) {
  if (!Array.isArray(attachments)) {
    return []
  }
  
  return attachments.map(att => ({
    filename: att.filename || att.name || att['attachment-name'] || 'attachment',
    contentType: att.contentType || att.type || att['content-type'] || 'application/octet-stream',
    size: att.size || att.length || 0
  }))
}

// Export Express app as Cloud Function
exports.api = functions.https.onRequest(app)

/**
 * WhatsApp webhook endpoint
 * Supports:
 * - Twilio WhatsApp API
 * - MessageBird WhatsApp API
 * - Generic webhook format
 */
app.post('/webhook/whatsapp', async (req, res) => {
  try {
    console.log('Received WhatsApp webhook:', JSON.stringify(req.body, null, 2))
    
    // Parse WhatsApp data from different providers
    const whatsappData = parseWhatsAppWebhookData(req.body, req.headers)
    
    if (!whatsappData) {
      console.error('Invalid WhatsApp data received')
      return res.status(400).json({ error: 'Invalid WhatsApp data' })
    }
    
    // Parse WhatsApp message
    const parsedMessage = parseWhatsAppMessage(whatsappData)
    console.log('Parsed WhatsApp message:', JSON.stringify(parsedMessage, null, 2))
    
    // Get all transactions from Firestore
    const db = admin.firestore()
    const transactionsSnapshot = await db.collection('transactions').get()
    const transactions = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Match message to transaction
    const matchedTransaction = await matchWhatsAppToTransaction(parsedMessage, transactions)
    
    if (!matchedTransaction) {
      console.log('No matching transaction found. Creating log entry.')
      
      // Log unmatched message for manual review
      await db.collection('unmatched_whatsapp').add({
        ...parsedMessage,
        receivedAt: admin.firestore.FieldValue.serverTimestamp(),
        processed: false
      })
      
      return res.json({
        success: true,
        message: 'WhatsApp message received but no matching transaction found. Logged for review.',
        parsedMessage
      })
    }
    
    // Update transaction with WhatsApp data
    const transactionRef = db.collection('transactions').doc(matchedTransaction.id)
    const transactionData = await transactionRef.get()
    const currentData = transactionData.data()
    
    // Create timeline entry
    const timelineEntry = {
      stage: parsedMessage.stage || currentData.currentStage || 'Unknown',
      note: parsedMessage.note || parsedMessage.raw.body,
      by: parsedMessage.sender.name || parsedMessage.sender.phone,
      role: parsedMessage.sender.role,
      ts: parsedMessage.raw.timestamp || new Date().toISOString(),
      source: 'whatsapp',
      messageId: whatsappData.messageId || `whatsapp-${Date.now()}`,
      media: parsedMessage.media
    }
    
    // Update transaction
    const updates = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastWhatsAppUpdate: admin.firestore.FieldValue.serverTimestamp()
    }
    
    // Update current stage if detected
    if (parsedMessage.stage) {
      updates.currentStage = parsedMessage.stage
      
      // Update stage index
      const UK_STAGES = [
        'Offer Accepted',
        'Sale Details Shared',
        'Solicitors Instructed & Compliance',
        'Draft Contract Pack Issued',
        'Mortgage Application & Valuation',
        'Searches Ordered',
        'Enquiries Raised & Responded',
        'Mortgage Offer Issued',
        'Report on Title & Signatures',
        'Exchange of Contracts',
        'Completion',
        'Post-Completion'
      ]
      const stageIndex = UK_STAGES.indexOf(parsedMessage.stage)
      if (stageIndex >= 0) {
        updates.currentStageIndex = stageIndex
      }
    }
    
    // Add timeline entry
    const currentTimeline = currentData.timeline || []
    updates.timeline = [...currentTimeline, timelineEntry]
    
    // Update transaction
    await transactionRef.update(updates)
    
    console.log(`Updated transaction ${matchedTransaction.id} with WhatsApp data`)
    
    // Store message for reference
    await db.collection('transaction_whatsapp').add({
      transactionId: matchedTransaction.id,
      ...parsedMessage,
      receivedAt: admin.firestore.FieldValue.serverTimestamp()
    })
    
    return res.json({
      success: true,
      message: 'WhatsApp message processed and transaction updated',
      transactionId: matchedTransaction.id,
      stage: parsedMessage.stage,
      timelineEntry
    })
    
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
})

/**
 * Parse webhook data from different WhatsApp service providers
 */
function parseWhatsAppWebhookData(body, headers) {
  // Twilio WhatsApp format
  if (body['From'] && body['Body']) {
    return {
      from: body['From'].replace('whatsapp:', ''),
      to: body['To'] ? body['To'].replace('whatsapp:', '') : '',
      body: body['Body'] || '',
      name: body['ProfileName'] || '',
      timestamp: body['DateSent'] || new Date().toISOString(),
      messageId: body['MessageSid'] || body['SmsMessageSid'] || '',
      mediaUrl: body['MediaUrl0'] || null,
      mediaType: body['MediaContentType0'] || null
    }
  }
  
  // MessageBird format
  if (body['message'] && body['message']['from']) {
    const msg = body['message']
    return {
      from: msg['from'],
      to: msg['to'] || '',
      body: msg['content']?.text || msg['body'] || '',
      name: msg['contact']?.displayName || '',
      timestamp: msg['timestamp'] || new Date().toISOString(),
      messageId: msg['id'] || '',
      mediaUrl: msg['media']?.url || null,
      mediaType: msg['media']?.contentType || null
    }
  }
  
  // Generic format
  if (body.from || body.phone || body.sender) {
    return {
      from: body.from || body.phone || body.sender || '',
      to: body.to || body.recipient || '',
      body: body.body || body.message || body.text || '',
      name: body.name || body.senderName || '',
      timestamp: body.timestamp || body.date || new Date().toISOString(),
      messageId: body.messageId || body.id || '',
      mediaUrl: body.mediaUrl || body.media?.url || null,
      mediaType: body.mediaType || body.media?.type || null
    }
  }
  
  return null
}

// Alternative: Direct function for testing
exports.processEmail = functions.https.onRequest(async (req, res) => {
  // Same logic as webhook endpoint but as separate function
  return app(req, res)
})

