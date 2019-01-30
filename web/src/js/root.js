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
import ttiPolyfill from 'tti-polyfill'

const legacyMuiTheme = getMuiTheme(defaultThemeLegacy)
const muiTheme = createMuiTheme(defaultTheme)

class Root extends React.Component {
  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      ttiPolyfill.getFirstConsistentlyInteractive().then(tti => {
        console.log(`Time to interactive: ${tti}`)
      })
    }
  }

  render() {
    // @material-ui-1-todo: remove legacy theme provider
    return (
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
  }
}

export default Root
