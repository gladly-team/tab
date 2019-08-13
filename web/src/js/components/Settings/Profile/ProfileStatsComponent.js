import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import ChartIcon from '@material-ui/icons/InsertChart'
import HeartBorderIcon from '@material-ui/icons/FavoriteBorder'
import Typography from '@material-ui/core/Typography'

import Stat from 'js/components/Settings/Profile/StatComponent'
import { goToInviteFriends, goToDonate } from 'js/navigation/navigation'
import { abbreviateNumber, commaFormatted } from 'js/utils/utils'

const spacingPx = 6

const styles = theme => ({
  messageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    marginBottom: 2 * spacingPx,
  },
  chartIcon: {
    marginRight: 8,
    color: theme.palette.action.active,
    minHeight: 24,
    minWidth: 24,
  },
  messageText: {
    color: theme.palette.action.active,
  },
  greetingText: {
    fontWeight: 500,
  },
  statsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: -spacingPx,
  },
  statExtraContentText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.action.active,
  },
  heartIcon: {
    marginLeft: 0,
    marginRight: 2,
    height: 16,
    width: 16,
    paddingBottom: 0,
  },
})

const ProfileStats = props => {
  const { classes, user } = props
  const now = moment().utc()
  const daysSinceJoined = now.diff(moment(user.joined), 'days')
  const dayWord = daysSinceJoined === 1 ? 'day' : 'days'
  const tabberWord = user.numUsersRecruited === 1 ? 'Tabber' : 'Tabbers'
  const heartsWord = user.vcDonatedAllTime === 1 ? 'Heart' : 'Hearts'
  const statStyle = {
    flex: 1,
    flexBasis: '20%',
    margin: spacingPx,
  }
  const greeting = user.username ? `Hi, ${user.username}!` : 'Hi!'
  return (
    <div>
      <Paper className={classes.messageContainer}>
        <ChartIcon className={classes.chartIcon} />
        <Typography variant={'body2'} className={classes.messageText}>
          <span className={classes.greetingText}>{greeting}</span>
          <span> Here's all your great work Tabbing, by the numbers.</span>
        </Typography>
      </Paper>
      <span className={classes.statsWrapper}>
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
            <Typography
              variant={'body2'}
              className={classes.statExtraContentText}
            >
              on {moment(user.maxTabsDay.date).format('LL')}
            </Typography>
          }
          style={statStyle}
        />
        <Stat
          stat={user.level}
          statText={'your level'}
          extraContent={
            <Typography
              variant={'body2'}
              className={classes.statExtraContentText}
            >
              <span>{user.heartsUntilNextLevel}</span>
              <HeartBorderIcon className={classes.heartIcon} />
              <span>until next level</span>
            </Typography>
          }
          style={statStyle}
        />
        <Stat
          stat={commaFormatted(user.numUsersRecruited)}
          statText={`${tabberWord} recruited`}
          style={statStyle}
          extraContent={
            <Button
              color={'primary'}
              variant={'contained'}
              onClick={goToInviteFriends}
              style={{ marginTop: 14 }}
            >
              Invite Friends
            </Button>
          }
        />
        <Stat
          stat={abbreviateNumber(user.vcDonatedAllTime, 1)}
          statText={`${heartsWord} donated`}
          style={statStyle}
          extraContent={
            <Button
              color={'primary'}
              variant={'contained'}
              onClick={goToDonate}
              style={{ marginTop: 14 }}
            >
              Donate Hearts
            </Button>
          }
        />
      </span>
    </div>
  )
}

ProfileStats.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string,
    heartsUntilNextLevel: PropTypes.number.isRequired,
    joined: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    maxTabsDay: PropTypes.shape({
      date: PropTypes.string.isRequired,
      numTabs: PropTypes.number.isRequired,
    }),
    numUsersRecruited: PropTypes.number.isRequired,
    tabs: PropTypes.number.isRequired,
    vcDonatedAllTime: PropTypes.number.isRequired,
  }).isRequired,
}

export default withStyles(styles)(ProfileStats)
