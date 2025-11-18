import React from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  AttachFileRounded,
  CheckCircleRounded,
  FilterAltRounded,
  FlagRounded,
  SendRounded,
  ShareRounded,
  TaskAltRounded,
  UploadFileRounded
} from '@mui/icons-material'

const UK_STAGES = [
  'Offer accepted',
  'Solicitors appointed',
  'MOS drafted and sent',
  'AML, lending and compliance',
  'Draft contract pack issued',
  'Searches Ordered',
  'Enquiries Raised & Responded',
  'Mortgage Offer Issued',
  'Report on Title & Signatures',
  'Exchange of Contracts',
  'Completion'
]

const composerPlaceholders = {
  All: 'Share what just happened so everyone stays in sync…',
  Buyer: 'Write a quick note for the buyer…',
  Agent: 'Let your agent know what’s next…',
  Solicitor: 'Capture the latest from the solicitors…',
  Seller: 'Log an update from your side…',
  System: 'Record an automated update…'
}

const SOURCE_OPTIONS = ['Manual note', 'Email summary', 'WhatsApp summary']

const ProgressRingWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-flex',
  '& .MuiCircularProgress-root': {
    color: theme.palette.primary.main
  }
}))

const ProgressLabel = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontWeight: 700,
  color: theme.palette.text.primary
}))

const TagChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  fontWeight: 600,
  borderRadius: theme.spacing(1.5),
  height: 28
}))

const SectionCard = ({ title, action, children, sx }) => (
  <Card 
    sx={{ 
      borderRadius: 3, 
      boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.2s ease-in-out',
      '&:hover': {
        boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08)'
      },
      ...sx 
    }} 
    elevation={0}
  >
    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: title ? 2.5 : 0 }}>
        {title ? (
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '-0.01em', fontSize: '1.1rem' }}>
            {title}
          </Typography>
        ) : (
          <Box />
        )}
        {action}
      </Stack>
      {children}
    </CardContent>
  </Card>
)

const defaultTransaction = {
  id: 'txn-123',
  address: '123 Maple Street, London, SW1A 1AA',
  price: 350000,
  lastUpdated: '2025-11-05T16:45:00Z',
  stageIndex: 5,
  ownerName: 'Mike',
  buyerName: 'Sarah Johnson',
  keyDates: [
    { label: 'Offer accepted', value: '12 Aug 2025' },
    { label: 'Searches ordered', value: '28 Aug 2025' },
    { label: 'Target exchange', value: '14 Nov 2025' },
    { label: 'Target completion', value: '28 Nov 2025' }
  ],
  participants: [
    { id: 'p1', name: 'Sarah Johnson', role: 'Buyer', firm: 'Homebuyer', email: 'sarah.j@email.com', phone: '+44 7700 900123', status: 'Online now' },
    { id: 'p2', name: 'Michael Chen', role: 'Seller', firm: 'Owner', email: 'michael@owner.com', phone: '+44 7700 900456', status: 'Last seen 3h ago' },
    { id: 'p3', name: 'Emma Williams', role: "Agent", firm: 'Prime Estates', email: 'emma@primeestates.co.uk', phone: '+44 20 7000 1234', status: 'Responds in 4h', verified: true },
    { id: 'p4', name: "David Thompson", role: "Buyer Solicitor", firm: 'Thompson Legal', email: 'dthompson@lawfirm.co.uk', phone: '+44 20 7100 9876', status: 'Pending invite' }
  ],
  timeline: [
    { id: 'evt-6', actor: 'System', actorRole: 'System', source: 'Email parser', badge: 'Email parser', content: 'Solicitor confirmed searches have been ordered with the local authority.', timestamp: '2025-11-05T16:12:00Z' },
    { id: 'evt-5', actor: 'Emma Williams', actorRole: 'Agent', source: 'Manual', badge: 'Manual', content: 'Seller has signed the fixtures & fittings form. Uploading shortly.', timestamp: '2025-11-04T09:20:00Z' },
    { id: 'evt-4', actor: 'David Thompson', actorRole: 'Buyer Solicitor', source: 'WhatsApp parser', badge: 'WhatsApp summary', content: 'Draft contract reviewed. Awaiting lender consent to special condition 4.', timestamp: '2025-11-03T19:45:00Z' },
    { id: 'evt-3', actor: 'Sarah Johnson', actorRole: 'Buyer', source: 'Manual', badge: 'Manual note', content: 'Mortgage valuation booked for 11 Nov with HSBC surveyor.', timestamp: '2025-11-02T08:30:00Z' }
  ],
  documents: [
    { id: 'doc-1', name: 'ID & AML pack', type: 'ID', owner: 'Buyer', status: 'Approved', updatedAt: '2025-10-29T11:00:00Z' },
    { id: 'doc-2', name: 'Mortgage illustration', type: 'Mortgage', owner: 'Buyer', status: 'Uploaded', updatedAt: '2025-11-01T15:26:00Z' },
    { id: 'doc-3', name: 'Fixtures & fittings (TA10)', type: 'Contracts', owner: 'Seller', status: 'Requested', updatedAt: '2025-11-04T09:25:00Z' }
  ],
  tasks: [
    { id: 'tsk-1', label: 'Buyer solicitor to lodge searches payment', owner: 'Buyer Solicitor', due: '9 Nov', status: 'In progress' },
    { id: 'tsk-2', label: 'Agent to upload signed TA10 form', owner: 'Agent', due: 'Today', status: 'Pending' },
    { id: 'tsk-3', label: 'Buyer to confirm mortgage offer ETA', owner: 'Buyer', due: '12 Nov', status: 'Pending' }
  ]
}

const statusColorMap = {
  Approved: 'success',
  Uploaded: 'primary',
  Requested: 'warning',
  Pending: 'warning',
  'In progress': 'info',
  Completed: 'success'
}

const formatCurrency = (value) => (value ? `£${value.toLocaleString()}` : '—')

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return iso
  }
}

const formatRelative = (iso) => {
  if (!iso) return ''
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(iso)
}

const formatTime = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return ''
  }
}

// Normalize timeline events from different sources to a consistent format
const normalizeTimelineEvent = (event) => {
  // Always normalize to ensure consistent field names across all sources
  // This handles email/WhatsApp events (ts, by, note) and manual events (timestamp, actor, content)
  const normalized = {
    ...event,
    // Map timestamp fields - prioritize timestamp, fallback to ts, then current time
    timestamp: event.timestamp || event.ts || new Date().toISOString(),
    // Map actor fields - prioritize actor, fallback to by
    actor: event.actor || event.by || 'Unknown',
    // Map content fields - prioritize content, fallback to note
    content: event.content || event.note || '',
    // Map role fields - prioritize actorRole, fallback to role
    actorRole: event.actorRole || event.role || 'Update',
    // Ensure badge exists - prioritize badge, fallback to source
    badge: event.badge || event.source || 'Update',
    // Ensure id exists - try various id fields
    id: event.id || event.emailId || event.messageId || `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }
  
  return normalized
}

const TimelineComposer = ({ scope, onChange, value, onPost, source, onSourceChange, actor, onActorChange }) => (
  <Paper 
    variant="outlined" 
    sx={{ 
      p: 3, 
      borderRadius: 3,
      borderColor: 'grey.200',
      backgroundColor: 'background.paper',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        borderColor: 'primary.light',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }
    }}
  >
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          size="small"
          label="Who is this update from?"
          value={actor}
          onChange={(event) => onActorChange(event.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.light'
              }
            }
          }}
        />
        <FormControl fullWidth size="small">
          <InputLabel id="timeline-source-label">How did it come in?</InputLabel>
          <Select
            labelId="timeline-source-label"
            value={source}
            label="How did it come in?"
            onChange={(event) => onSourceChange(event.target.value)}
            sx={{
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.light'
              }
            }}
          >
            {SOURCE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <TextField
        multiline
        minRows={3}
        maxRows={6}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={composerPlaceholders[scope]}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.light'
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main'
            }
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Stack direction="row" spacing={1}>
                <Tooltip title="Attach file">
                  <IconButton 
                    size="small"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <AttachFileRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Insert task">
                  <IconButton 
                    size="small"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <TaskAltRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </InputAdornment>
          )
        }}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button 
          startIcon={<UploadFileRounded />} 
          variant="text" 
          color="secondary"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          Add attachment
        </Button>
        <Button 
          endIcon={<SendRounded />} 
          variant="contained" 
          onClick={onPost}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
            }
          }}
        >
          Add to timeline
        </Button>
      </Stack>
    </Stack>
  </Paper>
)

const TimelineEvent = ({ event }) => {
  // Normalize event to ensure consistent field names
  const normalizedEvent = normalizeTimelineEvent(event)
  
  // Detect event type
  const isStageUpdate = normalizedEvent.badge === 'Stage update' || normalizedEvent.stageIndex !== undefined
  const isTaskUpdate = normalizedEvent.badge === 'Task done' || normalizedEvent.badge === 'Task reopened'
  
  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        borderColor: isStageUpdate ? 'primary.light' : 'grey.200',
        backgroundColor: isStageUpdate ? 'primary.50' : 'background.paper',
        borderWidth: isStageUpdate ? 2 : 1,
        boxShadow: isStageUpdate 
          ? '0 2px 8px rgba(25, 118, 210, 0.12)' 
          : '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: isStageUpdate
            ? '0 4px 12px rgba(25, 118, 210, 0.18)'
            : '0 2px 6px rgba(0,0,0,0.1)',
          transform: 'translateY(-1px)'
        }
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            {isStageUpdate && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  flexShrink: 0
                }}
              >
                <FlagRounded sx={{ fontSize: 20 }} />
              </Box>
            )}
            {isTaskUpdate && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  color: 'white',
                  flexShrink: 0
                }}
              >
                <CheckCircleRounded sx={{ fontSize: 20 }} />
              </Box>
            )}
            {!isStageUpdate && !isTaskUpdate && (
              <Avatar sx={{ width: 40, height: 40, fontWeight: 600, flexShrink: 0 }}>
                {(normalizedEvent.actor || '?')
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)}
              </Avatar>
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.25 }}>
                {normalizedEvent.actor}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {normalizedEvent.actorRole}
                {normalizedEvent.source ? ` · ${normalizedEvent.source}` : ''}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 2 }}>
            <Chip 
              label={normalizedEvent.badge} 
              size="small" 
              sx={{ 
                fontWeight: 600, 
                borderRadius: 1.5,
                backgroundColor: isStageUpdate ? 'primary.main' : undefined,
                color: isStageUpdate ? 'white' : undefined
              }} 
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
              {formatTime(normalizedEvent.timestamp) || formatRelative(normalizedEvent.timestamp)}
            </Typography>
          </Stack>
        </Stack>
        <Typography 
          variant="body2" 
          color="text.primary" 
          sx={{ 
            lineHeight: 1.7,
            fontWeight: isStageUpdate ? 500 : 400,
            fontSize: isStageUpdate ? '0.95rem' : '0.875rem'
          }}
        >
          {normalizedEvent.content}
        </Typography>
      </Stack>
    </Paper>
  )
}

const DocumentsList = ({ documents }) => (
  <Stack spacing={2}>
    {documents.map((doc) => {
      const color = statusColorMap[doc.status] || 'default'
      return (
        <Paper key={doc.id} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{doc.name}</Typography>
              <Typography variant="body2" color="text.secondary">{doc.type} · {doc.owner}</Typography>
            </Box>
            <Stack spacing={1} alignItems="flex-end">
              <Chip label={doc.status} color={color === 'default' ? undefined : color} size="small" sx={{ fontWeight: 600 }} />
              <Typography variant="caption" color="text.secondary">Updated {formatRelative(doc.updatedAt)}</Typography>
            </Stack>
          </Stack>
        </Paper>
      )
    })}
  </Stack>
)

const TasksList = ({ tasks, onToggleTask }) => (
  <Stack spacing={2}>
    {tasks.map((task) => {
      const color = statusColorMap[task.status] || 'default'
      return (
        <Paper key={task.id} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{task.label}</Typography>
              <Typography variant="body2" color="text.secondary">Owner: {task.owner}</Typography>
            </Box>
            <Stack spacing={1} alignItems="flex-end">
              <Chip label={task.status} color={color === 'default' ? undefined : color} size="small" sx={{ fontWeight: 600 }} />
              <Typography variant="caption" color="text.secondary">Due {task.due}</Typography>
              <Button
                size="small"
                variant={task.status === 'Completed' ? 'outlined' : 'contained'}
                color={task.status === 'Completed' ? 'primary' : 'success'}
                onClick={() => onToggleTask?.(task.id)}
              >
                {task.status === 'Completed' ? 'Mark incomplete' : 'Mark complete'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )
    })}
  </Stack>
)

const TransactionHub = ({ transaction }) => {
  const mergedTransaction = React.useMemo(() => ({
    ...defaultTransaction,
    ...transaction,
    keyDates: transaction?.keyDates || defaultTransaction.keyDates,
    timeline: transaction?.timeline || defaultTransaction.timeline,
    documents: transaction?.documents || defaultTransaction.documents,
    tasks: transaction?.tasks || defaultTransaction.tasks
  }), [transaction])

  const [localData, setLocalData] = React.useState(mergedTransaction)
  const [composerValue, setComposerValue] = React.useState('')
  const [composerSource, setComposerSource] = React.useState(SOURCE_OPTIONS[0])
  const [composerActor, setComposerActor] = React.useState(() =>
    mergedTransaction.ownerName ? `${mergedTransaction.ownerName} (Seller)` : 'You (Seller)'
  )

  React.useEffect(() => {
    setLocalData(mergedTransaction)
    setComposerActor(mergedTransaction.ownerName ? `${mergedTransaction.ownerName} (Seller)` : 'You (Seller)')
  }, [mergedTransaction])

  const currentStageIndex = localData.stageIndex ?? 0

  const progress = React.useMemo(() => {
    const stageProgress = (currentStageIndex + 1) / UK_STAGES.length
    const checklistProgress = localData.tasks ? localData.tasks.filter((task) => task.status && task.status.toLowerCase().includes('complete')).length / (localData.tasks.length || 1) : 0
    return Math.round(((stageProgress * 0.7) + (checklistProgress * 0.3)) * 100)
  }, [currentStageIndex, localData.tasks])

  const handlePostUpdate = () => {
    if (!composerValue.trim()) return
    const now = new Date().toISOString()
    const actorRole = (composerActor || '').toLowerCase().includes('seller') ? 'Seller' : 'Update'

    setLocalData((prev) => ({
      ...prev,
      lastUpdated: now,
      timeline: [
        {
          id: `evt-${Date.now()}`,
          actor: composerActor || 'You',
          actorRole,
          source: composerSource,
          badge: composerSource,
          content: composerValue.trim(),
          timestamp: now
        },
        ...prev.timeline
      ]
    }))
    setComposerValue('')
  }

  const handleStageUpdate = (event) => {
    const nextStageIndex = Number(event.target.value)
    const previousStageIndex = localData.stageIndex ?? 0
    const now = new Date().toISOString()
    const completionDate = formatDate(now)

    setLocalData((prev) => ({
      ...prev,
      stageIndex: nextStageIndex,
      lastUpdated: now,
      timeline: [
        {
          id: `evt-stage-${Date.now()}`,
          actor: prev.ownerName ? `${prev.ownerName} (Seller)` : 'Seller',
          actorRole: 'Seller',
          source: 'Manual note',
          badge: 'Stage update',
          content: `Moved to "${UK_STAGES[nextStageIndex]}" on ${completionDate}.`,
          stageIndex: nextStageIndex,
          previousStageIndex: previousStageIndex, // Track the completed stage
          timestamp: now
        },
        ...prev.timeline
      ]
    }))
  }

  const handleToggleTask = (taskId) => {
    const now = new Date().toISOString()
    setLocalData((prev) => {
      let toggledTask
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id !== taskId) return task
        toggledTask = {
          ...task,
          status: task.status === 'Completed' ? 'Pending' : 'Completed'
        }
        return toggledTask
      })

      if (!toggledTask) return prev

      return {
        ...prev,
        tasks: updatedTasks,
        lastUpdated: now,
        timeline: [
          {
            id: `evt-task-${taskId}-${Date.now()}`,
            actor: prev.ownerName ? `${prev.ownerName} (Seller)` : 'Seller',
            actorRole: 'Seller',
            source: 'Manual note',
            badge: toggledTask.status === 'Completed' ? 'Task done' : 'Task reopened',
            content: `${toggledTask.label} ${toggledTask.status === 'Completed' ? 'marked complete' : 'reopened'}.`,
            timestamp: now
          },
          ...prev.timeline
        ]
      }
    })
  }

  const handleShareLink = async () => {
    try {
      const token = Math.random().toString(36).slice(2, 10)
      const url = `${window.location.origin}/#/live?t=${token}`
      await navigator.clipboard.writeText(url)
    } catch (error) {
      console.warn('Failed copying link', error)
    }
  }

  const stageDates = React.useMemo(() => {
    const dates = new Map()
    // Normalize all events first
    const normalizedTimeline = (localData.timeline || []).map(normalizeTimelineEvent)
    
    // Filter and sort by timestamp in ascending order
    const timelineAsc = normalizedTimeline
      .filter((event) => {
        const ts = event.timestamp || event.ts
        return ts && !isNaN(new Date(ts).getTime())
      })
      .sort((a, b) => {
        const tsA = new Date(a.timestamp).getTime()
        const tsB = new Date(b.timestamp).getTime()
        return tsA - tsB
      })

    timelineAsc.forEach((event) => {
      // For stage updates, the completion date belongs to the PREVIOUS stage, not the new one
      let completedStageIndex = null
      
      if (event.badge === 'Stage update') {
        // Use previousStageIndex if available (the stage that was completed)
        if (event.previousStageIndex != null && event.previousStageIndex >= 0) {
          completedStageIndex = event.previousStageIndex
        } else if (event.stageIndex != null && event.stageIndex > 0) {
          // Fallback: if previousStageIndex not available, use stageIndex - 1
          // (the stage before the one we moved to)
          completedStageIndex = event.stageIndex - 1
        }
      } else {
        // For non-stage-update events, use stageIndex directly if available
        completedStageIndex = event.stageIndex
      }

      if (completedStageIndex != null && completedStageIndex >= 0 && !dates.has(completedStageIndex)) {
        dates.set(completedStageIndex, event.timestamp)
      }
    })

    return dates
  }, [localData.timeline])

  // Group timeline events by stage
  const eventsByStage = React.useMemo(() => {
    const groups = new Map()
    const normalizedTimeline = (localData.timeline || []).map(normalizeTimelineEvent)
    
    // Get all stage completion dates
    const stageCompletionDates = new Map()
    normalizedTimeline
      .filter((event) => {
        const ts = event.timestamp || event.ts
        return ts && !isNaN(new Date(ts).getTime())
      })
      .sort((a, b) => {
        const tsA = new Date(a.timestamp).getTime()
        const tsB = new Date(b.timestamp).getTime()
        return tsA - tsB
      })
      .forEach((event) => {
        if (event.badge === 'Stage update') {
          let completedStageIndex = null
          if (event.previousStageIndex != null && event.previousStageIndex >= 0) {
            completedStageIndex = event.previousStageIndex
          } else if (event.stageIndex != null && event.stageIndex > 0) {
            completedStageIndex = event.stageIndex - 1
          }
          if (completedStageIndex != null && completedStageIndex >= 0) {
            stageCompletionDates.set(completedStageIndex, new Date(event.timestamp).getTime())
          }
        }
      })

    // Initialize groups for all stages
    UK_STAGES.forEach((_, index) => {
      groups.set(index, [])
    })

    // Assign events to stages
    normalizedTimeline
      .filter((event) => {
        const ts = event.timestamp || event.ts
        return ts && !isNaN(new Date(ts).getTime())
      })
      .forEach((event) => {
        const eventTime = new Date(event.timestamp).getTime()
        let assignedStage = null

        if (event.badge === 'Stage update') {
          // Stage updates: assign to the stage that was completed
          if (event.previousStageIndex != null && event.previousStageIndex >= 0) {
            assignedStage = event.previousStageIndex
          } else if (event.stageIndex != null && event.stageIndex > 0) {
            assignedStage = event.stageIndex - 1
          }
        } else {
          // Regular events: assign to the stage that was current when the event occurred
          // A stage is "current" from when the previous stage completes until it itself completes
          
          // Find the latest stage that was completed before this event
          let latestCompletedBeforeEvent = -1
          for (let i = UK_STAGES.length - 1; i >= 0; i--) {
            const completionTime = stageCompletionDates.get(i)
            if (completionTime && completionTime <= eventTime) {
              latestCompletedBeforeEvent = i
              break
            }
          }
          
          // The stage that was current = the next stage after the latest completed one
          // Or stage 0 if no stages completed yet
          if (latestCompletedBeforeEvent >= 0) {
            assignedStage = latestCompletedBeforeEvent + 1
            // Make sure we don't exceed stage count
            if (assignedStage >= UK_STAGES.length) {
              assignedStage = UK_STAGES.length - 1
            }
          } else {
            // No stages completed yet, event belongs to stage 0
            assignedStage = 0
          }
        }

        if (assignedStage !== null && assignedStage >= 0 && assignedStage < UK_STAGES.length) {
          const stageEvents = groups.get(assignedStage) || []
          stageEvents.push(event)
          groups.set(assignedStage, stageEvents)
        }
      })

    // Sort events within each stage by timestamp (newest first)
    groups.forEach((events, stageIndex) => {
      events.sort((a, b) => {
        const tsA = new Date(a.timestamp).getTime()
        const tsB = new Date(b.timestamp).getTime()
        return tsB - tsA // Descending (newest first)
      })
    })

    return groups
  }, [localData.timeline, currentStageIndex])

  const timelineDescending = React.useMemo(
    () => {
      // Normalize all events first to ensure consistent field names
      const normalizedTimeline = (localData.timeline || []).map(normalizeTimelineEvent)
      
      // Filter events that have a valid timestamp (ts or timestamp)
      const eventsWithTimestamp = normalizedTimeline.filter((event) => {
        const ts = event.timestamp || event.ts
        return ts && !isNaN(new Date(ts).getTime())
      })
      
      // Sort by timestamp in descending order (newest first)
      return eventsWithTimestamp.sort((a, b) => {
        const tsA = new Date(a.timestamp).getTime()
        const tsB = new Date(b.timestamp).getTime()
        return tsB - tsA
      })
    },
    [localData.timeline]
  )

  const groupedTimeline = React.useMemo(() => {
    const items = []
    let lastDate = null

    timelineDescending.forEach((event) => {
      const eventDate = formatDate(event.timestamp)
      if (eventDate !== lastDate) {
        items.push({ type: 'date', id: `date-${eventDate}`, label: eventDate })
        lastDate = eventDate
      }
      items.push({ type: 'event', id: event.id, event })
    })

    return items
  }, [timelineDescending])

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2.5, md: 4 } }}>
      <Stack spacing={3.5}>
        <Card 
          sx={{ 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.15))',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid',
            borderColor: 'primary.light'
          }} 
          elevation={0}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2.5} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Box>
                <Typography 
                  variant="overline" 
                  color="primary" 
                  sx={{ 
                    fontWeight: 700, 
                    letterSpacing: '0.12em',
                    fontSize: '0.75rem',
                    mb: 1,
                    display: 'block'
                  }}
                >
                  Your sale at a glance
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800, 
                    letterSpacing: '-0.02em', 
                    mb: 1.5,
                    fontSize: { xs: '1.75rem', md: '2rem' }
                  }}
                >
                  {localData.address}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2.5,
                    lineHeight: 1.6,
                    fontSize: '0.95rem'
                  }}
                >
                  {localData.ownerName
                    ? `Hi ${localData.ownerName}, here's where things stand today. Drop in any updates you get from WhatsApp, email, or calls.`
                    : 'Keep everyone aligned by posting updates as they come in.'}
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                  <Chip 
                    label={formatCurrency(localData.price)} 
                    size="small" 
                    sx={{ 
                      fontWeight: 600,
                      height: 32,
                      fontSize: '0.875rem'
                    }} 
                  />
                  {localData.buyerName && (
                    <Chip 
                      label={`Buyer: ${localData.buyerName}`} 
                      size="small" 
                      sx={{ 
                        fontWeight: 600,
                        height: 32,
                        fontSize: '0.875rem'
                      }} 
                    />
                  )}
                  <TagChip 
                    label={UK_STAGES[localData.stageIndex] || 'Stage'} 
                    size="small"
                    sx={{ height: 32 }}
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      ml: { xs: 0, sm: 1 },
                      fontSize: '0.875rem'
                    }}
                  >
                    Updated {formatRelative(localData.lastUpdated)}
                  </Typography>
                </Stack>
              </Box>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={1.5} 
                alignItems={{ xs: 'stretch', sm: 'center' }} 
                sx={{ width: { xs: '100%', md: 'auto' } }}
              >
                <Button 
                  variant="outlined" 
                  startIcon={<ShareRounded />} 
                  onClick={handleShareLink}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2.5,
                    borderColor: 'grey.300',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.50'
                    }
                  }}
                >
                  Share buyer view
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => window.print()}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  Download summary
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <SectionCard
          title="Stage tracker"
          action={
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 220,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.light'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main'
                  }
                }
              }}
            >
              <InputLabel id="stage-select-label">Current stage</InputLabel>
              <Select
                labelId="stage-select-label"
                value={currentStageIndex}
                label="Current stage"
                onChange={handleStageUpdate}
              >
                {UK_STAGES.map((stage, index) => (
                  <MenuItem key={stage} value={index}>
                    {stage}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          }
          sx={{ backgroundColor: 'background.paper' }}
        >
          <Stack spacing={3.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3.5} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <ProgressRingWrapper>
                <CircularProgress 
                  variant="determinate" 
                  value={progress} 
                  size={120} 
                  thickness={4.5}
                  sx={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                />
                <ProgressLabel variant="subtitle1" sx={{ fontSize: '1.25rem' }}>
                  {progress}%
                </ProgressLabel>
              </ProgressRingWrapper>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  {UK_STAGES[currentStageIndex]}
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                    letterSpacing: '-0.01em'
                  }}
                >
                  {localData.stageIndex !== undefined ? `Stage ${currentStageIndex + 1} of ${UK_STAGES.length}` : 'Track each milestone'}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    lineHeight: 1.6,
                    fontSize: '0.875rem',
                    mt: 0.5
                  }}
                >
                  Every milestone, comment, and follow-up is captured with the date it happened so nobody misses a beat.
                </Typography>
              </Stack>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack spacing={2}>
              {UK_STAGES.map((stage, index) => {
                const stageDate = stageDates.get(index)
                const isCurrent = index === currentStageIndex
                const isComplete = index < currentStageIndex
                return (
                  <Box key={stage}>
                    <Stack
                      spacing={1}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: isCurrent 
                          ? 'primary.50' 
                          : 'transparent',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: isCurrent ? 'primary.50' : 'grey.50',
                          boxShadow: isCurrent 
                            ? '0 2px 8px rgba(25, 118, 210, 0.15)' 
                            : '0 1px 4px rgba(0,0,0,0.08)'
                        }
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            bgcolor: isComplete || isCurrent ? 'primary.main' : 'grey.300',
                            border: isComplete || isCurrent ? '2px solid white' : 'none',
                            boxShadow: isComplete || isCurrent 
                              ? '0 2px 4px rgba(25, 118, 210, 0.3)' 
                              : 'none',
                            flexShrink: 0
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isCurrent ? 700 : isComplete ? 600 : 500,
                            color: isComplete || isCurrent ? 'text.primary' : 'text.secondary',
                            fontSize: '0.9rem'
                          }}
                        >
                          {stage}
                        </Typography>
                      </Stack>
                      <Typography 
                        variant="caption" 
                        color={stageDate ? 'text.primary' : 'text.secondary'} 
                        sx={{ 
                          pl: 3.5,
                          fontWeight: stageDate ? 600 : 400,
                          fontSize: '0.8rem',
                          lineHeight: 1.5
                        }}
                      >
                        {stageDate 
                          ? `Completed ${formatDate(stageDate)}` 
                          : index > currentStageIndex 
                            ? 'TBC' 
                            : 'In progress'}
                      </Typography>
                      
                      {/* Show timeline events for this stage */}
                      {(() => {
                        const stageEvents = eventsByStage.get(index) || []
                        // Filter out the stage update event itself (we already show completion date)
                        const comments = stageEvents.filter(e => e.badge !== 'Stage update')
                        
                        if (comments.length === 0) return null
                        
                        return (
                          <Stack spacing={1.5} sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
                            {comments.map((event) => {
                              const isStageUpdate = event.badge === 'Stage update'
                              const isTaskUpdate = event.badge === 'Task done' || event.badge === 'Task reopened'
                              
                              return (
                                <Box
                                  key={event.id}
                                  sx={{
                                    pl: 3.5,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.5
                                  }}
                                >
                                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25 }}>
                                    {isStageUpdate && (
                                      <FlagRounded sx={{ fontSize: 14, color: 'primary.main' }} />
                                    )}
                                    {isTaskUpdate && (
                                      <CheckCircleRounded sx={{ fontSize: 14, color: 'success.main' }} />
                                    )}
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                        color: 'text.primary',
                                        flex: 1
                                      }}
                                    >
                                      {event.actor}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.75rem'
                                      }}
                                    >
                                      {formatDate(event.timestamp)}
                                    </Typography>
                                  </Stack>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: '0.875rem',
                                      color: 'text.secondary',
                                      lineHeight: 1.6,
                                      pl: isStageUpdate || isTaskUpdate ? 2.5 : 0
                                    }}
                                  >
                                    {event.content}
                                  </Typography>
                                </Box>
                              )
                            })}
                          </Stack>
                        )
                      })()}
                    </Stack>
                  </Box>
                )
              })}
            </Stack>
          </Stack>
        </SectionCard>

        <SectionCard title="Timeline" sx={{ backgroundColor: 'background.paper' }}>
          <Stack spacing={3}>
            <TimelineComposer
              scope="All"
              value={composerValue}
              onChange={(value) => setComposerValue(value)}
              onPost={handlePostUpdate}
              source={composerSource}
              onSourceChange={(value) => setComposerSource(value)}
              actor={composerActor}
              onActorChange={(value) => setComposerActor(value)}
            />
            
            {groupedTimeline.length > 0 ? (
              <Stack spacing={2.5}>
                {groupedTimeline.map((item, index) => {
                  if (item.type === 'date') {
                    return (
                      <Box
                        key={item.id}
                        sx={{
                          pt: index === 0 ? 0 : 3,
                          pb: 1,
                          position: 'relative'
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            fontSize: '0.95rem',
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                            mb: 0.5
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(to right, transparent, grey.300, transparent)'
                          }}
                        />
                      </Box>
                    )
                  }
                  return <TimelineEvent key={item.id} event={item.event} />
                })}
              </Stack>
            ) : (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  textAlign: 'center', 
                  py: 6,
                  fontStyle: 'italic'
                }}
              >
                No timeline events yet. Add an update above to get started.
              </Typography>
            )}
          </Stack>
        </SectionCard>
      </Stack>
    </Box>
  )
}

export default TransactionHub

