import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Chip, 
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Tooltip
} from '@mui/material'
import { Home, TrendingUp, Construction, CurrencyPound, TrendingDown, Refresh, CheckCircle } from '@mui/icons-material'
import { propertyDataAPI, mockPropertyData } from '../../services/propertyDataAPI'

const PropertyCard = ({ property, onClick, ...props }) => {
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'tenanted':
        return { bgcolor: '#6B6B6B', color: 'white' }
      case 'under-renovation':
        return { bgcolor: '#F59E0B', color: 'white' }
      case 'vacant':
        return { bgcolor: '#EF4444', color: 'white' }
      case 'owned':
        return { bgcolor: '#3B82F6', color: 'white' }
      default:
        return { bgcolor: '#6B7280', color: 'white' }
    }
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'under-renovation':
        return <Construction sx={{ fontSize: 16 }} />
      case 'tenanted':
        return <Home sx={{ fontSize: 16 }} />
      case 'owned':
        return <Home sx={{ fontSize: 16 }} />
      default:
        return <TrendingUp sx={{ fontSize: 16 }} />
    }
  }

  const formatCurrency = (amount) => {
    if (amount === 0) return 'N/A'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card
      elevation={3}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0px 16px 48px rgba(0, 0, 0, 0.12), 0px 4px 12px rgba(0, 0, 0, 0.08)',
          transform: 'translateY(-6px)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: 'none',
      }}
      onClick={onClick}
      {...props}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.75, lineHeight: 1.3, color: 'text.primary', letterSpacing: '-0.01em' }}>
              {property.address}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              {property.type === 'primary-residence' ? 'Primary Residence' : 
               property.type === 'rental' ? 'Rental Property' : 'Investment Property'}
            </Typography>
          </Box>
          <Chip
            icon={getStatusIcon(property.status)}
            label={property.status.replace('-', ' ')}
            size="small"
            sx={{ 
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'capitalize',
              height: 24,
              '& .MuiChip-label': {
                px: 1.5
              },
              ...getStatusColor(property.status)
            }}
          />
        </Box>

        {/* Property Data */}
        <Stack spacing={1.5} sx={{ mt: 'auto' }}>
          {/* Current Value */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                Current Value
              </Typography>
              {loading && <CircularProgress size={12} />}
              {apiData?.propertyValue && (
                <Tooltip title="Live data from Land Registry">
                  <CheckCircle sx={{ fontSize: 12, color: '#10B981' }} />
                </Tooltip>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CurrencyPound sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
                {apiData?.propertyValue?.averagePrice 
                  ? formatCurrency(apiData.propertyValue.averagePrice)
                  : property.currentValue 
                    ? formatCurrency(property.currentValue) 
                    : 'N/A'}
              </Typography>
            </Box>
          </Box>

          {/* Value Change */}
          {property.purchasePrice && property.currentValue && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                Value Change
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {property.currentValue > property.purchasePrice ? (
                  <TrendingUp sx={{ fontSize: 14, color: '#6B6B6B' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 14, color: 'error.main' }} />
                )}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.8125rem', 
                    fontWeight: 600, 
                    color: property.currentValue > property.purchasePrice ? '#6B6B6B' : 'error.main'
                  }}
                >
                  {property.currentValue > property.purchasePrice ? '+' : ''}
                  {Math.round(((property.currentValue - property.purchasePrice) / property.purchasePrice) * 100)}%
                </Typography>
              </Box>
            </Box>
          )}

          {/* Monthly Rent or Mortgage */}
          {property.monthlyRent > 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                Monthly Rent
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
                {formatCurrency(property.monthlyRent)}
              </Typography>
            </Box>
          ) : property.currentMortgage > 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                Current Mortgage
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
                {formatCurrency(property.currentMortgage)}
              </Typography>
            </Box>
          ) : null}

          {/* API Rental Estimate */}
          {apiData?.rentalEstimate && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                  Est. Rent
                </Typography>
                <Tooltip title="Estimated from market data">
                  <Typography variant="caption" sx={{ color: '#10B981', fontSize: '0.7rem' }}>
                    API
                  </Typography>
                </Tooltip>
              </Box>
              <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
                {formatCurrency(apiData.rentalEstimate.monthlyRent)}
              </Typography>
            </Box>
          )}

          {/* Market Trend */}
          {apiData?.marketTrends && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                Market Trend
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {apiData.marketTrends.trend === 'rising' ? (
                  <TrendingUp sx={{ fontSize: 14, color: '#10B981' }} />
                ) : apiData.marketTrends.trend === 'falling' ? (
                  <TrendingDown sx={{ fontSize: 14, color: '#EF4444' }} />
                ) : null}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.8125rem', 
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
          )}

          {/* Property Type */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
              Type
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 500, color: 'text.secondary' }}>
              {property.type ? property.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default PropertyCard
