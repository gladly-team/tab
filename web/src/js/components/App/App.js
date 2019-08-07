import React, { Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import defaultTheme from 'js/theme/defaultV1'
import defaultThemeLegacy from 'js/theme/default'
import withPageviewTracking from 'js/analytics/withPageviewTracking'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import { isInEuropeanUnion } from 'js/utils/client-location'
import {
  registerConsentCallback,
  saveConsentUpdateEventToLocalStorage,
  unregisterConsentCallback,
} from 'js/ads/consentManagement'
import FullPageLoader from 'js/components/General/FullPageLoader'
import DashboardView from 'js/components/Dashboard/DashboardView'
import QuantcastChoiceCMP from 'js/components/General/QuantcastChoiceCMP'
import tabFavicon from 'js/assets/logos/favicon.ico'

const AuthenticationView = lazy(() =>
  import('js/components/Authentication/AuthenticationView')
)
const SettingsPageComponent = lazy(() =>
  import('js/components/Settings/SettingsPageComponent')
)
const FirstTabView = lazy(() => import('js/components/Dashboard/FirstTabView'))
const PostUninstallView = lazy(() =>
  import('js/components/Dashboard/PostUninstallView')
)

const muiTheme = createMuiTheme(defaultTheme)
const legacyMuiTheme = getMuiTheme(defaultThemeLegacy)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.consentChangeCallback = null
  }

  async componentDidMount() {
    var isEU
    try {
      isEU = await isInEuropeanUnion()
    } catch (e) {
      isEU = false
    }
    if (isEU) {
      this.consentChangeCallback = this.handleDataConsentDecision.bind(this)
      registerConsentCallback(this.consentChangeCallback)
    }
  }

  componentWillUnmount() {
    if (this.consentChangeCallback) {
      unregisterConsentCallback(this.consentChangeCallback)
    }
  }

  async handleDataConsentDecision() {
    // Store the consent data. We'll log it to the server with
    // the user's ID after the user authenticates.
    saveConsentUpdateEventToLocalStorage()
  }

  render() {
    // TODO: pass location to FullPageLoader
    // const { location } = this.props

    // @material-ui-1-todo: remove legacy theme provider
    return (
      <MuiThemeProvider theme={muiTheme}>
        <V0MuiThemeProvider muiTheme={legacyMuiTheme}>
          <ErrorBoundary brand={'tab'}>
            <Helmet>
              <title>Tab for a Cause</title>
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
              <Suspense fallback={<FullPageLoader delay={350} />}>
                <Switch>
                  <Route exact path="/newtab/" component={DashboardView} />
                  <Route
                    path="/newtab/settings/"
                    component={SettingsPageComponent}
                  />
                  <Route
                    path="/newtab/account/"
                    component={SettingsPageComponent}
                  />
                  <Route
                    path="/newtab/profile/"
                    component={SettingsPageComponent}
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
              <ErrorBoundary ignoreErrors brand={'tab'}>
                <QuantcastChoiceCMP />
              </ErrorBoundary>
            </div>
          </ErrorBoundary>
        </V0MuiThemeProvider>
      </MuiThemeProvider>
    )
  }
}

export default withPageviewTracking(App)
