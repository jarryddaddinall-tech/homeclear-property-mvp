import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Stack,
  Grid,
  LinearProgress,
  Fade,
  Slide,
  Zoom
} from '@mui/material'
import {
  CheckCircle,
  RadioButtonUnchecked,
  Home,
  AttachMoney,
  Description,
  Security,
  Key,
  Celebration
} from '@mui/icons-material'

const LifestyleInvestorDashboard = ({ properties, onPropertyClick, onAddProperty, ...props }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [completionDates, setCompletionDates] = useState({})
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const steps = [
    {
      label: 'Onboarding',
      icon: <Home />,
      description: 'Initial consultation and property investment strategy development. We assess your goals, budget, and investment criteria to create a personalized property investment plan.',
      subSteps: [
        {
          title: 'Initial Consultation',
          tasks: [
            'Investment goals assessment',
            'Budget and financing review',
            'Risk tolerance evaluation',
            'Investment timeline planning'
          ]
        },
        {
          title: 'Strategy Development',
          tasks: [
            'Property type selection',
            'Location preferences',
            'Investment strategy confirmation',
            'Documentation collection'
          ]
        }
      ]
    },
    {
      label: 'Sourcing',
      icon: <AttachMoney />,
      description: 'Property search and evaluation phase. We identify suitable investment properties, conduct market analysis, and present you with viable options that match your criteria.',
      subSteps: [
        {
          title: 'Property Search',
          tasks: [
            'Market research and analysis',
            'Property identification',
            'Initial property visits',
            'Investment potential assessment'
          ]
        },
        {
          title: 'Due Diligence',
          tasks: [
            'Property valuation',
            'Market comparables analysis',
            'Rental yield calculations',
            'Investment return projections'
          ]
        }
      ]
    },
    {
      label: 'Purchasing',
      icon: <Description />,
      description: 'The legal and financial process of acquiring the property. This includes mortgage applications, surveys, legal work, and completion.',
      subSteps: [
        {
          title: 'Mortgage',
          tasks: [
            'Submit full mortgage application',
            'Complete valuation survey', 
            'Mortgage offer approved',
            'Receive & sign offer documentation'
          ]
        },
        {
          title: 'Survey & Checks',
          tasks: [
            'Payment for pre-completion checks',
            'Condition Survey instructed',
            'Gas & Electric checks instructed',
            'Final property checks instructed'
          ]
        },
        {
          title: 'Legals',
          tasks: [
            'Complete engagement paperwork',
            'Property searches completed',
            'Purchase enquiries satisfied',
            'Purchase report sent & docs signed'
          ]
        }
      ]
    },
    {
      label: 'Refurbishing',
      icon: <Security />,
      description: 'Property renovation and improvement phase. We coordinate all refurbishment work to maximize rental potential and property value.',
      subSteps: [
        {
          title: 'Planning & Design',
          tasks: [
            'Property condition assessment',
            'Renovation scope definition',
            'Design and specification',
            'Planning permission (if required)'
          ]
        },
        {
          title: 'Execution',
          tasks: [
            'Contractor selection and appointment',
            'Work scheduling and management',
            'Quality control and inspections',
            'Completion and handover'
          ]
        }
      ]
    },
    {
      label: 'Letting',
      icon: <Key />,
      description: 'Property marketing and tenant acquisition. We handle all aspects of finding and securing quality tenants for your investment property.',
      subSteps: [
        {
          title: 'Marketing',
          tasks: [
            'Professional photography',
            'Property listing creation',
            'Marketing campaign launch',
            'Viewing arrangements'
          ]
        },
        {
          title: 'Tenant Selection',
          tasks: [
            'Tenant applications review',
            'Reference checks',
            'Credit and background checks',
            'Tenant agreement preparation'
          ]
        }
      ]
    },
    {
      label: 'Close Off',
      icon: <CheckCircle />,
      description: 'Final handover and ongoing management setup. We ensure everything is in place for successful property management and provide you with a complete investment summary.',
      subSteps: [
        {
          title: 'Handover',
          tasks: [
            'Property handover to tenant',
            'Inventory and condition reports',
            'Key and access management',
            'Tenant orientation'
          ]
        },
        {
          title: 'Management Setup',
          tasks: [
            'Property management arrangements',
            'Rent collection setup',
            'Maintenance reporting system',
            'Investment performance tracking'
          ]
        }
      ]
    }
  ]

  // Simulate progress through the purchasing process
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        setIsAnimating(true)
        setTimeout(() => {
          const completionDate = new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
          setCompletionDates(prev => ({ ...prev, [currentStep]: completionDate }))
          setCompletedSteps(prev => [...prev, currentStep])
          setCurrentStep(prev => prev + 1)
          setIsAnimating(false)
        }, 500)
      } else if (currentStep === steps.length - 1 && !completedSteps.includes(steps.length - 1)) {
        // Final step completion - trigger celebration
        const completionDate = new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
        setCompletionDates(prev => ({ ...prev, [currentStep]: completionDate }))
        setCompletedSteps(prev => [...prev, currentStep])
        setShowCelebration(true)
        
        // Hide celebration after 5 seconds
        setTimeout(() => {
          setShowCelebration(false)
        }, 5000)
      }
    }, 3000) // Auto-advance every 3 seconds for demo

    return () => clearInterval(interval)
  }, [currentStep, completedSteps, steps.length])

  const getStepIcon = (stepIndex) => {
    if (completedSteps.includes(stepIndex)) {
      return <CheckCircle sx={{ color: '#D4AF37' }} />
    }
    if (stepIndex === currentStep) {
      return <RadioButtonUnchecked sx={{ color: '#D4AF37' }} />
    }
    return <RadioButtonUnchecked sx={{ color: '#6B6B6B' }} />
  }

  const getStepColor = (stepIndex) => {
    if (completedSteps.includes(stepIndex)) {
      return '#D4AF37' // Gold
    }
    if (stepIndex === currentStep) {
      return '#D4AF37' // Gold
    }
    return '#6B6B6B' // Grey
  }

  return (
    <Box {...props}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, color: 'text.primary', fontWeight: 600 }}>
          Property Investment Journey
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your complete property investment process from onboarding to close off
        </Typography>
      </Box>

      {/* Progress Overview */}
      <Card sx={{ mb: 4, bgcolor: '#F8F9FA' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>
              Overall Progress
            </Typography>
            <Chip 
              label={`${Math.round((completedSteps.length / steps.length) * 100)}% Complete`}
              sx={{ bgcolor: '#D4AF37', color: 'white', fontWeight: 600 }}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(completedSteps.length / steps.length) * 100}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: '#E5E7EB',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#D4AF37'
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Animated Stepper */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Stepper activeStep={currentStep} orientation="vertical" sx={{ p: 3 }}>
            {steps.map((step, index) => (
              <Step key={step.label} completed={completedSteps.includes(index)}>
                <StepLabel
                  StepIconComponent={() => getStepIcon(index)}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: getStepColor(index)
                    }
                  }}
                >
                  <Fade in={true} timeout={800}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      {step.icon}
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: getStepColor(index) }}>
                          {step.label}
                        </Typography>
                        {completionDates[index] && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Completed {completionDates[index]}
                          </Typography>
                        )}
                      </Box>
                      {index === currentStep && (
                        <Chip 
                          label="In Progress" 
                          size="small"
                          sx={{ 
                            bgcolor: '#D4AF37', 
                            color: 'white',
                            '@keyframes pulse': {
                              '0%': { opacity: 1 },
                              '50%': { opacity: 0.5 },
                              '100%': { opacity: 1 }
                            },
                            animation: 'pulse 2s infinite'
                          }}
                        />
                      )}
                      {completedSteps.includes(index) && index === steps.length - 1 && (
                        <Zoom in={showCelebration} timeout={1000}>
                          <Chip 
                            icon={<Celebration />}
                            label="🎉 Journey Complete!" 
                            size="small"
                            sx={{ 
                              bgcolor: '#10B981', 
                              color: 'white',
                              fontWeight: 600,
                              '@keyframes bounce': {
                                '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                                '40%': { transform: 'translateY(-10px)' },
                                '60%': { transform: 'translateY(-5px)' }
                              },
                              animation: 'bounce 1s infinite'
                            }}
                          />
                        </Zoom>
                      )}
                    </Box>
                  </Fade>
                </StepLabel>
                
                <StepContent>
                  <Fade in={true} timeout={1000}>
                    <Box sx={{ mt: 2, ml: 4 }}>
                      {step.description && (
                        <Typography 
                          variant="body1" 
                          color="text.secondary" 
                          sx={{ mb: 3, lineHeight: 1.6 }}
                        >
                          {step.description}
                        </Typography>
                      )}
                      
                      {step.subSteps.length > 0 && (
                        <Grid container spacing={3}>
                          {step.subSteps.map((subStep, subIndex) => (
                            <Grid size={{ xs: 12, md: 4 }} key={subStep.title}>
                              <Slide 
                                direction="up" 
                                in={true} 
                                timeout={1200 + (subIndex * 200)}
                              >
                                <Card sx={{ 
                                  border: '2px solid',
                                  borderColor: getStepColor(index),
                                  bgcolor: completedSteps.includes(index) ? '#F0F8FF' : '#FAFAFA'
                                }}>
                                  <CardContent>
                                    <Typography 
                                      variant="h6" 
                                      sx={{ 
                                        fontWeight: 600, 
                                        color: getStepColor(index),
                                        mb: 2
                                      }}
                                    >
                                      {subStep.title}
                                    </Typography>
                                    <Stack spacing={1}>
                                      {subStep.tasks.map((task, taskIndex) => (
                                        <Box 
                                          key={taskIndex}
                                          sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            gap: 1,
                                            opacity: completedSteps.includes(index) ? 1 : 0.7
                                          }}
                                        >
                                          <CheckCircle 
                                            sx={{ 
                                              fontSize: 16, 
                                              color: completedSteps.includes(index) ? '#10B981' : '#6B6B6B'
                                            }} 
                                          />
                                          <Typography variant="body2">
                                            {task}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Stack>
                                  </CardContent>
                                </Card>
                              </Slide>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Box>
                  </Fade>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <Card sx={{ mt: 3, bgcolor: '#FFF8E1' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            <strong>NOTE:</strong> If there is an issue with the sale, we will endeavour to resolve it or find you another property. However, you may incur some professional fees that cannot be recovered.
          </Typography>
        </CardContent>
      </Card>

      {/* Celebration Overlay */}
      {showCelebration && (
        <Fade in={showCelebration} timeout={1000}>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(212, 175, 55, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              pointerEvents: 'none'
            }}
          >
            <Zoom in={showCelebration} timeout={1500}>
              <Card
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'white',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  borderRadius: 3,
                  border: '3px solid #D4AF37'
                }}
              >
                <Celebration sx={{ fontSize: 64, color: '#D4AF37', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#D4AF37', mb: 1 }}>
                  🎉 Congratulations! 🎉
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                  Your Property Investment Journey is Complete!
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  All 6 stages have been successfully completed
                </Typography>
              </Card>
            </Zoom>
          </Box>
        </Fade>
      )}
    </Box>
  )
}

export default LifestyleInvestorDashboard