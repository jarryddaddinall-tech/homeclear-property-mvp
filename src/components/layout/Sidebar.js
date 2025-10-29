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
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'width 0.3s ease',
        zIndex: 998,
        display: { xs: 'none', sm: 'flex' },
        flexDirection: 'column'
      }}
      {...props}
    >
      {/* Header */}
      <Box
        sx={{
          py: 1.25,
          px: 1.25,
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
            p: 0.5,
            '&:hover': {
              bgcolor: 'grey.100',
              color: 'text.primary'
            }
          }}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, py: 1.25, px: isCollapsed ? 1 : 1.5, gap: 0.5 }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onNavigate(item.id)}
                selected={item.active}
                sx={{
                  minHeight: 44,
                  borderRadius: 12,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  px: isCollapsed ? 1.25 : 1.75,
                  py: 0.75,
                  transition: 'all 0.2s ease-in-out',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  },
                  '&:hover': {
                    bgcolor: item.active ? 'primary.dark' : 'grey.100',
                    color: item.active ? 'white' : 'text.primary'
                  }
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isCollapsed ? 'auto' : 36,
                    justifyContent: 'center',
                    color: item.active ? 'white' : 'text.secondary'
                  }}
                >
                  <IconComponent sx={{ fontSize: 20 }} />
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: item.active ? 600 : 400,
                      color: item.active ? 'white' : 'text.primary'
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
