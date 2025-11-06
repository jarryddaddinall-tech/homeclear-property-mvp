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
        background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F7 100%)',
        display: 'flex',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(127, 86, 217, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(127, 86, 217, 0.02) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }
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
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
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
            p: { xs: 3, sm: 4, md: 5, lg: 6 },
            mt: '120px', // Account for taller AppBar height
            ml: { 
              xs: 0, 
              sm: isCollapsed ? '64px' : '240px' 
            },
            transition: 'margin-left 0.3s ease',
            maxWidth: { lg: '1600px' },
            mx: 'auto',
            width: '100%',
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
