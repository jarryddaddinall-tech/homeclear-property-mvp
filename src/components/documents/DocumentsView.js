import React, { useState } from 'react'
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography, 
  Button, 
  Chip, 
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Avatar
} from '@mui/material'
import { 
  Description, 
  PictureAsPdf, 
  Image, 
  Close,
  Download,
  Visibility
} from '@mui/icons-material'

const DocumentListItem = ({ document, onView }) => (
  <ListItem disablePadding>
    <ListItemButton 
      onClick={() => onView(document)}
      sx={{ 
        borderRadius: 1,
        mb: 0.5,
        '&:hover': {
          bgcolor: 'grey.50'
        }
      }}
    >
      <ListItemIcon sx={{ minWidth: 48 }}>
        <Avatar 
          sx={{ 
            bgcolor: 'primary.light',
            width: 40,
            height: 40
          }}
        >
          {document.type === 'pdf' ? (
            <PictureAsPdf sx={{ color: 'primary.main', fontSize: 20 }} />
          ) : (
            <Image sx={{ color: 'primary.main', fontSize: 20 }} />
          )}
        </Avatar>
      </ListItemIcon>
      
      <ListItemText
        primary={
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {document.title}
            </Typography>
            <Chip 
              label={document.status} 
              size="small" 
              color={document.status === 'Signed' ? 'success' : 'warning'}
              sx={{ height: 20, fontSize: '0.65rem' }}
            />
          </Stack>
        }
        secondary={
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {document.description}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip 
                label={document.category} 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ height: 20, fontSize: '0.65rem' }}
              />
              <Typography variant="caption" color="text.secondary">
                {document.date}
              </Typography>
            </Stack>
          </Stack>
        }
      />
      
      <Button 
        size="small" 
        startIcon={<Visibility />}
        onClick={(e) => {
          e.stopPropagation()
          onView(document)
        }}
        sx={{ ml: 1 }}
      >
        View
      </Button>
    </ListItemButton>
  </ListItem>
)

const DocumentViewer = ({ document, open, onClose }) => {
  if (!document) return null

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {document.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3}>
          {/* Document Info */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Document Details
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip label={document.category} size="small" color="primary" variant="outlined" />
              <Chip label={document.status} size="small" color={document.status === 'Signed' ? 'success' : 'warning'} />
              <Chip label={document.date} size="small" variant="outlined" />
            </Stack>
          </Box>

          <Divider />

          {/* Document Description */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Description
            </Typography>
            <Typography variant="body2">
              {document.description}
            </Typography>
          </Box>

          {/* Mock Document Content */}
          <Box sx={{ 
            border: '1px solid', 
            borderColor: 'grey.300', 
            borderRadius: 2, 
            p: 3, 
            bgcolor: 'grey.50',
            minHeight: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {document.type === 'pdf' ? (
              <PictureAsPdf sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            ) : (
              <Image sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            )}
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {document.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
              This is a preview of the document content.<br />
              In a real application, this would display the actual document.
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<Download />}
              size="small"
            >
              Download Document
            </Button>
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" startIcon={<Download />}>
          Download
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const DocumentsView = () => {
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [viewerOpen, setViewerOpen] = useState(false)

  const documents = [
    {
      id: 1,
      title: 'Memorandum of Sale',
      description: 'Official record of the agreed sale terms between buyer and seller.',
      category: 'Legal',
      status: 'Signed',
      date: '15 Jan 2024',
      type: 'pdf'
    },
    {
      id: 2,
      title: 'Draft Contract',
      description: 'Initial contract document outlining the terms and conditions of the property sale.',
      category: 'Legal',
      status: 'Pending Review',
      date: '18 Jan 2024',
      type: 'pdf'
    },
    {
      id: 3,
      title: 'Property Information Form (TA6)',
      description: 'Seller\'s disclosure form containing details about the property.',
      category: 'Property',
      status: 'Completed',
      date: '20 Jan 2024',
      type: 'pdf'
    },
    {
      id: 4,
      title: 'Energy Performance Certificate',
      description: 'Official energy efficiency rating and recommendations for the property.',
      category: 'Property',
      status: 'Valid',
      date: '12 Jan 2024',
      type: 'pdf'
    },
    {
      id: 5,
      title: 'Local Authority Search Results',
      description: 'Search results covering planning, highways, and environmental matters.',
      category: 'Search',
      status: 'Complete',
      date: '22 Jan 2024',
      type: 'pdf'
    },
    {
      id: 6,
      title: 'Mortgage Offer Letter',
      description: 'Formal mortgage offer from the lender with terms and conditions.',
      category: 'Financial',
      status: 'Approved',
      date: '25 Jan 2024',
      type: 'pdf'
    },
    {
      id: 7,
      title: 'Property Photos',
      description: 'Professional photographs of the property interior and exterior.',
      category: 'Media',
      status: 'Available',
      date: '10 Jan 2024',
      type: 'image'
    },
    {
      id: 8,
      title: 'Title Deeds',
      description: 'Official documents proving ownership and property boundaries.',
      category: 'Legal',
      status: 'Verified',
      date: '28 Jan 2024',
      type: 'pdf'
    }
  ]

  const handleViewDocument = (document) => {
    setSelectedDocument(document)
    setViewerOpen(true)
  }

  const handleCloseViewer = () => {
    setViewerOpen(false)
    setSelectedDocument(null)
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Transaction Documents
      </Typography>
      
      <List sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 1 }}>
        {documents.map((document) => (
          <DocumentListItem 
            key={document.id}
            document={document} 
            onView={handleViewDocument}
          />
        ))}
      </List>

      <DocumentViewer 
        document={selectedDocument}
        open={viewerOpen}
        onClose={handleCloseViewer}
      />
    </Box>
  )
}

export default DocumentsView
