import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'

// import { jobsURL } from 'js/navigation/navigation'
// import Paper from '@material-ui/core/Paper'
// import Typography from '@material-ui/core/Typography'
// import Link from 'js/components/General/Link'

import ErrorMessage from 'js/components/General/ErrorMessage'
import Logo from 'js/components/Logo/Logo'
import Footer from 'js/components/General/Footer'

const sidebarWidth = 240
const styles = theme => ({
  container: {
    color: '#fff',
    backgroundColor: '#F2F2F2',
    minWidth: '100vw',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  closeIcon: {
    color: '#fff',
    width: 28,
    height: 28,
  },
  pageContentContainer: {
    display: 'flex',
  },
  sidebarContentContainer: {
    width: sidebarWidth,
    position: 'fixed',
  },
  mainContentContainer: {
    marginLeft: sidebarWidth,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  messageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '14px 18px',
    margin: 20,
    marginBottom: 0,
  },
  messageText: {
    color: theme.palette.action.active,
  },
  infoIcon: {
    marginRight: 8,
    color: theme.palette.action.active,
    minHeight: 24,
    minWidth: 24,
  },
  link: {
    color: theme.palette.primary.main,
  },
})

const SettingsPage = props => {
  const { classes, mainContent, onClose, sidebarContent } = props
  const [errorMessage, setErrorMessage] = useState(null)
  const [isErrorOpen, setIsErrorOpen] = useState(false)
  const showError = msg => {
    setIsErrorOpen(true)
    setErrorMessage(msg)
  }
  const clearError = () => {
    setIsErrorOpen(false)
  }

  return (
    <div className={classes.container}>
      <AppBar color="primary" position="sticky">
        <Toolbar>
          <div style={{ flex: 1 }}>
            <Logo color="white" />
          </div>
          <IconButton onClick={onClose}>
            <CloseIcon className={classes.closeIcon} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.pageContentContainer}>
        <div className={classes.sidebarContentContainer}>
          {sidebarContent({ showError })}
        </div>
        <div className={classes.mainContentContainer}>
          {/* Optional message for users, such as job postings. */}

          {/* <Paper elevation={1} className={classes.messageContainer}> */}
          {/*   <Typography variant="body2" className={classes.messageText}> */}
          {/*     We're hiring for a paid social media internship position!{' '} */}
          {/*     <Link */}
          {/*       to={jobsURL} */}
          {/*       className={classes.link} */}
          {/*       target="_blank" */}
          {/*       rel="noopener noreferrer" */}
          {/*     > */}
          {/*       More info here. */}
          {/*     </Link> */}
          {/*   </Typography> */}
          {/* </Paper> */}
          {mainContent({ showError })}
        </div>
      </div>
      <ErrorMessage
        message={errorMessage}
        onClose={clearError}
        open={isErrorOpen}
      />
      <Footer style={{ marginTop: 'auto' }} />
    </div>
  )
}

SettingsPage.propTypes = {
  mainContent: PropTypes.func.isRequired,
  sidebarContent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SettingsPage)
