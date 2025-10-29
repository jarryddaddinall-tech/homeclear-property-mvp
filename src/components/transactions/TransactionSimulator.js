import React, { useMemo, useState, useEffect } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, Stack, TextField, Chip, IconButton, Stepper, Step, StepLabel, Divider, Checkbox, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { properties as seedProperties } from '../../data/sampleData'
import { ArrowForward, Add, UploadFile, MoreVert } from '@mui/icons-material'

const UK_STAGES = [
  'Offer Accepted',
  'Memorandum of Sale',
  'Solicitors Instructed & AML/ID',
  'Draft Contract Pack Issued',
  'Mortgage Application & Valuation',
  'Searches Ordered (LA/Drainage/Env)',
  'Enquiries Raised & Responded',
  'Mortgage Offer Issued',
  'Report on Title & Signatures',
  'Exchange of Contracts',
  'Completion',
  'Post-Completion (SDLT/Land Registry)'
]

const defaultTimeline = [
  { id: 1, stage: 'Offer Accepted', by: 'Agent', note: 'Offer agreed subject to contract', ts: new Date().toISOString() },
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
        summary: 'Offer accepted. Await memorandum of sale and instruct your solicitor.',
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
        summary: 'Offer agreed; prepare and issue memorandum of sale.',
        responsibilities: ['Issue memorandum of sale to both solicitors', 'Chase buyer/seller for solicitor details'],
        nextActions: ['Upload memorandum of sale']
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
    case 'Solicitor':
      if (s === 'Solicitors Instructed & AML/ID') return {
        ...base,
        summary: 'Engaged and performing client onboarding and AML checks.',
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
    case 'Memorandum of Sale':
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
    case 'Memorandum of Sale':
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
      ]
    case 'Draft Contract Pack Issued':
      return [
        { id: 'seller-complete-forms', label: 'Complete property information forms (TA6, TA10, TA7 as applicable)' },
        { id: 'seller-provide-docs', label: 'Provide warranties, planning/building regs docs' },
      ]
    case 'Enquiries Raised & Responded':
      return [
        { id: 'seller-answer-enquiries', label: 'Answer solicitor enquiries promptly' },
      ]
    case 'Report on Title & Signatures':
      return [
        { id: 'seller-sign-contract', label: 'Sign contract and TR1 (seller parts)' },
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
  return (
    <Card>
      <CardContent>
        {/* Removed role heading label per request */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{v.summary}</Typography>
        {role === 'Buyer' && (
          <StageChecklist 
            title="What you need to do next"
            items={buyerRequirementsForStage(stage)} 
            checklist={buyerChecklist} 
            onToggle={onToggleBuyerChecklist} 
          />
        )}
        {role === 'Agent' && (
          <StageChecklist 
            title="Agent tasks for this stage"
            items={agentRequirementsForStage(stage)} 
            checklist={agentChecklist} 
            onToggle={onToggleAgentChecklist} 
          />
        )}
        {role === 'Solicitor' && (
          <StageChecklist 
            title="Solicitor tasks for this stage"
            items={solicitorRequirementsForStage(stage)} 
            checklist={solicitorChecklist} 
            onToggle={onToggleSolicitorChecklist} 
          />
        )}
        {/* Responsibilities and updates removed per request; To-Do list will drive tasks */}
        {/* Suggested next actions removed per request; checklist and responsibilities suffice */}
      </CardContent>
    </Card>
  )
}

const StageStepIcon = (props) => {
  const { active, completed, icon, onSelect } = props
  // icon is 1-based index string from MUI
  const position = Number(icon) - 1
  const current = props.stageIndex
  const isCompleted = position <= current
  const isNext = position === current + 1
  const size = 24
  const styles = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer'
  }
  if (isCompleted) {
    return (
      <Box sx={{ ...styles, bgcolor: 'success.main', color: 'white' }} onClick={() => onSelect && onSelect(position)}>✓</Box>
    )
  }
  if (isNext) {
    return (
      <Box sx={{ ...styles, bgcolor: 'warning.main', color: 'white' }} onClick={() => onSelect && onSelect(position)}>{icon}</Box>
    )
  }
  return (
    <Box sx={{ ...styles, bgcolor: 'grey.200', color: 'text.secondary' }} onClick={() => onSelect && onSelect(position)}>{icon}</Box>
  )
}

const HeadlineTimeline = ({ stageIndex, timeline, property }) => {
  const [expandedStage, setExpandedStage] = React.useState(null)
  const stageFor = (i) => UK_STAGES[i]
  const details = expandedStage == null ? [] : timeline.filter(t => t.stage === stageFor(expandedStage))
  return (
  <Card>
    <CardContent>
      {/* Address/price removed – shown in header */}
      <Box sx={{ mb: 2 }}>
        <Stepper activeStep={stageIndex} alternativeLabel>
          {UK_STAGES.map((s, i) => (
            <Step key={s}>
              <StepLabel StepIconComponent={(p) => <StageStepIcon {...p} stageIndex={stageIndex} onSelect={(idx) => setExpandedStage(expandedStage===idx?null:idx)} />}>{s}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {expandedStage != null && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {details.map(item => (
              <Card key={item.id} sx={{ minWidth: 260, flex: '0 0 auto', border: 'none' }}>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Chip label={item.stage} size="small" />
                    <Typography variant="caption" color="text.secondary">{new Date(item.ts).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{item.by}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.note}</Typography>
                </CardContent>
              </Card>
            ))}
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
    <Card sx={{ border: 'none', boxShadow: '0px 6px 20px rgba(0,0,0,0.06)' }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Add update as {currentRole}</Typography>
        <Stack direction="row" spacing={1}>
          <TextField fullWidth size="small" placeholder="Add a note or update" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button variant="outlined" size="small" startIcon={<UploadFile />} onClick={() => setDoc('Doc.pdf')}>Attach</Button>
          <Button variant="contained" size="small" startIcon={<Add />} onClick={() => { if (!note) return; onAdd({ note, doc }); setNote(''); setDoc('') }}>Add</Button>
        </Stack>
        {/* Shared comment history */}
        <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'grey.200' }}>
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

const TransactionSimulator = ({ role: controlledRole, onRoleChange }) => {
  const [role, setRole] = useState(controlledRole || 'Buyer')
  const [stageIndex, setStageIndex] = useState(0)
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

  const addUpdate = ({ note, doc }) => {
    setTimeline(prev => [
      ...prev,
      { id: Date.now(), stage, by: role, note: note + (doc ? ` (attached: ${doc})` : ''), ts: new Date().toISOString() }
    ])
  }

  const proceed = () => {
    if (stageIndex < UK_STAGES.length - 1) setStageIndex(stageIndex + 1)
  }

  const updatesForRole = timeline.filter(t => t.by === role)
  const toggleBuyerChecklist = (id) => {
    setBuyerChecklist(prev => ({ ...prev, [id]: !prev[id] }))
  }
  const toggleAgentChecklist = (id) => {
    setAgentChecklist(prev => ({ ...prev, [id]: !prev[id] }))
  }
  const toggleSolicitorChecklist = (id) => {
    setSolicitorChecklist(prev => ({ ...prev, [id]: !prev[id] }))
  }
  const toggleSellerChecklist = (id) => {
    setSellerChecklist(prev => ({ ...prev, [id]: !prev[id] }))
  }

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

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {/* User chips removed; use avatar dropdown in header to switch roles */}
      </Box>

      {/* Removed 'Waiting on' box per request; timeline and checklists indicate status */}

      <Grid container spacing={3}>
        {/* Headline full-width timeline */}
        <Grid size={{ xs: 12 }}>
          <HeadlineTimeline stageIndex={stageIndex} timeline={timeline} property={property} />
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


