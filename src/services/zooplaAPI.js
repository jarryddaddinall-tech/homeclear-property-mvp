// Zoopla API integration for property data
const ZOOPLA_API_KEY = 'your-api-key-here' // Get from https://developer.zoopla.co.uk/
const ZOOPLA_BASE_URL = 'https://api.zoopla.co.uk/api/v1'

export const zooplaAPI = {
  // Get property details by postcode
  getPropertyDetails: async (postcode) => {
    try {
      const response = await fetch(
        `${ZOOPLA_BASE_URL}/property_listings.json?postcode=${postcode}&api_key=${ZOOPLA_API_KEY}`
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Zoopla API error:', error)
      return null
    }
  },

  // Get area statistics
  getAreaStats: async (postcode) => {
    try {
      const response = await fetch(
        `${ZOOPLA_BASE_URL}/area_value_graphs.json?postcode=${postcode}&api_key=${ZOOPLA_API_KEY}`
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Zoopla area stats error:', error)
      return null
    }
  },

  // Get rental estimates
  getRentalEstimate: async (postcode, bedrooms) => {
    try {
      const response = await fetch(
        `${ZOOPLA_BASE_URL}/rental_prices.json?postcode=${postcode}&bedrooms=${bedrooms}&api_key=${ZOOPLA_API_KEY}`
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Zoopla rental estimate error:', error)
      return null
    }
  },

  // Get sold prices in area
  getSoldPrices: async (postcode, radius = 1) => {
    try {
      const response = await fetch(
        `${ZOOPLA_BASE_URL}/sold_prices.json?postcode=${postcode}&radius=${radius}&api_key=${ZOOPLA_API_KEY}`
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Zoopla sold prices error:', error)
      return null
    }
  }
}

// Alternative: RentSpree API (Global, easier setup)
export const rentSpreeAPI = {
  getRentalData: async (address) => {
    try {
      const response = await fetch(
        `https://api.rentspree.com/v1/rental-estimate?address=${encodeURIComponent(address)}`,
        {
          headers: {
            'Authorization': 'Bearer your-rentspree-token',
            'Content-Type': 'application/json'
          }
        }
      )
      const data = await response.json()
      return data
    }
  }
}

// Alternative: RealtyMole API (US-focused but has global data)
export const realtyMoleAPI = {
  getPropertyValue: async (address) => {
    try {
      const response = await fetch(
        `https://realty-mole-property-api.p.rapidapi.com/salePrice?address=${encodeURIComponent(address)}`,
        {
          headers: {
            'X-RapidAPI-Key': 'your-rapidapi-key',
            'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
          }
        }
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error('RealtyMole API error:', error)
      return null
    }
  }
}
