import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

export const useFirestoreUsersByCurrent = (currentUserId = null) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const usersCollection = collection(db, 'users')
        const usersSnapshot = await getDocs(usersCollection)

        const usersData = []
        usersSnapshot.forEach((doc) => {
          const userData = doc.data()
          usersData.push({
            id: doc.id,
            ...userData
          })
        })

        setUsers(usersData)
        setError(null)
      } catch (err) {
        console.error('Error fetching users from Firestore:', err)
        setError(err)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentUserId])

  return { users, loading, error }
}

