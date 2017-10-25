import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import RaisedButton from 'material-ui/RaisedButton'
import { GridList } from 'material-ui/GridList'
import Stat from './StatComponent'
import SettingsChildWrapper from '../SettingsChildWrapperComponent'
import appTheme from 'theme/default'
import {
  goToInviteFriends,
  goToDonate
} from 'navigation/navigation'

class ProfileStats extends React.Component {
  render () {
    const { user } = this.props
    const now = moment().utc()
    const daysSinceJoined = now.diff(moment(user.joined), 'days')
    const dayWord = daysSinceJoined === 1 ? 'day' : 'days'
    const tabberWord = user.numUsersRecruited === 1 ? 'Tabber' : 'Tabbers'
    const heartsWord = user.vcDonatedAllTime === 1 ? 'Heart' : 'Hearts'
    const extraContentTextStyle = {
      display: 'block',
      color: appTheme.palette.disabledColor
    }
    const gridPadding = 12
    const secondRowStatStyle = {
      height: 240,
      paddingBottom: 50,
      marginTop: 6
    }
    return (
      <SettingsChildWrapper>
        <GridList
          cols={4}
          padding={gridPadding}
          cellHeight={'auto'}
        >
          <Stat
            stat={daysSinceJoined}
            statText={`${dayWord} as a Tabber`}
          />
          <Stat
            stat={user.tabs}
            statText={'tabs all time'}
          />
          <Stat
            stat={user.maxTabsDay.numTabs}
            statText={'max tabs in one day'}
            extraContent={
              <span style={extraContentTextStyle}>
                on {moment(user.maxTabsDay.date).format('LL')}
              </span>
            }
          />
          <Stat
            stat={user.level}
            statText={'your level'}
            extraContent={
              <span style={extraContentTextStyle}>
                {user.heartsUntilNextLevel}<i style={{ marginLeft: 2 }} className='fa fa-heart-o' /> until next level
              </span>
            }
          />
        </GridList>
        <GridList
          cols={2}
          padding={gridPadding}
          cellHeight={'auto'}
        >
          <Stat
            stat={user.numUsersRecruited}
            statText={`${tabberWord} recruited`}
            style={secondRowStatStyle}
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
            stat={user.vcDonatedAllTime}
            statText={`${heartsWord} donated`}
            style={secondRowStatStyle}
            extraContent={
              <RaisedButton
                label='Donate Hearts'
                style={{ marginTop: 14 }}
                primary
                onClick={goToDonate}
              />
            }
          />
        </GridList>
      </SettingsChildWrapper>
    )
  }
}

ProfileStats.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
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
