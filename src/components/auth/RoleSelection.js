import React, { useState } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Stack,
  CircularProgress
} from '@mui/material'
import { 
  Person, 
  Business, 
  Gavel, 
  HomeWork
} from '@mui/icons-material'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

const RoleSelection = ({ user, onRoleSelected }) => {
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)

  const roles = [
    {
      id: 'Buyer',
      name: 'Property Buyer',
      description: 'Looking to purchase a property',
      icon: Person,
      color: 'primary'
    },
    {
      id: 'Seller',
      name: 'Property Seller',
      description: 'Selling your property',
      icon: HomeWork,
      color: 'secondary'
    },
    {
      id: 'Agent',
      name: 'Estate Agent',
      description: 'Managing property transactions',
      icon: Business,
      color: 'success'
    },
    {
      id: 'Buyer\'s Solicitor',
      name: 'Buyer\'s Solicitor',
      description: 'Legal representation for buyers',
      icon: Gavel,
      color: 'warning'
    },
    {
      id: 'Seller\'s Solicitor',
      name: 'Seller\'s Solicitor',
      description: 'Legal representation for sellers',
      icon: Gavel,
      color: 'info'
    }
  ]

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId)
  }

  const handleSaveRole = async () => {
    if (!selectedRole) return

    try {
      setLoading(true)
      console.log('Saving role:', selectedRole, 'for user:', user.uid)
      
      // Save to localStorage (primary storage for now)
      const userData = {
        role: selectedRole,
        displayName: user.displayName || user.name || 'User',
        email: user.email || '',
        photoURL: user.photoURL || ''
      }
      localStorage.setItem(`user_${user.uid}`, JSON.stringify(userData))
      console.log('Saved to localStorage:', userData)

      // Update the user object with the selected role
      const updatedUser = {
        ...user,
        role: selectedRole
      }
      
      console.log('Calling onRoleSelected with:', updatedUser)
      onRoleSelected(updatedUser)
    } catch (error) {
      console.error('Error saving user role:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
        Welcome to HomeClear!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Please select your role to get started with your property transaction.
      </Typography>

      <Stack spacing={2} sx={{ mb: 4 }}>
        {roles.map((role) => {
          const IconComponent = role.icon
          const isSelected = selectedRole === role.id
          
          return (
            <Card
              key={role.id}
              sx={{
                cursor: 'pointer',
                border: isSelected ? 2 : 1,
                borderColor: isSelected ? `${role.color}.main` : 'grey.300',
                bgcolor: isSelected ? `${role.color}.light` : 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: `${role.color}.main`,
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${role.color}.main`,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconComponent sx={{ fontSize: 24 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {role.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {role.description}
                    </Typography>
                  </Box>
                  {isSelected && (
                    <Typography variant="body2" color={`${role.color}.main`} sx={{ fontWeight: 600 }}>
                      Selected
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )
        })}
      </Stack>

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={!selectedRole || loading}
        onClick={handleSaveRole}
        sx={{ py: 1.5 }}
      >
        {loading ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CircularProgress size={20} color="inherit" />
            <Typography>Saving...</Typography>
          </Stack>
        ) : (
          'Continue to HomeClear'
        )}
      </Button>
    </Box>
  )
}

export default RoleSelection
