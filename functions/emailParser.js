/**
 * Email Parser Module for Cloud Functions
 * Extracts transaction data from email content
 */

// UK property transaction stages mapping
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

// Stage detection keywords
const STAGE_KEYWORDS = {
  'Offer Accepted': ['offer accepted', 'offer agreed', 'under offer', 'subject to contract'],
  'Sale Details Shared': ['memorandum of sale', 'sale details', 'memo of sale', 'sales particulars'],
  'Solicitors Instructed & Compliance': ['solicitors instructed', 'aml', 'id checks', 'client care', 'compliance'],
  'Draft Contract Pack Issued': ['contract pack', 'draft contract', 'title documents', 'protocol forms', 'epc'],
  'Mortgage Application & Valuation': ['mortgage application', 'valuation', 'mortgage submitted', 'survey'],
  'Searches Ordered': ['searches ordered', 'local authority search', 'drainage search', 'environmental search'],
  'Enquiries Raised & Responded': ['enquiries', 'enquiries raised', 'enquiries responded', 'pre-contract enquiries'],
  'Mortgage Offer Issued': ['mortgage offer', 'offer issued', 'mortgage approved', 'lender approved'],
  'Report on Title & Signatures': ['report on title', 'sign contract', 'signatures', 'contract signed', 'tr1'],
  'Exchange of Contracts': ['exchange', 'exchanged', 'contracts exchanged', 'exchange date'],
  'Completion': ['completion', 'completed', 'completion date', 'keys', 'funds transferred'],
  'Post-Completion': ['post completion', 'sdlt', 'stamp duty', 'land registry', 'registration']
}

// Role detection from email addresses and content
const ROLE_KEYWORDS = {
  'Agent': ['estate agent', 'estateagency', 'property', 'lettings', '@estateagents'],
  "Buyer's Solicitor": ['solicitor', 'conveyancing', '@lawfirm', '@solicitors', 'legal'],
  "Seller's Solicitor": ['solicitor', 'conveyancing', '@lawfirm', '@solicitors', 'legal'],
  'Lender': ['mortgage', 'lender', 'bank', '@bank', '@mortgage', 'building society'],
  'Buyer': ['buyer', 'purchaser', 'client'],
  'Seller': ['seller', 'vendor']
}

/**
 * Extract property address from email content
 */
function extractPropertyAddress(text) {
  // UK postcode pattern
  const postcodePattern = /\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/gi
  const postcodes = text.match(postcodePattern)
  
  // UK address patterns
  const addressPatterns = [
    // "123 Street Name, City, Postcode"
    /(\d+\s+[A-Za-z\s]+(?:Street|Road|Lane|Avenue|Drive|Close|Way|Grove|Gardens|Place|Square|Court|Terrace|Crescent|Hill|Park|View|Rise|Walk|Mews|Yard)[^,]*,\s*[A-Za-z\s]+,\s*[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})/gi,
    // "Property Name, Street, City"
    /([A-Za-z\s]+(?:Street|Road|Lane|Avenue|Drive|Close|Way|Grove|Gardens|Place|Square|Court|Terrace|Crescent|Hill|Park|View|Rise|Walk|Mews|Yard)[^,]*,\s*[A-Za-z\s]+)/gi,
  ]
  
  let address = null
  
  // Try to find full address with postcode
  for (const pattern of addressPatterns) {
    const matches = text.match(pattern)
    if (matches && matches.length > 0) {
      address = matches[0].trim()
      break
    }
  }
  
  // If no full address, try to extract from subject line or near postcode
  if (!address && postcodes && postcodes.length > 0) {
    const postcode = postcodes[0]
    const postcodeIndex = text.indexOf(postcode)
    const contextStart = Math.max(0, postcodeIndex - 100)
    const context = text.substring(contextStart, postcodeIndex + postcode.length)
    const addressMatch = context.match(/([A-Za-z0-9\s,]+(?:Street|Road|Lane|Avenue|Drive|Close|Way|Grove|Gardens|Place|Square|Court|Terrace|Crescent|Hill|Park|View|Rise|Walk|Mews|Yard)[^,]*)/i)
    if (addressMatch) {
      address = `${addressMatch[0].trim()}, ${postcode}`
    }
  }
  
  return address
}

/**
 * Extract postcode from text
 */
function extractPostcode(text) {
  const postcodePattern = /\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/gi
  const matches = text.match(postcodePattern)
  return matches ? matches[0].toUpperCase() : null
}

/**
 * Detect transaction stage from email content
 */
function detectStage(subject, body) {
  const combinedText = `${subject} ${body}`.toLowerCase()
  
  // Score each stage based on keyword matches
  const stageScores = {}
  
  for (const [stage, keywords] of Object.entries(STAGE_KEYWORDS)) {
    let score = 0
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi')
      const matches = combinedText.match(regex)
      if (matches) {
        score += matches.length
      }
    }
    if (score > 0) {
      stageScores[stage] = score
    }
  }
  
  // Return stage with highest score
  if (Object.keys(stageScores).length === 0) {
    return null
  }
  
  const sortedStages = Object.entries(stageScores).sort((a, b) => b[1] - a[1])
  return sortedStages[0][0]
}

/**
 * Detect sender role from email address and content
 */
function detectRole(email, name, body) {
  const emailLower = email.toLowerCase()
  const nameLower = (name || '').toLowerCase()
  const bodyLower = body.toLowerCase()
  const combinedText = `${emailLower} ${nameLower} ${bodyLower}`
  
  const roleScores = {}
  
  for (const [role, keywords] of Object.entries(ROLE_KEYWORDS)) {
    let score = 0
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi')
      const matches = combinedText.match(regex)
      if (matches) {
        score += matches.length
      }
    }
    if (score > 0) {
      roleScores[role] = score
    }
  }
  
  if (Object.keys(roleScores).length === 0) {
    return 'Unknown'
  }
  
  const sortedRoles = Object.entries(roleScores).sort((a, b) => b[1] - a[1])
  return sortedRoles[0][0]
}

/**
 * Extract dates from email content
 */
function extractDates(text) {
  const datePatterns = [
    // DD/MM/YYYY or DD-MM-YYYY
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/g,
    // DD Month YYYY
    /\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{2,4})\b/gi,
    // "on [date]" or "by [date]"
    /(?:on|by|date:)\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
  ]
  
  const dates = []
  for (const pattern of datePatterns) {
    const matches = text.match(pattern)
    if (matches) {
      dates.push(...matches.map(m => m.replace(/(?:on|by|date:)\s*/i, '').trim()))
    }
  }
  
  return dates
}

/**
 * Extract reference numbers (transaction IDs, case numbers, etc.)
 */
function extractReferenceNumbers(text) {
  const patterns = [
    // Case references like "REF: ABC123" or "Ref No: 12345"
    /(?:ref|reference|case|file)[\s:]*([A-Z0-9\-]{4,})/gi,
    // Transaction IDs
    /(?:transaction|deal|purchase)[\s:]*([A-Z0-9\-]{6,})/gi,
  ]
  
  const refs = []
  for (const pattern of patterns) {
    const matches = text.match(pattern)
    if (matches) {
      refs.push(...matches.map(m => m.replace(/(?:ref|reference|case|file|transaction|deal|purchase)[\s:]*/i, '').trim()))
    }
  }
  
  return refs
}

/**
 * Parse email content and extract transaction information
 */
function parseEmail(emailData) {
  const {
    from,
    to,
    subject,
    body,
    htmlBody,
    date,
    attachments = []
  } = emailData
  
  // Use HTML body if available, otherwise plain text
  const emailText = htmlBody || body || ''
  
  // Extract sender info
  const senderEmail = typeof from === 'string' ? from : (from?.email || from?.address || '')
  const senderName = typeof from === 'string' ? from.split('<')[0].trim() : (from?.name || '')
  
  // Parse email content
  const propertyAddress = extractPropertyAddress(`${subject} ${emailText}`)
  const postcode = extractPostcode(`${subject} ${emailText}`)
  const stage = detectStage(subject, emailText)
  const role = detectRole(senderEmail, senderName, emailText)
  const dates = extractDates(emailText)
  const references = extractReferenceNumbers(emailText)
  
  // Extract note/summary from email
  let note = subject
  if (emailText) {
    // Try to get first meaningful paragraph
    const paragraphs = emailText.split(/\n\n|\r\n\r\n/).filter(p => p.trim().length > 20)
    if (paragraphs.length > 0) {
      note = paragraphs[0].substring(0, 200).trim()
    }
  }
  
  return {
    sender: {
      email: senderEmail,
      name: senderName,
      role: role
    },
    propertyAddress,
    postcode,
    stage,
    note,
    dates,
    references,
    attachments: attachments.map(att => ({
      filename: att.filename || att.name,
      contentType: att.contentType || att.type,
      size: att.size
    })),
    raw: {
      subject,
      body: emailText.substring(0, 1000), // Store first 1000 chars
      date: date || new Date().toISOString()
    }
  }
}

/**
 * Match parsed email to existing transaction
 */
function matchEmailToTransaction(parsedEmail, transactions) {
  // Try to match by property address
  if (parsedEmail.propertyAddress) {
    const matched = transactions.find(t => {
      const tAddress = (t.propertyAddress || t.address || '').toLowerCase()
      const eAddress = parsedEmail.propertyAddress.toLowerCase()
      return tAddress.includes(eAddress) || eAddress.includes(tAddress)
    })
    if (matched) return matched
  }
  
  // Try to match by postcode
  if (parsedEmail.postcode) {
    const matched = transactions.find(t => {
      const tPostcode = (t.postcode || '').toUpperCase()
      const ePostcode = parsedEmail.postcode.toUpperCase()
      return tPostcode === ePostcode
    })
    if (matched) return matched
  }
  
  // Try to match by reference number
  if (parsedEmail.references && parsedEmail.references.length > 0) {
    for (const ref of parsedEmail.references) {
      const matched = transactions.find(t => {
        const tRef = (t.reference || t.id || '').toString()
        return tRef.includes(ref) || ref.includes(tRef)
      })
      if (matched) return matched
    }
  }
  
  // Try to match by sender email (if they're involved in transaction)
  if (parsedEmail.sender.email) {
    const matched = transactions.find(t => {
      const participants = [
        t.buyerEmail,
        t.sellerEmail,
        t.solicitorEmail,
        t.agentEmail,
        ...(t.participants || []).map(p => p.email)
      ].filter(Boolean)
      return participants.some(email => 
        email.toLowerCase() === parsedEmail.sender.email.toLowerCase()
      )
    })
    if (matched) return matched
  }
  
  return null
}

module.exports = {
  parseEmail,
  matchEmailToTransaction,
  extractPropertyAddress,
  extractPostcode,
  detectStage,
  detectRole,
  extractDates,
  extractReferenceNumbers,
  UK_STAGES,
  STAGE_KEYWORDS
}

