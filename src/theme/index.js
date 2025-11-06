import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: '#7F56D9',
      light: '#9E77ED',
      dark: '#6941C6',
    },
    secondary: {
      main: '#10B981', // Green for success/completed
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0A0A0A',
      secondary: '#3F3F46',
    },
    grey: {
      50: '#FBFCFE',
      100: '#F5F7FB',
      200: '#EEF2F7',
      300: '#DCE3EC',
      400: '#A9B6C6',
      500: '#7B8AA1',
      600: '#57647A',
      700: '#3B475C',
      800: '#223047',
      900: '#111827',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#7F56D9',
      light: '#9E77ED',
      dark: '#6941C6',
    },
    action: {
      hover: 'rgba(0,0,0,0.04)',
      selected: 'rgba(127,86,217,0.12)'
    }
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3rem' },
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      color: '#0A0A0A',
    },
    h2: {
      fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
      color: '#0A0A0A',
    },
    h3: {
      fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2rem' },
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
      color: '#0A0A0A',
    },
    h4: {
      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.625rem' },
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
      color: '#0A0A0A',
    },
    h5: {
      fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
      color: '#0A0A0A',
    },
    h6: {
      fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
      color: '#0A0A0A',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0em',
      color: '#3F3F46',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0em',
      color: '#3F3F46',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
      color: '#0A0A0A',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
      color: '#0A0A0A',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
      color: '#64748B',
    },
    button: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      textTransform: 'none',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.04)',
    '0px 4px 8px rgba(0, 0, 0, 0.06)',
    '0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 12px 24px rgba(0, 0, 0, 0.10)',
    '0px 16px 32px rgba(0, 0, 0, 0.12)',
    '0px 20px 40px rgba(0, 0, 0, 0.14)',
    '0px 24px 48px rgba(0, 0, 0, 0.16)',
    '0px 28px 56px rgba(0, 0, 0, 0.18)',
    '0px 32px 64px rgba(0, 0, 0, 0.20)',
    '0px 36px 72px rgba(0, 0, 0, 0.22)',
    '0px 40px 80px rgba(0, 0, 0, 0.24)',
    '0px 44px 88px rgba(0, 0, 0, 0.26)',
    '0px 48px 96px rgba(0, 0, 0, 0.28)',
    '0px 52px 104px rgba(0, 0, 0, 0.30)',
    '0px 56px 112px rgba(0, 0, 0, 0.32)',
    '0px 60px 120px rgba(0, 0, 0, 0.34)',
    '0px 64px 128px rgba(0, 0, 0, 0.36)',
    '0px 68px 136px rgba(0, 0, 0, 0.38)',
    '0px 72px 144px rgba(0, 0, 0, 0.40)',
    '0px 76px 152px rgba(0, 0, 0, 0.42)',
    '0px 80px 160px rgba(0, 0, 0, 0.44)',
    '0px 84px 168px rgba(0, 0, 0, 0.46)',
    '0px 88px 176px rgba(0, 0, 0, 0.48)',
    '0px 92px 184px rgba(0, 0, 0, 0.50)',
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.04)',
          borderRadius: 16,
          border: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-4px)',
          },
        },
      },
      variants: [
        {
          props: { elevation: 0 },
          style: {
            boxShadow: 'none',
          },
        },
        {
          props: { elevation: 1 },
          style: {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
          },
        },
        {
          props: { elevation: 2 },
          style: {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.06)',
          },
        },
        {
          props: { elevation: 3 },
          style: {
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.04)',
          },
        },
        {
          props: { elevation: 4 },
          style: {
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.10), 0px 4px 8px rgba(0, 0, 0, 0.06)',
          },
        },
        {
          props: { elevation: 5 },
          style: {
            boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.12), 0px 6px 12px rgba(0, 0, 0, 0.08)',
          },
        },
      ],
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '12px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '0.9375rem',
          letterSpacing: '-0.01em',
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(0,0,0,0.04)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 28,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: '#F1F5F9',
          height: 8,
        },
        bar: {
          borderRadius: 6,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.04)',
          borderBottom: 'none',
          backgroundColor: '#FFFFFF',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 44,
          '&.Mui-selected': {
            color: '#7F56D9',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#7F56D9',
          height: 3,
          borderRadius: '2px 2px 0 0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#7F56D9',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
                borderColor: '#7F56D9',
              },
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            fontWeight: 500,
            '&.Mui-focused': {
              color: '#7F56D9',
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.9375rem',
          lineHeight: 1.5,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 8,
          color: '#DCE3EC',
          '&.Mui-checked': {
            color: '#7F56D9',
          },
          '&:hover': {
            backgroundColor: 'rgba(127, 86, 217, 0.04)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 4,
          paddingBottom: 4,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 12,
          paddingRight: 12,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
  },
})

export default theme
