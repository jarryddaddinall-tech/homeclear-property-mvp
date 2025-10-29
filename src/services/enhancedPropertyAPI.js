// Enhanced property API service with real data integration
import { zooplaAPI } from './zooplaAPI'

export const enhancedPropertyAPI = {
  // Get comprehensive property data
  getPropertyData: async (address) => {
    try {
      // Extract postcode from address
      const postcode = extractPostcode(address)
      if (!postcode) {
        return getFallbackData(address)
      }

      // Get multiple data points in parallel
      const [propertyDetails, areaStats, rentalEstimate, soldPrices] = await Promise.all([
        zooplaAPI.getPropertyDetails(postcode),
        zooplaAPI.getAreaStats(postcode),
        zooplaAPI.getRentalEstimate(postcode, 2), // Default to 2 bedrooms
        zooplaAPI.getSoldPrices(postcode)
      ])

      return {
        success: true,
        data: {
          address,
          postcode,
          propertyDetails,
          areaStats,
          rentalEstimate,
          soldPrices,
          lastUpdated: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Enhanced property API error:', error)
      return getFallbackData(address)
    }
  },

  // Get market trends for an area
  getMarketTrends: async (postcode) => {
    try {
      const areaStats = await zooplaAPI.getAreaStats(postcode)
      if (!areaStats) return null

      return {
        success: true,
        trends: {
          averagePrice: areaStats.average_price,
          priceChange: areaStats.price_change,
          transactions: areaStats.transactions,
          period: areaStats.period
        }
      }
    } catch (error) {
      console.error('Market trends error:', error)
      return null
    }
  },

  // Get rental yield analysis
  getRentalAnalysis: async (address, bedrooms = 2) => {
    try {
      const postcode = extractPostcode(address)
      if (!postcode) return null

      const [propertyDetails, rentalEstimate] = await Promise.all([
        zooplaAPI.getPropertyDetails(postcode),
        zooplaAPI.getRentalEstimate(postcode, bedrooms)
      ])

      if (!propertyDetails || !rentalEstimate) return null

      const averagePrice = propertyDetails.average_price
      const monthlyRent = rentalEstimate.average_rent
      const annualRent = monthlyRent * 12
      const rentalYield = (annualRent / averagePrice) * 100

      return {
        success: true,
        analysis: {
          averagePrice,
          monthlyRent,
          annualRent,
          rentalYield: Math.round(rentalYield * 100) / 100,
          bedrooms
        }
      }
    } catch (error) {
      console.error('Rental analysis error:', error)
      return null
    }
  },

  // Get comparable properties
  getComparableProperties: async (address, radius = 1) => {
    try {
      const postcode = extractPostcode(address)
      if (!postcode) return null

      const soldPrices = await zooplaAPI.getSoldPrices(postcode, radius)
      if (!soldPrices) return null

      return {
        success: true,
        comparables: soldPrices.listing.map(property => ({
          address: property.displayable_address,
          price: property.price,
          date: property.date,
          bedrooms: property.num_bedrooms,
          propertyType: property.property_type
        }))
      }
    } catch (error) {
      console.error('Comparable properties error:', error)
      return null
    }
  }
}

// Helper function to extract postcode from address
function extractPostcode(address) {
  const postcodeRegex = /[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2}/i
  const match = address.match(postcodeRegex)
  return match ? match[0] : null
}

// Fallback data when API fails
function getFallbackData(address) {
  return {
    success: false,
    data: {
      address,
      estimatedValue: null,
      marketTrends: null,
      rentalEstimate: null,
      lastUpdated: new Date().toISOString(),
      source: 'fallback'
    }
  }
}

// Mock data for development (when APIs aren't available)
export const mockPropertyData = {
  getPropertyData: async (address) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      data: {
        address,
        estimatedValue: Math.floor(Math.random() * 500000) + 200000,
        marketTrends: {
          averagePrice: Math.floor(Math.random() * 400000) + 250000,
          priceChange: (Math.random() - 0.5) * 10, // -5% to +5%
          transactions: Math.floor(Math.random() * 50) + 10
        },
        rentalEstimate: {
          monthly: Math.floor(Math.random() * 2000) + 1000,
          annual: Math.floor(Math.random() * 24000) + 12000
        },
        lastUpdated: new Date().toISOString(),
        source: 'mock'
      }
    }
  }
}
