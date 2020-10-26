import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'
import Typography from '@material-ui/core/Typography'
import MoneyRaisedGeneric from 'js/components/MoneyRaised/MoneyRaisedGenericContainer'

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

const getCampaignContent = ({ app, currentDateString }) => {
  const defaultTitle = (
    <Typography variant="h6">A tab you'll want to keep open:</Typography>
  )
  const moneyRaisedDisplay = (
    <Typography variant="h2" align={'center'} gutterBottom>
      <MoneyRaisedGeneric app={app} />
    </Typography>
  )

  let title = defaultTitle
  let mainContent
  let addendumContent
  switch (currentDateString) {
    case '2020-10-29': {
      mainContent = (
        <div>
          {moneyRaisedDisplay}
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
      mainContent = (
        <div>
          {moneyRaisedDisplay}
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
      mainContent = (
        <div>
          {moneyRaisedDisplay}
          <Typography variant="body2">
            This is an entirely different day!
          </Typography>
        </div>
      )
      addendumContent = (
        <div>
          <Typography variant="body2">Some other things.</Typography>
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

const MillionRaisedCampaign = ({
  app,
  classes,
  currentDateString,
  onDismiss,
}) => {
  const { title, mainContent, addendumContent } = getCampaignContent({
    app,
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
  app: PropTypes.shape({}).isRequired,
  currentDateString: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
}
MillionRaisedCampaign.defaultProps = {
  onDismiss: () => {},
}

export default withStyles(styles, { withTheme: true })(MillionRaisedCampaign)
