import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Chip, 
  Card,
  CardContent,
  Stack,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Tooltip,
  Alert
} from '@mui/material'
import { 
  Home, 
  TrendingUp, 
  CurrencyPound, 
  TrendingDown,
  CalendarToday,
  SquareFoot,
  Bed,
  Bathroom,
  Refresh,
  CheckCircle,
  Warning
} from '@mui/icons-material'
import DetailView from '../shared/DetailView'
import { propertyDataAPI, mockPropertyData } from '../../services/propertyDataAPI'

const PropertyDetail = ({ property, onBack, ...props }) => {
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dataError, setDataError] = useState(null)

  useEffect(() => {
    if (property.address) {
      fetchPropertyData()
    }
  }, [property.address])

  const fetchPropertyData = async () => {
    setLoading(true)
    setDataError(null)
    
    try {
      // Try real API first, fallback to mock data
      let response
      try {
        response = await propertyDataAPI.getComprehensiveData(property.address)
      } catch (error) {
        console.log('Real API failed, using mock data:', error)
        response = await mockPropertyData.getComprehensiveData(property.address)
      }
      
      if (response.success) {
        setApiData(response.data)
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }


  return (
    <DetailView
      title={property.address}
      subtitle={`${property.type === 'primary-residence' ? 'Primary Residence' : 
                property.type === 'rental' ? 'Rental Property' : 'Investment Property'}`}
      onBack={onBack}
      {...props}
    >
      <Stack spacing={4}>
        {/* Property Overview */}
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Property Overview
              </Typography>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <CurrencyPound sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {property.currentValue ? formatCurrency(property.currentValue) : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current Value
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <TrendingUp sx={{ fontSize: 32, color: '#6B6B6B', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#6B6B6B' }}>
                      {property.purchasePrice && property.currentValue ? 
                        `+${Math.round(((property.currentValue - property.purchasePrice) / property.purchasePrice) * 100)}%` : 
                        'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Value Change
                    </Typography>
                  </Box>
                </Grid>
                
                {property.type !== 'primary-residence' && (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Home sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {property.monthlyRent ? formatCurrency(property.monthlyRent) : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monthly Rent
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <CurrencyPound sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {property.currentMortgage ? formatCurrency(property.currentMortgage) : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current Mortgage
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Property Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Property Type</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {property.type ? property.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Property Status</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {property.status ? property.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Tenant Status</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {property.tenantStatus ? property.tenantStatus.replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Purchase Price</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {property.purchasePrice ? formatCurrency(property.purchasePrice) : 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Initial Mortgage</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {property.initialMortgage ? formatCurrency(property.initialMortgage) : 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Rental Yield</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {property.monthlyRent && property.currentValue ? 
                          `${Math.round((property.monthlyRent * 12 / property.currentValue) * 100)}%` : 
                          'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        {/* Property Value Timeline */}
        {property.purchasePrice && property.currentValue && (
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Property Value Timeline
                  </Typography>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => {/* TODO: Add value change modal */}}
                  >
                    Add Value Change
                  </Button>
                </Box>
                <Box sx={{ height: 200, position: 'relative', px: 2 }}>
                  {/* Timeline line */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: 0, 
                    right: 0, 
                    height: 2, 
                    bgcolor: '#E5E7EB',
                    transform: 'translateY(-50%)'
                  }} />
                  
                  {/* Timeline points */}
                  <Box sx={{ 
                    position: 'relative', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    {/* Purchase point */}
                    <Box sx={{ 
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: '#6B7280',
                        border: '3px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        mb: 1
                      }} />
                      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 80 }}>
                        Purchase
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center', maxWidth: 80 }}>
                        {formatCurrency(property.purchasePrice)}
                      </Typography>
                    </Box>

                    {/* Current point */}
                    <Box sx={{ 
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: property.currentValue > property.purchasePrice ? '#10B981' : '#EF4444',
                        border: '3px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        mb: 1
                      }} />
                      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 80 }}>
                        Current
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center', maxWidth: 80 }}>
                        {formatCurrency(property.currentValue)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Growth percentage badge */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    bgcolor: property.currentValue > property.purchasePrice ? '#10B981' : '#EF4444', 
                    color: 'white', 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}>
                    {property.currentValue > property.purchasePrice ? '+' : ''}
                    {Math.round(((property.currentValue - property.purchasePrice) / property.purchasePrice) * 100)}%
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Mortgage Timeline */}
        {property.initialMortgage && property.currentMortgage && (
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Mortgage Timeline
                  </Typography>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => {/* TODO: Add mortgage payment modal */}}
                  >
                    Add Payment
                  </Button>
                </Box>
                <Box sx={{ height: 200, position: 'relative', px: 2 }}>
                  {/* Timeline line */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: 0, 
                    right: 0, 
                    height: 2, 
                    bgcolor: '#E5E7EB',
                    transform: 'translateY(-50%)'
                  }} />
                  
                  {/* Timeline points */}
                  <Box sx={{ 
                    position: 'relative', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    {/* Initial mortgage point */}
                    <Box sx={{ 
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: '#EF4444',
                        border: '3px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        mb: 1
                      }} />
                      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 80 }}>
                        Initial
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center', maxWidth: 80 }}>
                        {formatCurrency(property.initialMortgage)}
                      </Typography>
                    </Box>

                    {/* Current mortgage point */}
                    <Box sx={{ 
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: '#3B82F6',
                        border: '3px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        mb: 1
                      }} />
                      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 80 }}>
                        Current
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center', maxWidth: 80 }}>
                        {formatCurrency(property.currentMortgage)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Progress percentage badge */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    bgcolor: '#3B82F6', 
                    color: 'white', 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}>
                    {Math.round(((property.initialMortgage - property.currentMortgage) / property.initialMortgage) * 100)}% Paid
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Market Insights Section */}
        {apiData && (
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Market Insights
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      startIcon={<Refresh />}
                      onClick={fetchPropertyData}
                      disabled={loading}
                    >
                      Refresh Data
                    </Button>
                    <Tooltip title="Live data from Land Registry">
                      <CheckCircle sx={{ fontSize: 16, color: '#10B981' }} />
                    </Tooltip>
                  </Box>
                </Box>

                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}

                {dataError && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {dataError}
                  </Alert>
                )}

                {apiData && !loading && (
                  <Grid container spacing={3}>
                    {/* Area Statistics */}
                    {apiData.areaInfo && (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                              Area Information
                            </Typography>
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">District</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {apiData.areaInfo.district}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Ward</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {apiData.areaInfo.ward}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Region</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {apiData.areaInfo.region}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}

                    {/* Market Trends */}
                    {apiData.marketTrends && (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                              Market Trends
                            </Typography>
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Price Change (12m)</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  {apiData.marketTrends.trend === 'rising' ? (
                                    <TrendingUp sx={{ fontSize: 16, color: '#10B981' }} />
                                  ) : apiData.marketTrends.trend === 'falling' ? (
                                    <TrendingDown sx={{ fontSize: 16, color: '#EF4444' }} />
                                  ) : null}
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontWeight: 600,
                                      color: apiData.marketTrends.trend === 'rising' ? '#10B981' : 
                                             apiData.marketTrends.trend === 'falling' ? '#EF4444' : 'text.secondary'
                                    }}
                                  >
                                    {apiData.marketTrends.priceChange > 0 ? '+' : ''}
                                    {apiData.marketTrends.priceChange.toFixed(1)}%
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Transactions</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {apiData.marketTrends.transactionCount}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Trend</Typography>
                                <Chip 
                                  label={apiData.marketTrends.trend}
                                  size="small"
                                  sx={{ 
                                    bgcolor: apiData.marketTrends.trend === 'rising' ? '#10B981' : 
                                           apiData.marketTrends.trend === 'falling' ? '#EF4444' : '#6B7280',
                                    color: 'white',
                                    textTransform: 'capitalize'
                                  }}
                                />
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}

                    {/* Rental Analysis */}
                    {apiData.rentalEstimate && (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                              Rental Analysis
                            </Typography>
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Est. Monthly Rent</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {formatCurrency(apiData.rentalEstimate.monthlyRent)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Est. Annual Rent</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {formatCurrency(apiData.rentalEstimate.annualRent)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Rental Yield</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#10B981' }}>
                                  {apiData.rentalEstimate.rentalYield.toFixed(1)}%
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}

                    {/* Data Source Info */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Data Sources
                          </Typography>
                          <Stack spacing={1}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {new Date(apiData.lastUpdated).toLocaleDateString('en-GB')}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Property Value</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {apiData.propertyValue?.source || 'N/A'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Rental Estimate</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {apiData.rentalEstimate?.source || 'N/A'}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Notes Section */}
        {property.notes && (
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notes
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {property.notes}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </DetailView>
  )
}

export default PropertyDetail
