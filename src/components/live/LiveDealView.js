import React from 'react'
import { Box, Card, CardContent, Typography, Stack, Chip, Stepper, Step, StepLabel, Button } from '@mui/material'

const UK_STAGES = [
  'Offer Accepted',
  'Sale Details Shared',
  'Solicitors Instructed & Compliance',
  'Draft Contract Pack Issued',
  'Mortgage Application & Valuation',
  'Searches Ordered',
  'Enquiries Raised & Responded',
  'Mortgage Offer Issued',
  'Report on Title & Signatures',
  'Exchange of Contracts',
  'Completion',
  'Post-Completion'
]

// Minimal mock data for public view (MVP)
const defaultTimeline = [
  { stage: 'Offer Accepted', ts: new Date().toISOString() },
]

const LiveDealView = () => {
  const address = '123 Maple Street, London, SW1A 1AA'
  const currentStageIdx = Math.max(0, defaultTimeline.length - 1)

  const handlePrint = () => window.print()
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {}
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{address}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip label="AML checks" size="small" sx={{ bgcolor: 'grey.100', height: 22, borderRadius: 1.5 }} />
            <Chip label="Funds verified" size="small" sx={{ bgcolor: 'grey.100', height: 22, borderRadius: 1.5 }} />
            <Chip label="Searches" size="small" sx={{ bgcolor: 'grey.100', height: 22, borderRadius: 1.5 }} />
          </Stack>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={handleCopy}>Copy link</Button>
          <Button variant="contained" onClick={handlePrint}>Download deal pack</Button>
        </Stack>
      </Stack>

      <Card>
        <CardContent>
          <Stepper activeStep={currentStageIdx + 1} alternativeLabel sx={{ '& .MuiStepConnector-line': { borderColor: 'grey.200', borderTopWidth: 2 } }}>
            {UK_STAGES.map((s) => (
              <Step key={s}>
                <StepLabel>{s}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LiveDealView


