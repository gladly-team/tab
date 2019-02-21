import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import CircleIcon from '@material-ui/icons/Lens'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import Hearts from 'js/components/Dashboard/HeartsContainer'
import SettingsButton from 'js/components/Dashboard/SettingsButtonComponent'

const fontColor = 'rgba(255, 255, 255, 0.8)'
const styles = {
  circleIcon: {
    color: fontColor,
    alignSelf: 'center',
    width: 5,
    height: 5,
    marginTop: 2,
    marginLeft: 12,
    marginRight: 12,
  },
}

class UserMenu extends React.Component {
  render() {
    const { app, classes, user, isUserAnonymous } = this.props
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <MoneyRaised app={app} />
        <CircleIcon className={classes.circleIcon} />
        <Hearts app={app} user={user} />
        <SettingsButton isUserAnonymous={isUserAnonymous} />
      </div>
    )
  }
}

UserMenu.propTypes = {
  app: PropTypes.shape({}).isRequired,
  classes: PropTypes.object.isRequired,
  isUserAnonymous: PropTypes.bool,
  user: PropTypes.shape({}).isRequired,
}

UserMenu.defaultProps = {
  isUserAnonymous: false,
}

export default withStyles(styles)(UserMenu)
