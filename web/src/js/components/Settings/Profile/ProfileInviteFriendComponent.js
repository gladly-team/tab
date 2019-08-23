import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { withStyles } from '@material-ui/core/styles'
import InviteFriend from 'js/components/Settings/Profile/InviteFriendContainer'
import Stat from 'js/components/Settings/Profile/StatComponent'
import HappyIcon from '@material-ui/icons/Mood'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const spacingPx = 6

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: -spacingPx,
  },
  inviteFriendPaper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    margin: spacingPx,
    flex: 2,
    flexBasis: '40%',
    minWidth: 200,
  },
  thankYouPaper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexBasis: '50%',
    minWidth: 200,
    padding: 20,
    margin: spacingPx,
  },
  happyIcon: {
    height: 20,
    width: 20,
    marginRight: 8,
    color: theme.palette.action.active,
  },
  thankYouText: {
    color: theme.palette.action.active,
  },
})

const ProfileInviteFriend = props => {
  const { app, classes, user } = props
  const friendWord = user.numUsersRecruited === 1 ? 'friend' : 'friends'
  const statStyle = {
    margin: spacingPx,
    flex: 1,
    paddingTop: 40,
    paddingBottom: 40,
  }
  return (
    <span className={classes.container}>
      <Helmet>
        <title>Invite Friends</title>
      </Helmet>
      <Paper elevation={1} className={classes.inviteFriendPaper}>
        <InviteFriend
          user={user}
          style={{
            width: '100%',
            maxWidth: 300,
          }}
        />
      </Paper>
      <Stat
        stat={user.numUsersRecruited}
        statText={`${friendWord} recruited`}
        style={statStyle}
      />
      <Stat
        stat={app.referralVcReward}
        statText={'extra Hearts when you recruit a new friend'}
        style={statStyle}
      />
      <Paper elevation={1} className={classes.thankYouPaper}>
        <HappyIcon className={classes.happyIcon} />
        <Typography variant={'body2'} className={classes.thankYouText}>
          Thank you! Every new person raises more money for charity, and we
          depend on people like you to get the word out.
        </Typography>
      </Paper>
    </span>
  )
}

ProfileInviteFriend.propTypes = {
  app: PropTypes.shape({
    referralVcReward: PropTypes.number.isRequired,
  }),
  classes: PropTypes.object.isRequired,
  user: PropTypes.shape({
    numUsersRecruited: PropTypes.number.isRequired,
  }),
}

export default withStyles(styles)(ProfileInviteFriend)
