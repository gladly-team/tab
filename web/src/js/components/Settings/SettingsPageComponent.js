import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'

import ErrorMessage from 'js/components/General/ErrorMessage'
import Logo from 'js/components/Logo/Logo'
import { goToDashboard } from 'js/navigation/navigation'

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

class SettingsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorOpen: false,
      errorMessage: null,
    }
  }

  goToHome() {
    goToDashboard()
  }

  showError(msg) {
    this.setState({
      errorOpen: true,
      errorMessage: msg,
    })
  }

  clearError() {
    this.setState({
      errorOpen: false,
    })
  }

  render() {
    const { classes, mainContent, sidebarContent } = this.props
    const { errorMessage, errorOpen } = this.state

    // TODO: maybe pass via render props
    // const showError = this.showError

    return (
      <div className={classes.container}>
        <AppBar color={'primary'} position={'sticky'}>
          <Toolbar>
            <div style={{ flex: 1 }}>
              <Logo color={'white'} />
            </div>
            <IconButton onClick={this.goToHome.bind(this)}>
              <CloseIcon className={classes.closeIcon} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.sidebarContentContainer}>{sidebarContent}</div>
        <div className={classes.mainContentContainer}>{mainContent}</div>
        <ErrorMessage
          message={errorMessage}
          onClose={this.clearError.bind(this)}
          open={errorOpen}
        />
      </div>
    )
  }
}

SettingsPage.propTypes = {
  mainContent: PropTypes.node.isRequired,
  sidebarContent: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SettingsPage)
