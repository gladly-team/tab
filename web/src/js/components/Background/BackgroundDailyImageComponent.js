import React from 'react'
import PropTypes from 'prop-types'
import SetBackgroundDailyImageMutation from 'mutations/SetBackgroundDailyImageMutation'

class BackgroundDailyImage extends React.Component {
  //
  componentDidMount () {
    if (this.props.updateOnMount) {
      SetBackgroundDailyImageMutation.commit(
        this.props.relay.environment,
        this.props.user,
        this.onSaveSuccess.bind(this),
        this.onSaveError.bind(this)
      )
    }
  }

  onSaveSuccess () {}

  onSaveError () {
    this.props.showError('Oops, we are having trouble saving your settings right now :(')
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
  updateOnMount: false,
  showError: PropTypes.func.isRequired
}

export default BackgroundDailyImage
