import { createMuiTheme } from '@material-ui/core/styles'

// On white, equivalent to #ededed
const lighterShadingColor = 'rgba(128, 128, 128, 0.14)'

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
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
  },
  overrides: {
    MuiButton: {
      // Name of the styleSheet
      root: {
        fontWeight: '500'
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: lighterShadingColor
      }
    }
  }
})

export default theme
