import React, { useMemo, useState, useEffect } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, Stack, TextField, Chip, IconButton, Stepper, Step, StepLabel, Divider, Checkbox, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { properties as seedProperties } from '../../data/sampleData'
import { ArrowForward, Add, UploadFile, MoreVert, Share as ShareIcon, Download } from '@mui/icons-material'

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

// Stage information with subtasks and plain language descriptions
const STAGE_INFO = {
  'Offer Accepted': {
    description: "Your offer has been accepted! The property is now 'under offer' and the legal process begins.",
    subtasks: [
      { id: 'oa-1', label: 'Buyer and seller agree on price', who: 'B' },
      { id: 'oa-2', label: 'Estate agent confirms acceptance', who: 'A' },
    ],
    roles: ['Buyer', 'Seller', 'Agent']
  },
  'Sale Details Shared': {
    description: "Everyone gets a document confirming the agreed price and who's involved.",
    subtasks: [
      { id: 'sds-1', label: 'Agent sends Memorandum of Sale to all parties', who: 'A' },
      { id: 'sds-2', label: 'Confirms buyer, seller, property details', who: 'A' },
    ],
    roles: ['Agent']
  },
  'Solicitors Instructed & Compliance': {
    description: "Both sides choose their solicitors. You'll also need to prove your identity and source of funds for legal checks.",
    subtasks: [
      { id: 'sol-1', label: 'Buyer appoints solicitor', who: 'B' },
      { id: 'sol-2', label: 'Seller appoints solicitor', who: 'S' },
      { id: 'sol-3', label: 'Buyer completes AML and ID checks', who: 'B' },
      { id: 'sol-4', label: 'Seller completes ID verification', who: 'S' },
    ],
    roles: ['Buyer', 'Seller', 'Solicitors']
  },
  'Draft Contract Pack Issued': {
    description: "The seller's solicitor sends the first set of legal papers about the property.",
    subtasks: [
      { id: 'pack-1', label: 'Seller\'s solicitor sends draft contract and title documents', who: 'SL' },
      { id: 'pack-2', label: 'Includes property info forms and EPC', who: 'SL' },
    ],
    roles: ['Seller\'s Solicitor']
  },
  'Mortgage Application & Valuation': {
    description: "You apply for your mortgage and the bank checks the property's value.",
    subtasks: [
      { id: 'mort-1', label: 'Buyer applies for mortgage', who: 'B' },
      { id: 'mort-2', label: 'Lender arranges valuation', who: 'L' },
    ],
    roles: ['Buyer', 'Lender']
  },
  'Searches Ordered': {
    description: "Your solicitor checks for issues like planning restrictions or flood risk.",
    subtasks: [
      { id: 'search-1', label: 'Local authority, drainage, environmental searches ordered', who: 'BL' },
      { id: 'search-2', label: 'Results sent to buyer\'s solicitor', who: 'BL' },
    ],
    roles: ['Buyer\'s Solicitor']
  },
  'Enquiries Raised & Responded': {
    description: "Your solicitor asks questions about the property and gets answers.",
    subtasks: [
      { id: 'enq-1', label: 'Buyer\'s solicitor asks questions about the property', who: 'BL' },
      { id: 'enq-2', label: 'Seller\'s solicitor responds', who: 'SL' },
    ],
    roles: ['Buyer\'s Solicitor', 'Seller\'s Solicitor']
  },
  'Mortgage Offer Issued': {
    description: "Your mortgage is officially approved and ready.",
    subtasks: [
      { id: 'mo-1', label: 'Lender approves mortgage', who: 'L' },
      { id: 'mo-2', label: 'Offer sent to buyer and solicitor', who: 'L' },
    ],
    roles: ['Buyer', 'Lender']
  },
  'Report on Title & Signatures': {
    description: "Your solicitor checks everything is safe and you sign the paperwork.",
    subtasks: [
      { id: 'rot-1', label: 'Buyer\'s solicitor explains legal findings', who: 'BL' },
      { id: 'rot-2', label: 'Buyer signs contract and transfer deed', who: 'B' },
    ],
    roles: ['Buyer', 'Buyer\'s Solicitor']
  },
  'Exchange of Contracts': {
    description: "The deal is now legally binding. You pay your deposit and arrange insurance.",
    subtasks: [
      { id: 'x-1', label: 'Contracts swapped between solicitors', who: 'BL' },
      { id: 'x-2', label: 'Buyer pays deposit', who: 'B' },
      { id: 'x-3', label: 'Buyer arranges buildings insurance', who: 'B' },
    ],
    roles: ['Buyer', 'Seller', 'Solicitors']
  },
  'Completion': {
    description: "You pay the balance and get the keys to your new home!",
    subtasks: [
      { id: 'c-1', label: 'Buyer\'s solicitor sends remaining funds', who: 'BL' },
      { id: 'c-2', label: 'Seller hands over keys', who: 'S' },
      { id: 'c-3', label: 'Buyer collects keys', who: 'B' },
    ],
    roles: ['Buyer', 'Seller', 'Solicitors', 'Agent']
  },
  'Post-Completion': {
    description: "Your solicitor registers you as the new owner and pays any taxes.",
    subtasks: [
      { id: 'pc-1', label: 'Pay Stamp Duty (SDLT)', who: 'BL' },
      { id: 'pc-2', label: 'Register property with Land Registry', who: 'BL' },
    ],
    roles: ['Buyer\'s Solicitor']
  },
}

// Responsible party display map for inline tagging
const RESPONSIBLE_MAP = {
  B: 'Buyer',
  S: 'Seller',
  A: 'Agent',
  BL: "Buyer's Solicitor",
  SL: "Seller's Solicitor",
  L: 'Lender'
}

const defaultTimeline = [
  { id: 1, stage: 'Offer Accepted', by: 'Agent', note: 'Offer agreed subject to contract', ts: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 2, stage: 'Sale Details Shared', by: 'Agent', note: 'Memorandum of Sale sent to all parties', ts: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 3, stage: 'Solicitors Instructed & Compliance', by: 'Buyer', note: 'Solicitor instructed and AML completed', ts: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
]

function roleView(stage, role) {
  const base = {
    summary: '',
    responsibilities: [],
    updates: [],
    nextActions: []
  }
  const s = stage
  switch (role) {
    case 'Buyer':
      if (s === 'Offer Accepted') return {
        ...base,
        summary: 'Offer accepted. Await sale details and instruct your solicitor.',
        responsibilities: ['Choose and instruct solicitor', 'Provide ID/AML docs', 'Submit mortgage application'],
        nextActions: ['Upload proof of ID/address', 'Share solicitor details with agent']
      }
      if (s === 'Searches Ordered (LA/Drainage/Env)') return {
        ...base,
        summary: 'Your solicitor has ordered searches. Wait for results and respond to any enquiries.',
        responsibilities: ['Arrange survey if desired', 'Review enquiries answers with solicitor'],
        nextActions: ['Upload survey report if any']
      }
      if (s === 'Exchange of Contracts') return {
        ...base,
        summary: 'Ready to exchange once funds and signed contract are in place.',
        responsibilities: ['Sign contract & TR1 where applicable', 'Transfer deposit funds'],
        nextActions: ['Confirm buildings insurance start date']
      }
      if (s === 'Completion') return {
        ...base,
        summary: 'Funds sent, keys collection arranged via agent.',
        responsibilities: ['Collect keys from agent'],
        nextActions: ['Move-in arrangements']
      }
      return base
    case 'Agent':
      if (s === 'Offer Accepted') return {
        ...base,
        summary: 'Offer agreed; prepare and send sale details to both solicitors.',
        responsibilities: ['Send sale details to both solicitors', 'Chase buyer/seller for solicitor details'],
        nextActions: ['Upload sale details']
      }
      if (s === 'Exchange of Contracts') return {
        ...base,
        summary: 'Await confirmation of exchange; coordinate key release plan.',
        responsibilities: ['Confirm completion logistics and key handover'],
        nextActions: ['Add key collection instructions']
      }
      if (s === 'Completion') return {
        ...base,
        summary: 'Completion day. Release keys once solicitors confirm funds received.',
        responsibilities: ['Confirm funds received with solicitors', 'Release keys to buyer'],
        nextActions: ['Mark transaction as completed']
      }
      return base
    case 'Buyer\'s Solicitor':
      if (s === 'Solicitors Instructed & AML/ID') return {
        ...base,
        summary: 'Engaged and performing buyer onboarding and AML checks.',
        responsibilities: ['Issue client care letter', 'Complete AML/ID', 'Request contract pack from seller side'],
        nextActions: ['Log AML completed']
      }
      if (s === 'Searches Ordered (LA/Drainage/Env)') return {
        ...base,
        summary: 'Order searches and raise initial enquiries on draft pack.',
        responsibilities: ['Order local authority, drainage/water, environmental searches', 'Raise enquiries'],
        nextActions: ['Upload enquiries list']
      }
      if (s === 'Report on Title & Signatures') return {
        ...base,
        summary: 'Prepare report on title for buyer and obtain signed documents.',
        responsibilities: ['Send report on title', 'Obtain signed contract and TR1', 'Collect deposit'],
        nextActions: ['Confirm readiness to exchange']
      }
      if (s === 'Post-Completion (SDLT/Land Registry)') return {
        ...base,
        summary: 'File SDLT and register title at HM Land Registry.',
        responsibilities: ['Submit SDLT return and payment', 'Register title with HMLR'],
        nextActions: ['Upload submission receipts']
      }
      return base
    case 'Seller\'s Solicitor':
      if (s === 'Solicitors Instructed & AML/ID') return {
        ...base,
        summary: 'Engaged and performing seller onboarding and AML checks.',
        responsibilities: ['Issue client care letter', 'Complete AML/ID', 'Prepare contract pack'],
        nextActions: ['Log AML completed']
      }
      if (s === 'Draft Contract Pack Issued') return {
        ...base,
        summary: 'Prepare and issue contract pack to buyer\'s solicitor.',
        responsibilities: ['Collate title documents', 'Complete TA forms', 'Issue contract pack'],
        nextActions: ['Upload contract pack']
      }
      if (s === 'Enquiries Raised & Responded') return {
        ...base,
        summary: 'Respond to buyer\'s solicitor enquiries.',
        responsibilities: ['Review enquiries', 'Gather required information', 'Provide responses'],
        nextActions: ['Upload enquiry responses']
      }
      if (s === 'Report on Title & Signatures') return {
        ...base,
        summary: 'Obtain signed documents from seller.',
        responsibilities: ['Obtain signed contract and TR1 from seller', 'Prepare for exchange'],
        nextActions: ['Confirm seller documents ready']
      }
      if (s === 'Exchange of Contracts') return {
        ...base,
        summary: 'Exchange contracts and confirm completion.',
        responsibilities: ['Exchange contracts', 'Confirm completion date'],
        nextActions: ['Confirm exchange completed']
      }
      if (s === 'Completion') return {
        ...base,
        summary: 'Complete transaction and transfer ownership.',
        responsibilities: ['Receive completion funds', 'Transfer title', 'Discharge mortgage'],
        nextActions: ['Confirm completion']
      }
      return base
      if (s === 'Searches Ordered (LA/Drainage/Env)') return {
        ...base,
        summary: 'Order searches and raise initial enquiries on draft pack.',
        responsibilities: ['Order local authority, drainage/water, environmental searches', 'Raise enquiries'],
        nextActions: ['Upload enquiries list']
      }
      if (s === 'Report on Title & Signatures') return {
        ...base,
        summary: 'Prepare report on title for buyer and obtain signed documents.',
        responsibilities: ['Send report on title', 'Obtain signed contract and TR1', 'Collect deposit'],
        nextActions: ['Confirm readiness to exchange']
      }
      if (s === 'Post-Completion (SDLT/Land Registry)') return {
        ...base,
        summary: 'File SDLT and register title at HM Land Registry.',
        responsibilities: ['Submit SDLT return and payment', 'Register title with HMLR'],
        nextActions: ['Upload submission receipts']
      }
      return base
    default:
      return base
  }
}

const buyerRequirementsForStage = (stage) => {
  switch (stage) {
    case 'Offer Accepted':
      return [
        { id: 'buyer-instruct-solicitor', label: 'Instruct your solicitor' },
        { id: 'buyer-aip', label: 'Obtain Agreement/Mortgage in Principle' },
        { id: 'buyer-proof-deposit', label: 'Provide proof of deposit / source of funds' },
        { id: 'buyer-id', label: 'Provide ID and proof of address (AML)' },
      ]
    case 'Sale details shared':
      return [
        { id: 'buyer-share-solicitor', label: 'Share solicitor details with agent' },
        { id: 'buyer-share-aip', label: 'Share AIP with agent (optional)' },
      ]
    case 'Solicitors Instructed & AML/ID':
      return [
        { id: 'buyer-complete-aml', label: 'Complete AML/Onboarding with solicitor' },
        { id: 'buyer-provide-id', label: 'Upload ID and address documents' },
      ]
    case 'Draft Contract Pack Issued':
      return [
        { id: 'buyer-review-contract', label: 'Review contract summary with solicitor' },
      ]
    case 'Mortgage Application & Valuation':
      return [
        { id: 'buyer-mortgage-application', label: 'Submit full mortgage application' },
        { id: 'buyer-valuation', label: 'Arrange lender valuation / survey' },
      ]
    case 'Searches Ordered (LA/Drainage/Env)':
      return [
        { id: 'buyer-rcis-survey', label: 'Optional: Commission RICS Home Survey' },
      ]
    case 'Enquiries Raised & Responded':
      return [
        { id: 'buyer-respond-enquiries', label: 'Provide info to help answer enquiries' },
      ]
    case 'Mortgage Offer Issued':
      return [
        { id: 'buyer-review-offer', label: 'Review and accept formal mortgage offer' },
      ]
    case 'Report on Title & Signatures':
      return [
        { id: 'buyer-sign-contract', label: 'Sign contract and TR1 (as required)' },
        { id: 'buyer-buildings-ins', label: 'Set buildings insurance start date' },
        { id: 'buyer-transfer-deposit', label: 'Transfer deposit funds to solicitor' },
      ]
    case 'Exchange of Contracts':
      return [
        { id: 'buyer-confirm-completion', label: 'Confirm agreed completion date' },
      ]
    case 'Completion':
      return [
        { id: 'buyer-keys', label: 'Collect keys from agent' },
      ]
    default:
      return []
  }
}

const agentRequirementsForStage = (stage) => {
  switch (stage) {
    case 'Offer Accepted':
      return [
        { id: 'agent-mos', label: 'Prepare and issue Memorandum of Sale' },
        { id: 'agent-collect-details', label: 'Collect both parties\' solicitor details' },
      ]
    case 'Sale details shared':
      return [
        { id: 'agent-send-pack', label: 'Send property info to buyer & solicitors' },
      ]
    case 'Solicitors Instructed & AML/ID':
      return [
        { id: 'agent-chase-aml', label: 'Chase for AML completion if needed' },
      ]
    case 'Enquiries Raised & Responded':
      return [
        { id: 'agent-coordinate-enquiries', label: 'Coordinate replies with seller side' },
      ]
    case 'Exchange of Contracts':
      return [
        { id: 'agent-keys-plan', label: 'Arrange key handover plan' },
      ]
    case 'Completion':
      return [
        { id: 'agent-release-keys', label: 'Release keys on funds receipt confirmation' },
      ]
    default:
      return []
  }
}

const solicitorRequirementsForStage = (stage) => {
  switch (stage) {
    case 'Solicitors Instructed & AML/ID':
      return [
        { id: 'sol-client-care', label: 'Issue client care letter' },
        { id: 'sol-aml', label: 'Complete AML/ID checks' },
        { id: 'sol-request-pack', label: 'Request draft contract pack' },
      ]
    case 'Draft Contract Pack Issued':
      return [
        { id: 'sol-review-pack', label: 'Review title, protocol forms, EPC' },
        { id: 'sol-initial-enquiries', label: 'Raise initial enquiries' },
      ]
    case 'Searches Ordered (LA/Drainage/Env)':
      return [
        { id: 'sol-order-searches', label: 'Order LA, Drainage/Water, Environmental searches' },
      ]
    case 'Enquiries Raised & Responded':
      return [
        { id: 'sol-chase-replies', label: 'Chase seller\'s solicitor for replies' },
        { id: 'sol-report-issues', label: 'Report material issues to buyer' },
      ]
    case 'Mortgage Offer Issued':
      return [
        { id: 'sol-review-offer', label: 'Review mortgage offer & conditions' },
      ]
    case 'Report on Title & Signatures':
      return [
        { id: 'sol-report-on-title', label: 'Send report on title to buyer' },
        { id: 'sol-get-signed', label: 'Obtain signed contract/TR1; collect deposit' },
      ]
    case 'Exchange of Contracts':
      return [
        { id: 'sol-exchange', label: 'Exchange contracts; confirm completion date' },
      ]
    case 'Completion':
      return [
        { id: 'sol-complete', label: 'Send completion funds; confirm completion' },
      ]
    case 'Post-Completion (SDLT/Land Registry)':
      return [
        { id: 'sol-sdlt', label: 'File SDLT return and payment' },
        { id: 'sol-register', label: 'Register title at HM Land Registry' },
      ]
    default:
      return []
  }
}

const sellerRequirementsForStage = (stage) => {
  switch (stage) {
    case 'Offer Accepted':
      return [
        { id: 'seller-instruct-solicitor', label: 'Instruct your solicitor' },
        { id: 'seller-provide-details', label: 'Provide property details to agent' },
      ]
    case 'Sale details shared':
      return [
        { id: 'seller-confirm-details', label: 'Confirm sale details are correct' },
      ]
    case 'Solicitors Instructed & AML/ID':
      return [
        { id: 'seller-provide-id', label: 'Provide ID and proof of address (AML)' },
      ]
    case 'Draft Contract Pack Issued':
      return [
        { id: 'seller-complete-forms', label: 'Complete property information forms (TA6, TA10, TA7)' },
        { id: 'seller-provide-docs', label: 'Provide warranties, planning/building regs docs' },
        { id: 'seller-review-contract', label: 'Review draft contract with solicitor' },
      ]
    case 'Mortgage Application & Valuation':
      return [
        { id: 'seller-allow-access', label: 'Allow buyer access for valuation/survey' },
      ]
    case 'Searches Ordered (LA/Drainage/Env)':
      return [
        { id: 'seller-cooperate-searches', label: 'Cooperate with any required searches' },
      ]
    case 'Enquiries Raised & Responded':
      return [
        { id: 'seller-answer-enquiries', label: 'Answer solicitor enquiries promptly' },
        { id: 'seller-provide-additional-info', label: 'Provide any additional information requested' },
      ]
    case 'Mortgage Offer Issued':
      return [
        { id: 'seller-await-mortgage', label: 'Await confirmation buyer has mortgage offer' },
      ]
    case 'Report on Title & Signatures':
      return [
        { id: 'seller-sign-contract', label: 'Sign contract and TR1 (seller parts)' },
        { id: 'seller-arrange-move', label: 'Arrange moving out by completion date' },
      ]
    case 'Exchange of Contracts':
      return [
        { id: 'seller-confirm-completion', label: 'Confirm agreed completion date' },
      ]
    case 'Completion':
      return [
        { id: 'seller-handover-keys', label: 'Hand over keys to agent' },
        { id: 'seller-vacate-property', label: 'Ensure property is vacant and clean' },
      ]
    default:
      return []
  }
}

const StageChecklist = ({ title = 'What you need to do next', items, checklist, onToggle }) => {
  if (!items || !items.length) return null
  if (!items.length) return null
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>{title}</Typography>
      <Stack spacing={1}>
        {items.map(item => {
          const isChecked = Boolean(checklist[item.id])
          return (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                bgcolor: 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.02)',
                }
              }}
              onClick={() => onToggle(item.id)}
            >
              <Checkbox
                checked={isChecked}
                onChange={() => onToggle(item.id)}
                sx={{ 
                  mt: -0.5,
                  '& .MuiSvgIcon-root': {
                    fontSize: 20,
                  }
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  flex: 1,
                  fontWeight: isChecked ? 400 : 500,
                  color: isChecked ? 'text.secondary' : 'text.primary',
                  textDecoration: isChecked ? 'line-through' : 'none',
                  opacity: isChecked ? 0.7 : 1,
                  lineHeight: 1.5,
                  pt: 0.5,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}

const RoleSummary = ({ stage, role, updatesForRole, buyerChecklist, onToggleBuyerChecklist, agentChecklist, onToggleAgentChecklist, solicitorChecklist, onToggleSolicitorChecklist }) => {
  const v = useMemo(() => roleView(stage, role), [stage, role])
  const buyerItems = role === 'Buyer' ? buyerRequirementsForStage(stage) : []
  const agentItems = role === 'Agent' ? agentRequirementsForStage(stage) : []
  const solicitorItems = role === 'Solicitor' ? solicitorRequirementsForStage(stage) : []
  const hasContent = Boolean(v.summary) || (buyerItems?.length || agentItems?.length || solicitorItems?.length)
  if (!hasContent) return null
  return (
    <Card sx={{ 
      border: '2px solid', 
      borderColor: 'primary.main', 
      bgcolor: 'rgba(127, 86, 217, 0.04)', 
      elevation: 4,
      borderRadius: 2,
    }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2.5, color: 'text.primary', letterSpacing: '-0.01em' }}>
          What you need to do
        </Typography>
        {v.summary && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            {v.summary}
          </Typography>
        )}
        {role === 'Buyer' && (
          <StageChecklist 
            title="Your action items"
            items={buyerItems} 
            checklist={buyerChecklist} 
            onToggle={onToggleBuyerChecklist} 
          />
        )}
        {role === 'Agent' && (
          <StageChecklist 
            title="Your action items"
            items={agentItems} 
            checklist={agentChecklist} 
            onToggle={onToggleAgentChecklist} 
          />
        )}
        {role === 'Solicitor' && (
          <StageChecklist 
            title="Your action items"
            items={solicitorItems} 
            checklist={solicitorChecklist} 
            onToggle={onToggleSolicitorChecklist} 
          />
        )}
      </CardContent>
    </Card>
  )
}

const StageStepIcon = (props) => {
  const { active, completed, icon, onSelect, stageIndex, completedStageIndex, nextStageIndex } = props
  // icon is 1-based index string from MUI
  const position = Number(icon) - 1
  const isCompleted = position <= completedStageIndex
  const isNext = position === nextStageIndex
  const size = 24
  const baseStyles = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  }
  if (isCompleted) {
    return (
      <Box 
        sx={{ 
          ...baseStyles, 
          bgcolor: 'primary.main', 
          color: 'white', 
          boxShadow: '0 0 0 4px rgba(127,86,217,0.15)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 0 0 6px rgba(127,86,217,0.2)',
          }
        }} 
        onClick={() => onSelect && onSelect(position)}
      >
        ✓
      </Box>
    )
  }
  if (isNext) {
    return (
      <Box 
        sx={{ 
          ...baseStyles, 
          bgcolor: '#fff', 
          color: 'warning.main', 
          border: '2px solid', 
          borderColor: 'warning.main', 
          boxShadow: '0 0 0 4px rgba(245,158,11,0.15)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 0 0 6px rgba(245,158,11,0.2)',
          }
        }} 
        onClick={() => onSelect && onSelect(position)} 
      />
    )
  }
  return (
    <Box 
      sx={{ 
        ...baseStyles, 
        bgcolor: 'white', 
        color: 'text.secondary', 
        border: '1.5px solid', 
        borderColor: 'grey.300',
        '&:hover': {
          borderColor: 'grey.400',
          transform: 'scale(1.05)',
        }
      }} 
      onClick={() => onSelect && onSelect(position)} 
    />
  )
}

const HeadlineTimeline = ({ stageIndex, timeline, property, highlightRole }) => {
  const [expandedStage, setExpandedStage] = React.useState(null)
  const [subtaskCompleted, setSubtaskCompleted] = React.useState({})
  const stageFor = (i) => UK_STAGES[i]
  
  // Get completion date for each stage
  const getStageCompletionDate = (stageIndex) => {
    const stageName = UK_STAGES[stageIndex]
    const stageEntry = timeline.find(t => t.stage === stageName)
    return stageEntry ? new Date(stageEntry.ts).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : null
  }
  
  // Get stage info for expanded view
  const getStageInfo = (stageIndex) => {
    const stageName = UK_STAGES[stageIndex]
    return STAGE_INFO[stageName] || { description: '', subtasks: [], roles: [] }
  }

  const isSubtaskDone = (stageName, subtaskId) => Boolean(subtaskCompleted?.[stageName]?.[subtaskId])
  
  // Check if all subtasks for a stage are completed
  const isStageCompleted = (stageIndex) => {
    const stageName = UK_STAGES[stageIndex]
    const stageInfo = getStageInfo(stageIndex)
    if (!stageInfo.subtasks || stageInfo.subtasks.length === 0) return false
    return stageInfo.subtasks.every(task => isSubtaskDone(stageName, task.id))
  }
  
  // Get the highest completed stage index
  const getCompletedStageIndex = () => {
    for (let i = 0; i < UK_STAGES.length; i++) {
      if (!isStageCompleted(i)) {
        return i - 1
      }
    }
    return UK_STAGES.length - 1
  }
  
  const completedStageIndex = getCompletedStageIndex()
  const nextStageIndex = completedStageIndex + 1
  
  const toggleSubtask = (stageName, subtaskId) => {
    setSubtaskCompleted(prev => ({
      ...prev,
      [stageName]: { ...prev[stageName], [subtaskId]: !Boolean(prev?.[stageName]?.[subtaskId]) }
    }))
  }
  
  return (
    <Box sx={{ py: 4, px: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Stepper 
          activeStep={completedStageIndex + 1} 
          alternativeLabel 
          sx={{
            '& .MuiStepConnector-line': { 
              borderColor: 'grey.200', 
              borderTopWidth: 2,
              transition: 'border-color 0.2s ease',
            },
            '& .MuiStep-root': { 
              px: { xs: 0.5, sm: 1 },
              '&.Mui-completed .MuiStepConnector-line': {
                borderColor: 'primary.main',
              }
            }
          }}
        >
          {UK_STAGES.map((s, i) => (
            <Step key={s}>
              <StepLabel 
                StepIconComponent={(p) => <StageStepIcon {...p} stageIndex={i} completedStageIndex={completedStageIndex} nextStageIndex={nextStageIndex} onSelect={(idx) => setExpandedStage(expandedStage===idx?null:idx)} />}
                sx={{
                  '& .MuiStepLabel-label': {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.75,
                    mt: 1,
                  }
                }}
              >
                <Box sx={{ textAlign: 'center', maxWidth: { xs: 80, sm: 120 } }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: i <= completedStageIndex ? 600 : 500, 
                      color: i <= completedStageIndex ? 'text.primary' : 'text.secondary',
                      fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                      lineHeight: 1.4,
                      display: 'block',
                    }}
                  >
                    {s}
                  </Typography>
                  {i <= completedStageIndex && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        display: 'block', 
                        fontSize: '0.6875rem',
                        mt: 0.25,
                        fontWeight: 400,
                      }}
                    >
                      {getStageCompletionDate(i)}
                    </Typography>
                  )}
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      {expandedStage != null && (
        <>
          <Divider sx={{ my: 3, borderColor: 'grey.200' }} />
          <Box sx={{ 
            p: 3, 
            bgcolor: 'grey.50', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
              {UK_STAGES[expandedStage]}
            </Typography>
            {getStageInfo(expandedStage).description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                {getStageInfo(expandedStage).description}
              </Typography>
            )}
            
            {getStageInfo(expandedStage).subtasks && getStageInfo(expandedStage).subtasks.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
                  Subtasks
                </Typography>
                <Stack spacing={1}>
                  {getStageInfo(expandedStage).subtasks.map((task) => {
                    const stageName = UK_STAGES[expandedStage]
                    const done = isSubtaskDone(stageName, task.id)
                    const isRoleHighlighted = highlightRole && (RESPONSIBLE_MAP[task.who] === highlightRole)
                    return (
                      <Box 
                        key={task.id} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1.5, 
                          cursor: 'pointer', 
                          p: 1.5,
                          bgcolor: isRoleHighlighted ? 'rgba(127, 86, 217, 0.06)' : 'transparent', 
                          borderRadius: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: isRoleHighlighted ? 'rgba(127, 86, 217, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                          }
                        }}
                        onClick={() => toggleSubtask(stageName, task.id)}
                      >
                        <Box 
                          sx={{ 
                            width: 18, 
                            height: 18, 
                            borderRadius: '50%',
                            border: done ? 'none' : '2px solid',
                            borderColor: done ? 'success.main' : 'grey.400',
                            bgcolor: done ? 'success.main' : 'transparent',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: 'white', 
                            fontSize: 11, 
                            fontWeight: 600,
                            flexShrink: 0,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {done ? '✓' : ''}
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            flex: 1, 
                            fontWeight: done ? 500 : 400,
                            color: done ? 'text.secondary' : 'text.primary',
                            textDecoration: done ? 'line-through' : 'none',
                            opacity: done ? 0.7 : 1,
                          }}
                        >
                          {task.label}
                        </Typography>
                        <Chip 
                          label={RESPONSIBLE_MAP[task.who] || task.who} 
                          size="small" 
                          sx={{ 
                            fontSize: '0.6875rem', 
                            height: 22, 
                            bgcolor: 'grey.100', 
                            borderRadius: 2,
                            fontWeight: 500,
                            color: 'text.secondary',
                          }}
                        />
                      </Box>
                    )
                  })}
                </Stack>
              </Box>
            )}

          </Box>
        </>
      )}
    </Box>
)}

const InputPanel = ({ currentUserName, onAdd, timeline }) => {
  const [note, setNote] = useState('')
  const [doc, setDoc] = useState('')
  const initial = (currentUserName || 'U').charAt(0).toUpperCase()

  const submit = () => {
    const value = (note || '').trim()
    if (!value) return
    onAdd({ note: value, doc })
    setNote('')
    setDoc('')
  }

  return (
    <Card sx={{ border: 'none', elevation: 3, borderRadius: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Composer */}
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              bgcolor: 'primary.main', 
              color: '#fff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 600,
              fontSize: '0.9375rem',
              flexShrink: 0,
            }}>
              {initial}
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField 
                fullWidth 
                placeholder={`Write an update…`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                multiline
                minRows={3}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }}}
                InputProps={{
                  sx: {
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'grey.200' },
                    '&:hover fieldset': { borderColor: 'grey.300' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' }
                  }
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '0.9375rem',
                    lineHeight: 1.5,
                  }
                }}
              />
              <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 1.5 }}>
                <Button 
                  variant="outlined" 
                  size="medium" 
                  startIcon={<UploadFile />} 
                  onClick={() => setDoc('Doc.pdf')} 
                  sx={{ 
                    borderColor: 'grey.300', 
                    color: 'text.secondary', 
                    px: 2,
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: 'grey.400',
                      bgcolor: 'rgba(0, 0, 0, 0.02)',
                    }
                  }}
                >
                  Attach
                </Button>
                <Button 
                  variant="contained" 
                  size="medium" 
                  onClick={submit}
                  disabled={!note.trim()}
                  sx={{ 
                    px: 2.5,
                    fontWeight: 600,
                  }}
                >
                  Post
                </Button>
              </Stack>
            </Box>
          </Stack>

          {/* Comments */}
          {timeline.filter(t => t.note).length > 0 && (
            <Stack spacing={2} sx={{ pt: 3, borderTop: '1px solid', borderColor: 'grey.200' }}>
              {timeline.filter(t => t.note).slice().reverse().map(item => (
                <Stack key={item.id} direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: '50%', 
                    bgcolor: 'grey.200', 
                    color: 'text.primary', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}>
                    {String(item.by).charAt(0)}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {item.by}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {new Date(item.ts).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {item.note}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

import { useToast } from '../shared/ToastProvider'
import { useAuth } from '../../contexts/AuthContext'

const TransactionSimulator = ({ role: controlledRole, onRoleChange }) => {
  const [role, setRole] = useState(controlledRole || 'Buyer')
  const [stageIndex, setStageIndex] = useState(3)
  const [timeline, setTimeline] = useState(defaultTimeline)
  const [property] = useState(() => seedProperties?.[0] || { address: '123 Example Street, London', purchasePrice: 500000 })
  const [buyerChecklist, setBuyerChecklist] = useState({})
  const [agentChecklist, setAgentChecklist] = useState({})
  const [solicitorChecklist, setSolicitorChecklist] = useState({})
  const [sellerChecklist, setSellerChecklist] = useState({})

  useEffect(() => {
    if (controlledRole && controlledRole !== role) setRole(controlledRole)
  }, [controlledRole])

  const stage = UK_STAGES[stageIndex]

  const { show } = useToast()
  const { user: authUser } = useAuth()
  const authorName = authUser?.name || authUser?.displayName || authUser?.email || role
  const [highlightRole, setHighlightRole] = useState(null)

  const addUpdate = ({ note, doc }) => {
    setTimeline(prev => [
      ...prev,
      { id: Date.now(), stage, by: authorName, note: note + (doc ? ` (attached: ${doc})` : ''), ts: new Date().toISOString() }
    ])
    show('Update added')
  }

  const proceed = () => {
    if (stageIndex < UK_STAGES.length - 1) setStageIndex(stageIndex + 1)
  }

  const updatesForRole = timeline.filter(t => t.by === role)
  const toggleBuyerChecklist = (id) => { setBuyerChecklist(prev => ({ ...prev, [id]: !prev[id] })); show('Updated') }
  const toggleAgentChecklist = (id) => { setAgentChecklist(prev => ({ ...prev, [id]: !prev[id] })); show('Updated') }
  const toggleSolicitorChecklist = (id) => { setSolicitorChecklist(prev => ({ ...prev, [id]: !prev[id] })); show('Updated') }
  const toggleSellerChecklist = (id) => { setSellerChecklist(prev => ({ ...prev, [id]: !prev[id] })); show('Updated') }

  const roles = ['Buyer','Seller','Agent','Solicitor']

  const requiredByRole = (stage) => ({
    Buyer: buyerRequirementsForStage(stage),
    Seller: sellerRequirementsForStage(stage),
    Agent: agentRequirementsForStage(stage),
    Solicitor: solicitorRequirementsForStage(stage),
  })

  const isItemChecked = (r, id) => {
    const map = { Buyer: buyerChecklist, Seller: sellerChecklist, Agent: agentChecklist, Solicitor: solicitorChecklist }[r]
    return Boolean(map[id])
  }

  const blockers = () => {
    const req = requiredByRole(stage)
    return roles
      .map(r => ({
        role: r,
        pending: (req[r] || []).filter(it => !isItemChecked(r, it.id))
      }))
      .filter(x => x.pending.length > 0)
  }

  const blocking = blockers()

  const ConfidenceRow = () => (
    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
      {['Identity checks ✓','Funds verified ✓','Property checks'].map((label, i) => (
        <Chip key={label} label={label} size="small" sx={{ bgcolor: 'grey.100', height: 24, borderRadius: 1.5 }} />
      ))}
    </Stack>
  )

  const BlockersRow = () => {
    if (!blocking?.length) return null
    return (
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
        {blocking.map(b => (
          <Chip
            key={b.role}
            label={`Waiting for ${b.role.toLowerCase()} (${b.pending.length} item${b.pending.length > 1 ? 's' : ''})`}
            size="small"
            onClick={() => { setHighlightRole(b.role); }}
            sx={{ bgcolor: 'warning.light', color: 'text.primary', height: 22, borderRadius: 1.5, cursor: 'pointer', fontSize: '0.7rem' }}
          />
        ))}
      </Stack>
    )
  }

  const CombinedHeaderAndTimeline = () => {
    const currentStageNumber = stageIndex + 1
    const totalStages = UK_STAGES.length
    const stageInfo = STAGE_INFO[stage] || { description: '' }
    
    // Calculate likely completion date (estimated 8-12 weeks from current stage)
    const weeksRemaining = Math.max(1, totalStages - currentStageNumber) * 1.5
    const completionDate = new Date()
    completionDate.setDate(completionDate.getDate() + (weeksRemaining * 7))
    const formattedDate = completionDate.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
    
    return (
      <Box sx={{ mb: 4 }}>
        {/* Hero Image Section */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 280, sm: 360, md: 420 },
            borderRadius: 2,
            overflow: 'hidden',
            mb: 3,
            boxShadow: '0px 16px 48px rgba(0, 0, 0, 0.12), 0px 4px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Box
            component="img"
            src={property.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop'}
            alt={property.address}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.7) 100%)',
              zIndex: 1,
            }}
          />
          
          {/* Top Right Icons */}
          <Box
            sx={{
              position: 'absolute',
              top: { xs: 16, sm: 20, md: 24 },
              right: { xs: 16, sm: 20, md: 24 },
              zIndex: 3,
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton 
              aria-label="Open live link" 
              onClick={() => { try { const t = (localStorage.getItem('live_token')) || (function(){ const x=Math.random().toString(36).slice(2,10); localStorage.setItem('live_token', x); return x })(); const url = window.location.origin + '/#/live?t=' + t; window.open(url, '_blank', 'noopener'); } catch {} }} 
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              <ShareIcon />
            </IconButton>
            <IconButton 
              aria-label="Download deal pack" 
              onClick={() => { try { const t = (localStorage.getItem('live_token')) || (function(){ const x=Math.random().toString(36).slice(2,10); localStorage.setItem('live_token', x); return x })(); const url = window.location.origin + '/#/live?t=' + t + '&print=1'; window.open(url, '_blank', 'noopener'); } catch {} }}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              <Download />
            </IconButton>
          </Box>

          {/* Content Overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: { xs: 3, sm: 4, md: 5 },
              zIndex: 2,
              color: 'white',
            }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800, 
                letterSpacing: '-0.02em',
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                textShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
                color: 'white',
              }}
            >
              {property.address}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 1.5, 
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  textShadow: '0px 1px 4px rgba(0, 0, 0, 0.3)',
                  color: 'white',
                }}
              >
                Step {currentStageNumber} of {totalStages}: {stage}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500, 
                  mb: 1.5,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                  textShadow: '0px 1px 4px rgba(0, 0, 0, 0.3)',
                  opacity: 0.95,
                  color: 'white',
                }}
              >
                Likely to complete by {formattedDate}
              </Typography>
              {stageInfo.description && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.95, 
                    textShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
                    color: 'white',
                  }}
                >
                  {stageInfo.description}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Timeline Card */}
        <Card sx={{ position: 'relative', zIndex: 2, elevation: 4, borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <HeadlineTimeline stageIndex={stageIndex} timeline={timeline} property={property} highlightRole={highlightRole} />
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 3 }}>
      <CombinedHeaderAndTimeline />
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {/* User chips removed; use avatar dropdown in header to switch roles */}
      </Box>

      {/* Removed 'Waiting on' box per request; timeline and checklists indicate status */}

      <Grid container spacing={3}>
        {/* Timeline moved into the combined card above */}

        {/* Role view below timeline */}
        <Grid size={{ xs: 12, lg: 12 }}>
          <RoleSummary 
            stage={stage} 
            role={role} 
            updatesForRole={updatesForRole} 
            buyerChecklist={buyerChecklist} 
            onToggleBuyerChecklist={toggleBuyerChecklist}
            agentChecklist={agentChecklist}
            onToggleAgentChecklist={toggleAgentChecklist}
            solicitorChecklist={solicitorChecklist}
            onToggleSolicitorChecklist={toggleSolicitorChecklist}
            sellerChecklist={sellerChecklist}
            onToggleSellerChecklist={toggleSellerChecklist}
          />
        </Grid>
        {/* Chat/input moved to bottom full-width */}
        <Grid size={{ xs: 12 }}>
          <InputPanel currentUserName={authorName} onAdd={addUpdate} timeline={timeline} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default TransactionSimulator


