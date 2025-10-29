// Property Data API Service - Free UK APIs integration
// No API keys required - uses open government data

export const propertyDataAPI = {
  // Get property value from UK Land Registry
  getPropertyValue: async (postcode) => {
    try {
      // Extract postcode from address if needed
      const cleanPostcode = extractPostcode(postcode)
      if (!cleanPostcode) {
        return { success: false, error: 'Invalid postcode' }
      }

      // UK Land Registry Price Paid Data API
      const response = await fetch(
        `https://landregistry.data.gov.uk/data/ppi/transaction-record.json?postcode=${encodeURIComponent(cleanPostcode)}&limit=10`
      )
      
      if (!response.ok) {
        throw new Error(`Land Registry API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.result && data.result.items && data.result.items.length > 0) {
        const transactions = data.result.items
        const latestTransaction = transactions[0]
        const averagePrice = transactions.reduce((sum, t) => sum + parseInt(t.price), 0) / transactions.length
        
        return {
          success: true,
          data: {
            latestPrice: parseInt(latestTransaction.price),
            latestDate: latestTransaction.date,
            averagePrice: Math.round(averagePrice),
            transactionCount: transactions.length,
            source: 'Land Registry'
          }
        }
      }
      
      return { success: false, error: 'No data found' }
    } catch (error) {
      console.error('Property value API error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get area statistics from postcodes.io
  getAreaStatistics: async (postcode) => {
    try {
      const cleanPostcode = extractPostcode(postcode)
      if (!cleanPostcode) {
        return { success: false, error: 'Invalid postcode' }
      }

      const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleanPostcode)}`)
      
      if (!response.ok) {
        throw new Error(`Postcodes API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status === 200 && data.result) {
        return {
          success: true,
          data: {
            postcode: data.result.postcode,
            district: data.result.admin_district,
            ward: data.result.admin_ward,
            region: data.result.region,
            country: data.result.country,
            coordinates: {
              latitude: data.result.latitude,
              longitude: data.result.longitude
            }
          }
        }
      }
      
      return { success: false, error: 'No area data found' }
    } catch (error) {
      console.error('Area statistics API error:', error)
      return { success: false, error: error.message }
    }
  },

  // Calculate rental estimate based on area data
  calculateRentalEstimate: async (postcode, propertyType = 'house') => {
    try {
      const cleanPostcode = extractPostcode(postcode)
      if (!cleanPostcode) {
        return { success: false, error: 'Invalid postcode' }
      }

      // Get area data first
      const areaResponse = await propertyDataAPI.getAreaStatistics(cleanPostcode)
      if (!areaResponse.success) {
        return areaResponse
      }

      // Get property values
      const valueResponse = await propertyDataAPI.getPropertyValue(cleanPostcode)
      if (!valueResponse.success) {
        return valueResponse
      }

      // Calculate rental estimate (rough UK average: 4-6% yield)
      const propertyValue = valueResponse.data.averagePrice
      const rentalYield = propertyType === 'flat' ? 0.05 : 0.045 // Flats typically higher yield
      const annualRent = propertyValue * rentalYield
      const monthlyRent = annualRent / 12

      return {
        success: true,
        data: {
          monthlyRent: Math.round(monthlyRent),
          annualRent: Math.round(annualRent),
          rentalYield: Math.round(rentalYield * 100 * 100) / 100, // Convert to percentage
          propertyValue,
          propertyType,
          source: 'Calculated from Land Registry data'
        }
      }
    } catch (error) {
      console.error('Rental estimate calculation error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get market trends (simplified version using Land Registry data)
  getMarketTrends: async (postcode) => {
    try {
      const cleanPostcode = extractPostcode(postcode)
      if (!cleanPostcode) {
        return { success: false, error: 'Invalid postcode' }
      }

      // Get recent transactions to analyze trends
      const response = await fetch(
        `https://landregistry.data.gov.uk/data/ppi/transaction-record.json?postcode=${encodeURIComponent(cleanPostcode)}&limit=20`
      )
      
      if (!response.ok) {
        throw new Error(`Land Registry API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.result && data.result.items && data.result.items.length > 0) {
        const transactions = data.result.items
        const currentYear = new Date().getFullYear()
        const lastYear = currentYear - 1
        
        // Filter transactions by year
        const currentYearTransactions = transactions.filter(t => 
          new Date(t.date).getFullYear() === currentYear
        )
        const lastYearTransactions = transactions.filter(t => 
          new Date(t.date).getFullYear() === lastYear
        )
        
        if (currentYearTransactions.length > 0 && lastYearTransactions.length > 0) {
          const currentAvg = currentYearTransactions.reduce((sum, t) => sum + parseInt(t.price), 0) / currentYearTransactions.length
          const lastYearAvg = lastYearTransactions.reduce((sum, t) => sum + parseInt(t.price), 0) / lastYearTransactions.length
          const priceChange = ((currentAvg - lastYearAvg) / lastYearAvg) * 100
          
          return {
            success: true,
            data: {
              priceChange: Math.round(priceChange * 100) / 100,
              currentYearAverage: Math.round(currentAvg),
              lastYearAverage: Math.round(lastYearAvg),
              transactionCount: transactions.length,
              trend: priceChange > 0 ? 'rising' : priceChange < 0 ? 'falling' : 'stable',
              source: 'Land Registry analysis'
            }
          }
        }
      }
      
      return { success: false, error: 'Insufficient data for trend analysis' }
    } catch (error) {
      console.error('Market trends API error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get comprehensive property data
  getComprehensiveData: async (address) => {
    try {
      const postcode = extractPostcode(address)
      if (!postcode) {
        return { success: false, error: 'Could not extract postcode from address' }
      }

      // Fetch all data in parallel
      const [valueData, areaData, rentalData, trendsData] = await Promise.all([
        propertyDataAPI.getPropertyValue(postcode),
        propertyDataAPI.getAreaStatistics(postcode),
        propertyDataAPI.calculateRentalEstimate(postcode),
        propertyDataAPI.getMarketTrends(postcode)
      ])

      return {
        success: true,
        data: {
          address,
          postcode,
          propertyValue: valueData.success ? valueData.data : null,
          areaInfo: areaData.success ? areaData.data : null,
          rentalEstimate: rentalData.success ? rentalData.data : null,
          marketTrends: trendsData.success ? trendsData.data : null,
          lastUpdated: new Date().toISOString(),
          dataQuality: {
            hasValueData: valueData.success,
            hasAreaData: areaData.success,
            hasRentalData: rentalData.success,
            hasTrendsData: trendsData.success
          }
        }
      }
    } catch (error) {
      console.error('Comprehensive property data error:', error)
      return { success: false, error: error.message }
    }
  }
}

// Helper function to extract postcode from address
function extractPostcode(address) {
  if (!address) return null
  
  // UK postcode regex pattern
  const postcodeRegex = /[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2}/i
  const match = address.match(postcodeRegex)
  return match ? match[0].toUpperCase() : null
}

// Mock data fallback for development/offline use
export const mockPropertyData = {
  getComprehensiveData: async (address) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const postcode = extractPostcode(address) || 'SW1A 1AA'
    const baseValue = Math.floor(Math.random() * 300000) + 200000
    
    return {
      success: true,
      data: {
        address,
        postcode,
        propertyValue: {
          latestPrice: baseValue,
          latestDate: '2023-06-15',
          averagePrice: Math.round(baseValue * 0.95),
          transactionCount: Math.floor(Math.random() * 20) + 5,
          source: 'Land Registry (Mock)'
        },
        areaInfo: {
          postcode,
          district: 'Westminster',
          ward: 'St James\'s',
          region: 'London',
          country: 'England',
          coordinates: {
            latitude: 51.5074,
            longitude: -0.1278
          }
        },
        rentalEstimate: {
          monthlyRent: Math.round(baseValue * 0.004),
          annualRent: Math.round(baseValue * 0.048),
          rentalYield: 4.8,
          propertyValue: baseValue,
          propertyType: 'house',
          source: 'Calculated from Land Registry data (Mock)'
        },
        marketTrends: {
          priceChange: (Math.random() - 0.5) * 20, // -10% to +10%
          currentYearAverage: baseValue,
          lastYearAverage: Math.round(baseValue * 0.95),
          transactionCount: Math.floor(Math.random() * 30) + 10,
          trend: 'rising',
          source: 'Land Registry analysis (Mock)'
        },
        lastUpdated: new Date().toISOString(),
        dataQuality: {
          hasValueData: true,
          hasAreaData: true,
          hasRentalData: true,
          hasTrendsData: true
        }
      }
    }
  }
}
