import React from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, Chip, Stack } from '@mui/material'
import { Home, LocalShipping, Bolt, CleaningServices } from '@mui/icons-material'

const ServiceCard = ({ icon: Icon, title, subtitle, perks = [], cta = 'Get quote', onSelect }) => (
  <Card sx={{ height: '100%', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 } }} onClick={onSelect}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <Icon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{subtitle}</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
        {perks.map((p, i) => (<Chip key={i} label={p} size="small" variant="outlined" />))}
      </Stack>
      <Button variant="contained" size="small" onClick={onSelect}>{cta}</Button>
    </CardContent>
  </Card>
)

const ServicesView = () => {
  return (
    <Box>
      <Grid container spacing={3}>
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
