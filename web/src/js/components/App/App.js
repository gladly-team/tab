import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import defaultTheme from 'js/theme/defaultV1'
import defaultThemeLegacy from 'js/theme/default'
import withPageviewTracking from 'js/analytics/withPageviewTracking'
import ShopView from 'js/components/Shop/ShopView'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import FullPageLoader from 'js/components/General/FullPageLoader'
import DashboardView from 'js/components/Dashboard/DashboardView'
import tabFavicon from 'js/assets/logos/favicon.ico'
import { TAB_APP } from 'js/constants'
import { parseUrlSearchString, validateAppName } from 'js/utils/utils'
import initializeCMP from 'js/utils/initializeCMP'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import NotFoundPage from 'js/components/App/NotFoundPage'

// Delaying the CMP initialization avoids delaying any CMP
// responses needed for our ad partner bid requests.
// Our modified CMP API stubs are quick to respond, but the
// core CMP JS, which replaces the stubs and is out of our
// control, may be slower to respond.
// Note that because we delay CMP initialization by default,
// any pages that rely on other CMP methods, such as the
// account page, should initialize the CMP before calling
// those methods.
const initCMP = () => {
  initializeCMP()
}
setTimeout(initCMP, 1500)

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
const InternalDemosView = lazy(() => import('js/components/Demos/DemosPage'))

const muiTheme = createMuiTheme(defaultTheme)
const legacyMuiTheme = getMuiTheme(defaultThemeLegacy)

class App extends React.Component {
  render() {
    // Get the app for branding purposes (e.g. we use the auth flow for
    // multiple apps).
    const { location } = this.props
    const urlParams = parseUrlSearchString(location.search)
    const app = validateAppName(urlParams.app)

    const shouldShowDemosPage = process.env.REACT_APP_SHOW_DEMOS_PAGE === 'true'

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

                // Matches extension new tab page background color.
                backgroundColor: '#121212',
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
                  {shouldShowDemosPage ? (
                    <Route
                      exact
                      path="/newtab/demos/*"
                      component={InternalDemosView}
                    />
                  ) : null}
                  <Route exact path="/newtab/shop" component={ShopView} />
                  <Route path="*" component={NotFoundPage} />
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
