import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material'
import { Edit, Save, Cancel } from '@mui/icons-material'
import { useFirestoreUsers } from '../../hooks/useFirestoreUsers'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

const UserManagement = () => {
  const { users, loading } = useFirestoreUsers()
  const [editingUser, setEditingUser] = useState(null)
  const [editRole, setEditRole] = useState('')
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const roleOptions = [
    'Property Buyer',
    'Property Seller', 
    'Agent',
    'Buyer\'s Solicitor',
    'Seller\'s Solicitor',
    'Admin'
  ]

  const getRoleColor = (role) => {
    const colors = {
      'Property Buyer': 'primary',
      'Property Seller': 'secondary',
      'Agent': 'success',
      'Buyer\'s Solicitor': 'warning',
      'Seller\'s Solicitor': 'info',
      'Admin': 'error'
    }
    return colors[role] || 'default'
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setEditRole(user.role)
    setEditName(user.name)
    setEditEmail(user.email)
    setOpen(true)
  }

  const handleSaveUser = async () => {
    try {
      if (!editingUser) return

      const userRef = doc(db, 'users', editingUser.id)
      await updateDoc(userRef, {
        role: editRole,
        name: editName,
        email: editEmail,
        updatedAt: new Date()
      })

      setMessage(`User ${editName} updated successfully!`)
      setOpen(false)
      setEditingUser(null)
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating user:', error)
      setMessage('Error updating user. Please try again.')
    }
  }

  const handleCancelEdit = () => {
    setOpen(false)
    setEditingUser(null)
    setEditRole('')
    setEditName('')
    setEditEmail('')
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading users...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        User Management
      </Typography>
      
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            All Users ({users.length})
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {user.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEditUser(user)}
                        color="primary"
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={open} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Role
              </Typography>
              <Select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                fullWidth
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveUser} 
            variant="contained" 
            startIcon={<Save />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserManagement
