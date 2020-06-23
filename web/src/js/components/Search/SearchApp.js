import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Redirect, Route, Switch } from 'react-router-dom'
import {
  MuiThemeProvider,
  createMuiTheme,
  jssPreset,
} from '@material-ui/core/styles'
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import defaultSearchTheme from 'js/theme/searchTheme'
import FullPageLoader from 'js/components/General/FullPageLoader'
import SearchAuthRedirect from 'js/components/Search/SearchAuthRedirect'
import SearchPageComponent from 'js/components/Search/SearchPageComponent'
import SearchPostUninstallView from 'js/components/Search/SearchPostUninstallView'
import SearchRandomQueryView from 'js/components/Search/SearchRandomQueryView'
import {
  SEARCH_PROVIDER_BING,
  SEARCH_PROVIDER_CODEFUEL,
  SEARCH_PROVIDER_YAHOO,
} from 'js/constants'
import searchFavicon from 'js/assets/logos/search-favicon.png'
import { SEARCH_APP } from 'js/constants'

const SearchSettingsPageComponent = lazy(() =>
  import('js/components/Search/Settings/SearchSettingsPageComponent')
)
const FirstSearchView = lazy(() =>
  import('js/components/Search/FirstSearchView')
)

const muiTheme = createMuiTheme(defaultSearchTheme)

// Use random class names in JSS. See:
// https://github.com/stereobooster/react-snap/issues/99#issue-286236612
// The search results page is rendered into HTML at build time
// using react-snap, and we have to avoid mismatched JSS
// class names.
// Another approach is to remove the server-rendered styles:
// https://github.com/stereobooster/react-snap/issues/99#issuecomment-355663842
// https://material-ui.com/guides/server-rendering/#the-client-side
// In Material UI v4, we can probably remove the jss and react-jss
// dependencies:
// https://material-ui.com/styles/api/#stylesprovider
const createGenerateClassName = () => {
  let counter = 0
  return (rule, sheet) =>
    `c${Math.random()
      .toString(36)
      .substring(2, 4) +
      Math.random()
        .toString(36)
        .substring(2, 4)}-${rule.key}-${counter++}`
}

const jss = create(jssPreset())
jss.options.createGenerateClassName = createGenerateClassName

class SearchApp extends React.Component {
  render() {
    const { location } = this.props
    return (
      <JssProvider jss={jss}>
        <MuiThemeProvider theme={muiTheme}>
          <ErrorBoundary brand={SEARCH_APP}>
            <Helmet
              titleTemplate={`%s - Search for a Cause`}
              defaultTitle={'Search for a Cause'}
            >
              <link rel="icon" href={searchFavicon} />
            </Helmet>
            <div>
              <Suspense
                fallback={<FullPageLoader app={SEARCH_APP} delay={350} />}
              >
                <Switch>
                  <Route exact path="/search" component={SearchPageComponent} />
                  <Route
                    exact
                    path="/search/bing"
                    render={props => (
                      <SearchPageComponent
                        {...props}
                        searchProvider={SEARCH_PROVIDER_BING}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/search/codefuel"
                    render={props => (
                      <SearchPageComponent
                        {...props}
                        searchProvider={SEARCH_PROVIDER_CODEFUEL}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/search/yahoo"
                    render={props => (
                      <SearchPageComponent
                        {...props}
                        searchProvider={SEARCH_PROVIDER_YAHOO}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/search/uninstalled/"
                    component={SearchPostUninstallView}
                  />
                  <Route
                    exact
                    path="/search/first-search/"
                    component={FirstSearchView}
                  />
                  <Route
                    exact
                    path="/search/auth/"
                    component={SearchAuthRedirect}
                  />
                  <Route
                    exact
                    path="/search/random/"
                    component={SearchRandomQueryView}
                  />
                  <Route
                    path="/search/account/"
                    component={SearchSettingsPageComponent}
                  />
                  <Route
                    path="/search/profile/"
                    component={SearchSettingsPageComponent}
                  />
                  <Redirect
                    from="*"
                    to={{ ...location, pathname: '/search' }}
                  />
                </Switch>
              </Suspense>
            </div>
          </ErrorBoundary>
        </MuiThemeProvider>
      </JssProvider>
    )
  }
}

SearchApp.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
}

SearchApp.defaultProps = {}

export default SearchApp
