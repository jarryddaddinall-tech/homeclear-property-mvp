import React, { useState } from 'react'
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Button, 
  LinearProgress,
  Chip,
  IconButton,
  Avatar,
  Divider
} from '@mui/material'
import { 
  Add, 
  Home, 
  FolderOpen, 
  TrendingUp, 
  TrendingDown,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Search,
  FilterList,
  Star
} from '@mui/icons-material'
import ProjectCard from '../projects/ProjectCard'
import PropertyCard from '../properties/PropertyCard'
import AddPropertyForm from '../properties/AddPropertyForm'
import EmptyState from '../shared/EmptyState'
import SimpleChart from '../shared/SimpleChart'

const PropertyOwnerDashboard = ({ projects, properties, onProjectClick, onAddProject, onPropertyClick, onAddProperty, ...props }) => {
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false)
  
  console.log('PropertyOwnerDashboard render - showAddPropertyForm:', showAddPropertyForm)
  console.log('PropertyOwnerDashboard render - properties:', properties)
  console.log('PropertyOwnerDashboard render - onAddProperty:', onAddProperty)

  // Calculate summary stats
  const totalProjects = projects.length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const totalProperties = properties.length
  const totalValue = properties.reduce((sum, p) => sum + (p.currentValue || 0), 0)

  return (
    <Box {...props}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ mb: 1, color: 'text.primary', fontWeight: 700 }}>
              Property Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
              Track your properties and home improvement projects
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<Search />}
              sx={{ 
                borderColor: 'grey.300',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main'
                }
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ 
                borderColor: 'grey.300',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main'
                }
              }}
            >
              Filter
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                  Portfolio Value
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                  £{totalValue > 0 ? (totalValue / 1000000).toFixed(1) + 'M' : '0M'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ArrowUpward sx={{ color: 'success.main', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500 }}>
                    +12.5%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px', 
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Home sx={{ color: 'white', fontSize: 24 }} />
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={75} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'primary.main'
                }
              }} 
            />
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                  Active Projects
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                  {totalProjects}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ArrowUpward sx={{ color: 'success.main', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500 }}>
                    +2 this month
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px', 
                bgcolor: 'info.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FolderOpen sx={{ color: 'white', fontSize: 24 }} />
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={60} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'info.main'
                }
              }} 
            />
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                  Properties
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                  {totalProperties}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ArrowUpward sx={{ color: 'success.main', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500 }}>
                    +1 this month
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px', 
                bgcolor: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Star sx={{ color: 'white', fontSize: 24 }} />
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={40} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'warning.main'
                }
              }} 
            />
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                  Completion Rate
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                  {totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ArrowUpward sx={{ color: 'success.main', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500 }}>
                    +5.2%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px', 
                bgcolor: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'success.main'
                }
              }} 
            />
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Price for Rejections
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="January" size="small" variant="outlined" />
                <IconButton size="small">
                  <MoreVert sx={{ fontSize: 18, color: 'text.secondary' }} />
                </IconButton>
              </Box>
            </Box>
            <SimpleChart
              type="line"
              height={200}
              data={[
                { label: '01', value: 200000 },
                { label: '02', value: 350000 },
                { label: '03', value: 280000 },
                { label: '04', value: 420000 },
                { label: '05', value: 380000 },
                { label: '06', value: 450000 },
                { label: '07', value: 320000 },
                { label: '08', value: 400000 },
                { label: '09', value: 480000 },
                { label: '10', value: 360000 },
                { label: '11', value: 410000 }
              ]}
            />
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Status Analysis
              </Typography>
              <IconButton size="small">
                <MoreVert sx={{ fontSize: 18, color: 'text.secondary' }} />
              </IconButton>
            </Box>
            <SimpleChart
              type="donut"
              height={200}
              data={[
                { label: 'Accepted', value: 45, color: '#10B981' },
                { label: 'Rejected', value: 30, color: '#EF4444' },
                { label: 'Counter', value: 25, color: '#F59E0B' }
              ]}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Projects and Properties Grid */}
      <Grid container spacing={3}>
        {/* Recent Projects */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Recent Projects
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ 
                  borderColor: 'grey.300',
                  color: 'text.secondary',
                  fontSize: '0.875rem'
                }}
              >
                View All
              </Button>
            </Box>
            
            {projects.length === 0 ? (
              <EmptyState
                icon="folder"
                title="No projects yet"
                description="Start by adding your first home improvement project."
                actionText="Add First Project"
                onAction={onAddProject}
              />
            ) : (
              <Grid container spacing={2}>
                {projects.slice(0, 4).map((project) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={project.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid #E2E8F0',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.07)',
                        }
                      }}
                      onClick={() => onProjectClick(project)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1rem' }}>
                              {project.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                              {project.description}
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            <MoreVert sx={{ fontSize: 18, color: 'text.secondary' }} />
                          </IconButton>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Chip
                            label={project.status}
                            size="small"
                            sx={{
                              bgcolor: project.status === 'completed' ? 'success.light' : 
                                      project.status === 'in-progress' ? 'warning.light' : 'grey.100',
                              color: project.status === 'completed' ? 'success.dark' : 
                                     project.status === 'in-progress' ? 'warning.dark' : 'text.secondary',
                              fontWeight: 500,
                              fontSize: '0.75rem'
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            £{project.budget || '0'}
                          </Typography>
                        </Box>
                        
                        <LinearProgress
                          variant="determinate"
                          value={project.status === 'completed' ? 100 : 
                                 project.status === 'in-progress' ? 65 : 0}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            bgcolor: 'grey.100',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: project.status === 'completed' ? 'success.main' : 'primary.main'
                            }
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                
                {projects.length < 4 && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '2px dashed',
                        borderColor: 'grey.300',
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
                      <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <Add sx={{ fontSize: 28, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, color: 'text.primary' }}>
                          Add New Project
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          Track a new home improvement
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            )}
          </Card>
        </Grid>

        {/* Properties Overview */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Your Properties
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ 
                  borderColor: 'grey.300',
                  color: 'text.secondary',
                  fontSize: '0.875rem'
                }}
              >
                View All
              </Button>
            </Box>
            
            {properties.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Home sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: 'text.primary' }}>
                  No properties yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add your first property to get started
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setShowAddPropertyForm(true)}
                >
                  Add Property
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                {properties.slice(0, 3).map((property) => (
                  <Card
                    key={property.id}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '1px solid #E2E8F0',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                      }
                    }}
                    onClick={() => onPropertyClick(property)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.875rem' }}>
                            {property.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                            {property.city}, {property.postcode}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <MoreVert sx={{ fontSize: 16, color: 'text.secondary' }} />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                          £{property.currentValue ? (property.currentValue / 1000).toFixed(0) + 'k' : 'N/A'}
                        </Typography>
                        <Chip
                          label={property.type}
                          size="small"
                          sx={{
                            bgcolor: 'primary.light',
                            color: 'primary.dark',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                
                {properties.length < 3 && (
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '2px dashed',
                      borderColor: 'grey.300',
                      bgcolor: 'grey.50',
                      '&:hover': {
                        bgcolor: 'grey.100',
                        borderColor: 'primary.main'
                      }
                    }}
                    onClick={() => setShowAddPropertyForm(true)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Add sx={{ fontSize: 24, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        Add Property
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Add Property Form */}
      <AddPropertyForm
        open={showAddPropertyForm}
        onClose={() => {
          console.log('AddPropertyForm onClose called')
          setShowAddPropertyForm(false)
        }}
        onSave={(newProperty) => {
          console.log('AddPropertyForm onSave called with:', newProperty)
          onAddProperty(newProperty)
          setShowAddPropertyForm(false)
        }}
      />
    </Box>
  )
}

export default PropertyOwnerDashboard