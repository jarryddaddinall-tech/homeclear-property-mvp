import React from 'react'
import { Box } from '@mui/material'
import Sidebar from './Sidebar'
import Header from './Header'

const DashboardLayout = ({ 
  children, 
  currentView, 
  onNavigate, 
  user,
  users,
  onUserChange,
  isCollapsed,
  onToggleSidebar,
  ...props 
}) => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        display: 'flex'
      }}
    >
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={onToggleSidebar}
        currentView={currentView}
        onNavigate={onNavigate}
      />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Header
          user={user}
          users={users}
          onUserChange={onUserChange}
          isCollapsed={isCollapsed}
        />

        {/* Content */}
        <Box 
          sx={{ 
            flexGrow: 1,
            p: 4,
            mt: '120px', // Account for taller AppBar height
            ml: isCollapsed ? '64px' : '240px',
            transition: 'margin-left 0.3s ease'
          }}
          {...props}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardLayout
