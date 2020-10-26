import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    pointerEvents: 'none',
  },
  paper: {
    position: 'relative',
    pointerEvents: 'all',
    minWidth: 400,
    width: '100%',
    margin: 0,
    padding: 0,
    background: '#FFF',
    border: 'none',
  },
  borderTop: {
    width: '100%',
    height: 3,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: theme.palette.secondary.main,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 2,
  },
  campaignContent: {
    padding: 12,
  },
  campaignAddendum: {
    background: '#f5f5f5', // darker: '#eeeeee'
    padding: 12,
  },
  mainTextContainer: {},
  title: {
    textAlign: 'center',
  },
  description: {
    margin: 14,
    textAlign: 'left',
  },
})

const getCampaignContent = ({ currentDateString }) => {
  let title
  let mainContent
  let addendumContent

  switch (currentDateString) {
    case '2020-10-29': {
      title = <Typography variant="h6">Some title here</Typography>
      mainContent = (
        <div>
          <Typography variant="body2">Some description here</Typography>
        </div>
      )
      addendumContent = (
        <div>
          <Typography variant="body2">Hi there!</Typography>
        </div>
      )
      break
    }
    case '2020-10-30': {
      title = <Typography variant="h6">Another title!</Typography>
      mainContent = (
        <div>
          <Typography variant="body2">Another description here</Typography>
        </div>
      )
      addendumContent = (
        <div>
          <Typography variant="body2">Hi there! :)</Typography>
        </div>
      )
      break
    }
    default: {
      title = <Typography variant="h6">Some title here</Typography>
      mainContent = (
        <div>
          <Typography variant="body2">Some description here</Typography>
        </div>
      )
      addendumContent = (
        <div>
          <Typography variant="body2">Hi there!</Typography>
        </div>
      )
    }
  }

  return {
    title,
    mainContent,
    addendumContent,
  }
}

const MillionRaisedCampaign = ({ classes, currentDateString, onDismiss }) => {
  const { title, mainContent, addendumContent } = getCampaignContent({
    currentDateString,
  })
  return (
    <div className={classes.root}>
      <Paper elevation={1} className={classes.paper}>
        <Paper elevation={1} className={classes.paper}>
          <div className={classes.borderTop} />
          <IconButton
            onClick={() => {
              setCampaignDismissTime()
              onDismiss()
            }}
            className={classes.closeButton}
          >
            <CloseIcon />
          </IconButton>
          <div className={classes.campaignContent}>
            <div className={classes.mainTextContainer}>
              <div className={classes.title}>{title}</div>
              <div>{mainContent}</div>
            </div>
          </div>
        </Paper>
        <div className={classes.campaignAddendum}>{addendumContent}</div>
      </Paper>
    </div>
  )
}

MillionRaisedCampaign.propTypes = {
  currentDateString: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
}
MillionRaisedCampaign.defaultProps = {
  onDismiss: () => {},
}

export default withStyles(styles, { withTheme: true })(MillionRaisedCampaign)
