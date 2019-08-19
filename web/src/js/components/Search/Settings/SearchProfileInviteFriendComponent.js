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

// Note: we can start using the same ProfileInviteFriend component
// as Tab for a Cause when we make the content more similar.
const SearchProfileInviteFriend = props => {
  const { classes } = props
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
        <HappyIcon className={classes.happyIcon} />
        <Typography variant={'body2'} className={classes.thankYouText}>
          Thank you! Every new person raises more money for charity, and we
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
