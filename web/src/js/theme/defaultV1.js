import { createMuiTheme } from '@material-ui/core/styles'

// Theme
const primaryMainColor = '#9d4ba3'
const primaryContrastTextColor = '#fff'
const secondaryMainColor = '#4a90e2'
const secondaryContrastTextColor = '#fff'

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: primaryMainColor,
      // dark: will be calculated from palette.primary.main,
      contrastText: primaryContrastTextColor
    },
    secondary: {
      // light: will be calculated from palette.primary.main,
      main: secondaryMainColor,
      // dark: will be calculated from palette.primary.main,
      contrastText: secondaryContrastTextColor
    }
  },
  typography: {
    fontSize: 14,
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    title: {
      lineHeight: '1.7em'
    },
    subheading: {
      lineHeight: '1.16667em'
    }
  },
  overrides: {
    MuiButtonBase: {
      root: {
        color: 'rgba(0, 0, 0, 0.87)'
      }
    },
    MuiListSubheader: {
      root: {
        fontSize: 12,
        textTransform: 'uppercase'
      }
    }
  }
})

export default theme
