import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'

export const useFirestoreTransactions = (userId = null) => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let q = collection(db, 'transactions')
    
    // If userId is provided, filter by user involvement
    if (userId) {
      q = query(
        collection(db, 'transactions'),
        where('ownerId', '==', userId)
      )
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const transactionsData = []
        snapshot.forEach((doc) => {
          transactionsData.push({
            id: doc.id,
            ...doc.data()
          })
        })
        setTransactions(transactionsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching transactions:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [userId])

  const addTransaction = async (transactionData) => {
    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (err) {
      console.error('Error adding transaction:', err)
      throw err
    }
  }

  const updateTransaction = async (transactionId, updates) => {
    try {
      await updateDoc(doc(db, 'transactions', transactionId), {
        ...updates,
        updatedAt: new Date()
      })
    } catch (err) {
      console.error('Error updating transaction:', err)
      throw err
    }
  }

  const deleteTransaction = async (transactionId) => {
    try {
      await deleteDoc(doc(db, 'transactions', transactionId))
    } catch (err) {
      console.error('Error deleting transaction:', err)
      throw err
    }
  }

  return { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction }
}
