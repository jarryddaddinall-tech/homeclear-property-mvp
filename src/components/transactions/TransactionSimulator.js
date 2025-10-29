import React, { useMemo, useState, useEffect } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, Stack, TextField, Chip, IconButton, Stepper, Step, StepLabel, Divider, Checkbox, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { properties as seedProperties } from '../../data/sampleData'
import { ArrowForward, Add, UploadFile, MoreVert } from '@mui/icons-material'

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
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
      <List dense sx={{ p: 0 }}>
        {items.map(item => (
          <ListItem key={item.id} disableGutters sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Checkbox
                edge="start"
                checked={Boolean(checklist[item.id])}
                onChange={() => onToggle(item.id)}
              />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={item.label} />
          </ListItem>
        ))}
      </List>
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
    <Card>
      <CardContent>
        {v.summary && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{v.summary}</Typography>
        )}
        {role === 'Buyer' && (
          <StageChecklist 
            title="What you need to do next"
            items={buyerItems} 
            checklist={buyerChecklist} 
            onToggle={onToggleBuyerChecklist} 
          />
        )}
        {role === 'Agent' && (
          <StageChecklist 
            title="Agent tasks for this stage"
            items={agentItems} 
            checklist={agentChecklist} 
            onToggle={onToggleAgentChecklist} 
          />
        )}
        {role === 'Solicitor' && (
          <StageChecklist 
            title="Solicitor tasks for this stage"
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
  const size = 22
  const styles = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer'
  }
  if (isCompleted) {
    return (
      <Box sx={{ ...styles, bgcolor: 'primary.main', color: 'white', boxShadow: '0 0 0 4px rgba(79,70,229,0.12)' }} onClick={() => onSelect && onSelect(position)}>✓</Box>
    )
  }
  if (isNext) {
    return (
      <Box sx={{ ...styles, bgcolor: '#fff', color: 'warning.main', border: '2px solid', borderColor: 'warning.main', boxShadow: '0 0 0 4px rgba(245,158,11,0.12)' }} onClick={() => onSelect && onSelect(position)}>○</Box>
    )
  }
  return (
    <Box sx={{ ...styles, bgcolor: 'white', color: 'text.secondary', border: '1px solid', borderColor: 'grey.300' }} onClick={() => onSelect && onSelect(position)}>○</Box>
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
  <Card>
    <CardContent sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Stepper activeStep={completedStageIndex + 1} alternativeLabel sx={{
          '& .MuiStepConnector-line': { borderColor: 'grey.200', borderTopWidth: 2 },
          '& .MuiStep-root': { px: { xs: 0.5, sm: 1 } }
        }}>
          {UK_STAGES.map((s, i) => (
            <Step key={s}>
              <StepLabel 
                StepIconComponent={(p) => <StageStepIcon {...p} stageIndex={i} completedStageIndex={completedStageIndex} nextStageIndex={nextStageIndex} onSelect={(idx) => setExpandedStage(expandedStage===idx?null:idx)} />}
                sx={{
                  '& .MuiStepLabel-label': {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5
                  }
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {s}
                  </Typography>
                  {i <= completedStageIndex && (
                    <Typography variant="caption" color="success.main" sx={{ display: 'block', fontSize: '0.65rem' }}>
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
          <Divider sx={{ my: 2 }} />
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {UK_STAGES[expandedStage]}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {getStageInfo(expandedStage).description}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Subtasks:
              </Typography>
              <Stack spacing={0.5}>
                {getStageInfo(expandedStage).subtasks.map((task) => {
                  const stageName = UK_STAGES[expandedStage]
                  const done = isSubtaskDone(stageName, task.id)
                  const isRoleHighlighted = highlightRole && (RESPONSIBLE_MAP[task.who] === highlightRole)
                  return (
                    <Box 
                      key={task.id} 
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', bgcolor: isRoleHighlighted ? 'grey.50' : 'transparent', borderRadius: 1 }}
                      onClick={() => toggleSubtask(stageName, task.id)}
                    >
                      <Box 
                        sx={{ 
                          width: 14, height: 14, borderRadius: '50%',
                          border: done ? 'none' : '2px solid',
                          borderColor: done ? 'success.main' : 'grey.400',
                          bgcolor: done ? 'success.main' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: 10, lineHeight: 1
                        }}
                      >
                        {done ? '✓' : ''}
                      </Box>
                      <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
                        {task.label}
                      </Typography>
                      <Chip 
                        label={RESPONSIBLE_MAP[task.who] || task.who} 
                        size="small" 
                        sx={{ fontSize: '0.65rem', height: 20, bgcolor: 'grey.100', borderRadius: 1.5 }}
                      />
                    </Box>
                  )
                })}
              </Stack>
            </Box>

          </Box>
        </>
      )}
    </CardContent>
  </Card>
)}

const InputPanel = ({ currentRole, onAdd, timeline }) => {
  const [note, setNote] = useState('')
  const [doc, setDoc] = useState('')
  return (
    <Card sx={{ border: 'none', boxShadow: '0px 8px 28px rgba(0,0,0,0.06)', borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Add update as {currentRole}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField 
            fullWidth 
            size="medium" 
            placeholder="Add a note or update"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            InputProps={{
              sx: {
                bgcolor: 'background.paper',
                borderRadius: 2,
                '& fieldset': { borderColor: 'grey.200' },
                '&:hover fieldset': { borderColor: 'grey.300' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' }
              }
            }}
          />
          <Button 
            variant="outlined" 
            color="inherit"
            size="medium" 
            startIcon={<UploadFile />} 
            onClick={() => setDoc('Doc.pdf')}
            sx={{ borderColor: 'grey.200', color: 'text.secondary', bgcolor: 'grey.50', '&:hover': { bgcolor: 'grey.100', borderColor: 'grey.300' } }}
          >
            Attach
          </Button>
          <Button 
            variant="contained" 
            size="medium" 
            startIcon={<Add />}
            onClick={() => { if (!note) return; onAdd({ note, doc }); setNote(''); setDoc('') }}
            sx={{ px: 2.5 }}
          >
            Add
          </Button>
        </Stack>
        {/* Shared comment history */}
        <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'grey.100' }}>
          <Stack spacing={1.25}>
            {timeline.filter(t => t.note).slice().reverse().map(item => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Box sx={{ mr: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.by}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.note}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">{new Date(item.ts).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

import { useToast } from '../shared/ToastProvider'

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
  const [highlightRole, setHighlightRole] = useState(null)

  const addUpdate = ({ note, doc }) => {
    setTimeline(prev => [
      ...prev,
      { id: Date.now(), stage, by: role, note: note + (doc ? ` (attached: ${doc})` : ''), ts: new Date().toISOString() }
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
      {['AML checks','Funds verified','Searches'].map((label, i) => (
        <Chip key={label} label={`${label}`} size="small" sx={{ bgcolor: 'grey.100', height: 24, borderRadius: 1.5 }} />
      ))}
    </Stack>
  )

  const BlockersRow = () => {
    if (!blocking?.length) return null
    return (
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        {blocking.map(b => (
          <Chip
            key={b.role}
            label={`${b.role} (${b.pending.length})`}
            size="small"
            onClick={() => { setHighlightRole(b.role); }}
            sx={{ bgcolor: 'grey.100', height: 22, borderRadius: 1.5, cursor: 'pointer' }}
          />
        ))}
      </Stack>
    )
  }

  const ContextBar = () => (
    <Card sx={{ position: 'sticky', top: 0, zIndex: 1, mb: 2, border: 'none', boxShadow: '0 8px 28px rgba(0,0,0,0.06)' }}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ width: 72, height: 72, borderRadius: 2, overflow: 'hidden', flexShrink: 0, bgcolor: 'grey.100' }}>
            <Box
              component="img"
              src={property.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop'}
              alt={property.address}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>{property.address}</Typography>
            <ConfidenceRow />
            <BlockersRow />
          </Box>
          <Chip label={stage} size="small" sx={{ bgcolor: 'primary.main', color: '#fff', borderRadius: 1, px: 1, height: 26 }} />
        </Stack>
      </CardContent>
    </Card>
  )

  return (
    <Box>
      <ContextBar />
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {/* User chips removed; use avatar dropdown in header to switch roles */}
      </Box>

      {/* Removed 'Waiting on' box per request; timeline and checklists indicate status */}

      <Grid container spacing={3}>
        {/* Headline full-width timeline */}
        <Grid size={{ xs: 12 }}>
          <HeadlineTimeline stageIndex={stageIndex} timeline={timeline} property={property} highlightRole={highlightRole} />
        </Grid>

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
          <InputPanel currentRole={role} onAdd={addUpdate} timeline={timeline} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default TransactionSimulator


