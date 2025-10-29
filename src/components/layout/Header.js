import React from 'react'
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  TextField,
  InputAdornment,
  Badge,
  Chip
} from '@mui/material'
import { 
  Notifications, 
  ArrowDropDown, 
  CalendarToday,
  Business,
  Logout
} from '@mui/icons-material'
import { properties as seedProperties } from '../../data/sampleData'
import { useAuth } from '../../contexts/AuthContext'

const Header = ({ user, users, onUserChange, isCollapsed, ...props }) => {
  const { signOut } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    console.log('Avatar clicked, opening dropdown')
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    console.log('Closing dropdown')
    setAnchorEl(null)
  }

  const handleUserSelect = (userId) => {
    console.log('User selected from dropdown:', userId)
    onUserChange(userId)
    handleClose()
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      handleClose()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  
  return (
    <AppBar
      position="fixed"
      sx={{
        left: 0,
        right: 0,
        width: 'auto',
        transition: 'left 0.3s ease',
        zIndex: 999,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
      }}
      {...props}
    >
      <Toolbar sx={{ px: 3, py: 2, flexDirection: 'column', alignItems: 'stretch' }}>
        {/* Top Row - Logo and Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: '8px', 
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Business sx={{ color: 'white', fontSize: 18 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.125rem' }}>
              HomeClear
            </Typography>
          </Box>
          
          {/* User Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* User switcher trigger */}
            <Box 
              onClick={handleClick}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                cursor: 'pointer',
                borderRadius: 2,
                px: 1,
                py: 0.5,
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <ArrowDropDown sx={{ fontSize: 20, color: 'text.secondary' }} />
            </Box>
          </Box>
        </Box>
        
        {/* Bottom Row - Removed property address per request */}
      </Toolbar>
      
      {/* User Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: 2
          }
        }}
      >
        {(users || []).filter(Boolean).map((userOption) => {
          const displayName = userOption?.name || userOption?.displayName || userOption?.email || 'User'
          const roleLabel = userOption?.role || 'User'
          const initial = String(displayName).charAt(0).toUpperCase()
          return (
          <MenuItem 
            key={userOption?.id || displayName}
            onClick={() => handleUserSelect(userOption?.id)}
            selected={userOption?.id === user?.id}
            sx={{
              py: 1.5,
              px: 2,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': {
                  bgcolor: 'primary.light'
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Avatar 
                src={userOption?.photoURL}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main',
                  fontSize: '0.75rem'
                }}
              >
                {initial}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={displayName}
              secondary={roleLabel}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 500
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem'
              }}
            />
          </MenuItem>
        )})}
        
        {/* Sign Out Option */}
        <MenuItem 
          onClick={handleSignOut}
          sx={{
            py: 1.5,
            px: 2,
            borderTop: '1px solid',
            borderColor: 'grey.200',
            mt: 1
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Logout sx={{ color: 'text.secondary', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'text.secondary'
            }}
          />
        </MenuItem>
      </Menu>
    </AppBar>
  )
}

export default Header
