import React, { useState } from 'react'
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material'
import theme from './theme'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginButton from './components/auth/LoginButton'
import RoleSelection from './components/auth/RoleSelection'
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
import ProfileView from './components/profile/ProfileView'
import { projects, properties, users } from './data/sampleData'
import ServicesView from './components/services/ServicesView'
import DocumentsView from './components/documents/DocumentsView'
import PeopleView from './components/people/PeopleView'

// Main app content component
function AppContent() {
  const { user, loading, needsRoleSelection } = useAuth()
  const [currentView, setCurrentView] = useState('transaction-dashboard')
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [allProjects, setAllProjects] = useState(projects)
  const [allProperties, setAllProperties] = useState(properties)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [currentUser, setCurrentUser] = useState(users[0]) // Fallback user

  // Combine Firebase user with sample users for the dropdown
  const allUsers = user ? [user, ...users] : users
  const activeUser = user || currentUser

  // Filter data by current user
  const userProjects = allProjects.filter(p => p.ownerId === activeUser.id)
  const userProperties = allProperties.filter(p => p.ownerId === activeUser.id)

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
      setCurrentView('transaction-dashboard')
      setSelectedProject(null)
      setSelectedProperty(null)
    }
  }

  const handleProfileSave = (updatedUser) => {
    setCurrentUser(updatedUser)
  }

  // Debug logging
  console.log('App state:', { user, loading, needsRoleSelection })

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </ThemeProvider>
    )
  }

  // Show login screen if not authenticated
  if (!user) {
    console.log('No user - showing login')
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginButton />
      </ThemeProvider>
    )
  }

  // Show role selection if user needs to select a role
  if (needsRoleSelection) {
    console.log('User needs role selection')
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RoleSelection 
          user={user}
          onRoleSelected={(updatedUser) => {
            // The AuthContext will handle updating the user state
            window.location.reload() // Simple refresh to reload with new role
          }}
        />
      </ThemeProvider>
    )
  }

  const renderContent = () => {
    if (currentView === 'transaction-dashboard') {
      return (
        <TransactionsDashboard 
          onOpenTransaction={() => setCurrentView('transaction-detail')} 
          currentUser={activeUser}
        />
      )
    }
    if (currentView === 'people') {
      return (<PeopleView />)
    }
    if (currentView === 'properties') {
      return (
        <TransactionsDashboard 
          onOpenTransaction={() => setCurrentView('transaction-detail')} 
          currentUser={activeUser}
          showTeam={false}
        />
      )
    }
    if (currentView === 'services') {
      return (<ServicesView />)
    }
    if (currentView === 'documents') {
      return (<DocumentsView />)
    }
    if (currentView === 'profile') {
      return (
        <ProfileView 
          user={activeUser}
          onSave={handleProfileSave}
        />
      )
    }
    return (
      <TransactionSimulator
        role={activeUser.role}
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
        user={activeUser}
        users={allUsers}
        onUserChange={handleUserChange}
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
      >
        {renderContent()}
      </DashboardLayout>
    </ThemeProvider>
  )
}

// Main App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App