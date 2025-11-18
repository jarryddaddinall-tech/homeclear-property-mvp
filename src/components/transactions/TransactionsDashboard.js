import React from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material'
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { Add as AddIcon } from '@mui/icons-material'
import { TransactionCardSkeleton } from '../shared/Skeletons'

const UK_STAGES = [
  'Offer accepted',
  'Solicitors appointed',
  'MOS drafted and sent',
  'AML, lending and compliance',
  'Draft contract pack issued',
  'Searches Ordered (LA/Drainage/Env)',
  'Enquiries Raised & Responded',
  'Mortgage Offer Issued',
  'Report on Title & Signatures',
  'Exchange of Contracts',
  'Completion',
  'Post-Completion (SDLT/Land Registry)'
]

// Custom StepIcon component
const CustomStepIcon = (props) => {
  const { active, completed, icon } = props

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: completed 
          ? 'success.main' 
          : active 
            ? 'warning.main' 
            : 'grey.300',
        color: completed || active ? 'white' : 'grey.500',
        fontWeight: 700,
        fontSize: '0.875rem',
        border: completed || active ? '2px solid white' : 'none',
        boxShadow: completed || active 
          ? '0 2px 4px rgba(0,0,0,0.2)' 
          : 'none',
        position: 'relative',
        zIndex: 1
      }}
    >
      {completed ? (
        <CheckCircleIcon sx={{ fontSize: 20 }} />
      ) : (
        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
          {icon}
        </Typography>
      )}
    </Box>
  )
}

const TransactionCard = ({ transaction, onOpen }) => {
  const completedSteps = transaction.stageIndex || 0
  const totalSteps = UK_STAGES.length
  const progress = Math.min(100, Math.round(((completedSteps) / totalSteps) * 100))
  
  return (
    <Card 
      elevation={3}
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0px 20px 56px rgba(0, 0, 0, 0.14), 0px 6px 16px rgba(0, 0, 0, 0.10)',
        }
      }} 
      onClick={() => onOpen?.(transaction)}
    >
      {/* Top progress accent */}
      <Box sx={{ height: 4, bgcolor: 'grey.100', position: 'relative' }}>
        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, bgcolor: 'primary.main', transition: 'width .3s ease', borderRadius: '0 4px 4px 0' }} />
      </Box>
      <CardContent sx={{ p: { xs: 3.5, sm: 4.5 }, pb: { xs: 3.5, sm: 4.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.75, color: 'text.primary' }}>
              {transaction.address || 'Unnamed transaction'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
              {transaction.price ? `£${Number(transaction.price).toLocaleString()}` : 'Price TBD'}
            </Typography>
          </Box>
          <Chip 
            label={transaction.status || UK_STAGES[completedSteps] || 'In progress'}
            size="small"
            sx={{ 
              bgcolor: 'rgba(236, 253, 245, 0.9)',
              color: 'success.dark', 
              fontWeight: 600, 
              borderRadius: 2,
              px: 1.5,
              height: 28
            }}
          />
        </Stack>

        <Box sx={{ overflow: 'visible' }}>
          <Stepper 
            activeStep={completedSteps} 
            alternativeLabel 
            size="small"
            sx={{
              '& .MuiStep-root': {
                paddingBottom: 2,
                overflow: 'visible'
              },
              '& .MuiStepLabel-root': {
                overflow: 'visible',
                '& .MuiStepLabel-label': { 
                  fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                  fontWeight: 500,
                  lineHeight: 1.4,
                  mt: 1
                }
              },
              '& .MuiStepConnector-root': {
                top: 16,
                left: 'calc(-50% + 16px)',
                right: 'calc(50% + 16px)',
              },
              '& .MuiStepConnector-line': {
                borderTopWidth: 2,
                borderColor: 'grey.200',
              },
              '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                borderColor: 'warning.main',
              },
              '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                borderColor: 'success.main',
              },
            }}
          >
            {UK_STAGES.slice(0, 4).map((stage, index) => (
              <Step key={stage} completed={index < completedSteps} active={index === completedSteps}>
                <StepLabel 
                  StepIconComponent={CustomStepIcon}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontWeight: index <= completedSteps ? 600 : 500,
                      color: index <= completedSteps ? 'text.primary' : 'text.secondary',
                    }
                  }}
                >
                  {stage}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {totalSteps > 4 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5, display: 'block', fontWeight: 500, fontSize: '0.875rem', textAlign: 'center' }}>
              +{totalSteps - 4} more stages
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

const EmptyStateCard = ({ onCreate }) => (
  <Card sx={{ borderRadius: 3, border: '1px dashed', borderColor: 'grey.300', textAlign: 'center' }}>
    <CardContent sx={{ py: 6, px: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>No transactions yet</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mx: 'auto', mb: 3 }}>
        Start by adding the home Mike is selling. You can update stages, upload documents and share a live timeline once it’s created.
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
        Add your first transaction
      </Button>
    </CardContent>
  </Card>
)

const TransactionsDashboard = ({
  onOpenTransaction,
  onCreateTransaction,
  transactions = [],
  currentUser,
  loading = false
}) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false)
  const [formState, setFormState] = React.useState({
    address: '',
    price: '',
    buyerName: ''
  })
  const [saving, setSaving] = React.useState(false)

  const handleOpenDialog = () => {
    setFormState({ address: '', price: '', buyerName: '' })
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    if (saving) return
    setDialogOpen(false)
  }

  const handleFormChange = (field) => (event) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleCreate = async () => {
    if (!formState.address.trim()) return
    try {
      setSaving(true)
      await onCreateTransaction?.({
        address: formState.address.trim(),
        price: formState.price ? Number(formState.price) : null,
        buyerName: formState.buyerName.trim() || null
      })
      setDialogOpen(false)
    } catch (error) {
      console.error('Failed to create transaction:', error)
    } finally {
      setSaving(false)
    }
  }

  const hasTransactions = transactions && transactions.length > 0

  return (
    <Box sx={{ maxWidth: { xs: '100%', md: 760 }, width: '100%' }}>
      {loading && <TransactionCardSkeleton />}
      {!loading && !hasTransactions && (
        <EmptyStateCard onCreate={handleOpenDialog} />
      )}
      {!loading && hasTransactions && (
        <Stack spacing={3}>
          <Card sx={{ borderRadius: 3, border: '1px dashed', borderColor: 'grey.300', bgcolor: 'transparent', boxShadow: 'none' }}>
            <CardActions sx={{ justifyContent: 'center', py: 2 }}>
              <Button startIcon={<AddIcon />} variant="outlined" onClick={handleOpenDialog}>
                Add another transaction
              </Button>
            </CardActions>
          </Card>
          {transactions.map((transaction) => (
            <Box key={transaction.id}>
              <TransactionCard transaction={transaction} onOpen={onOpenTransaction} />
            </Box>
          ))}
        </Stack>
      )}

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add a transaction</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Property address"
              value={formState.address}
              onChange={handleFormChange('address')}
              fullWidth
              autoFocus
              required
            />
            <TextField
              label="Agreed price (£)"
              value={formState.price}
              onChange={handleFormChange('price')}
              type="number"
              fullWidth
            />
            <TextField
              label="Buyer name (optional)"
              value={formState.buyerName}
              onChange={handleFormChange('buyerName')}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saving}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={saving || !formState.address.trim()}>
            {saving ? 'Saving…' : 'Create transaction'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TransactionsDashboard


