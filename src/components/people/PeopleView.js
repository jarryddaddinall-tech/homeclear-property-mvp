import React from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Chip, 
  Stack,
  Divider,
  Grid
} from '@mui/material'
import { 
  Person, 
  Email, 
  Phone,
  Business,
  HomeWork,
  Gavel
} from '@mui/icons-material'

const PersonCard = ({ person, role }) => (
  <Card sx={{ height: '100%', borderRadius: 2 }} elevation={3}>
    <CardContent sx={{ p: 4 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar 
          sx={{ 
            width: 48, 
            height: 48, 
            bgcolor: 'primary.main',
            fontSize: '0.9375rem',
            fontWeight: 600,
            boxShadow: '0px 4px 12px rgba(127, 86, 217, 0.25)',
          }}
        >
          {person.name.split(' ').map(n => n[0]).join('')}
        </Avatar>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary', letterSpacing: '-0.01em' }}>
            {person.name}
          </Typography>
          
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Chip 
              label={person.role} 
              size="small"
              sx={{
                bgcolor: 'grey.100',
                color: 'text.secondary',
                borderRadius: 2,
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            />
          </Stack>
          
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                {person.email}
              </Typography>
            </Stack>
            
            {person.phone && (
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                  {person.phone}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>
      </Stack>
    </CardContent>
  </Card>
)

const RoleSection = ({ title, people, icon: Icon, color = 'primary' }) => (
  <Box>
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
      <Icon sx={{ color: `${color}.main`, fontSize: 28 }} />
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' }}>
        {title}
      </Typography>
    </Stack>
    
    <Grid container spacing={3}>
      {people.map((person) => (
        <Grid item xs={12} sm={6} md={4} key={person.id}>
          <PersonCard person={person} role={title} />
        </Grid>
      ))}
    </Grid>
  </Box>
)

const PeopleView = () => {
  // Mock people data organized by transaction side
  const buyerSide = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Buyer",
      email: "sarah.johnson@email.com",
      phone: "+44 7700 900123"
    },
    {
      id: 2,
      name: "Emma Williams",
      role: "Agent",
      email: "emma.williams@estateagents.com",
      phone: "+44 7700 900789"
    },
    {
      id: 3,
      name: "David Thompson",
      role: "Buyer's Solicitor",
      email: "david.thompson@lawfirm.co.uk",
      phone: "+44 7700 900012"
    }
  ]

  const sellerSide = [
    {
      id: 4,
      name: "Michael Chen",
      role: "Seller",
      email: "michael.chen@email.com",
      phone: "+44 7700 900456"
    },
    {
      id: 5,
      name: "Sarah Mitchell",
      role: "Seller's Solicitor",
      email: "sarah.mitchell@conveyancing.co.uk",
      phone: "+44 7700 900345"
    }
  ]

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 1.5, color: 'text.primary', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Transaction People
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Manage contacts for buyers, sellers, agents, and solicitors.
        </Typography>
      </Box>
      
      <Stack spacing={5}>
        <RoleSection 
          title="Buyer Side"
          people={buyerSide}
          icon={HomeWork}
          color="primary"
        />
        
        <Divider sx={{ borderColor: 'grey.200' }} />
        
        <RoleSection 
          title="Seller Side"
          people={sellerSide}
          icon={Business}
          color="secondary"
        />
      </Stack>
    </Box>
  )
}

export default PeopleView
