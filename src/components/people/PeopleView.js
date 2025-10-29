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
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar 
          sx={{ 
            width: 48, 
            height: 48, 
            bgcolor: 'primary.main',
            fontSize: '1.25rem',
            fontWeight: 600
          }}
        >
          {person.name.split(' ').map(n => n[0]).join('')}
        </Avatar>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {person.name}
          </Typography>
          
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Chip 
              label={person.role} 
              size="small"
              variant="filled"
              sx={{
                bgcolor: 'grey.50',
                color: 'text.secondary',
                borderRadius: 1.5,
                height: 24,
                fontSize: '0.75rem',
                boxShadow: 'inset 0 0 0 0 rgba(0,0,0,0)'
              }}
            />
            <Chip 
              label={role} 
              size="small"
              variant="filled"
              sx={{
                bgcolor: 'grey.100',
                color: 'text.primary',
                borderRadius: 1.5,
                height: 24,
                fontSize: '0.75rem',
                boxShadow: 'inset 0 0 0 0 rgba(0,0,0,0)'
              }}
            />
          </Stack>
          
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {person.email}
              </Typography>
            </Stack>
            
            {person.phone && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
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
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
      <Icon sx={{ color: `${color}.main` }} />
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Chip 
        label={`${people.length} people`} 
        size="small"
        variant="outlined"
        sx={{ borderColor: 'grey.300', color: 'text.secondary', borderRadius: 1.5, height: 22 }}
      />
    </Stack>
    
    <Grid container spacing={2}>
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
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Transaction People
      </Typography>
      
      <Stack spacing={4}>
        <RoleSection 
          title="Buyer Side"
          people={buyerSide}
          icon={HomeWork}
          color="primary"
        />
        
        <Divider />
        
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
