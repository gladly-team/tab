import React from 'react'
import PropTypes from 'prop-types'
import InviteFriend from './InviteFriendContainer'
import Stat from './StatComponent'
import { lighterTextColor } from 'js/theme/default'
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
      <span
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: -spacingPx
        }}
      >
        <Paper style={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'middle',
          padding: 10,
          margin: spacingPx,
          flex: 2,
          flexBasis: '40%',
          minWidth: 200
        }}>
          <span
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'middle',
              width: '100%',
              maxWidth: 300,
              marginTop: 30,
              marginBottom: 30,
              marginLeft: 8,
              marginRight: 8,
              boxSizing: 'border-box'
            }}
          >
            <InviteFriend
              user={user}
            />
          </span>
        </Paper>
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
    )
  }
}

ProfileInviteFriend.propTypes = {
  app: PropTypes.shape({
    referralVcReward: PropTypes.number.isRequired
  }),
  user: PropTypes.shape({
    numUsersRecruited: PropTypes.number.isRequired
  })
}

export default ProfileInviteFriend
