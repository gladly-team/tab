import React from 'react'
import PropTypes from 'prop-types'
import { assignUserToTestGroups } from 'js/utils/experiments'

class AssignExperimentGroups extends React.Component {
  componentDidMount () {
    const { user } = this.props

    // Assign the user to experiment groups. We do this every
    // page load because the user may have become eligble for
    // an experimeng (e.g. by having joined X days ago) or we
    // may have added new experiments.
    assignUserToTestGroups({
      joined: user.joined,
      isNewUser: false
    })
  }

  render () {
    return null
  }
}

AssignExperimentGroups.propTypes = {
  user: PropTypes.shape({
    joined: PropTypes.string.isRequired
  }).isRequired
}

export default AssignExperimentGroups
