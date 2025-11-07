import { useState, useEffect } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export const useFirestoreUsers = (userId = null) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        if (userId) {
          const userDoc = await getDoc(doc(db, 'users', userId))
          if (userDoc.exists()) {
            const data = userDoc.data()
            setUsers([{ 
              id: userDoc.id, 
              ...data,
              name: data.displayName || data.name || data.email || 'User'
            }])
          } else {
            setUsers([])
          }
          setError(null)
          return
        }

        const usersCollection = collection(db, 'users')
        const usersSnapshot = await getDocs(usersCollection)

        const usersData = []
        usersSnapshot.forEach((docSnap) => {
          const userData = docSnap.data()
          usersData.push({
            id: docSnap.id,
            ...userData,
            name: userData.displayName || userData.name || userData.email || 'User'
          })
        })

        setUsers(usersData)
        setError(null)
      } catch (err) {
        console.error('Error fetching users from Firestore:', err)
        setError(err)
        // Fallback to empty array if Firestore fails
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [userId])

  return { users, loading, error }
}
