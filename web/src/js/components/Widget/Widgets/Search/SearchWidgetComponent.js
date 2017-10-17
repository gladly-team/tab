import React from 'react'
import PropTypes from 'prop-types'
import FadeInDashboardAnimation from 'general/FadeInDashboardAnimation'
import Search from './Search'

class SearchWidget extends React.Component {
  render () {
    return (
      <FadeInDashboardAnimation>
        <Search
          widget={this.props.widget}
          user={this.props.user} />
      </FadeInDashboardAnimation>
    )
  }
}

SearchWidget.propTypes = {
  widget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    data: PropTypes.string.isRequired,
    config: PropTypes.string.isRequired,
    settings: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
}

export default SearchWidget
