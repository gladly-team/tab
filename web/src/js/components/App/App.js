import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Cookies from 'js-cookie'
import defaultTheme from 'js/theme/defaultV1'
import defaultThemeLegacy from 'js/theme/default'
import withPageviewTracking from 'js/analytics/withPageviewTracking'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import FullPageLoader from 'js/components/General/FullPageLoader'
import DashboardView from 'js/components/Dashboard/DashboardView'
import tabFavicon from 'js/assets/logos/favicon.ico'
import { TAB_APP } from 'js/constants'
import { parseUrlSearchString, validateAppName } from 'js/utils/utils'

// import('tab-cmp').then(tabCMP => {
//   tabCMP.initializeCMP({ some: 'options' })
// })

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
  componentDidMount() {
    window.foo = Cookies

    // TCF v2
    // Can use this to modify the cookie on change.
    window.__tcfapi('addEventListener', 2, function(tcData, listenerSuccess) {
      if (listenerSuccess) {
        // "useractioncomplete" == "the UX was shown to the user and the
        // consent string was created or updated"
        // https://help.quantcast.com/hc/en-us/articles/360047078534-Choice-CMP2-CCPA-API-Index-TCF-v2-0-
        if (tcData.eventStatus === 'useractioncomplete') {
          console.log('===== TCF user modified =====', tcData)
          console.log(
            '===== euprivacy-v2 cookie =====',
            Cookies.get('euprivacy-v2')
          )
        }
      }
    })

    // CCPA
    // Use this to set default data
    if (typeof window.__uspapi === 'function') {
      window.__uspapi('uspPing', 1, function(obj, status) {
        if (
          status &&
          obj.mode.includes('USP') &&
          obj.jurisdiction.includes(obj.location.toUpperCase())
        ) {
          window.__uspapi('setUspDftData', 1, function(obj, status) {
            if (!status) {
              console.log('Error: USP string not updated!')
            }
            console.log('=====  Set default USP string. =====')
          })
        }
      })
    }
  }

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
