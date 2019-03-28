import tabTheme from 'js/theme/defaultV1'

const primaryMainColor = '#00b597'
const primaryContrastTextColor = '#fff'

export default {
  ...tabTheme,
  palette: {
    ...tabTheme.palette,
    primary: {
      main: primaryMainColor,
      contrastText: primaryContrastTextColor,
    },
  },
}
