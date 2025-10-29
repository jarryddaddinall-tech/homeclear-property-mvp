import React from 'react'
import { Box, Card, CardContent, Typography, Stack, Chip, Stepper, Step, StepLabel, Avatar, Divider } from '@mui/material'
import { properties as seedProperties } from '../../data/sampleData'

const UK_STAGES = [
  'Offer Accepted',
  'Sale details shared',
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

const TransactionCard = ({ property, status = 'Offer Accepted', currentStage = 0, onOpen }) => {
  const completedSteps = currentStage
  const totalSteps = UK_STAGES.length
  const progress = Math.min(100, Math.round(((completedSteps) / totalSteps) * 100))
  
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0px 8px 25px rgba(0,0,0,0.1)'
        }
      }} 
      onClick={onOpen}
    >
      {/* Top progress accent */}
      <Box sx={{ height: 3, bgcolor: 'grey.100', position: 'relative' }}>
        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, bgcolor: 'primary.main', transition: 'width .3s ease' }} />
      </Box>
      {/* Image header */}
      <Box
        component="img"
        src={property.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop'}
        alt={property.address}
        sx={{ width: '100%', height: 160, objectFit: 'cover', borderTopLeftRadius: (t) => t.shape.borderRadius, borderTopRightRadius: (t) => t.shape.borderRadius }}
      />
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
              {property.purchasePrice ? `£${property.purchasePrice.toLocaleString()}` : ''}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }} noWrap>
              {property.address}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} noWrap>
              {property.city || ''} {property.postcode || ''}
            </Typography>
          </Box>
          <Chip 
            label={status}
            size="small"
            sx={{ 
              bgcolor: 'success.light', 
              color: 'success.darker', 
              fontWeight: 600, 
              borderRadius: 1,
              px: 1,
              height: 26
            }}
          />
        </Stack>
        
        {/* Progress stepper */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Progress: {completedSteps}/{totalSteps} stages
          </Typography>
          <Stepper 
            activeStep={completedSteps} 
            alternativeLabel 
            size="small"
            sx={{
              '& .MuiStepLabel-root': {
                '& .MuiStepLabel-label': { 
                  fontSize: { xs: '0.6rem', sm: '0.7rem' }
                }
              }
            }}
          >
            {UK_STAGES.slice(0, 4).map((stage, index) => (
              <Step key={stage}>
                <StepLabel 
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontWeight: index <= completedSteps ? 600 : 400
                    }
                  }}
                >
                  {stage}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {totalSteps > 4 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              +{totalSteps - 4} more stages
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

const TeamCard = () => {
  const teamMembers = [
    { name: 'Sarah Johnson', role: 'Buyer', email: 'sarah.j@email.com', status: 'Active' },
    { name: 'Michael Chen', role: 'Solicitor', email: 'm.chen@lawfirm.co.uk', status: 'Working' },
    { name: 'Emma Williams', role: 'Agent', email: 'emma@estateagents.com', status: 'Coordinating' }
  ]

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
          Transaction Team
        </Typography>
        <Stack spacing={1.5}>
          {teamMembers.map((member, index) => (
            <Box key={member.name}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'primary.main',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {member.role}
                  </Typography>
                </Box>
                <Chip 
                  label={member.status}
                  size="small"
                  sx={{ 
                    fontSize: '0.65rem',
                    height: 20,
                    bgcolor: member.status === 'Active' ? 'success.light' : 
                            member.status === 'Working' ? 'warning.light' : 'info.light',
                    color: member.status === 'Active' ? 'success.dark' : 
                           member.status === 'Working' ? 'warning.dark' : 'info.dark'
                  }}
                />
              </Stack>
              {index < teamMembers.length - 1 && <Divider sx={{ mt: 1.5 }} />}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

const TransactionsDashboard = ({ onOpenTransaction, currentUser, showTeam = true }) => {
  // Sample properties for different roles
  const properties = [
    {
      id: 1,
      address: '123 Maple Street, London, SW1A 1AA',
      purchasePrice: 350000,
      currentStage: 1,
      status: 'Offer Accepted',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 2,
      address: '45 Modern Terrace, Manchester, M1 2AB',
      purchasePrice: 425000,
      currentStage: 3,
      status: 'Solicitors Instructed',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop'
    }
  ]

  // Show multiple properties for Agent, single property for others
  const displayProperties = currentUser?.role === 'Agent' ? properties : [properties[0]]
  
  return (
    <Box>
      <Box sx={{ 
        maxWidth: { xs: '100%', sm: 560 },
        width: '100%'
      }}>
        {displayProperties.map((property, index) => (
          <Box key={property.id} sx={{ mb: 2 }}>
            <TransactionCard 
              property={property} 
              currentStage={property.currentStage}
              status={property.status}
              onOpen={onOpenTransaction} 
            />
                {index === 0 && currentUser?.role !== 'Agent' && showTeam && <TeamCard />}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default TransactionsDashboard


