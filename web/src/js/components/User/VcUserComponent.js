import React, {Component} from 'react'
import PropTypes from 'prop-types'
import FadeInDashboardAnimation from 'general/FadeInDashboardAnimation'
import appTheme, {
  dashboardIconInactiveColor
} from 'theme/default'

class VcUser extends Component {
  render () {
    const { user } = this.props
    if (!user) {
      return null
    }

    const progressContainer = {
      display: 'flex',
      justifyContent: 'space-evenly'
    }

    const textStyle = {
      color: dashboardIconInactiveColor,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 'normal',
      fontFamily: appTheme.fontFamily,
      userSelect: 'none',
      cursor: 'default'
    }
    const heartsStyle = Object.assign({}, textStyle, {
      marginRight: 0
    })
    const levelStyle = Object.assign({}, textStyle)

    return (
      <FadeInDashboardAnimation>
        <div style={progressContainer}>
          <div style={heartsStyle}>{user.vcCurrent} <i className='fa fa-heart' /></div>
          <div style={levelStyle}>Level {user.level}</div>
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
