import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from '../firebase/config'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false)

  // Sign in with Google (mobile-friendly)
  const signInWithGoogle = async () => {
    try {
      // Check if we're on mobile or if popup is blocked
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (isMobile) {
        // Use redirect for mobile devices
        await signInWithRedirect(auth, googleProvider)
        return null // Will be handled by getRedirectResult
      } else {
        // Use popup for desktop
        const result = await signInWithPopup(auth, googleProvider)
        return result.user
      }
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  // Email/password: Sign up
  const signUpWithEmail = async (email, password, displayName = 'User') => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      try { await updateProfile(cred.user, { displayName }) } catch {}
    }
    return cred.user
  }

  // Email/password: Sign in
  const signInWithEmail = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  // Handle redirect result for mobile
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          console.log('Redirect result received:', result.user)
          // Persist minimal user in localStorage so role selection can proceed offline
          const uid = result.user.uid
          const cached = localStorage.getItem(`user_${uid}`)
          if (!cached) {
            localStorage.setItem(`user_${uid}`, JSON.stringify({
              displayName: result.user.displayName || 'User',
              email: result.user.email || '',
              photoURL: result.user.photoURL || '',
              role: null
            }))
          }
        }
      } catch (error) {
        console.error('Error handling redirect result:', error)
      }
    }
    
    handleRedirectResult()
  }, [])

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out')
      
      if (firebaseUser) {
        console.log('Checking localStorage for user:', firebaseUser.uid)
        
        // Check localStorage first (mobile-friendly)
        const localUserData = localStorage.getItem(`user_${firebaseUser.uid}`)
        if (localUserData) {
          try {
            const userData = JSON.parse(localUserData)
            console.log('Found localStorage data:', userData)
            setUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              name: userData.displayName || firebaseUser.displayName || 'User',
              email: firebaseUser.email,
              avatar: userData.displayName ? userData.displayName.charAt(0).toUpperCase() : 'U',
              photoURL: userData.photoURL || firebaseUser.photoURL,
              role: userData.role,
              phone: firebaseUser.phoneNumber || '',
              bankingDetails: {
                accountName: userData.displayName || firebaseUser.displayName || 'User',
                sortCode: '',
                accountNumber: '',
                bankName: ''
              },
              address: {
                street: '',
                city: '',
                postcode: '',
                country: 'UK'
              }
            })
            setNeedsRoleSelection(false)
            setLoading(false)
            return
          } catch (localError) {
            console.error('Error parsing localStorage data:', localError)
          }
        }
        
        // No localStorage data - new user needs role selection
        console.log('No localStorage data - new user needs role selection')
        setUser({
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          avatar: firebaseUser.displayName ? firebaseUser.displayName.charAt(0).toUpperCase() : 'U',
          photoURL: firebaseUser.photoURL,
          phone: firebaseUser.phoneNumber || '',
        })
        setNeedsRoleSelection(true)
        setLoading(false)
      } else {
        setUser(null)
        setNeedsRoleSelection(false)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Function to update user role
  const updateUserRole = (role) => {
    if (user) {
      console.log('Updating user role to:', role)
      
      // Save to localStorage first
      const userData = {
        role: role,
        displayName: user.displayName || user.name || 'User',
        email: user.email || '',
        photoURL: user.photoURL || ''
      }
      localStorage.setItem(`user_${user.uid}`, JSON.stringify(userData))
      console.log('Saved to localStorage:', userData)
      
      // Update the user state
      const updatedUser = {
        ...user,
        role: role
      }
      setUser(updatedUser)
      setNeedsRoleSelection(false)
      console.log('Updated user state:', updatedUser)
    }
  }

  const value = {
    user,
    loading,
    needsRoleSelection,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut: signOutUser,
    updateUserRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
