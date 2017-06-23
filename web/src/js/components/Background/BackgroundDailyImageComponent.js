import React from 'react'
import PropTypes from 'prop-types'
import SetBackgroundDailyImageMutation from 'mutations/SetBackgroundDailyImageMutation'

class BackgroundDailyImage extends React.Component {
  componentDidMount () {
    if (this.props.updateOnMount) {
      SetBackgroundDailyImageMutation.commit(
        this.props.relay.environment,
        this.props.user
      )
    }
  }

  render () {
    return null
  }
}

BackgroundDailyImage.propTypes = {
  user: PropTypes.object.isRequired,
  updateOnMount: PropTypes.bool
}

BackgroundDailyImage.defaultProps = {
  updateOnMount: false
}

export default BackgroundDailyImage
