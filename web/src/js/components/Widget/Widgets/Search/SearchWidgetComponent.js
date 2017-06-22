import React from 'react'
import PropTypes from 'prop-types'
// import DefaultSearch from './DefaultSearch';
import CenteredSearch from './CenteredSearch'

class SearchWidget extends React.Component {
  render () {
    return (
      <CenteredSearch
        widget={this.props.widget}
        user={this.props.user} />
    )
  }
}

SearchWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default SearchWidget
