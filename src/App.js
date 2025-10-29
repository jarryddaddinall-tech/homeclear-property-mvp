import React, { useState } from 'react'
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material'
import theme from './theme'
import DashboardLayout from './components/layout/DashboardLayout'
import ProjectGrid from './components/projects/ProjectGrid'
import ProjectDetail from './components/projects/ProjectDetail'
import PropertyOwnerDashboard from './components/dashboards/PropertyOwnerDashboard'
import InvestorDashboard from './components/dashboards/InvestorDashboard'
import ProjectManagerDashboard from './components/dashboards/ProjectManagerDashboard'
import LifestyleInvestorDashboard from './components/dashboards/LifestyleInvestorDashboard'
import PropertyDetail from './components/properties/PropertyDetail'
import PropertiesView from './components/properties/PropertiesView'
import TransactionSimulator from './components/transactions/TransactionSimulator'
import TransactionsDashboard from './components/transactions/TransactionsDashboard'
import { projects, properties, users } from './data/sampleData'

function App() {
  const [currentView, setCurrentView] = useState('transaction-dashboard')
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [allProjects, setAllProjects] = useState(projects)
  const [allProperties, setAllProperties] = useState(properties)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [currentUser, setCurrentUser] = useState(users[0]) // Default to Vanessa

  // Filter data by current user
  const userProjects = allProjects.filter(p => p.ownerId === currentUser.id)
  const userProperties = allProperties.filter(p => p.ownerId === currentUser.id)

  const handleNavigate = (view) => {
    setCurrentView(view)
    setSelectedProject(null)
    setSelectedProperty(null)
  }

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setCurrentView('project-detail')
  }

  const handlePropertyClick = (property) => {
    setSelectedProperty(property)
    setCurrentView('property-detail')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedProject(null)
    setSelectedProperty(null)
  }

  const handleSaveProject = (updatedProject) => {
    setAllProjects(allProjects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ))
    setSelectedProject(updatedProject)
  }

  const handleAddProject = () => {
    // For now, just show a placeholder
    console.log('Add new project clicked')
  }

  const handleAddProperty = (newProperty) => {
    console.log('handleAddProperty called with:', newProperty)
    // Add the new property to the user's properties
    const propertyWithOwner = {
      ...newProperty,
      id: Date.now(), // Simple ID generation
      ownerId: currentUser.id
    }
    console.log('Adding property with owner:', propertyWithOwner)
    setAllProperties(prev => [...prev, propertyWithOwner])
  }

  const handleEditProperty = (propertyId, updatedProperty) => {
    setAllProperties(prev => 
      prev.map(property => 
        property.id === propertyId 
          ? { ...property, ...updatedProperty }
          : property
      )
    )
  }

  const handleDeleteProperty = (propertyId) => {
    setAllProperties(prev => prev.filter(property => property.id !== propertyId))
  }

  const handleUserChange = (userId) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setCurrentUser(user)
      setCurrentView('dashboard')
      setSelectedProject(null)
      setSelectedProperty(null)
    }
  }

  const renderContent = () => {
    if (currentView === 'transaction-dashboard') {
      return (
        <TransactionsDashboard onOpenTransaction={() => setCurrentView('transaction-detail')} />
      )
    }
    return (
      <TransactionSimulator
        role={currentUser.role}
        onRoleChange={(r) => {
          const target = users.find(u => u.role === r)
          if (target) handleUserChange(target.id)
        }}
      />
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardLayout
        currentView={currentView}
        onNavigate={handleNavigate}
        user={currentUser}
        users={users}
        onUserChange={handleUserChange}
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
      >
        {renderContent()}
      </DashboardLayout>
    </ThemeProvider>
  )
}

export default App