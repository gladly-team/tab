import React, { Suspense, lazy } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import ttiPolyfill from 'tti-polyfill'
import { browserHistory } from 'js/navigation/navigation'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import defaultThemeLegacy from 'js/theme/default'
import defaultTheme from 'js/theme/defaultV1'
import BaseContainer from 'js/components/General/BaseContainer'
import FullPageLoader from 'js/components/General/FullPageLoader'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import { initializeFirebase } from 'js/authentication/firebaseConfig'
import logger from 'js/utils/logger'

const App = lazy(() => import('js/components/App/App'))
const SearchView = lazy(() => import('js/components/Search/SearchView'))

const legacyMuiTheme = getMuiTheme(defaultThemeLegacy)
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
        ttiPolyfill.getFirstConsistentlyInteractive().then(tti => {
          console.log(`Time to interactive: ${tti}`)
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    // @material-ui-1-todo: remove legacy theme provider
    // TODO: Show 404 page
    return (
      <ErrorBoundary>
        <MuiThemeProvider theme={muiTheme}>
          <V0MuiThemeProvider muiTheme={legacyMuiTheme}>
            <BaseContainer>
              <Router history={browserHistory}>
                <Suspense fallback={<FullPageLoader delay={350} />}>
                  <Switch>
                    <Route path="/newtab/" component={App} />
                    <Route path="/search/" component={SearchView} />
                    <Redirect from="*" to="/newtab/" />
                  </Switch>
                </Suspense>
              </Router>
            </BaseContainer>
          </V0MuiThemeProvider>
        </MuiThemeProvider>
      </ErrorBoundary>
    )
  }
}

export default Root
