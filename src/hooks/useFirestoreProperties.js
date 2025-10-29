import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

export const useFirestoreProperties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'properties'),
      (snapshot) => {
        const propertiesData = []
        snapshot.forEach((doc) => {
          propertiesData.push({
            id: doc.id,
            ...doc.data()
          })
        })
        setProperties(propertiesData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching properties:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const addProperty = async (propertyData) => {
    try {
      const docRef = await addDoc(collection(db, 'properties'), {
        ...propertyData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (err) {
      console.error('Error adding property:', err)
      throw err
    }
  }

  const updateProperty = async (propertyId, updates) => {
    try {
      await updateDoc(doc(db, 'properties', propertyId), {
        ...updates,
        updatedAt: new Date()
      })
    } catch (err) {
      console.error('Error updating property:', err)
      throw err
    }
  }

  const deleteProperty = async (propertyId) => {
    try {
      await deleteDoc(doc(db, 'properties', propertyId))
    } catch (err) {
      console.error('Error deleting property:', err)
      throw err
    }
  }

  return { properties, loading, error, addProperty, updateProperty, deleteProperty }
}
