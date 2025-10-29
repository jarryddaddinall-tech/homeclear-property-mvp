import React, { createContext, useContext, useState, useCallback } from 'react'
import { Snackbar, Alert } from '@mui/material'

const ToastContext = createContext(null)

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const show = useCallback((message, severity = 'success') => {
    setToast({ open: true, message, severity })
  }, [])

  const hide = () => setToast((t) => ({ ...t, open: false }))

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Snackbar open={toast.open} autoHideDuration={2200} onClose={hide} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={hide} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}


