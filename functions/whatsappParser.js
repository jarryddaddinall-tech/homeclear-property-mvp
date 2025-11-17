/**
 * WhatsApp Parser Module for Cloud Functions
 * Extracts transaction data from WhatsApp messages
 */

// UK property transaction stages mapping (same as email)
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

// Stage detection keywords (adapted for WhatsApp casual language)
const STAGE_KEYWORDS = {
  'Offer Accepted': ['offer accepted', 'offer agreed', 'under offer', 'subject to contract', 'offer done'],
  'Sale Details Shared': ['memorandum of sale', 'sale details', 'memo of sale', 'sales particulars', 'memo sent'],
  'Solicitors Instructed & Compliance': ['solicitors instructed', 'aml', 'id checks', 'client care', 'compliance', 'solicitor sorted'],
  'Draft Contract Pack Issued': ['contract pack', 'draft contract', 'title documents', 'protocol forms', 'epc', 'contract sent'],
  'Mortgage Application & Valuation': ['mortgage application', 'valuation', 'mortgage submitted', 'survey', 'mortgage applied'],
  'Searches Ordered': ['searches ordered', 'local authority search', 'drainage search', 'environmental search', 'searches done'],
  'Enquiries Raised & Responded': ['enquiries', 'enquiries raised', 'enquiries responded', 'pre-contract enquiries', 'questions asked'],
  'Mortgage Offer Issued': ['mortgage offer', 'offer issued', 'mortgage approved', 'lender approved', 'mortgage done'],
  'Report on Title & Signatures': ['report on title', 'sign contract', 'signatures', 'contract signed', 'tr1', 'signed'],
  'Exchange of Contracts': ['exchange', 'exchanged', 'contracts exchanged', 'exchange date', 'exchanged!'],
  'Completion': ['completion', 'completed', 'completion date', 'keys', 'funds transferred', 'done!', 'completed!'],
  'Post-Completion': ['post completion', 'sdlt', 'stamp duty', 'land registry', 'registration', 'registered']
}

// Role detection from phone numbers and content
const ROLE_KEYWORDS = {
  'Agent': ['estate agent', 'estateagency', 'property', 'lettings', 'agent'],
  "Buyer's Solicitor": ['solicitor', 'conveyancing', 'lawfirm', 'legal', 'buyer solicitor'],
  "Seller's Solicitor": ['solicitor', 'conveyancing', 'lawfirm', 'legal', 'seller solicitor'],
  'Lender': ['mortgage', 'lender', 'bank', 'building society', 'mortgage broker'],
  'Buyer': ['buyer', 'purchaser', 'client', 'me', 'i'],
  'Seller': ['seller', 'vendor']
}

/**
 * Extract property address from WhatsApp message
 */
function extractPropertyAddress(text) {
  // UK postcode pattern
  const postcodePattern = /\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/gi
  const postcodes = text.match(postcodePattern)
  
  // UK address patterns (more flexible for WhatsApp)
  const addressPatterns = [
    // "123 Street Name, City, Postcode"
    /(\d+\s+[A-Za-z\s]+(?:Street|Road|Lane|Avenue|Drive|Close|Way|Grove|Gardens|Place|Square|Court|Terrace|Crescent|Hill|Park|View|Rise|Walk|Mews|Yard)[^,]*,\s*[A-Za-z\s]+,\s*[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})/gi,
    // "Property Name, Street, City"
    /([A-Za-z\s]+(?:Street|Road|Lane|Avenue|Drive|Close|Way|Grove|Gardens|Place|Square|Court|Terrace|Crescent|Hill|Park|View|Rise|Walk|Mews|Yard)[^,]*,\s*[A-Za-z\s]+)/gi,
    // Just postcode with context
    /([A-Za-z0-9\s,]+)\s*([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})/gi,
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
  
  // If no full address, try to extract from context near postcode
  if (!address && postcodes && postcodes.length > 0) {
    const postcode = postcodes[0]
    const postcodeIndex = text.indexOf(postcode)
    const contextStart = Math.max(0, postcodeIndex - 80) // Shorter context for WhatsApp
    const context = text.substring(contextStart, postcodeIndex + postcode.length)
    const addressMatch = context.match(/([A-Za-z0-9\s,]+(?:Street|Road|Lane|Avenue|Drive|Close|Way|Grove|Gardens|Place|Square|Court|Terrace|Crescent|Hill|Park|View|Rise|Walk|Mews|Yard)[^,]*)/i)
    if (addressMatch) {
      address = `${addressMatch[0].trim()}, ${postcode}`
    } else {
      // Just use postcode if we can't find street
      address = postcode
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
 * Detect transaction stage from WhatsApp message
 */
function detectStage(message) {
  const messageLower = message.toLowerCase()
  
  // Score each stage based on keyword matches
  const stageScores = {}
  
  for (const [stage, keywords] of Object.entries(STAGE_KEYWORDS)) {
    let score = 0
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi')
      const matches = messageLower.match(regex)
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
 * Detect sender role from phone number and message content
 */
function detectRole(phoneNumber, name, message) {
  const phoneLower = (phoneNumber || '').toLowerCase()
  const nameLower = (name || '').toLowerCase()
  const messageLower = message.toLowerCase()
  const combinedText = `${phoneLower} ${nameLower} ${messageLower}`
  
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
 * Extract dates from WhatsApp message
 */
function extractDates(text) {
  const datePatterns = [
    // DD/MM/YYYY or DD-MM-YYYY
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/g,
    // DD Month YYYY
    /\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{2,4})\b/gi,
    // "on [date]" or "by [date]"
    /(?:on|by|date:)\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    // Tomorrow, next week, etc.
    /\b(tomorrow|next week|next month|today)\b/gi,
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
 * Extract reference numbers
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
 * Parse WhatsApp message and extract transaction information
 */
function parseWhatsAppMessage(messageData) {
  const {
    from, // Phone number
    to, // Your WhatsApp Business number
    body, // Message text
    name, // Sender name (if available)
    timestamp,
    mediaUrl, // If message has media (images, documents)
    mediaType
  } = messageData
  
  // Parse message content
  const propertyAddress = extractPropertyAddress(body)
  const postcode = extractPostcode(body)
  const stage = detectStage(body)
  const role = detectRole(from, name, body)
  const dates = extractDates(body)
  const references = extractReferenceNumbers(body)
  
  // Extract note/summary from message (first 200 chars)
  const note = body.substring(0, 200).trim()
  
  return {
    sender: {
      phone: from,
      name: name || 'Unknown',
      role: role
    },
    propertyAddress,
    postcode,
    stage,
    note,
    dates,
    references,
    media: mediaUrl ? {
      url: mediaUrl,
      type: mediaType || 'unknown'
    } : null,
    raw: {
      body,
      timestamp: timestamp || new Date().toISOString(),
      source: 'whatsapp'
    }
  }
}

/**
 * Match parsed WhatsApp message to existing transaction
 */
function matchWhatsAppToTransaction(parsedMessage, transactions) {
  // Try to match by property address
  if (parsedMessage.propertyAddress) {
    const matched = transactions.find(t => {
      const tAddress = (t.propertyAddress || t.address || '').toLowerCase()
      const mAddress = parsedMessage.propertyAddress.toLowerCase()
      return tAddress.includes(mAddress) || mAddress.includes(tAddress)
    })
    if (matched) return matched
  }
  
  // Try to match by postcode
  if (parsedMessage.postcode) {
    const matched = transactions.find(t => {
      const tPostcode = (t.postcode || '').toUpperCase()
      const mPostcode = parsedMessage.postcode.toUpperCase()
      return tPostcode === mPostcode
    })
    if (matched) return matched
  }
  
  // Try to match by reference number
  if (parsedMessage.references && parsedMessage.references.length > 0) {
    for (const ref of parsedMessage.references) {
      const matched = transactions.find(t => {
        const tRef = (t.reference || t.id || '').toString()
        return tRef.includes(ref) || ref.includes(tRef)
      })
      if (matched) return matched
    }
  }
  
  // Try to match by sender phone (if they're involved in transaction)
  if (parsedMessage.sender.phone) {
    const matched = transactions.find(t => {
      const participants = [
        t.buyerPhone,
        t.sellerPhone,
        t.solicitorPhone,
        t.agentPhone,
        ...(t.participants || []).map(p => p.phone)
      ].filter(Boolean)
      return participants.some(phone => 
        phone.replace(/\s+/g, '') === parsedMessage.sender.phone.replace(/\s+/g, '')
      )
    })
    if (matched) return matched
  }
  
  return null
}

module.exports = {
  parseWhatsAppMessage,
  matchWhatsAppToTransaction,
  extractPropertyAddress,
  extractPostcode,
  detectStage,
  detectRole,
  extractDates,
  extractReferenceNumbers,
  UK_STAGES,
  STAGE_KEYWORDS
}

