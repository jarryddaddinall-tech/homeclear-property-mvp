import React from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, Chip, Stack } from '@mui/material'
import { Home, LocalShipping, Bolt, CleaningServices } from '@mui/icons-material'

const ServiceCard = ({ icon: Icon, title, subtitle, perks = [], cta = 'Get quote', onSelect }) => (
  <Card 
    elevation={3}
    sx={{ 
      height: '100%', 
      cursor: 'pointer', 
      borderRadius: 2,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': { 
        transform: 'translateY(-6px)', 
        boxShadow: '0px 16px 48px rgba(0, 0, 0, 0.12), 0px 4px 12px rgba(0, 0, 0, 0.08)',
      } 
    }} 
    onClick={onSelect}
  >
    <CardContent sx={{ p: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
        <Box sx={{ 
          width: 48, 
          height: 48, 
          borderRadius: 2, 
          bgcolor: 'primary.main', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0px 4px 12px rgba(127, 86, 217, 0.3)',
        }}>
          <Icon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.01em', color: 'text.primary' }}>{title}</Typography>
      </Stack>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>{subtitle}</Typography>
      <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3 }}>
        {perks.map((p, i) => (
          <Chip 
            key={i} 
            label={p} 
            size="small" 
            sx={{ 
              bgcolor: 'grey.100',
              fontWeight: 500,
              height: 28,
              borderRadius: 2,
              fontSize: '0.75rem',
            }} 
          />
        ))}
      </Stack>
      <Button variant="contained" size="medium" onClick={onSelect} fullWidth sx={{ fontWeight: 600 }}>{cta}</Button>
    </CardContent>
  </Card>
)

const ServicesView = () => {
  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1.5, letterSpacing: '-0.02em', color: 'text.primary' }}>
          Services
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Essential services to support your property journey.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={4}>
          <ServiceCard
            icon={Home}
            title="Home Insurance"
            subtitle="Buildings and contents, exchange-to-completion cover."
            perks={["Exchange cover", "Contents included", "Fast quote"]}
            cta="Compare quotes"
            onSelect={() => {}}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ServiceCard
            icon={LocalShipping}
            title="Moving Services"
            subtitle="Trusted removals with packing and storage options."
            perks={["Fixed price", "Packing", "Storage"]}
            cta="Book removal"
            onSelect={() => {}}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ServiceCard
            icon={Bolt}
            title="Broadband & Utilities"
            subtitle="Switch to great value providers in minutes."
            perks={["Same-day switch", "Bundle deals", "No exit fees"]}
            cta="See deals"
            onSelect={() => {}}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ServiceCard
            icon={CleaningServices}
            title="End of Tenancy Clean"
            subtitle="Professional deep clean before handover."
            perks={["Fixed slots", "Checked checklist", "Receipt provided"]}
            cta="Get quote"
            onSelect={() => {}}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ServicesView
