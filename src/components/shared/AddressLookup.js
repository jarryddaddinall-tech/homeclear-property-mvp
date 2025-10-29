import React, { useState, useEffect } from 'react'
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material'
import { LocationOn, Search } from '@mui/icons-material'
import addressLookupAPI from '../../services/addressLookupAPI'

const AddressLookup = ({ 
  value, 
  onChange, 
  label = "Property Address",
  placeholder = "Start typing an address or postcode...",
  error,
  helperText,
  ...props 
}) => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    console.log('Input value changed:', inputValue, 'Length:', inputValue.length)
    if (inputValue.length >= 3) {
      console.log('Starting search for:', inputValue)
      const delayedSearch = setTimeout(() => {
        searchAddresses(inputValue)
      }, 300) // Reduced debounce time

      return () => clearTimeout(delayedSearch)
    } else {
      console.log('Input too short, clearing options')
      setOptions([])
    }
  }, [inputValue])

  const searchAddresses = async (query) => {
    setLoading(true)
    console.log('Searching addresses for:', query)
    try {
      const result = await addressLookupAPI.searchAddresses(query)
      console.log('Search result:', result)
      if (result.success && result.addresses.length > 0) {
        setOptions(result.addresses)
        console.log('Set options:', result.addresses)
      } else {
        console.log('No results found from API')
        setOptions([])
      }
    } catch (error) {
      console.error('Address search error:', error)
      setOptions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue)
  }

  const handleChange = (event, newValue) => {
    console.log('Address selected:', newValue)
    if (newValue && typeof newValue === 'object' && newValue.fullAddress) {
      onChange(newValue.fullAddress)
    } else if (typeof newValue === 'string') {
      onChange(newValue)
    } else {
      onChange('')
    }
  }

  return (
    <Autocomplete
      value={value ? { fullAddress: value } : null}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={(option) => {
        console.log('Getting option label for:', option)
        if (typeof option === 'string') return option
        return option.fullAddress || option.address || ''
      }}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false
        if (typeof option === 'string' && typeof value === 'string') return option === value
        return option.fullAddress === value.fullAddress
      }}
      loading={loading}
      freeSolo
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                <LocationOn sx={{ color: 'text.secondary', fontSize: 20 }} />
              </Box>
            ),
            endAdornment: (
              <Box>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </Box>
            )
          }}
          {...props}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
            <LocationOn sx={{ color: 'text.secondary', fontSize: 16 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {option.address}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                <Chip 
                  label={option.postcode} 
                  size="small" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 20 }}
                />
                <Chip 
                  label={option.district} 
                  size="small" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 20 }}
                />
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
      noOptionsText={
        inputValue.length < 3 
          ? "Type at least 3 characters to search addresses"
          : "No addresses found"
      }
      loadingText="Searching addresses..."
    />
  )
}

export default AddressLookup
