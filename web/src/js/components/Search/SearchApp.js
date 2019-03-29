import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import defaultSearchTheme from 'js/theme/searchTheme'
import SearchPageComponent from 'js/components/Search/SearchPageComponent'
import SearchPostUninstallView from 'js/components/Search/SearchPostUninstallView'
import SearchRandomQueryView from 'js/components/Search/SearchRandomQueryView'

const muiTheme = createMuiTheme(defaultSearchTheme)

class SearchApp extends React.Component {
  render() {
    const { location } = this.props
    return (
      <MuiThemeProvider theme={muiTheme}>
        <ErrorBoundary>
          <div>
            {/* Redirect all /search/* URLs to /search/ for now. */}
            <Switch>
              <Route exact path="/search" component={SearchPageComponent} />
              <Route
                exact
                path="/search/uninstalled/"
                component={SearchPostUninstallView}
              />
              <Route
                exact
                path="/search/random/"
                component={SearchRandomQueryView}
              />
              <Redirect from="*" to={{ ...location, pathname: '/search' }} />
            </Switch>
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
