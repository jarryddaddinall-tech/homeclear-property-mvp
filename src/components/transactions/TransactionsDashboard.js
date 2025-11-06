import React from 'react'
import { Box, Card, CardContent, Typography, Stack, Chip, Stepper, Step, StepLabel, Avatar, Divider, Button } from '@mui/material'
import { TransactionCardSkeleton } from '../shared/Skeletons'
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
      onClick={onOpen}
    >
      {/* Top progress accent */}
      <Box sx={{ height: 4, bgcolor: 'grey.100', position: 'relative' }}>
        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, bgcolor: 'primary.main', transition: 'width .3s ease', borderRadius: '0 4px 4px 0' }} />
      </Box>
      {/* Image header with gradient overlay */}
      <Box sx={{ position: 'relative', width: '100%', height: { xs: 200, sm: 240 }, overflow: 'hidden' }}>
        <Box
          component="img"
          src={property.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop'}
          alt={property.address}
          sx={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
            }
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
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%)',
            zIndex: 1,
          }}
        />
        {/* Status badge overlay */}
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
          <Chip 
            label={status}
            size="small"
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              color: 'success.dark', 
              fontWeight: 600, 
              borderRadius: 2,
              px: 1.5,
              height: 28,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Box>
      </Box>
      <CardContent sx={{ p: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.75, color: 'text.primary' }}>
              {property.purchasePrice ? `£${property.purchasePrice.toLocaleString()}` : ''}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary', letterSpacing: '-0.01em' }} noWrap>
              {property.address}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }} noWrap>
              {property.city || ''} {property.postcode || ''}
            </Typography>
          </Box>
        </Stack>
        
        {/* Progress stepper */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: 'block', fontWeight: 500, fontSize: '0.875rem' }}>
            Progress: {completedSteps}/{totalSteps} stages
          </Typography>
          <Stepper 
            activeStep={completedSteps} 
            alternativeLabel 
            size="small"
            sx={{
              '& .MuiStepLabel-root': {
                '& .MuiStepLabel-label': { 
                  fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                  fontWeight: 500,
                  lineHeight: 1.4,
                }
              },
              '& .MuiStepConnector-line': {
                borderTopWidth: 2,
                borderColor: 'grey.200',
              },
              '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                borderColor: 'primary.main',
              },
              '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                borderColor: 'primary.main',
              },
            }}
          >
            {UK_STAGES.slice(0, 4).map((stage, index) => (
              <Step key={stage}>
                <StepLabel 
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
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, display: 'block', fontWeight: 500, fontSize: '0.875rem' }}>
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
    <Card sx={{ mt: 3, borderRadius: 2 }} elevation={3}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary', letterSpacing: '-0.01em' }}>
          Transaction Team
        </Typography>
        <Stack spacing={2.5}>
          {teamMembers.map((member, index) => (
            <Box key={member.name}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar 
                  sx={{ 
                    width: 44, 
                    height: 44, 
                    bgcolor: 'primary.main',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    boxShadow: '0px 4px 12px rgba(127, 86, 217, 0.25)',
                  }}
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.4, color: 'text.primary', mb: 0.25 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                    {member.role}
                  </Typography>
                </Box>
                <Chip 
                  label={member.status}
                  size="small"
                  sx={{ 
                    fontSize: '0.75rem',
                    height: 26,
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: member.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 
                            member.status === 'Working' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(127, 86, 217, 0.1)',
                    color: member.status === 'Active' ? 'success.dark' : 
                           member.status === 'Working' ? 'warning.dark' : 'primary.dark'
                  }}
                />
              </Stack>
              {index < teamMembers.length - 1 && <Divider sx={{ mt: 2.5, borderColor: 'grey.200' }} />}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

const WhatNext = ({ role = 'Buyer' }) => {
  const items = role === 'Agent' ? ['Share sale details', 'Confirm viewing feedback'] : role.includes('Solicitor') ? ['Send draft pack', 'Confirm ID checks'] : ['Provide proof of funds', 'Complete ID/AML']
  return (
    <Card sx={{ mb: 3, borderRadius: 2 }} elevation={3}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'text.primary', letterSpacing: '-0.01em' }}>
          What's next for you
        </Typography>
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          {items.slice(0,2).map((t) => (
            <Chip 
              key={t} 
              label={t} 
              size="medium" 
              sx={{ 
                bgcolor: 'grey.100', 
                height: 36, 
                borderRadius: 2, 
                fontWeight: 500,
                fontSize: '0.875rem',
                px: 1.5,
                '&:hover': {
                  bgcolor: 'grey.200',
                }
              }} 
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

const TransactionsDashboard = ({ onOpenTransaction, currentUser, showTeam = true, loading = false }) => {
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
      <WhatNext role={currentUser?.role} />
      <Box sx={{ 
        maxWidth: { xs: '100%', sm: 640, md: 720 },
        width: '100%'
      }}>
        {loading && <TransactionCardSkeleton />}
        {displayProperties.map((property, index) => (
          <Box key={property.id} sx={{ mb: 3 }}>
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


