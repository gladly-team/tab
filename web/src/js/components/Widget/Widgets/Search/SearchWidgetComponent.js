import React from 'react'
import PropTypes from 'prop-types'
import FadeInDashboardAnimation from 'general/FadeInDashboardAnimation'
// import DefaultSearch from './DefaultSearch';
import CenteredSearch from './CenteredSearch'

class SearchWidget extends React.Component {
  render () {
    return (
      <FadeInDashboardAnimation>
        <CenteredSearch
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
