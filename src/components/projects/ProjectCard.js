import React from 'react'
import { 
  Box, 
  Typography, 
  Chip, 
  LinearProgress,
  Card,
  CardContent,
  Stack
} from '@mui/material'

const ProjectCard = ({ project, onClick, ...props }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'primary'
      case 'completed':
        return { bgcolor: '#6B6B6B', color: 'white' }
      case 'on hold':
        return 'warning'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.06)',
          transform: 'translateY(-2px)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #F0F0F0'
      }}
      onClick={onClick}
      {...props}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 500, mb: 0.5, lineHeight: 1.3, color: 'text.primary' }}>
              {project.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
              {project.location}
            </Typography>
          </Box>
          <Chip
            label={project.status}
            size="small"
            sx={{ 
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: 6,
              ...getStatusColor(project.status)
            }}
          />
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
              {project.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={project.progress}
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3
              }
            }}
          />
        </Box>

        {/* Details */}
        <Stack spacing={1.5} sx={{ mt: 'auto' }}>
          {project.notes && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', mb: 0.5 }}>
                Notes
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.primary', lineHeight: 1.4 }}>
                {project.notes}
              </Typography>
            </Box>
          )}
          
          {project.budget && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                Budget
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
                {formatCurrency(project.budget)}
              </Typography>
            </Box>
          )}

          {project.endDate && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                Due Date
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
                {formatDate(project.endDate)}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProjectCard
