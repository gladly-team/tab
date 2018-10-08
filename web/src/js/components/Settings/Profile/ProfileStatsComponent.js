import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import RaisedButton from 'material-ui/RaisedButton'
import HeartBorderIcon from 'material-ui/svg-icons/action/favorite-border'
import Stat from './StatComponent'
import { Paper } from 'material-ui'
import appTheme, {
  lighterTextColor
} from 'js/theme/default'
import ChartIcon from 'material-ui/svg-icons/editor/insert-chart'
import {
  goToInviteFriends,
  goToDonate
} from 'js/navigation/navigation'
import { abbreviateNumber, commaFormatted } from 'js/utils/utils'

class ProfileStats extends React.Component {
  render () {
    const { user } = this.props
    const now = moment().utc()
    const daysSinceJoined = now.diff(moment(user.joined), 'days')
    const dayWord = daysSinceJoined === 1 ? 'day' : 'days'
    const tabberWord = user.numUsersRecruited === 1 ? 'Tabber' : 'Tabbers'
    const heartsWord = user.vcDonatedAllTime === 1 ? 'Heart' : 'Hearts'
    const extraContentTextStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: appTheme.palette.disabledColor
    }
    const spacingPx = 6
    const statStyle = {
      flex: 1,
      flexBasis: '20%',
      margin: spacingPx
    }
    const greeting = user.username ? `Hi, ${user.username}!` : 'Hi!'
    return (
      <div>
        <Paper
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 2 * spacingPx,
            color: lighterTextColor
          }}
        >
          <ChartIcon
            style={{
              marginRight: 8,
              color: lighterTextColor,
              minHeight: 24,
              minWidth: 24
            }}
          />
          <p>
            <span style={{fontWeight: 500}}>{greeting}</span>
            <span> Here's all your great work Tabbing, by the numbers.</span>
          </p>
        </Paper>
        <span
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            margin: -spacingPx
          }}
        >
          <Stat
            stat={commaFormatted(daysSinceJoined)}
            statText={`${dayWord} as a Tabber`}
            style={statStyle}
          />
          <Stat
            stat={abbreviateNumber(user.tabs, 1)}
            statText={'tabs all time'}
            style={statStyle}
          />
          <Stat
            stat={commaFormatted(user.maxTabsDay.numTabs)}
            statText={'max tabs in one day'}
            extraContent={
              <span style={extraContentTextStyle}>
                on {moment(user.maxTabsDay.date).format('LL')}
              </span>
            }
            style={statStyle}
          />
          <Stat
            stat={user.level}
            statText={'your level'}
            extraContent={
              <span style={extraContentTextStyle}>
                <span>{user.heartsUntilNextLevel}</span>
                <HeartBorderIcon
                  style={{ marginLeft: 0, marginRight: 2, height: 16, width: 16, paddingBottom: 0 }}
                  color={appTheme.palette.disabledColor}
                />
                <span>until next level</span>
              </span>
            }
            style={statStyle}
          />
          <Stat
            stat={commaFormatted(user.numUsersRecruited)}
            statText={`${tabberWord} recruited`}
            style={statStyle}
            extraContent={
              <RaisedButton
                label='Invite Friends'
                style={{ marginTop: 14 }}
                primary
                onClick={goToInviteFriends}
              />
            }
          />
          <Stat
            stat={abbreviateNumber(user.vcDonatedAllTime, 1)}
            statText={`${heartsWord} donated`}
            style={statStyle}
            extraContent={
              <RaisedButton
                label='Donate Hearts'
                style={{ marginTop: 14 }}
                primary
                onClick={goToDonate}
              />
            }
          />
        </span>
      </div>
    )
  }
}

ProfileStats.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string,
    heartsUntilNextLevel: PropTypes.number.isRequired,
    joined: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    maxTabsDay: PropTypes.shape({
      date: PropTypes.string.isRequired,
      numTabs: PropTypes.number.isRequired
    }),
    numUsersRecruited: PropTypes.number.isRequired,
    tabs: PropTypes.number.isRequired,
    vcDonatedAllTime: PropTypes.number.isRequired
  }).isRequired
}

export default ProfileStats
