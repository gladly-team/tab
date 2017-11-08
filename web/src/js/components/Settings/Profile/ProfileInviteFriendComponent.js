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
    const { user } = this.props
    const tabberWord = user.numUsersRecruited === 1 ? 'Tabber' : 'Tabbers'
    const spacingPx = 6
    return (
      <SettingsChildWrapper>
        <span
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            marginLeft: -spacingPx,
            marginTop: -spacingPx
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
            style={{
              margin: spacingPx,
              flex: 1
            }}
          />
          <Stat
            stat={350}
            statText={'extra Hearts when you recruit a new friend'}
            style={{
              margin: spacingPx,
              flex: 1
            }}
          />
          <Paper
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              flexBasis: '40%',
              minWidth: 200,
              padding: 10,
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
              Thank you! Every new Tabber increases our charitable impact, and we
              depend on people like you to get the word out.
            </p>
          </Paper>
        </span>
      </SettingsChildWrapper>
    )
  }
}

ProfileInviteFriend.propTypes = {
  user: PropTypes.shape({
    numUsersRecruited: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired
  })
}

export default ProfileInviteFriend
