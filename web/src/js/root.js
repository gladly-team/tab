import React from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { browserHistory } from 'js/navigation/navigation'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import defaultTheme from 'js/theme/defaultV1'
import BaseContainer from 'js/components/General/BaseContainer'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import { initializeFirebase } from 'js/authentication/firebaseConfig'
import logger from 'js/utils/logger'

// This is a hack to generate separate apps for the new tab
// page and search. We do this because create-react-app does
// not currently support more than one entry point. See:
// https://github.com/facebook/create-react-app/issues/1084#issuecomment-365495580
// Our goal is to use load only the necessary assets for the
// root new tab and search pages without downloading any
// critical JS asynchronously, while not switching away from
// CRA, ejecting from CRA, or dealing with the overhead of
// managing distinct codebases. In the future, it would be
// better for us to have a monorepo structure of some kind
// (see: https://github.com/facebook/create-react-app/issues/1492),
// use the built-in multiple entry points (if CRA supports
// it down the line), or switching to another framework.
var TheApp
var appPath
switch (process.env.REACT_APP_WHICH_APP) {
  case 'newtab': {
    TheApp = require('js/components/App/App').default
    appPath = '/newtab/'
    break
  }
  case 'search': {
    TheApp = require('js/components/Search/SearchView').default
    appPath = '/search/'
    break
  }
  default: {
    TheApp = require('js/components/App/App').default
    appPath = '/newtab/'
  }
}

const muiTheme = createMuiTheme(defaultTheme)

class Root extends React.Component {
  constructor(props) {
    super(props)

    // Initialize Firebase.
    try {
      initializeFirebase()
    } catch (e) {
      logger.error(e)
    }
  }

  componentDidMount() {
    // Measure time to interactive (TTI):
    // https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#time_to_interactive
    // https://github.com/GoogleChromeLabs/tti-polyfill
    try {
      if (process.env.REACT_APP_MEASURE_TIME_TO_INTERACTIVE === 'true') {
        import('tti-polyfill').then(ttiPolyfill => {
          ttiPolyfill.getFirstConsistentlyInteractive().then(tti => {
            console.log(`Time to interactive: ${tti}`)
          })
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    // TODO: Show 404 page
    return (
      <MuiThemeProvider theme={muiTheme}>
        <ErrorBoundary>
          <BaseContainer>
            <Router history={browserHistory}>
              <Switch>
                <Route path={appPath} component={TheApp} />
                <Redirect from="*" to={appPath} />
              </Switch>
            </Router>
          </BaseContainer>
        </ErrorBoundary>
      </MuiThemeProvider>
    )
  }
}

export default Root
