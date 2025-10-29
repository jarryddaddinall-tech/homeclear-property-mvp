import React from 'react'
import { Box, Typography, Button, Stack } from '@mui/material'
import { Add, FolderOpen, Description } from '@mui/icons-material'

const EmptyState = ({ 
  icon = 'folder',
  title, 
  description, 
  actionText, 
  onAction,
  ...props 
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'folder':
        return <FolderOpen sx={{ fontSize: 48, color: 'text.secondary' }} />
      case 'file':
        return <Description sx={{ fontSize: 48, color: 'text.secondary' }} />
      case 'add':
        return <Add sx={{ fontSize: 48, color: 'text.secondary' }} />
      default:
        return <FolderOpen sx={{ fontSize: 48, color: 'text.secondary' }} />
    }
  }

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 12,
        px: 6,
        ...props.sx
      }}
      {...props}
    >
      <Stack spacing={4} alignItems="center">
        <Box>
          {getIcon()}
        </Box>
        
        <Stack spacing={2} alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '400px' }}>
            {description}
          </Typography>
        </Stack>
        
        {actionText && onAction && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAction}
            sx={{ mt: 2 }}
          >
            {actionText}
          </Button>
        )}
      </Stack>
    </Box>
  )
}

export default EmptyState
