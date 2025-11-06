import React, { useState } from 'react'
import { Box, Typography, Grid, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { Add, MoreVert, Edit, Delete } from '@mui/icons-material'
import PropertyCard from './PropertyCard'
import AddPropertyForm from './AddPropertyForm'
import EmptyState from '../shared/EmptyState'

const PropertiesView = ({ properties, onPropertyClick, onAddProperty, onEditProperty, onDeleteProperty, ...props }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)

  if (properties.length === 0) {
    return (
      <EmptyState
        icon="home"
        title="No properties yet"
        description="Add your properties to track their value, rental income, and market performance."
        actionText="Add First Property"
        onAction={() => setShowAddForm(true)}
      />
    )
  }

  return (
    <Box {...props}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 1.5, color: 'text.primary', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Properties
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Manage your property portfolio and track market performance.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {properties.map((property) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={property.id}>
            <Box sx={{ position: 'relative' }}>
              <PropertyCard
                property={property}
                onClick={() => onPropertyClick(property)}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setAnchorEl(e.currentTarget)
                  setSelectedProperty(property)
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>
          </Grid>
        ))}

        {/* Add Property Card */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '2px dashed',
              borderColor: 'grey.300',
              bgcolor: 'grey.50',
              borderRadius: 2,
              p: 5,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 320,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: 'grey.100',
                borderColor: 'primary.main',
                transform: 'translateY(-4px)',
                boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.10), 0px 4px 8px rgba(0, 0, 0, 0.06)',
              }
            }}
            onClick={() => setShowAddForm(true)}
          >
            <Add sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 0.75, color: 'text.primary' }}>
              Add New Property
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Track a new property
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Add/Edit Property Form */}
      <AddPropertyForm
        open={showAddForm || !!editingProperty}
        onClose={() => {
          setShowAddForm(false)
          setEditingProperty(null)
        }}
        onSave={(propertyData) => {
          if (editingProperty) {
            onEditProperty(editingProperty.id, propertyData)
            setEditingProperty(null)
          } else {
            onAddProperty(propertyData)
          }
          setShowAddForm(false)
        }}
        initialData={editingProperty}
      />

      {/* Property Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setEditingProperty(selectedProperty)
            setAnchorEl(null)
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Property</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedProperty && onDeleteProperty) {
              onDeleteProperty(selectedProperty.id)
            }
            setAnchorEl(null)
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete Property</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default PropertiesView
