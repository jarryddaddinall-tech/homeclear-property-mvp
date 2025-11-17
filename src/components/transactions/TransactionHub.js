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
  FilterAltRounded,
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
  <Card sx={{ borderRadius: 3, ...sx }} elevation={2}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: title ? 2 : 0 }}>
        {title ? (
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
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

const TimelineComposer = ({ scope, onChange, value, onPost, source, onSourceChange, actor, onActorChange }) => (
  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          fullWidth
          size="small"
          label="Who is this update from?"
          value={actor}
          onChange={(event) => onActorChange(event.target.value)}
        />
        <FormControl fullWidth size="small">
          <InputLabel id="timeline-source-label">How did it come in?</InputLabel>
          <Select
            labelId="timeline-source-label"
            value={source}
            label="How did it come in?"
            onChange={(event) => onSourceChange(event.target.value)}
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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Stack direction="row" spacing={1}>
                <Tooltip title="Attach file">
                  <IconButton size="small">
                    <AttachFileRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Insert task">
                  <IconButton size="small">
                    <TaskAltRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </InputAdornment>
          )
        }}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button startIcon={<UploadFileRounded />} variant="text" color="secondary">
          Add attachment
        </Button>
        <Button endIcon={<SendRounded />} variant="contained" onClick={onPost}>
          Add to timeline
        </Button>
      </Stack>
    </Stack>
  </Paper>
)

const TimelineEvent = ({ event }) => (
  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 36, height: 36, fontWeight: 600 }}>
            {(event.actor || '?')
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {event.actor}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {event.actorRole}
              {event.source ? ` · ${event.source}` : ''}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={event.badge} size="small" sx={{ fontWeight: 600, borderRadius: 1.5 }} />
          <Typography variant="caption" color="text.secondary">
            {formatTime(event.timestamp) || formatRelative(event.timestamp)}
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
        {event.content}
      </Typography>
    </Stack>
  </Paper>
)

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
    const now = new Date().toISOString()

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
          content: `Moved to “${UK_STAGES[nextStageIndex]}”.`,
          stageIndex: nextStageIndex,
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
    const timelineAsc = [...(localData.timeline || [])]
      .filter((event) => event.timestamp)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    timelineAsc.forEach((event) => {
      let stageIndex = event.stageIndex
      if (stageIndex == null && event.badge === 'Stage update') {
        const match = event.content?.match(/“(.+)”/)
        if (match) {
          stageIndex = UK_STAGES.findIndex((stage) => stage === match[1])
        }
      }

      if (stageIndex != null && stageIndex >= 0 && !dates.has(stageIndex)) {
        dates.set(stageIndex, event.timestamp)
      }
    })

    return dates
  }, [localData.timeline])

  const timelineDescending = React.useMemo(
    () =>
      [...(localData.timeline || [])]
        .filter((event) => event.timestamp)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
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
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.12))' }} elevation={0}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2.5} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Box>
                <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: '0.12em' }}>
                  Your sale at a glance
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.01em', mb: 1 }}>
                  {localData.address}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {localData.ownerName
                    ? `Hi ${localData.ownerName}, here’s where things stand today. Drop in any updates you get from WhatsApp, email, or calls.`
                    : 'Keep everyone aligned by posting updates as they come in.'}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip label={formatCurrency(localData.price)} size="small" sx={{ fontWeight: 600 }} />
                  {localData.buyerName && (
                    <Chip label={`Buyer: ${localData.buyerName}`} size="small" sx={{ fontWeight: 600 }} />
                  )}
                  <TagChip label={UK_STAGES[localData.stageIndex] || 'Stage'} size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: { xs: 0, sm: 1 } }}>
                    Updated {formatRelative(localData.lastUpdated)}
                  </Typography>
                </Stack>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Button variant="outlined" startIcon={<ShareRounded />} onClick={handleShareLink}>
                  Share buyer view
                </Button>
                <Button variant="contained" onClick={() => window.print()}>
                  Download summary
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <SectionCard
          title="Stage tracker"
          action={
            <FormControl size="small" sx={{ minWidth: 220 }}>
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
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <ProgressRingWrapper>
                <CircularProgress variant="determinate" value={progress} size={110} thickness={5} />
                <ProgressLabel variant="subtitle1">{progress}%</ProgressLabel>
              </ProgressRingWrapper>
              <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {UK_STAGES[currentStageIndex]}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {localData.stageIndex !== undefined ? `Stage ${currentStageIndex + 1} of ${UK_STAGES.length}` : 'Track each milestone'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Every milestone, comment, and follow-up is captured with the date it happened so nobody misses a beat.
                </Typography>
              </Stack>
            </Stack>
            <Divider />
            <Stack spacing={1.5}>
              {UK_STAGES.map((stage, index) => {
                const stageDate = stageDates.get(index)
                const isCurrent = index === currentStageIndex
                const isComplete = index < currentStageIndex
                return (
                  <Box key={stage}>
                    <Stack
                      spacing={0.75}
                      sx={{
                        p: 1.75,
                        border: '1px solid',
                        borderRadius: 2,
                        borderColor: isCurrent ? 'primary.light' : 'grey.100',
                        bgcolor: isCurrent ? 'primary.light' : 'grey.50'
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: isComplete || isCurrent ? 'primary.main' : 'grey.300'
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isCurrent ? 700 : 500,
                            color: isComplete || isCurrent ? 'text.primary' : 'text.secondary'
                          }}
                        >
                          {stage}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ pl: 3 }}>
                        {stageDate ? formatDate(stageDate) : index > currentStageIndex ? 'TBC' : 'In progress'}
                      </Typography>
                    </Stack>
                  </Box>
                )
              })}
            </Stack>
          </Stack>
        </SectionCard>
      </Stack>
    </Box>
  )
}

export default TransactionHub

