import React from 'react'
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Chip,
  Avatar,
  Card,
  Button
} from '@mui/material'
import { 
  Home, 
  FolderOpen, 
  ChevronLeft, 
  ChevronRight,
  Business,
  HomeWork,
  Analytics,
  Settings,
  Star,
  People,
  Assignment,
  CreditCard,
  Shield,
  Camera,
  Key,
  PieChart,
  Description,
  Person
} from '@mui/icons-material'

const Sidebar = ({ 
  isCollapsed, 
  onToggle, 
  currentView, 
  onNavigate,
  ...props 
}) => {
  const menuItems = [
    {
      id: 'transaction-dashboard',
      label: 'Dashboard',
      icon: Home,
      active: currentView === 'transaction-dashboard'
    },
    {
      id: 'people',
      label: 'People',
      icon: People,
      active: currentView === 'people'
    },
    {
      id: 'properties',
      label: 'Properties',
      icon: HomeWork,
      active: currentView === 'properties'
    },
    {
      id: 'services',
      label: 'Services',
      icon: Shield,
      active: currentView === 'services'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: Description,
      active: currentView === 'documents'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: Person,
      active: currentView === 'profile'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      active: currentView === 'settings'
    }
  ]

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: '120px',
        height: 'calc(100vh - 120px)',
        width: { xs: 0, sm: isCollapsed ? '64px' : '240px' },
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'grey.200',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06), 0px 2px 4px rgba(0, 0, 0, 0.04)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 998,
        display: { xs: 'none', sm: 'flex' },
        flexDirection: 'column'
      }}
      {...props}
    >
      {/* Header */}
      <Box
        sx={{
          py: 2,
          px: 1.5,
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <IconButton
          onClick={onToggle}
          size="small"
          sx={{
            color: 'text.secondary',
            p: 1,
            borderRadius: 2,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'text.primary',
              transform: 'scale(1.05)',
            }
          }}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, py: 2, px: isCollapsed ? 1.5 : 2 }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onNavigate(item.id)}
                selected={item.active}
                sx={{
                  minHeight: 44,
                  borderRadius: 2,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  px: isCollapsed ? 1.5 : 2,
                  py: 1,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    boxShadow: '0px 4px 12px rgba(127, 86, 217, 0.3)',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  },
                  '&:hover': {
                    bgcolor: item.active ? 'primary.dark' : 'action.hover',
                    color: item.active ? 'white' : 'text.primary',
                  }
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isCollapsed ? 'auto' : 40,
                    justifyContent: 'center',
                    color: item.active ? 'white' : 'text.secondary'
                  }}
                >
                  <IconComponent sx={{ fontSize: 22 }} />
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9375rem',
                      fontWeight: item.active ? 600 : 500,
                      color: item.active ? 'white' : 'text.primary',
                      letterSpacing: '-0.01em',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* Footer section intentionally left empty per request */}
    </Box>
  )
}

export default Sidebar
