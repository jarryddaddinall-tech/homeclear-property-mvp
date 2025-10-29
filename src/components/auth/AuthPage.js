import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Tabs, Tab, Divider } from '@mui/material'
import { Google } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

const AuthPage = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signInWithEmail(email.trim(), password)
      } else {
        await signUpWithEmail(email.trim(), password, name.trim() || 'User')
      }
    } catch (err) {
      setError(err.message || 'Authentication error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ width: 420, boxShadow: '0px 20px 60px rgba(0,0,0,0.08)', border: 'none' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>HC</Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Welcome to HomeClear</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Sign in to continue to your transactions
            </Typography>
          </Stack>

          <Tabs value={mode} onChange={(_, v) => setMode(v)} centered sx={{ mb: 2 }}>
            <Tab value="signin" label="Sign In" />
            <Tab value="signup" label="Create Account" />
          </Tabs>

          <Stack component="form" onSubmit={handleSubmit} spacing={1.5}>
            {mode === 'signup' && (
              <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            )}
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 0.5 }}>
              {loading ? 'Please wait…' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }}>or</Divider>

          <Button fullWidth variant="outlined" startIcon={<Google />} onClick={signInWithGoogle}>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AuthPage
