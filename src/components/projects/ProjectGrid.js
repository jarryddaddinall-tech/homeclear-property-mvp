import React from 'react'
import { Grid, Box, Card, CardContent, Typography, IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import ProjectCard from './ProjectCard'
import EmptyState from '../shared/EmptyState'

const ProjectGrid = ({ projects, onProjectClick, onAddProject, ...props }) => {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon="folder"
        title="No projects yet"
        description="Get started by creating your first project to track renovations, purchases, or property management tasks."
        actionText="Create Project"
        onAction={onAddProject}
      />
    )
  }

  return (
    <Grid container spacing={3} {...props}>
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
        <Card
          sx={{
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: '2px dashed',
            borderColor: 'divider',
            bgcolor: 'grey.50',
            '&:hover': {
              bgcolor: 'grey.100',
              borderColor: 'primary.main'
            },
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={onAddProject}
        >
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <IconButton size="large" sx={{ mb: 1 }}>
              <Add sx={{ fontSize: 32, color: 'text.secondary' }} />
            </IconButton>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
              Add New Project
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a new project to track
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProjectGrid
