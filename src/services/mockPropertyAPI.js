// Mock Property API Service
// Simulates real property data APIs with realistic UK property data

const mockPropertyData = {
  // Jarryd's primary residence
  "123 Maple Street, London": {
    estimatedValue: 485000,
    lastSalePrice: 420000,
    lastSaleDate: "2022-03-15",
    priceChange: "+15.5%",
    monthlyRent: 0, // Primary residence
    rentalYield: 0,
    propertyType: "Terraced House",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1200,
    yearBuilt: 1985,
    lastUpdated: "2024-01-15"
  },
  
  // Mike's rental properties
  "45 Oak Avenue, London": {
    estimatedValue: 450000,
    lastSalePrice: 380000,
    lastSaleDate: "2021-08-22",
    priceChange: "+18.4%",
    monthlyRent: 2500,
    rentalYield: 6.7,
    propertyType: "Semi-Detached",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1100,
    yearBuilt: 1990,
    lastUpdated: "2024-01-10"
  },
  
  "78 Pine Road, London": {
    estimatedValue: 380000,
    lastSalePrice: 350000,
    lastSaleDate: "2020-11-08",
    priceChange: "+8.6%",
    monthlyRent: 2200,
    rentalYield: 6.9,
    propertyType: "Terraced House",
    bedrooms: 2,
    bathrooms: 1,
    squareFootage: 950,
    yearBuilt: 1988,
    lastUpdated: "2024-01-12"
  },
  
  "92 Elm Street, London": {
    estimatedValue: 520000,
    lastSalePrice: 480000,
    lastSaleDate: "2023-05-14",
    priceChange: "+8.3%",
    monthlyRent: 2800,
    rentalYield: 6.5,
    propertyType: "Detached House",
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 1400,
    yearBuilt: 1995,
    lastUpdated: "2024-01-08"
  },
  
  "156 Birch Lane, London": {
    estimatedValue: 420000,
    lastSalePrice: 395000,
    lastSaleDate: "2022-12-03",
    priceChange: "+6.3%",
    monthlyRent: 2400,
    rentalYield: 6.9,
    propertyType: "Terraced House",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1050,
    yearBuilt: 1992,
    lastUpdated: "2024-01-14"
  },
  
  "203 Cedar Drive, London": {
    estimatedValue: 480000,
    lastSalePrice: 450000,
    lastSaleDate: "2023-09-20",
    priceChange: "+6.7%",
    monthlyRent: 0, // Under renovation
    rentalYield: 0,
    propertyType: "Semi-Detached",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1150,
    yearBuilt: 1987,
    lastUpdated: "2024-01-16"
  },
  
  // Vanessa's renovation projects
  "67 Willow Way, London": {
    estimatedValue: 350000,
    lastSalePrice: 320000,
    lastSaleDate: "2023-11-15",
    priceChange: "+9.4%",
    monthlyRent: 0, // Under renovation
    rentalYield: 0,
    propertyType: "Terraced House",
    bedrooms: 2,
    bathrooms: 1,
    squareFootage: 900,
    yearBuilt: 1980,
    lastUpdated: "2024-01-18"
  },
  
  "134 Ash Grove, London": {
    estimatedValue: 410000,
    lastSalePrice: 385000,
    lastSaleDate: "2023-07-10",
    priceChange: "+6.5%",
    monthlyRent: 0, // Under renovation
    rentalYield: 0,
    propertyType: "Semi-Detached",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1000,
    yearBuilt: 1985,
    lastUpdated: "2024-01-20"
  }
}

// Market trends data
const marketTrends = {
  london: {
    averagePrice: 485000,
    priceChange: "+3.2%",
    rentalYield: 6.5,
    daysOnMarket: 45,
    marketCondition: "Stable",
    lastUpdated: "2024-01-20"
  }
}

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const mockPropertyAPI = {
  // Get property valuation and details
  getPropertyValue: async (address) => {
    await delay(800) // Simulate API call delay
    
    const data = mockPropertyData[address]
    if (!data) {
      // Generate realistic data for new properties
      const randomValue = Math.floor(Math.random() * 200000) + 300000
      const monthlyRent = Math.floor(randomValue * 0.004) // ~4.8% yield
      const rentalYield = ((monthlyRent * 12) / randomValue * 100).toFixed(1)
      
      return {
        estimatedValue: randomValue,
        lastSalePrice: Math.floor(randomValue * 0.85),
        lastSaleDate: "2023-06-15",
        priceChange: `+${(Math.random() * 15 + 5).toFixed(1)}%`,
        monthlyRent: monthlyRent,
        rentalYield: parseFloat(rentalYield),
        propertyType: ["Terraced House", "Semi-Detached", "Detached House", "Apartment"][Math.floor(Math.random() * 4)],
        bedrooms: Math.floor(Math.random() * 3) + 2,
        bathrooms: Math.floor(Math.random() * 2) + 1,
        squareFootage: Math.floor(Math.random() * 500) + 800,
        yearBuilt: Math.floor(Math.random() * 20) + 1980,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    }
    
    return data
  },

  // Get market trends for a location
  getMarketTrends: async (location = 'london') => {
    await delay(600)
    return marketTrends[location] || marketTrends.london
  },

  // Get comparable properties (comps)
  getComparableProperties: async (address) => {
    await delay(1000)
    const property = mockPropertyData[address]
    if (!property) return []
    
    // Generate 3-5 comparable properties
    const comps = []
    const basePrice = property.estimatedValue
    const baseRent = property.monthlyRent
    
    for (let i = 0; i < 4; i++) {
      const priceVariation = (Math.random() - 0.5) * 0.2 // ±10%
      const rentVariation = (Math.random() - 0.5) * 0.15 // ±7.5%
      
      comps.push({
        address: `${Math.floor(Math.random() * 200) + 1} ${['Oak', 'Pine', 'Elm', 'Maple', 'Cedar'][Math.floor(Math.random() * 5)]} Street, London`,
        estimatedValue: Math.floor(basePrice * (1 + priceVariation)),
        monthlyRent: Math.floor(baseRent * (1 + rentVariation)),
        bedrooms: property.bedrooms + (Math.random() > 0.5 ? 1 : -1),
        bathrooms: property.bathrooms,
        squareFootage: property.squareFootage + Math.floor((Math.random() - 0.5) * 200),
        lastSaleDate: "2023-08-15",
        distance: `${Math.floor(Math.random() * 5) + 1} miles`
      })
    }
    
    return comps
  },

  // Get rental estimate
  getRentalEstimate: async (address) => {
    await delay(500)
    const data = mockPropertyData[address]
    if (!data) {
      return {
        monthlyRent: Math.floor(Math.random() * 1000) + 1500,
        rentalYield: (Math.random() * 3 + 5).toFixed(1),
        confidence: Math.floor(Math.random() * 20) + 70
      }
    }
    
    return {
      monthlyRent: data.monthlyRent,
      rentalYield: data.rentalYield,
      confidence: 85
    }
  },

  // Get property history
  getPropertyHistory: async (address) => {
    await delay(700)
    const data = mockPropertyData[address]
    if (!data) return []
    
    // Generate historical data
    const history = []
    const currentValue = data.estimatedValue
    const currentDate = new Date()
    
    for (let i = 12; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setMonth(date.getMonth() - i)
      
      const valueVariation = (Math.random() - 0.5) * 0.1 // ±5%
      const value = Math.floor(currentValue * (1 + valueVariation))
      
      history.push({
        date: date.toISOString().split('T')[0],
        value: value,
        change: i === 0 ? data.priceChange : `+${(Math.random() * 2).toFixed(1)}%`
      })
    }
    
    return history
  }
}

export default mockPropertyAPI
