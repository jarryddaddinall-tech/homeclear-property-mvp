import React, { useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Tabs, Tab, Divider, Alert, CircularProgress } from '@mui/material'
import { Google, Email } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

const AuthPage = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  // Check for redirect errors on mount
  useEffect(() => {
    const redirectError = sessionStorage.getItem('auth_error')
    if (redirectError) {
      setError(redirectError)
      sessionStorage.removeItem('auth_error')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signInWithEmail(email.trim(), password)
      } else {
        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }
        await signUpWithEmail(email.trim(), password, name.trim() || 'User')
      }
    } catch (err) {
      console.error('Auth error:', err)
      let errorMessage = 'Authentication error'
      if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password'
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use'
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak'
      } else if (err.message) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      // If using redirect, the page will reload, so we won't reach here
    } catch (err) {
      console.error('Google sign-in error:', err)
      let errorMessage = 'Failed to sign in with Google'
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in cancelled'
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in cancelled'
      } else if (err.message) {
        errorMessage = err.message
      }
      setError(errorMessage)
      setGoogleLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420, boxShadow: '0px 20px 60px rgba(0,0,0,0.08)', border: 'none' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>HC</Box>
              <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Welcome to HomeClear</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Sign in to continue to your transactions
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Tabs value={mode} onChange={(_, v) => { setMode(v); setError(''); }} centered sx={{ mb: 2 }}>
            <Tab value="signin" label="Sign In" />
            <Tab value="signup" label="Create Account" />
          </Tabs>

          <Stack component="form" onSubmit={handleSubmit} spacing={2}>
            {mode === 'signup' && (
              <TextField 
                label="Full name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                fullWidth
                required
              />
            )}
            <TextField 
              label="Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              fullWidth
              required
            />
            <TextField 
              label="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              fullWidth
              required
              helperText={mode === 'signup' ? 'At least 6 characters' : ''}
            />
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading || googleLoading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Email />}
              size="large"
              sx={{ mt: 1 }}
            >
              {loading ? 'Please wait…' : (mode === 'signin' ? 'Sign In with Email' : 'Create Account')}
            </Button>
          </Stack>

          <Divider sx={{ my: 2.5 }}>or</Divider>

          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={googleLoading ? <CircularProgress size={20} /> : <Google />}
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            size="large"
          >
            {googleLoading ? 'Connecting…' : 'Continue with Google'}
          </Button>

          {mode === 'signin' && (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
              Don't have an account?{' '}
              <Typography 
                component="span" 
                variant="body2" 
                color="primary" 
                sx={{ cursor: 'pointer', fontWeight: 600 }}
                onClick={() => { setMode('signup'); setError(''); }}
              >
                Sign up
              </Typography>
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default AuthPage
