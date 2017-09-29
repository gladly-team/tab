import React from 'react'
import UpdateVcMutation from 'mutations/UpdateVcMutation'
import PropTypes from 'prop-types'

class UpdateVcComponent extends React.Component {
  componentDidMount () {
    UpdateVcMutation.commit(
      this.props.relay.environment,
      this.props.user
    )
  }

  render () {
    return null
  }
}

UpdateVcComponent.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
}

export default UpdateVcComponent
