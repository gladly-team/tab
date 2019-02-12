import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import SearchView from 'js/components/Search/SearchView'

class SearchApp extends React.Component {
  render() {
    const { location } = this.props
    return (
      <div>
        {/* Redirect all /search/* URLs to /search/ for now. */}
        <Switch>
          <Route exact path="/search" component={SearchView} />
          <Redirect from="*" to={{ ...location, pathname: '/search' }} />
        </Switch>
      </div>
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
