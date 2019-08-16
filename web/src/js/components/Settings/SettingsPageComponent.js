import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'

import ErrorMessage from 'js/components/General/ErrorMessage'
import Logo from 'js/components/Logo/Logo'

const sidebarWidth = 240
const styles = theme => ({
  container: {
    color: '#fff',
    backgroundColor: '#F2F2F2',
    minWidth: '100vw',
    minHeight: '100vh',
  },
  closeIcon: {
    color: '#fff',
    width: 28,
    height: 28,
  },
  sidebarContentContainer: {
    width: sidebarWidth,
    position: 'fixed',
  },
  mainContentContainer: {
    marginLeft: sidebarWidth,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
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
      <AppBar color={'primary'} position={'sticky'}>
        <Toolbar>
          <div style={{ flex: 1 }}>
            <Logo color={'white'} />
          </div>
          <IconButton onClick={onClose}>
            <CloseIcon className={classes.closeIcon} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.sidebarContentContainer}>
        {sidebarContent({ showError })}
      </div>
      <div className={classes.mainContentContainer}>
        {mainContent({ showError })}
      </div>
      <ErrorMessage
        message={errorMessage}
        onClose={clearError}
        open={isErrorOpen}
      />
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
