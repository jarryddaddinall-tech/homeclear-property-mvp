import React from 'react'
import { Box, Typography, Grid, Card, CardContent, Stack } from '@mui/material'
import { Construction, TrendingUp, Schedule } from '@mui/icons-material'
import ProjectCard from '../projects/ProjectCard'
import EmptyState from '../shared/EmptyState'

const ProjectManagerDashboard = ({ projects, onProjectClick, onAddProject, ...props }) => {
  // Calculate summary stats
  const totalProjects = projects.length
  const inProgressProjects = projects.filter(p => p.status === 'in-progress').length
  const planningProjects = projects.filter(p => p.status === 'planning').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0

  if (projects.length === 0) {
    return (
      <EmptyState
        icon="folder"
        title="No renovation projects yet"
        description="Start tracking your renovation projects. Add properties you're renovating for rental or investment."
        actionText="Add First Project"
        onAction={onAddProject}
      />
    )
  }

  return (
    <Box {...props}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, color: 'text.primary' }}>
          Renovation Projects
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your renovation projects and track progress.
        </Typography>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Construction sx={{ color: 'primary.main', fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {totalProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Projects
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <TrendingUp sx={{ color: 'warning.main', fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {inProgressProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Schedule sx={{ color: 'info.main', fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {planningProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Planning
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <TrendingUp sx={{ color: '#6B6B6B', fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {avgProgress}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Progress
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
            <ProjectCard
              project={project}
              onClick={() => onProjectClick(project)}
            />
          </Grid>
        ))}
        
        {/* Add Project Card */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              border: '2px dashed',
              borderColor: 'grey.300',
              bgcolor: 'grey.50',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: 'grey.100',
                borderColor: 'primary.main'
              }
            }}
            onClick={onAddProject}
          >
            <Construction sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500, mb: 0.5, color: 'text.primary' }}>
              Add New Project
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Start a new renovation project
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProjectManagerDashboard
