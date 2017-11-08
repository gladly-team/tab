import React from 'react'
import PropTypes from 'prop-types'
import SettingsChildWrapper from '../SettingsChildWrapperComponent'
import InviteFriend from './InviteFriendComponent'
import Stat from './StatComponent'
import { lighterTextColor } from 'theme/default'
import HappyIcon from 'material-ui/svg-icons/social/mood'
import { Paper } from 'material-ui'

class ProfileInviteFriend extends React.Component {
  render () {
    const { app, user } = this.props
    const tabberWord = user.numUsersRecruited === 1 ? 'Tabber' : 'Tabbers'
    const spacingPx = 6
    const statStyle = {
      margin: spacingPx,
      flex: 1,
      paddingTop: 40,
      paddingBottom: 40
    }
    return (
      <SettingsChildWrapper>
        <span
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            margin: -spacingPx
          }}
        >
          <InviteFriend
            username={user.username}
            style={{
              margin: spacingPx,
              flex: 2,
              flexBasis: '40%',
              minWidth: 200
            }}
          />
          <Stat
            stat={user.numUsersRecruited}
            statText={`${tabberWord} recruited`}
            style={statStyle}
          />
          <Stat
            stat={app.referralVcReward}
            statText={'extra Hearts when you recruit a new friend'}
            style={statStyle}
          />
          <Paper
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              flexBasis: '50%',
              minWidth: 200,
              padding: 20,
              color: lighterTextColor,
              margin: spacingPx
            }}
          >
            <HappyIcon
              style={{
                minHeight: 24,
                minWidth: 24,
                marginRight: 8,
                color: lighterTextColor
              }}
            />
            <p>
              Thank you! Every new Tabber raises more money for charity, and we
              depend on people like you to get the word out.
            </p>
          </Paper>
        </span>
      </SettingsChildWrapper>
    )
  }
}

ProfileInviteFriend.propTypes = {
  app: PropTypes.shape({
    referralVcReward: PropTypes.number.isRequired
  }),
  user: PropTypes.shape({
    numUsersRecruited: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired
  })
}

export default ProfileInviteFriend
