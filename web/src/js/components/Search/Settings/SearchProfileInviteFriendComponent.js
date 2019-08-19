import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import InviteFriend from 'js/components/Settings/Profile/InviteFriendContainer'
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
    flex: 5,
    minWidth: 200,
    height: 220,
  },
  thankYouPaper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flex: 3,
    minWidth: 200,
    padding: 20,
    margin: spacingPx,
  },
  happyIcon: {
    height: 26,
    width: 26,
    marginRight: 8,
    color: theme.typography.h6.color,
  },
  thankYouHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.35em',
  },
  thankYouText: {
    color: theme.palette.action.active,
  },
})

// Note: we can start using the same ProfileInviteFriend component
// as Tab for a Cause when we make the content more similar.
const SearchProfileInviteFriend = props => {
  const { classes } = props

  // FIXME: invite URL
  return (
    <span className={classes.container}>
      <Paper elevation={1} className={classes.inviteFriendPaper}>
        <InviteFriend
          user={null}
          style={{
            width: '100%',
            maxWidth: 300,
          }}
        />
      </Paper>
      <Paper className={classes.thankYouPaper}>
        <div className={classes.thankYouHeader}>
          <HappyIcon className={classes.happyIcon} />
          <Typography variant={'h6'}>Thank you!</Typography>
        </div>
        <Typography variant={'body2'} className={classes.thankYouText}>
          You're one of the first people to use Search for a Cause, and we
          depend on people like you to get the word out.
        </Typography>
      </Paper>
    </span>
  )
}

SearchProfileInviteFriend.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SearchProfileInviteFriend)
