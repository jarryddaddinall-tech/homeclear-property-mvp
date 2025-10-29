// Properties data - Start completely fresh
export const properties = [
  // Jarryd's primary residence
  {
    id: 1,
    address: "123 Maple Street, London, SW1A 1AA",
    type: "primary-residence",
    status: "owned",
    tenantStatus: "occupied",
    purchasePrice: 350000,
    currentValue: 420000,
    initialMortgage: 280000,
    currentMortgage: 250000,
    notes: "Family home with garden",
    ownerId: 2 // Jarryd
  }
]

// Projects data
export const projects = [
  // Jarryd's home projects
  {
    id: 1,
    title: "Lay Floor in TV Room",
    type: "home-improvement",
    status: "in-progress",
    progress: 75,
    propertyId: 1,
    ownerId: 2, // Jarryd
    notes: "Installing hardwood flooring in the TV room. Materials purchased, starting installation this weekend."
  },
  {
    id: 2,
    title: "Paint Riley's Room",
    type: "home-improvement",
    status: "planning",
    progress: 10,
    propertyId: 1,
    ownerId: 2, // Jarryd
    notes: "Planning to paint Riley's room with a light blue theme. Need to choose colors and buy supplies."
  },
  {
    id: 3,
    title: "Fix Kitchen Cabinet Door",
    type: "maintenance",
    status: "completed",
    progress: 100,
    propertyId: 1,
    ownerId: 2, // Jarryd
    notes: "Fixed loose cabinet door hinge. Quick 30-minute fix."
  },
  {
    id: 4,
    title: "Update Bathroom Fixtures",
    type: "home-improvement",
    status: "planning",
    progress: 5,
    propertyId: 1,
    ownerId: 2, // Jarryd
    notes: "Planning to update bathroom fixtures for a more modern look."
  },
  // Mike's property projects
  {
    id: 5,
    title: "Kitchen Renovation - Cedar Drive",
    type: "renovation",
    status: "in-progress",
    progress: 85,
    propertyId: 6,
    ownerId: 3, // Mike
    notes: "Complete kitchen renovation for rental property. Almost finished, just need to install appliances."
  },
  // Vanessa's renovation projects
  {
    id: 6,
    title: "Willow Way Complete Renovation",
    type: "renovation",
    status: "in-progress",
    progress: 60,
    propertyId: 7,
    ownerId: 1, // Vanessa
    notes: "Full property renovation including kitchen, bathrooms, flooring, and painting. On track for completion in 3 weeks."
  },
  {
    id: 7,
    title: "Ash Grove Kitchen & Bathroom Update",
    type: "renovation",
    status: "planning",
    progress: 20,
    propertyId: 8,
    ownerId: 1, // Vanessa
    notes: "Focusing on kitchen and bathroom updates to maximize rental value. Planning phase complete, starting next week."
  }
]

// Legacy export for backward compatibility
export const sampleProjects = projects

export const users = [
  { id: 1, name: "Buyer", role: "Buyer", avatar: "B", email: "buyer@example.com" },
  { id: 2, name: "Seller", role: "Seller", avatar: "S", email: "seller@example.com" },
  { id: 3, name: "Agent", role: "Agent", avatar: "A", email: "agent@example.com" },
  { id: 4, name: "Solicitor", role: "Solicitor", avatar: "L", email: "solicitor@example.com" },
]

export const currentUser = users[0]
