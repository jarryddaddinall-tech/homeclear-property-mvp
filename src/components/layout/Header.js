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
  CalendarToday
} from '@mui/icons-material'
import { properties as seedProperties } from '../../data/sampleData'

const Header = ({ user, users, onUserChange, isCollapsed, ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleUserSelect = (userId) => {
    onUserChange(userId)
    handleClose()
  }

  
  return (
    <AppBar
      position="fixed"
      sx={{
        left: isCollapsed ? '64px' : '240px',
        right: 0,
        width: 'auto',
        transition: 'left 0.3s ease',
        zIndex: 999,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid',
        borderColor: 'grey.200'
      }}
      {...props}
    >
      <Toolbar sx={{ px: 3, py: 2, flexDirection: 'column', alignItems: 'stretch' }}>
        {/* Top Row - Controls only */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 2 }}>
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
        {users.map((userOption) => (
          <MenuItem 
            key={userOption.id}
            onClick={() => handleUserSelect(userOption.id)}
            selected={userOption.id === user.id}
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
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main',
                  fontSize: '0.75rem'
                }}
              >
                {userOption.name.charAt(0)}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={userOption.name}
              secondary={userOption.role}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 500
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem'
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  )
}

export default Header
