import React from 'react'
import { Card as MuiCard, CardContent, CardHeader, Typography, Box } from '@mui/material'

const Card = ({ 
  title, 
  subtitle, 
  children, 
  actions, 
  onClick, 
  hover = true,
  ...props 
}) => {
  return (
    <MuiCard
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        '&:hover': hover ? {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        } : {},
        ...props.sx
      }}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          titleTypographyProps={{
            variant: 'h6',
            fontSize: '1rem',
            fontWeight: 600
          }}
          subheaderTypographyProps={{
            variant: 'body2',
            color: 'text.secondary'
          }}
        />
      )}
      
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
      
      {actions && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          {actions}
        </Box>
      )}
    </MuiCard>
  )
}

export default Card
