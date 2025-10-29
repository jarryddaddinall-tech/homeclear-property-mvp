import React from 'react'
import { Box, Typography } from '@mui/material'

const SimpleChart = ({ 
  title, 
  data = [], 
  type = 'bar', 
  height = 200,
  color = '#7F56D9',
  ...props 
}) => {
  const maxValue = Math.max(...data.map(d => d.value))
  
  const renderBarChart = () => (
    <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: height - 40, px: 1 }}>
      {data.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <Box
            sx={{
              width: '100%',
              height: `${(item.value / maxValue) * 100}%`,
              minHeight: 4,
              bgcolor: color,
              borderRadius: '2px 2px 0 0',
              transition: 'all 0.3s ease',
              '&:hover': {
                opacity: 0.8,
                transform: 'scaleY(1.05)'
              }
            }}
          />
          <Typography variant="caption" sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  )

  const renderLineChart = () => (
    <Box sx={{ position: 'relative', height: height - 40, px: 1 }}>
      <svg width="100%" height="100%" viewBox="0 0 300 160" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={data.map((item, index) => 
            `${(index / (data.length - 1)) * 280},${160 - (item.value / maxValue) * 140}`
          ).join(' ')}
        />
        {data.map((item, index) => (
          <circle
            key={index}
            cx={(index / (data.length - 1)) * 280}
            cy={160 - (item.value / maxValue) * 140}
            r="3"
            fill={color}
          />
        ))}
      </svg>
    </Box>
  )

  const renderDonutChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercentage = 0
    
    return (
      <Box sx={{ position: 'relative', height: height - 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const startAngle = (cumulativePercentage / 100) * 360
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360
            
            const x1 = 60 + 40 * Math.cos((startAngle - 90) * Math.PI / 180)
            const y1 = 60 + 40 * Math.sin((startAngle - 90) * Math.PI / 180)
            const x2 = 60 + 40 * Math.cos((endAngle - 90) * Math.PI / 180)
            const y2 = 60 + 40 * Math.sin((endAngle - 90) * Math.PI / 180)
            
            const largeArcFlag = percentage > 50 ? 1 : 0
            
            const pathData = [
              `M 60 60`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')
            
            cumulativePercentage += percentage
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color || color}
                stroke="white"
                strokeWidth="2"
              />
            )
          })}
        </svg>
        <Box sx={{ position: 'absolute', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {total}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box {...props}>
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          {title}
        </Typography>
      )}
      <Box sx={{ height }}>
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {type === 'donut' && renderDonutChart()}
      </Box>
      {data.length > 0 && type === 'donut' && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {data.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: item.color || color
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default SimpleChart
