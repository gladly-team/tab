import React from 'react'
import { browserHistory, Router } from 'react-router'
import Routes from 'js/routes/Route'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import defaultThemeLegacy from 'js/theme/default'
import defaultTheme from 'js/theme/defaultV1'

const legacyMuiTheme = getMuiTheme(defaultThemeLegacy)
const muiTheme = createMuiTheme(defaultTheme)

// @material-ui-1-todo: remove legacy theme provider
const Root = () => (
  <MuiThemeProvider theme={muiTheme}>
    <V0MuiThemeProvider muiTheme={legacyMuiTheme}>
      <Router
        history={browserHistory}
        routes={Routes} />
    </V0MuiThemeProvider>
  </MuiThemeProvider>
)

export default Root
