import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'
import UserManagement from '../admin/UserManagement'

const SettingsView = ({ currentUser }) => {
  const isAdmin = currentUser?.role === 'Admin' || currentUser?.isAdmin

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Settings
      </Typography>
      
      {isAdmin ? (
        <UserManagement />
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              General Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You don't have admin privileges to access user management.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default SettingsView
