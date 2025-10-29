import React from 'react'
import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material'

export const TransactionCardSkeleton = () => (
  <Card>
    <Skeleton variant="rectangular" height={3} />
    <Skeleton variant="rectangular" height={160} />
    <CardContent>
      <Stack spacing={1}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="rectangular" height={28} />
      </Stack>
    </CardContent>
  </Card>
)

export const ListSkeleton = ({ rows = 3 }) => (
  <Box>
    {[...Array(rows)].map((_, i) => (
      <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 1 }} />
    ))}
  </Box>
)


