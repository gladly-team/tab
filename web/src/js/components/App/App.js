import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import defaultTheme from 'js/theme/defaultV1'
import defaultThemeLegacy from 'js/theme/default'
import withPageviewTracking from 'js/analytics/withPageviewTracking'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import FullPageLoader from 'js/components/General/FullPageLoader'
import DashboardView from 'js/components/Dashboard/DashboardView'
import tabFavicon from 'js/assets/logos/favicon.ico'
import { TAB_APP } from 'js/constants'
import { parseUrlSearchString, validateAppName } from 'js/utils/utils'
import tabLogoWithText from 'js/assets/logos/logo-with-text.svg'
import logger from 'js/utils/logger'

// Disable the CMP in the test environment. It currently breaks
// acceptance tests.
if (process.env.REACT_APP_CMP_ENABLED === 'true') {
  import('tab-cmp').then(tabCMP => {
    tabCMP.initializeCMP({
      debug: true,
      displayPersistentConsentLink: false,
      onError: err => {
        logger.error(err)
      },
      primaryButtonColor: '#9d4ba3',
      publisherName: 'Tab for a Cause',
      publisherLogo: tabLogoWithText,
    })
  })
}

const AuthenticationView = lazy(() =>
  import('js/components/Authentication/AuthenticationView')
)
const TabSettingsPageComponent = lazy(() =>
  import('js/components/Settings/TabSettingsPageComponent')
)
const FirstTabView = lazy(() => import('js/components/Dashboard/FirstTabView'))
const PostUninstallView = lazy(() =>
  import('js/components/Dashboard/PostUninstallView')
)

const muiTheme = createMuiTheme(defaultTheme)
const legacyMuiTheme = getMuiTheme(defaultThemeLegacy)

class App extends React.Component {
  render() {
    // Get the app for branding purposes (e.g. we use the auth flow for
    // multiple apps).
    const { location } = this.props
    const urlParams = parseUrlSearchString(location.search)
    const app = validateAppName(urlParams.app)

    // @material-ui-1-todo: remove legacy theme provider
    return (
      <MuiThemeProvider theme={muiTheme}>
        <V0MuiThemeProvider muiTheme={legacyMuiTheme}>
          <ErrorBoundary brand={TAB_APP}>
            <Helmet
              titleTemplate={`%s - Tab for a Cause`}
              defaultTitle={'Tab for a Cause'}
            >
              <link rel="icon" href={tabFavicon} />
            </Helmet>
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                margin: 0,
                padding: 0,
                border: 'none',
              }}
            >
              <Suspense fallback={<FullPageLoader app={app} delay={350} />}>
                <Switch>
                  <Route exact path="/newtab/" component={DashboardView} />
                  <Route
                    path="/newtab/settings/"
                    component={TabSettingsPageComponent}
                  />
                  <Route
                    path="/newtab/account/"
                    component={TabSettingsPageComponent}
                  />
                  <Route
                    path="/newtab/profile/"
                    component={TabSettingsPageComponent}
                  />
                  <Route
                    exact
                    path="/newtab/first-tab/"
                    component={FirstTabView}
                  />
                  <Route
                    exact
                    path="/newtab/uninstalled/"
                    component={PostUninstallView}
                  />
                  <Route path="/newtab/auth/" component={AuthenticationView} />
                  <Redirect from="*" to="/newtab/" />
                </Switch>
              </Suspense>
            </div>
          </ErrorBoundary>
        </V0MuiThemeProvider>
      </MuiThemeProvider>
    )
  }
}

App.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
}

App.defaultProps = {}

export default withPageviewTracking(App)
