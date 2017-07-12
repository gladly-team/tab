import React from 'react'
import UpdateVcMutation from 'mutations/UpdateVcMutation'
import PropTypes from 'prop-types'

class App extends React.Component {
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

App.propTypes = {
  user: PropTypes.object.isRequired
}

export default App
