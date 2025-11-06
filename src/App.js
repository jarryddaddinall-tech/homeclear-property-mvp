import React, { useState, useEffect } from 'react'
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material'
import theme from './theme'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthPage from './components/auth/AuthPage'
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
import { ToastProvider } from './components/shared/ToastProvider'
import LiveDealView from './components/live/LiveDealView'

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

  // Simple hash-based navigation so shared links can deep-link to views (e.g. #/live)
  useEffect(() => {
    const applyHashRoute = () => {
      const raw = (window.location.hash || '').replace('#/', '')
      const hash = raw.split('?')[0] // support params like live?t=token
      
      // Check if we're coming from a redirect (has Firebase params in URL)
      const urlParams = new URLSearchParams(window.location.search)
      const isFromRedirect = urlParams.has('apiKey') || urlParams.has('authDomain')
      
      if (!hash || hash === '') {
        // If no hash and user is authenticated, default to transaction-dashboard
        if (user && !needsRoleSelection) {
          setCurrentView('transaction-dashboard')
          // Use replaceState to avoid adding to history
          const newUrl = new URL(window.location.href)
          newUrl.hash = '#/transaction-dashboard'
          // Clean up Firebase redirect params
          newUrl.searchParams.delete('apiKey')
          newUrl.searchParams.delete('authDomain')
          newUrl.searchParams.delete('mode')
          newUrl.searchParams.delete('oobCode')
          window.history.replaceState({}, '', newUrl.toString())
        }
        return
      }
      
      if (['transaction-dashboard','transaction-detail','people','properties','services','documents','profile','settings','live'].includes(hash)) {
        setCurrentView(hash)
        // Clean up redirect params if present
        if (isFromRedirect) {
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete('apiKey')
          newUrl.searchParams.delete('authDomain')
          newUrl.searchParams.delete('mode')
          newUrl.searchParams.delete('oobCode')
          window.history.replaceState({}, '', newUrl.toString())
        }
      } else if (user && !needsRoleSelection) {
        // If hash is invalid but user is authenticated, go to dashboard
        setCurrentView('transaction-dashboard')
        const newUrl = new URL(window.location.href)
        newUrl.hash = '#/transaction-dashboard'
        newUrl.searchParams.delete('apiKey')
        newUrl.searchParams.delete('authDomain')
        window.history.replaceState({}, '', newUrl.toString())
      }
    }
    applyHashRoute()
    window.addEventListener('hashchange', applyHashRoute)
    return () => window.removeEventListener('hashchange', applyHashRoute)
  }, [user, needsRoleSelection])

  // Keep hash in sync when navigating inside the app, but don't override existing deep links
  // Also ensure dashboard is set after successful login (especially on mobile redirect)
  useEffect(() => {
    if (!currentView) return
    
    const currentHash = (window.location.hash || '').replace('#/', '').split('?')[0]
    const validRoutes = ['transaction-dashboard','transaction-detail','people','properties','services','documents','profile','settings','live']
    
    // After successful authentication, ensure we navigate to dashboard
    // This is especially important for mobile redirects
    if (user && !needsRoleSelection) {
      if (!currentHash || currentHash === '' || !validRoutes.includes(currentHash)) {
        const newUrl = new URL(window.location.href)
        newUrl.hash = '#/transaction-dashboard'
        // Clean up any Firebase redirect params
        newUrl.searchParams.delete('apiKey')
        newUrl.searchParams.delete('authDomain')
        newUrl.searchParams.delete('mode')
        newUrl.searchParams.delete('oobCode')
        window.history.replaceState({}, '', newUrl.toString())
        setCurrentView('transaction-dashboard')
        return
      }
    }
    
    // Don't override if hash already exists and is valid
    if (!currentHash || !validRoutes.includes(currentHash)) {
      const newUrl = new URL(window.location.href)
      newUrl.hash = `#/` + currentView
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [currentView, user, needsRoleSelection])

  // Set initial currentUser when Firestore users load (restore persisted selection)
  // Also set currentUser to user if no Firestore users yet (for new users)
  useEffect(() => {
    if (user && !currentUser) {
      // First, try to use user directly if Firestore users haven't loaded yet
      if (firestoreUsers.length === 0 && !usersLoading) {
        // No Firestore users, use Firebase user
        setCurrentUser(user)
      } else if (firestoreUsers.length > 0) {
        const savedId = localStorage.getItem('selected_user_id')
        const fallback = firestoreUsers[0]
        const restored = savedId ? firestoreUsers.find(u => u.id === savedId) : null
        setCurrentUser(restored || fallback)
      }
    }
  }, [firestoreUsers, currentUser, user, usersLoading])

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
      try { localStorage.setItem('selected_user_id', selectedUser.id) } catch {}
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

  // Show loading spinner while checking auth or loading critical data
  // Don't block on activeUser if user exists (activeUser can be set later)
  if (loading || (user && !activeUser && usersLoading)) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </ThemeProvider>
    )
  }
  
  // If user exists but activeUser is not set yet, use user as fallback
  const displayUser = activeUser || user

  // Show live view read-only even if not authenticated
  const hashRoute = (typeof window !== 'undefined' && window.location.hash) ? window.location.hash.replace('#/', '') : ''
  if (!user && hashRoute.split('?')[0] === 'live') {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LiveDealView />
      </ThemeProvider>
    )
  }

  // Show login screen if not authenticated
  if (!user) {
    console.log('No user - showing login')
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthPage />
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
          currentUser={displayUser}
        />
      )
    }
    if (currentView === 'live') {
      return (<LiveDealView />)
    }
    if (currentView === 'people') {
      return (<PeopleView />)
    }
    if (currentView === 'properties') {
      return (
        <TransactionsDashboard 
          onOpenTransaction={() => setCurrentView('transaction-detail')} 
          currentUser={displayUser}
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
          user={displayUser}
          onSave={handleProfileSave}
        />
      )
    }
    if (currentView === 'settings') {
      return (
        <SettingsView 
          currentUser={displayUser}
        />
      )
    }
    return (
      <TransactionSimulator
        role={displayUser?.role}
        onRoleChange={(r) => {
          const target = allUsers.find(u => u.role === r)
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
        user={displayUser}
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
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  )
}

export default App