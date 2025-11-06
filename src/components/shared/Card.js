import React from 'react'
import { Card as MuiCard, CardContent, CardHeader, Typography, Box } from '@mui/material'

const Card = ({ 
  title, 
  subtitle, 
  children, 
  actions, 
  onClick, 
  hover = true,
  elevation = 2,
  hero = false,
  ...props 
}) => {
  return (
    <MuiCard
      elevation={elevation}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: hero ? 2 : 4,
        overflow: 'hidden',
        '&:hover': hover ? {
          boxShadow: elevation === 2 
            ? '0px 16px 48px rgba(0, 0, 0, 0.12), 0px 4px 12px rgba(0, 0, 0, 0.08)'
            : '0px 20px 56px rgba(0, 0, 0, 0.14), 0px 6px 16px rgba(0, 0, 0, 0.10)',
          transform: 'translateY(-4px)',
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
            variant: hero ? 'h4' : 'h6',
            fontSize: hero ? '1.5rem' : '1.125rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
          subheaderTypographyProps={{
            variant: 'body2',
            color: 'text.secondary',
            lineHeight: 1.6,
          }}
          sx={{ 
            pb: hero ? 2 : 1.5,
            px: hero ? 4 : 3,
            pt: hero ? 4 : 3,
          }}
        />
      )}
      
      {children && (
        <CardContent sx={{ 
          p: hero ? 4 : 3,
          '&:last-child': { 
            pb: hero ? 4 : 3 
          }
        }}>
          {children}
        </CardContent>
      )}
      
      {actions && (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
          {actions}
        </Box>
      )}
    </MuiCard>
  )
}

export default Card
