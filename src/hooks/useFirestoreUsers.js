import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

export const useFirestoreUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        console.log('Fetching users from Firestore...')
        
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
        
        console.log('Fetched users from Firestore:', usersData)
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
  }, [])

  return { users, loading, error }
}
