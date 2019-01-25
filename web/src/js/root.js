import React from 'react'
import { Router } from 'react-router-dom'
import { browserHistory } from 'js/navigation/navigation'
import Routes from 'js/routes/Route'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import defaultThemeLegacy from 'js/theme/default'
import defaultTheme from 'js/theme/defaultV1'
import BaseContainer from 'js/components/General/BaseContainer'

const legacyMuiTheme = getMuiTheme(defaultThemeLegacy)
const muiTheme = createMuiTheme(defaultTheme)

// @material-ui-1-todo: remove legacy theme provider
const Root = () => (
  <MuiThemeProvider theme={muiTheme}>
    <V0MuiThemeProvider muiTheme={legacyMuiTheme}>
      <BaseContainer>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </BaseContainer>
    </V0MuiThemeProvider>
  </MuiThemeProvider>
)

export default Root
