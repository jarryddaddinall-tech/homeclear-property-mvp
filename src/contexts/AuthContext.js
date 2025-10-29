import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
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

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
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

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Simplified approach - check localStorage first, then Firestore
        console.log('Checking user data for:', firebaseUser.uid)
        
        // First check localStorage
        const localUserData = localStorage.getItem(`user_${firebaseUser.uid}`)
        if (localUserData) {
          try {
            const userData = JSON.parse(localUserData)
            console.log('Using localStorage data:', userData)
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
            return
          } catch (localError) {
            console.error('Error parsing localStorage data:', localError)
          }
        }
        
        // If no localStorage data, try Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            console.log('User data found in Firestore:', userData)
            setUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              name: userData.displayName || firebaseUser.displayName || 'User',
              email: firebaseUser.email,
              avatar: userData.displayName ? userData.displayName.charAt(0).toUpperCase() : 'U',
              photoURL: firebaseUser.photoURL,
              role: userData.role,
              phone: userData.phone || firebaseUser.phoneNumber || '',
              bankingDetails: userData.bankingDetails || {
                accountName: userData.displayName || firebaseUser.displayName || 'User',
                sortCode: '',
                accountNumber: '',
                bankName: ''
              },
              address: userData.address || {
                street: '',
                city: '',
                postcode: '',
                country: 'UK'
              }
            })
            setNeedsRoleSelection(false)
          } else {
            // New user - needs role selection
            console.log('New user - needs role selection')
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
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error)
          // Fallback - new user needs role selection
          console.log('Firestore error - new user needs role selection')
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
        }
      } else {
        setUser(null)
        setNeedsRoleSelection(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Function to update user role
  const updateUserRole = (role) => {
    if (user) {
      const updatedUser = {
        ...user,
        role: role
      }
      setUser(updatedUser)
      setNeedsRoleSelection(false)
      
      // Save to localStorage
      localStorage.setItem(`user_${user.uid}`, JSON.stringify({
        role: role,
        displayName: user.displayName || user.name || 'User',
        email: user.email || '',
        photoURL: user.photoURL || ''
      }))
    }
  }

  const value = {
    user,
    loading,
    needsRoleSelection,
    signInWithGoogle,
    signOut: signOutUser,
    updateUserRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
