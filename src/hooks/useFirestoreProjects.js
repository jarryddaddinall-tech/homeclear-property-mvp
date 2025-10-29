import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'

export const useFirestoreProjects = (propertyId = null) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let q = collection(db, 'projects')
    
    // If propertyId is provided, filter by property
    if (propertyId) {
      q = query(collection(db, 'projects'), where('propertyId', '==', propertyId))
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projectsData = []
        snapshot.forEach((doc) => {
          projectsData.push({
            id: doc.id,
            ...doc.data()
          })
        })
        setProjects(projectsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching projects:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [propertyId])

  const addProject = async (projectData) => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (err) {
      console.error('Error adding project:', err)
      throw err
    }
  }

  const updateProject = async (projectId, updates) => {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        ...updates,
        updatedAt: new Date()
      })
    } catch (err) {
      console.error('Error updating project:', err)
      throw err
    }
  }

  const deleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId))
    } catch (err) {
      console.error('Error deleting project:', err)
      throw err
    }
  }

  return { projects, loading, error, addProject, updateProject, deleteProject }
}
