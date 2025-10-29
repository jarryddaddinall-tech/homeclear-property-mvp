import React, { useState } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Divider,
  Chip,
  Avatar,
  Grid,
  IconButton
} from '@mui/material'
import { Edit, Save, Cancel, AccountBalance, Person, Email, Phone } from '@mui/icons-material'

const ProfileView = ({ user, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bankingDetails: {
      accountName: user?.bankingDetails?.accountName || '',
      sortCode: user?.bankingDetails?.sortCode || '',
      accountNumber: user?.bankingDetails?.accountNumber || '',
      bankName: user?.bankingDetails?.bankName || ''
    },
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      postcode: user?.address?.postcode || '',
      country: user?.address?.country || 'UK'
    }
  })

  const handleSave = () => {
    onSave({ ...user, ...profileData })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bankingDetails: {
        accountName: user?.bankingDetails?.accountName || '',
        sortCode: user?.bankingDetails?.sortCode || '',
        accountNumber: user?.bankingDetails?.accountNumber || '',
        bankName: user?.bankingDetails?.bankName || ''
      },
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        postcode: user?.address?.postcode || '',
        country: user?.address?.country || 'UK'
      }
    })
    setIsEditing(false)
  }

  const showBankingDetails = ['Buyer', 'Seller'].includes(user?.role)

  return (
    <Box>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Profile Settings
            </Typography>
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Stack>
            )}
          </Stack>

          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Person color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Personal Information
                    </Typography>
                  </Stack>
                  
                  <Stack spacing={2}>
                    <TextField
                      label="Full Name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      fullWidth
                    />
                    <TextField
                      label="Phone Number"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      fullWidth
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Address Information */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Email color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Address
                    </Typography>
                  </Stack>
                  
                  <Stack spacing={2}>
                    <TextField
                      label="Street Address"
                      value={profileData.address.street}
                      onChange={(e) => setProfileData(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, street: e.target.value }
                      }))}
                      disabled={!isEditing}
                      fullWidth
                    />
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="City"
                        value={profileData.address.city}
                        onChange={(e) => setProfileData(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, city: e.target.value }
                        }))}
                        disabled={!isEditing}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Postcode"
                        value={profileData.address.postcode}
                        onChange={(e) => setProfileData(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, postcode: e.target.value }
                        }))}
                        disabled={!isEditing}
                        sx={{ flex: 1 }}
                      />
                    </Stack>
                    <TextField
                      label="Country"
                      value={profileData.address.country}
                      onChange={(e) => setProfileData(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, country: e.target.value }
                      }))}
                      disabled={!isEditing}
                      fullWidth
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Banking Details - Only for Buyers and Sellers */}
            {showBankingDetails && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <AccountBalance color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Banking Details
                      </Typography>
                      <Chip 
                        label="Required for transactions" 
                        size="small" 
                        color="warning" 
                        variant="outlined"
                      />
                    </Stack>
                    
                    <Stack spacing={2}>
                      <TextField
                        label="Account Holder Name"
                        value={profileData.bankingDetails.accountName}
                        onChange={(e) => setProfileData(prev => ({ 
                          ...prev, 
                          bankingDetails: { ...prev.bankingDetails, accountName: e.target.value }
                        }))}
                        disabled={!isEditing}
                        fullWidth
                      />
                      <TextField
                        label="Bank Name"
                        value={profileData.bankingDetails.bankName}
                        onChange={(e) => setProfileData(prev => ({ 
                          ...prev, 
                          bankingDetails: { ...prev.bankingDetails, bankName: e.target.value }
                        }))}
                        disabled={!isEditing}
                        fullWidth
                      />
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Sort Code"
                          value={profileData.bankingDetails.sortCode}
                          onChange={(e) => setProfileData(prev => ({ 
                            ...prev, 
                            bankingDetails: { ...prev.bankingDetails, sortCode: e.target.value }
                          }))}
                          disabled={!isEditing}
                          placeholder="12-34-56"
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Account Number"
                          type="password"
                          value={profileData.bankingDetails.accountNumber}
                          onChange={(e) => setProfileData(prev => ({ 
                            ...prev, 
                            bankingDetails: { ...prev.bankingDetails, accountNumber: e.target.value }
                          }))}
                          disabled={!isEditing}
                          placeholder="12345678"
                          sx={{ flex: 1 }}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Role-specific Information */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24 }}>
                      {user?.role?.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Role Information
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip 
                      label={user?.role} 
                      color="primary" 
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {user?.role === 'Buyer' && 'You are purchasing a property'}
                      {user?.role === 'Seller' && 'You are selling a property'}
                      {user?.role === 'Agent' && 'You are managing property transactions'}
                      {user?.role === 'Solicitor' && 'You are providing legal services'}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProfileView
