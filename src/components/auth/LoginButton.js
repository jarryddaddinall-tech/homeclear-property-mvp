import React, { useState } from 'react'
import { Button, Box, CircularProgress, Typography } from '@mui/material'
import { Google } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

const LoginButton = ({ onSuccess }) => {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Sign in failed:', error)
      // You could add a toast notification here
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Welcome to HomeClear
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Sign in to manage your property transactions
      </Typography>
      
      <Button
        variant="contained"
        size="large"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Google />}
        onClick={handleGoogleSignIn}
        disabled={loading}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600
        }}
      >
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </Button>
    </Box>
  )
}

export default LoginButton
