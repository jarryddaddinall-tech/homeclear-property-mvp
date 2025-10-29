import React, { useState, useEffect } from 'react'
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
import { useFirestoreUsers } from './hooks/useFirestoreUsers'
import { useFirestoreProperties } from './hooks/useFirestoreProperties'
import { useFirestoreProjects } from './hooks/useFirestoreProjects'
import { useFirestoreTransactions } from './hooks/useFirestoreTransactions'
import ServicesView from './components/services/ServicesView'
import DocumentsView from './components/documents/DocumentsView'
import PeopleView from './components/people/PeopleView'
import SettingsView from './components/settings/SettingsView'

// Main app content component
function AppContent() {
  const { user, loading, needsRoleSelection, updateUserRole } = useAuth()
  const { users: firestoreUsers, loading: usersLoading } = useFirestoreUsers()
  const { properties: allProperties, loading: propertiesLoading, addProperty, updateProperty, deleteProperty } = useFirestoreProperties()
  const { projects: allProjects, loading: projectsLoading, addProject, updateProject, deleteProject } = useFirestoreProjects()
  const { transactions, loading: transactionsLoading } = useFirestoreTransactions()
  
  const [currentView, setCurrentView] = useState('transaction-dashboard')
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [currentUser, setCurrentUser] = useState(null) // Will be set from Firestore users

  // Combine Firebase user with Firestore users for the dropdown
  const allUsers = user ? [user, ...firestoreUsers] : firestoreUsers
  const activeUser = currentUser || user

  // Set initial currentUser when Firestore users load
  useEffect(() => {
    if (firestoreUsers.length > 0 && !currentUser) {
      setCurrentUser(firestoreUsers[0])
    }
  }, [firestoreUsers, currentUser])

  // Filter data by current user
  const userProjects = activeUser ? allProjects.filter(p => p.ownerId === activeUser.id) : []
  const userProperties = activeUser ? allProperties.filter(p => p.ownerId === activeUser.id) : []

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

  const handleSaveProject = async (updatedProject) => {
    try {
      if (updatedProject.id) {
        await updateProject(updatedProject.id, updatedProject)
      } else {
        const newId = await addProject({
          ...updatedProject,
          ownerId: activeUser.id
        })
        updatedProject.id = newId
      }
      setSelectedProject(updatedProject)
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleAddProject = () => {
    // For now, just show a placeholder
    console.log('Add new project clicked')
  }

  const handleAddProperty = async (newProperty) => {
    try {
      console.log('handleAddProperty called with:', newProperty)
      const propertyWithOwner = {
        ...newProperty,
        ownerId: activeUser.id
      }
      console.log('Adding property with owner:', propertyWithOwner)
      await addProperty(propertyWithOwner)
    } catch (error) {
      console.error('Error adding property:', error)
    }
  }

  const handleEditProperty = async (propertyId, updatedProperty) => {
    try {
      await updateProperty(propertyId, updatedProperty)
    } catch (error) {
      console.error('Error updating property:', error)
    }
  }

  const handleDeleteProperty = async (propertyId) => {
    try {
      await deleteProperty(propertyId)
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  const handleUserChange = (userId) => {
    const selectedUser = allUsers.find(u => u.id === userId)
    if (selectedUser) {
      console.log('Switching to user:', selectedUser)
      setCurrentUser(selectedUser)
      setCurrentView('transaction-dashboard')
      setSelectedProject(null)
      setSelectedProperty(null)
    }
  }

  const handleProfileSave = (updatedUser) => {
    setCurrentUser(updatedUser)
  }

  // Debug logging
  console.log('App state:', { 
    user: user?.name, 
    currentUser: currentUser?.name, 
    activeUser: activeUser?.name,
    loading, 
    needsRoleSelection 
  })

  // Show loading spinner while checking auth or loading data
  if (loading || usersLoading || propertiesLoading || projectsLoading || transactionsLoading || !activeUser) {
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
            // Update the user role in the auth context
            updateUserRole(updatedUser.role)
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
    if (currentView === 'settings') {
      return (
        <SettingsView 
          currentUser={activeUser}
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