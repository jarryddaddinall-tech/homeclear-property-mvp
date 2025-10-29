import React, { useState } from 'react'
import { 
  Box, 
  Typography, 
  Chip, 
  LinearProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Stack
} from '@mui/material'
import { CalendarToday, AttachMoney, LocationOn, Person, Flag } from '@mui/icons-material'
import DetailView from '../shared/DetailView'

const ProjectDetail = ({ project, onBack, onSave, ...props }) => {
  const [editMode, setEditMode] = useState(false)
  const [editedProject, setEditedProject] = useState(project)

  const handleSave = () => {
    onSave(editedProject)
    setEditMode(false)
  }

  const handleCancel = () => {
    setEditedProject(project)
    setEditMode(false)
  }

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
      month: 'long',
      year: 'numeric'
    })
  }

  const statusOptions = [
    'Planning',
    'In Progress',
    'On Hold',
    'Completed',
    'Cancelled'
  ]

  return (
    <DetailView
      title={editMode ? 'Edit Project' : project.title}
      subtitle={`Project ID: ${project.id}`}
      onBack={onBack}
      editMode={editMode}
      onEdit={() => setEditMode(true)}
      onSave={handleSave}
      onCancel={handleCancel}
      {...props}
    >
      <Stack spacing={4}>
        {/* Project Overview */}
        <Box>
          <Stack spacing={3}>
            {/* Title */}
            {editMode ? (
              <TextField
                value={editedProject.title}
                onChange={(e) => setEditedProject({...editedProject, title: e.target.value})}
                variant="outlined"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.25rem', fontWeight: 600 } }}
              />
            ) : (
              <Typography variant="h4" sx={{ fontSize: '2rem', fontWeight: 600 }}>
                {project.title}
              </Typography>
            )}

            {/* Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: '80px' }}>
                Status:
              </Typography>
              {editMode ? (
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <Select
                    value={editedProject.status}
                    onChange={(e) => setEditedProject({...editedProject, status: e.target.value})}
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Chip
                  label={project.status}
                  color={getStatusColor(project.status)}
                  size="small"
                />
              )}
            </Box>

            {/* Progress */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {project.progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={project.progress}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Project Details */}
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Project Details
          </Typography>

          {/* Description */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Description
            </Typography>
            {editMode ? (
              <TextField
                value={editedProject.description}
                onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
                multiline
                rows={3}
                variant="outlined"
                fullWidth
              />
            ) : (
              <Typography variant="body1">
                {project.description}
              </Typography>
            )}
          </Box>

          {/* Details Grid */}
          <Stack spacing={2}>
            {/* Budget */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Budget
                </Typography>
              </Box>
              {editMode ? (
                <TextField
                  value={editedProject.budget}
                  onChange={(e) => setEditedProject({...editedProject, budget: parseInt(e.target.value) || 0})}
                  type="number"
                  size="small"
                  sx={{ width: 150 }}
                />
              ) : (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formatCurrency(project.budget)}
                </Typography>
              )}
            </Box>

            {/* Location */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
              </Box>
              {editMode ? (
                <TextField
                  value={editedProject.location}
                  onChange={(e) => setEditedProject({...editedProject, location: e.target.value})}
                  size="small"
                  sx={{ width: 200 }}
                />
              ) : (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {project.location}
                </Typography>
              )}
            </Box>

            {/* Contractor */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Contractor
                </Typography>
              </Box>
              {editMode ? (
                <TextField
                  value={editedProject.contractor}
                  onChange={(e) => setEditedProject({...editedProject, contractor: e.target.value})}
                  size="small"
                  sx={{ width: 200 }}
                />
              ) : (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {project.contractor}
                </Typography>
              )}
            </Box>

            {/* Priority */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Flag sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Priority
                </Typography>
              </Box>
              {editMode ? (
                <FormControl size="small" sx={{ width: 120 }}>
                  <Select
                    value={editedProject.priority}
                    onChange={(e) => setEditedProject({...editedProject, priority: e.target.value})}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Chip
                  label={project.priority}
                  sx={{ 
                    bgcolor: project.priority === 'High' ? '#EF4444' : project.priority === 'Medium' ? '#F59E0B' : '#6B6B6B',
                    color: 'white'
                  }}
                  size="small"
                />
              )}
            </Box>

            {/* Dates */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Timeline
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </DetailView>
  )
}

export default ProjectDetail
