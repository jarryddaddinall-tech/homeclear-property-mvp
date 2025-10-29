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
      main: '#7F56D9', // Purple accent
      light: '#B794F6',
      dark: '#553C9A',
    },
    secondary: {
      main: '#10B981', // Green for success/completed
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#FBFCFE', // Slightly lighter background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B', // Dark slate
      secondary: '#64748B', // Slate gray
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
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: { xs: '1.875rem', sm: '2.25rem' },
      fontWeight: 700,
      letterSpacing: '-0.025em',
      color: '#1E293B',
    },
    h2: {
      fontSize: { xs: '1.5rem', sm: '1.875rem' },
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: '#1E293B',
    },
    h3: {
      fontSize: { xs: '1.25rem', sm: '1.5rem' },
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: '#1E293B',
    },
    h4: {
      fontSize: { xs: '1.125rem', sm: '1.25rem' },
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: '#1E293B',
    },
    h5: {
      fontSize: { xs: '1rem', sm: '1.125rem' },
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#1E293B',
    },
    h6: {
      fontSize: { xs: '0.875rem', sm: '1rem' },
      fontWeight: 600,
      letterSpacing: '0em',
      color: '#1E293B',
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#64748B',
    },
    body2: {
      fontSize: '0.8125rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#64748B',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: '#94A3B8',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 7,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.06)',
          borderRadius: 10,
          border: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 500,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(127, 86, 217, 0.04)',
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
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.06)',
          borderBottom: 'none',
          backgroundColor: '#FFFFFF',
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
  },
})

export default theme
