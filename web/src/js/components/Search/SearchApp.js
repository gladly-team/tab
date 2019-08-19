import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Redirect, Route, Switch } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import defaultSearchTheme from 'js/theme/searchTheme'
import FullPageLoader from 'js/components/General/FullPageLoader'
import SearchAuthRedirect from 'js/components/Search/SearchAuthRedirect'
import SearchPageComponent from 'js/components/Search/SearchPageComponent'
import SearchPostUninstallView from 'js/components/Search/SearchPostUninstallView'
import SearchRandomQueryView from 'js/components/Search/SearchRandomQueryView'
import { SEARCH_PROVIDER_BING, SEARCH_PROVIDER_YAHOO } from 'js/constants'
import searchFavicon from 'js/assets/logos/search-favicon.png'
import { SEARCH_APP } from 'js/constants'

const SearchSettingsPageComponent = lazy(() =>
  import('js/components/Search/Settings/SearchSettingsPageComponent')
)

const muiTheme = createMuiTheme(defaultSearchTheme)

class SearchApp extends React.Component {
  render() {
    const { location } = this.props
    return (
      <MuiThemeProvider theme={muiTheme}>
        <ErrorBoundary brand={SEARCH_APP}>
          <Helmet>
            <title>Search for a Cause</title>
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
                <Redirect from="*" to={{ ...location, pathname: '/search' }} />
              </Switch>
            </Suspense>
          </div>
        </ErrorBoundary>
      </MuiThemeProvider>
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
