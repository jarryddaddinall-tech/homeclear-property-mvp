import React, { useState } from 'react'
import { Box, Typography, Grid, Card, CardContent, Stack } from '@mui/material'
import { TrendingUp, Home, Construction } from '@mui/icons-material'
import PropertyCard from '../properties/PropertyCard'
import AddPropertyForm from '../properties/AddPropertyForm'
import EmptyState from '../shared/EmptyState'

const InvestorDashboard = ({ properties, onPropertyClick, onAddProperty, ...props }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  // Calculate summary stats
  const totalProperties = properties.length
  const occupiedProperties = properties.filter(p => p.tenantStatus === 'occupied').length
  const vacantProperties = properties.filter(p => p.tenantStatus === 'vacant').length
  const underRenovation = properties.filter(p => p.status === 'under-renovation').length
  const totalMonthlyRent = properties
    .filter(p => p.monthlyRent > 0)
    .reduce((sum, p) => sum + p.monthlyRent, 0)

  if (properties.length === 0) {
    return (
      <EmptyState
        icon="folder"
        title="No rental properties yet"
        description="Start tracking your rental property portfolio. Add properties to monitor tenant status and rental income."
        actionText="Add First Property"
        onAction={onAddProperty}
      />
    )
  }

  return (
    <Box {...props}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, color: 'text.primary' }}>
          Rental Portfolio
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your rental properties and track tenant status.
        </Typography>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Home sx={{ color: 'primary.main', fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {totalProperties}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Properties
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <TrendingUp sx={{ color: '#6B6B6B', fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {occupiedProperties}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Occupied
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Construction sx={{ color: 'warning.main', fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {underRenovation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Under Renovation
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <TrendingUp sx={{ color: 'primary.main', fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  £{totalMonthlyRent.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly Income
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Properties Grid */}
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={property.id}>
            <PropertyCard
              property={property}
              onClick={() => onPropertyClick(property)}
            />
          </Grid>
        ))}
        
        {/* Add Property Card */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              border: '2px dashed',
              borderColor: 'grey.300',
              bgcolor: 'grey.50',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: 'grey.100',
                borderColor: 'primary.main'
              }
            }}
            onClick={() => setShowAddForm(true)}
          >
            <Home sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500, mb: 0.5, color: 'text.primary' }}>
              Add New Property
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Track a new rental property
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Add Property Form */}
      <AddPropertyForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={(newProperty) => {
          onAddProperty(newProperty)
          setShowAddForm(false)
        }}
      />
    </Box>
  )
}

export default InvestorDashboard
