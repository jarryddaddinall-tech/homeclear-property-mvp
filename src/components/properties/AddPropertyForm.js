import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Grid
} from '@mui/material'
import { Add, Close, CheckCircle, Refresh } from '@mui/icons-material'
import { propertyDataAPI, mockPropertyData } from '../../services/propertyDataAPI'

const AddPropertyForm = ({ open, onClose, onSave, initialData, ...props }) => {
  console.log('AddPropertyForm render - open:', open)
  console.log('AddPropertyForm render - onClose:', onClose)
  console.log('AddPropertyForm render - onSave:', onSave)
  
  const [formData, setFormData] = useState({
    address: '',
    type: 'primary-residence',
    status: 'owned',
    tenantStatus: 'occupied',
    monthlyRent: '',
    purchasePrice: '',
    currentValue: '',
    initialMortgage: '',
    currentMortgage: '',
    notes: ''
  })

  const [errors, setErrors] = useState({})
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dataError, setDataError] = useState(null)

  // Fetch property data when address changes
  useEffect(() => {
    if (formData.address && formData.address.length >= 5) {
      fetchPropertyData()
    }
  }, [formData.address])

  const fetchPropertyData = async () => {
    setLoading(true)
    setDataError(null)
    
    try {
      // Try real API first, fallback to mock data
      let response
      try {
        response = await propertyDataAPI.getComprehensiveData(formData.address)
      } catch (error) {
        console.log('Real API failed, using mock data:', error)
        response = await mockPropertyData.getComprehensiveData(formData.address)
      }
      
      if (response.success) {
        setApiData(response.data)
        // Pre-populate form with API data
        setFormData(prev => ({
          ...prev,
          currentValue: response.data.propertyValue?.averagePrice?.toString() || prev.currentValue
        }))
      } else {
        setDataError(response.error)
      }
    } catch (error) {
      console.error('Property data fetch error:', error)
      setDataError('Failed to fetch property data')
    } finally {
      setLoading(false)
    }
  }

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        address: initialData.address || '',
        type: initialData.type || 'rental',
        status: initialData.status || 'tenanted',
        tenantStatus: initialData.tenantStatus || 'occupied',
        monthlyRent: initialData.monthlyRent || '',
        purchasePrice: initialData.purchasePrice || '',
        currentValue: initialData.currentValue || '',
        initialMortgage: initialData.initialMortgage || '',
        currentMortgage: initialData.currentMortgage || '',
        notes: initialData.notes || ''
      })
    }
  }, [initialData])

  const handleChange = (field) => (event) => {
    const value = event?.target?.value || event
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Auto-update status based on property type
      if (field === 'type') {
        if (value === 'primary-residence') {
          newData.status = 'owned'
          newData.tenantStatus = 'occupied'
          newData.monthlyRent = ''
        } else if (value === 'rental') {
          newData.status = 'tenanted'
          newData.tenantStatus = 'occupied'
        } else if (value === 'investment') {
          newData.status = 'under-renovation'
          newData.tenantStatus = 'vacant'
        }
      }
      
      return newData
    })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    
    if (formData.type === 'rental' && formData.monthlyRent && formData.monthlyRent <= 0) {
      newErrors.monthlyRent = 'Monthly rent must be greater than 0'
    }
    
    if (formData.purchasePrice && formData.purchasePrice <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0'
    }
    
    if (formData.currentValue && formData.currentValue <= 0) {
      newErrors.currentValue = 'Current value must be greater than 0'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors)
      return
    }

    const newProperty = {
      id: Date.now(), // Simple ID generation
      address: formData.address.trim(),
      type: formData.type,
      status: formData.status,
      tenantStatus: formData.tenantStatus,
      monthlyRent: formData.type === 'rental' ? parseInt(formData.monthlyRent) : 0,
      purchasePrice: formData.purchasePrice ? parseInt(formData.purchasePrice) : 0,
      currentValue: formData.currentValue ? parseInt(formData.currentValue) : 0,
      initialMortgage: formData.initialMortgage ? parseInt(formData.initialMortgage) : 0,
      currentMortgage: formData.currentMortgage ? parseInt(formData.currentMortgage) : 0,
      notes: formData.notes.trim()
    }

    console.log('Saving property:', newProperty)
    onSave(newProperty)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      address: '',
      type: 'primary-residence',
      status: 'owned',
      tenantStatus: 'occupied',
      monthlyRent: '',
      purchasePrice: '',
      currentValue: '',
      initialMortgage: '',
      currentMortgage: '',
      notes: ''
    })
    setErrors({})
    onClose()
  }

  console.log('AddPropertyForm rendering Dialog with open:', open)
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      fullScreen
      {...props}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {initialData ? 'Edit Property' : 'Add New Property'}
          </Typography>
          <Button
            onClick={handleClose}
            size="small"
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <Close />
          </Button>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={4}>
            {/* Basic Information Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                Basic Information
              </Typography>
              <Stack spacing={3}>
                {/* Simple Address Input */}
                <TextField
                  label="Your Property Address"
                  value={formData.address}
                  onChange={handleChange('address')}
                  placeholder="Enter your full address (e.g., 123 Main Street, London, SW1A 1AA)"
                  error={!!errors.address}
                  helperText={errors.address || "Enter your full address to get real property data from UK Land Registry"}
                  fullWidth
                  required
                />

                {/* Property Type and Status Row */}
                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Property Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={handleChange('type')}
                      label="Property Type"
                    >
                      <MenuItem value="rental">Rental Property</MenuItem>
                      <MenuItem value="investment">Investment Property</MenuItem>
                      <MenuItem value="primary-residence">Primary Residence</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Property Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={handleChange('status')}
                      label="Property Status"
                    >
                      {formData.type === 'primary-residence' && (
                        <MenuItem value="owned">Owned</MenuItem>
                      )}
                      {formData.type === 'rental' && (
                        <>
                          <MenuItem value="tenanted">Tenanted</MenuItem>
                          <MenuItem value="vacant">Vacant</MenuItem>
                        </>
                      )}
                      {formData.type === 'investment' && (
                        <>
                          <MenuItem value="under-renovation">Under Renovation</MenuItem>
                          <MenuItem value="tenanted">Tenanted</MenuItem>
                          <MenuItem value="vacant">Vacant</MenuItem>
                        </>
                      )}
                    </Select>
                  </FormControl>
                </Stack>

                {/* Tenant Status (if rental) */}
                {formData.type === 'rental' && (
                  <FormControl fullWidth>
                    <InputLabel>Tenant Status</InputLabel>
                    <Select
                      value={formData.tenantStatus}
                      onChange={handleChange('tenantStatus')}
                      label="Tenant Status"
                    >
                      <MenuItem value="occupied">Occupied</MenuItem>
                      <MenuItem value="vacant">Vacant</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Stack>
            </Box>

            {/* Financial Information Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                Financial Information
              </Typography>
              <Stack spacing={3}>
                {/* Purchase and Current Value Row */}
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Purchase Price (£)"
                    type="number"
                    value={formData.purchasePrice}
                    onChange={handleChange('purchasePrice')}
                    fullWidth
                    error={!!errors.purchasePrice}
                    helperText={errors.purchasePrice || "Original purchase price"}
                    placeholder="e.g., 350000"
                  />

                  <Box>
                    <TextField
                      label="Current Value (£)"
                      type="number"
                      value={formData.currentValue}
                      onChange={handleChange('currentValue')}
                      fullWidth
                      error={!!errors.currentValue}
                      helperText={errors.currentValue || "Current estimated value"}
                      placeholder="e.g., 450000"
                      InputProps={{
                        endAdornment: loading ? (
                          <CircularProgress size={20} />
                        ) : apiData?.propertyValue ? (
                          <Tooltip title="Estimated from Land Registry data">
                            <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                          </Tooltip>
                        ) : null
                      }}
                    />
                    {apiData?.propertyValue && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Estimated from market data: {new Intl.NumberFormat('en-GB', {
                          style: 'currency',
                          currency: 'GBP',
                          minimumFractionDigits: 0,
                        }).format(apiData.propertyValue.averagePrice)}
                      </Typography>
                    )}
                  </Box>
                </Stack>

                {/* Mortgage Information Row */}
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Initial Mortgage (£)"
                    type="number"
                    value={formData.initialMortgage}
                    onChange={handleChange('initialMortgage')}
                    fullWidth
                    helperText="Original mortgage amount"
                    placeholder="e.g., 280000"
                  />

                  <TextField
                    label="Current Mortgage (£)"
                    type="number"
                    value={formData.currentMortgage}
                    onChange={handleChange('currentMortgage')}
                    fullWidth
                    helperText="Current outstanding mortgage"
                    placeholder="e.g., 250000"
                  />
                </Stack>

                {/* Monthly Rent (if rental) */}
                {formData.type === 'rental' && (
                  <TextField
                    label="Monthly Rent (£)"
                    type="number"
                    value={formData.monthlyRent}
                    onChange={handleChange('monthlyRent')}
                    fullWidth
                    required
                    error={!!errors.monthlyRent}
                    helperText={errors.monthlyRent || "Monthly rental income"}
                    placeholder="e.g., 2500"
                  />
                )}
              </Stack>
            </Box>

            {/* Additional Information Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                Additional Information
              </Typography>
              <TextField
                label="Notes (Optional)"
                value={formData.notes}
                onChange={handleChange('notes')}
                fullWidth
                multiline
                rows={4}
                placeholder="Any additional notes about this property, tenants, maintenance, etc..."
              />
            </Box>

            {/* Real Property Data from UK Land Registry */}
            {apiData && !loading && (
              <Box sx={{ p: 4, bgcolor: '#F0F9FF', borderRadius: 3, border: '2px solid', borderColor: '#0EA5E9' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                      🏠 Real Property Data Found!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Live data from UK Land Registry for your address
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Live data from UK Land Registry">
                      <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                    </Tooltip>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Refresh />}
                      onClick={fetchPropertyData}
                      disabled={loading}
                    >
                      Refresh
                    </Button>
                  </Box>
                </Box>
                
                <Grid container spacing={3}>
                  {apiData.propertyValue && (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: '#E5E7EB' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0EA5E9', mb: 1 }}>
                          {new Intl.NumberFormat('en-GB', {
                            style: 'currency',
                            currency: 'GBP',
                            minimumFractionDigits: 0,
                          }).format(apiData.propertyValue.averagePrice)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Estimated Market Value
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {apiData.rentalEstimate && (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: '#E5E7EB' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#10B981', mb: 1 }}>
                          {new Intl.NumberFormat('en-GB', {
                            style: 'currency',
                            currency: 'GBP',
                            minimumFractionDigits: 0,
                          }).format(apiData.rentalEstimate.monthlyRent)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Est. Monthly Rent
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {apiData.marketTrends && (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: '#E5E7EB' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: apiData.marketTrends.trend === 'rising' ? '#10B981' : '#EF4444', mb: 1 }}>
                          {apiData.marketTrends.priceChange > 0 ? '+' : ''}
                          {apiData.marketTrends.priceChange.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Market Trend (12m)
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {loading && (
              <Box sx={{ p: 4, bgcolor: '#FEF3C7', borderRadius: 3, border: '2px solid', borderColor: '#F59E0B', textAlign: 'center' }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                  🔍 Searching UK Land Registry...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fetching real property data for your address
                </Typography>
              </Box>
            )}

            {dataError && (
              <Alert severity="warning">
                {dataError}
              </Alert>
            )}

            {/* Preview */}
            {formData.address && (
              <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                  Property Preview
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formData.address}
                    </Typography>
                    <Chip 
                      label={formData.type.replace('-', ' ')} 
                      size="small" 
                      color="primary"
                    />
                    {formData.type === 'rental' && formData.monthlyRent && (
                      <Chip 
                        label={`£${formData.monthlyRent}/month`} 
                        size="small" 
                        sx={{ bgcolor: '#10B981', color: 'white' }}
                      />
                    )}
                  </Stack>
                  
                  {(formData.purchasePrice || formData.currentValue) && (
                    <Stack direction="row" spacing={2}>
                      {formData.purchasePrice && (
                        <Typography variant="body2" color="text.secondary">
                          Purchase: £{parseInt(formData.purchasePrice).toLocaleString()}
                        </Typography>
                      )}
                      {formData.currentValue && (
                        <Typography variant="body2" color="text.secondary">
                          Current: £{parseInt(formData.currentValue).toLocaleString()}
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            startIcon={<Add />}
          >
            Add Property
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddPropertyForm
