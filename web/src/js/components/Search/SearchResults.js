import React from 'react'
import PropTypes from 'prop-types'

class SearchResults extends React.PureComponent {
  render () {
    const { query } = this.props
    if (!query) {
      return null
    }
    return (
      <div
        data-test-id='search-results-container'
        style={{
          background: 'none',
          marginLeft: 170,
          maxWidth: 600,
          paddingTop: 20
        }}
      >
        <span>TODO!</span>
      </div>
    )
  }
}

SearchResults.propTypes = {
  query: PropTypes.string
}

SearchResults.defaultProps = {}

export default SearchResults
