import React from 'react'
import { Box, Typography, Button, IconButton, Stack } from '@mui/material'
import { ArrowBack, Edit, Save, Close } from '@mui/icons-material'

const DetailView = ({ 
  title, 
  subtitle,
  backButton = true,
  onBack,
  editMode = false,
  onEdit,
  onSave,
  onCancel,
  children,
  actions,
  ...props 
}) => {
  return (
    <Box {...props}>
      <Stack spacing={4}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {backButton && (
              <IconButton
                onClick={onBack}
                size="small"
                aria-label="Go back"
              >
                <ArrowBack />
              </IconButton>
            )}
            <Box>
              <Typography variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={1}>
            {!editMode && onEdit && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<Edit />}
                onClick={onEdit}
              >
                Edit
              </Button>
            )}
            
            {editMode && (
              <>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Save />}
                  onClick={onSave}
                >
                  Save
                </Button>
                <Button
                  size="small"
                  variant="text"
                  startIcon={<Close />}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </>
            )}
            
            {actions}
          </Stack>
        </Box>
        
        {/* Content */}
        <Box>
          {children}
        </Box>
      </Stack>
    </Box>
  )
}

export default DetailView
