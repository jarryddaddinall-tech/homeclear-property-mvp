import React from 'react'
import { Box, Card, CardContent, Typography, Stack, Chip, Stepper, Step, StepLabel, Button, Divider } from '@mui/material'

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
  { stage: 'Offer Accepted', ts: new Date().toISOString(), note: 'Offer agreed subject to contract', by: 'Agent' },
]

const LiveDealView = () => {
  const address = '123 Maple Street, London, SW1A 1AA'
  const currentStageIdx = Math.max(0, defaultTimeline.length - 1)

  const handlePrint = () => window.print()
  const getToken = () => {
    try {
      const stored = localStorage.getItem('live_token')
      if (stored) return stored
      const t = Math.random().toString(36).slice(2, 10)
      localStorage.setItem('live_token', t)
      return t
    } catch {
      return 'public'
    }
  }
  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/#/live?t=${getToken()}`
      await navigator.clipboard.writeText(url)
    } catch {}
  }

  // Auto-print if hash has print=1
  React.useEffect(() => {
    try {
      const hash = window.location.hash || ''
      if (hash.includes('print=1')) {
        setTimeout(() => window.print(), 300)
      }
    } catch {}
  }, [])

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-header, .print-footer { position: fixed; left: 0; right: 0; color: #64748B; }
          .print-header { top: 0; padding: 12px 24px; border-bottom: 1px solid #EEF2F7; }
          .print-footer { bottom: 0; padding: 8px 24px; border-top: 1px solid #EEF2F7; font-size: 12px; }
          .print-page { padding-top: 60px; padding-bottom: 48px; }
          .MuiCard-root { box-shadow: none !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* Branded header (prints) */}
      <Box className="print-header">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>HomeClear – Deal Pack</Typography>
          <Typography variant="caption">Generated {new Date().toLocaleString()}</Typography>
        </Stack>
      </Box>

      <Box className="print-page">
        {/* Cohesive header + timeline card stack */}
        <Card sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{address}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip label="AML checks" size="small" sx={{ bgcolor: 'grey.100', height: 22, borderRadius: 1.5 }} />
                  <Chip label="Funds verified" size="small" sx={{ bgcolor: 'grey.100', height: 22, borderRadius: 1.5 }} />
                  <Chip label="Searches" size="small" sx={{ bgcolor: 'grey.100', height: 22, borderRadius: 1.5 }} />
                </Stack>
              </Box>
              <Stack direction="row" spacing={1} className="no-print">
                <Button variant="outlined" onClick={handleCopy}>Copy link</Button>
                <Button variant="contained" onClick={handlePrint}>Download deal pack</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: '1px solid', borderColor: 'grey.200', mb: 2 }}>
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

        <Card>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Recent updates</Typography>
            {defaultTimeline.map((t, i) => (
              <Box key={i} sx={{ py: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">{t.by || 'User'} – {t.note || t.stage}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(t.ts).toLocaleDateString()}</Typography>
                </Stack>
                {i < defaultTimeline.length - 1 && <Divider sx={{ mt: 1 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>

      {/* Print footer */}
      <Box className="print-footer">
        <Typography variant="caption">HomeClear · {window.location.origin}</Typography>
      </Box>
    </Box>
  )
}

export default LiveDealView


