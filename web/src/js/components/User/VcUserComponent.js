import React, {Component} from 'react'
import PropTypes from 'prop-types'
import FadeInDashboardAnimation from 'general/FadeInDashboardAnimation'
import appTheme from 'theme/default'

class VcUser extends Component {
  render () {
    const { user } = this.props
    if (!user) {
      return null
    }

    const progressContainer = {
      display: 'flex',
      justifyContent: 'flex-end'
    }

    const text = {
      color: 'white',
      textAlign: 'center',
      fontSize: '1em',
      fontWeight: 'normal',
      fontFamily: appTheme.fontFamily
    }

    return (
      <FadeInDashboardAnimation>
        <div style={progressContainer}>
          <div style={text}>{user.vcCurrent} <i className='fa fa-heart-o' /> Level {user.level}</div>
        </div>
      </FadeInDashboardAnimation>
    )
  }
}

VcUser.propTypes = {
  user: PropTypes.shape({
    vcCurrent: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired
  })
}

export default VcUser
